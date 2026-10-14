// Help cards for topics where the dragon still replies: violence, thoughts of
// hurting someone else, alcohol and drugs, and eating disorders, in the
// message's language. (Suicide and self-harm get a crisis card and a
// pre-written reply: js/crisis-card.js.) Built by js/help-card.js; the numbers
// are chosen for each message (js/pick-contacts.js).

import { addHelpCard } from "./help-card.js";
import { violenceLanguage } from "./violence-detect.js";
import { harmOthersLanguage } from "./harm-others-detect.js";
import { substanceLanguage } from "./substance-detect.js";
import { eatingLanguage } from "./eating-detect.js";
import { eatingContacts, harmOthersContacts, substanceContacts, violenceContacts } from "./pick-contacts.js";

// In priority order: a message gets one card, for the first topic it matches.
// Being hurt by someone comes first, since that person may be in danger.
const TOPICS = [
  { kind: "violence", detect: violenceLanguage, contacts: violenceContacts },
  { kind: "harmOthers", detect: harmOthersLanguage, contacts: harmOthersContacts },
  { kind: "substances", detect: substanceLanguage, contacts: substanceContacts },
  { kind: "eating", detect: eatingLanguage, contacts: eatingContacts },
];

// `text`: the message; `texts`: everything the person has written so far.
// `cardLanguage` overrides the language of the card (for the /card command).
export function addTopicCardIfNeeded(text, texts, cardLanguage) {
  for (const topic of TOPICS) {
    const language = topic.detect(text);
    if (!language) continue;
    addHelpCard(topic.kind, cardLanguage ?? language, topic.contacts(text, texts, language));
    return;
  }
}
