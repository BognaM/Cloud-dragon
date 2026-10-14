// "What your dragon knows" in the bond panel (shapeof.ai: Memory): the dragon
// knows only what's listed here, and nothing is kept on the server.
// Editing the names: js/edit-names.js.

import { MESSAGES_THE_DRAGON_SEES } from "./config.js";
import { el } from "./dom.js";
import { state } from "./state.js";
import { dragonName } from "./bond.js";

function bondedOnText() {
  const [year, month, day] = state.bond.bondedOn.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function renderKnows() {
  if (!state.bond) return;
  const name = dragonName();
  el.knowsTitle.textContent = `What ${name} knows`;
  const facts = [
    `Your name: ${state.bond.userName || "not given"}`,
    `Its name: ${name}`,
    `When you bonded: ${bondedOnText()}`,
    `Only the last ${MESSAGES_THE_DRAGON_SEES} messages of this chat, nothing from other chats.`,
    "All of it is saved only in this browser.",
  ];
  el.knowsList.replaceChildren(
    ...facts.map((fact) => {
      const item = document.createElement("li");
      item.textContent = fact;
      return item;
    })
  );
}
