// The glowing pearl the dragon chases, floating just out of reach.
// It glows brighter as the bond grows.

export function createPearl(THREE, scene, { softTexture }, headPosition) {
  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff2c4, emissive: 0xfff2c4, emissiveIntensity: 0.6, roughness: 0.2 })
  );
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: softTexture, color: 0xfff2c4, transparent: true, depthWrite: false })
  );
  scene.add(pearl, glow);

  let bond = 0;

  return {
    update(t) {
      const pulse = 1 + Math.sin(t * 2.4) * 0.08;
      pearl.position.set(
        headPosition.x + 0.8,
        headPosition.y + 0.32 + Math.sin(t * 1.6) * 0.1,
        headPosition.z + 0.5
      );
      glow.position.copy(pearl.position);
      glow.scale.setScalar((0.7 + bond * 0.15) * pulse);
      glow.material.opacity = 0.55 + bond * 0.1;
    },

    applyLook(palette, bondLevel) {
      bond = bondLevel;
      pearl.material.color.setHex(palette.pearl);
      pearl.material.emissive.setHex(palette.pearl);
      pearl.material.emissiveIntensity = 0.5 + bond * 0.25;
      glow.material.color.setHex(palette.pearl);
    },
  };
}
