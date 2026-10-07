// Three.js from a pinned CDN module: no npm or build step. Needs internet access.
// The browser loads it once; every caller gets the same module.

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

export function loadThree() {
  return import(THREE_URL);
}
