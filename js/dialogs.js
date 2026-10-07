// Shared behavior for the pop-up windows (<dialog> elements): the ✕ button and
// a click on the dimmed area around the window close it. Escape works on its own.

export function connectDialog(dialog) {
  dialog.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
