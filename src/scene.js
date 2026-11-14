import {Scene,PerspectiveCamera,WebGLRenderer,Group,Mesh,InstancedMesh,Object3D,TorusGeometry,BoxGeometry,CylinderGeometry,CircleGeometry,RingGeometry,PlaneGeometry,SphereGeometry,IcosahedronGeometry,EdgesGeometry,LineSegments,LineBasicMaterial,MeshStandardMaterial,MeshBasicMaterial,ShaderMaterial,PointLight,BufferGeometry,Float32BufferAttribute,Points,PointsMaterial,CanvasTexture,SRGBColorSpace,ACESFilmicToneMapping,PMREMGenerator,DoubleSide,AdditiveBlending,Color} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

// Depth stages: one WebGL context draws several small 3D sculptures into the page.
// Each element marked [data-stage] reserves layout space; the shared canvas is glued to the
// document and every stage is rendered into its element's rectangle with a scissor.
// No model downloads or texture files: geometry and textures are generated here.
// Works with touch (drag to turn, tap to trigger), mouse, device tilt and scroll.

const TAU=Math.PI*2,clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};

function softDot(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.6)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return new CanvasTexture(c);}

function dust(count,inner,outer,depth,dot,color,size,opacity){const p=[];for(let i=0;i<count;i++){const a=i*2.39996,r=inner+(outer-inner)*((i*.618)%1);p.push(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*1.7)*depth);}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(p,3));return new Points(g,new PointsMaterial({map:dot,color,size,transparent:true,opacity,depthWrite:false,blending:AdditiveBlending}));}

function lights(scene,key=0xf5eaff,rim=0x772cff){const a=new PointLight(key,26,14);a.position.set(2.5,3,5);scene.add(a);const b=new PointLight(rim,34,12);b.position.set(-3.5,-1.5,2.5);scene.add(b);return a;}

