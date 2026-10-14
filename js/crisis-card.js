// The crisis cards, shown in the chat right after a message that may be about
// suicide or self-harm, whatever the dragon replies, in the message's language.
// Built by js/help-card.js; the numbers are chosen for each message
// (js/pick-contacts.js).

import { mayBeCrisis } from "./crisis-detect.js";
import { addHelpCard } from "./help-card.js";
import { selfHarmContacts, suicideContacts } from "./pick-contacts.js";

// `kind`: "suicide" or "selfHarm", and `language`, from crisisKind() in
// js/crisis-detect.js. `text`: the message; `texts`: everything written so far.
export function addCrisisCard(kind, language, text, texts) {
  const contacts = kind === "selfHarm" ? selfHarmContacts(text, texts) : suicideContacts(text, texts);
  addHelpCard(kind, language, contacts);
}

// True if any recent user message may be about a crisis. The dragon then gets
// an extra safety rule for its reply (see server/safety.py).
export function recentCrisis(conversation, recent = 10) {
  return conversation.slice(-recent).some((message) => message.role === "user" && mayBeCrisis(message.content));
}
