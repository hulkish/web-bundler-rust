import {
  AmbientLight,
  CatmullRomCurve3,
  Color,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { disposeTree } from "../stage.js";

export function loom(stage) {
  const points = [
    new Vector3(-5, 0.4, 0),
    new Vector3(-2.5, 2.2, 1.4),
    new Vector3(0, 0.3, -1.2),
    new Vector3(2.4, 2.6, 0.8),
    new Vector3(5, 0.6, -0.4),
  ];
  const curve = new CatmullRomCurve3(points);
  const thread = new Mesh(
    new TubeGeometry(curve, 80, 0.08, 8, false),
    new MeshStandardMaterial({ color: "#f4efe6", roughness: 0.35, metalness: 0.2 })
  );
  const posts = [];
  for (let i = 0; i < points.length; i++) {
    const post = new Mesh(
      new SphereGeometry(0.16, 16, 16),
      new MeshStandardMaterial({ color: "#d6c07a", emissive: "#5c4a16", emissiveIntensity: 0.4 })
    );
    post.position.copy(points[i]);
    posts.push(post);
  }
  const shuttle = new Mesh(
    new SphereGeometry(0.22, 20, 20),
    new MeshStandardMaterial({ color: "#c45c26", emissive: "#c45c26", emissiveIntensity: 0.35 })
  );
  const lamp = new PointLight("#ffd8a8", 18, 16);
  const fill = new AmbientLight("#d7e3ff", 0.4);
  stage.scene.add(thread, shuttle, lamp, fill);
  for (let i = 0; i < posts.length; i++) stage.scene.add(posts[i]);
  stage.scene.background = new Color("#161513");
  stage.camera.position.set(0, 4.5, 10);
  stage.controls.target.set(0, 1.2, 0);
  return {
    tick: function () {
      const t = (performance.now() / 4000) % 1;
      const along = t < 0.5 ? t * 2 : (1 - t) * 2;
      curve.getPointAt(along, shuttle.position);
      lamp.position.copy(shuttle.position);
    },
    dispose: function () {
      disposeTree(thread);
      disposeTree(shuttle);
      for (let i = 0; i < posts.length; i++) disposeTree(posts[i]);
    },
  };
}
