import type { Metadata } from "next";
import CoreShot from "@/components/octave-game/CoreShot";

export const metadata: Metadata = {
  title: "Core Shot | OCTAVE Playground",
  description: "An interactive three-stage arcade prototype. Pull, aim, and launch energy cores into reactors.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <CoreShot />;
}
