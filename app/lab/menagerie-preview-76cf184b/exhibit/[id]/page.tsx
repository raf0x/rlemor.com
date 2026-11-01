import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {EXHIBITS} from "@/components/menagerie/exhibits";
import CreatureViewer from "@/components/menagerie/CreatureViewer";
import OctaveSculpture from "@/components/octave-sculpture/OctaveSculpture";
import KineticOctopus from "@/components/KineticOctopus";

const HOME="/lab/menagerie-preview-76cf184b";
export const metadata:Metadata={
 title:"Synthetic Menagerie | Living exhibits",
 robots:{index:false,follow:false,noarchive:true},
};
export function generateStaticParams(){
 return EXHIBITS.map(e=>({id:e.id}));
}
export default async function ExhibitPage({
 params,
}:{
 params:Promise<{id:string}>;
}){
 const {id}=await params;
 const exhibit=EXHIBITS.find(e=>e.id===id);
 if(!exhibit)notFound();
 if(id==="octave-chassis"){
   // Important: reuse the original production lab without changing its
   // independently tested extension, teardown, docking, X-ray or canvas.
   return (
     <div style={{background:"#080e15",color:"#e9f1f4"}}>
       <nav style={{padding:"14px 22px",borderBottom:"1px solid #344b58",
         fontFamily:"ui-monospace,Consolas,monospace",fontSize:"12px"}}>
         <Link href={HOME} style={{color:"#9adeee"}}>
           ← RETURN TO THE SYNTHETIC MENAGERIE
         </Link>
         <span style={{float:"right",color:"#899ba8"}}>EXHIBIT 02 / EXPERIMENTAL CHASSIS</span>
       </nav>
       <KineticOctopus/>
     </div>
   );
 }
 if(id==="octave-spectrum"){
  return (
   <div style={{background:"#080e15",color:"#e9f1f4"}}>
     <nav style={{padding:"14px 22px",borderBottom:"1px solid #344b58",
       fontFamily:"ui-monospace,Consolas,monospace",fontSize:"12px"}}>
       <Link href={HOME} style={{color:"#9adeee"}}>
         ← RETURN TO THE SYNTHETIC MENAGERIE
       </Link>
     </nav>
     <OctaveSculpture/>
   </div>
  );
 }
 return <CreatureViewer exhibit={exhibit}/>;
}

