import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from "three";
import { disposeTree } from "../stage.js";

export function yard(stage) {
  const count = 144;
  const geometry = new BoxGeometry(0.55, 1, 0.55);
  const material = new MeshStandardMaterial({ color: "#d6c07a", roughness: 0.55 });
  const posts = new InstancedMesh(geometry, material, count);
  posts.castShadow = true;
  posts.receiveShadow = true;
  const dummy = new Object3D();
  const color = new Color();
  const side = 12;
  for (let i = 0; i < count; i++) {
    const x = (i % side) - side / 2;
    const z = Math.floor(i / side) - side / 2;
    const height = 0.4 + ((i * 17) % 10) / 4;
    dummy.position.set(x * 1.15, height / 2, z * 1.15);
    dummy.scale.set(1, height, 1);
    dummy.rotation.y = 0;
    dummy.updateMatrix();
    posts.setMatrixAt(i, dummy.matrix);
    color.setHSL(0.1, 0.35, 0.35 + (i % 5) * 0.08);
    posts.setColorAt(i, color);
  }
  posts.instanceMatrix.needsUpdate = true;
  if (posts.instanceColor) posts.instanceColor.needsUpdate = true;
  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({ color: "#2a261f", roughness: 1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  const crane = new Mesh(
    new BoxGeometry(1.4, 0.25, 0.25),
    new MeshStandardMaterial({ color: "#c45c26" })
  );
  crane.castShadow = true;
  crane.position.y = 4.2;
  const sun = new DirectionalLight("#fff6e4", 2.4);
  sun.position.set(8, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const fill = new AmbientLight("#d7e3ff", 0.35);
  stage.scene.add(floor, posts, crane, sun, fill);
  stage.scene.background = new Color("#1b1a17");
  stage.camera.position.set(12, 9, 14);
  stage.controls.target.set(0, 1, 0);
  return {
    tick: function () {
      const t = performance.now() / 1000;
      crane.position.x = Math.sin(t * 0.6) * 5;
      crane.position.z = Math.cos(t * 0.4) * 4;
    },
    dispose: function () {
      disposeTree(floor);
      disposeTree(posts);
      disposeTree(crane);
    },
  };
}
