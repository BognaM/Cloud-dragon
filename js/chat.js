// Sending a message and streaming the dragon's reply into a bubble.

import { state, saveConversation } from "./state.js";
import { dragonName } from "./bond.js";
import { skyPhase } from "./sky.js";
import { streamChat } from "./api.js";
import { addMessage, removeMessage, scrollToBottom } from "./messages.js";
import { showThinking } from "./thinking.js";
import { clearInput, setBusy } from "./composer.js";
import { setStatus } from "./status.js";
import { recordBondDay } from "./bonding.js";
import { addCrisisCard, recentCrisis } from "./crisis-card.js";
import { crisisLanguage } from "./crisis-detect.js";
import { addEatingCardIfNeeded } from "./eating-card.js";
import { careReply, careSummary } from "./care-replies.js";

// Everything the person has written, so a help card can pick fitting numbers.
export function userTexts(messages) {
  return messages.filter((message) => message.role === "user").map((message) => message.content);
}

// Pre-written crisis replies reach the model in their short version.
function forModel(message) {
  return message.care ? { role: "assistant", content: careSummary(message.care) } : message;
}

function chatPayload() {
  return {
    messages: state.conversation.map(forModel),
    user_name: state.bond?.userName || "",
    dragon_name: dragonName(),
    time_of_day: skyPhase(),
    // Asks the dragon to follow its extra safety rule (server/safety.py).
    crisis: recentCrisis(state.conversation),
  };
}

// A message that may be about suicide or self-harm gets the crisis card and a
// pre-written, careful reply right away, instead of a reply from the model.
function replyWithCare(language, text) {
  addCrisisCard(text, userTexts(state.conversation));
  const reply = careReply(language);
  // `care` remembers the language, so the model gets the short version later.
  state.conversation.push({ role: "assistant", content: reply, care: language });
  saveConversation();
  addMessage("assistant", reply);
}

export async function sendMessage(text) {
  state.conversation.push({ role: "user", content: text });
  saveConversation();
  addMessage("user", text);
  clearInput();
  setStatus("");

  const language = crisisLanguage(text);
  if (language) {
    replyWithCare(language, text);
    return;
  }
  // Eating-disorder services appear above the dragon's reply.
  addEatingCardIfNeeded(text, userTexts(state.conversation));

  setBusy(true);

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
