// Making the bond on the first visit, and growing it day by day.

import { DEFAULT_DRAGON_NAME, LEVELS } from "./config.js";
import { el } from "./dom.js";
import { state, saveBond } from "./state.js";
import { bondDays, levelForDays, today } from "./bond.js";
import { renderBond } from "./header.js";
import { renderStars } from "./stars.js";
import { renderWelcome } from "./welcome.js";
import { showToast } from "./toast.js";

// Names end up in the dragon's instructions, so keep only letters, numbers,
// spaces, apostrophes and hyphens.
function cleanName(value) {
  return value.replace(/[^\p{L}\p{N} '\-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 24);
}

export function completeBonding(dragon, user) {
  state.bond = {
    dragonName: cleanName(dragon) || DEFAULT_DRAGON_NAME,
    userName: cleanName(user),
    days: [today()],
  };
  saveBond();

  el.app.classList.remove("bonding");
  renderBond();
  renderStars();
  renderWelcome();
  showToast(`You bonded with ${state.bond.dragonName} ☁️`);

  // Bring the dragon back into view. Phones would open the keyboard on focus.
  el.messages.scrollTop = 0;
  if (window.matchMedia("(pointer: fine)").matches) el.input.focus({ preventScroll: true });
}

// A day counts once you've chatted on it.
export function recordBondDay() {
  const bond = state.bond;
  if (!bond || bond.days.includes(today())) return;

  const before = levelForDays(bondDays());
  bond.days.push(today());
  saveBond();
  const after = levelForDays(bondDays());

  renderBond();
  renderStars();
  if (after > before && state.previewBond === null) {
    showToast(`Your bond deepened · ${LEVELS[after].name} ☁️`);
  }
}
