import type { Metadata } from "next";
import FirstContact from "@/components/octave-v4/FirstContact";

export const metadata: Metadata = {
  title: "First Contact | OCTAVE / 08",
  description: "Meet Octave, an interactive mechanical creature that notices, reacts and opens up to visitors.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function Page() {
  return <FirstContact />;
}
