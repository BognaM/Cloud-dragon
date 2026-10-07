// Materials and shapes shared by the dragon's parts.

export function createMaterials(THREE) {
  return {
    cloud: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 1, sheen: 1, sheenRoughness: 0.35, sheenColor: 0xa8d8ff,
      emissive: 0xffffff, emissiveIntensity: 0.05,
    }),
    horn: new THREE.MeshStandardMaterial({ color: 0xf3dfb0, roughness: 0.45 }),
    ink: new THREE.MeshBasicMaterial({ color: 0x1d2440 }),
    shine: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    ball: new THREE.SphereGeometry(1, 24, 16),
    softTexture: createSoftTexture(THREE),
  };
}

// A soft round dot, used for mist, glow and sparkles.
function createSoftTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

// Tints a cloud material for the sky. It glows a little more at each bond level.
export function tintCloud(material, palette, bond) {
  material.color.setHex(palette.body);
  material.sheenColor.setHex(palette.sheen);
  material.emissive.setHex(palette.body);
  material.emissiveIntensity = 0.02 + bond * 0.05;
}
