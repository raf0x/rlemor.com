"""
OCTAVE / 01 : Obsidian specimen
Procedurally authored sculptural Blender model with an actual skeletal rig.

Visual brief: obsidian/chrome mantle, luminous cyan optics, eight tapered and
coiled armatures with metallic cups, electroluminescent rim accents. All meshes
are original. Exports a reusable GLB with a looping idle AnimationClip.
Blender 5.0+, no third-party add-ons.
"""
import bpy
import math
from math import sin, cos, pi
from mathutils import Vector
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSET_DIR = ROOT / "public" / "lab" / "octave-sculpture"
ASSET_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT = str(ASSET_DIR / "octave-obsidian.glb")
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for material in list(bpy.data.materials):
    bpy.data.materials.remove(material)

def material(name, base, metal=0.0, rough=.3, emissive=None, strength=0):
    m=bpy.data.materials.new(name)
    m.use_nodes=True
    bs=m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value=(*base,1.0)
    bs.inputs["Metallic"].default_value=metal
    bs.inputs["Roughness"].default_value=rough
    if emissive:
        bs.inputs["Emission Color"].default_value=(*emissive,1)
        bs.inputs["Emission Strength"].default_value=strength
    if "Coat Weight" in bs.inputs:
        bs.inputs["Coat Weight"].default_value=.75 if metal>.5 else .34
        bs.inputs["Coat Roughness"].default_value=.09
    return m

OBSIDIAN=material("01 | Obsidian glass ceramic",(.0028,.0055,.0088),.58,.155)
INK=material("02 | Deep graphite",(.012,.022,.029),.63,.23)
GOLD=material("03 | Warm champagne titanium",(.28,.135,.045),.8,.23)
TITANIUM=material("04 | Silver polished rim",(.23,.37,.43),.87,.21)
CYAN=material("05 | Electric cyan optics",(.014,.27,.42),.19,.13,(.02,.43,.86),3.6)
SOFT_CYAN=material("06 | Photo-electric inlay",(.013,.13,.21),.30,.19,(.015,.28,.52),2.1)
LENS=material("07 | Optical black",(.009,.025,.038),.7,.11)
JOINT=material("08 | Brushed joints",(.10,.15,.19),.89,.26)
PUPIL=material("09 | Inner pupil",(.012,.027,.040),.43,.10)
LIGHTGOLD=material("10 | Bronze filament",(.48,.29,.12),.48,.27,(.23,.09,.022),.65)

def smooth_object(o):
    if o.type=="MESH":
        for p in o.data.polygons:
            p.use_smooth=True
    return o

def uv(name, location, scale, mat, segments=48, rings=28, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=location)
    o=bpy.context.object; o.name=name
    o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat); smooth_object(o)
    if parent:o.parent=parent
    return o

def torus(name, loc, radius, minor, mat, parent=None):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=radius,minor_radius=minor,
        major_segments=48,minor_segments=10,
        location=loc,rotation=(pi/2,0,0))
    o=bpy.context.object;o.name=name
    o.data.materials.append(mat);smooth_object(o)
    if parent:o.parent=parent
    return o

def cylinder(name,loc,r,depth,mat,vertices=48,parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,
        location=loc,rotation=(pi/2,0,0))
    o=bpy.context.object;o.name=name
    o.data.materials.append(mat);smooth_object(o)
    if parent:o.parent=parent
    bevel=o.modifiers.new("Micro-beveled manufactured edge","BEVEL")
    bevel.width=min(depth*.16,.021)
    bevel.segments=2
    o.modifiers.new("Weighted normals","WEIGHTED_NORMAL")
    return o

def line_curve(name, points, thickness, mat):
    cu=bpy.data.curves.new(name,"CURVE");cu.dimensions="3D"
    cu.resolution_u=20;cu.bevel_resolution=3;cu.bevel_depth=thickness
    spline=cu.splines.new("POLY")
    spline.points.add(len(points)-1)
    for p,v in zip(spline.points,points):
        p.co=(*v,1)
    ob=bpy.data.objects.new(name,cu)
    bpy.context.collection.objects.link(ob)
    ob.data.materials.append(mat)
    return ob

