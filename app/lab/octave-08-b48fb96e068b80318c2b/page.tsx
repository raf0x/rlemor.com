import type { Metadata } from "next";
import KineticOctopus from "@/components/KineticOctopus";

// Unlisted experiment: absent from site navigation and the static sitemap.
// This is URL-only discoverability, not authentication or access control.
export const metadata: Metadata = {
  title: "Octave / 08 | Kinetic systems experiment",
  description: "An interactive, procedural mechanical octopus built with Three.js and GSAP.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function OctaveLabPage() {
  return <KineticOctopus />;
}
