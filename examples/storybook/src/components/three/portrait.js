import {
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  BoxGeometry,
  TorusGeometry,
} from "three";
import { disposeTree, toneColor } from "./stage.js";

function part(parent, geo, material, x, y, z, sx, sy, sz, rx, ry, rz) {
  const mesh = new Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx || 1, sy || 1, sz || 1);
  mesh.rotation.set(rx || 0, ry || 0, rz || 0);
  parent.add(mesh);
  return mesh;
}

export function portrait(stage, props) {
  const root = new Group();
  const accent = toneColor(props.tone);
  const skin = new MeshStandardMaterial({ color: "#e0b08c", roughness: 0.58 });
  const skinHot = new MeshStandardMaterial({ color: "#e8bc98", roughness: 0.42 });
  const hairMat = new MeshStandardMaterial({ color: "#2a221c", roughness: 0.92 });
  const beardMat = new MeshStandardMaterial({ color: "#6b4a34", roughness: 0.96 });
  const shirt = new MeshStandardMaterial({ color: "#56844c", roughness: 0.82 });
  const shirtDeep = new MeshStandardMaterial({ color: "#3f6838", roughness: 0.86 });
  const denim = new MeshStandardMaterial({ color: "#3c4d63", roughness: 0.9 });
  const shoe = new MeshStandardMaterial({ color: "#242424", roughness: 0.7 });
  const grass = new MeshStandardMaterial({ color: "#5ea344", roughness: 1 });
  const grassDeep = new MeshStandardMaterial({ color: "#3f7a34", roughness: 1 });
  const bark = new MeshStandardMaterial({ color: "#6a4a30", roughness: 0.95 });
  const leaf = new MeshStandardMaterial({ color: "#2f7a34", roughness: 0.9 });
  const leafLite = new MeshStandardMaterial({ color: "#4e9a42", roughness: 0.88 });
  const siding = new MeshStandardMaterial({ color: "#8d6a43", roughness: 0.84 });
  const trim = new MeshStandardMaterial({ color: accent, roughness: 0.6 });
  const glass = new MeshStandardMaterial({ color: "#24343c", roughness: 0.25, metalness: 0.4 });
  const trailerMat = new MeshStandardMaterial({ color: "#e7e4dc", roughness: 0.72 });
  const mouthMat = new MeshStandardMaterial({ color: "#8d4e4a", roughness: 0.7 });
  const scleraMat = new MeshStandardMaterial({ color: "#f3f0ea", roughness: 0.35 });
  const irisMat = new MeshStandardMaterial({ color: "#6a4226", roughness: 0.4 });
  const pupilMat = new MeshStandardMaterial({ color: "#140e0c", roughness: 0.3 });

  const yard = new Mesh(new CircleGeometry(18, 48), grass);
  yard.rotation.x = -Math.PI / 2;
  root.add(yard);
  const mound = part(root, new SphereGeometry(1.5, 28, 16), grassDeep, 0, -1.15, 0.15, 1.35, 0.22, 1.05);

  const person = new Group();
  root.add(person);

  function joint(parent, x, y, z) {
    const g = new Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }

  const leftHip = joint(person, -0.12, 0.87, 0);
  part(leftHip, new CylinderGeometry(0.09, 0.085, 0.39, 12), denim, 0, -0.195, 0);
  const leftKnee = joint(leftHip, 0, -0.39, 0);
  part(leftKnee, new CylinderGeometry(0.085, 0.08, 0.39, 12), denim, 0, -0.195, 0);
  const leftFoot = joint(leftKnee, 0, -0.39, 0);
  part(leftFoot, new BoxGeometry(0.16, 0.08, 0.28), shoe, 0, -0.05, 0.04);

  const rightHip = joint(person, 0.12, 0.87, 0);
  part(rightHip, new CylinderGeometry(0.09, 0.085, 0.39, 12), denim, 0, -0.195, 0);
  const rightKnee = joint(rightHip, 0, -0.39, 0);
  part(rightKnee, new CylinderGeometry(0.085, 0.08, 0.39, 12), denim, 0, -0.195, 0);
  const rightFoot = joint(rightKnee, 0, -0.39, 0);
  part(rightFoot, new BoxGeometry(0.16, 0.08, 0.28), shoe, 0, -0.05, 0.04);

  const spine = joint(person, 0, 0.92, 0);
  part(spine, new SphereGeometry(0.2, 20, 16), shirt, 0, 0.06, 0.02, 1.35, 0.72, 0.95);

  const chest = joint(spine, 0, 0.3, 0);
  part(chest, new BoxGeometry(0.5, 0.42, 0.26), shirt, 0, -0.06, 0);
  part(chest, new BoxGeometry(0.56, 0.16, 0.28), shirt, 0, 0.14, 0);
  part(chest, new TorusGeometry(0.075, 0.014, 8, 18), shirtDeep, 0, 0.23, 0.02, 1, 1, 1, Math.PI / 2);
  part(chest, new CylinderGeometry(0.055, 0.06, 0.12, 12), skin, 0, 0.28, 0);

  const head = new Group();
  head.position.set(0, 0.44, 0.01);
  chest.add(head);
  part(head, new SphereGeometry(0.118, 32, 24), skin, 0, 0, 0, 1.12, 1.08, 1.02);
  part(head, new SphereGeometry(0.112, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), skinHot, 0, 0.02, 0.01, 1.08, 1.02, 1.02);

  part(head, new SphereGeometry(0.072, 16, 12), hairMat, -0.09, 0.012, -0.01, 0.62, 0.78, 0.9);
  part(head, new SphereGeometry(0.072, 16, 12), hairMat, 0.09, 0.012, -0.01, 0.62, 0.78, 0.9);
  part(head, new SphereGeometry(0.086, 16, 12), hairMat, 0, -0.01, -0.078, 1.15, 0.7, 0.48);
  const buzz = part(head, new TorusGeometry(0.092, 0.011, 8, 22, Math.PI * 1.15), hairMat, 0, 0.03, -0.01);
  buzz.rotation.x = Math.PI / 2;
  buzz.rotation.z = Math.PI;

  part(head, new SphereGeometry(0.03, 14, 10), skin, -0.122, -0.008, 0, 0.5, 1.05, 0.72);
  part(head, new SphereGeometry(0.03, 14, 10), skin, 0.122, -0.008, 0, 0.5, 1.05, 0.72);

  const eyeY = 0.018;
  const eyeZ = 0.1;
  part(head, new SphereGeometry(0.02, 16, 12), scleraMat, -0.04, eyeY, eyeZ, 1.15, 0.82, 0.7);
  part(head, new SphereGeometry(0.02, 16, 12), scleraMat, 0.04, eyeY, eyeZ, 1.15, 0.82, 0.7);
  part(head, new SphereGeometry(0.011, 12, 10), irisMat, -0.04, eyeY - 0.001, eyeZ + 0.012);
  part(head, new SphereGeometry(0.011, 12, 10), irisMat, 0.04, eyeY - 0.001, eyeZ + 0.012);
  part(head, new SphereGeometry(0.0055, 10, 8), pupilMat, -0.04, eyeY - 0.001, eyeZ + 0.02);
  part(head, new SphereGeometry(0.0055, 10, 8), pupilMat, 0.04, eyeY - 0.001, eyeZ + 0.02);
  part(head, new SphereGeometry(0.003, 8, 6), scleraMat, -0.036, eyeY + 0.004, eyeZ + 0.024);
  part(head, new SphereGeometry(0.003, 8, 6), scleraMat, 0.044, eyeY + 0.004, eyeZ + 0.024);
  const lidL = part(head, new BoxGeometry(0.046, 0.012, 0.02), skin, -0.04, eyeY + 0.016, eyeZ + 0.008);
  const lidR = part(head, new BoxGeometry(0.046, 0.012, 0.02), skin, 0.04, eyeY + 0.016, eyeZ + 0.008);

  part(head, new BoxGeometry(0.046, 0.01, 0.012), hairMat, -0.04, 0.052, 0.1, 1, 1, 1, 0, 0, 0.08);
  part(head, new BoxGeometry(0.046, 0.01, 0.012), hairMat, 0.04, 0.052, 0.1, 1, 1,1, 1,1, 0, 0, -0.08);

  part(head, new SphereGeometry(0.03, 16, 12), skin, 0, -0.012, 0.108, 0.82, 1.2, 1.25);
  part(head, new SphereGeometry(0.012, 10, 8), skinHot, -0.014, -0.028, 0.124, 1, 0.7, 0.8);
  part(head, new SphereGeometry(0.012, 10, 8), skinHot, 0.014, -0.028, 0.124, 1, 0.7, 0.8);

  const smile = part(head, new TorusGeometry(0.026, 0.004, 8, 16, Math.PI * 0.72), mouthMat, 0, -0.048, 0.108);
  smile.rotation.x = Math.PI / 2.15;
  smile.rotation.z = Math.PI;

  part(head, new SphereGeometry(0.016, 10, 8), beardMat, -0.018, -0.046, 0.112, 1.3, 0.7, 0.8);
  part(head, new SphereGeometry(0.016, 10, 8), beardMat, 0.018, -0.046, 0.112, 1.3, 0.7, 0.8);
  const tufts = [
    [-0.07, -0.04, 0.07], [-0.055, -0.07, 0.08], [-0.03, -0.09, 0.07],
    [0, -0.1, 0.06], [0.03, -0.09, 0.07], [0.055, -0.07, 0.08], [0.07, -0.04, 0.07],
    [-0.085, -0.02, 0.03], [0.085, -0.02, 0.03], [-0.04, -0.085, 0.04], [0.04, -0.085, 0.04],
  ];
  for (let i = 0; i < tufts.length; i++) {
    const tuft = tufts[i];
    part(head, new SphereGeometry(0.026, 10, 8), beardMat, tuft[0], tuft[1], tuft[2], 1.15, 1.2, 0.95);
  }
  part(head, new BoxGeometry(0.02, 0.06, 0.02), beardMat, -0.1, -0.02, 0.01);
  part(head, new BoxGeometry(0.02, 0.06, 0.02), beardMat, 0.1, -0.02, 0.01);

  const leftShoulder = joint(chest, -0.321, 0.138, 0);
  part(leftShoulder, new CylinderGeometry(0.055, 0.05, 0.28, 10), shirt, 0.021, -0.138, 0, 1, 1, 1, 0, 0, 0.15);
  const leftElbow = joint(leftShoulder, 0.042, -0.276, 0);
  part(leftElbow, new CylinderGeometry(0.045, 0.04, 0.26, 10), skin, -0.061, -0.102, 0.03, 1, 1, 1, 0.2, 0, 0.05);
  part(leftElbow, new SphereGeometry(0.045, 12, 10), skin, -0.081, -0.242, 0.06);

  const rightShoulder = joint(chest, 0.321, 0.138, 0);
  part(rightShoulder, new CylinderGeometry(0.055, 0.05, 0.28, 10), shirt, -0.021, -0.138, 0, 1, 1, 1, 0, 0, -0.15);
  const rightElbow = joint(rightShoulder, -0.042, -0.276, 0);
  part(rightElbow, new CylinderGeometry(0.045, 0.04, 0.26, 10), skin, 0.061, -0.102, 0.03, 1, 1, 1, 0.2, 0, -0.05);
  part(rightElbow, new SphereGeometry(0.045, 12, 10), skin, 0.081, -0.242, 0.06);

  const shadow = new Mesh(
    new CircleGeometry(0.42, 24),
    new MeshStandardMaterial({ color: "#1c2418", transparent: true, opacity: 0.28, roughness: 1 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  root.add(shadow);

  const tree = new Group();
  tree.position.set(-1.55, 0, -1.7);
  tree.scale.setScalar(0.58);
  root.add(tree);
  part(tree, new CylinderGeometry(0.16, 0.22, 2.4, 10), bark, 0, 1.2, 0);
  part(tree, new SphereGeometry(0.85, 18, 14), leaf, 0, 2.7, 0, 1.15, 0.9, 1.05);
  part(tree, new SphereGeometry(0.62, 16, 12), leafLite, -0.55, 2.45, 0.2);
  part(tree, new SphereGeometry(0.58, 16, 12), leaf, 0.6, 2.55, -0.15);
  part(tree, new SphereGeometry(0.5, 14, 10), leafLite, 0.1, 3.25, 0.1, 1.1, 0.8, 1);

  part(root, new BoxGeometry(1.7, 1.25, 1.3), siding, 1.55, 0.72, -1.85);
  part(root, new BoxGeometry(1.9, 0.1, 1.5), siding, 1.55, 1.38, -1.85);
  part(root, new BoxGeometry(1.8, 0.06, 0.1), trim, 1.55, 1.28, -1.18);
  part(root, new BoxGeometry(0.32, 0.4, 0.05), glass, 1.2, 0.95, -1.19);
  part(root, new BoxGeometry(0.32, 0.4, 0.05), glass, 1.9, 0.95, -1.19);
  part(root, new BoxGeometry(0.32, 0.32, 0.05), glass, 1.2, 0.42, -1.19);
  part(root, new BoxGeometry(0.32, 0.32, 0.05), glass, 1.9, 0.42, -1.19);
  part(root, new BoxGeometry(0.28, 0.52, 0.06), trim, 1.55, 0.32, -1.17);

  part(root, new BoxGeometry(1.35, 1.15, 2.3), trailerMat, -3.7, 0.58, -3.15);
  part(root, new BoxGeometry(0.08, 0.7, 0.4), trim, -3.02, 0.5, -2.2);

  for (let i = 0; i < 9; i++) {
    part(root, new BoxGeometry(0.06, 0.55, 0.06), bark, -4.2 + i * 0.7, 0.28, -4.3);
  }
  part(root, new BoxGeometry(6.2, 0.06, 0.06), bark, -1.4, 0.52, -4.3);

  const extras = Math.max(0, Math.min(8, (props.rows | 0) - 1));
  for (let i = 0; i < extras; i++) {
    const x = -4 + (i % 4) * 2.1;
    const z = -5.2 - Math.floor(i / 4) * 1.4;
    part(root, new CylinderGeometry(0.08, 0.1, 1.4, 8), bark, x, 0.7, z);
    part(root, new SphereGeometry(0.42, 12, 10), i % 2 ? leafLite : leaf, x, 1.55, z);
  }

  root.add(new HemisphereLight("#d7ecff", "#6a8a48", 0.72));
  const sun = new DirectionalLight("#fff0d2", 1.55);
  sun.position.set(2.4, 6.5, 3.2);
  root.add(sun);
  const fill = new DirectionalLight("#c5d9ef", 0.38);
  fill.position.set(-2.2, 1.6, 2.4);
  root.add(fill);

  stage.scene.add(root);
  stage.scene.background = new Color("#79b6ea");
  stage.scene.fog = null;
  stage.camera.fov = 32;
  stage.camera.near = 0.05;
  stage.camera.far = 40;
  stage.camera.position.set(0.02, 1.36, 1.18);
  stage.controls.target.set(0, 1.46, 0.02);
  stage.controls.minDistance = 0.35;
  stage.controls.maxDistance = 8;
  stage.controls.maxPolarAngle = Math.PI * 0.55;
  stage.camera.updateProjectionMatrix();

  return {
    tick: function () {
      const t = performance.now() / 1000;
      const beat = t * (98 / 60) * Math.PI * 2;
      const hit = Math.pow(Math.cos(beat) * 0.5 + 0.5, 1.35);
      const side = Math.sin(beat);
      const pop = Math.pow(Math.max(0, Math.sin(beat)), 2);

      const flex = 0.28 + hit * 0.42;
      const leftAx = -0.22 * side - 0.08;
      const rightAx = 0.22 * side - 0.08;
      const leftKx = -(flex + 0.45 * Math.max(-side, 0));
      const rightKx = -(flex + 0.45 * Math.max(side, 0));
      leftHip.rotation.set(leftAx, 0, 0.05 + Math.max(side, 0) * 0.12);
      leftKnee.rotation.set(leftKx, 0, 0);
      leftFoot.rotation.set(-(leftAx + leftKx), 0, 0);
      rightHip.rotation.set(rightAx, 0, -0.05 - Math.max(-side, 0) * 0.12);
      rightKnee.rotation.set(rightKx, 0, 0);
      rightFoot.rotation.set(-(rightAx + rightKx), 0, 0);

      const legReach = function (ax, kx) {
        return 0.78 - 0.39 * (Math.cos(ax) + Math.cos(ax + kx));
      };
      const plant = Math.min(legReach(leftAx, leftKx), legReach(rightAx, rightKx));
      const hop = (1 - hit) * 0.04;
      person.position.y = Math.min(0, hop - plant);
      person.position.x = side * 0.028;

      spine.rotation.set(0.03 + hit * 0.04, Math.sin(beat * 0.5) * 0.14, side * 0.14);
      chest.position.z = pop * 0.045;
      chest.rotation.x = pop * 0.12;
      const liftL = Math.pow(Math.max(side, 0), 0.65);
      const liftR = Math.pow(Math.max(-side, 0), 0.65);
      const ripple = Math.sin(beat * 2);
      const mix = function (a, b, t) { return a + (b - a) * t; };
      leftShoulder.position.y = 0.138 + liftL * 0.04;
      rightShoulder.position.y = 0.138 + liftR * 0.04;
      leftShoulder.rotation.set(mix(-1.15, -0.9, liftL), mix(-0.15, -0.45, liftL), mix(0.75, 1.85, liftL));
      leftElbow.rotation.set(mix(-0.85, -1.2, liftL) + ripple * 0.22, 0, 0.1);
      rightShoulder.rotation.set(mix(-1.15, -0.9, liftR), -mix(-0.15, -0.45, liftR), -mix(0.75, 1.85, liftR));
      rightElbow.rotation.set(mix(-0.85, -1.2, liftR) - ripple * 0.22, 0, -0.1);

      head.rotation.set(Math.sin(beat) * 0.1, Math.sin(beat * 0.5) * 0.12, -side * 0.07);
      const blink = Math.sin(t * 0.55) > 0.97;
      const lid = blink ? 2.6 : 1;
      lidL.scale.y = lid;
      lidR.scale.y = lid;
      tree.rotation.z = Math.sin(t * 0.6) * 0.012;
      shadow.position.x = person.position.x * 0.35;
      shadow.scale.setScalar(1.02 - hop * 2.2);
      mound.rotation.y = 0;
    },
    dispose: function () {
      disposeTree(root);
      stage.scene.fog = null;
    },
  };
}