# Mantle profile gives a vertical black-chrome bell, not a sphere / toy head.
profile=[
    (1.72,.30),(1.89,.52),(2.10,.65),(2.38,.76),
    (2.78,.91),(3.18,.94),(3.68,.90),(4.08,.76),
    (4.43,.57),(4.66,.31),(4.77,.012),
]
def smooth_profile(z):
    if z<=profile[0][0]:return profile[0][1]
    if z>=profile[-1][0]:return profile[-1][1]
    for i in range(len(profile)-1):
        z0,r0=profile[i]; z1,r1=profile[i+1]
        if z0<=z<=z1:
            s=(z-z0)/(z1-z0)
            left=profile[max(0,i-1)][1]
            right=profile[min(len(profile)-1,i+2)][1]
            m0=.5*(r1-left);m1=.5*(right-r0)
            return (2*s**3-3*s*s+1)*r0+(s**3-2*s*s+s)*m0+(-2*s**3+3*s*s)*r1+(s**3-s*s)*m1
    return .3

rings=74; sides=72
vs=[];fs=[]
for j in range(rings+1):
    z=1.72+(4.77-1.72)*j/rings
    r=smooth_profile(z)
    for k in range(sides):
        a=2*pi*k/sides
        # y thickness slightly narrower to create tall classic mantle proportions.
        vs.append((r*cos(a),r*.91*sin(a),z))
for j in range(rings):
    for k in range(sides):
        a=j*sides+k;b=j*sides+(k+1)%sides
        fs.append((a,b,b+sides,a+sides))
fs.append(tuple(reversed(tuple(range(sides)))))
fs.append(tuple(rings*sides+k for k in range(sides)))
mesh=bpy.data.meshes.new("Seamless UV mantle")
mesh.from_pydata(vs,[],fs);mesh.update()
mantle=bpy.data.objects.new("OCTAVE | Obsidian mantle",mesh)
bpy.context.collection.objects.link(mantle)
mesh.materials.append(OBSIDIAN);smooth_object(mantle)

# Thin vertical titanium/gold curvature ribs and the inset crown crest.
for a in [-2.84,-2.46,-2.12,-1.85,-1.55,-1.26,-.95,-.66,-.35]:
    points=[]
    for j in range(40):
        z=2.36+j/39*2.23
        r=smooth_profile(z)
        points.append((r*cos(a)*1.012,r*.91*sin(a)*1.02,z))
    # Subtle metal pinstriping visible in highlights, not neon outlines.
    line_curve("Mantle micro-inlay",points,.0065,GOLD if abs(a+1.55)>.60 else TITANIUM)
# Top crown ring and tiny central optical status bars.
# No hovering halo: the mantle is a seamless manufactured capsule.
line_curve("Crown telemetry",[(0,-.28,4.50),(0,-.34,4.28)],.018,CYAN)
line_curve("Crown telemetry II",[(.11,-.34,4.46),(.11,-.40,4.20)],.010,SOFT_CYAN)

# Machined neck socket and trim ring below the mantle.
uv("Neck undercarriage",(0,0,1.95),(.57,.53,.48),INK)
torus("Lower mantle collar",(0,-.04,2.04),.61,.04,GOLD)
for n in range(8):
    a=2*pi*n/8
    # Mechanical collars at arm mount positions.
    uv("Joint | titanium collar",(.56*cos(a),.52*sin(a),1.79),(.185,.185,.18),JOINT,24,16)

# Eyes face negative Y, corresponding to the forward direction in the GLB.
for i,x in enumerate([-.56,.56],1):
    z=2.66
    cylinder(f"EYE {i:02d} | recessed housing",(x,-.78,z),.422,.18,INK)
    torus(f"EYE {i:02d} | champagne rim",(x,-.92,z),.418,.038,GOLD)
    cylinder(f"EYE {i:02d} | jet-black lens",(x,-.96,z),.343,.075,LENS)
    torus(f"EYE {i:02d} | silver waveguide",(x,-1.020,z),.303,.018,TITANIUM)
    cylinder(f"EYE {i:02d} | electric iris",(x,-1.041,z),.273,.05,CYAN)
    torus(f"EYE {i:02d} | radiant iris rim",(x,-1.082,z),.232,.027,SOFT_CYAN)
    cylinder(f"EYE {i:02d} | pupil",(x,-1.091,z),.151,.038,PUPIL)
    uv(f"EYE {i:02d} | glass caustic",(x-.062,-1.132,z+.085),(.083,.025,.065),CYAN,20,12)
    torus(f"EYE {i:02d} | machined aperture",(x,-1.12,z),.149,.018,TITANIUM)

# Small front-mounted sensor and low-body illuminated assembly.
uv("Center sensor",(0,-.68,1.95),(.125,.07,.14),SOFT_CYAN,28,18)
for dx in [-.32,-.16,0,.16,.32]:
    line_curve("Ventral gold cooling channel",[(dx,-.54,1.84),(dx*.9,-.60,1.54)],.013,GOLD)

