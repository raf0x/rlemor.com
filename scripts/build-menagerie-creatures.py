"""
The Synthetic Menagerie, original animated creature studies.
Blender 5.0. Produces four separate glTF 2.0 assets with skinned-object
animations / rigid pivots and PBR metallic materials, not flat images.
These are art-directed *procedural originals* and not photo-real scans.
"""
import bpy, math, sys
from math import pi, sin, cos
from mathutils import Vector
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
DEST=ROOT/"public"/"lab"/"menagerie"
DEST.mkdir(parents=True,exist_ok=True)
TAU=2*pi

def reset():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for m in list(bpy.data.materials):bpy.data.materials.remove(m)
    bpy.context.scene.frame_start=1
    bpy.context.scene.frame_end=121
    bpy.context.scene.render.fps=30

def mat(name,rgb,metal=.6,rough=.23,emission=None,power=0,alpha=1):
    m=bpy.data.materials.new(name);m.use_nodes=True
    bs=m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value=(*rgb,1)
    bs.inputs["Metallic"].default_value=metal
    bs.inputs["Roughness"].default_value=rough
    if emission:
        bs.inputs["Emission Color"].default_value=(*emission,1)
        bs.inputs["Emission Strength"].default_value=power
    if "Coat Weight" in bs.inputs:
        bs.inputs["Coat Weight"].default_value=.72
        bs.inputs["Coat Roughness"].default_value=.09
    if alpha<1:
        bs.inputs["Alpha"].default_value=alpha
        m.surface_render_method="DITHERED"
    return m

def palette(kind):
    special=(.14,.59,.88) if kind!="frog" else (.20,.95,.48)
    accent=(.65,.27,.09) if kind!="medusa" else (.48,.13,.67)
    return dict(
        obsidian=mat("CARBON | Obsidian ceramic",(.013,.024,.032),.82,.155),
        obsidian2=mat("TITANIUM | Graphite armor",(.047,.08,.10),.88,.21),
        silver=mat("SILVER | Machined chrome",(.33,.51,.60),.90,.20),
        bronze=mat("GOLD | Champagne bronze",(.54,.31,.105),.82,.22),
        dark=mat("MECHANISM | Recessed graphite",(.018,.032,.049),.69,.32),
        glow=mat("ENERGY | Electric blue",(.04,.23,.40),.06,.14,special,4.7),
        pale=mat("LIGHT | Silver cyan",(.24,.77,.90),.14,.17,(.18,.61,.90),1.5),
        warm=mat("ENERGY | Amber microcell",(.41,.16,.065),.12,.20,accent,2.7),
        glass=mat("GLASS | Deep smoke",(.06,.19,.24),.15,.10,(.03,.10,.19),.35,.70),
        violet=mat("LUMINOUS | Violet",(.32,.08,.51),.08,.15,(.54,.11,.87),3.5),
        green=mat("LUMINOUS | Jade",(.02,.22,.17),.08,.14,(.03,.66,.40),3.5),
    )

def smooth(obj):
    if obj.type=="MESH":
        for f in obj.data.polygons:f.use_smooth=True
    return obj

def group(name,at=(0,0,0),parent=None):
    e=bpy.data.objects.new(name,None)
    bpy.context.collection.objects.link(e)
    if parent:e.parent=parent
    e.location=at
    return e

def ellipsoid(name,loc,scale,material,parent=None,segments=32,rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=(0,0,0))
    o=bpy.context.object;o.name=name
    if parent:o.parent=parent
    o.location=loc;o.scale=scale
    o.data.materials.append(material)
    return smooth(o)

def cyl(name,loc,radius,depth,material,parent=None,axis="Z",sides=24):
    bpy.ops.mesh.primitive_cylinder_add(vertices=sides,radius=radius,depth=depth)
    o=bpy.context.object;o.name=name
    if parent:o.parent=parent
    o.location=loc
    if axis=="Y":o.rotation_euler[0]=pi/2
    elif axis=="X":o.rotation_euler[1]=pi/2
    o.data.materials.append(material)
    b=o.modifiers.new("Edge machining","BEVEL")
    b.width=min(.038,depth*.14);b.segments=2
    o.modifiers.new("Normals","WEIGHTED_NORMAL")
    return smooth(o)

