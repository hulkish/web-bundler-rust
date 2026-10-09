import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  Points,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { disposeTree, toneColor } from "./stage.js";

export function orrery(stage, props) {
  const count = Math.max(1, Math.min(8, props.rows | 0));
  const accent = toneColor(props.tone);
  const root = new Group();
  const sun = new Mesh(
    new SphereGeometry(0.9, 32, 32),
    new MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.65 })
  );
  root.add(sun);
  root.add(new AmbientLight("#fff4e0", 0.35));
  const lamp = new PointLight("#fff1d0", 40, 40);
  root.add(lamp);
  const pivots = [];
  for (let i = 0; i < count; i++) {
    const pivot = new Group();
    const radius = 0.22 + (i % 3) * 0.1;
    const planet = new Mesh(
      new SphereGeometry(radius, 24, 24),
      new MeshStandardMaterial({ color: i % 2 === 0 ? "#efe6d6" : accent, roughness: 0.55 })
    );
    planet.position.x = 2.1 + i * 1.15;
    pivot.add(planet);
    if (i % 2 === 1) {
      const moonPivot = new Group();
      moonPivot.position.x = planet.position.x;
      const moon = new Mesh(
        new SphereGeometry(radius * 0.35, 16, 16),
        new MeshStandardMaterial({ color: "#efe6d6" })
      );
      moon.position.x = radius + 0.4;
      moonPivot.add(moon);
      pivot.add(moonPivot);
      pivots.push({ pivot: moonPivot, speed: 0.8 + i * 0.15 });
    }
    root.add(pivot);
    pivots.push({ pivot: pivot, speed: 0.55 - i * 0.04 });
  }
  stage.scene.add(root);
  stage.scene.background = new Color("#100e0c");
  stage.camera.position.set(0, 7, 8 + count * 1.6);
  stage.controls.target.set(0, 0, 0);
  return {
    tick: function () {
      const t = performance.now() / 1000;
      sun.rotation.y = t * 0.2;
      for (let i = 0; i < pivots.length; i++) pivots[i].pivot.rotation.y = t * pivots[i].speed;
    },
    dispose: function () { disposeTree(root); },
  };
}

export function yard(stage, props) {
  const side = Math.max(2, Math.min(12, props.rows | 0));
  const count = side * side;
  const accent = toneColor(props.tone);
  const posts = new InstancedMesh(
    new BoxGeometry(0.55, 1, 0.55),
    new MeshStandardMaterial({ color: accent, roughness: 0.55 }),
    count
  );
  posts.castShadow = true;
  posts.receiveShadow = true;
  const dummy = new Object3D();
  const color = new Color();
  for (let i = 0; i < count; i++) {
    const x = (i % side) - side / 2;
    const z = Math.floor(i / side) - side / 2;
    const height = 0.4 + ((i * 17) % 10) / 4;
    dummy.position.set(x * 1.15, height / 2, z * 1.15);
    dummy.scale.set(1, height, 1);
    dummy.updateMatrix();
    posts.setMatrixAt(i, dummy.matrix);
    color.set(accent);
    color.offsetHSL(0, 0, ((i % 5) - 2) * 0.06);
    posts.setColorAt(i, color);
  }
  posts.instanceMatrix.needsUpdate = true;
  if (posts.instanceColor) posts.instanceColor.needsUpdate = true;
  const floor = new Mesh(
    new PlaneGeometry(side * 1.4 + 4, side * 1.4 + 4),
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
  stage.scene.add(floor, posts, crane, sun, new AmbientLight("#d7e3ff", 0.35));
  stage.scene.background = new Color("#1b1a17");
  stage.camera.position.set(side, side * 0.75, side + 4);
  stage.controls.target.set(0, 1, 0);
  return {
    tick: function () {
      const t = performance.now() / 1000;
      crane.position.x = Math.sin(t * 0.6) * Math.max(2, side / 3);
      crane.position.z = Math.cos(t * 0.4) * Math.max(2, side / 3);
    },
    dispose: function () {
      disposeTree(floor);
      disposeTree(posts);
      disposeTree(crane);
    },
  };
}

const glassVertex = [
  "uniform float uTime;",
  "varying float vLift;",
  "void main() {",
  "  float lift = sin(position.y * 3.0 + uTime * 1.4) * 0.18;",
  "  vec3 displaced = position + normal * lift;",
  "  vLift = lift;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);",
  "}",
].join("\n");

export function glass(stage, props) {
  const detail = Math.max(1, Math.min(4, props.rows | 0));
  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: glassVertex,
    fragmentShader: [
      "varying float vLift;",
      "void main() {",
      "  float t = clamp(vLift * 4.0 + 0.55, 0.0, 1.0);",
      "  vec3 color = mix(vec3(0.08, 0.28, 0.42), vec3(0.90, 0.72, 0.28), t);",
      "  gl_FragColor = vec4(color, 1.0);",
      "}",
    ].join("\n"),
  });
  const mesh = new Mesh(new IcosahedronGeometry(1.35, detail), material);
  const wire = new Mesh(
    new IcosahedronGeometry(1.7, 1),
    new ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: glassVertex,
      fragmentShader: "void main() { gl_FragColor = vec4(0.84, 0.75, 0.48, 1.0); }",
      wireframe: true,
    })
  );
  stage.scene.add(mesh, wire);
  stage.scene.background = new Color("#0d1418");
  stage.camera.position.set(2.4, 1.2, 3.4);
  stage.controls.target.set(0, 0, 0);
  return {
    tick: function () {
      const t = performance.now() / 1000;
      material.uniforms.uTime.value = t;
      wire.material.uniforms.uTime.value = t * 0.6;
      mesh.rotation.y = t * 0.25;
      wire.rotation.y = -t * 0.15;
    },
    dispose: function () {
      disposeTree(mesh);
      disposeTree(wire);
    },
  };
}