/* ---------- Stage 1: camera lens with a working aperture (hero) ---------- */
function buildLens({env,mobile,dot}){
 const scene=new Scene();scene.environment=env;const camera=new PerspectiveCamera(30,1,.1,40);camera.position.z=8.4;
 const rig=new Group(),lens=new Group();rig.add(lens);scene.add(rig);const key=lights(scene);
 const violet=new MeshStandardMaterial({color:0x7a35f0,metalness:.86,roughness:.27,emissive:0x1d0838,emissiveIntensity:.35});
 const silver=new MeshStandardMaterial({color:0xe6dcff,metalness:.95,roughness:.18});
 const dark=new MeshStandardMaterial({color:0x1b0f2c,metalness:.72,roughness:.4});
 const bladeA=new MeshStandardMaterial({color:0x4a3470,metalness:.9,roughness:.3,side:DoubleSide});
 const bladeB=new MeshStandardMaterial({color:0x8f78bd,metalness:.9,roughness:.26,side:DoubleSide});
 const seg=mobile?64:96,parts=[];
 const add=(o,z,spread)=>{o.position.z=z;lens.add(o);parts.push({o,z,spread});return o;};
 const ring=(R,r,z,m,spread)=>add(new Mesh(new TorusGeometry(R,r,14,seg),m),z,spread);
 ring(1.5,.14,0,violet,0);ring(1.76,.012,-.1,silver,-.7);ring(1.22,.06,.2,dark,.55);ring(1.03,.02,.28,silver,.95);ring(.84,.09,.32,violet,1.35);
 // Barrel body so the lens has real depth when it is turned.
 const barrelMat=new MeshStandardMaterial({color:0x1b0f2c,metalness:.72,roughness:.4,side:DoubleSide}),barrel=new Mesh(new CylinderGeometry(1.47,1.36,.9,seg,1,true),barrelMat);barrel.rotation.x=Math.PI/2;add(barrel,-.5,-.45);ring(1.36,.05,-.95,violet,-.9);
 // Knurled focus grip: one instanced draw call.
 const grip=new InstancedMesh(new BoxGeometry(.05,.1,.17),silver,56),d=new Object3D();
 for(let i=0;i<56;i++){const a=i/56*TAU;d.position.set(Math.cos(a)*1.63,Math.sin(a)*1.63,0);d.rotation.set(0,0,a+Math.PI/2);d.updateMatrix();grip.setMatrixAt(i,d.matrix);}add(grip,-.02,-.3);
 add(new Mesh(new RingGeometry(.78,1.47,seg),dark),.12,.2);
 // Sensor glow seen through the aperture.
 const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,2,64,64,64);r.addColorStop(0,'#f1e6ff');r.addColorStop(.25,'#a66bff');r.addColorStop(.7,'#3b0f86');r.addColorStop(1,'#12052a');g.fillStyle=r;g.fillRect(0,0,128,128);const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;return t;})();
 const sensorMat=new MeshBasicMaterial({map:glowTex});add(new Mesh(new CircleGeometry(.8,48),sensorMat),-.34,-1);
 // Iris: eight blades slide along their normals; the opening is a true octagon.
 const iris=new Group(),blades=[],N=8;
 for(let i=0;i<N;i++){const pivot=new Group(),blade=new Mesh(new PlaneGeometry(.62,1.3),i%2?bladeA:bladeB);pivot.rotation.z=i/N*TAU;blade.rotation.y=.12;blade.position.z=i*.006;pivot.add(blade);iris.add(pivot);blades.push(blade);}
 add(iris,.03,.25);
 // Front element: thin glass highlight.
 const glass=new ShaderMaterial({transparent:true,depthWrite:false,blending:AdditiveBlending,uniforms:{uT:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float uT;void main(){vec2 p=vUv*2.-1.;float r=length(p);float rim=smoothstep(.5,1.,r);float glare=smoothstep(.8,0.,length(p-vec2(-.36,.42)));float streak=pow(max(0.,1.-abs(p.x*.7+p.y*.7+sin(uT*.4)*.35)),9.)*.22;vec3 col=mix(vec3(.5,.26,1.),vec3(.95,.88,1.),glare);float a=(rim*.16+glare*.2+streak*.7)*smoothstep(1.,.95,r);gl_FragColor=vec4(col*a,a);}'});
 add(new Mesh(new CircleGeometry(.77,48),glass),.36,1.9);
 const motes=dust(mobile?26:54,1.9,2.12,.6,dot,0xd9c5ff,.07,.7);scene.add(motes);
 let aperture=.46,target=.46,flash=0,yaw=0,pitch=0,e=0;
 return{scene,camera,
  tap(){target=target>.3?.12:.5;flash=1;},
  update(t,dt,s,io){
   // Springy drag: turn freely, then settle back to the resting pose.
   s.vx+=-yaw*.006;s.vy+=-pitch*.006;s.vx*=.94;s.vy*=.94;yaw+=s.vx;pitch+=s.vy;pitch=clamp(pitch,-1.2,1.2);
   rig.rotation.y=-.42+Math.sin(t*.27)*.14+yaw+io.px*.3+io.gx*.5;rig.rotation.x=.2+Math.sin(t*.35)*.1+pitch+io.py*.22+io.gy*.4;rig.rotation.z=Math.sin(t*.17)*.06;rig.position.y=Math.sin(t*.65)*.05;
   // Scrolling away pulls the elements apart along the optical axis.
   e+=(smooth(.02,.62,io.sy/Math.max(io.vh,1))-e)*.12;for(const p of parts)p.o.position.z=p.z+p.spread*e*.95;rig.scale.setScalar(1-e*.2);
   aperture+=((target+Math.sin(t*.5)*.03+e*.12)-aperture)*.14;for(const b of blades)b.position.x=aperture+.31;iris.rotation.z=(.5-aperture)*.9+t*.03;
   flash*=.9;sensorMat.color.setScalar(.85+flash*1.4+Math.sin(t*1.3)*.08);glass.uniforms.uT.value=t;grip.rotation.z=-t*.04+yaw*.5;motes.rotation.z=t*.03;key.position.x=2.5+io.px*2.5;}};
}

/* ---------- Stage 2: twisting film strip (work) ---------- */
function frameTexture(){const c=document.createElement('canvas');c.width=320;c.height=240;const g=c.getContext('2d');g.fillStyle='#0d0718';g.fillRect(0,0,320,240);
 g.fillStyle='#04020a';g.strokeStyle='#4a2f7c';g.lineWidth=1.5;for(let i=0;i<8;i++)for(const y of[9,209]){g.beginPath();g.roundRect(13+i*40,y,22,22,4);g.fill();g.stroke();}
 const grad=g.createLinearGradient(16,44,304,196);grad.addColorStop(0,'#8a4bff');grad.addColorStop(.55,'#4a1ca8');grad.addColorStop(1,'#190a36');g.fillStyle=grad;g.fillRect(16,44,288,152);
 g.fillStyle='rgba(241,230,255,.9)';g.beginPath();g.arc(226,96,22,0,TAU);g.fill();g.fillStyle='rgba(13,7,24,.55)';g.beginPath();g.moveTo(16,196);g.lineTo(16,160);g.lineTo(110,128);g.lineTo(190,165);g.lineTo(250,140);g.lineTo(304,170);g.lineTo(304,196);g.fill();
 g.strokeStyle='rgba(233,220,255,.85)';g.lineWidth=2;for(const[x,y,dx,dy]of[[26,54,1,1],[294,54,-1,1],[26,186,1,-1],[294,186,-1,-1]]){g.beginPath();g.moveTo(x+dx*18,y);g.lineTo(x,y);g.lineTo(x,y+dy*18);g.stroke();}
 const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;t.anisotropy=4;return t;}
function buildStrip({env,mobile,dot}){
 const scene=new Scene();scene.environment=env;const camera=new PerspectiveCamera(30,1,.1,40);camera.position.z=5.3;lights(scene);
 const map=frameTexture(),mat=new MeshStandardMaterial({map,emissiveMap:map,emissive:0xffffff,emissiveIntensity:.42,metalness:.35,roughness:.45,side:DoubleSide});
 const N=24,W=1.5,total=N*W,strip=new InstancedMesh(new PlaneGeometry(W-.02,1.12),mat,N),d=new Object3D(),tint=new Color();
 for(let i=0;i<N;i++){tint.setHSL(.73+((i*7)%5)*.012,.55,i%6===2?.98:.78+((i*3)%4)*.05);strip.setColorAt(i,tint);}strip.instanceColor.needsUpdate=true;strip.frustumCulled=false;scene.add(strip);
 const motes=dust(mobile?18:40,.3,1.15,.5,dot,0xd9c5ff,.05,.55);motes.scale.set(mobile?3:6,1,1);scene.add(motes);
 let offset=0,phase=0;
 return{scene,camera,
  tap(s){s.vx+=.9;},
  update(t,dt,s,io){
   s.vx*=.93;s.vy*=.9;offset+=dt*.32+s.vx*.55+io.sv*.006;phase+=dt*.28+io.sv*.004+s.vy*.6;
   const tilt=io.px*.12+io.gx*.25;
   for(let i=0;i<N;i++){let x=((i*W+offset)%total+total)%total-total/2;const a=x*.21+phase;d.position.set(x,Math.sin(x*.33+phase*.6)*.2,Math.cos(a)*.12);d.rotation.set(a,tilt,Math.sin(x*.33+phase*.6)*.07);d.updateMatrix();strip.setMatrixAt(i,d.matrix);}
   strip.instanceMatrix.needsUpdate=true;motes.rotation.x=t*.05;}};
}

/* ---------- Stage 3: gimbal (contact) ---------- */
function buildOrbit({env,mobile,dot}){
 const scene=new Scene();scene.environment=env;const camera=new PerspectiveCamera(30,1,.1,40);camera.position.z=8.6;lights(scene,0xffffff,0xd2b8ff);
 const white=new MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.14}),pale=new MeshStandardMaterial({color:0xdcc8ff,metalness:.9,roughness:.2}),ink=new MeshStandardMaterial({color:0x14081f,metalness:.55,roughness:.3,flatShading:true});
 const seg=mobile?72:120,rig=new Group();scene.add(rig);
 const level=(R,tube,m,bead)=>{const g=new Group();g.add(new Mesh(new TorusGeometry(R,tube,12,seg),m));for(const a of bead){const b=new Mesh(new SphereGeometry(.075,16,12),white);b.position.set(Math.cos(a)*R,Math.sin(a)*R,0);g.add(b);}return g;};
 const g1=level(2.02,.035,white,[0,Math.PI]),g2=level(1.64,.03,pale,[Math.PI/2,-Math.PI/2]),g3=level(1.26,.035,white,[.6]);rig.add(g1);g1.add(g2);g2.add(g3);
 const core=new Group(),solid=new Mesh(new IcosahedronGeometry(.62,0),ink),wire=new LineSegments(new EdgesGeometry(new IcosahedronGeometry(.9,1)),new LineBasicMaterial({color:0xe9dcff,transparent:true,opacity:.55}));core.add(solid,wire);g3.add(core);
 const motes=dust(mobile?24:50,1.95,2.2,.8,dot,0xffffff,.07,.6);scene.add(motes);
 let a1=.6,a2=.3,a3=1.1;
 return{scene,camera,
  tap(s){s.vx+=.22;s.vy+=.16;},
  update(t,dt,s,io){
   s.vx*=.965;s.vy*=.965;a1+=dt*.32+s.vy;a2+=dt*.44+s.vx+io.sv*.002;a3+=dt*.6+s.vx*.6;
   g1.rotation.x=a1;g2.rotation.y=a2;g3.rotation.x=a3;core.rotation.set(t*.3,t*.42,0);wire.rotation.y=-t*.25;
   rig.rotation.y=-.25+io.px*.28+io.gx*.45;rig.rotation.x=.18+io.py*.2+io.gy*.35;rig.position.y=Math.sin(t*.6)*.05;motes.rotation.z=-t*.025;}};
}