def tor(name,at,radius,tube,material,parent=None,axis="Z",segments=56):
    bpy.ops.mesh.primitive_torus_add(major_radius=radius,minor_radius=tube,
        major_segments=segments,minor_segments=8)
    o=bpy.context.object;o.name=name
    if parent:o.parent=parent
    o.location=at
    if axis=="Y":o.rotation_euler[0]=pi/2
    elif axis=="X":o.rotation_euler[1]=pi/2
    o.data.materials.append(material)
    return smooth(o)

def line(name,pts,thick,material,parent=None):
    curve=bpy.data.curves.new(name,"CURVE")
    curve.dimensions="3D";curve.resolution_u=16
    curve.bevel_depth=thick;curve.bevel_resolution=2
    sp=curve.splines.new("POLY")
    sp.points.add(len(pts)-1)
    for p,co in zip(sp.points,pts):p.co=(*co,1)
    o=bpy.data.objects.new(name,curve)
    bpy.context.collection.objects.link(o)
    if parent:o.parent=parent
    o.data.materials.append(material)
    return o

def rod(name,a,b,r,material,parent=None):
    mid=(Vector(a)+Vector(b))*.5
    tangent=Vector(b)-Vector(a)
    obj=cyl(name,tuple(mid),r,tangent.length,material,parent)
    obj.rotation_euler=tangent.to_track_quat('Z','Y').to_euler()
    return obj

def animate(obj,axis,amplitude,offset=0,period=1,base=0):
    obj.rotation_mode="XYZ"
    for frame in [1,16,31,46,61,76,91,106,121]:
        phase=(frame-1)/120*TAU*period
        obj.rotation_euler[axis]=base+amplitude*sin(phase+offset)
        obj.keyframe_insert(data_path="rotation_euler",frame=frame,group=obj.name)

def bob(obj,amp=.06,offset=0):
    initial=obj.location.z
    for frame in [1,16,31,46,61,76,91,106,121]:
        t=(frame-1)/120*TAU
        obj.location.z=initial+amp*sin(t+offset)
        obj.keyframe_insert(data_path="location",frame=frame,group=obj.name)

def pulse(obj,amp=.08,offset=0):
    for frame in [1,16,31,46,61,76,91,106,121]:
        t=(frame-1)/120*TAU
        k=1+amp*sin(t+offset)
        obj.scale=(k,k,k)
        obj.keyframe_insert(data_path="scale",frame=frame,group=obj.name)

def taper(name,pts,radius,material,parent=None,sides=10):
    # Triangle strips between oriented rings, tapered gently to the tip.
    verts=[];faces=[]
    points=[Vector(p) for p in pts]
    for i,p in enumerate(points):
        if i==0:t=(points[1]-p).normalized()
        elif i==len(points)-1:t=(p-points[i-1]).normalized()
        else:t=(points[i+1]-points[i-1]).normalized()
        up=Vector((0,0,1)) if abs(t.z)<.86 else Vector((0,1,0))
        u=t.cross(up).normalized();v=t.cross(u).normalized()
        r=radius*(.95-.78*i/(len(points)-1))
        for j in range(sides):
            a=TAU*j/sides
            q=p+r*(u*cos(a)+v*sin(a))
            verts.append(tuple(q))
        if i:
            for j in range(sides):
                m=(j+1)%sides
                a=(i-1)*sides
                b=i*sides
                faces.append((a+j,a+m,b+m,b+j))
    m=bpy.data.meshes.new(name)
    m.from_pydata(verts,[],faces);m.update()
    o=bpy.data.objects.new(name,m)
    bpy.context.collection.objects.link(o)
    if parent:o.parent=parent
    o.data.materials.append(material)
    return smooth(o)

