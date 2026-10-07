// Sending a message and streaming the dragon's reply into a bubble.

import { state, saveConversation } from "./state.js";
import { currentLevel, dragonName } from "./bond.js";
import { skyPhase } from "./sky.js";
import { streamChat } from "./api.js";
import { addMessage, removeMessage, scrollToBottom } from "./messages.js";
import { showThinking } from "./thinking.js";
import { clearInput, setBusy } from "./composer.js";
import { setStatus } from "./status.js";
import { recordBondDay } from "./bonding.js";

function chatPayload() {
  return {
    messages: state.conversation,
    bond: currentLevel(),
    user_name: state.bond?.userName || "",
    dragon_name: dragonName(),
    time_of_day: skyPhase(),
  };
}

export async function sendMessage(text) {
  state.conversation.push({ role: "user", content: text });
  saveConversation();
  addMessage("user", text);

  clearInput();
  setBusy(true);
  setStatus("");

  const stopThinking = showThinking(dragonName());
  let bubble = null;

  try {
    const answer = await streamChat(chatPayload(), {
      onText(soFar) {
        // The first words replace the thinking animation with the reply bubble.
        if (!bubble) {
          stopThinking();
          bubble = addMessage("assistant", "");
          bubble.classList.add("streaming");
        }
        bubble.textContent = soFar.trimStart();
        scrollToBottom();
      },
    });

    if (!answer) throw new Error("Empty reply");

    bubble.classList.remove("streaming");
    bubble.textContent = answer;
    state.conversation.push({ role: "assistant", content: answer });
    saveConversation();
    recordBondDay();
  } catch (error) {
    console.error(error);
    stopThinking();
    removeMessage(bubble);
    setStatus(`Could not reach ${dragonName()}. Check your Modal URL and deployment.`, true);
  } finally {
    setBusy(false);
  }
}
