// Starts the page and connects buttons to what they do.

import { el } from "./dom.js";
import { state, forgetConversation } from "./state.js";
import { dragonName } from "./bond.js";
import { applySky } from "./sky.js";
import { renderStars } from "./stars.js";
import { renderBond } from "./header.js";
import { toggleBondPanel } from "./bond-panel.js";
import { completeBonding } from "./bonding.js";
import { isWelcomeShown, renderWelcome, showBondingForm } from "./welcome.js";
import { addMessage } from "./messages.js";
import { autoResize, clearInput } from "./composer.js";
import { sendMessage, userTexts } from "./chat.js";
import { isCommand, runCommand } from "./commands.js";
import { initHelp } from "./help.js";
import { initResearch } from "./research.js";
import { deleteAllData, initDeleteData } from "./delete-data.js";
import { addCrisisCard } from "./crisis-card.js";
import { addTopicCardIfNeeded } from "./topic-card.js";
import { crisisKind } from "./crisis-detect.js";

const SKY_CHECK_MS = 60 * 1000;

function submit(text) {
  text = text.trim();
  if (!text || state.busy) return;
  if (isCommand(text)) {
    clearInput();
    runCommand(text);
  } else {
    sendMessage(text);
  }
}

function start() {
  initHelp();
  initResearch();
  initDeleteData();
  applySky();
  setInterval(applySky, SKY_CHECK_MS);
  renderStars();
  renderBond();

  if (!state.bond) {
    showBondingForm();
  } else if (state.conversation.length) {
    // Restore a saved chat. The welcome screen (and the dragon) only appear for new chats.
    state.conversation.forEach((message, index) => {
      addMessage(message.role, message.content);
      if (message.role !== "user") return;
      // The same card, with the same numbers, as when the message was sent.
      const texts = userTexts(state.conversation.slice(0, index + 1));
      const crisis = crisisKind(message.content);
      if (crisis) addCrisisCard(crisis.kind, message.content, texts);
      else addTopicCardIfNeeded(message.content, texts);
    });
  } else {
    renderWelcome();
  }
}

function connectBonding() {
  el.bonding.addEventListener("submit", (event) => {
    event.preventDefault();
    completeBonding(el.dragonNameInput.value, el.userNameInput.value);
  });
  el.skipButton.addEventListener("click", () => completeBonding("", ""));
}

function connectBondPanel() {
  el.bondButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleBondPanel();
  });

  // Close on a click outside the panel, or on Escape.
  document.addEventListener("click", (event) => {
    if (!el.bondPanel.hidden && !el.bondPanel.contains(event.target)) toggleBondPanel(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !el.bondPanel.hidden) toggleBondPanel(false);
  });

  el.releaseButton.addEventListener("click", () => {
    deleteAllData(`Release your bond with ${dragonName()}? Your bond level and this chat will be forgotten.`);
  });
}

function connectChat() {
  el.newChatButton.addEventListener("click", () => {
    if (state.busy) return;
    forgetConversation();
    location.reload(); // Brings back the welcome screen and the dragon. The bond stays.
  });

  el.sendButton.addEventListener("click", () => submit(el.input.value));
  el.input.addEventListener("input", autoResize);
  el.input.addEventListener("keydown", (event) => {
    // Enter sends on desktop. On phones, Enter adds a new line.
    const desktop = window.matchMedia("(pointer: fine)").matches;
    if (event.key === "Enter" && !event.shiftKey && desktop) {
      event.preventDefault();
      submit(el.input.value);
    }
  });

  el.suggestions.forEach((button) => {
    button.addEventListener("click", () => submit(button.dataset.prompt));
  });

  // The greeting mentions the time of day, so refresh it when the sky changes.
  document.addEventListener("sky:change", () => {
    if (state.bond && isWelcomeShown()) renderWelcome();
    // The bond grows with time, so a page left open shows the new day's level.
    renderBond();
    renderStars();
  });
}

start();
connectBonding();
connectBondPanel();
connectChat();
