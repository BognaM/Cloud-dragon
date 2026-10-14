// Deleting everything this page has saved: the chat, the bond and the names.
// The server keeps nothing, so this browser's storage is all there is.
// Used by "Delete my chat and data" in Help & info and by "Release bond…".

import { forgetBond, forgetConversation } from "./state.js";

// Asks first, then deletes and starts over on the bonding screen.
export function deleteAllData(question) {
  if (!confirm(question)) return;
  forgetBond();
  forgetConversation();
  location.reload();
}

// The button is in the help text, which appears twice (welcome screen and the
// Help & info window), so listen on the whole page.
export function initDeleteData() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-delete-data]")) return;
    deleteAllData(
      "Delete your chat, your bond and the names you gave from this browser? This can't be undone."
    );
  });
}
