// The head: a long-snouted sky serpent with antlers and swaying whiskers.
// Built facing +z, then turned to face the way the dragon swims.

import { spine } from "./spine.js";

export function createHead(THREE, scene, { cloud, horn, ink, shine, ball }) {
  const head = new THREE.Group();
  head.scale.setScalar(1.35);
  scene.add(head);

  function part(material, position, scale) {
    const mesh = new THREE.Mesh(ball, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    head.add(mesh);
  }

  function addFace() {
    part(cloud, [0, 0.03, 0], [0.36, 0.33, 0.42]); // skull
    part(cloud, [0, -0.06, 0.38], [0.24, 0.19, 0.32]); // snout
    part(cloud, [0, -0.12, 0.22], [0.27, 0.15, 0.3]); // jaw
    // Mane: cloud puffs behind the head.
    const mane = [[0, 0.26, -0.22, 0.2], [0.2, 0.16, -0.3, 0.17], [-0.2, 0.16, -0.3, 0.17], [0, 0.06, -0.42, 0.2]];
    mane.forEach(([x, y, z, r]) => part(cloud, [x, y, z], [r, r, r]));
  }

  function addEye(side) {
    part(cloud, [side * 0.16, 0.25, 0.13], [0.12, 0.09, 0.12]); // cloudy brow
    part(ink, [side * 0.2, 0.12, 0.25], [0.06, 0.075, 0.045]); // eye
    part(shine, [side * 0.215, 0.145, 0.285], [0.02, 0.022, 0.012]); // eye shine
    part(ink, [side * 0.07, 0.03, 0.69], [0.022, 0.016, 0.012]); // nostril
  }

  // Antlers sweep back, with one small branch each.
  function addAntler(side) {
    const antler = new THREE.Group();
    antler.position.set(side * 0.13, 0.33, -0.08);
    antler.rotation.set(-1.0, 0, -side * 0.35);
    head.add(antler);

    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.62, 8), horn);
    beam.position.y = 0.31;
    antler.add(beam);

    const tine = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.24, 8), horn);
    tine.position.set(0, 0.32, 0.08);
    tine.rotation.x = 0.8;
    antler.add(tine);
  }

  function addWhisker(side) {
    const whisker = new THREE.Group();
    whisker.position.set(side * 0.12, -0.08, 0.58);
    head.add(whisker);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.3, -0.06, -0.08),
      new THREE.Vector3(side * 0.62, -0.24, -0.32),
      new THREE.Vector3(side * 0.8, -0.5, -0.66),
    ]);
    whisker.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.013, 6, false), horn));
    return { whisker, side };
  }

  addFace();
  const whiskers = [-1, 1].map((side) => {
    addEye(side);
    addAntler(side);
    return addWhisker(side);
  });

  const behind = new THREE.Vector3();
  const ahead = new THREE.Vector3();

  return {
    position: head.position,

    update(t) {
      // Sit at the front of the spine and look where it's swimming,
      // turned a little toward the viewer.
      spine(0, t, head.position);
      spine(0.04, t, behind);
      ahead.subVectors(head.position, behind).normalize();
      ahead.z += 0.9;
      head.lookAt(ahead.add(head.position));
      head.rotateZ(Math.sin(t * 0.9) * 0.06);

      whiskers.forEach(({ whisker, side }, i) => {
        whisker.rotation.set(Math.sin(t * 1.7 + i) * 0.18, side * Math.sin(t * 1.3 + i) * 0.12, 0);
      });
    },
  };
}
