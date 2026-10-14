// Checks the detectors for violence, harming others and substances. Run from the project folder:
//   node tests/topic-detect.test.mjs
// Add a line here whenever a phrase is missed or a harmless message triggers a card.

import { loadModule } from "./load-module.mjs";

globalThis.navigator ??= { language: "en-US" };
const { violenceLanguage } = await loadModule("js/violence-detect.js");
const { harmOthersLanguage } = await loadModule("js/harm-others-detect.js");
const { substanceLanguage } = await loadModule("js/substance-detect.js");

const topics = {
  violence: {
    detect: violenceLanguage,
    shouldTrigger: [
      "My dad hits me when he's angry",
      "my boyfriend choked me last night",
      "I was raped at a party",
      "I'm afraid to go home",
      "my ex is stalking me",
      "he threatened to kill me",
      "Mein Mann schlägt mich",
      "Er hat mich vergewaltigt",
      "Ich habe Angst, nach Hause zu gehen",
      "Mon copain me frappe",
      "il m'a violée",
      "j'ai peur de rentrer chez moi",
      "Mio marito mi picchia",
      "mi ha violentata",
      "ho paura di tornare a casa",
    ],
    shouldNotTrigger: [
      "He hurt me when he left",
      "Her words really touched me",
      "My dad hit the jackpot",
      "We beat them at football",
      "Er schlägt vor, ins Kino zu gehen",
      "Il frappe à la porte",
      "Ho visto un film sulla violenza",
    ],
  },
  harmOthers: {
    detect: harmOthersLanguage,
    shouldTrigger: [
      "I want to kill him",
      "I keep having thoughts about hurting my baby",
      "I'm scared I might hurt someone",
      "I'm going to stab my brother",
      "Ich will ihn umbringen",
      "Ich habe Angst, dass ich mein Kind verletze",
      "j'ai envie de tuer quelqu'un",
      "je vais le tuer",
      "voglio ucciderlo",
      "ho paura di fare del male a mio figlio",
    ],
    shouldNotTrigger: [
      "This exam is killing me",
      "I could kill him for eating my cake",
      "I want to kill this workout tomorrow",
      "That joke killed me",
      "Ich will morgen früh joggen",
      "Je vais le voir demain",
      "Voglio uccidere la noia",
    ],
  },
  substances: {
    detect: substanceLanguage,
    shouldTrigger: [
      "I think I'm addicted to alcohol",
      "I can't stop drinking",
      "I drink every night alone",
      "Is it safe to mix xanax with alcohol?",
      "my friend took too many pills and won't wake up",
      "I relapsed on cocaine",
      "Ich bin süchtig nach Tabletten",
      "Ich trinke jeden Abend",
      "Er hat zu viel getrunken und wacht nicht auf",
      "je bois trop",
      "je suis accro à la cocaïne",
      "elle ne se réveille pas",
      "bevo troppo",
      "non riesco a smettere di bere",
      "ho preso troppo",
    ],
    shouldNotTrigger: [
      "A glass of wine with dinner sounds nice",
      "I'm addicted to this show, haha",
      "I need to weed the garden",
      "I made a bank withdrawal",
      "Can you help me mix a cake batter?",
      "Ich trinke gerne Tee",
      "Je bois un café",
      "Bevo un caffè",
    ],
  },
};

let failures = 0;
let caught = 0;
let calm = 0;
for (const [name, topic] of Object.entries(topics)) {
  for (const text of topic.shouldTrigger) {
    if (topic.detect(text)) caught++;
    else {
      failures++;
      console.log(`MISSED (${name})   ${text}`);
    }
  }
  for (const text of topic.shouldNotTrigger) {
    if (!topic.detect(text)) calm++;
    else {
      failures++;
      console.log(`FALSE ALARM (${name})   ${text}`);
    }
  }
}

console.log(failures ? `\n${failures} problem(s).` : `All ${caught} messages caught, no false alarms in ${calm} everyday ones.`);
process.exitCode = failures ? 1 : 0;
