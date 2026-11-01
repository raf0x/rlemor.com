import type { Metadata } from "next";
import MenagerieShell from "@/components/menagerie/MenagerieShell";

export const metadata:Metadata={
  title:"The Synthetic Menagerie | Architecture Study 00",
  description:"An immersive, explorable gallery for six future mechanical specimens. Architecture preview only.",
  robots:{index:false,follow:false,noarchive:true},
};

export default function MenagerieArchitecturePreview(){
  return <MenagerieShell/>;
}
