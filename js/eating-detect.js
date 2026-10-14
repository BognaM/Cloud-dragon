// Spots messages that may be about an eating disorder (not eating, making
// yourself sick, bingeing, hating your body), in English, German, French and
// Italian, so the chat can show eating-disorder services right away.
//
// Like crisis-detect.js it's simple phrase matching that leans toward showing
// the card: a false alarm only shows phone numbers. It skips everyday diet talk
// ("stop eating meat"), so people aren't flagged for ordinary food choices.
// After changing PATTERNS, run:
//   node tests/eating-detect.test.mjs

import { normalize } from "./normalize.js";
import { browserLanguage } from "./language.js";

const PATTERNS = {
  english: [
    /\beating disorder/,
    // …but not foods people commonly give up for ordinary reasons.
    /\b(stop|stopped|stopping|quit) eating\b(?! (meat|sugar|gluten|dairy|junk|fast food|sweets|chocolate|candy|fish|pork|bread|carbs|out)\b)/,
    /\b(not|barely|hardly) eat(ing)? (anything|at all|for days)\b/,
    /\bhaven'?t eaten (in|for) (days|\d+ days|a week)\b/,
    /\bstarv(e|ing) myself\b/,
    /\bskip(ping)? meals\b/,
    /\bmake myself (throw up|vomit|sick)\b/,
    /\bthrow(ing)? up after (eating|meals|i eat)\b/,
    /\b(purge|purging)\b/,
    /\blaxatives?\b/,
    /\b(only|under) (eat |eating |have )?\d+ ?(calories|kcal)\b/,
    /\bcount(ing)? every calorie\b/,
    /\b(i|i'm|im|i am) (so |too )?fat\b/,
    /\bi feel (so |too )?fat\b/,
    /\bhate my body\b/,
  ],
  german: [
    /\bessstorung/, // Essstörung
    /\bmagersu/, // Magersucht, magersüchtig
    /\bess-?brech/, // Ess-Brech-Sucht
    /\b(essanfall|essanfalle|fressattacke|fressanfall)/,
    /\b(nichts|nicht) mehr (essen|esse)\b/,
    /\besse (gar |fast |kaum )?nichts mehr\b/,
    /\besse (gar|fast) nichts\b/,
    /\bhungere mich\b/,
    /\bmich (danach )?(ubergeben|erbrechen)\b/, // übergeben
    /\b(ubergebe|erbreche) (ich )?mich\b/, // übergebe
    /\babfuhrmittel/, // Abführmittel
    /\b(ich bin|ich fuhle mich) (so |zu )?(fett|dick)\b/, // fühle
    /\bhasse meinen korper\b/, // Körper
  ],
  french: [
    /\btroubles? (du comportement )?alimentaires?\b/,
    /\b(arreter|arrete|j'arrete) de manger\b(?! (de la |du |des )?(viande|sucre|gluten|chocolat|bonbons))/,
    /\bne (mange|mangerai) (plus|rien)\b/,
    /\bme (fais|faire) vomir\b/,
    /\blaxatifs?\b/,
    /\bje (suis|me sens) (trop |si )?(grosse?)\b/,
    /\bdeteste mon corps\b/, // déteste
    /\bboulimi/,
  ],
  italian: [
    /\bdisturb[io] (del comportamento )?alimentar[ei]\b/,
    /\b(smettere|smetto|smesso) di mangiare\b(?! (la |lo |il )?(carne|zucchero|glutine|dolci|cioccolato))/,
    /\bnon mangio (piu|niente|nulla)\b/, // più
    /\bmi faccio vomitare\b/,
    /\blassativi\b/,
    /\babbuffat/, // abbuffate, abbuffata
    /\b(sono|mi sento) (troppo |cosi )?grass[ao]\b/,
    /\bodio il mio corpo\b/,
    /\banoressi/,
  ],
};

// Words spelled alike in several languages (anorexia, Anorexie; bulimia, Bulimie).
// When only these match, the browser's language decides.
const SHARED = [
  /\banorexi/,
  /\bbul[iy]mi/,
  /\bhyperphagi/,
  /\bbinge(-| )?(eat|eating|ing)\b/,
  /\bpro[- ]?ana\b/,
  /\bthinspo/,
];

// "english", "german", "french" or "italian" if the message may be about an
// eating disorder, otherwise null.
export function eatingLanguage(text) {
  const normalized = normalize(text);
  for (const [language, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(normalized))) return language;
  }
  return SHARED.some((pattern) => pattern.test(normalized)) ? browserLanguage() : null;
}

export function mayBeEatingConcern(text) {
  return eatingLanguage(text) !== null;
}
