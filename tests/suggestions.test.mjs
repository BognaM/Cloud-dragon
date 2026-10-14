// Checks how the welcome screen picks its three ideas (js/suggestion-pool.js).
// Run from the project folder:
//   node tests/suggestions.test.mjs

import { loadModule } from "./load-module.mjs";

const { SUGGESTIONS, pickSuggestions } = await loadModule("js/suggestion-pool.js");

// Repeatable random numbers, so a failure can be reproduced.
let seed = 42;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

let failures = 0;
const seen = new Set();
for (let run = 0; run < 500; run++) {
  const picked = pickSuggestions(random);
  const labels = picked.map((s) => s.label);
  if (picked.length !== 3 || new Set(labels).size !== 3) {
    failures++;
    console.log(`NOT 3 DIFFERENT   ${labels.join(" | ")}`);
  }
  if (!picked.some((s) => s.exercise)) {
    failures++;
    console.log(`NO EXERCISE   ${labels.join(" | ")}`);
  }
  labels.forEach((label) => seen.add(label));
}
for (const { label } of SUGGESTIONS) {
  if (!seen.has(label)) {
    failures++;
    console.log(`NEVER SHOWN   ${label}`);
  }
}

console.log(failures ? `\n${failures} problem(s).` : `500 picks: always 3 different ideas with an exercise, and all ${SUGGESTIONS.length} ideas appear.`);
process.exitCode = failures ? 1 : 0;
