// Checks js/crisis-detect.js against example messages. Run from the project folder:
//   node tests/crisis-detect.test.mjs
// Add a line here whenever a phrase is missed or a harmless message triggers the card.

import { loadModule } from "./load-module.mjs";

// The detector reads the browser's language for shared words; pretend it's English.
globalThis.navigator ??= { language: "en-US" };
const { mayBeCrisis, crisisLanguage, crisisKind } = await loadModule("js/crisis-detect.js");

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
  // Self-harm (NSSI)
  "I've been burning myself again",
  "I get the urge to cut every night",
  "I cut my arms when it gets too much",
  "Ich habe mich wieder selbstverletzt",
  "Ich schneide mich absichtlich",
  "je me scarifie depuis des mois",
  "je me coupe les bras",
  "mi taglio le braccia quando sto male",
  "How do I hide the scars from my parents?",
  // Indirect
  "I don't see the point anymore. Everyone would be fine without me.",
  "My family would be better off without me",
  "I don't want to be here anymore",
  "Ich sehe keinen Sinn mehr",
  "Alle wären besser dran ohne mich",
  "Ich kann nicht mehr.",
  "Tout le monde serait mieux sans moi",
  "Je ne vois plus l'intérêt de vivre",
  "Starebbero tutti meglio senza di me",
  "Non vedo più il senso di vivere",
  "Wie kann ich die Narben im Sommer verstecken?",
  "comment cacher mes cicatrices ?",
  "come nascondere le cicatrici?",
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
  "I burned myself cooking pasta",
  "I hit my head on the door",
  "Ich habe mich beim Kochen geschnitten",
  "Je me coupe les cheveux ce soir",
  "Mi taglio i capelli domani",
  "Where can I hide the presents?",
  "I don't see the point of this homework anymore",
  "I don't want to be here anymore, this party is boring",
  "Ich will nicht mehr Pizza essen",
  "Ich kann nicht mehr warten",
  "Je n'en peux plus de ce boulot",
  "Le équipe serait mieux sans moi au match",
  "Voglio sparire sotto le coperte",
];

// Suicide or self-harm: they get different cards and replies.
const kindChecks = {
  "I want to die": "suicide",
  "I keep hurting myself": "selfHarm",
  "I cut myself and I want to die": "suicide",
  "Ich ritze mich wieder": "selfHarm",
  "Ich will mir etwas antun": "suicide",
  "je me fais du mal": "selfHarm",
  "mi faccio del male": "selfHarm",
  "Quante pillole servirebbero?": "suicide",
};

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
for (const [text, expected] of Object.entries(kindChecks)) {
  const kind = crisisKind(text)?.kind;
  if (kind !== expected) {
    failures++;
    console.log(`WRONG KIND   ${text} -> ${kind} (expected ${expected})`);
  }
}
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
