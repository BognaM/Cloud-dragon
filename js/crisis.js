// The canton picker in the crisis note: shows the psychiatric emergency service
// for the chosen canton and remembers the choice in this browser.

import { REGION_KEY } from "./config.js";
import { CANTON_CRISIS_LINES } from "./crisis-lines.js";
import { el } from "./dom.js";
import { readJSON, writeJSON } from "./storage.js";

// A tap-to-call link; the visible number keeps its spaces for readability.
function phoneLink(number) {
  const link = document.createElement("a");
  link.href = `tel:${number.replace(/\s/g, "")}`;
  link.textContent = number;
  return link;
}

function renderRegion(region) {
  const entry = CANTON_CRISIS_LINES.find((item) => item.region === region);
  if (!entry) {
    el.crisisRegionLines.replaceChildren();
    return;
  }

  if (!entry.lines.length) {
    el.crisisRegionLines.textContent =
      "There's no regional number for your canton in our list. Call 143 to talk to someone, or 144 in an emergency.";
    return;
  }

  const list = document.createElement("ul");
  for (const { who, number } of entry.lines) {
    const item = document.createElement("li");
    item.append(phoneLink(number), ` ${who}`);
    list.appendChild(item);
  }
  el.crisisRegionLines.replaceChildren(list);
}

export function initCrisisLines() {
  for (const { region } of CANTON_CRISIS_LINES) {
    el.crisisRegion.add(new Option(region, region));
  }

  const saved = readJSON(REGION_KEY, "");
  if (CANTON_CRISIS_LINES.some((item) => item.region === saved)) el.crisisRegion.value = saved;
  renderRegion(el.crisisRegion.value);

  el.crisisRegion.addEventListener("change", () => {
    writeJSON(REGION_KEY, el.crisisRegion.value);
    renderRegion(el.crisisRegion.value);
  });
}
