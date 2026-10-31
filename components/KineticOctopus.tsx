"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three/addons/controls/OrbitControls.js";
import styles from "./KineticOctopus.module.css";

type MotionMode = "orbit" | "deploy" | "disassemble";
type Lifecycle = "dormant" | "awakening" | "alive";
type Pose = { deploy: number; explode: number };
type Controller = {
  setMode: (mode: MotionMode) => void;
  setPlaying: (playing: boolean) => void;
  resetView: () => void;
  runSequence: () => void;
  reassemble: () => void;
  awaken: () => void;
  inspect: () => void;
};
type Telemetry = { yaw: number; pitch: number; fps: number };
type Grabbable = {
  kind: "arm" | "plate" | "optic";
  index: number;
  anchor: number;
  worldPosition: THREE.Vector3;
  label: string;
};

const ARM_COUNT = 8;
const LINKS_PER_ARM = 18;
const LINKS_TOTAL = ARM_COUNT * LINKS_PER_ARM;
const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;

function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number] = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function createMechanicalOctopus(scene: THREE.Scene) {
  const root = new THREE.Group();
  scene.add(root);

  const porcelain = new THREE.MeshPhysicalMaterial({
    color: 0xf2f2ed, metalness: 0.43, roughness: 0.24,
    clearcoat: 0.84, clearcoatRoughness: 0.12,
    envMapIntensity: 1.25,
  });
  const porcelainAlt = new THREE.MeshStandardMaterial({
    color: 0xdce0df, metalness: 0.72, roughness: 0.21,
    envMapIntensity: 1.15,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x26313a, metalness: 0.75, roughness: 0.23,
    envMapIntensity: 1.3,
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: 0x111e29, metalness: 0.5, roughness: 0.115,
    clearcoat: 0.94, clearcoatRoughness: 0.065,
    envMapIntensity: 1.4,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: 0xf05536, metalness: 0.37, roughness: 0.28,
    emissive: 0x5d150b, emissiveIntensity: 0.38,
  });
  const gunmetal = new THREE.MeshStandardMaterial({
    color: 0x8797a1, metalness: 0.92, roughness: 0.19,
    envMapIntensity: 1.2,
  });

  // A dark internal chassis, overlaid with twelve independently separable
  // ceramic shell plates. These are actual curved meshes, not a 2D sprite.
  const xrayChassis = graphite.clone();
  xrayChassis.transparent = true;
  xrayChassis.depthWrite = false;
  const chassis = addMesh(root, new THREE.SphereGeometry(0.86, 40, 28), xrayChassis);
  const platePorcelain = porcelain.clone();
  const plateAlt = porcelainAlt.clone();
  // Separate shell materials can become transparent without making the
  // articulated arms transparent in inspection mode.
  for (const mat of [platePorcelain, plateAlt]) {
    mat.transparent = true;
    mat.depthWrite = false;
  }
  const internalRig = new THREE.Group();
  root.add(internalRig);
  const innerMetal = new THREE.MeshStandardMaterial({
    color: 0x778b95, metalness: 0.84, roughness: 0.23,
  });
  const innerGlow = new THREE.MeshStandardMaterial({
    color: 0xf28d4e, emissive: 0xe55b27, emissiveIntensity: 0.76,
    metalness: 0.3, roughness: 0.31,
  });
  innerMetal.wireframe = true;
  addMesh(internalRig, new THREE.IcosahedronGeometry(0.68, 1), innerMetal);
  for (let i = 0; i < 3; i++) {
    const axisRing = addMesh(
      internalRig, new THREE.TorusGeometry(0.61 + i * 0.06, 0.018, 8, 56),
      i === 1 ? innerGlow : gunmetal,
    );
    axisRing.rotation.set(i * 0.78, (i + 1) * 0.72, 0);
  }
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU;
    const spoke = addMesh(
      internalRig, new THREE.CylinderGeometry(0.022, 0.022, 1.35, 9),
      i % 3 === 0 ? innerGlow : gunmetal,
    );
    spoke.rotation.z = angle - Math.PI / 2;
  }
  const plates: { mesh: THREE.Mesh; outward: THREE.Vector3; angle: number }[] = [];
  const manualPlateOffsets = Array.from({ length: 12 }, () => new THREE.Vector3());
  const manualArmOffsets = Array.from({ length: ARM_COUNT }, () => new THREE.Vector3());
  const manualArmAnchors = Array(ARM_COUNT).fill(0.77) as number[];
  const manualOpticOffset = new THREE.Vector3();

  // Distinct spring goals let fingers pull parts naturally without snapping
  // their visible geometry onto the pointer, and release always returns home.
  const plateTargets = manualPlateOffsets.map(() => new THREE.Vector3());
  const armTargets = manualArmOffsets.map(() => new THREE.Vector3());
  const opticTarget = new THREE.Vector3();
  const springs = [...manualArmOffsets, ...manualPlateOffsets, manualOpticOffset];
  const springTargets = [...armTargets, ...plateTargets, opticTarget];
  const springSpeeds = springs.map(() => new THREE.Vector3());
  const springDelta = new THREE.Vector3();
  const hoverField = {
    arm: -1, power: 0, targetPower: 0, theta: 0,
  };
  const awake = { value: 0, rainbow: 0, iris: 0 };
  const armWake = Array.from({ length: ARM_COUNT }, () => ({ value: 0 }));

  const armPickPoints = Array.from({ length: LINKS_TOTAL }, () => new THREE.Vector3());
  const plateCount = 12;
  for (let i = 0; i < plateCount; i++) {
    const phi = (i / plateCount) * TAU + 0.035;
    const segment = TAU / plateCount - 0.07;
    const geometry = new THREE.SphereGeometry(
      0.98, 14, 22, phi, segment, 0.19, Math.PI - 0.38,
    );
    const plate = addMesh(root, geometry, i % 3 === 0 ? plateAlt : platePorcelain);
    plates.push({
      mesh: plate,
      outward: new THREE.Vector3(
        Math.sin(phi + segment / 2),
        Math.cos((i / plateCount) * TAU) * 0.18,
        Math.cos(phi + segment / 2),
      ).normalize(),
      angle: phi,
    });
    // Real, thin gasket edges reinforce the mechanical panel design.
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 32),
      new THREE.LineBasicMaterial({ color: 0x687073, transparent: true, opacity: 0.33 }),
    );
    plate.add(edges);
  }

  const equator = addMesh(
    root, new THREE.TorusGeometry(0.94, 0.034, 7, 74), graphite,
  );
  equator.rotation.x = Math.PI / 2;

  const crown = new THREE.Group();
  crown.position.y = 0.88;
  root.add(crown);
  addMesh(crown, new THREE.CylinderGeometry(0.32, 0.42, 0.15, 32), graphite);
  addMesh(crown, new THREE.CylinderGeometry(0.25, 0.25, 0.16, 32), porcelain, [0, 0.12, 0]);
  addMesh(crown, new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32), orange, [0, 0.214, 0]);

  // The optical assembly is physically layered, with recessed glass, rim,
  // aperture, a central illuminated iris, and four miniature fasteners.
  const optic = new THREE.Group();
  optic.position.set(0, 0, 0.92);
  root.add(optic);
  addMesh(optic, new THREE.CylinderGeometry(0.44, 0.47, 0.23, 48), graphite, [0, 0, 0.07])
    .rotation.x = Math.PI / 2;
  addMesh(optic, new THREE.SphereGeometry(0.34, 36, 24), darkGlass, [0, 0, 0.18]);
  addMesh(optic, new THREE.TorusGeometry(0.365, 0.058, 10, 48), gunmetal, [0, 0, 0.19]);
  addMesh(optic, new THREE.TorusGeometry(0.275, 0.022, 8, 48), orange, [0, 0, 0.29]);
  addMesh(optic, new THREE.SphereGeometry(0.12, 24, 16), orange, [0, 0, 0.44]);
  addMesh(optic, new THREE.SphereGeometry(0.052, 16, 12), darkGlass, [0, 0, 0.535]);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU + Math.PI / 4;
    addMesh(
      optic, new THREE.SphereGeometry(0.042, 12, 8), porcelainAlt,
      [Math.cos(a) * 0.415, Math.sin(a) * 0.415, 0.203],
    );
  }

  // Smaller auxiliary optical ports make the object legible from oblique views.
  for (const side of [-1, 1]) {
    const port = new THREE.Group();
    port.position.set(side * 0.57, -0.2, 0.70);
    port.rotation.y = side * 0.53;
    root.add(port);
    addMesh(port, new THREE.CylinderGeometry(0.175, 0.19, 0.10, 24), graphite)
      .rotation.x = Math.PI / 2;
    addMesh(port, new THREE.SphereGeometry(0.13, 20, 14), darkGlass, [0, 0, 0.12]);
    addMesh(port, new THREE.TorusGeometry(0.145, 0.016, 8, 24), orange, [0, 0, 0.11]);
  }

  // Eight identical articulated arms, generated with instancing. A detailed
  // silhouette is achieved without hundreds of separate draw calls.
  const total = LINKS_TOTAL;
  const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  const narrowCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
  const jointSphere = new THREE.SphereGeometry(0.5, 12, 10);
  const torus = new THREE.TorusGeometry(0.5, 0.085, 7, 14);
  const marker = new THREE.BoxGeometry(1, 1, 1);

  const housing = new THREE.InstancedMesh(cylinder, porcelain, total);
  const spine = new THREE.InstancedMesh(narrowCylinder, graphite, total);
  const joints = new THREE.InstancedMesh(jointSphere, gunmetal, total);
  const collars = new THREE.InstancedMesh(torus, graphite, total);
  const signals = new THREE.InstancedMesh(marker, orange, total);
  const pins = new THREE.InstancedMesh(jointSphere, darkGlass, total);
  const amber = new THREE.Color(0xff8248);
  const rainbowColor = new THREE.Color();
  const signalColor = new THREE.Color();
  let lastSignalFrame = -1;
  let hadRainbow = false;

  for (const mesh of [housing, spine, joints, collars, signals, pins]) {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    root.add(mesh);
  }

  // Mechanical docking collars at the root of each arm.
  for (let i = 0; i < ARM_COUNT; i++) {
    const theta = (i / ARM_COUNT) * TAU;
    const hub = new THREE.Group();
    hub.position.set(Math.cos(theta) * 0.91, Math.sin(theta) * 0.91, 0.02);
    hub.rotation.z = theta - Math.PI / 2;
    root.add(hub);
    addMesh(hub, new THREE.CylinderGeometry(0.24, 0.28, 0.31, 16), graphite);
    addMesh(hub, new THREE.CylinderGeometry(0.205, 0.205, 0.16, 16), porcelainAlt, [0, 0.22, 0]);
    addMesh(hub, new THREE.TorusGeometry(0.21, 0.025, 8, 20), orange, [0, 0.31, 0])
      .rotation.x = Math.PI / 2;
  }

  // Faint orbit paths and registration marks, drawn behind the model.
  const rings: THREE.LineLoop[] = [];
  for (const radius of [2.42, 3.29, 4.18]) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 180; i++) {
      const a = (i / 180) * TAU;
      points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, -1.7));
    }
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xc9cfcb, transparent: true, opacity: 0.54 }),
    );
    scene.add(ring);
    rings.push(ring);
  }

  const dotPositions: number[] = [];
  for (let x = -7; x <= 7; x += 0.29) {
    for (let y = -5; y <= 5; y += 0.29) {
      if (Math.abs(x) < 4.7 && Math.abs(y) < 4.7) continue;
      dotPositions.push(x, y, -3.1);
    }
  }
  const gridGeometry = new THREE.BufferGeometry();
  gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
  const grid = new THREE.Points(
    gridGeometry,
    new THREE.PointsMaterial({ color: 0xb5bfbc, size: 0.018, transparent: true, opacity: 0.4, sizeAttenuation: true }),
  );
  scene.add(grid);

  const qFromY = new THREE.Quaternion();
  const qFromZ = new THREE.Quaternion();
  const identity = new THREE.Quaternion();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const zAxis = new THREE.Vector3(0, 0, 1);
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  const middle = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const poseMatrix = new THREE.Matrix4();
  const offset = new THREE.Vector3();
  const jointPosition = new THREE.Vector3();
  const collarPosition = new THREE.Vector3();
  const signalPosition = new THREE.Vector3();
  const pinPosition = new THREE.Vector3();
  const scaleVector = new THREE.Vector3();

  function armPoint(arm: number, t: number, phase: number, pose: Pose, isPlaying: boolean, output: THREE.Vector3) {
    const angle = (arm / ARM_COUNT) * TAU + 0.13;
    const curled = Math.max(0, (t - 0.65) / 0.35);
    const curlAngle = curled * Math.PI * (1.2 + (arm % 3) * 0.085);
    const hand = arm % 2 === 0 ? 1 : -1;
    const breath = isPlaying ? Math.sin(phase * 0.83 + arm * 0.93 + t * 5.4) : 0;

    // The final third turns back toward the chassis: a genuine terminal curl,
    // not a uniformly straight radial spoke. Deploy uncoils the same rig.
    const baseRadius = 1.04 + 3.52 * Math.min(t, 0.65);
    const foldedRadius = baseRadius
      + (t > 0.65 ? Math.sin(curlAngle) * 0.58 - curled * 0.18 : 0);
    const straightRadius = 1.04 + 3.63 * t;
    const radius = THREE.MathUtils.lerp(foldedRadius, straightRadius, pose.deploy)
      * (0.58 + 0.42 * armWake[arm].value);

    const foldedSide = hand * (1 - Math.cos(curlAngle)) * (0.66 + (arm % 3) * 0.09);
    const side = THREE.MathUtils.lerp(foldedSide, 0.06 * Math.sin(t * 4), pose.deploy)
      + breath * 0.12 * t;
    const depth = Math.sin(angle * 2.3) * 0.38 * t
      + (arm % 3 - 1) * 0.32 * curled
      + breath * 0.23 * t
      + hoverField.power * (hoverField.arm === arm ? 0.19 * t : 0);

    output.set(
      Math.cos(angle) * radius - Math.sin(angle) * side,
      Math.sin(angle) * radius + Math.cos(angle) * side,
      depth,
    );
    // Dragging a link bends the distal portion while leaving its root docked.
    const weight = THREE.MathUtils.smoothstep(t, 0.015, manualArmAnchors[arm]);
    output.addScaledVector(manualArmOffsets[arm], weight);
    return output;
  }

  function put(mesh: THREE.InstancedMesh, index: number, pos: THREE.Vector3, rotation: THREE.Quaternion, size: THREE.Vector3) {
    poseMatrix.compose(pos, rotation, size);
    mesh.setMatrixAt(index, poseMatrix);
  }

  function renderArms(phase: number, pose: Pose, isPlaying: boolean) {
    for (let arm = 0; arm < ARM_COUNT; arm++) {
      for (let joint = 0; joint < LINKS_PER_ARM; joint++) {
        const idx = arm * LINKS_PER_ARM + joint;
        const t = joint / LINKS_PER_ARM;
        const tNext = (joint + 1) / LINKS_PER_ARM;
        armPoint(arm, t, phase, pose, isPlaying, start);
        armPoint(arm, tNext, phase, pose, isPlaying, end);
        middle.copy(start).add(end).multiplyScalar(0.5);
        direction.copy(end).sub(start);
        const length = direction.length();
        direction.normalize();
        qFromY.setFromUnitVectors(yAxis, direction);
        qFromZ.setFromUnitVectors(zAxis, direction);
        const thickness = Math.max(0.067, 0.24 - t * 0.145);
        const separation = pose.explode * ((joint % 3 === 1 ? 0.17 : 0.04) + t * 0.13);
        offset.copy(middle).normalize().multiplyScalar(separation);
        middle.add(offset);
        armPickPoints[idx].copy(middle);

        scaleVector.set(thickness * 1.9, Math.max(0.07, length * 0.76), thickness * 1.9);
        put(housing, idx, middle, qFromY, scaleVector);
        scaleVector.set(thickness * 0.92, length * 1.10, thickness * 0.92);
        put(spine, idx, middle, qFromY, scaleVector);
        scaleVector.setScalar(thickness * 1.74);
        put(joints, idx, jointPosition.copy(end).add(offset), identity, scaleVector);
        scaleVector.set(thickness * 2.15, thickness * 2.15, thickness * 2.15);
        put(collars, idx, collarPosition.copy(start).add(offset), qFromZ, scaleVector);
        scaleVector.set(thickness * 0.70, Math.max(0.028, length * 0.18), thickness * 0.5);
        put(signals, idx, signalPosition.copy(middle).addScaledVector(zAxis, thickness), qFromY, scaleVector);
        scaleVector.setScalar(thickness * 0.45);
        put(pins, idx, pinPosition.copy(end).add(offset).addScaledVector(zAxis, thickness * 0.91), identity, scaleVector);
      }
    }
    for (const mesh of [housing, spine, joints, collars, signals, pins]) {
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  function updateDynamics(dt: number) {
    // Semi-implicit damped spring, always running even when ambient rotation
    // is paused. On release the target is zero, so parts pull themselves home.
    const step = Math.min(0.033, Math.max(0.001, dt));
    const stiffness = 91;
    const drag = Math.exp(-13.8 * step);
    for (let i = 0; i < springs.length; i++) {
      const position = springs[i];
      const velocity = springSpeeds[i];
      const target = springTargets[i];
      velocity.addScaledVector(
        springDelta.copy(target).sub(position), stiffness * step,
      ).multiplyScalar(drag);
      position.addScaledVector(velocity, step);
      if (target.lengthSq() < 0.00001 &&
          position.lengthSq() < 0.000001 &&
          velocity.lengthSq() < 0.0001) {
        position.set(0, 0, 0);
        velocity.set(0, 0, 0);
      }
    }
    hoverField.power += (hoverField.targetPower - hoverField.power)
      * (1 - Math.exp(-step * 8));
  }

  function updateRadiance(phase: number) {
    const glow = awake.iris;
    orange.emissiveIntensity = 0.18 + glow * (0.8 + 0.2 * Math.sin(phase * 3.9));
    innerGlow.emissiveIntensity = 0.25 + glow * 0.96;
    const tick = Math.floor(phase * 26);
    const rainbow = awake.rainbow;
    if (tick !== lastSignalFrame || (rainbow < 0.001 && hadRainbow)) {
      lastSignalFrame = tick;
      hadRainbow = rainbow >= 0.001;
      for (let arm = 0; arm < ARM_COUNT; arm++) {
        for (let link = 0; link < LINKS_PER_ARM; link++) {
          const t = link / LINKS_PER_ARM;
          const stripe = (phase * 0.29 - t + arm * 0.135 + 4) % 1;
          rainbowColor.setHSL(stripe, 0.89, 0.54);
          const flicker = Math.pow(Math.max(0, Math.sin(phase * 6.2
            - t * 8.8 - arm * 0.64)), 2);
          signalColor.copy(amber).lerp(rainbowColor, rainbow * flicker);
          signals.setColorAt(arm * LINKS_PER_ARM + link, signalColor);
        }
      }
      if (signals.instanceColor) signals.instanceColor.needsUpdate = true;
    }
  }

  function updateShell(explode: number) {
    for (let i = 0; i < plates.length; i++) {
      const plate = plates[i];
      plate.mesh.position.copy(plate.outward).multiplyScalar(explode * 0.51).add(manualPlateOffsets[i]);
      plate.mesh.rotation.set(
        Math.sin(plate.angle) * explode * 0.19,
        Math.cos(plate.angle) * explode * 0.19,
        0,
      );
    }
    optic.position.set(
      manualOpticOffset.x,
      manualOpticOffset.y,
      0.92 + explode * 0.56 + manualOpticOffset.z,
    );
    crown.position.y = 0.88 + explode * 0.25;
    equator.scale.setScalar(1 + explode * 0.14);
  }

  const opticMeshes: THREE.Mesh[] = [];
  optic.traverse((object) => {
    if (object instanceof THREE.Mesh) opticMeshes.push(object);
  });
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const projected = new THREE.Vector3();
  const coreTargets = [...opticMeshes, ...plates.map((plate) => plate.mesh)];

  function pick(
    camera: THREE.PerspectiveCamera,
    rect: DOMRect,
    clientX: number,
    clientY: number,
    isTouch: boolean,
  ): Grabbable | null {
    pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    camera.updateMatrixWorld();
    root.updateWorldMatrix(true, true);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(coreTargets, false)[0];

    // A generous screen-space grab radius makes narrow tentacles usable
    // on phones. Pick only on pointer-down, never during continuous motion.
    let armMatch: { index: number; distance: number } | null = null;
    for (let i = 2; i < armPickPoints.length; i++) {
      if (i % LINKS_PER_ARM < 2) continue;
      projected.copy(armPickPoints[i]).applyMatrix4(root.matrixWorld).project(camera);
      if (projected.z > 1 || projected.z < -1) continue;
      const screenX = rect.left + (projected.x * 0.5 + 0.5) * rect.width;
      const screenY = rect.top + (1 - (projected.y * 0.5 + 0.5)) * rect.height;
      const distance = Math.hypot(clientX - screenX, clientY - screenY);
      if (!armMatch || distance < armMatch.distance) armMatch = { index: i, distance };
    }
    const tolerance = isTouch ? 27 : 18;
    if (armMatch && (armMatch.distance < tolerance * 0.65 || (!hit && armMatch.distance < tolerance))) {
      const index = Math.floor(armMatch.index / LINKS_PER_ARM);
      const link = armMatch.index % LINKS_PER_ARM;
      return {
        kind: "arm",
        index,
        anchor: (link + 0.5) / LINKS_PER_ARM,
        worldPosition: armPickPoints[armMatch.index].clone().applyMatrix4(root.matrixWorld),
        label: `ARM ${String(index + 1).padStart(2, "0")} / LINK ${String(link + 1).padStart(2, "0")}`,
      };
    }
    if (!hit) return null;
    if (opticMeshes.includes(hit.object as THREE.Mesh)) {
      return {
        kind: "optic", index: 0, anchor: 1, worldPosition: hit.point.clone(),
        label: "OPTICAL CORE",
      };
    }
    const plateIndex = plates.findIndex((plate) => plate.mesh === hit.object);
    if (plateIndex === -1) return null;
    return {
      kind: "plate", index: plateIndex, anchor: 1, worldPosition: hit.point.clone(),
      label: `SHELL PANEL ${String(plateIndex + 1).padStart(2, "0")}`,
    };
  }

  function getManualOffset(part: Grabbable) {
    if (part.kind === "arm") return armTargets[part.index];
    if (part.kind === "plate") return plateTargets[part.index];
    return opticTarget;
  }

  function releasePart(part: Grabbable) {
    const target = getManualOffset(part);
    target.set(0, 0, 0);
  }

  function proximity(part: Grabbable | null) {
    if (part?.kind === "arm" && awake.value > 0.8) {
      hoverField.arm = part.index;
      hoverField.targetPower = 1;
    } else hoverField.targetPower = 0;
  }

  function countMovedParts() {
    return springs.filter((point) => point.lengthSq() > 0.0036).length;
  }

  return {
    root, renderArms, updateShell, updateDynamics, updateRadiance, rings, grid,
    pick, getManualOffset, releasePart, proximity, countMovedParts,
    manualArmAnchors, manualArmOffsets, manualPlateOffsets, manualOpticOffset,
    armTargets, plateTargets, opticTarget, springSpeeds, awake, armWake,
    shellMaterials: [platePorcelain, plateAlt, xrayChassis],
    optic, internalRig,
  };
}

export default function KineticOctopus() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [mode, setMode] = useState<MotionMode>("orbit");
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry>({ yaw: 0, pitch: 0, fps: 0 });
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [movedParts, setMovedParts] = useState(0);

  useEffect(() => {
    const node = stageRef.current;
    const canvas = canvasRef.current;
    if (!node || !canvas) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([
      import("gsap"),
      import("three/addons/controls/OrbitControls.js"),
    ]).then(([gsapModule, controlsModule]) => {
      if (disposed) return;
      const gsap = gsapModule.gsap;
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas, antialias: true, alpha: true, powerPreference: "high-performance",
        });
      } catch {
        setUnsupported(true);
        return;
      }
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.4 : 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.14;
      renderer.setClearColor(0xf7f7f3, 0);

      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x89939b, 2.4));
      const light1 = new THREE.DirectionalLight(0xffffff, 3.3);
      light1.position.set(-3, 5, 7);
      scene.add(light1);
      const light2 = new THREE.DirectionalLight(0xfcc8a8, 1.8);
      light2.position.set(6, -2, 4);
      scene.add(light2);
      const light3 = new THREE.DirectionalLight(0xc2d8ef, 1.2);
      light3.position.set(1, 1, -5);
      scene.add(light3);

      const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 70);
      camera.position.set(0.15, 0.7, mobile ? 14.8 : 12.0);
      const controls: OrbitControlsType = new controlsModule.OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enablePan = false;
      controls.minDistance = 7.2;
      controls.maxDistance = 20;
      controls.rotateSpeed = 0.62;
      controls.zoomSpeed = 0.74;
      controls.touches.ONE = THREE.TOUCH.ROTATE;
      controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
      controls.target.set(0, 0, 0);

      const robot = createMechanicalOctopus(scene);
      const pose: Pose = { deploy: 0, explode: 0 };
      const running = { current: !reduced };
      if (reduced) setPlaying(false);
      let sequence: ReturnType<typeof gsap.timeline> | null = null;
      let phase = 0;
      let lastTime = performance.now();
      let lastReadout = 0;

      function setMotionMode(nextMode: MotionMode) {
        sequence?.kill();
        sequence = null;
        const next = {
          deploy: nextMode === "deploy" ? 1 : nextMode === "disassemble" ? 0.54 : 0,
          explode: nextMode === "disassemble" ? 1 : 0,
        };
        gsap.killTweensOf(pose);
        if (reduced) Object.assign(pose, next);
        else gsap.to(pose, { ...next, duration: 1.85, ease: "power3.inOut", overwrite: true });
      }

      controllerRef.current = {
        setMode: setMotionMode,
        reassemble() {
          sequence?.kill();
          sequence = null;
          gsap.killTweensOf(pose);
          const offsets = [
            ...robot.manualArmOffsets,
            ...robot.manualPlateOffsets,
            robot.manualOpticOffset,
          ];
          for (const value of offsets) {
            gsap.killTweensOf(value);
            if (reduced) value.set(0, 0, 0);
            else gsap.to(value, {
              x: 0, y: 0, z: 0, duration: 1.45, ease: "power3.inOut",
            });
          }
          if (reduced) Object.assign(pose, { deploy: 0, explode: 0 });
          else gsap.to(pose, {
            deploy: 0, explode: 0, duration: 1.55, ease: "power3.inOut",
          });
          setMode("orbit");
          setSelectedPart(null);
          setIsGrabbing(false);
          setMovedParts(0);
        },
        setPlaying(value: boolean) {
          running.current = value && !reduced;
          sequence?.paused(!value);
        },
        runSequence() {
          sequence?.kill();
          gsap.killTweensOf(pose);
          if (reduced) {
            Object.assign(pose, { deploy: 0.54, explode: 1 });
            setMode("disassemble");
            return;
          }
          running.current = true;
          setPlaying(true);
          sequence = gsap.timeline({
            onComplete: () => {
              setMode("orbit");
              sequence = null;
            },
          });
          sequence
            .call(() => setMode("deploy"), [], 0)
            .to(pose, { deploy: 1, explode: 0, duration: 2.15, ease: "power3.inOut" }, 0)
            .call(() => setMode("disassemble"), [], 2.65)
            .to(pose, { deploy: 0.54, explode: 1, duration: 2.45, ease: "power3.inOut" }, 2.65)
            .call(() => setMode("orbit"), [], 5.85)
            .to(pose, { deploy: 0, explode: 0, duration: 2.5, ease: "power3.inOut" }, 5.85);
        },
        resetView() {
          gsap.killTweensOf(camera.position);
          if (reduced) camera.position.set(0.15, 0.7, mobile ? 14.8 : 12.0);
          else gsap.to(camera.position, {
            x: 0.15, y: 0.7, z: mobile ? 14.8 : 12.0,
            duration: 1.2, ease: "power3.inOut",
          });
          controls.target.set(0, 0, 0);
          controls.update();
        },
      };

      // Ray casting and a camera-facing drag plane use the same physical
      // interaction for mouse, pen and single-finger touch. Empty-space
      // gestures continue to belong to OrbitControls.
      const pointerRay = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      const rayHit = new THREE.Vector3();
      const dragNormal = new THREE.Vector3();
      type DragSession = {
        pointerId: number;
        part: Grabbable;
        plane: THREE.Plane;
        localStart: THREE.Vector3;
        offsetStart: THREE.Vector3;
        startX: number;
        startY: number;
      };
      let activeDrag: DragSession | null = null;

      function updateRayFromPointer(event: PointerEvent) {
        const bounds = canvas!.getBoundingClientRect();
        pointerNdc.set(
          ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
          -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
        );
        pointerRay.setFromCamera(pointerNdc, camera);
      }

      function releaseDrag(event?: PointerEvent) {
        if (!activeDrag || (event && activeDrag.pointerId !== event.pointerId)) return;
        const pointerId = activeDrag.pointerId;
        activeDrag = null;
        controls.enabled = true;
        canvas!.style.cursor = "grab";
        setIsGrabbing(false);
        if (canvas!.hasPointerCapture(pointerId)) canvas!.releasePointerCapture(pointerId);
        setMovedParts(robot.countMovedParts());
      }

      function onPointerDown(event: PointerEvent) {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (activeDrag) {
          if (event.pointerType === "touch" && activeDrag.pointerId !== event.pointerId) {
            releaseDrag();
          }
          return;
        }
        const part = robot.pick(
          camera, canvas!.getBoundingClientRect(),
          event.clientX, event.clientY, event.pointerType === "touch",
        );
        if (!part) {
          setSelectedPart(null);
          return;
        }
        // Capture before OrbitControls begins its own single-pointer gesture.
        controls.enabled = false;
        sequence?.kill();
        sequence = null;
        gsap.killTweensOf(pose);
        const targetOffset = robot.getManualOffset(part);
        gsap.killTweensOf(targetOffset);
        if (part.kind === "arm") {
          robot.manualArmAnchors[part.index] = Math.max(0.17, part.anchor);
        }
        camera.getWorldDirection(dragNormal);
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
          dragNormal, part.worldPosition,
        );
        const localStart = robot.root.worldToLocal(part.worldPosition.clone());
        activeDrag = {
          pointerId: event.pointerId,
          part,
          plane,
          localStart,
          offsetStart: targetOffset.clone(),
          startX: event.clientX,
          startY: event.clientY,
        };
        running.current = false;
        setPlaying(false);
        setSelectedPart(part.label);
        setIsGrabbing(true);
        canvas!.style.cursor = "grabbing";
        canvas!.setPointerCapture(event.pointerId);
        event.preventDefault();
      }

      function onPointerMove(event: PointerEvent) {
        const drag = activeDrag;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 2) return;
        updateRayFromPointer(event);
        if (!pointerRay.ray.intersectPlane(drag.plane, rayHit)) return;
        // Local-space offsets keep parts attached to the rotating organism.
        const delta = robot.root.worldToLocal(rayHit.clone()).sub(drag.localStart);
        robot.getManualOffset(drag.part)
          .copy(drag.offsetStart)
          .add(delta)
          .clampLength(0, 3.0);
        event.preventDefault();
      }

      canvas!.addEventListener("pointerdown", onPointerDown, { capture: true });
      canvas!.addEventListener("pointermove", onPointerMove, { capture: true });
      canvas!.addEventListener("pointerup", releaseDrag);
      canvas!.addEventListener("pointercancel", releaseDrag);

      function resize() {
        const { width, height } = node!.getBoundingClientRect();
        if (width < 1 || height < 1) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(Math.round(width), Math.round(height), false);
      }
      const ro = new ResizeObserver(resize);
      ro.observe(node);
      resize();

      let raf = 0;
      function draw(now: number) {
        const delta = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        if (running.current) {
          phase += delta;
          robot.root.rotation.y += delta * 0.085;
          robot.root.position.y = Math.sin(phase * 0.7) * 0.085;
        }
        robot.renderArms(phase, pose, running.current);
        robot.updateShell(pose.explode);
        controls.update();
        renderer.render(scene, camera);
        if (now - lastReadout > 420) {
          lastReadout = now;
          const position = camera.position.clone().sub(controls.target);
          setTelemetry({
            yaw: Math.round(Math.atan2(position.x, position.z) * DEG),
            pitch: Math.round(Math.atan2(position.y, Math.hypot(position.x, position.z)) * DEG),
            fps: Math.round(1 / Math.max(delta, 0.001)),
          });
        }
        raf = window.requestAnimationFrame(draw);
      }
      raf = window.requestAnimationFrame(draw);
      setReady(true);

      const onContextLost = (event: Event) => {
        event.preventDefault();
        window.cancelAnimationFrame(raf);
        setUnsupported(true);
      };
      canvas!.addEventListener("webglcontextlost", onContextLost);

      cleanup = () => {
        window.cancelAnimationFrame(raf);
        canvas!.removeEventListener("webglcontextlost", onContextLost);
        ro.disconnect();
        releaseDrag();
        canvas!.removeEventListener("pointerdown", onPointerDown, true);
        canvas!.removeEventListener("pointermove", onPointerMove, true);
        canvas!.removeEventListener("pointerup", releaseDrag);
        canvas!.removeEventListener("pointercancel", releaseDrag);
        controls.dispose();
        sequence?.kill();
        gsap.killTweensOf(pose);
        gsap.killTweensOf(camera.position);
        controllerRef.current = null;
        const geometries = new Set<THREE.BufferGeometry>();
        const materials = new Set<THREE.Material>();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            geometries.add(object.geometry);
            const values = Array.isArray(object.material) ? object.material : [object.material];
            for (const material of values) materials.add(material);
          }
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
      };
    }).catch(() => {
      if (!disposed) setUnsupported(true);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  function selectMode(nextMode: MotionMode) {
    setMode(nextMode);
    controllerRef.current?.setMode(nextMode);
  }
  function togglePlay() {
    setPlaying((value) => {
      controllerRef.current?.setPlaying(!value);
      return !value;
    });
  }

  return (
    <div className={styles.lab}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.symbol} aria-hidden="true">O8</span>
          <div>
            <span className={styles.identityName}>OCTAVE / 08</span>
            <span className={styles.identitySub}>KINETIC SYSTEMS LABORATORY</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.live}><span aria-hidden="true" /> {ready ? "RENDER ACTIVE" : "INITIALIZING"}</span>
          <Link href="/" className={styles.backLink}>RETURN TO RLEMOR.COM <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}><span>EXPERIMENT 001</span> / PROCEDURAL MECHANICS</p>
          <h1>An object <em>in motion.</em></h1>
          <p className={styles.intro}>A mechanical organism built from code. Eight articulated arms, an illuminated optical core, and an assembly that responds to you.</p>
        </div>
        <div className={styles.headingIndex} aria-hidden="true">
          <span>R&D</span>
          <strong>01 / 03</strong>
        </div>
      </div>

      <div className={styles.workspace}>
        <aside className={styles.readouts} aria-label="Model specifications">
          <div className={styles.asideHeading}>
            <span className={styles.square} aria-hidden="true" />
            <span>CONSTRUCTION DATA</span>
          </div>
          <div className={styles.readout}>
            <span>MANIPULATORS</span>
            <strong>08<span className={styles.suffix}> / 08</span></strong>
            <p>Independent articulated arms</p>
          </div>
          <div className={styles.readout}>
            <span>MECHANICAL LINKS</span>
            <strong>{String(LINKS_TOTAL).padStart(3, "0")}</strong>
            <p>Instanced moving segments</p>
          </div>
          <div className={styles.readout}>
            <span>CHASSIS PLATES</span>
            <strong>12</strong>
            <p>Separately animated shell panels</p>
          </div>
          <div className={styles.diagram} aria-hidden="true">
            <span className={styles.diagramLabel}>MODULE ARRANGEMENT</span>
            <svg viewBox="0 0 180 134">
              <circle cx="90" cy="67" r="20" fill="none" stroke="#333b3c" strokeWidth="1.5"/>
              <circle cx="90" cy="67" r="9" fill="#ef5236"/>
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle), y = Math.sin(angle);
                return <g key={i}>
                  <path d={"M " + (90 + x * 24) + " " + (67 + y * 24) + " Q " + (90 + x * 44 - y * 7) + " " + (67 + y * 44 + x * 7) + " " + (90 + x * 59) + " " + (67 + y * 59)} fill="none" stroke="#687372" strokeWidth="2"/>
                  <circle cx={90 + x * 59} cy={67 + y * 59} r="2.4" fill="#ef5236"/>
                </g>;
              })}
              <circle cx="90" cy="67" r="63" stroke="#d9dcd4" fill="none" strokeDasharray="2 5"/>
            </svg>
            <span>RADIAL / EIGHT-AXIS LAYOUT</span>
          </div>
        </aside>

        <section className={styles.viewerShell} aria-label="Interactive three-dimensional mechanical octopus model">
          <div className={styles.viewerTop}>
            <span>FIG. 01 <i aria-hidden="true" /> ARTICULATED FORM</span>
            <span>3D / REAL-TIME</span>
          </div>
          <div className={styles.stage} ref={stageRef}>
            <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Interactive 3D mechanical octopus. Drag an arm or shell panel to reposition it. Drag empty space to rotate. Pinch or scroll to zoom." />
            {ready && !unsupported && (
              <div className={styles.partStatus} role="status" aria-live="polite">
                <span className={styles.partStatusDot} aria-hidden="true" />
                {selectedPart
                  ? `${isGrabbing ? "GRABBED" : "SELECTED"} / ${selectedPart}`
                  : "DIRECT MANIPULATION / ENABLED"}
                {selectedPart && <span className={styles.partStatusHint}>DRAG TO REPOSITION</span>}
              </div>
            )}
            {!ready && !unsupported && <div className={styles.loading} role="status">INITIALIZING GEOMETRY <span aria-hidden="true">···</span></div>}
            <noscript><div className={styles.noScript}>Enable JavaScript to explore the live 3D model.</div></noscript>
            {unsupported && <div className={styles.unsupported} role="status">This device cannot display the live 3D scene. Motion controls require WebGL.</div>}
            <div className={styles.crosshair} aria-hidden="true"><span /><span /></div>
            <div className={styles.stageCode} aria-hidden="true">
              <span>OC-08 / PROTOTYPE</span>
              <span>ORIGIN: PROCEDURAL</span>
            </div>
            <div className={styles.axisLabel} aria-hidden="true">X / Y / Z</div>
          </div>
          <div className={styles.viewerFooter}>
            <span><span className={styles.orangeDot} aria-hidden="true" /> DRAG AN ARM OR PANEL <span className={styles.sep}>/</span> EMPTY SPACE TO ORBIT</span>
            <span>NOT A RENDER. AN INTERACTIVE MODEL.</span>
          </div>
        </section>

        <aside className={styles.controlPanel} aria-label="Animation controls">
          <div className={styles.asideHeading}>
            <span className={styles.square} aria-hidden="true" />
            <span>BEHAVIOR CONTROL</span>
          </div>
          <p className={styles.controlIntro}>Drag a tentacle or shell piece to move it with your mouse or finger. Drag empty space to rotate the model.</p>
          <div className={styles.modes} role="group" aria-label="Choose animation behavior">
            <button type="button" className={mode === "orbit" ? styles.modeActive : styles.mode} aria-pressed={mode === "orbit"} onClick={() => selectMode("orbit")}>
              <span className={styles.modeNumber}>01</span><span className={styles.modeTitle}>Drift</span><span aria-hidden="true">↗</span>
            </button>
            <button type="button" className={mode === "deploy" ? styles.modeActive : styles.mode} aria-pressed={mode === "deploy"} onClick={() => selectMode("deploy")}>
              <span className={styles.modeNumber}>02</span><span className={styles.modeTitle}>Extend</span><span aria-hidden="true">↗</span>
            </button>
            <button type="button" className={mode === "disassemble" ? styles.modeActive : styles.mode} aria-pressed={mode === "disassemble"} onClick={() => selectMode("disassemble")}>
              <span className={styles.modeNumber}>03</span><span className={styles.modeTitle}>Disassemble</span><span aria-hidden="true">↗</span>
            </button>
          </div>
          <p className={styles.modeDescription}>
            {mode === "orbit" ? "Ambient rotation with independently undulating arms." : mode === "deploy" ? "The manipulators extend outward into a wider configuration." : "The chassis plates separate and the links open into an exploded view."}
          </p>
          <button type="button" className={styles.sequenceButton} disabled={!ready} onClick={() => controllerRef.current?.runSequence()}>
            <span>▶</span> RUN FULL SEQUENCE <span>↗</span>
          </button>
          <button type="button" className={styles.reassembleButton} disabled={!ready} onClick={() => controllerRef.current?.reassemble()}>
            <span>↺</span> REASSEMBLE ALL PARTS <span>{movedParts ? `${movedParts} MOVED` : "RESET"}</span>
          </button>
          <div className={styles.secondaryControls}>
            <button type="button" disabled={!ready} onClick={togglePlay}>{playing ? "Ⅱ  PAUSE MOTION" : "▷  PLAY MOTION"}</button>
            <button type="button" disabled={!ready} onClick={() => controllerRef.current?.resetView()}>↺  RESET CAMERA</button>
          </div>
          <div className={styles.telemetry}>
            <p>LIVE CAMERA ORIENTATION</p>
            <div><span>YAW</span><strong>{telemetry.yaw}°</strong></div>
            <div><span>PITCH</span><strong>{telemetry.pitch}°</strong></div>
            <div><span>FRAME RATE*</span><strong>{ready ? telemetry.fps + " FPS" : "···"}</strong></div>
            <small>*Browser-reported rendering estimate</small>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        <span>OCTAVE / 08 <span className={styles.footSep}>·</span> INTERACTIVE SYSTEM STUDY</span>
        <span>BUILT WITH THREE.JS + GSAP <span className={styles.footSep}>·</span> EXPERIMENTAL, NOT PRODUCTION</span>
        <Link href="/">RLEMOR.COM ↗</Link>
      </footer>
    </div>
  );
}
