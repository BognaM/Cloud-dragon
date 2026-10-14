// The message box and the send button (a Stop button while a reply streams).

import { el } from "./dom.js";
import { state } from "./state.js";

const MIN_HEIGHT = 46;
const MAX_HEIGHT = 130;

// Grows the box with its text, up to a limit.
export function autoResize() {
  el.input.style.height = `${MIN_HEIGHT}px`;
  el.input.style.height = `${Math.min(el.input.scrollHeight, MAX_HEIGHT)}px`;
}

export function clearInput() {
  el.input.value = "";
  autoResize();
}

// While a reply streams, the send button becomes a Stop button in the same place.
export function setBusy(busy) {
  state.busy = busy;
  el.sendButton.classList.toggle("stop", busy);
  el.sendButton.textContent = busy ? "■" : "➤";
  el.sendButton.title = busy ? "Stop" : "Send";
  el.sendButton.setAttribute("aria-label", busy ? "Stop the reply" : "Send message");
}
