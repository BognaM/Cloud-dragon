// Settings shared by the whole page.

// Paste the URL printed by `modal deploy app.py`.
export const API_BASE = "https://bognam--ember-chat-web.modal.run";

// localStorage keys. Everything is saved in this browser only.
export const CHAT_KEY = "cloudDragon.conversation";
export const BOND_KEY = "cloudDragon.bond";

export const DEFAULT_DRAGON_NAME = "Nimbus";

// Days you've chatted with your dragon that each bond level needs.
// Levels change only the look (pearl, glow, stars), not how the dragon talks.
export const LEVELS = [
  { name: "Mist", days: 0 },
  { name: "Drift", days: 3 },
  { name: "Cumulus", days: 7 },
  { name: "Skybound", days: 14 },
];

// Browser bar color for each time of day.
export const SKY_COLORS = { dawn: "#c9d4f0", day: "#6fb2ec", dusk: "#2b285a", night: "#070b22" };
