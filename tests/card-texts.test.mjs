// Checks that every help card and every number has its words in all four
// languages (js/card-texts.js, js/contacts.js). Run from the project folder:
//   node tests/card-texts.test.mjs

import { loadModule } from "./load-module.mjs";

const { CARD_TEXTS } = await loadModule("js/card-texts.js");
const { CONTACTS } = await loadModule("js/contacts.js");

const LANGUAGES = ["english", "german", "french", "italian"];
let failures = 0;
const missing = (what) => {
  failures++;
  console.log(`MISSING   ${what}`);
};

for (const [kind, card] of Object.entries(CARD_TEXTS)) {
  for (const language of LANGUAGES) {
    const words = card[language];
    if (!words?.title) missing(`${kind} card: ${language} title`);
    if (!words?.intro) missing(`${kind} card: ${language} text`);
    if (card.more && !(words?.more?.length === 2)) missing(`${kind} card: ${language} "more services" line`);
  }
}

for (const [key, contact] of Object.entries(CONTACTS)) {
  if (!contact.tel && !contact.href) missing(`${key}: phone number or web address`);
  for (const language of LANGUAGES) {
    const words = contact[language];
    if (!words?.text) missing(`${key}: ${language} description`);
    if (contact.link && !words?.link) missing(`${key}: ${language} link label`);
    if (contact.href && !words?.number) missing(`${key}: ${language} button label`);
  }
}

// Every number the cards can pick (js/pick-contacts.js) must exist.
const picker = await (await import("node:fs/promises")).readFile(new URL("../js/pick-contacts.js", import.meta.url), "utf8");
for (const [, key] of picker.matchAll(/"(\d{3}|safezone|aes|aba)"/g)) {
  if (!CONTACTS[key]) missing(`contact "${key}" used in js/pick-contacts.js`);
}

const cards = Object.keys(CARD_TEXTS).length;
const contacts = Object.keys(CONTACTS).length;
console.log(failures ? `\n${failures} problem(s).` : `All ${cards} cards and ${contacts} numbers have English, German, French and Italian.`);
process.exitCode = failures ? 1 : 0;
