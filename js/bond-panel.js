// The panel that opens from the bond ring: level, days and progress.

import { LEVELS } from "./config.js";
import { el } from "./dom.js";
import { state } from "./state.js";
import { bondDays, dragonName } from "./bond.js";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

function progressText(level) {
  const days = bondDays();
  const next = LEVELS[level + 1];
  const talked = `You've talked on ${plural(days, "day")}. `;

  if (!next) return talked + "Your bond can't grow any deeper.";
  if (state.previewBond !== null) return talked;
  return talked + `${plural(next.days - days, "more day")} until ${next.name}.`;
}

export function renderBondPanel(level) {
  el.bondPanelTitle.textContent = `${dragonName()} · ${LEVELS[level].name} bond`;
  el.bondPanelText.textContent = progressText(level);

  el.bondLevels.replaceChildren(
    ...LEVELS.map((entry, index) => {
      const item = document.createElement("div");
      item.className = "level";
      item.classList.toggle("reached", index <= level);
      item.classList.toggle("current", index === level);
      item.textContent = entry.name;
      return item;
    })
  );
}

export function toggleBondPanel(open = el.bondPanel.hidden) {
  el.bondPanel.hidden = !open;
  el.bondButton.setAttribute("aria-expanded", String(open));
}
