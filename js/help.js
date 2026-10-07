// The help text about talking to an AI dragon lives in the welcome-screen
// accordion (#helpContent), so it shows even without scripts. This copies it
// into the Help & info window, which the "Help & info" link under the message
// box opens during the chat.

import { el } from "./dom.js";
import { connectDialog } from "./dialogs.js";

function fillWindow() {
  const source = document.getElementById("helpContent");
  const copy = [...source.childNodes].map((node) => node.cloneNode(true));
  el.helpDialog.querySelector(".help-body").replaceChildren(...copy);
}

function connectWindow() {
  document.querySelectorAll("[data-open-help]").forEach((button) => {
    button.addEventListener("click", () => el.helpDialog.showModal());
  });
  connectDialog(el.helpDialog);
}

// Runs before a saved chat is restored, which removes the welcome screen.
export function initHelp() {
  fillWindow();
  connectWindow();
}
