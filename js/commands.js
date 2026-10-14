// Test commands typed in the message box, e.g. /evening or /bond 2.
// They change the preview only and are never sent to the dragon.

import { LEVELS } from "./config.js";
import { state, setPreview } from "./state.js";
import { currentLevel } from "./bond.js";
import { applySky, skyPhase } from "./sky.js";
import { renderBond } from "./header.js";
import { setStatus } from "./status.js";
import { showToast } from "./toast.js";
import { runCardCommand } from "./card-commands.js";
import { showBreakNudge } from "./break-nudge.js";
import { removeWelcome } from "./welcome.js";

const SKY_COMMANDS = {
  dawn: "dawn", morning: "dawn",
  day: "day", noon: "day",
  dusk: "dusk", evening: "dusk", sunset: "dusk",
  night: "night",
};

const HELP =
  "Test commands: /dawn /day /evening /night /now · /mist /drift /cumulus /skybound · /bond 0-3 · /bond auto · " +
  "/card [suicide|selfharm|violence|harm|substances|eating] [young] [now|mix|de|fr|it] · /break [day]";

export function isCommand(text) {
  return text.startsWith("/");
}

function setSky(phase) {
  setPreview("sky", phase);
  applySky();
  showToast(phase ? `Sky: ${phase}` : `Sky follows your clock (${skyPhase()})`);
}

function setBond(level) {
  setPreview("bond", level);
  renderBond();
  showToast(`Bond: ${LEVELS[currentLevel()].name}${state.previewBond === null ? " (real)" : ""}`);
}

// "/drift" or "/bond 1" -> 1, "/bond auto" -> null, anything else -> undefined.
function parseBondLevel(command, arg) {
  const named = LEVELS.findIndex((entry) => entry.name.toLowerCase() === command);
  if (named >= 0) return named;
  if (command !== "bond") return undefined;
  if (arg === "auto") return null;
  const level = Number(arg);
  return Number.isInteger(level) && LEVELS[level] ? level : undefined;
}

export function runCommand(text) {
  const [command, ...args] = text.slice(1).trim().toLowerCase().split(/\s+/);
  const arg = args[0];
  setStatus("");

  if (command === "break") {
    removeWelcome();
    return showBreakNudge(arg === "day" ? "day" : "session");
  }

  if (command === "card" || command === "cards") {
    const error = runCardCommand(args);
    return error ? setStatus(error, true) : undefined;
  }

  if (SKY_COMMANDS[command]) return setSky(SKY_COMMANDS[command]);
  if (command === "now") return setSky(null);

  const level = parseBondLevel(command, arg);
  if (level !== undefined) return setBond(level);

  if (command === "help") return setStatus(HELP);
  setStatus(command === "bond" ? HELP : `Unknown command /${command}. ${HELP}`, true);
}
