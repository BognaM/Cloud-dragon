// Clues in what the person writes that change which numbers a help card shows.
// Like the detectors, this is simple phrase matching on normalized text
// (lowercase, no accents), in English, German, French and Italian.

import { normalize } from "./normalize.js";

const matches = (patterns, text) => patterns.some((pattern) => pattern.test(normalize(text)));

// Mentions of school, parents or an age under 18: 147 (Pro Juventute) is for them.
const YOUNG = [
  /\bmy (mom|mum|dad|parents|teacher)\b/,
  /\b(at|in|after|before) school\b/,
  /\bhomework\b/,
  /\bi'?m (1[0-7]|[89])\b/,
  /\bi am (1[0-7]|[89])\b/,
  /\b(1[0-7]|[89]) years old\b/,
  /\bmeine (eltern|mama|mutter|lehrerin)\b/,
  /\bmein (papa|vater|lehrer)\b/,
  /\bschule\b/,
  /\bhausaufgaben\b/,
  /\bich bin (1[0-7]|[89])( jahre)?\b/,
  /\bmes parents\b/,
  /\bma (mere|maman|prof)\b/, // mère
  /\bmon (pere|papa|prof)\b/, // père
  /\becole\b/, // école
  /\blycee\b/, // lycée
  /\bdevoirs\b/,
  /\bj'ai (1[0-7]|[89]) ans\b/,
  /\bi miei genitori\b/,
  /\bmia (madre|mamma)\b/,
  /\bmio (padre|papa)\b/, // papà
  /\bscuola\b/,
  /\bcompiti\b/,
  /\bho (1[0-7]|[89]) anni\b/,
];

// Signs that someone may already be acting on it or is about to: 144 goes first.
const DANGER_NOW = [
  /\b(took|taken|swallowed) (all |a lot of |too many |some )?(of )?(my |the |these )?(\w+ )?(pills|tablets)\b/,
  /\boverdosed\b/,
  /\b(right now|tonight)\b/,
  /\bi have a (knife|gun|rope|blade)\b/,
  /\bon (the|a) (bridge|roof)\b/,
  /\b(this is goodbye|goodbye forever)\b/,
  /\btabletten (genommen|geschluckt)\b/,
  /\b(jetzt gleich|heute nacht|heute abend)\b/,
  /\bauf (der|einer) brucke\b/, // Brücke
  /\blebt wohl\b/,
  /\bj'ai (pris|avale) (des |tous mes |toutes mes |trop de )?(cachets|comprimes|pilules|medicaments)\b/, // avalé, comprimés, médicaments
  /\b(ce soir|cette nuit|tout de suite)\b/,
  /\badieu\b/,
  /\bho (preso|ingoiato) (delle |troppe |tutte le )?(pillole|pastiglie|compresse)\b/,
  /\b(adesso|stanotte|stasera|in questo momento)\b/,
  /\baddio\b/,
];

// Physical warning signs with an eating disorder: 144 is added.
const UNWELL = [
  /\b(faint|fainted|fainting|passed out|dizzy|chest pains?|heart (is )?racing)\b/,
  /\b(throwing|threw|throw) up blood\b/,
  /\bhaven'?t eaten (in|for) (days|\d+ days|a week)\b/,
  /\b(ohnmachtig|umgekippt|schwindlig|schwindelig|herzrasen|brustschmerz)/, // ohnmächtig
  /\bblut (erbrochen|gespuckt)\b/,
  /\bseit tagen nichts\b/,
  /\b(evanoui|malaise|vertiges?|douleur (a|dans) la poitrine)\b/, // évanoui
  /\bvomi du sang\b/,
  /\bpas mange depuis\b/, // mangé
  /\b(svenut|svenire|giramenti|capogiri|dolore al petto)/,
  /\bvomitato sangue\b/,
  /\bnon mangio da giorni\b/,
];

