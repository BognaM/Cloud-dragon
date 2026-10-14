// Names end up in the dragon's instructions, so keep only letters, numbers,
// spaces, apostrophes and hyphens.
export function cleanName(value) {
  return value.replace(/[^\p{L}\p{N} '\-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 24);
}
