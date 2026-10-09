import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

const lines = [];
function note(value) {
  lines.push(String(value));
}

for (const method of ["error", "warn"]) {
  const previous = console[method].bind(console);
  console[method] = function (...args) {
    note(method + " " + args.map((item) => String(item)).join(" "));
    previous(...args);
  };
}

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const renderer = new WebGLRenderer({ canvas: canvas, antialias: false });
renderer.setSize(64, 64);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
const scene = new Scene();
const camera = new PerspectiveCamera(50, 1, 0.1, 20);
camera.position.set(3, 3, 4);
camera.lookAt(0, 0.5, 0);
const box = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: 0x3399ff }));
box.castShadow = true;
box.position.y = 0.5;
const ground = new Mesh(
  new PlaneGeometry(8, 8),
  new MeshPhysicalMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(box, ground);
scene.add(new AmbientLight(0xffffff, 0.4));
const sun = new DirectionalLight(0xffffff, 1);
sun.position.set(1, 4, 3);
sun.castShadow = true;
scene.add(sun);
renderer.render(scene, camera);
const pixels = new Uint8Array(4);
renderer.getContext().readPixels(32, 32, 1, 1, renderer.getContext().RGBA, renderer.getContext().UNSIGNED_BYTE, pixels);
note("pixels " + pixels.join(","));
const out = document.createElement("pre");
out.id = "out";
out.textContent = lines.join("\n") || "ok";
document.body.appendChild(out);
