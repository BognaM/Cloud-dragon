// Private chat ("Don't save this chat", for shared devices): the chat stays on
// screen but nothing of it is saved, and its saved copy is deleted. Reloading,
// closing the page or New chat ends it, and the chat is gone.
// The button is in the help text, which appears twice, so listen on the page.

import { el } from "./dom.js";
import { state, forgetConversation } from "./state.js";

function render() {
  el.privateNote.hidden = !state.privateChat;
  document.querySelectorAll("[data-private-chat]").forEach((button) => {
    button.disabled = state.privateChat;
    button.textContent = state.privateChat ? "This chat isn't being saved" : "Don't save this chat";
  });
}

export function startPrivateChat() {
  state.privateChat = true;
  forgetConversation();
  render();
}

export function initPrivateChat() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-private-chat]")) startPrivateChat();
  });
  render();
}
