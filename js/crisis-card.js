// The crisis cards, shown in the chat right after a message that may be about
// suicide or self-harm, whatever the dragon replies. Their text is in
// index.html (<template id="crisisCardTemplate"> and "selfHarmCardTemplate");
// the numbers are chosen for each message (js/pick-contacts.js).

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { mayBeCrisis } from "./crisis-detect.js";
import { renderContacts } from "./contacts.js";
import { selfHarmContacts, suicideContacts } from "./pick-contacts.js";

// `kind`: "suicide" or "selfHarm" (js/crisis-detect.js).
// `text`: the message; `texts`: everything the person has written so far.
export function addCrisisCard(kind, text, texts) {
  const selfHarm = kind === "selfHarm";
  const template = selfHarm ? el.selfHarmCardTemplate : el.crisisCardTemplate;
  const card = template.content.firstElementChild.cloneNode(true);
  const contacts = selfHarm ? selfHarmContacts(text, texts) : suicideContacts(text, texts);
  renderContacts(card.querySelector("ul"), contacts);
  el.messages.appendChild(card);
  scrollToBottom();
}

// True if any recent user message may be about a crisis. The dragon then gets
// an extra safety rule for its reply (see server/safety.py).
export function recentCrisis(conversation, recent = 10) {
  return conversation.slice(-recent).some((message) => message.role === "user" && mayBeCrisis(message.content));
}
