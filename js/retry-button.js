// The small "Try again" button under the dragon's latest reply (or under the
// person's message if the reply failed or was stopped before it began). Only
// one exists at a time; sending a new message removes it.

import { el } from "./dom.js";

let current = null;

export function hideRetry() {
  current?.remove();
  current = null;
}

// `bubble`: the bubble to put the button under. `onRetry`: what it does.
export function showRetry(bubble, onRetry) {
  hideRetry();
  const wrap = bubble?.closest(".bubble-wrap") ?? el.messages.lastElementChild;
  if (!wrap) return;

  current = document.createElement("button");
  current.type = "button";
  current.className = "retry-button";
  current.textContent = "↻ Try again";
  current.addEventListener("click", () => {
    hideRetry();
    onRetry();
  });
  wrap.appendChild(current);
}
