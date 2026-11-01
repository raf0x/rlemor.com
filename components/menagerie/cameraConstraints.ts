/**
 * Camera safety rails for the Synthetic Menagerie.
 *
 * Keep the visitor in a curated interior viewing volume. In particular,
 * unlimited azimuth + zoom used to put the camera behind the exterior
 * walls, leaving the viewport pointed at unlit geometry.
 *
 * These numbers correspond to the existing hall geometry:
 * side walls x=±10.85; roof y≈8.6; back z≈-19.3; front floor z≈16.3.
 * A shallow free-look arc is intentional. Users can visit any exhibit via
 * the camera-navigation buttons or directly tapping a plinth.
 */
export type Point3 = { x: number; y: number; z: number };
export type ViewKind = "entrance" | "exhibit";
export type OrbitLimits = {
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
};

export const INTERIOR_BOUNDS = Object.freeze({
  minX: -9.3,
  maxX: 9.3,
  minY: 1.25,
  maxY: 7.55,
  minZ: -17.6,
  maxZ: 18.35,
});

export function clampIntoMuseum<T extends Point3>(position: T): T {
  const b = INTERIOR_BOUNDS;
  position.x = Math.min(b.maxX, Math.max(b.minX, position.x));
  position.y = Math.min(b.maxY, Math.max(b.minY, position.y));
  position.z = Math.min(b.maxZ, Math.max(b.minZ, position.z));
  return position;
}

export function insideMuseum(pos: Point3, epsilon = 0.001): boolean {
  const b = INTERIOR_BOUNDS;
  return pos.x >= b.minX - epsilon && pos.x <= b.maxX + epsilon &&
    pos.y >= b.minY - epsilon && pos.y <= b.maxY + epsilon &&
    pos.z >= b.minZ - epsilon && pos.z <= b.maxZ + epsilon;
}

/** OrbitControls azimuth uses atan2(camera.x-target.x, camera.z-target.z). */
export function azimuthFrom(camera: Point3, target: Point3): number {
  return Math.atan2(camera.x - target.x, camera.z - target.z);
}

export function orbitLimits(kind: ViewKind, azimuth: number): OrbitLimits {
  const halfYaw = kind === "entrance" ? .245 : .335;
  // At the entrance the orbit radius is ~22 m, so even a moderately large
  // pitch change could send the camera through the ceiling or floor.
  const minPolar = kind === "entrance" ? 1.38 : 1.20;
  const maxPolar = kind === "entrance" ? 1.59 : 1.65;
  return {
    minAzimuthAngle: azimuth - halfYaw,
    maxAzimuthAngle: azimuth + halfYaw,
    minPolarAngle: minPolar,
    maxPolarAngle: maxPolar,
    minDistance: kind === "entrance" ? 14.8 : 4.20,
    maxDistance: kind === "entrance" ? 22.35 : 8.80,
  };
}

