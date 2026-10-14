// Spots messages where the person may be thinking about hurting someone else,
// in English, German, French and Italian, so the chat can show help right away.
// Everyday exaggerations ("this exam is killing me", "I could kill him for
// eating my cake") are left out on purpose.
// After changing PATTERNS, run:
//   node tests/topic-detect.test.mjs

import { matchLanguage } from "./phrase-match.js";

const PATTERNS = {
  english: [
    /\b(want|wanna|going|planning|plan) to (kill|hurt|stab|shoot|attack|harm) (him|her|them|someone|somebody|people|everyone|my \w+)\b/,
    /\bthoughts? (of|about) (killing|hurting|harming|stabbing|shooting) (someone|somebody|people|others|him|her|them|my \w+)\b/,
    /\burges? to (kill|hurt|harm|attack) (someone|somebody|people|others|my \w+)\b/,
    /\b(afraid|scared) i('?ll| will| might| could) (hurt|harm|kill) (someone|somebody|my (baby|child|kids?|partner))\b/,
    /\bshoot up (the|my|a) (school|office|class)\b/,
  ],
  german: [
    /\b(will|mochte|werde) (ihn|sie|jemanden|alle|meinen \w+|meine \w+) (umbringen|toten|verletzen|abstechen|erschiessen)\b/, // möchte, töten
    /\b(gedanken|drang),? (jemanden|andere|ihn|sie) (zu )?(verletzen|toten|umbringen)\b/,
    /\bangst,? (dass ich )?(jemanden|mein kind|mein baby) (zu )?verletze\b/,
  ],
  french: [
    /\benvie de (tuer|frapper|faire du mal a|blesser) (quelqu'un|lui|elle|les gens|mon \w+|ma \w+)\b/, // à
    /\b(je vais|je veux) (le|la|les) tuer\b/,
    /\bpeur de faire du mal a (quelqu'un|mon (bebe|enfant))\b/, // bébé
  ],
  italian: [
    /\b(voglio|vorrei) (ucciderl[oaie]|ammazzarl[oaie]|uccidere qualcuno|fare del male a qualcuno)\b/,
    /\bho voglia di (picchiare|uccidere|fare del male a) (qualcuno|lui|lei)\b/,
    /\bpaura di fare del male a (qualcuno|mio figlio|mia figlia|al mio bambino)\b/,
  ],
};

export function harmOthersLanguage(text) {
  return matchLanguage(PATTERNS, [], text);
}
