// While the reply is on its way, a small, simplified cloud dragon flies through
// a strip above the message box: in from the left, straight, one loop around
// its pearl, and straight out to the right. It repeats until the reply starts.
// One renderer is built on first use and reused, so it costs a single WebGL context.

import { loadThree } from "./three.js";
import { readLook } from "./palettes.js";

const PASS_SECONDS = 2.4; // one flight: in, loop, out
const PAUSE_SECONDS = 0.4; // between flights while still waiting

const LOOP_RADIUS = 0.75;
const LOOP_DEPTH = 0.35; // the loop drifts back a little so the dragon doesn't cross itself
const SEGMENTS = 28;
const SEGMENT_GAP = 0.09; // distance along the path between body segments
const BODY_LENGTH = SEGMENTS * SEGMENT_GAP;
const OFFSCREEN = 0.6; // start and end this far beyond the edges

const CAMERA_DISTANCE = 3.6;
const FIELD_OF_VIEW = 35;

let viewPromise = null;

// The flight path, as a function of distance s travelled along it.
// Sets the position, the direction of travel and which way is "up" for the
// dragon's back (toward the loop's center while looping).
function createPath(halfWidth) {
  const entryX = -(halfWidth + OFFSCREEN);
  const inLength = -entryX;
  const loopLength = Math.PI * 2 * LOOP_RADIUS;
  const outLength = halfWidth + OFFSCREEN + BODY_LENGTH;

  return {
    length: inLength + loopLength + outLength,

    pose(s, position, forward, up) {
      if (s < inLength) {
        position.set(entryX + s, 0, 0);
        forward.set(1, 0, 0);
        up.set(0, 1, 0);
      } else if (s < inLength + loopLength) {
        const progress = (s - inLength) / loopLength;
        const angle = -Math.PI / 2 + progress * Math.PI * 2;
        position.set(
          LOOP_RADIUS * Math.cos(angle),
          LOOP_RADIUS + LOOP_RADIUS * Math.sin(angle),
          -LOOP_DEPTH * progress
        );
        forward.set(-Math.sin(angle), Math.cos(angle), 0);
        up.set(-Math.cos(angle), -Math.sin(angle), 0);
      } else {
        position.set(s - inLength - loopLength, 0, -LOOP_DEPTH);
        forward.set(1, 0, 0);
        up.set(0, 1, 0);
      }
    },
  };
}

function createHead(THREE, { cloud, horn, ink, ball }) {
  const head = new THREE.Group();
  head.scale.setScalar(1.5); // bigger than the body, so the front is easy to spot

  function part(material, position, scale) {
    const mesh = new THREE.Mesh(ball, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    head.add(mesh);
  }

  // Built facing +z, with its back toward +y.
  part(cloud, [0, 0.02, 0], [0.2, 0.18, 0.24]); // skull
  part(cloud, [0, -0.03, 0.21], [0.13, 0.1, 0.17]); // snout
  for (const side of [-1, 1]) {
    part(ink, [side * 0.12, 0.07, 0.13], [0.045, 0.055, 0.035]); // eye
    const hornMesh = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.4, 8), horn);
    hornMesh.position.set(side * 0.08, 0.2, -0.1);
    hornMesh.rotation.set(-1.0, 0, -side * 0.3);
    head.add(hornMesh);
  }
  return head;
}

async function buildView() {
  const THREE = await loadThree();

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, 4, 0.1, 50);
  camera.position.set(0, LOOP_RADIUS, CAMERA_DISTANCE);
  camera.lookAt(0, LOOP_RADIUS, 0);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x6f7bb0, 1.4);
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(-2, 4, 4);
  scene.add(hemi, sun);

  const materials = {
    cloud: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, sheen: 1, sheenRoughness: 0.35 }),
    horn: new THREE.MeshStandardMaterial({ color: 0xf3dfb0, roughness: 0.45 }),
    ink: new THREE.MeshBasicMaterial({ color: 0x1d2440 }),
    ball: new THREE.SphereGeometry(1, 16, 12),
  };
  const pearlMaterial = new THREE.MeshStandardMaterial({ emissiveIntensity: 0.8, roughness: 0.2 });

  // Body: overlapping spheres that shrink toward the tail.
  const segments = Array.from({ length: SEGMENTS }, (_, i) => {
    const mesh = new THREE.Mesh(materials.ball, materials.cloud);
    mesh.scale.setScalar(0.17 * (1 - (i / SEGMENTS) * 0.8));
    scene.add(mesh);
    return mesh;
  });

  const head = createHead(THREE, materials);
  scene.add(head);

  // The pearl it loops around.
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), pearlMaterial);
  pearl.position.set(0, LOOP_RADIUS, -LOOP_DEPTH / 2);
  scene.add(pearl);

  const forward = new THREE.Vector3();
  const up = new THREE.Vector3();
  const side = new THREE.Vector3();
  const basis = new THREE.Matrix4();
  let path = null;

  // Fits the canvas to its box and lays the path out edge to edge.
  function fit(host) {
    const width = host.clientWidth;
    const height = host.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const halfHeight = CAMERA_DISTANCE * Math.tan((FIELD_OF_VIEW / 2) * (Math.PI / 180));
    path = createPath(halfHeight * camera.aspect);
  }

  // Draws the dragon `progress` (0 to 1) of the way through one flight.
  function draw(progress) {
    const s = progress * path.length;
    segments.forEach((segment, i) => path.pose(s - (i + 1) * SEGMENT_GAP, segment.position, forward, up));
    path.pose(s, head.position, forward, up);
    side.crossVectors(up, forward);
    head.quaternion.setFromRotationMatrix(basis.makeBasis(side, up, forward));
    renderer.render(scene, camera);
  }

  function applyLook() {
    const { palette } = readLook();
    materials.cloud.color.setHex(palette.body);
    materials.cloud.sheenColor.setHex(palette.sheen);
    materials.horn.color.setHex(palette.horn);
    pearlMaterial.color.setHex(palette.pearl);
    pearlMaterial.emissive.setHex(palette.pearl);
    hemi.color.setHex(palette.light);
    sun.color.setHex(palette.light);
  }

  return {
    // Flies passes across `host`, one after another, until the returned function is called.
    attach(host) {
      applyLook();
      fit(host);
      host.appendChild(renderer.domElement);

      const startedAt = performance.now();
      let pass = 0;

      renderer.setAnimationLoop((now) => {
        const seconds = (now - startedAt) / 1000;
        const cycle = PASS_SECONDS + PAUSE_SECONDS;
        const currentPass = Math.floor(seconds / cycle);
        if (currentPass !== pass) {
          pass = currentPass;
          fit(host); // the chat may have been resized since the last flight
        }
        const passSeconds = seconds - currentPass * cycle;
        draw(Math.min(passSeconds / PASS_SECONDS, 1));
      });

      return () => {
        renderer.setAnimationLoop(null);
        renderer.domElement.remove();
      };
    },
  };
}

// Starts the flights inside `host` and returns a function that stops them.
// Shows nothing when 3D can't be shown (no WebGL, Three.js didn't load, or the
// visitor prefers less motion); the "thinking" label next to it still appears.
export function startThinkingFlight(host) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let stopped = false;
  let detach = () => {};

  viewPromise ??= buildView();
  viewPromise
    .then((view) => {
      if (!stopped) detach = view.attach(host);
    })
    .catch((error) => {
      viewPromise = null; // try again next time
      console.info("Thinking dragon unavailable.", error);
    });

  return () => {
    stopped = true;
    detach();
  };
}
