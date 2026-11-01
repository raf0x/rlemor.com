/**
 * OCTAVE / 08 V3
 * Reference-first procedural mechanism.
 *
 * Every part pose and every published readout is sampled from this module.
 * No Three.js, no mutable geometry, no randomness, no separate UI counters.
 * The tour is a pure function of time, suitable for exact-frame capture.
 */
export const ARM_COUNT = 8;
export const LINKS_PER_ARM = 18;
export const PANEL_COUNT = 12;
export const TOTAL_LINKS = ARM_COUNT * LINKS_PER_ARM;
export const TOUR_DURATION = 26;
export const TAU = Math.PI * 2;

export type Vec3 = readonly [number, number, number];
export type MachineMode = "operate" | "teardown" | "cutaway" | "isolate";
export type CameraPreset = "hero" | "three-quarter" | "profile";

export interface MechanismInput {
  time: number;
  energy: number;
  extension: number;
  teardown: number;
  cutaway: number;
  isolateArm: number | null;
  isolationWeight: number;
  manualArmOffsets?: readonly Vec3[];
  manualPanelOffsets?: readonly Vec3[];
  manualEyeOffset?: Vec3;
}
export interface ArmPose {
  arm: number;
  angle: number;
  socket: Vec3;
  joints: Vec3[];
  colorHue: number;
  detachedBy: number;
}
export interface PanelPose {
  panel: number;
  normal: Vec3;
  offset: Vec3;
}
export interface Readout {
  links: number;
  arms: number;
  panels: number;
  separation: number;
  energy: number;
  extension: number;
  cutaway: number;
  activeSubsystems: number;
  phase: string;
}
export interface MachineFrame {
  time: number;
  energy: number;
  extension: number;
  teardown: number;
  cutaway: number;
  isolateArm: number | null;
  isolationWeight: number;
  arms: ArmPose[];
  panels: PanelPose[];
  opticalPosition: Vec3;
  crownHeight: number;
  readout: Readout;
}
export interface TourCue {
  at: number;
  label: string;
  description: string;
}
export const TOUR_CUES: readonly TourCue[] = [
  { at: 0, label: "00 / ONLINE", description: "Eight synchronized manipulators enter a low-energy idle" },
  { at: 2.5, label: "01 / ENERGIZE", description: "The central optical assembly activates and the arms extend" },
  { at: 6.5, label: "02 / RETRACT", description: "Arm chains return to the docking envelope" },
  { at: 9, label: "03 / TEARDOWN", description: "Eight complete arm units separate from the chassis" },
  { at: 13, label: "04 / CUTAWAY", description: "Twelve ceramic petals expose the inner mechanical frame" },
  { at: 17.5, label: "05 / INSPECT", description: "One arm is isolated; dimensions stay coupled to geometry" },
  { at: 20.5, label: "06 / REASSEMBLE", description: "Every subassembly returns along its original docking axis" },
  { at: 24, label: "07 / RESUME", description: "The system closes and resumes a continuous spectral idle" },
] as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
export const smooth = (v: number) => { const x=clamp01(v); return x*x*(3-2*x); };
export const mix = (a: number, b: number, k: number) => a+(b-a)*clamp01(k);
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
export const mul = (v: Vec3, s: number): Vec3 => [v[0]*s,v[1]*s,v[2]*s];
export const norm = (v: Vec3): Vec3 => {
  const length=Math.hypot(v[0],v[1],v[2])||1;
  return [v[0]/length,v[1]/length,v[2]/length];
};
export const length = (v: Vec3): number => Math.hypot(v[0],v[1],v[2]);
export const sub = (a: Vec3,b: Vec3): Vec3 => [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const distance = (a: Vec3,b: Vec3): number => length(sub(a,b));

export function cueAt(time: number): TourCue {
  const t=((time%TOUR_DURATION)+TOUR_DURATION)%TOUR_DURATION;
  for(let i=TOUR_CUES.length-1;i>=0;i--)if(t>=TOUR_CUES[i].at)return TOUR_CUES[i];
  return TOUR_CUES[0];
}

/** Pure film/capture timeline. Arbitrary times render identically each pass. */
export function tourAt(time: number): MechanismInput {
  const t=((time%TOUR_DURATION)+TOUR_DURATION)%TOUR_DURATION;
  const ramp=(begin:number,end:number)=>smooth((t-begin)/(end-begin));
  const energy=t<24?mix(.34,1,ramp(1.1,3.6)):
    mix(1,.34,ramp(24,TOUR_DURATION));
  const extension= t<2.5 ? .12 :
    t<6.3 ? mix(.12,.9,ramp(2.5,6.3)) :
    t<9 ? mix(.9,.15,ramp(6.3,9)) :
    t<20.5 ? .15 :
    t<24.5 ? mix(.15,.42,ramp(20.5,24.5)) :
    mix(.42,.12,ramp(24.5,TOUR_DURATION));
  const teardown=t<9.4?0:t<12.5?ramp(9.4,12.5):
    t<19?1:t<22.1?1-ramp(19,22.1):0;
  const cutaway=t<12.3?0:t<14.2?ramp(12.3,14.2):
    t<18.0?1:t<20.1?1-ramp(18,20.1):0;
  const isolationWeight=t<17.5?0:t<18.3?ramp(17.5,18.3):
    t<19.4?1:t<20.2?1-ramp(19.4,20.2):0;
  return {
    time:t,energy,extension,teardown,cutaway,
    isolateArm:t>=17.5&&t<20.2?2:null,
    isolationWeight,
  };
}

export function modeInput(
  mode: MachineMode, time: number, focusArm: number = 2,
): MechanismInput {
  if(mode==="teardown")return {
    time,energy:1,extension:.16,teardown:1,cutaway:.1,isolateArm:null,isolationWeight:0,
  };
  if(mode==="cutaway")return {
    time,energy:1,extension:.22,teardown:.52,cutaway:1,isolateArm:null,isolationWeight:0,
  };
  if(mode==="isolate")return {
    time,energy:1,extension:.25,teardown:.60,cutaway:.34,isolateArm:focusArm,isolationWeight:1,
  };
  return {
    time,energy:1,extension:.52,teardown:0,cutaway:0,isolateArm:null,isolationWeight:0,
  };
}

function armJoint(
  arm: number, t: number, input: MechanismInput, tear: number, extension: number,
): Vec3 {
  const angle=TAU*(arm/ARM_COUNT)+Math.PI/8;
  const handed=arm%2===0?1:-1;
  // This continuous curvature model replaces the old right-angled hook.
  // Until t=.58 the arm grows nearly radially; its distal 42% sweeps
  // around a genuine rounded 3D coil and turns back toward its chassis.
  // The first derivative of radius matches at the transition point,
  // preventing an artificial elbow in the silhouette.
  const curlStart=.58;
  const curled=clamp01((t-curlStart)/(1-curlStart));
  const theta=3.12*smooth(curled);
  const growth=3.35+extension*.55;
  const radius=t<=curlStart
    ? .96+growth*t
    : .96+growth*curlStart
      +growth*(1-curlStart)*curled
      -(growth*(1-curlStart)+.14)*curled*curled
      +.45*Math.sin(theta);
  const quietSwing=Math.sin(input.time*(4*TAU/TOUR_DURATION)+arm*.71+t*5.1)*.052*t*clamp01(input.energy);
  const tangent=handed*.70*(1-Math.cos(theta))+quietSwing;
  const depth=Math.sin(angle*2.2)*.34*t
    +handed*(.12*Math.sin(theta)+.15*curled)
    +quietSwing*.8;
  const separation=.76*tear*(1+(input.isolateArm===arm?.32*input.isolationWeight:0));
  const manual=input.manualArmOffsets?.[arm]??([0,0,0] as Vec3);
  const weight=smooth((t-.08)/.72);
  return [
    Math.cos(angle)*(radius+separation)-Math.sin(angle)*tangent+manual[0]*weight,
    Math.sin(angle)*(radius+separation)+Math.cos(angle)*tangent+manual[1]*weight,
    depth + (arm%2===0?.055:-.055)*tear + manual[2]*weight,
  ];
}

function panelNormal(panel: number): Vec3 {
  const phi=(panel/PANEL_COUNT)*TAU+.035+
    (TAU/PANEL_COUNT-.07)/2;
  return norm([-Math.cos(phi),0,Math.sin(phi)]);
}

export function poseAt(input: MechanismInput): MachineFrame {
  const energy=clamp01(input.energy);
  const extension=clamp01(input.extension);
  const tear=smooth(input.teardown);
  const cutaway=smooth(input.cutaway);
  const isolationWeight=clamp01(input.isolationWeight);
  const arms:ArmPose[]=[];
  for(let i=0;i<ARM_COUNT;i++){
    const angle=TAU*(i/ARM_COUNT)+Math.PI/8;
    const joints:Vec3[]=[];
    for(let j=0;j<=LINKS_PER_ARM;j++)joints.push(armJoint(i,j/LINKS_PER_ARM,input,tear,extension));
    arms.push({
      arm:i,angle,joints,socket:joints[0],
      colorHue:((input.time*.24+i/ARM_COUNT+2)%1+1)%1,
      detachedBy:tear*.76*(input.isolateArm===i?1.32:1),
    });
  }
  const panels:PanelPose[]=[];
  for(let i=0;i<PANEL_COUNT;i++){
    const normal=panelNormal(i);
    const manual=input.manualPanelOffsets?.[i]??([0,0,0] as Vec3);
    panels.push({
      panel:i,normal,
      offset:add(mul(normal,tear*.51),manual),
    });
  }
  const eyeOffset=input.manualEyeOffset??([0,0,0] as Vec3);
  const eye:Vec3=[eyeOffset[0],eyeOffset[1],.96+tear*.48+eyeOffset[2]];
  const activeSubsystems=tear<.02?0:
    (tear>.95?ARM_COUNT+PANEL_COUNT+1:Math.round((ARM_COUNT+PANEL_COUNT+1)*tear));
  const phase=cueAt(input.time).label;
  return {
    time:input.time,energy,extension,teardown:tear,cutaway,isolateArm:input.isolateArm,isolationWeight,
    arms,panels,opticalPosition:eye,crownHeight:.87+tear*.22,
    readout:{
      links:TOTAL_LINKS,arms:ARM_COUNT,panels:PANEL_COUNT,
      separation:tear*.76,energy,extension,cutaway,activeSubsystems,phase,
    },
  };
}
