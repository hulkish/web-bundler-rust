import { Color, IcosahedronGeometry, Mesh, ShaderMaterial } from "three";
import { disposeTree } from "../stage.js";

const vertex = [
  "uniform float uTime;",
  "varying float vLift;",
  "void main() {",
  "  float lift = sin(position.y * 3.0 + uTime * 1.4) * 0.18;",
  "  vec3 displaced = position + normal * lift;",
  "  vLift = lift;",
  "  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);",
  "}",
].join("\n");

const fragment = [
  "varying float vLift;",
  "void main() {",
  "  float t = clamp(vLift * 4.0 + 0.55, 0.0, 1.0);",
  "  vec3 color = mix(vec3(0.08, 0.28, 0.42), vec3(0.90, 0.72, 0.28), t);",
  "  gl_FragColor = vec4(color, 1.0);",
  "}",
].join("\n");

export function glass(stage) {
  const material = new ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  const mesh = new Mesh(new IcosahedronGeometry(1.35, 5), material);
  const wire = new Mesh(
    new IcosahedronGeometry(1.7, 1),
    new ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: vertex,
      fragmentShader: [
        "void main() { gl_FragColor = vec4(0.84, 0.75, 0.48, 1.0); }",
      ].join("\n"),
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
