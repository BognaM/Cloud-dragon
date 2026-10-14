// Spots messages that may be about suicide or self-harm, in English, German,
// French and Italian, so the chat can show crisis contacts right away.
//
// It's simple phrase matching, so it leans toward showing the card: a false
// alarm only shows phone numbers, while a miss could matter. It can't catch
// every way of saying it, which is why the dragon also has a safety rule
// (server/safety.py). After changing PATTERNS, run:
//   node tests/crisis-detect.test.mjs

import { normalize } from "./normalize.js";

const PATTERNS = {
  english: [
    /\bsuicidal\b/,
    /\bkill(ing)? myself\b/,
    /\b(end|ending|take|taking) my (own )?life\b/,
    /\b(want|wanted|wanna) to die\b/,
    /\bwish i (was|were) dead\b/,
    /\bbetter off dead\b/,
    /\b(don'?t|do not) want to (live|be alive|exist|wake up)( anymore)?\b/,
    /\bno (reason|point) (to live|in living|living)\b/,
    /\bend it all\b/,
    /\bself[- ]?harm/,
    /\b(want|wanted|going|thinking about|think about) to (hurt|harm) myself\b/,
    /\b(harm|harming|hurting) myself\b/,
    /\bcutting myself\b/,
    /\bcut myself (again|on purpose)\b/,
    /\bhow many (of (my|these|the) )?(\w+ )?(pills|tablets)\b/, // asking about amounts
  ],
  german: [
    /\bsuizid/, // Suizid, suizidal
    /\bselbstmord/,
    /\bmich (selbst )?(umbringen|toten)\b/, // töten
    /\bbringe? mich um\b/,
    /\b(will|mochte|moechte) (nicht mehr leben|sterben)\b/, // möchte
    /\bnicht mehr leben (will|mochte|moechte)\b/,
    /\b(mein )?leben (zu )?beenden\b/,
    /\blebensmud/, // lebensmüde
    /\b(das )?leben (hat )?keinen sinn mehr\b/,
    /\bkeinen sinn mehr zu leben\b/,
    /\bmir (selbst )?(etwas|was) antun\b/,
    /\bmich (selbst )?verletzen\b/,
    /\bverletze (mich|ich mich)\b/,
    /\britze (mich|ich mich)\b/,
    /\britzen\b/,
    /\buberdosis\b/, // Überdosis
    /\bwie viele (von )?(meinen |diesen |den )?(\w+)?tabletten\b/, // Schlaftabletten …
  ],
  french: [
    /\b(suicidaire|me suicider)\b/,
    /\bme tuer\b/,
    /\bmettre fin a (mes jours|ma vie)\b/, // à
    /\b(veux|voudrais|vais|envie d') ?en finir\b/,
    /\b(envie de|veux|voudrais) mourir\b/,
    /\b(plus envie de|ne veux plus|veux plus) vivre\b/,
    /\bme (faire|fais) du mal\b/,
    /\bme (scarifier|mutiler)\b/,
    /\bautomutil/,
    /\bsurdose\b/,
    /\bcombien de (cachets|comprimes|pilules|somniferes)\b/, // comprimés, somnifères
  ],
  italian: [
    /\bsuicid(io|a|i|arm[io])\b/, // suicidio, suicida, suicidarmi
    /\buccidermi\b/,
    /\btogliermi la vita\b/,
    /\b(voglio|vorrei) farla finita\b/,
    /\b(voglio|vorrei) morire\b/,
    /\bnon voglio piu vivere\b/, // più
    /\b(farmi|mi faccio) del male\b/,
    /\bautolesion/,
    /\bquante (pillole|pastiglie|compresse)\b/,
  ],
};

// Words spelled the same in several of the languages ("suicide", "overdose").
// When only these match, the browser's language decides which language to answer in.
const SHARED = [/\bsuicid/, /\boverdos/];

function browserLanguage() {
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  return { de: "german", fr: "french", it: "italian" }[code] || "english";
}

// "english", "german", "french" or "italian" if the message may be about a
// crisis, otherwise null.
export function crisisLanguage(text) {
  const normalized = normalize(text);
  for (const [language, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(normalized))) return language;
  }
  return SHARED.some((pattern) => pattern.test(normalized)) ? browserLanguage() : null;
}

export function mayBeCrisis(text) {
  return crisisLanguage(text) !== null;
}
