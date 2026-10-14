// Spots messages about problems with alcohol, drugs or medication (addiction,
// mixing, poisoning), in English, German, French and Italian, so the chat can
// show help right away. Ordinary mentions ("a glass of wine with dinner") are
// left out. After changing PATTERNS, run:
//   node tests/topic-detect.test.mjs

import { matchLanguage } from "./phrase-match.js";

const PATTERNS = {
  english: [
    /\baddicted to (alcohol|drinking|drugs|pills|painkillers|sleeping pills|cannabis|weed|coke|cocaine|gambling)\b/,
    /\b(alcohol|drug|pill|painkiller|gambling) addiction\b/,
    /\bmy addiction\b/,
    /\b(drinking|alcohol|drug) problem\b/,
    /\bcan'?t stop (drinking|using|taking)\b/,
    /\bi drink (too much|every (day|night)|alone)\b/,
    /\b(blacked out|blackout drunk)\b/,
    /\bwithdrawal (symptoms|shakes)\b/,
    /\brelapsed\b/,
    /\bmix(ing|ed)? .{0,30}\b(with|and) (alcohol|booze|pills|drugs|xanax|benzos)\b/,
    /\b(took|taken|swallowed|drank) too (much|many)\b/,
    /\b(won'?t|can'?t|doesn'?t) wake (him |her |them )?up\b/,
  ],
  german: [
    /\b(alkohol|drogen|tabletten|medikamenten|spiel)sucht/,
    /\bsuchtig\b/, // süchtig
    /\bkann nicht aufhoren,? zu trinken\b/, // aufhören
    /\bich trinke (zu viel|jeden (tag|abend)|allein)\b/,
    /\bentzug\b/,
    /\bruckfall\b/, // Rückfall
    /\b(gemischt|mischen) mit (alkohol|tabletten|drogen)\b/,
    /\bzu viel (genommen|getrunken|geschluckt)\b/,
    /\bwacht nicht (mehr )?auf\b/,
  ],
  french: [
    /\baccro\b.{0,20}\b(alcool|drogue|coke|cocaine|cannabis|medicaments)/, // cocaïne, médicaments
    /\bdependance (a l'alcool|a la drogue|aux drogues|aux medicaments)\b/,
    /\balcoolique\b/,
    /\bje bois (trop|tous les (jours|soirs)|seule?)\b/,
    /\bn'arrive pas a arreter de boire\b/,
    /\bsevrage\b/,
    /\bmelange(r|e)? .{0,30}\bavec (de l'alcool|des medicaments|de la drogue)\b/, // mélanger
    /\b(pris|bu|avale) (beaucoup )?trop\b/,
    /\bne se reveille pas\b/, // réveille
  ],
  italian: [
    /\bdipendenza da (alcol|droga|droghe|farmaci)\b/,
    /\balcolizzat[oa]\b/,
    /\bbevo (troppo|ogni (giorno|sera)|da sol[oa])\b/,
    /\bnon riesco a smettere di bere\b/,
    /\bastinenza\b/,
    /\bmischiat[oi] (con|a) (alcol|farmaci|droga)\b/,
    /\b(preso|bevuto|ingoiato) troppo\b/,
    /\bnon si sveglia\b/,
  ],
};

// Drug names spelled alike in several languages.
const SHARED = [
  /\b(cocaine|kokain|cocaina|heroin|heroine|eroina|crystal meth|methamphetamin|fentanyl|ketamin|mdma|ecstasy|crack)\b/,
  /\b(xanax|benzos?|oxycodon|oxycontin|tramadol)\b/,
];

export function substanceLanguage(text) {
  return matchLanguage(PATTERNS, SHARED, text);
}
