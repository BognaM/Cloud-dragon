// The crisis card: crisis lines shown in the chat right after a message that
// may be about suicide or self-harm, whatever the dragon replies.
// Its text is the <template id="crisisCardTemplate"> in index.html.

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { mayBeCrisis } from "./crisis-detect.js";

export function addCrisisCard() {
  const card = el.crisisCardTemplate.content.firstElementChild.cloneNode(true);
  el.messages.appendChild(card);
  scrollToBottom();
}

// Adds the card after the user's message if that message may be about a crisis.
export function addCrisisCardIfNeeded(text) {
  if (mayBeCrisis(text)) addCrisisCard();
}

// True if any recent user message may be about a crisis. The dragon then gets
// an extra safety rule for its reply (see server/safety.py).
export function recentCrisis(conversation, recent = 10) {
  return conversation.slice(-recent).some((message) => message.role === "user" && mayBeCrisis(message.content));
}