const builders={lens:buildLens,strip:buildStrip,orbit:buildOrbit};

export function mountStages({canvas,context,reduced}){
 const elements=[...document.querySelectorAll('[data-stage]')];
 if(reduced.matches||!context||!elements.length)return;
 const coarse=matchMedia('(pointer:coarse)').matches,mobile=coarse||innerWidth<700;
 let renderer;try{renderer=new WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.5:2));renderer.setClearColor(0x000000,0);renderer.autoClear=false;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 canvas.className='depth-canvas';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);
 const pmrem=new PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04).texture;pmrem.dispose();room.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.();});
 const shared={env,mobile,dot:softDot()};
 const stages=elements.map(el=>{const build=builders[el.dataset.stage];if(!build)return null;return Object.assign(build(shared),{el,visible:false,ready:false,aspect:0,vx:0,vy:0});}).filter(Boolean);
 const io={px:0,py:0,gx:0,gy:0,sv:0,sy:0,vh:innerHeight};
 let raf=0,disposed=false,lost=false,last=0,lastScroll=scrollY,tx=0,ty=0,tgx=0,tgy=0,base=null,vw=0,vh=0;const start0=performance.now(),cleanups=[];
 const on=(target,type,fn,options)=>{target.addEventListener(type,fn,options);cleanups.push(()=>target.removeEventListener(type,fn,options));};
 const watching=()=>document.body.classList.contains('is-watching');
 const canRun=()=>!disposed&&!lost&&!document.hidden&&!watching()&&!reduced.matches&&stages.some(s=>s.visible);
 function resize(){const w=document.documentElement.clientWidth,h=innerHeight;if(w===vw&&(h===vh||(coarse&&h<vh&&vh-h<140)))return;vw=w;vh=h;renderer.setSize(w,h,false);canvas.style.width=w+'px';canvas.style.height=h+'px';}
 function frame(now){
  raf=0;if(!canRun())return;resize();
  const dt=Math.min((now-last)/1000||.016,.05),t=(now-start0)/1000,sy=scrollY;last=now;
  io.sv+=((sy-lastScroll)-io.sv)*.25;lastScroll=sy;io.sy=sy;io.vh=innerHeight;io.px+=(tx-io.px)*.08;io.py+=(ty-io.py)*.08;io.gx+=(tgx-io.gx)*.08;io.gy+=(tgy-io.gy)*.08;
  // Glue the canvas to the document so the art never slides against the page while scrolling.
  const top=clamp(sy,0,Math.max(0,document.documentElement.scrollHeight-vh));canvas.style.transform=`translate3d(0,${top}px,0)`;
  renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
  for(const s of stages){if(!s.visible)continue;const r=s.el.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight)continue;
   const y=vh-(r.top+sy-top+r.height);renderer.setViewport(r.left,y,r.width,r.height);renderer.setScissor(r.left,y,r.width,r.height);
   const aspect=r.width/r.height;if(Math.abs(aspect-s.aspect)>.001){s.aspect=aspect;s.camera.aspect=aspect;s.camera.updateProjectionMatrix();}
   s.update(t,dt,s,io);renderer.render(s.scene,s.camera);if(!s.ready){s.ready=true;s.el.classList.add('webgl-ready');}}
  raf=requestAnimationFrame(frame);}
 const start=()=>{if(!raf&&canRun()){last=performance.now();lastScroll=scrollY;raf=requestAnimationFrame(frame);}};
 const stop=()=>{cancelAnimationFrame(raf);raf=0;};
 const seen=new IntersectionObserver(entries=>{for(const entry of entries){const s=stages.find(x=>x.el===entry.target);if(s)s.visible=entry.isIntersecting;}if(canRun())start();else stop();},{rootMargin:'80px'});
 for(const s of stages){seen.observe(s.el);
  // Drag to turn (horizontal drags reach us on touch because the stage sets touch-action:pan-y); a short press is a tap.
  let id=null,lx=0,ly=0,travel=0,began=0;
  on(s.el,'pointerdown',e=>{id=e.pointerId;lx=e.clientX;ly=e.clientY;travel=0;began=performance.now();s.el.classList.add('is-grabbed');try{s.el.setPointerCapture(id);}catch{}});
  on(s.el,'pointermove',e=>{if(e.pointerId!==id)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;travel+=Math.abs(dx)+Math.abs(dy);s.vx+=dx*.0016;s.vy+=dy*.0016;});
  const end=e=>{if(e.pointerId!==id)return;id=null;s.el.classList.remove('is-grabbed');if(e.type==='pointerup'&&travel<10&&performance.now()-began<450)s.tap?.(s);};
  on(s.el,'pointerup',end);on(s.el,'pointercancel',end);}
 if(!coarse)on(window,'pointermove',e=>{tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1;},{passive:true});
 // Device tilt where the browser offers it without a permission prompt (most Android browsers).
 if(coarse&&'DeviceOrientationEvent'in window&&typeof DeviceOrientationEvent.requestPermission!=='function')on(window,'deviceorientation',e=>{if(e.gamma==null||e.beta==null)return;if(!base)base=[e.gamma,e.beta];tgx=clamp((e.gamma-base[0])/35,-1,1);tgy=clamp((e.beta-base[1])/35,-1,1);},{passive:true});
 on(document,'visibilitychange',()=>{if(document.hidden)stop();else start();});
 on(document,'portfolio:playback',e=>{if(e.detail.playing)stop();else start();});
 on(window,'resize',()=>start(),{passive:true});
 const onMotion=()=>{if(reduced.matches)stop();else start();};reduced.addEventListener('change',onMotion);
 on(canvas,'webglcontextlost',e=>{e.preventDefault();lost=true;stop();canvas.style.display='none';for(const s of stages){s.ready=false;s.el.classList.remove('webgl-ready');}});
 start();
 return()=>{disposed=true;stop();seen.disconnect();reduced.removeEventListener('change',onMotion);for(const fn of cleanups)fn();for(const s of stages){s.el.classList.remove('webgl-ready','is-grabbed');s.scene.traverse(o=>{o.geometry?.dispose();const m=o.material;if(m){m.map?.dispose();m.dispose();}});}env.dispose();shared.dot.dispose();renderer.dispose();canvas.remove();};
}
