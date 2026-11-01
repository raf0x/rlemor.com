import type { Metadata } from "next";
import OctaveV3 from "@/components/octave-v3/OctaveV3";

export const metadata: Metadata = {
  title: "OCTAVE / 08 V3 | Kinetic Systems Laboratory",
  description: "An interactive mechanical simulator with coordinated motion, a deterministic tour, and colorful procedural geometry.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <OctaveV3 />;
}
