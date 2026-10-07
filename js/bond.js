// Bond level math. The bond grows with each day you chat and never shrinks.

import { DEFAULT_DRAGON_NAME, LEVELS } from "./config.js";
import { state } from "./state.js";

// Today's local date, e.g. "2026-10-05".
export function today() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function levelForDays(days) {
  let level = 0;
  LEVELS.forEach((entry, index) => {
    if (days >= entry.days) level = index;
  });
  return level;
}

export function bondDays() {
  return state.bond ? state.bond.days.length : 0;
}

export function currentLevel() {
  return state.previewBond ?? levelForDays(bondDays());
}

// 0 to 1: how far along the four levels you are.
export function bondProgress() {
  const level = currentLevel();
  const last = LEVELS.length - 1;
  if (level === last) return 1;
  if (state.previewBond !== null) return level / last;

  const from = LEVELS[level].days;
  const to = LEVELS[level + 1].days;
  const partial = Math.min((bondDays() - from) / (to - from), 1);
  return Math.max((level + partial) / last, 0.08);
}

export function dragonName() {
  return state.bond?.dragonName || DEFAULT_DRAGON_NAME;
}
