// Checks js/eating-detect.js against example messages. Run from the project folder:
//   node tests/eating-detect.test.mjs
// Add a line here whenever a phrase is missed or a harmless message triggers the card.

import { loadModule } from "./load-module.mjs";

const { mayBeEatingConcern } = await loadModule("js/eating-detect.js");

const shouldTrigger = [
  // English
  "I think I have an eating disorder",
  "I've been anorexic since I was 15",
  "my bulimia is back",
  "I binge eat every night and then hate myself",
  "I've decided to stop eating dinner until I lose 10 kilos",
  "I'm not eating anything this week",
  "I haven't eaten in 3 days",
  "I'm starving myself and it feels good",
  "I make myself throw up after meals",
  "how many laxatives should I take to lose weight",
  "I only eat 500 calories a day",
  "I'm so fat, I hate my body",
  "I feel fat all the time",
  // German
  "Ich glaube, ich habe eine Essstörung",
  "Ich bin magersüchtig",
  "Ich will nichts mehr essen",
  "Ich esse fast nichts mehr",
  "Ich hatte wieder einen Essanfall",
  "Nach dem Essen übergebe ich mich",
  "Ich hungere mich seit Wochen",
  "Ich bin so fett",
  "Ich hasse meinen Körper",
  // French
  "Je crois que j'ai des troubles alimentaires",
  "je vais arrêter de manger",
  "je ne mange plus",
  "je me fais vomir après les repas",
  "Je suis trop grosse",
  "je déteste mon corps",
  "j'ai fait une crise de boulimie",
  // Italian
  "Penso di avere un disturbo alimentare",
  "voglio smettere di mangiare",
  "non mangio più da giorni",
  "mi faccio vomitare dopo cena",
  "ho avuto un'altra abbuffata",
  "mi sento troppo grassa",
  "odio il mio corpo",
  "soffro di anoressia",
];

const shouldNotTrigger = [
  "I stopped eating meat last year",
  "I want to stop eating sugar",
  "We stopped eating out to save money",
  "What should I eat for dinner?",
  "Help me plan a calm evening.",
  "My cat is so fat",
  "I'm eating a sandwich",
  "Ich esse kein Fleisch mehr",
  "Was soll ich heute kochen?",
  "Ich esse noch was, dann gehe ich",
  "Ich esse nichts Süsses",
  "j'ai arrêté de manger de la viande",
  "Je mange une pomme",
  "ho smesso di mangiare la carne",
  "Cosa mangio stasera?",
  "Breakfast is my favourite meal",
];

let failures = 0;
for (const text of shouldTrigger) {
  if (!mayBeEatingConcern(text)) {
    failures++;
    console.log(`MISSED   ${text}`);
  }
}
for (const text of shouldNotTrigger) {
  if (mayBeEatingConcern(text)) {
    failures++;
    console.log(`FALSE ALARM   ${text}`);
  }
}

console.log(
  failures
    ? `\n${failures} problem(s).`
    : `All ${shouldTrigger.length} eating-disorder messages caught, no false alarms in ${shouldNotTrigger.length} everyday ones.`
);
process.exitCode = failures ? 1 : 0;
