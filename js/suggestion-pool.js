// The ideas on the welcome screen. Each new chat shows three, picked from all
// of them, so there's variety, with at least one short exercise each time:
// research finds structured exercises help more than open chat.
// `label` is the button; `prompt` is sent as the person's message.
// No page code here, so tests/suggestions.test.mjs can check the picking.

export const SUGGESTIONS = [
  {
    exercise: true,
    label: "Help me reframe a worrying thought",
    prompt: "Help me reframe a worrying thought. Ask me what it is first, then guide me through it one step at a time.",
  },
  {
    exercise: true,
    label: "A 2-minute breathing exercise",
    prompt: "Guide me through a 2-minute breathing exercise: breathing in for 4 seconds and out for 6, one step at a time.",
  },
  {
    exercise: true,
    label: "A journaling prompt for today",
    prompt: "Give me a journaling prompt for today, and a tip for getting started.",
  },
  { label: "I need a little pep talk for today.", prompt: "I need a little pep talk for today." },
  { label: "Help me plan a calm evening.", prompt: "Help me plan a calm evening." },
  { label: "Why do clouds float?", prompt: "Why do clouds float?" },
];

function shuffled(items, random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Three different suggestions, at least one of them an exercise.
export function pickSuggestions(random = Math.random, count = 3) {
  const picked = shuffled(SUGGESTIONS, random).slice(0, count);
  if (!picked.some((suggestion) => suggestion.exercise)) {
    picked[picked.length - 1] = shuffled(SUGGESTIONS.filter((s) => s.exercise), random)[0];
  }
  return shuffled(picked, random);
}
