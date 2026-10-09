import {
  Color,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function toneColor(tone) {
  if (tone === "sea") return "#1ea7fd";
  if (tone === "gold") return "#e69d00";
  if (tone === "clay") return "#fc521f";
  return "#d6c07a";
}

export function createStage(canvas) {
  const renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const scene = new Scene();
  scene.background = new Color("#100e0c");
  const camera = new PerspectiveCamera(50, 1, 0.1, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  let frame = 0;
  let running = false;
  let tick = function () {};
  let current = null;

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function loop() {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    controls.update();
    tick();
    renderer.render(scene, camera);
  }

  return {
    scene: scene,
    camera: camera,
    controls: controls,
    renderer: renderer,
    resize: resize,
    start: function () {
      if (running) return;
      running = true;
      resize();
      loop();
    },
    show: function (build) {
      if (current) current.dispose();
      while (scene.children.length) scene.remove(scene.children[0]);
      current = build({ scene: scene, camera: camera, controls: controls });
      tick = current.tick;
      controls.update();
      tick();
      renderer.render(scene, camera);
    },
    stop: function () {
      running = false;
      cancelAnimationFrame(frame);
      if (current) {
        current.dispose();
        current = null;
      }
      controls.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

export function disposeTree(root) {
  root.traverse(function (node) {
    if (node.geometry) node.geometry.dispose();
    if (!node.material) return;
    const list = Array.isArray(node.material) ? node.material : [node.material];
    for (let i = 0; i < list.length; i++) list[i].dispose();
  });
}
