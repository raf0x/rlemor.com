import type { Metadata } from "next";
import OctaveSculpture from "@/components/octave-sculpture/OctaveSculpture";

export const metadata:Metadata={
  title:"Octave: Obsidian | The Synthetic Menagerie",
  description:"An interactive, original 3D character with a skeletal animation and cinematic gallery lighting.",
  robots:{index:false,follow:false,noarchive:true},
};

export default function SculpturePage(){
  return <OctaveSculpture/>;
}
