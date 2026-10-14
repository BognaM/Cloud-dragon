// Sending a message and streaming the dragon's reply into a bubble.

import { state, saveConversation } from "./state.js";
import { dragonName } from "./bond.js";
import { skyPhase } from "./sky.js";
import { stopOnServer, streamChat, TooManyMessages } from "./api.js";
import { addMessage, removeMessage, scrollToBottom } from "./messages.js";
import { showThinking } from "./thinking.js";
import { clearInput, setBusy } from "./composer.js";
import { setStatus } from "./status.js";
import { addCrisisCard, recentCrisis } from "./crisis-card.js";
import { crisisKind } from "./crisis-detect.js";
import { addTopicCardIfNeeded } from "./topic-card.js";
import { countSentMessage, suggestBreakIfDue } from "./break-nudge.js";
import { hideRetry, showRetry } from "./retry-button.js";
import { careReply, careSummary } from "./care-replies.js";

// "in about 40 seconds", "in about 5 minutes", "in about 3 hours".
function waitText(seconds) {
  const about = (count, unit) => `in about ${count} ${unit}${count === 1 ? "" : "s"}`;
  if (seconds < 60) return about(seconds, "second");
  if (seconds < 3600) return about(Math.ceil(seconds / 60), "minute");
  return about(Math.ceil(seconds / 3600), "hour");
}

// Everything the person has written, so a help card can pick fitting numbers.
export function userTexts(messages) {
  return messages.filter((message) => message.role === "user").map((message) => message.content);
}

// Pre-written crisis replies reach the model in their short version.
function forModel(message) {
  // Chats saved before self-harm had its own reply have no careKind: suicide.
  return message.care
    ? { role: "assistant", content: careSummary(message.careKind || "suicide", message.care) }
    : message;
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

// A message that may be about suicide or self-harm gets a crisis card and a
// pre-written, careful reply right away, instead of a reply from the model.
// `{ kind, language }` comes from crisisKind() in js/crisis-detect.js.
function replyWithCare({ kind, language }, text) {
  addCrisisCard(kind, language, text, userTexts(state.conversation));
  const reply = careReply(kind, language);
  // `care` and `careKind` remember which reply it was, so the model gets the
  // short version later.
  state.conversation.push({ role: "assistant", content: reply, care: language, careKind: kind });
  saveConversation();
  addMessage("assistant", reply);
}

export async function sendMessage(text) {
  hideRetry();
  state.conversation.push({ role: "user", content: text });
  saveConversation();
  addMessage("user", text);
  clearInput();
  setStatus("");
  countSentMessage();

  const crisis = crisisKind(text);
  if (crisis) {
    replyWithCare(crisis, text);
    return;
  }
  // Help for violence, harming others, substances or eating appears above the reply.
  addTopicCardIfNeeded(text, userTexts(state.conversation));

  await requestReply();
}

// The Stop button: stops reading the reply and tells the server to stop writing it.
let controller = null;
let replyId = null;
export function stopReply() {
  controller?.abort();
  if (replyId) stopOnServer(replyId);
}

// "Try again": drops the dragon's last reply (if any) and asks for a new one.
export function retryReply() {
  const last = state.conversation.at(-1);
  if (last?.role === "assistant" && !last.care) {
    state.conversation.pop();
    saveConversation();
    removeMessage([...document.querySelectorAll(".message.assistant .bubble")].at(-1));
  }
  setStatus("");
  requestReply();
}

// Keeps the reply (in full, or as far as it got before Stop) and offers "Try again".
function keepReply(bubble, answer, stopped) {
  bubble.classList.remove("streaming");
  bubble.textContent = answer;
  if (stopped) bubble.classList.add("stopped");
  state.conversation.push({ role: "assistant", content: answer });
  saveConversation();
  showRetry(bubble, retryReply);
}

// Streams the dragon's reply to the conversation so far into a new bubble.
async function requestReply() {
  setBusy(true);
  controller = new AbortController();
  replyId = crypto.randomUUID();
  const stopThinking = showThinking(dragonName());
  let bubble = null;
  let soFar = "";

  try {
    const answer = await streamChat({ ...chatPayload(), reply_id: replyId }, {
      signal: controller.signal,
      onText(text) {
        // The first words replace the thinking animation with the reply bubble.
        if (!bubble) {
          stopThinking();
          bubble = addMessage("assistant", "");
          bubble.classList.add("streaming");
        }
        soFar = text.trim();
        bubble.textContent = text.trimStart();
        scrollToBottom();
      },
    });

    if (!answer) throw new Error("Empty reply");
    keepReply(bubble, answer, false);
    // Not right after a crisis message, where it would sound dismissive.
    if (!recentCrisis(state.conversation)) suggestBreakIfDue();
  } catch (error) {
    stopThinking();
    if (error.name === "AbortError" && soFar) {
      keepReply(bubble, soFar, true);
      return;
    }
    removeMessage(bubble);
    showRetry(null, retryReply);
    if (error.name === "AbortError") {
      setStatus("Stopped.");
    } else if (error instanceof TooManyMessages) {
      setStatus(`${dragonName()} needs a short rest. You can send another message ${waitText(error.retryAfter)}.`);
    } else {
      console.error(error);
      setStatus(`Could not reach ${dragonName()}. Check your Modal URL and deployment.`, true);
    }
  } finally {
    controller = null;
    replyId = null;
    setBusy(false);
  }
}