def moth_wing(name,side,material,parent):
    # Broad, swept manta hydrofoil. True shaped mesh rather than flat triangle.
    stations=[
      (0.0,-.72,.80,.05),
      (.50,-1.18,1.06,.08),
      (1.1,-1.05,.87,.20),
      (1.7,-.65,.67,.30),
      (2.35,-.18,.42,.32),
      (2.94,.25,.13,.35),
      (3.13,.34,.028,.35),
    ]
    verts=[];faces=[]
    for i,(x,front,depth,z) in enumerate(stations):
        for fy in [front,front+depth]:
            verts.append((side*x,fy,z))
            verts.append((side*x,fy,z-.085))
    for i in range(len(stations)-1):
        a=i*4;b=(i+1)*4
        for k in [0,1]:
            faces.append((a+k,b+k,b+2+k,a+2+k))
        faces.extend([(a,a+1,b+1,b),(a+2,a+3,b+3,b+2)])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o)
    o.parent=parent;o.data.materials.append(material);smooth(o)
    return stations

def aether(m):
    root=group("AETHER | Gliding mechanism",(0,0,1.74))
    ellipsoid("AETHER | Carbon fuselage",(0,-.07,0),(.68,1.23,.29),m['obsidian'],root,48,32)
    ellipsoid("AETHER | Raised dorsal crest",(0,-.30,.17),(.48,.80,.25),m['obsidian2'],root,40,24)
    ellipsoid("AETHER | Emissive breathing core",(0,-.52,.25),(.29,.50,.07),m['glow'],root)
    line("Dorsal bronze dorsal seam",[(0,.86,.11),(0,.24,.30),(0,-.49,.31),(0,-1.0,.13)],.025,m["bronze"],root)
    for side in [-1,1]:
        pivot=group("AETHER | Left wing hinge" if side<0 else "AETHER | Right wing hinge",(side*.46,0,.09),root)
        stations=moth_wing("AETHER | Articulated wing"+str(side),side,m["obsidian"],pivot)
        line("AETHER | Wing leading gold edge"+str(side),
             [(side*x-.0,front,.072+z) for x,front,back,z in stations],.024,m['bronze'],pivot)
        line("AETHER | Wing light artery"+str(side),
             [(side*x,front+back*.43,.070+z) for x,front,back,z in stations],.034,m['glow'],pivot)
        for t in [.65,1.2,1.8,2.3]:
            q=next(i for i,v in enumerate(stations) if v[0]>=t)
            x,front,back,z=stations[q]
            line("AETHER | Transverse circuit"+str(t),
                 [(side*x,front+.08,z+.085),(side*(x-.14),front+back*.63,z+.065)],.014,m['pale'],pivot)
        animate(pivot,1,side*.22,side*.2)
        animate(pivot,0,side*.065,1.8+side)
        tor("AETHER | Hinge bearing"+str(side),(side*.49,0,.08),.16,.035,m['silver'],root,axis="Y")
    tail=group("AETHER | Articulated tail",(0,.78,-.035),root)
    taper("AETHER | Tail drive",[(0,0,0),(0,.6,-.04),(0,1.30,-.11),(0,2.25,-.19),(0,3.05,-.21)],.09,m['silver'],tail)
    animate(tail,2,.23,.6)
    for side in [-1,1]:
        ellipsoid("AETHER | Intelligent optic"+str(side),(side*.32,-1.05,.06),(.14,.055,.092),m['glow'],root)
        tor("AETHER | Optic housing"+str(side),(side*.32,-1.09,.06),.12,.025,m['bronze'],root,axis="Y")
        ellipsoid("AETHER | Ventral fan"+str(side),(side*.27,.15,-.24),(.20,.44,.063),m['silver'],root)
    bob(root,.09)

