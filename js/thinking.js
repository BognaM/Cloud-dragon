// While the dragon is thinking, a small 3D dragon flies above the message box
// (see dragon/thinking.js) with a "Nimbus is thinking…" label next to it.

import { startThinkingFlight } from "../dragon/thinking.js";
import { el } from "./dom.js";

// Starts the thinking animation and returns a function that removes it.
export function showThinking(dragonName) {
  el.thinkingText.textContent = `${dragonName} is thinking…`;
  el.thinkingSky.hidden = false;
  const stopFlight = startThinkingFlight(el.thinkingStage);

  return () => {
    stopFlight();
    el.thinkingSky.hidden = true;
  };
}
