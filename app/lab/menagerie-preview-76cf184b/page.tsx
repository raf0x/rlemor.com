import type { Metadata } from "next";
import MenagerieShell from "@/components/menagerie/MenagerieShell";

export const metadata:Metadata={
  title:"The Synthetic Menagerie | White Horizontal Gallery V4",
  description:"Explore six living mechanical sculptures in one open, white horizontal 3D gallery.",
  robots:{index:false,follow:false,noarchive:true},
};

export default function MenagerieArchitecturePreview(){
  return <MenagerieShell/>;
}
