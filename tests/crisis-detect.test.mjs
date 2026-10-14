// Checks js/crisis-detect.js against example messages. Run from the project folder:
//   node tests/crisis-detect.test.mjs
// Add a line here whenever a phrase is missed or a harmless message triggers the card.

import { loadModule } from "./load-module.mjs";

// The detector reads the browser's language for shared words; pretend it's English.
globalThis.navigator ??= { language: "en-US" };
const { mayBeCrisis, crisisLanguage } = await loadModule("js/crisis-detect.js");

const shouldTrigger = [
  // English
  "I want to die",
  "I've been thinking about suicide",
  "i feel suicidal tonight",
  "I want to kill myself",
  "sometimes I think about ending my life",
  "I don't want to be alive anymore",
  "I dont want to live",
  "I don’t want to wake up tomorrow",
  "everyone would be better off dead without me, I'd be better off dead",
  "I just want to end it all",
  "I've been cutting myself again",
  "I keep hurting myself",
  "how many pills for an overdose",
  "there's no reason to live",
  "How many of my sleeping pills would it take?",
  "self-harm is the only thing that helps",
  // German
  "Ich will nicht mehr leben",
  "Ich möchte sterben",
  "ich denke an Suizid",
  "Ich will mich umbringen",
  "manchmal will ich mich selbst töten",
  "Ich bin so lebensmüde",
  "Das Leben hat keinen Sinn mehr",
  "Ich will mir etwas antun",
  "Ich ritze mich wieder",
  "Ich verletze mich selbst",
  "Ich habe an Selbstmord gedacht",
  "Wie viele von meinen Schlaftabletten bräuchte ich?",
  // French
  "Je veux mourir",
  "j'ai envie de mourir",
  "Je pense au suicide",
  "j'ai envie de me tuer",
  "je veux mettre fin à mes jours",
  "Je ne veux plus vivre",
  "j'ai envie d'en finir",
  "je me fais du mal",
  "j'ai envie de me faire du mal",
  "Combien de somnifères faudrait-il ?",
  // Italian
  "Voglio morire",
  "penso al suicidio",
  "voglio uccidermi",
  "Non voglio più vivere",
  "vorrei togliermi la vita",
  "voglio farla finita",
  "ho voglia di farmi del male",
  "mi faccio del male",
  "Quante pillole servirebbero?",
];

const shouldNotTrigger = [
  "I need a little pep talk for today.",
  "Help me plan a calm evening.",
  "Why do clouds float?",
  "I'm dying to see that movie",
  "This exam is killing me",
  "I cut myself a slice of cake",
  "I could die of embarrassment",
  "Ich bin heute sehr müde",
  "Ich will morgen früh joggen",
  "Je vais finir mes devoirs",
  "Je meurs de faim",
  "Voglio tagliarmi i capelli",
  "Sono stanca morta",
  "How many vitamins should I take a day?",
  "Wie viele Kapitel muss ich lesen?",
];

// The language the pre-written reply should use.
const languageChecks = {
  "I want to die": "english",
  "Ich will nicht mehr leben": "german",
  "Ich denke an Suizid": "german",
  "Je ne veux plus vivre": "french",
  "Je suis suicidaire": "french",
  "Non voglio più vivere": "italian",
  "penso al suicidio": "italian",
  "I keep thinking about suicide": "english",
};

let failures = 0;
for (const [text, expected] of Object.entries(languageChecks)) {
  const language = crisisLanguage(text);
  if (language !== expected) {
    failures++;
    console.log(`WRONG LANGUAGE   ${text} -> ${language} (expected ${expected})`);
  }
}
for (const text of shouldTrigger) {
  if (!mayBeCrisis(text)) {
    failures++;
    console.log(`MISSED   ${text}`);
  }
}
for (const text of shouldNotTrigger) {
  if (mayBeCrisis(text)) {
    failures++;
    console.log(`FALSE ALARM   ${text}`);
  }
}

console.log(
  failures
    ? `\n${failures} problem(s).`
    : `All ${shouldTrigger.length} crisis messages caught, no false alarms in ${shouldNotTrigger.length} everyday ones.`
);
process.exitCode = failures ? 1 : 0;
