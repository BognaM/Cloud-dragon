// The welcome screen ("hero"): the bonding form on the first visit, a
// greeting and suggestions after that. It disappears with the first message.

import { el } from "./dom.js";
import { state } from "./state.js";
import { dragonName } from "./bond.js";
import { skyPhase } from "./sky.js";

export function isWelcomeShown() {
  return el.hero.isConnected;
}

export function showBondingForm() {
  el.app.classList.add("bonding"); // hides the message box until you've bonded
  el.bonding.hidden = false;
  el.welcome.hidden = true;
}

export function renderWelcome() {
  const name = state.bond?.userName ? `, ${state.bond.userName}` : "";
  const greetings = {
    dawn: `Up with the dawn${name}?`,
    day: `Clear skies today${name}.`,
    dusk: `The sky is turning gold${name}.`,
    night: `The stars are out${name}.`,
  };

  el.welcomeTitle.textContent = greetings[skyPhase()];
  el.welcomeText.textContent = `${dragonName()} is listening. Ask anything, or pick an idea below.`;
  el.bonding.hidden = true;
  el.welcome.hidden = false;
}

// Removing it also lets the 3D dragon release its GPU resources.
export function removeWelcome() {
  if (isWelcomeShown()) el.hero.remove();
}