def medusa(m):
    root=group("MEDUSA | Suspended organism",(0,0,2.3))
    bell=group("MEDUSA | Living glass bell",(0,0,0),root)
    ellipsoid("MEDUSA | Obsidian bell crystal",(0,0,.4),(1.18,1.15,.81),m['glass'],bell,64,36)
    ellipsoid("MEDUSA | Inner luminous diaphragm",(0,0,.24),(.84,.82,.42),m['violet'],bell,48,24)
    ellipsoid("MEDUSA | Black mechanical ring",(0,0,.06),(1.0,1.0,.22),m['obsidian2'],bell,64,20)
    tor("MEDUSA | Amber cap rim",(0,0,.15),1.14,.045,m['bronze'],bell,segments=72)
    tor("MEDUSA | Interior light guide",(0,0,.08),.87,.034,m['glow'],bell)
    for i in range(16):
        a=i*TAU/16
        t=[(cos(a)*(.94-j*.035),sin(a)*(.94-j*.035),.18+(j/8)**2*.83) for j in range(9)]
        line("MEDUSA | Bioluminescent bell rib"+str(i),t,.017,m['pale' if i%3 else 'violet'],bell)
    for i in range(11):
        a=i*TAU/11
        center=(cos(a)*.75,sin(a)*.75,-.11)
        tendril=group("MEDUSA | Tendril joint %02d"%i,center,root)
        trail=[]
        for j in range(15):
            u=j/14
            trail.append((.22*sin(u*6+i*.70)*u,.20*cos(u*5+i*.92)*u,-u*(1.55+.55*(i%3))))
        taper("MEDUSA | Articulated filament %02d"%i,trail,.039 if i%2 else .058,
              m['glow' if i%3 else 'violet'],tendril,sides=9)
        tor("MEDUSA | Microbearing %02d"%i,(0,0,0),.09,.025,m['silver'],tendril)
        animate(tendril,0,.11,i*.7)
        animate(tendril,1,.11,i*1.14)
    for i in range(5):
        a=i*TAU/5
        line("MEDUSA | Long conductivity filament"+str(i),
             [(cos(a)*.3,-.20+sin(a)*.29,0),
              (cos(a)*.28,-.21+sin(a)*.37,-.7),
              (cos(a)*.31,-.17+sin(a)*.31,-1.6),
              (cos(a)*.29,-.15+sin(a)*.31,-2.18)],.024,
             m['pale' if i%2 else 'violet'],root)
    core=ellipsoid("MEDUSA | Central intelligence",(0,0,-.14),(.22,.22,.32),m['glow'],root)
    tor("MEDUSA | Core aperture",(0,-.19,-.16),.21,.024,m['bronze'],root,axis="Y")
    pulse(bell,.055)
    bob(root,.13,.25)

