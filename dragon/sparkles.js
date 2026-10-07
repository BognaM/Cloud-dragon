// Sparkles drifting upward around the dragon. More appear as the bond grows.

const MAX_SPARKLES = 18;

export function createSparkles(THREE, scene, { softTexture }) {
  const sparkles = Array.from({ length: MAX_SPARKLES }, () => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: softTexture, color: 0xfffbe8, transparent: true, depthWrite: false })
    );
    scene.add(sprite);
    return sprite;
  });

  return {
    update(t) {
      sparkles.forEach((sprite, i) => {
        const phase = i * 2.4;
        sprite.position.set(
          Math.sin(phase + t * 0.2) * 2.6,
          ((i * 0.37 + t * 0.22) % 3.2) - 1.3,
          Math.cos(phase) * 1.2
        );
        sprite.scale.setScalar(0.09 + Math.sin(t * 3 + i) * 0.03);
      });
    },

    applyLook(palette, bond) {
      sparkles.forEach((sprite, i) => {
        sprite.visible = i < 3 + bond * 5;
      });
    },
  };
}
