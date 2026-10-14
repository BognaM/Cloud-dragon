// The panel that opens from the bond ring: level, days, and what the bond does.
// It doesn't count down to the next level, so it doesn't nudge people to come back.

import { LEVELS } from "./config.js";
import { el } from "./dom.js";
import { daysSinceBonding, dragonName } from "./bond.js";

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
const bonded = (days) => (days === 0 ? "today" : days === 1 ? "yesterday" : `${plural(days, "day")} ago`);

function bondText() {
  return (
    `You bonded with ${dragonName()} ${bonded(daysSinceBonding())}. ` +
    `Your bond changes the sky's glow and the night stars, not how ${dragonName()} talks to you.`
  );
}

export function renderBondPanel(level) {
  el.bondPanelTitle.textContent = `${dragonName()} · ${LEVELS[level].name} bond`;
  el.bondPanelText.textContent = bondText();

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
