// The crisis card: crisis lines shown in the chat right after a message that
// may be about suicide or self-harm, whatever the dragon replies.
// Its text is the <template id="crisisCardTemplate"> in index.html; the
// numbers are chosen for each message (js/pick-contacts.js).

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { mayBeCrisis } from "./crisis-detect.js";
import { renderContacts } from "./contacts.js";
import { crisisContacts } from "./pick-contacts.js";

// `text`: the message; `texts`: everything the person has written so far.
export function addCrisisCard(text, texts) {
  const card = el.crisisCardTemplate.content.firstElementChild.cloneNode(true);
  renderContacts(card.querySelector("ul"), crisisContacts(text, texts));
  el.messages.appendChild(card);
  scrollToBottom();
}

// True if any recent user message may be about a crisis. The dragon then gets
// an extra safety rule for its reply (see server/safety.py).
export function recentCrisis(conversation, recent = 10) {
  return conversation.slice(-recent).some((message) => message.role === "user" && mayBeCrisis(message.content));
}
