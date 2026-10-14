// When to suggest a break (APA health advisory, rec 2: "nudges that encourage
// users to take breaks"). Only counts and times, never what was written.
// No page code here, so tests/break-rules.test.mjs can check it directly.

const MINUTE = 60 * 1000;

// A chat session ends after this long without a message.
export const SESSION_GAP = 30 * MINUTE;
// Suggest a break after this much continuous chatting…
export const LONG_SESSION = 30 * MINUTE;
// …or after this many messages in one day.
export const MANY_MESSAGES = 40;

// `usage`: what was saved last time (or null). `now`: ms; `day`: "2026-10-14".
// Returns the updated usage after one more message.
export function countMessage(usage, now, day) {
  const next = { ...(usage ?? {}) };
  if (next.day !== day) {
    next.day = day;
    next.messagesToday = 0;
    next.remindedToday = false;
  }
  if (next.lastMessage == null || now - next.lastMessage > SESSION_GAP) {
    next.sessionStart = now;
    next.remindedThisSession = false;
  }
  next.lastMessage = now;
  next.messagesToday += 1;
  return next;
}

// "session", "day" or null: why to suggest a break now, at most once per
// session and once per day.
export function breakReason(usage, now) {
  if (!usage) return null;
  if (!usage.remindedThisSession && now - usage.sessionStart >= LONG_SESSION) return "session";
  if (!usage.remindedToday && usage.messagesToday >= MANY_MESSAGES) return "day";
  return null;
}

// Remembers that a reminder was shown, so it isn't repeated. Either reason
// counts for both: one reminder per session is enough.
export function markReminded(usage) {
  const remindedToday = Boolean(usage.remindedToday) || usage.messagesToday >= MANY_MESSAGES;
  return { ...usage, remindedThisSession: true, remindedToday };
}
