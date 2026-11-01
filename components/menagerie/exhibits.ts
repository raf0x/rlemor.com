/**
 * Synthetic Menagerie V4: all exhibits share ONE horizontal gallery rail.
 * Stable IDs and order are essential to preserve standalone exhibit routes.
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
  wing: "HORIZONTAL GALLERY";
  x: number;
  z: number;
  scale: number;
  accentHue: number;
};

export const EXHIBITS: readonly Exhibit[] = [
  {
    id:"octave-spectrum",number:"01",name:"Octave",
    subtitle:"Obsidian Spectrum",classification:"MECHANICAL CEPHALOPOD",
    short:"Black chrome, articulated motion, and a living rainbow of light.",
    wing:"HORIZONTAL GALLERY",x:-25,z:0,scale:1.10,accentHue:.54,
  },
  {
    id:"octave-chassis",number:"02",name:"Octave",
    subtitle:"Experimental Chassis",classification:"KINETIC SYSTEMS",
    short:"The exposed machine: extension, disassembly, and X-ray.",
    wing:"HORIZONTAL GALLERY",x:-15,z:0,scale:1.10,accentHue:.08,
  },
  {
    id:"aether",number:"03",name:"Aether",
    subtitle:"The Manta",classification:"AERIAL ORGANISM",
    short:"A study in weightlessness and articulated wings.",
    wing:"HORIZONTAL GALLERY",x:-5,z:0,scale:1.18,accentHue:.57,
  },
  {
    id:"medusa",number:"04",name:"Medusa",
    subtitle:"The Jellyfish",classification:"LUMINOUS ORGANISM",
    short:"A suspended form of light, translucency, and motion.",
    wing:"HORIZONTAL GALLERY",x:5,z:0,scale:1.12,accentHue:.84,
  },
  {
    id:"atlas",number:"05",name:"Atlas",
    subtitle:"The Scarab",classification:"ARMORED ORGANISM",
    short:"A mechanical exoskeleton built to unfold.",
    wing:"HORIZONTAL GALLERY",x:15,z:0,scale:1.13,accentHue:.08,
  },
  {
    id:"frog",number:"06",name:"Frog",
    subtitle:"The Amphibian",classification:"AMPHIBIOUS ORGANISM",
    short:"A nocturnal sculpture of agility and bioluminescence.",
    wing:"HORIZONTAL GALLERY",x:25,z:0,scale:1.06,accentHue:.38,
  },
] as const;

export function getExhibit(index:number):Exhibit|null {
  return Number.isInteger(index)&&index>=0&&index<EXHIBITS.length
    ?EXHIBITS[index]:null;
}

export function nextExhibit(current:number|null,direction:1|-1):number {
  const n=current??0;
  return Math.max(0,Math.min(EXHIBITS.length-1,n+direction));
}

