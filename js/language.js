// The language to answer in when a message doesn't show it (e.g. only
// "suicide" or "anorexia", spelled alike in several languages).
export function browserLanguage() {
  const code = (navigator.language || "en").slice(0, 2).toLowerCase();
  return { de: "german", fr: "french", it: "italian" }[code] || "english";
}
