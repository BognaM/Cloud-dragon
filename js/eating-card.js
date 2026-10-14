// The eating-disorder card: specialist services shown in the chat right after
// a message that may be about an eating disorder. The dragon still replies.
// Its text is the <template id="eatingCardTemplate"> in index.html.

import { el } from "./dom.js";
import { scrollToBottom } from "./messages.js";
import { mayBeEatingConcern } from "./eating-detect.js";

export function addEatingCard() {
  const card = el.eatingCardTemplate.content.firstElementChild.cloneNode(true);
  el.messages.appendChild(card);
  scrollToBottom();
}

export function addEatingCardIfNeeded(text) {
  if (mayBeEatingConcern(text)) addEatingCard();
}
