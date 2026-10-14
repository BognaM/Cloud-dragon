// Spots messages that may be about someone hurting, threatening or abusing the
// person (at home, by a partner, sexually), in English, German, French and
// Italian, so the chat can show victim support (142) right away.
// After changing PATTERNS, run:
//   node tests/topic-detect.test.mjs

import { matchLanguage } from "./phrase-match.js";

const WHO = "(he|she|they|my (dad|father|mom|mum|mother|stepdad|stepfather|stepmom|husband|wife|partner|boyfriend|girlfriend|ex|brother|sister|uncle|boss|teacher))";
// Physical acts only: "he hurt me" or "her words touched me" are often about feelings.
const DOES = "(hits|hit|beats|beat|kicks|kicked|chokes|choked|strangles|strangled|slaps|slapped|punches|punched|raped|abuses|abused|threatens|threatened)";

const PATTERNS = {
  english: [
    new RegExp(`\\b${WHO} ${DOES} me\\b`),
    /\b(raped|sexually assaulted|molested)\b/,
    /\bdomestic (violence|abuse)\b/,
    /\bi'?m (being )?(abused|beaten|hit at home)\b/,
    /\bafraid (to go|of going) home\b/,
    /\bforced me to\b/,
    /\b(touches|touched) me (without|where|against|even though)\b/,
    /\bstalk(s|ing|ed) me\b/,
    /\bthreaten(s|ed)? to kill me\b/,
  ],
  german: [
    /\b(schlagt|schlug|tritt|trat|wurgt|wurgte|vergewaltigt|vergewaltigte|missbraucht|missbrauchte|bedroht|bedrohte|begrapscht|stalkt) mich\b/, // schlägt, würgt
    /\bhat mich (geschlagen|vergewaltigt|missbraucht|bedroht|gewurgt)\b/, // gewürgt
    /\bhausliche gewalt\b/, // häusliche
    /\bvergewaltig/,
    /\bsexuell (belastigt|missbraucht)\b/, // belästigt
    /\bangst,? nach hause zu gehen\b/,
    /\bwerde (geschlagen|missbraucht|bedroht)\b/,
    /\bdroht,? mich umzubringen\b/,
  ],
  french: [
    /\b(me frappe|m'a frappee?|me bat|m'a battue?|m'etrangle|m'a etranglee?|me menace|m'a menacee?|m'a agressee?|abuse de moi)\b/, // frappé(e), étrangle
    /\bm'a violee?\b/, // violé(e)
    /\bviolences? (conjugales?|domestiques?)\b/,
    /\bj'ai peur de rentrer (chez moi|a la maison)\b/,
    /\bmenace de me tuer\b/,
    /\bme harcele\b/, // harcèle
  ],
  italian: [
    /\b(mi picchia|mi ha picchiat[ao]|mi colpisce|mi minaccia|mi ha minacciat[ao]|abusa di me|mi ha molestat[ao])\b/,
    /\bmi ha violentat[ao]\b/,
    /\bviolenza domestica\b/,
    /\bstupr[ao]\b/,
    /\bho paura di tornare a casa\b/,
    /\bminaccia di uccidermi\b/,
  ],
};

export function violenceLanguage(text) {
  return matchLanguage(PATTERNS, [], text);
}
