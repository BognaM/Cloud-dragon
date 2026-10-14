// Builds a help card in the chat: title, text and 2–3 numbers, in the
// language of the message that triggered it. Used by js/crisis-card.js and
// js/topic-card.js; the words are in js/card-texts.js and js/contacts.js.

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { CARD_TEXTS, LANGUAGE_CODES } from "./card-texts.js";
import { renderContacts } from "./contacts.js";

// `kind`: a key of CARD_TEXTS. `language`: "english", "german", "french" or "italian".
export function addHelpCard(kind, language, contactKeys) {
  const card = el.helpCardTemplate.content.firstElementChild.cloneNode(true);
  const texts = CARD_TEXTS[kind];
  const words = texts[language] || texts.english;

  card.lang = LANGUAGE_CODES[language] || "en";
  card.setAttribute("role", texts.role);
  card.querySelector("h3").textContent = words.title;
  card.querySelector(".card-intro").textContent = words.intro;
  renderContacts(card.querySelector("ul"), contactKeys, language);

  if (words.more) {
    const more = card.querySelector(".card-more");
    const link = document.createElement("a");
    link.href = texts.more;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = words.more[1];
    more.append(`${words.more[0]} `, link);
    more.hidden = false;
  }

  el.messages.appendChild(card);
  scrollToBottom();
}
