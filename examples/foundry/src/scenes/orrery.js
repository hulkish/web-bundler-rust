import {
  AmbientLight,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
} from "three";
import { disposeTree } from "../stage.js";

const PLANETS = [
  { radius: 0.28, orbit: 2.2, speed: 0.7, color: "#7eb6d9", moon: false },
  { radius: 0.45, orbit: 3.6, speed: 0.45, color: "#d6c07a", moon: true },
  { radius: 0.38, orbit: 5.1, speed: 0.3, color: "#c45c26", moon: false },
  { radius: 0.55, orbit: 6.8, speed: 0.18, color: "#8fbf9f", moon: true },
];

export function orrery(stage) {
  const root = new Group();
  const sun = new Mesh(
    new SphereGeometry(0.9, 32, 32),
    new MeshStandardMaterial({ color: "#ffb703", emissive: "#ff8c00", emissiveIntensity: 0.8 })
  );
  root.add(sun);
  root.add(new AmbientLight("#fff4e0", 0.35));
  const lamp = new PointLight("#fff1d0", 40, 30);
  root.add(lamp);
  const pivots = [];
  for (let i = 0; i < PLANETS.length; i++) {
    const spec = PLANETS[i];
    const pivot = new Group();
    const planet = new Mesh(
      new SphereGeometry(spec.radius, 24, 24),
      new MeshStandardMaterial({ color: spec.color, roughness: 0.6 })
    );
    planet.position.x = spec.orbit;
    pivot.add(planet);
    if (spec.moon) {
      const moonPivot = new Group();
      moonPivot.position.x = spec.orbit;
      const moon = new Mesh(
        new SphereGeometry(spec.radius * 0.28, 16, 16),
        new MeshStandardMaterial({ color: "#efe6d6" })
      );
      moon.position.x = spec.radius + 0.45;
      moonPivot.add(moon);
      pivot.add(moonPivot);
      pivots.push({ pivot: moonPivot, speed: spec.speed * 3 });
    }
    root.add(pivot);
    pivots.push({ pivot: pivot, speed: spec.speed });
  }
  stage.scene.add(root);
  stage.scene.background = new Color("#100e0c");
  stage.camera.position.set(0, 7, 14);
  stage.controls.target.set(0, 0, 0);
  return {
    tick: function () {
      const t = performance.now() / 1000;
      sun.rotation.y = t * 0.2;
      for (let i = 0; i < pivots.length; i++) {
        pivots[i].pivot.rotation.y = t * pivots[i].speed;
      }
    },
    dispose: function () { disposeTree(root); },
  };
}
