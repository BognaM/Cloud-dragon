// The small line above the message box ("Nimbus is thinking…", errors, help).

import { el } from "./dom.js";

export function setStatus(message = "", isError = false) {
  el.status.textContent = message;
  el.status.classList.toggle("error", isError);
}
