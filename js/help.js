// The help text about talking to an AI dragon is written once, in
// <template id="helpContent">. This copies it into the accordion on the welcome
// screen and into the Help & info window, which the "Help & info" link under
// the message box opens during the chat.

import { el } from "./dom.js";

function fillHelpText() {
  const content = document.getElementById("helpContent").content;
  document.querySelectorAll(".help-body").forEach((body) => {
    body.replaceChildren(content.cloneNode(true));
  });
}

function connectWindow() {
  document.querySelectorAll("[data-open-help]").forEach((button) => {
    button.addEventListener("click", () => el.helpDialog.showModal());
  });

  el.helpDialog.querySelector("[data-close-help]").addEventListener("click", () => el.helpDialog.close());

  // A click on the dimmed area around the window closes it too. (Escape works on its own.)
  el.helpDialog.addEventListener("click", (event) => {
    if (event.target === el.helpDialog) el.helpDialog.close();
  });
}

export function initHelp() {
  fillHelpText();
  connectWindow();
}
