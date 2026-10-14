// Checks when the page suggests a break (js/break-rules.js). Run from the project folder:
//   node tests/break-rules.test.mjs

import { loadModule } from "./load-module.mjs";

const { countMessage, breakReason, markReminded, MANY_MESSAGES } = await loadModule("js/break-rules.js");

const MINUTE = 60 * 1000;
const DAY = "2026-10-14";
let failures = 0;
const check = (name, got, expected) => {
  if (got !== expected) {
    failures++;
    console.log(`WRONG   ${name}: ${got} (expected ${expected})`);
  }
};

// Chat every 2 minutes from 0 until `minutes`, from a given start.
function chat(usage, fromMinute, toMinute, day = DAY) {
  for (let minute = fromMinute; minute <= toMinute; minute += 2) usage = countMessage(usage, minute * MINUTE, day);
  return usage;
}

let usage = chat(null, 0, 20);
check("20 minutes: no break yet", breakReason(usage, 20 * MINUTE), null);

usage = chat(usage, 22, 30);
check("30 minutes: suggest a break", breakReason(usage, 30 * MINUTE), "session");

usage = markReminded(usage);
usage = chat(usage, 32, 50);
check("only once per session", breakReason(usage, 50 * MINUTE), null);

usage = chat(usage, 90, 100);
check("a 40-minute gap starts a new session", breakReason(usage, 100 * MINUTE), null);
usage = chat(usage, 102, 120);
check("30 minutes into the new session: again", breakReason(usage, 120 * MINUTE), "session");

let many = null;
for (let n = 0; n < MANY_MESSAGES; n++) many = countMessage(many, n * 31 * MINUTE, DAY); // short, separate sessions
check(`${MANY_MESSAGES} messages in a day`, breakReason(many, (MANY_MESSAGES - 1) * 31 * MINUTE), "day");
many = markReminded(many);
many = countMessage(many, (MANY_MESSAGES + 1) * 31 * MINUTE, DAY);
check("only once per day", breakReason(many, (MANY_MESSAGES + 1) * 31 * MINUTE), null);
many = countMessage(many, (MANY_MESSAGES + 2) * 31 * MINUTE, "2026-10-15");
check("the next day starts again from 0", many.messagesToday, 1);

check("nothing saved yet", breakReason(null, 0), null);

console.log(failures ? `\n${failures} problem(s).` : "All break-reminder rules work.");
process.exitCode = failures ? 1 : 0;
