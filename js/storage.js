// localStorage that never throws: private windows and blocked storage
// just behave as if nothing was saved.

export function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (_) {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch (_) {}
}
