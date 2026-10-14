// Shows three ideas on the welcome screen (js/suggestion-pool.js). They're
// picked once per page load, so they don't change while someone is reading.

import { el } from "./dom.js";
import { pickSuggestions } from "./suggestion-pool.js";

export function renderSuggestions(onPick) {
  el.suggestions.replaceChildren(
    ...pickSuggestions().map(({ label, prompt }) => {
      const button = document.createElement("button");
      button.className = "suggestion";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => onPick(prompt));
      return button;
    })
  );
}
