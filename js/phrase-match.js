// Shared by the phrase detectors (eating, violence, harming others, substances):
// which language's patterns match a message, if any.

import { normalize } from "./normalize.js";
import { browserLanguage } from "./language.js";

// `patterns`: { english: [...], german: [...], french: [...], italian: [...] }.
// `shared`: words spelled alike in several languages; when only these match,
// the browser's language decides.
// Returns "english", "german", "french", "italian" or null.
export function matchLanguage(patterns, shared, text) {
  const normalized = normalize(text);
  for (const [language, list] of Object.entries(patterns)) {
    if (list.some((pattern) => pattern.test(normalized))) return language;
  }
  return shared.some((pattern) => pattern.test(normalized)) ? browserLanguage() : null;
}
