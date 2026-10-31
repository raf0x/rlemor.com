import type { Metadata } from "next";
import KineticOctopus from "@/components/KineticOctopus";

export const metadata: Metadata = {
  title: "Octave / 08 | Kinetic systems experiment",
  description: "An interactive, procedural mechanical octopus built with Three.js and GSAP. An independent motion experiment by Rafael Lemor.",
  robots: { index: false, follow: false },
};

export default function KineticLabPage() {
  return <KineticOctopus />;
}
