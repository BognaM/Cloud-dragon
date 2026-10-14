// Bond level math. The bond grows with the days since bonding, whether or not
// you come back, and never shrinks (date math in js/bond-time.js).

import { DEFAULT_DRAGON_NAME, LEVELS } from "./config.js";
import { state } from "./state.js";
import { daysBetween, levelForDays } from "./bond-time.js";

// Today's local date, e.g. "2026-10-05".
export function today() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Days since bonding: the bond grows with time, not with visits.
export function daysSinceBonding() {
  return state.bond ? daysBetween(state.bond.bondedOn, today()) : 0;
}

export function currentLevel() {
  return state.previewBond ?? levelForDays(daysSinceBonding(), LEVELS);
}

export function dragonName() {
  return state.bond?.dragonName || DEFAULT_DRAGON_NAME;
}
