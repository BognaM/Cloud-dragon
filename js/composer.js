// The message box and send button.

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

export function setBusy(busy) {
  state.busy = busy;
  el.sendButton.disabled = busy;
}
