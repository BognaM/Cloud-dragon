/* Optional 3D cloud dragon on the welcome screen. Remove its <script> tag
 * in index.html to turn it off. If Three.js or WebGL is unavailable, the
 * flat icon simply stays in its place.
 *
 * It follows two attributes on <html>: data-sky (dawn/day/dusk/night) tints it,
 * and data-bond (0-3) makes it and its pearl glow more as the bond grows.
 */

import { loadThree } from "./three.js";
import { readLook } from "./palettes.js";
import { createMaterials, tintCloud } from "./materials.js";
import { createStage } from "./stage.js";
import { createBody } from "./body.js";
import { createHead } from "./head.js";
import { createPearl } from "./pearl.js";
import { createMist } from "./mist.js";
import { createSparkles } from "./sparkles.js";

const ENABLE_DRAGON = true; // TRY IT: false keeps the flat icon and skips loading Three.js.

async function start() {
  const host = document.querySelector(".big-dragon");
  if (!ENABLE_DRAGON || !host) return;

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const observers = [];
  let stage = null;
  let materials = null;
  let disposed = false;

  // GPU resources need explicit cleanup when the welcome screen goes away.
  function dispose() {
    if (disposed) return;
    disposed = true;
    stage?.renderer.setAnimationLoop(null);
    listeners.abort();
    observers.forEach((observer) => observer.disconnect());
    stage?.scene.traverse((object) => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
    materials?.softTexture.dispose();
    stage?.renderer.dispose();
    stage?.renderer.domElement.remove();
    host.classList.remove("dragon-ready");
  }

  try {
    const THREE = await loadThree();
    if (!host.isConnected) return;

    stage = createStage(THREE, host);
    materials = createMaterials(THREE);
    const body = createBody(THREE, stage.scene, materials);
    const head = createHead(THREE, stage.scene, materials);
    const parts = [
      body,
      head,
      createPearl(THREE, stage.scene, materials, head.position),
      createMist(THREE, stage.scene, materials),
      createSparkles(THREE, stage.scene, materials),
    ];

    function renderFrame(milliseconds) {
      const t = motion.matches ? 0 : milliseconds * 0.001;
      parts.forEach((part) => part.update(t));
      stage.render();
    }

    function applyLook() {
      const { palette, bond } = readLook();
      tintCloud(materials.cloud, palette, bond);
      materials.horn.color.setHex(palette.horn);
      stage.applyLook(palette);
      parts.forEach((part) => part.applyLook?.(palette, bond));
      renderFrame(0);
    }

    // Animate only while visible, and stay still if the visitor prefers less motion.
    function updateMotion() {
      stage.renderer.setAnimationLoop(document.hidden || motion.matches ? null : renderFrame);
      if (!document.hidden) renderFrame(0);
    }

    function watch(observer, target, options) {
      observer.observe(target, options);
      observers.push(observer);
    }

    host.appendChild(stage.renderer.domElement);
    host.classList.add("dragon-ready");

    watch(new ResizeObserver(() => stage.resize() && renderFrame(0)), host);
    // The chat removes the welcome screen on the first message.
    watch(new MutationObserver(() => host.isConnected || dispose()), document.getElementById("messages"), { childList: true });
    // The sky changes on its own over the day.
    watch(new MutationObserver(applyLook), document.documentElement, { attributes: true, attributeFilter: ["data-sky"] });

    const { signal } = listeners;
    document.addEventListener("dragon:update", applyLook, { signal });
    document.addEventListener("visibilitychange", updateMotion, { signal });
    motion.addEventListener("change", updateMotion, { signal });
    window.addEventListener("pagehide", dispose, { signal });
    stage.renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      dispose();
    }, { signal });

    applyLook();
    stage.resize();
    updateMotion();
  } catch (error) {
    dispose();
    console.info("Optional dragon unavailable; showing the icon instead.", error);
  }
}

start();
