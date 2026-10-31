"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsType } from "three/addons/controls/OrbitControls.js";
import styles from "./KineticOctopus.module.css";

type MotionMode = "orbit" | "deploy" | "disassemble";
type Pose = { deploy: number; explode: number };
type Controller = {
  setMode: (mode: MotionMode) => void;
  setPlaying: (playing: boolean) => void;
  resetView: () => void;
};
type Telemetry = { yaw: number; pitch: number; fps: number };

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
    color: 0xf0f1ed, metalness: 0.28, roughness: 0.28,
    clearcoat: 0.56, clearcoatRoughness: 0.19,
  });
  const porcelainAlt = new THREE.MeshStandardMaterial({
    color: 0xd6d9d5, metalness: 0.64, roughness: 0.29,
  });
  const graphite = new THREE.MeshStandardMaterial({
    color: 0x252c31, metalness: 0.68, roughness: 0.3,
  });
  const darkGlass = new THREE.MeshPhysicalMaterial({
    color: 0x111b22, metalness: 0.35, roughness: 0.17,
    clearcoat: 0.9, clearcoatRoughness: 0.09,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: 0xf05536, metalness: 0.37, roughness: 0.28,
    emissive: 0x5d150b, emissiveIntensity: 0.38,
  });
  const gunmetal = new THREE.MeshStandardMaterial({
    color: 0x7e8989, metalness: 0.86, roughness: 0.25,
  });

  // A dark internal chassis, overlaid with twelve independently separable
  // ceramic shell plates. These are actual curved meshes, not a 2D sprite.
  addMesh(root, new THREE.SphereGeometry(0.86, 40, 28), graphite);
  const plates: { mesh: THREE.Mesh; outward: THREE.Vector3; angle: number }[] = [];
  const plateCount = 12;
  for (let i = 0; i < plateCount; i++) {
    const phi = (i / plateCount) * TAU + 0.035;
    const segment = TAU / plateCount - 0.07;
    const geometry = new THREE.SphereGeometry(
      0.98, 14, 22, phi, segment, 0.19, Math.PI - 0.38,
    );
    const plate = addMesh(root, geometry, i % 3 === 0 ? porcelainAlt : porcelain);
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
  const scaleVector = new THREE.Vector3();

  function armPoint(arm: number, t: number, phase: number, pose: Pose, isPlaying: boolean) {
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
    const radius = THREE.MathUtils.lerp(foldedRadius, straightRadius, pose.deploy);

    const foldedSide = hand * (1 - Math.cos(curlAngle)) * (0.66 + (arm % 3) * 0.09);
    const side = THREE.MathUtils.lerp(foldedSide, 0.06 * Math.sin(t * 4), pose.deploy)
      + breath * 0.12 * t;
    const depth = Math.sin(angle * 2.3) * 0.38 * t
      + (arm % 3 - 1) * 0.32 * curled
      + breath * 0.23 * t;

    return new THREE.Vector3(
      Math.cos(angle) * radius - Math.sin(angle) * side,
      Math.sin(angle) * radius + Math.cos(angle) * side,
      depth,
    );
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
        start.copy(armPoint(arm, t, phase, pose, isPlaying));
        end.copy(armPoint(arm, tNext, phase, pose, isPlaying));
        middle.copy(start).add(end).multiplyScalar(0.5);
        direction.copy(end).sub(start);
        const length = direction.length();
        direction.normalize();
        qFromY.setFromUnitVectors(yAxis, direction);
        qFromZ.setFromUnitVectors(zAxis, direction);
        const thickness = Math.max(0.067, 0.24 - t * 0.145);
        const separation = pose.explode * ((joint % 3 === 1 ? 0.17 : 0.04) + t * 0.13);
        const radial = middle.clone().normalize();
        offset.copy(radial).multiplyScalar(separation);
        middle.add(offset);

        scaleVector.set(thickness * 1.9, Math.max(0.07, length * 0.76), thickness * 1.9);
        put(housing, idx, middle, qFromY, scaleVector);
        scaleVector.set(thickness * 0.92, length * 1.10, thickness * 0.92);
        put(spine, idx, middle, qFromY, scaleVector);
        scaleVector.setScalar(thickness * 1.74);
        put(joints, idx, end.clone().add(offset), identity, scaleVector);
        scaleVector.set(thickness * 2.15, thickness * 2.15, thickness * 2.15);
        put(collars, idx, start.clone().add(offset), qFromZ, scaleVector);
        scaleVector.set(thickness * 0.70, Math.max(0.028, length * 0.18), thickness * 0.5);
        put(signals, idx, middle.clone().addScaledVector(new THREE.Vector3(0, 0, 1), thickness), qFromY, scaleVector);
        scaleVector.setScalar(thickness * 0.45);
        put(pins, idx, end.clone().add(offset).addScaledVector(new THREE.Vector3(0, 0, 1), thickness * 0.91), identity, scaleVector);
      }
    }
    for (const mesh of [housing, spine, joints, collars, signals, pins]) {
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  function updateShell(explode: number) {
    for (const plate of plates) {
      plate.mesh.position.copy(plate.outward).multiplyScalar(explode * 0.51);
      plate.mesh.rotation.set(
        Math.sin(plate.angle) * explode * 0.19,
        Math.cos(plate.angle) * explode * 0.19,
        0,
      );
    }
    optic.position.z = 0.92 + explode * 0.56;
    crown.position.y = 0.88 + explode * 0.25;
    equator.scale.setScalar(1 + explode * 0.14);
  }

  return { root, renderArms, updateShell, rings, grid };
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
      let phase = 0;
      let lastTime = performance.now();
      let lastReadout = 0;

      function setMotionMode(nextMode: MotionMode) {
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
        setPlaying(value: boolean) { running.current = value && !reduced; },
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
        controls.dispose();
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
            <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Interactive 3D mechanical octopus. Drag to rotate, pinch or scroll to zoom." />
            {!ready && !unsupported && <div className={styles.loading} role="status">INITIALIZING GEOMETRY <span aria-hidden="true">···</span></div>}
            {unsupported && <div className={styles.unsupported} role="status">This device cannot display the live 3D scene. Motion controls require WebGL.</div>}
            <div className={styles.crosshair} aria-hidden="true"><span /><span /></div>
            <div className={styles.stageCode} aria-hidden="true">
              <span>OC-08 / PROTOTYPE</span>
              <span>ORIGIN: PROCEDURAL</span>
            </div>
            <div className={styles.axisLabel} aria-hidden="true">X / Y / Z</div>
          </div>
          <div className={styles.viewerFooter}>
            <span><span className={styles.orangeDot} aria-hidden="true" /> DRAG TO ORBIT <span className={styles.sep}>/</span> SCROLL OR PINCH TO ZOOM</span>
            <span>NOT A RENDER. AN INTERACTIVE MODEL.</span>
          </div>
        </section>

        <aside className={styles.controlPanel} aria-label="Animation controls">
          <div className={styles.asideHeading}>
            <span className={styles.square} aria-hidden="true" />
            <span>BEHAVIOR CONTROL</span>
          </div>
          <p className={styles.controlIntro}>Change the organism&apos;s physical state. Each mode transitions into the next.</p>
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
