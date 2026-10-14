// Checks which numbers the help cards show (js/pick-contacts.js). Run from the project folder:
//   node tests/pick-contacts.test.mjs

import { loadModule } from "./load-module.mjs";

globalThis.navigator ??= { language: "en-US" };
const { suicideContacts, selfHarmContacts, eatingContacts, violenceContacts, harmOthersContacts, substanceContacts } =
  await loadModule("js/pick-contacts.js");
const { eatingLanguage } = await loadModule("js/eating-detect.js");

// [what the person wrote so far (last one shows the card), numbers expected]
const suicideCases = [
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

const selfHarmCases = [
  [["I keep hurting myself"], ["143", "147"]],
  [["I'm 15", "I've been cutting myself again"], ["147", "143"]],
  [["I cut myself too deep this time and it won't stop bleeding"], ["144", "143", "147"]],
  [["Ich ritze mich und es blutet stark"], ["144", "143", "147"]],
  [["je me scarifie, je crois qu'il faut des points de suture"], ["144", "143", "147"]],
];

const violenceCases = [
  [["My husband hits me"], ["142", "117"]],
  [["My dad hits me when I get bad grades at school"], ["147", "142", "117"]],
  [["He's coming home and he threatened to kill me"], ["117", "142"]],
  [["Ich bin 14", "Mein Stiefvater schlägt mich, er ist gerade vor der Tür"], ["117", "147", "142"]],
];

const harmOthersCases = [
  [["I keep having thoughts about hurting my baby"], ["143", "117"]],
  [["I hate my teacher", "I want to hurt my teacher"], ["147", "143", "117"]],
  [["I have a knife and I want to kill him"], ["117", "143"]],
];

const substanceCases = [
  [["I can't stop drinking"], ["safezone", "143"]],
  [["I'm 16 and I think I'm addicted to weed"], ["safezone", "147"]],
  [["Is it safe to mix xanax with alcohol?"], ["145", "safezone"]],
  [["my friend took too many pills and won't wake up"], ["144", "145"]],
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

for (const [texts, expected] of suicideCases) {
  check("SUICIDE", texts, suicideContacts(texts.at(-1), texts), expected);
}
for (const [texts, expected] of selfHarmCases) {
  check("SELF-HARM", texts, selfHarmContacts(texts.at(-1), texts), expected);
}
for (const [name, cases, pick] of [
  ["VIOLENCE", violenceCases, violenceContacts],
  ["HARM-OTHERS", harmOthersCases, harmOthersContacts],
  ["SUBSTANCE", substanceCases, substanceContacts],
]) {
  for (const [texts, expected] of cases) check(name, texts, pick(texts.at(-1), texts), expected);
}
for (const [texts, expected] of eatingCases) {
  const text = texts.at(-1);
  check("EATING", texts, eatingContacts(text, texts, eatingLanguage(text)), expected);
}

const total = [suicideCases, selfHarmCases, violenceCases, harmOthersCases, substanceCases, eatingCases]
  .reduce((sum, cases) => sum + cases.length, 0);
console.log(failures ? `\n${failures} problem(s).` : `All ${total} cards show the expected numbers.`);
process.exitCode = failures ? 1 : 0;
