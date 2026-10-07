// Scene, camera, lights and renderer: everything around the dragon itself.

const CAMERA_DISTANCE = 7;

export function createStage(THREE, host) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.5, CAMERA_DISTANCE);
  camera.lookAt(0, 0.15, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");

  const hemi = new THREE.HemisphereLight(0xffffff, 0x6f7bb0, 1.3);
  const sun = new THREE.DirectionalLight(0xffffff, 2.8);
  sun.position.set(-2, 6, 4);
  scene.add(hemi, sun);

  return {
    scene,
    renderer,

    render() {
      renderer.render(scene, camera);
    },

    // Fits the canvas to its box. Pulls back on narrow screens so the whole dragon stays in view.
    resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return false;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 1.5 ? CAMERA_DISTANCE * (1.5 / camera.aspect) ** 0.85 : CAMERA_DISTANCE;
      camera.updateProjectionMatrix();
      return true;
    },

    applyLook(palette) {
      hemi.color.setHex(palette.light);
      sun.color.setHex(palette.light);
    },
  };
}