def atlas(m):
    root=group("ATLAS | Heavy exoskeleton",(0,0,.93))
    ellipsoid("ATLAS | Primary thorax",(0,0,.20),(.95,1.25,.64),m['obsidian'],root,48,28)
    ellipsoid("ATLAS | Lower armored plate",(0,.21,-.12),(.91,1.22,.38),m['silver'],root,40,24)
    ellipsoid("ATLAS | Frontal sensor head",(0,-1.20,.21),(.66,.53,.42),m['obsidian2'],root)
    ellipsoid("ATLAS | Glowing underwing core",(0,.20,.51),(.61,.92,.36),m['glow'],root,40,24)
    for side in [-1,1]:
        shell=group("ATLAS | Left elytron" if side<0 else "ATLAS | Right elytron",(side*.12,.19,.62),root)
        ellipsoid("ATLAS | Split armor wing"+str(side),(side*.44,.18,.04),(.49,1.11,.31),m['obsidian'],shell,42,26)
        ellipsoid("ATLAS | Polished armor rail"+str(side),(side*.77,-.10,.14),(.08,.67,.18),m['bronze'],shell)
        for y in [-.61,-.22,.18,.57]:
            tor("ATLAS | Exoshell fenestration"+str(side)+str(y),
                (side*.55,y,.315),.095,.025,m['silver'],shell)
        line("ATLAS | Armor illuminated dorsal line"+str(side),
            [(side*.20,-.78,.23),(side*.28,-.45,.32),(side*.34,.3,.34),(side*.36,.98,.23)],
            .029,m['pale'],shell)
        animate(shell,1,-side*.44,pi/2,-0.0,-side*.16)
        animate(shell,2,-side*.055,.2)
        wing=group("ATLAS | Flight membrane hinge"+str(side),(side*.57,.22,.55),root)
        taper("ATLAS | Inner retractable wing"+str(side),
              [(0,0,0),(side*.43,-.25,.04),(side*1.0,-.34,-.04),
               (side*1.50,-.16,-.12)],.25,m['glass'],wing)
        line("ATLAS | Wing optic edge"+str(side),
             [(0,0,0),(side*.49,-.25,.04),(side*1.03,-.34,-.04),(side*1.5,-.16,-.12)],
             .022,m['glow'],wing)
        animate(wing,2,side*.19,side*1.15)
        # Three pairs of articulated limbs. Their toes grip the platform,
        # independently driven by the body rig with asymmetric phasing.
        for j,y in enumerate([-.85,.05,.80]):
            shoulder=group("ATLAS | Leg %d %d"%(side,j),(side*.77,y,-.05),root)
            rod("ATLAS | Hydraulic upper leg"+str(side)+str(j),
                (0,0,0),(side*.60,-.14+(j-1)*.22,-.43),.087,m['silver'],shoulder)
            ellipsoid("ATLAS | Leg joint"+str(side)+str(j),
                (side*.60,-.14+(j-1)*.22,-.43),(.15,.13,.15),m['bronze'],shoulder)
            rod("ATLAS | Carbon lower shin"+str(side)+str(j),
                (side*.60,-.14+(j-1)*.22,-.43),
                (side*1.27,-.28+(j-1)*.31,-.84),.062,m['obsidian2'],shoulder)
            tor("ATLAS | Leg terminal optic"+str(side)+str(j),
                (side*1.24,-.27+(j-1)*.31,-.84),.085,.024,m['glow'],shoulder)
            animate(shoulder,2,side*.08,j+side)
            animate(shoulder,1,.04,j*1.3+side)
        ellipsoid("ATLAS | Paired eye"+str(side),(side*.37,-1.62,.37),(.19,.095,.17),m['glow'],root)
        tor("ATLAS | Eye gold rim"+str(side),(side*.37,-1.69,.37),.19,.023,m['bronze'],root,axis="Y")
    for j in range(4):
        line("ATLAS | Back illuminated spine"+str(j),
             [(-.43+j*.27,-.88,.71),(-.43+j*.27,.20,.79),(-.43+j*.27,1.02,.61)],
             .014,m['glow'],root)
    bob(root,.025)

