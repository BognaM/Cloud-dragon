// Everything the page remembers while it's open, and how it's saved.

import { BOND_KEY, CHAT_KEY, LEVELS, SKY_COLORS } from "./config.js";
import { readJSON, removeKey, writeJSON } from "./storage.js";

function loadConversation() {
  const saved = readJSON(CHAT_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

// { dragonName, userName, days: ["2026-10-05", ...] } once you've bonded.
function loadBond() {
  const saved = readJSON(BOND_KEY, null);
  return saved && Array.isArray(saved.days) ? saved : null;
}

// Preview overrides: ?sky=night shows another time of day, ?bond=3 another
// bond level. They come from the address bar and are never saved.
const params = new URLSearchParams(location.search);
const skyParam = params.get("sky");
const bondParam = params.get("bond") ?? "";

export const state = {
  conversation: loadConversation(),
  bond: loadBond(),
  previewSky: SKY_COLORS[skyParam] ? skyParam : null,
  previewBond: /^\d$/.test(bondParam) && LEVELS[Number(bondParam)] ? Number(bondParam) : null,
  busy: false,
};

export function saveConversation() {
  writeJSON(CHAT_KEY, state.conversation);
}

export function saveBond() {
  writeJSON(BOND_KEY, state.bond);
}

export function forgetConversation() {
  removeKey(CHAT_KEY);
}

export function forgetBond() {
  removeKey(BOND_KEY);
}

// Sets a preview override and mirrors it in the address bar, so a reload keeps it.
export function setPreview(name, value) {
  if (name === "sky") state.previewSky = value;
  if (name === "bond") state.previewBond = value;

  const url = new URL(location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  history.replaceState(null, "", url);
}
