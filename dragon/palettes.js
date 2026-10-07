// Dragon colors for each time of day.
// TRY IT: body = cloud color, sheen = soft edge glow, light = sky light.

export const PALETTES = {
  dawn: { body: 0xfff3f3, sheen: 0xffa8c2, light: 0xffd9cc, horn: 0xf6dcb4, pearl: 0xffd6c4 },
  day: { body: 0xffffff, sheen: 0xa8d8ff, light: 0xffffff, horn: 0xf3dfb0, pearl: 0xfff2c4 },
  dusk: { body: 0xffeadf, sheen: 0xff9a66, light: 0xffc9a0, horn: 0xf7cf95, pearl: 0xffc27a },
  night: { body: 0xdfe5ff, sheen: 0x8a9cff, light: 0xb8c4ff, horn: 0xd9d6f0, pearl: 0xf4f2ff },
};

// The page sets <html data-sky> and <html data-bond>; the dragon follows them.
export function readLook() {
  const { sky, bond } = document.documentElement.dataset;
  return { palette: PALETTES[sky] || PALETTES.day, bond: Number(bond) || 0 };
}
