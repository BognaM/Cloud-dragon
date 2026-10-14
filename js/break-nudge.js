// Counts messages and, after a long chat, suggests a break in the chat
// (rules in js/break-rules.js). Only counts and times are saved, never text.

import { USAGE_KEY } from "./config.js";
import { el } from "./dom.js";
import { readJSON, writeJSON } from "./storage.js";
import { today } from "./bond.js";
import { scrollToBottom } from "./messages.js";
import { breakReason, countMessage, markReminded } from "./break-rules.js";

const REASONS = {
  session: "You've been chatting for over half an hour.",
  day: "You've sent a lot of messages today.",
};

export function showBreakNudge(reason) {
  const nudge = el.breakNudgeTemplate.content.firstElementChild.cloneNode(true);
  nudge.querySelector(".break-reason").textContent = REASONS[reason];
  nudge.querySelector(".break-ok").addEventListener("click", () => nudge.remove());
  el.messages.appendChild(nudge);
  scrollToBottom();
}

// Call for every message the person sends.
export function countSentMessage() {
  writeJSON(USAGE_KEY, countMessage(readJSON(USAGE_KEY, null), Date.now(), today()));
}

// Call after the dragon has replied. Shows the reminder if it's time.
export function suggestBreakIfDue() {
  const usage = readJSON(USAGE_KEY, null);
  const reason = breakReason(usage, Date.now());
  if (!reason) return;
  writeJSON(USAGE_KEY, markReminded(usage));
  showBreakNudge(reason);
}
