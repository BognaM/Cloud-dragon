// Help cards for topics where the dragon still replies: violence, thoughts of
// hurting someone else, alcohol and drugs, and eating disorders. (Suicide and
// self-harm get a crisis card and a pre-written reply: js/crisis-card.js.)
// Each card's text is a <template> in index.html; the numbers are chosen for
// each message (js/pick-contacts.js).

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { renderContacts } from "./contacts.js";
import { violenceLanguage } from "./violence-detect.js";
import { harmOthersLanguage } from "./harm-others-detect.js";
import { substanceLanguage } from "./substance-detect.js";
import { eatingLanguage } from "./eating-detect.js";
import { eatingContacts, harmOthersContacts, substanceContacts, violenceContacts } from "./pick-contacts.js";

// In priority order: a message gets one card, for the first topic it matches.
// Being hurt by someone comes first, since that person may be in danger.
const TOPICS = [
  { detect: violenceLanguage, template: "violenceCardTemplate", contacts: violenceContacts },
  { detect: harmOthersLanguage, template: "harmOthersCardTemplate", contacts: harmOthersContacts },
  { detect: substanceLanguage, template: "substanceCardTemplate", contacts: substanceContacts },
  { detect: eatingLanguage, template: "eatingCardTemplate", contacts: eatingContacts },
];

// `text`: the message; `texts`: everything the person has written so far.
export function addTopicCardIfNeeded(text, texts) {
  for (const topic of TOPICS) {
    const language = topic.detect(text);
    if (!language) continue;

    const card = el[topic.template].content.firstElementChild.cloneNode(true);
    renderContacts(card.querySelector("ul"), topic.contacts(text, texts, language));
    el.messages.appendChild(card);
    scrollToBottom();
    return;
  }
}
