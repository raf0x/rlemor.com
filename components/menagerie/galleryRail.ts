/**
 * A pure, critically-damped horizontal camera rail. No Three.js or browser
 * dependencies. Dragging and trackpad movement never rotate the camera.
 *
 * The camera's X position is the only variable. Camera height, depth,
 * focal length, and angle remain fixed throughout the exhibition.
 */
export type RailState = {
  x:number;
  targetX:number;
  selectedIndex:number;
  moving:boolean;
};
export type GalleryRail = {
  moveTo:(index:number,immediate?:boolean)=>number;
  panBy:(worldDistance:number)=>number;
  settle:(immediate?:boolean)=>number;
  update:(dtSeconds:number)=>number;
  state:()=>RailState;
  closest:()=>number;
  atEdge:(direction:-1|1)=>boolean;
};

export function createGalleryRail(positions:readonly number[],initial=0):GalleryRail{
  if(!positions.length||positions.some((p,i)=>!Number.isFinite(p)||(i>0&&p<=positions[i-1]))){
    throw new Error("Camera rail requires a nonempty increasing array of finite positions.");
  }
  const first=positions[0],last=positions[positions.length-1];
  const clamp=(x:number)=>Math.max(first,Math.min(last,x));
  const indexClamp=(i:number)=>Math.max(0,Math.min(positions.length-1,Math.round(i)));
  let selectedIndex=indexClamp(initial);
  let x=positions[selectedIndex];
  let targetX=x,velocity=0;
  let moving=false;

  const closest=()=>{
    let winner=0,distance=Infinity;
    for(let i=0;i<positions.length;i++){
      const diff=Math.abs(positions[i]-x);
      if(diff<distance){winner=i;distance=diff;}
    }
    return winner;
  };
  function moveTo(i:number,immediate=false){
    selectedIndex=indexClamp(i);
    targetX=positions[selectedIndex];
    if(immediate){x=targetX;velocity=0;moving=false;}
    else moving=Math.abs(targetX-x)>.003;
    return selectedIndex;
  }
  function panBy(delta:number){
    if(!Number.isFinite(delta))return x;
    x=clamp(x+delta);
    targetX=x;velocity=0;moving=false;
    return x;
  }
  function settle(immediate=false){
    return moveTo(closest(),immediate);
  }
  function update(dtSeconds:number){
    if(!moving)return x;
    const dt=Math.min(1,Math.max(0,dtSeconds));
    // Exact solution for a critically damped spring, keeping camera motion
    // continuous if a visitor selects a new exhibit before arrival.
    const omega=6.2;
    const change=x-targetX;
    const temporary=(velocity+omega*change)*dt;
    const attenuation=Math.exp(-omega*dt);
    x=clamp(targetX+(change+temporary)*attenuation);
    velocity=(velocity-omega*temporary)*attenuation;
    if(Math.abs(x-targetX)<.01&&Math.abs(velocity)<.04){
      x=targetX;velocity=0;moving=false;
    }
    return x;
  }
  return{
    moveTo,panBy,settle,update,closest,
    state:()=>({x,targetX,selectedIndex,moving}),
    atEdge:(direction)=>direction===-1?x<=first+.06:x>=last-.06,
  };
}

