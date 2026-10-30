import {Scene,PerspectiveCamera,WebGLRenderer,Group,Mesh,TorusGeometry,CylinderGeometry,MeshStandardMaterial,AmbientLight,PointLight,BufferGeometry,Float32BufferAttribute,Points,PointsMaterial,ACESFilmicToneMapping} from 'three';
// A small original lens sculpture: no model downloads, texture assets or postprocessing.
export function mountLens(root,canvas,context,reduced){
 if(reduced.matches||!context)return;
 const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<700;
 let renderer;try{renderer=new WebGLRenderer({canvas,context,alpha:true,antialias:!mobile,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.2:1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
 renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.className='lens-canvas';root.append(renderer.domElement);
 const scene=new Scene(),camera=new PerspectiveCamera(34,1,.1,50);camera.position.set(0,0,7.4);
 const group=new Group();scene.add(group);
 const violet=new MeshStandardMaterial({color:0x8b42ff,metalness:.68,roughness:.26,emissive:0x260b46,emissiveIntensity:.28});
 const silver=new MeshStandardMaterial({color:0xd1bcff,metalness:.75,roughness:.24});
 const dark=new MeshStandardMaterial({color:0x261338,metalness:.6,roughness:.34});
 const rings=[];for(const [r,t,z,material] of [[1.15,.12,0,violet],[.95,.025,.18,silver],[.77,.08,.25,dark],[.56,.018,.38,silver],[1.35,.009,-.08,silver]]){const ring=new Mesh(new TorusGeometry(r,t,10,mobile?48:80),material);ring.position.z=z;group.add(ring);rings.push(ring);}
 const blades=new Group();for(let i=0;i<7;i++){const blade=new Mesh(new CylinderGeometry(.29,.08,.035,3),i%2?violet:silver);blade.rotation.x=Math.PI/2;blade.rotation.z=i*Math.PI*2/7+.55;blade.position.set(Math.cos(i*Math.PI*2/7)*.39,Math.sin(i*Math.PI*2/7)*.39,.33);blades.add(blade);}group.add(blades);
 const marks=new Group();for(let i=0;i<40;i++){const mark=new Mesh(new TorusGeometry(1.24,.009,3,3,.022),silver);mark.rotation.z=i*Math.PI*2/40;mark.position.z=.04;marks.add(mark);}group.add(marks);
 const positions=[];for(let i=0;i<(mobile?20:42);i++){const a=i*2.39996,r=1.6+(i%5)*.13;positions.push(Math.cos(a)*r,Math.sin(a)*r,Math.sin(i*1.8)*.6);}
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));const particles=new Points(geometry,new PointsMaterial({color:0xd9c5ff,size:.025,transparent:true,opacity:.55}));scene.add(particles);
 scene.add(new AmbientLight(0xd4c1ff,2));const key=new PointLight(0xf5eaff,22,12);key.position.set(2,3,4);scene.add(key);const rim=new PointLight(0x772cff,28,10);rim.position.set(-3,-1,2);scene.add(rim);
 let visible=true,frame=0,last=0,disposed=false,pointerX=0,pointerY=0;const base=performance.now();
 function resize(){const w=root.clientWidth,h=root.clientHeight-20;renderer.setSize(w,Math.max(h,1),false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(root);resize();
 function tick(now){frame=0;if(disposed||!visible||document.hidden||reduced.matches)return;if(now-last>(mobile?45:30)){const t=(now-base)*.001;group.rotation.x=.25+Math.sin(t*.35)*.12+pointerY*.18;group.rotation.y=-.35+Math.sin(t*.27)*.16+pointerX*.22;group.rotation.z=Math.sin(t*.17)*.08;group.position.y=Math.sin(t*.65)*.06;blades.rotation.z=t*.08;marks.rotation.z=-t*.025;particles.rotation.z=t*.017;key.position.x=2+pointerX*2;renderer.render(scene,camera);root.classList.add('webgl-ready');last=now;}frame=requestAnimationFrame(tick);}
 function start(){if(!frame&&!disposed&&visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);}
 function stop(){cancelAnimationFrame(frame);frame=0;}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{rootMargin:'80px'});observer.observe(root);
 const onVisibility=()=>{if(document.hidden)stop();else start();};document.addEventListener('visibilitychange',onVisibility);
 const onPointer=e=>{pointerX=e.clientX/innerWidth*2-1;pointerY=e.clientY/innerHeight*2-1;};if(!mobile)addEventListener('pointermove',onPointer,{passive:true});
 function onMotion(){if(reduced.matches){stop();root.classList.remove('webgl-ready');}else start();}reduced.addEventListener('change',onMotion);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();root.classList.remove('webgl-ready');},{once:true});
 start();return()=>{disposed=true;stop();root.classList.remove('webgl-ready');observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',onVisibility);removeEventListener('pointermove',onPointer);reduced.removeEventListener('change',onMotion);scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});renderer.dispose();renderer.domElement.remove();};
}