def frog(m):
    root=group("FROG | Nocturnal tree-frog mechanism",(0,0,.68))
    body=group("FROG | Breathing body",(0,0,0),root)
    ellipsoid("FROG | Black chrome anatomy",(0,.13,.72),(.70,1.0,.75),m['obsidian'],body,48,28)
    ellipsoid("FROG | Raised cranial carapace",(0,-.55,1.20),(.67,.53,.42),m['obsidian2'],body)
    ellipsoid("FROG | Soft silver belly",(0,-.19,.38),(.55,.69,.45),m['silver'],body)
    ellipsoid("FROG | Luminescent throat sac",(0,-.75,.53),(.42,.28,.38),m['glow'],body,40,28)
    throat=group("FROG | Throat rhythmic pump",(0,-.88,.60),body)
    ellipsoid("FROG | Bright cyan central throat",(0,-.02,0),(.28,.18,.29),m['green'],throat)
    pulse(throat,.14,1.0)
    for side in [-1,1]:
        # Large glass eyes with real corneal lenses and machined metallic rings.
        eye=group("FROG | Eye swivel"+str(side),(side*.44,-.86,1.52),body)
        ellipsoid("FROG | Eye bronze socket"+str(side),(0,0,0),(.34,.26,.33),m['bronze'],eye,40,24)
        ellipsoid("FROG | Eye black lens"+str(side),(0,-.21,0),(.273,.135,.265),m['dark'],eye)
        ellipsoid("FROG | Iris glow"+str(side),(0,-.315,.01),(.211,.058,.213),m['glow'],eye)
        ellipsoid("FROG | Pupil sensor"+str(side),(0,-.361,.01),(.085,.026,.15),m['obsidian'],eye)
        ellipsoid("FROG | Iris reflection"+str(side),(-.07,-.369,.09),(.06,.021,.06),m['pale'],eye)
        animate(eye,2,.06,.75+side)
        # Four limbs are distinct hinged mechanical assemblies. Rear limbs
        # curl back toward powerful haunches and splay into toe pads.
        for rear in [False,True]:
            y=.64 if rear else -.50
            leg=group("FROG | Rear actuator" if rear else "FROG | Front actuator",
                      (side*.57,y,.56 if rear else .42),body)
            dx=side*(.70 if rear else .40)
            mid=(dx,(.34 if rear else -.36),(-.03 if rear else -.34))
            end=(side*(1.22 if rear else .86),(.75 if rear else -.70),-.55 if rear else -.66)
            rod("FROG | Upper titanium femur"+str(side)+str(rear),
                (0,0,0),mid,.13 if rear else .086,m['obsidian2'],leg)
            ellipsoid("FROG | Pivot housing"+str(side)+str(rear),mid,
                (.16,.13,.15),m['bronze'],leg)
            rod("FROG | Distal carbon actuator"+str(side)+str(rear),
                mid,end,.085 if rear else .07,m['silver'],leg)
            for toe in range(3):
                f=(toe-1)*.16
                toeEnd=(end[0]+side*.23,end[1]+f,end[2]-.01)
                rod("FROG | Toe filament"+str(side)+str(rear)+str(toe),
                    end,toeEnd,.035,m['obsidian2'],leg)
                ellipsoid("FROG | Luminous toe pad"+str(side)+str(rear)+str(toe),
                    toeEnd,(.095,.095,.055),m['green'],leg,20,12)
            animate(leg,0,(.075 if rear else .045),(.65 if rear else 2.1)+side)
        # Organic circuits along a non-organic animal.
        line("FROG | Dorsal emitter"+str(side),
             [(side*.29,-.59,1.39),(side*.43,-.12,1.39),
              (side*.40,.48,1.24),(side*.31,.76,1.02)],.032,m['green'],body)
        for i,y in enumerate([-.29,.1,.48,.68]):
            ellipsoid("FROG | Bioluminescent dorsal node"+str(side)+str(i),
                      (side*(.39-.03*i),y,1.37-.12*i),
                      (.055,.055,.045),m['glow'],body,16,12)
    pulse(body,.055)
    bob(root,.045)

def export_one(kind,func):
    reset()
    mats=palette(kind)
    func(mats)
    if not bpy.data.objects:raise RuntimeError("No objects generated")
    # Continuous looping through final and first pose.
    path=str(DEST/(kind+".glb"))
    bpy.ops.export_scene.gltf(filepath=path,export_format="GLB",
        export_animations=True,export_skins=True,export_apply=False,
        export_yup=True,export_materials="EXPORT")
    polys=sum(len(o.data.polygons) for o in bpy.data.objects if o.type=="MESH")
    print("CREATURE",kind,"POLYGONS",polys,"OBJECTS",len(bpy.data.objects),
          "FILE",path)

for animal,build in [("aether",aether),("medusa",medusa),("atlas",atlas),("frog",frog)]:
    export_one(animal,build)
print("ALL FOUR ANIMATED SPECIMENS EXPORTED")

