// Chat bubbles.

import { el } from "./dom.js";
import { dragonIcon } from "./icon.js";
import { removeWelcome } from "./welcome.js";

export function scrollToBottom() {
  requestAnimationFrame(() => {
    el.messages.scrollTop = el.messages.scrollHeight;
  });
}

// Adds a message and returns its bubble, so a streaming reply can fill it in.
export function addMessage(role, text) {
  removeWelcome();

  const row = document.createElement("div");
  row.className = `message ${role}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "mini-avatar";
    avatar.appendChild(dragonIcon());
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const bubbleWrap = document.createElement("div");
  bubbleWrap.className = "bubble-wrap";
  bubbleWrap.appendChild(bubble);
  row.appendChild(bubbleWrap);

  el.messages.appendChild(row);
  scrollToBottom();
  return bubble;
}

export function removeMessage(bubble) {
  bubble?.closest(".message")?.remove();
}
