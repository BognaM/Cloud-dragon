// The ring in the header: the arc shows progress, the pearl grows and glows with each level.

import { LEVELS } from "./config.js";
import { el } from "./dom.js";
import { bondProgress } from "./bond.js";

export function renderBondRing(level) {
  el.bondArc.style.strokeDasharray = `${(bondProgress() * 100).toFixed(1)} 100`;

  el.bondPearl.setAttribute("r", String(6 + level * 0.8));
  el.bondPearl.style.filter = level
    ? `drop-shadow(0 0 ${1 + level * 2}px color-mix(in srgb, var(--accent) ${35 + level * 15}%, transparent))`
    : "none";

  const name = LEVELS[level].name;
  el.bondButton.setAttribute("aria-label", `Bond: ${name}. Show details`);
  el.bondButton.title = `${name} bond`;
}