# Eight individual, sculpted tentacle silhouettes. Even arms are mirrored
# poses, but each has its own depth, rig, and asynchronously offset motion.
LEFT=[
 [(-.46,-.15,1.88),(-.93,-.45,1.48),(-1.61,-.70,.92),(-2.42,-.70,.61),(-2.85,-.54,1.02),(-2.85,-.36,1.86),(-2.55,-.30,2.43),(-2.02,-.27,2.52),(-1.80,-.29,2.13),(-2.06,-.30,1.76)],
 [(-.29,-.73,1.85),(-.62,-.88,1.29),(-1.01,-1.02,.67),(-1.67,-1.03,.43),(-2.24,-.91,.55),(-2.47,-.80,.94),(-2.20,-.75,1.21),(-1.75,-.76,1.08),(-1.60,-.78,.75)],
 [(-.58,.19,1.96),(-1.10,.21,1.53),(-1.69,.28,1.32),(-2.26,.29,1.59),(-2.43,.29,2.26),(-2.10,.20,2.84),(-1.58,.13,2.75),(-1.34,.12,2.27)],
 [(-.34,.60,1.86),(-.95,.75,1.34),(-1.26,.82,.72),(-1.06,.96,.26),(-.61,1.02,.29),(-.40,1.05,.58),(-.54,1.04,.86)]
]
PATHS=[]
for i in range(4):
    PATHS.append(LEFT[i])
for i in range(4):
    # tiny depth offset breaks perfect mirror symmetry.
    PATHS.append([(-x,y+.02*(i+1),z) for x,y,z in LEFT[i]])

def catmull(points,t):
    u=max(0,min(.9999999,t))*(len(points)-1)
    i=int(u);q=u-i
    p0=Vector(points[max(i-1,0)]);p1=Vector(points[i])
    p2=Vector(points[min(i+1,len(points)-1)])
    p3=Vector(points[min(i+2,len(points)-1)])
    return .5*((2*p1)+(-p0+p2)*q+(2*p0-5*p1+4*p2-p3)*q*q+(-p0+3*p1-3*p2+p3)*q*q*q)

ARM_STEPS=90
BONE_COUNT=7
materials=[OBSIDIAN,GOLD,SOFT_CYAN,TITANIUM,INK,CYAN]
armature=bpy.data.armatures.new("OCTAVE | Eight articulated skeletal chains")
rig=bpy.data.objects.new("OCTAVE | Armature / animated",armature)
bpy.context.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig
rig.select_set(True)
bpy.ops.object.mode_set(mode="EDIT")
for arm,path in enumerate(PATHS):
    previous=None
    for bone_no in range(BONE_COUNT):
        t0=bone_no/BONE_COUNT;t1=(bone_no+1)/BONE_COUNT
        b=armature.edit_bones.new(f"Arm_{arm+1:02d}_J{bone_no+1:02d}")
        b.head=catmull(path,t0)
        b.tail=catmull(path,t1)
        if previous:
            b.parent=previous
            b.use_connect=True
        previous=b
bpy.ops.object.mode_set(mode="OBJECT")
rig.select_set(False)

def append_torus(vertices,faces,face_mats,lookup,center,n,tangent,major,minor,matid,curve_t):
    # A little recessed suction cup, oriented along the local tube surface.
    n=n.normalized();tangent=tangent.normalized()
    e1=tangent.cross(n).normalized()
    e2=n.cross(e1).normalized()
    steps=14;minor_steps=6
    offset=len(vertices)
    for i in range(steps):
        a=2*pi*i/steps
        radial=e1*cos(a)+e2*sin(a)
        for j in range(minor_steps):
            b=2*pi*j/minor_steps
            v=center+radial*(major+minor*cos(b))+n*minor*sin(b)
            vertices.append(tuple(v));lookup.append(curve_t)
    for i in range(steps):
        ni=(i+1)%steps
        for j in range(minor_steps):
            nj=(j+1)%minor_steps
            faces.append((offset+i*minor_steps+j,
                 offset+ni*minor_steps+j,offset+ni*minor_steps+nj,
                 offset+i*minor_steps+nj))
            face_mats.append(matid)

