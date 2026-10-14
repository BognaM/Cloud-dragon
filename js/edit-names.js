// Editing your name and your dragon's name in the bond panel.

import { DEFAULT_DRAGON_NAME } from "./config.js";
import { el } from "./dom.js";
import { state, saveBond } from "./state.js";
import { cleanName } from "./names.js";
import { renderBond } from "./header.js";
import { isWelcomeShown, renderWelcome } from "./welcome.js";

function showForm(open) {
  el.editNamesForm.hidden = !open;
  el.editNamesButton.hidden = open;
  if (!open) return;
  el.editUserName.value = state.bond.userName || "";
  el.editDragonName.value = state.bond.dragonName || "";
  el.editUserName.focus();
}

function saveNames(event) {
  event.preventDefault();
  state.bond.userName = cleanName(el.editUserName.value);
  state.bond.dragonName = cleanName(el.editDragonName.value) || DEFAULT_DRAGON_NAME;
  saveBond();
  showForm(false);
  renderBond(); // the header, the bond panel and what the dragon knows
  if (isWelcomeShown()) renderWelcome();
}

export function initEditNames() {
  el.editNamesButton.addEventListener("click", () => showForm(true));
  el.cancelEditNames.addEventListener("click", () => showForm(false));
  el.editNamesForm.addEventListener("submit", saveNames);
}
