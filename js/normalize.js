// Lowercase, without accents and with plain apostrophes, so "töten", "Töten"
// and "toten" all match the same pattern. The phrase detectors write their
// patterns in this form.
export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`´]/g, "'")
    .toLowerCase();
}
