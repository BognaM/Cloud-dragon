// The curve the dragon swims along. u = 0 is the head, u = 1 the tip of the tail.

const LENGTH = 4.8;

export function spine(u, t, target) {
  const wave = u * Math.PI * 2.1 - t * 1.3;
  return target.set(
    1.8 - u * LENGTH,
    Math.sin(wave) * (0.16 + u * 0.34) + 0.15,
    Math.cos(wave * 0.8) * 0.5 * u
  );
}

// Body thickness along the spine: full at the neck, thin at the tail.
export function radiusAt(u) {
  return 0.3 * (1 - Math.pow(u, 1.3) * 0.8);
}
