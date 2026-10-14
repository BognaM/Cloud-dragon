// The /card test command: shows the help cards without sending anything to the
// dragon or saving it, so you can check their text and numbers.
//
//   /card                     all six cards
//   /card violence            one card: suicide, selfharm, violence, harm, substances, eating
//   /card eating young fr     with options:
//     young   as if the person mentioned their age (adds 147)
//     now     as if they may be in danger right now (144 or 117 first)
//     mix     substances: a question about mixing (145)
//     de fr it   the card in that language (eating: also picks the service)
//
// It uses the real detectors and number choices: each card gets an example
// message, so a card that doesn't appear means its detector missed the example.

import { addCrisisCard } from "./crisis-card.js";
import { addTopicCardIfNeeded } from "./topic-card.js";
import { removeWelcome } from "./welcome.js";

// Example messages for each card: the usual one, then the variants.
const EXAMPLES = {
  suicide: {
    kind: "suicide",
    text: "I want to die",
    now: "I took all my pills and I want to die",
  },
  selfharm: {
    kind: "selfHarm",
    text: "I keep hurting myself",
    now: "I cut too deep this time and it won't stop bleeding",
  },
  violence: {
    text: "My partner hits me",
    now: "My partner hits me and he's coming home",
  },
  harm: {
    text: "I keep having thoughts about hurting someone",
    now: "I want to hurt him tonight",
  },
  substances: {
    text: "I can't stop drinking",
    now: "My friend took too many pills and won't wake up",
    mix: "Is it safe to mix xanax with alcohol?",
  },
  eating: {
    text: "I make myself throw up after meals",
    now: "I haven't eaten in 4 days and I feel dizzy",
    de: "Ich esse fast nichts mehr",
    fr: "je me fais vomir après les repas",
    it: "mi faccio vomitare dopo cena",
  },
};

const ALIASES = { "self-harm": "selfharm", nssi: "selfharm", drugs: "substances", alcohol: "substances", others: "harm" };

export const CARD_NAMES = Object.keys(EXAMPLES);

// Pick the example: a language or "mix" first, then "now", else the usual one.
function exampleText(example, options) {
  const variant = ["de", "fr", "it", "mix", "now"].find((option) => options.includes(option) && example[option]);
  return example[variant] ?? example.text;
}

const LANGUAGES = { de: "german", fr: "french", it: "italian" };

function showCard(name, options) {
  const example = EXAMPLES[name];
  const text = exampleText(example, options);
  // "young" works like the person having said their age earlier in the chat.
  const texts = options.includes("young") ? ["I'm 15", text] : [text];
  const language = LANGUAGES[options.find((option) => LANGUAGES[option])];
  if (example.kind) addCrisisCard(example.kind, language ?? "english", text, texts);
  else addTopicCardIfNeeded(text, texts, language);
}

// Returns an error message, or null if the cards were shown.
const OPTIONS = ["young", "now", "mix", "de", "fr", "it"];

export function runCardCommand(args) {
  // "/card now young" shows every card with those options.
  const [first, ...rest] = args;
  const name = first && !OPTIONS.includes(first) ? ALIASES[first] ?? first : null;
  if (name && !EXAMPLES[name]) return `Unknown card "${first}". Cards: ${CARD_NAMES.join(", ")}.`;

  removeWelcome();
  const options = name ? rest : args;
  for (const card of name ? [name] : CARD_NAMES) showCard(card, options);
  return null;
}
