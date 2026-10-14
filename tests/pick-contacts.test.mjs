// Checks which numbers the help cards show (js/pick-contacts.js). Run from the project folder:
//   node tests/pick-contacts.test.mjs

import { loadModule } from "./load-module.mjs";

globalThis.navigator ??= { language: "en-US" };
const { crisisContacts, eatingContacts } = await loadModule("js/pick-contacts.js");
const { eatingLanguage } = await loadModule("js/eating-detect.js");

// [what the person wrote so far (last one shows the card), numbers expected]
const crisisCases = [
  [["I want to die"], ["143", "144"]],
  [["Ich will nicht mehr leben"], ["143", "144"]],
  [["I hate school", "my parents yell all the time", "I want to kill myself"], ["147", "143", "144"]],
  [["Ich bin 14 und will sterben"], ["147", "143", "144"]],
  [["j'ai 15 ans et je veux mourir"], ["147", "143", "144"]],
  [["I took all my sleeping pills, I want to die"], ["144", "143"]],
  [["Je veux mourir ce soir"], ["144", "143"]],
  [["Ho preso tutte le pastiglie, voglio morire"], ["144", "143"]],
  [["I'm 16", "I swallowed some pills and I want to die"], ["144", "147", "143"]],
];

const eatingCases = [
  [["I think I have an eating disorder"], ["aes", "143"]],
  [["Ich glaube, ich habe eine Essstörung"], ["aes", "143"]],
  [["je me fais vomir après les repas"], ["aba", "143"]],
  [["non mangio più da giorni"], ["143"]],
  [["my mom keeps watching what I eat", "I make myself throw up after meals"], ["aes", "147"]],
  [["Je suis au lycée", "je ne mange plus"], ["aba", "147"]],
  [["Vado a scuola", "mi faccio vomitare"], ["147", "143"]],
  [["I haven't eaten in 4 days and I feel dizzy"], ["144", "aes", "143"]],
  [["Ich esse nichts mehr und bin heute umgekippt"], ["144", "aes", "143"]],
];

let failures = 0;
const check = (kind, texts, got, expected) => {
  if (got.join() !== expected.join()) {
    failures++;
    console.log(`WRONG ${kind}   ${texts.at(-1)} -> ${got.join(", ")} (expected ${expected.join(", ")})`);
  }
  if (got.length < 1 || got.length > 3) {
    failures++;
    console.log(`TOO MANY OR FEW   ${texts.at(-1)} -> ${got.length} numbers`);
  }
};

for (const [texts, expected] of crisisCases) {
  check("CRISIS", texts, crisisContacts(texts.at(-1), texts), expected);
}
for (const [texts, expected] of eatingCases) {
  const text = texts.at(-1);
  check("EATING", texts, eatingContacts(text, texts, eatingLanguage(text)), expected);
}

const total = crisisCases.length + eatingCases.length;
console.log(failures ? `\n${failures} problem(s).` : `All ${total} cards show the expected numbers.`);
process.exitCode = failures ? 1 : 0;
