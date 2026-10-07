// Night-sky stars, plus one bright star for every day you've bonded.

import { el } from "./dom.js";
import { bondDays } from "./bond.js";

const PLAIN_STARS = 70;
const MAX_BOND_STARS = 40;

// Seeded random numbers keep the stars in the same places on every visit.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function renderStars() {
  const random = seededRandom(7);
  const total = PLAIN_STARS + Math.min(bondDays(), MAX_BOND_STARS);

  const stars = Array.from({ length: total }, (_, index) => {
    const star = document.createElement("span");
    star.className = index < PLAIN_STARS ? "star" : "star bond";
    star.style.left = `${random() * 100}%`;
    star.style.top = `${random() * 62}%`;
    star.style.animationDelay = `${-random() * 4}s`;
    return star;
  });

  el.stars.replaceChildren(...stars);
}
