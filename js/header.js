// The header: dragon name, bond level, bond ring and New chat button.

import { LEVELS } from "./config.js";
import { el } from "./dom.js";
import { state } from "./state.js";
import { currentLevel, dragonName } from "./bond.js";
import { renderBondRing } from "./bond-ring.js";
import { renderBondPanel } from "./bond-panel.js";
import { renderKnows } from "./bond-knows.js";

export function renderBond() {
  const level = currentLevel();
  // The 3D dragon reads data-bond to set its glow.
  document.documentElement.dataset.bond = String(level);
  document.dispatchEvent(new CustomEvent("dragon:update"));

  const bonded = Boolean(state.bond);
  el.bondButton.hidden = !bonded;
  el.newChatButton.hidden = !bonded;

  if (!bonded) {
    el.dragonTitle.textContent = "Cloud dragon";
    el.subtitle.textContent = "waiting to bond";
    return;
  }

  const name = dragonName();
  const preview = state.previewBond !== null ? " (preview)" : "";
  el.dragonTitle.textContent = name;
  el.subtitle.textContent = `cloud dragon · ${LEVELS[level].name} bond${preview}`;
  el.input.placeholder = `Message ${name}...`;
  document.title = `${name} · Cloud Dragon`;

  renderBondRing(level);
  renderBondPanel(level);
  renderKnows();
}
