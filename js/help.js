// The Help & info window: opened by any element with data-open-help (the
// welcome screen button and the note under the message box).

import { el } from "./dom.js";

export function initHelp() {
  document.querySelectorAll("[data-open-help]").forEach((button) => {
    button.addEventListener("click", () => el.helpDialog.showModal());
  });

  el.helpDialog.querySelector("[data-close-help]").addEventListener("click", () => el.helpDialog.close());

  // A click on the dimmed area around the window closes it too. (Escape works on its own.)
  el.helpDialog.addEventListener("click", (event) => {
    if (event.target === el.helpDialog) el.helpDialog.close();
  });
}
