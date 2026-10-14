// Checks the bond's date math (js/bond-time.js). Run from the project folder:
//   node tests/bond-time.test.mjs

import { loadModule } from "./load-module.mjs";

const { daysBetween, levelForDays } = await loadModule("js/bond-time.js");
const { LEVELS } = await loadModule("js/config.js");

let failures = 0;
const check = (name, got, expected) => {
  if (got !== expected) {
    failures++;
    console.log(`WRONG   ${name}: ${got} (expected ${expected})`);
  }
};

check("same day", daysBetween("2026-10-14", "2026-10-14"), 0);
check("next day", daysBetween("2026-10-14", "2026-10-15"), 1);
check("across a month", daysBetween("2026-09-28", "2026-10-05"), 7);
check("across the clock change (25 Oct 2026)", daysBetween("2026-10-20", "2026-10-30"), 10);
check("across a year", daysBetween("2026-12-31", "2027-01-14"), 14);
check("a date in the future counts as 0", daysBetween("2026-10-20", "2026-10-14"), 0);

check("bonded today: Mist", LEVELS[levelForDays(0, LEVELS)].name, "Mist");
check("2 days: still Mist", LEVELS[levelForDays(2, LEVELS)].name, "Mist");
check("3 days: Drift", LEVELS[levelForDays(3, LEVELS)].name, "Drift");
check("a week: Cumulus", LEVELS[levelForDays(7, LEVELS)].name, "Cumulus");
check("two weeks: Skybound", LEVELS[levelForDays(14, LEVELS)].name, "Skybound");
check("a year: still Skybound", LEVELS[levelForDays(365, LEVELS)].name, "Skybound");

console.log(failures ? `\n${failures} problem(s).` : "The bond's date math works.");
process.exitCode = failures ? 1 : 0;