export function loom(stage, props) {
  const count = Math.max(2, Math.min(8, props.rows | 0));
  const accent = toneColor(props.tone);
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = -5 + (i / Math.max(1, count - 1)) * 10;
    const y = i % 2 === 0 ? 0.4 : 2.4;
    const z = i % 2 === 0 ? -0.6 : 1.1;
    points.push(new Vector3(x, y, z));
  }
  const curve = new CatmullRomCurve3(points);
  const thread = new Mesh(
    new TubeGeometry(curve, 80, 0.08, 8, false),
    new MeshStandardMaterial({ color: "#f4efe6", roughness: 0.35, metalness: 0.2 })
  );
  const posts = [];
  for (let i = 0; i < points.length; i++) {
    const post = new Mesh(
      new SphereGeometry(0.16, 16, 16),
      new MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.25 })
    );
    post.position.copy(points[i]);
    posts.push(post);
    stage.scene.add(post);
  }
  const shuttle = new Mesh(
    new SphereGeometry(0.22, 20, 20),
    new MeshStandardMaterial({ color: "#c45c26", emissive: "#c45c26", emissiveIntensity: 0.35 })
  );
  const lamp = new PointLight("#ffd8a8", 18, 16);
  stage.scene.add(thread, shuttle, lamp, new AmbientLight("#d7e3ff", 0.4));
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