# The arm and suction cups are ONE skinned mesh per tentacle,
# so cups follow its skeletal animation instead of floating behind.
for arm,path in enumerate(PATHS):
    pts=[catmull(path,i/ARM_STEPS) for i in range(ARM_STEPS+1)]
    verts=[];faces=[];material_indices=[];vertex_t=[]
    RINGS=14
    for j,c in enumerate(pts):
        t=j/ARM_STEPS
        tangent=(pts[min(j+1,ARM_STEPS)]-pts[max(j-1,0)]).normalized()
        forward=Vector((0,-1,0))
        n=(forward-tangent*forward.dot(tangent)).normalized()
        if n.length<.01:n=Vector((0,0,1))
        b=tangent.cross(n).normalized()
        radius=(.218*(1-t)**.79+.039)
        # tapered, gently oblong black-chrome tube, with gold exterior band
        for k in range(RINGS):
            angle=2*pi*k/RINGS
            p=c+n*cos(angle)*radius*.94 + b*sin(angle)*radius*1.05
            verts.append(tuple(p));vertex_t.append(t)
        if j<ARM_STEPS:
            for k in range(RINGS):
                nx=(k+1)%RINGS
                faces.append((j*RINGS+k,j*RINGS+nx,(j+1)*RINGS+nx,(j+1)*RINGS+k))
                # Gold strips on the lateral upper ridge, like conductive seams.
                material_indices.append(1 if k in [3,10] else 0)
    for j in range(10,ARM_STEPS-2,3):
        t=j/ARM_STEPS
        c=pts[j];tangent=(pts[j+1]-pts[j-1]).normalized()
        forward=Vector((0,-1,0))
        n=(forward-tangent*forward.dot(tangent)).normalized()
        if n.length<.01:n=Vector((0,0,1))
        b=tangent.cross(n).normalized()
        radius=(.218*(1-t)**.79+.039)
        for row in [-1,1]:
            spot=c+n*(radius*.97)+b*(row*radius*.35)
            cupR=max(.030,min(.062,radius*.34))
            append_torus(verts,faces,material_indices,vertex_t,
                spot,n,tangent,cupR,.010,1,t)
            # Each cup has a luminous inner aperture, rather than a flat dot.
            append_torus(verts,faces,material_indices,vertex_t,
                spot+n*.004,n,tangent,cupR*.59,.008,2,t)

    mesh=bpy.data.meshes.new(f"Arm {arm+1:02d} | sculpted tubular surface and cups")
    mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(f"Arm {arm+1:02d} | articulated specimen",mesh)
    bpy.context.collection.objects.link(obj)
    for m in materials:obj.data.materials.append(m)
    for face,midx in zip(obj.data.polygons,material_indices):
        face.material_index=midx
        face.use_smooth=True
    groups=[]
    for i in range(BONE_COUNT):
        groups.append(obj.vertex_groups.new(name=f"Arm_{arm+1:02d}_J{i+1:02d}"))
    for vi,t in enumerate(vertex_t):
        u=t*(BONE_COUNT-1)
        low=int(u);alpha=u-low
        groups[min(low,BONE_COUNT-1)].add([vi],max(.001,1-alpha),"REPLACE")
        if low<BONE_COUNT-1 and alpha>.001:
            groups[low+1].add([vi],alpha,"REPLACE")
    mod=obj.modifiers.new("Skeletal deformation / idling", "ARMATURE")
    mod.object=rig
    obj.parent=rig

# Animated idling cycles. A pose grows organically from base to tip.
bpy.context.scene.frame_start=1
bpy.context.scene.frame_end=121
bpy.context.scene.render.fps=30
for arm in range(8):
    for j in range(BONE_COUNT):
        bone=rig.pose.bones[f"Arm_{arm+1:02d}_J{j+1:02d}"]
        bone.rotation_mode="XYZ"
        amp=.018+(.055*j/BONE_COUNT)
        phase=arm*.78+j*.29
        for frame in [1,16,31,46,61,76,91,106,121]:
            t=(frame-1)/120 *2*pi
            # Closed loop: frame 1 and 121 are identical.
            bone.rotation_euler[0]=amp*sin(t+phase)
            bone.rotation_euler[1]=amp*.78*cos(t+phase*1.19)
            bone.rotation_euler[2]=amp*.7*sin(t+phase*.71)
            bone.keyframe_insert(data_path="rotation_euler",frame=frame,group=f"Arm {arm+1:02d}")

if rig.animation_data and rig.animation_data.action:
    rig.animation_data.action.name="OCTAVE | Living idle · 4 seconds"

# Make any source blend repeatable and inspectable for later manual sculpting.
bpy.ops.wm.save_as_mainfile(filepath=str(ASSET_DIR / "octave-source.blend"))
# Exclude source from deployed site later; it will be delivered as dev artifact
# if large. GLB is platform independent and exported with skeletal animation.
bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    export_animations=True,
    export_skins=True,
    export_yup=True,
    export_apply=True,
    export_materials="EXPORT",
)
print("EXPORTED",OUTPUT)
print("OBJECTS",len(bpy.data.objects))
print("POLYGONS",sum(len(o.data.polygons) for o in bpy.data.objects if o.type=="MESH"))
print("BONES",len(armature.bones))

