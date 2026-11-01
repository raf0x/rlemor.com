/**
 * The Synthetic Menagerie, museum shell.
 * Six architectural stations. Creatures are deliberately NOT installed yet.
 * This array is the single source of truth for labels, visits and the map.
 */
export type ExhibitId =
  | "octave-spectrum" | "octave-chassis" | "aether"
  | "medusa" | "atlas" | "frog";

export type Exhibit = {
  id: ExhibitId;
  number: string;
  name: string;
  subtitle: string;
  classification: string;
  short: string;
  wing: "WEST WING" | "EAST WING";
  x: number;
  z: number;
  scale: number;
};

export const EXHIBITS: readonly Exhibit[] = [
  {
    id:"octave-spectrum",number:"01",name:"Octave",
    subtitle:"Obsidian Spectrum",classification:"MECHANICAL CEPHALOPOD",
    short:"Chrome, articulated motion, and a living spectrum of light.",
    wing:"WEST WING",x:-5.35,z:6.1,scale:1.15,
  },
  {
    id:"octave-chassis",number:"02",name:"Octave",
    subtitle:"Experimental Chassis",classification:"KINETIC SYSTEMS",
    short:"The exposed machine: extension, disassembly, and X-ray.",
    wing:"EAST WING",x:5.35,z:6.1,scale:1.15,
  },
  {
    id:"aether",number:"03",name:"Aether",
    subtitle:"The Manta",classification:"AERIAL ORGANISM",
    short:"A study in weightlessness and articulated wings.",
    wing:"WEST WING",x:-5.35,z:-2.0,scale:1.35,
  },
  {
    id:"medusa",number:"04",name:"Medusa",
    subtitle:"The Jellyfish",classification:"LUMINOUS ORGANISM",
    short:"A suspended form of light, translucency, and motion.",
    wing:"EAST WING",x:5.35,z:-2.0,scale:1.2,
  },
  {
    id:"atlas",number:"05",name:"Atlas",
    subtitle:"The Scarab",classification:"ARMORED ORGANISM",
    short:"A mechanical exoskeleton built to unfold.",
    wing:"WEST WING",x:-5.35,z:-10.1,scale:1,
  },
  {
    id:"frog",number:"06",name:"Frog",
    subtitle:"The Amphibian",classification:"AMPHIBIOUS ORGANISM",
    short:"A nocturnal sculpture of agility and bioluminescence.",
    wing:"EAST WING",x:5.35,z:-10.1,scale:.9,
  },
] as const;

export function getExhibit(index: number): Exhibit | null {
  return Number.isInteger(index) && index >= 0 && index < EXHIBITS.length
    ? EXHIBITS[index] : null;
}

export function nextExhibit(current: number | null, direction: 1 | -1): number {
  const start = current ?? (direction === 1 ? -1 : 0);
  return (start + direction + EXHIBITS.length) % EXHIBITS.length;
}

