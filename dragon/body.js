// The body: a chain of cloud puffs along the spine. The last third fades into mist.

import { tintCloud } from "./materials.js";
import { radiusAt, spine } from "./spine.js";

const SEGMENTS = 30;
const PUFFS_PER_SEGMENT = 3;

// Same "random" lumps on every visit.
function seededRandom(seed) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

export function createBody(THREE, scene, { cloud, ball }) {
  const random = seededRandom(3);
  const tailMaterials = [];
  const point = new THREE.Vector3();

  function materialAt(u) {
    const fade = Math.max(0, (u - 0.7) / 0.3);
    if (fade === 0) return cloud;
    const material = cloud.clone();
    material.transparent = true;
    material.opacity = 1 - fade * 0.85;
    material.depthWrite = false;
    tailMaterials.push(material);
    return material;
  }

  // Irregular lumps around each segment give a cumulus outline instead of rings.
  function createPuff(material) {
    const mesh = new THREE.Mesh(ball, material);
    scene.add(mesh);
    const direction = new THREE.Vector3(random() - 0.5, random() * 0.9 + 0.1, (random() - 0.5) * 1.4).normalize();
    return { mesh, direction, size: 0.35 + random() * 0.45, reach: 0.55 + random() * 0.35 };
  }

  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    const u = 0.06 + (i / (SEGMENTS - 1)) * 0.94;
    const material = materialAt(u);
    const core = new THREE.Mesh(ball, material);
    scene.add(core);
    const puffs = Array.from({ length: PUFFS_PER_SEGMENT }, () => createPuff(material));
    return { u, core, puffs, jitter: 0.85 + random() * 0.25 };
  });

  return {
    update(t) {
      segments.forEach(({ u, core, puffs, jitter }) => {
        const radius = radiusAt(u) * jitter;
        spine(u, t, point);
        core.position.copy(point);
        core.scale.setScalar(radius);
        puffs.forEach(({ mesh, direction, size, reach }) => {
          mesh.position.copy(point).addScaledVector(direction, radius * reach);
          mesh.scale.setScalar(radius * size);
        });
      });
    },

    applyLook(palette, bond) {
      tailMaterials.forEach((material) => tintCloud(material, palette, bond));
    },
  };
}
