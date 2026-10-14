// Spots messages that may be about suicide, or about hurting yourself without
// wanting to die (self-harm), in English, German, French and Italian, so the
// chat can show the right help right away.
//
// It's simple phrase matching, so it leans toward showing the card: a false
// alarm only shows phone numbers, while a miss could matter. It can't catch
// every way of saying it, which is why the dragon also has a safety rule
// (server/safety.py). After changing PATTERNS, run:
//   node tests/crisis-detect.test.mjs

import { normalize } from "./normalize.js";
import { browserLanguage } from "./language.js";

// Thoughts of ending one's life, and questions about amounts of pills.
const SUICIDE = {
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
    // Indirect: feeling like a burden, or seeing no point in going on.
    /\b(everyone|everybody|they|people|my family|the world) (would|will|'d) be (fine|better|better off|happier) without me\b/,
    /\b(don'?t|do not|can'?t|cannot) see (the|a|any) point (anymore|any more|in (living|life|going on|anything))\b(?! (of|in) )/,
    /\bno (reason|point) (to keep going|in going on|anymore)\b/,
    /\b(don'?t|do not) want to be here anymore\b(?!,? (this|at|in|with) )/, // not "…, this party is boring"
    /\b(want|wish i could) (to )?disappear (forever|for good)\b/,
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
    /\bmir (selbst )?(etwas|was) antun\b/, // usually means suicide in German
    /\b(alle|jeder|meine familie) (waren?|wurden?|ist|sind) (ohne mich )?besser dran( ohne mich)?\b/, // wären, würden
    /\bohne mich (waren?|wurden?) alle\b/,
    /\bsehe? keinen sinn mehr\b/,
    /\bich (will|kann) nicht mehr\s*([.!?]|$)/, // only at the end: not "will nicht mehr Pizza"
    /\bfur immer verschwinden\b/, // für
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
    /\b(tout le monde|ma famille|ils) (serait|seraient|sera|seront) (mieux|plus heureux) sans moi\b/,
    /\bje ne vois plus (l'interet|le sens|de raison) de (vivre|continuer)\b/, // intérêt
    /\bdisparaitre pour toujours\b/, // disparaître
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
    /\b(starebbero|starebbe) (tutti )?meglio senza di me\b/,
    /\bnon vedo (piu )?(il senso|un senso|motivo) (di|per) (vivere|andare avanti)\b/,
    /\bsparire per sempre\b/,
    /\bquante (pillole|pastiglie|compresse)\b/,
  ],
};

// Hurting yourself without wanting to die (non-suicidal self-injury, NSSI):
// cutting, burning, hitting yourself.
const SELF_HARM = {
  english: [
    /\bself[- ]?harm/,
    /\bself[- ]?injur/,
    /\bnssi\b/,
    /\b(want|wanted|going|thinking about|think about) to (hurt|harm) myself\b/,
    /\b(harm|harming|hurting) myself\b/,
    /\bcutting myself\b/,
    /\bcut myself (again|on purpose)\b/,
    /\bcut(ting)? my (arms?|wrists?|legs?|thighs?)\b/,
    /\burge to (cut|hurt myself)\b/,
    /\bburning myself\b/,
    /\bburn(ed)? myself (again|on purpose)\b/,
    /\b(hitting|punching) myself\b/,
    /\bscratch(ing)? myself (until|till) (it bleeds|i bleed)\b/,
    /\bhid(e|ing) (my |the |these )?(scars|cuts|wounds|marks)\b/,
  ],
  german: [
    /\bselbstverletz/, // Selbstverletzung, selbstverletzend
    /\bmich (selbst )?(verletzen|schneiden|verbrennen)\b/,
    /\bverletze (mich|ich mich)\b/,
    /\b(schneide|verbrenne) (ich )?mich (wieder|absichtlich|selbst)\b/,
    /\britze (mich|ich mich)\b/,
    /\britzen\b/,
    /\b(narben|schnitte|wunden)\b.{0,30}\bverstecken\b/, // "die Narben im Sommer verstecken"
    /\bverstecke? (ich )?(die |meine )?(narben|schnitte|wunden)\b/,
  ],
  french: [
    /\bme (faire|fais) du mal\b/,
    /\bscarifi/, // scarifier, je me scarifie
    /\bme mutiler\b/,
    /\bautomutil/,
    /\bje me coupe (encore|les bras|les poignets|les cuisses|expres)\b/, // exprès
    /\bme bruler (expres|volontairement)\b/, // brûler
    /\bcacher (mes |les |ces )?(cicatrices|coupures|blessures|marques)\b/,
  ],
  italian: [
    /\b(farmi|mi faccio) del male\b/,
    /\bautolesion/,
    /\bmi taglio (ancora|di nuovo|le braccia|i polsi|le gambe|apposta)\b/,
    /\btagliarmi (le braccia|i polsi|le gambe)\b/,
    /\bmi brucio (apposta|di proposito)\b/,
    /\bnascondere (le |i |mie |miei )?(cicatrici|ferite|tagli)\b/,
  ],
};

// Words spelled the same in several of the languages ("suicide", "overdose").
// When only these match, the browser's language decides which language to answer in.
const SHARED = [/\bsuicid/, /\boverdos/];

function firstMatch(groups, normalized) {
  for (const [language, patterns] of Object.entries(groups)) {
    if (patterns.some((pattern) => pattern.test(normalized))) return language;
  }
  return null;
}

// { kind: "suicide" | "selfHarm", language } if the message may be about a
// crisis, otherwise null. Suicide comes first: "I cut myself and want to die"
// gets the suicide card.
export function crisisKind(text) {
  const normalized = normalize(text);
  const suicide = firstMatch(SUICIDE, normalized);
  if (suicide) return { kind: "suicide", language: suicide };
  const selfHarm = firstMatch(SELF_HARM, normalized);
  if (selfHarm) return { kind: "selfHarm", language: selfHarm };
  if (SHARED.some((pattern) => pattern.test(normalized))) return { kind: "suicide", language: browserLanguage() };
  return null;
}

// "english", "german", "french" or "italian" if the message may be about a
// crisis, otherwise null.
export function crisisLanguage(text) {
  return crisisKind(text)?.language ?? null;
}

export function mayBeCrisis(text) {
  return crisisKind(text) !== null;
}