// A self-harm wound that needs medical help: 144 goes first.
const BADLY_HURT = [
  /\b(won'?t|doesn'?t|can'?t get it to) stop bleeding\b/,
  /\b(bleeding|bleeds) (a lot|so much|heavily)\b/,
  /\b(deep|deeper) (cut|cuts|wound)\b/,
  /\b(too )?deep this time\b/,
  /\bneed(s)? stitches\b/,
  /\b(bad|badly|serious) burns?\b/,
  /\bhort nicht auf zu bluten\b/, // hört
  /\bblutet (stark|so stark|sehr)\b/,
  /\b(zu )?tief (geschnitten|geritzt)\b/,
  /\bmuss genaht werden\b/, // genäht
  /\bsaigne (beaucoup|encore|trop)\b/,
  /\b(coupure|plaie|blessure) (tres )?profonde\b/, // très
  /\bpoints de suture\b/,
  /\bsanguina (tanto|troppo|ancora)\b/,
  /\bnon smette di sanguinare\b/,
  /\bferita (molto )?profonda\b/,
  /\bpunti di sutura\b/,
];

// Violence happening now or about to: 117 (police) goes first.
const VIOLENCE_NOW = [
  /\b(right now|tonight)\b/,
  /\b(he|she|they)('s| is| are) (here|outside|at the door|coming (back|home)|on (his|her|their) way)\b/,
  /\blocked me in\b/,
  /\b(going|wants?) to kill me\b/,
  /\b(has|have|got) a (knife|gun|weapon)\b/,
  /\b(jetzt gerade|gerade jetzt|heute nacht)\b/,
  /\b(er|sie) (ist|kommt) (gerade |jetzt |gleich )?(hier|vor der tur|nach hause)\b/, // Tür
  /\bhat mich eingesperrt\b/,
  /\bhat ein (messer|waffe)\b/,
  /\b(il|elle) est (la|devant la porte)\b/, // là
  /\bm'a enfermee?\b/, // enfermé(e)
  /\ba un (couteau|arme)\b/,
  /\b(in questo momento|stanotte)\b/,
  /\b(e|sta tornando) (qui|a casa)\b/, // è
  /\bmi ha chius[oa] dentro\b/,
  /\bha un (coltello|pistola|arma)\b/,
];

// Harm to someone else that may be planned or close: 117 goes first.
const HARM_SOON = [
  /\b(tonight|today|tomorrow|right now)\b/,
  /\bi('?m| am) going to\b/,
  /\bi (have|got|bought) a (knife|gun|weapon)\b/,
  /\b(heute|morgen|jetzt)\b/,
  /\bich (habe|hab) (ein messer|eine waffe)\b/,
  /\b(ce soir|aujourd'hui|demain)\b/,
  /\bj'ai (un couteau|une arme)\b/,
  /\b(stasera|oggi|domani)\b/,
  /\bho (un coltello|una pistola|un'arma)\b/,
];

// Someone may have been poisoned or overdosed: 144 first, then 145.
const POISONED_NOW = [
  /\b(took|taken|swallowed|drank) too (much|many)\b/,
  /\b(won'?t|can'?t|doesn'?t) wake (him |her |them )?up\b/,
  /\b(unconscious|not breathing|seizure|overdos)/,
  /\bzu viel (genommen|geschluckt|getrunken)\b/,
  /\b(wacht nicht (mehr )?auf|bewusstlos|atmet nicht|krampfanfall)\b/,
  /\b(pris|bu|avale) (beaucoup )?trop\b/,
  /\b(ne se reveille pas|inconsciente?|ne respire (plus|pas)|convulsions?)\b/,
  /\b(preso|bevuto|ingoiato) troppo\b/,
  /\b(non si sveglia|incosciente|non respira|convulsion)/,
];

// A question about mixing or how dangerous something is: 145 can answer it.
const MIXING = [
  /\bmix(ing|ed)?\b/,
  /\b(mischen|gemischt)\b/,
  /\bmelange/, // mélanger
  /\bmischiat/,
];

// `texts`: everything the person has written in this chat so far.
export function soundsYoung(texts) {
  return texts.some((text) => matches(YOUNG, text));
}

export function inDangerNow(text) {
  return matches(DANGER_NOW, text);
}

export function feelsUnwell(text) {
  return matches(UNWELL, text);
}

export function badlyHurt(text) {
  return matches(BADLY_HURT, text);
}

export function violenceNow(text) {
  return matches(VIOLENCE_NOW, text);
}

export function harmSoon(text) {
  return matches(HARM_SOON, text);
}

export function poisonedNow(text) {
  return matches(POISONED_NOW, text);
}

export function asksAboutMixing(text) {
  return matches(MIXING, text);
}