function galaxyRandom(seed) {
  let value = seed >>> 0;
  return function () {
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mixColor(base, tint, amount) {
  return [
    base[0] * (1 - amount) + tint[0] * amount,
    base[1] * (1 - amount) + tint[1] * amount,
    base[2] * (1 - amount) + tint[2] * amount,
  ];
}

export function galaxy(stage, props) {
  const count = Math.max(2500, (props.rows | 0) * 900);
  const rand = galaxyRandom(count * 17 + (props.tone || "ink").length * 97);
  const tint = new Color(toneColor(props.tone));
  const tintRgb = [tint.r, tint.g, tint.b];
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const pitch = Math.tan(12 * Math.PI / 180);
  const arms = [0.15, Math.PI, 1.15, Math.PI + 1.05];
  const armColors = [
    [0.45, 0.58, 0.85],
    [0.7, 0.6, 0.42],
    [0.38, 0.5, 0.78],
    [0.62, 0.48, 0.32],
  ];
  let cursor = 0;
  function place(x, y, z, color, size) {
    if (cursor >= count) return;
    const i = cursor * 3;
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
    colors[i] = color[0];
    colors[i + 1] = color[1];
    colors[i + 2] = color[2];
    sizes[cursor] = size;
    cursor += 1;
  }
  const bulge = Math.floor(count * 0.18);
  const bar = Math.floor(count * 0.1);
  const disk = Math.floor(count * 0.16);
  for (let n = 0; n < bulge; n++) {
    const radius = Math.pow(rand(), 0.45) * 1.7;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const warm = 0.75 + rand() * 0.25;
    place(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.45,
      radius * Math.sin(phi) * Math.sin(theta),
      mixColor([warm * 0.7, warm * 0.5, warm * 0.28], tintRgb, 0.12),
      0.9 + (1.7 - radius) * 0.7
    );
  }
  const barAngle = 0.5;
  for (let n = 0; n < bar; n++) {
    const x0 = (rand() - 0.5) * 4.4;
    const z0 = (rand() - 0.5) * 0.85;
    const y0 = (rand() - 0.5) * 0.28;
    place(
      x0 * Math.cos(barAngle) - z0 * Math.sin(barAngle),
      y0,
      x0 * Math.sin(barAngle) + z0 * Math.cos(barAngle),
      mixColor([0.75, 0.62, 0.4], tintRgb, 0.1),
      0.7 + rand() * 0.4
    );
  }
  for (let n = 0; n < disk; n++) {
    const radius = 1.5 + Math.sqrt(rand()) * 8;
    const angle = rand() * Math.PI * 2;
    place(
      Math.cos(angle) * radius,
      (rand() - 0.5) * 0.22,
      Math.sin(angle) * radius,
      mixColor([0.28, 0.32, 0.42], tintRgb, 0.15),
      0.35 + rand() * 0.3
    );
  }
  while (cursor < count) {
    const arm = cursor % arms.length;
    const along = rand();
    const theta = along * Math.PI * 3.5;
    const radius = 0.7 * Math.exp(pitch * theta);
    const scatter = (rand() - 0.5) * (0.18 + radius * 0.09);
    const angle = theta + arms[arm] + scatter * 0.12;
    const dust = Math.abs(Math.sin(angle * 2)) < 0.18 && radius > 2.2;
    const color = mixColor(armColors[arm], tintRgb, 0.16);
    const dim = dust ? 0.35 : 0.75 + rand() * 0.35;
    place(
      Math.cos(angle) * (radius + scatter),
      (rand() - 0.5) * (0.06 + 0.35 * Math.exp(-radius * 0.28)),
      Math.sin(angle) * (radius + scatter),
      [color[0] * dim, color[1] * dim, color[2] * dim],
      dust ? 0.28 : 0.45 + rand() * 0.55
    );
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new Float32BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: [
      "attribute float aSize;",
      "attribute vec3 aColor;",
      "varying vec3 vColor;",
      "void main() {",
      "  vColor = aColor;",
      "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
      "  gl_PointSize = aSize * (160.0 / max(1.0, -mv.z));",
      "  gl_Position = projectionMatrix * mv;",
      "}",
    ].join("\n"),
    fragmentShader: [
      "varying vec3 vColor;",
      "void main() {",
      "  vec2 uv = gl_PointCoord - vec2(0.5);",
      "  float d = length(uv);",
      "  if (d > 0.5) discard;",
      "  float alpha = smoothstep(0.5, 0.02, d);",
      "  gl_FragColor = vec4(vColor, alpha);",
      "}",
    ].join("\n"),
  });
  const stars = new Points(geometry, material);
  const root = new Group();
  root.add(stars);
  stage.scene.add(root);
  stage.scene.background = new Color("#07080d");
  stage.camera.position.set(0, 11, 16);
  stage.controls.target.set(0, 0, 0);
  return {
    tick: function () {
      root.rotation.y = performance.now() / 18000;
    },
    dispose: function () { disposeTree(root); },
  };
}
