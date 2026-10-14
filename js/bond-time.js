// Date math for the bond, which grows with the time since bonding, not with
// visits: coming back earns nothing and staying away costs nothing (APA
// health advisory, rec 2). No page code here, so tests can check it directly.

// Whole calendar days from one "2026-10-05" date to another, ignoring the time
// of day and daylight-saving changes.
export function daysBetween(from, to) {
  const utc = (date) => {
    const [year, month, day] = date.split("-").map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.max(0, Math.round((utc(to) - utc(from)) / 86400000));
}

// The highest level whose `days` have passed. `levels`: LEVELS in js/config.js.
export function levelForDays(days, levels) {
  let level = 0;
  levels.forEach((entry, index) => {
    if (days >= entry.days) level = index;
  });
  return level;
}
