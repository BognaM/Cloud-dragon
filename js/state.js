// Everything the page remembers while it's open, and how it's saved.

import { BOND_KEY, CHAT_KEY, LEVELS, SKY_COLORS } from "./config.js";
import { readJSON, removeKey, writeJSON } from "./storage.js";

function loadConversation() {
  const saved = readJSON(CHAT_KEY, []);
  return Array.isArray(saved) ? saved : [];
}

// { dragonName, userName, bondedOn: "2026-10-05" } once you've bonded.
// Bonds saved before the bond grew with time had a list of the days you
// chatted; the first is the bonding date, and the rest is dropped.
function loadBond() {
  const saved = readJSON(BOND_KEY, null);
  const bondedOn = saved?.bondedOn ?? (Array.isArray(saved?.days) ? saved.days[0] : null);
  if (!bondedOn) return null;
  return { dragonName: saved.dragonName, userName: saved.userName, bondedOn };
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

// Rewrites an older saved bond without its list of visit days.
if (state.bond) saveBond();

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
