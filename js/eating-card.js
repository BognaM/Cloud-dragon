// The eating-disorder card: help shown in the chat right after a message that
// may be about an eating disorder. The dragon still replies.
// Its text is the <template id="eatingCardTemplate"> in index.html; the
// numbers are chosen for each message (js/pick-contacts.js).

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { eatingLanguage } from "./eating-detect.js";
import { renderContacts } from "./contacts.js";
import { eatingContacts } from "./pick-contacts.js";

// `text`: the message; `texts`: everything the person has written so far.
export function addEatingCardIfNeeded(text, texts) {
  const language = eatingLanguage(text);
  if (!language) return;

  const card = el.eatingCardTemplate.content.firstElementChild.cloneNode(true);
  renderContacts(card.querySelector("ul"), eatingContacts(text, texts, language));
  el.messages.appendChild(card);
  scrollToBottom();
}
