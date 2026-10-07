// Wisps of mist that peel off the tail and dissolve.

import { spine } from "./spine.js";

const WISPS = 22;

export function createMist(THREE, scene, { softTexture }) {
  const wisps = Array.from({ length: WISPS }, (_, i) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: softTexture, color: 0xffffff, transparent: true, depthWrite: false, opacity: 0 })
    );
    scene.add(sprite);
    return { sprite, offset: i / WISPS, u: 0.45 + ((i % 7) / 7) * 0.55 };
  });

  return {
    update(t) {
      wisps.forEach(({ sprite, offset, u }) => {
        const life = (t * 0.12 + offset) % 1; // 0 = just born, 1 = gone
        spine(u, t, sprite.position);
        sprite.position.x -= life * 0.9;
        sprite.position.y += life * 0.45;
        sprite.scale.setScalar(0.35 + life * 0.75);
        sprite.material.opacity = Math.sin(life * Math.PI) * 0.4;
      });
    },

    applyLook(palette) {
      wisps.forEach(({ sprite }) => sprite.material.color.setHex(palette.body));
    },
  };
}
