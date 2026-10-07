// Which sky to show: it follows your clock unless a preview overrides it.

import { SKY_COLORS } from "./config.js";
import { el } from "./dom.js";
import { state } from "./state.js";

export function skyPhase() {
  if (state.previewSky) return state.previewSky;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

// Sets <html data-sky>, which switches the colors (styles/themes.css) and the
// 3D dragon's tint. Fires "sky:change" when the time of day changes.
export function applySky() {
  const phase = skyPhase();
  if (document.documentElement.dataset.sky === phase) return;

  document.documentElement.dataset.sky = phase;
  el.themeColor.content = SKY_COLORS[phase];
  document.body.style.background = SKY_COLORS[phase];
  document.dispatchEvent(new CustomEvent("sky:change"));
}
