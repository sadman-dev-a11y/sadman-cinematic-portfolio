import {motionPreference} from './preferences.js';
// CSS 3D that needs no hover: project cards and the showreel frame tilt with scroll position,
// follow a mouse or a finger, and lean with device tilt where the browser exposes it.
export function setupDepth(){
 const cinema=document.querySelector('#cinema'),coarse=matchMedia('(pointer:coarse)');
 let frame=0,held=null,hx=0,hy=0,lean=0,base=null;
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const allowed=()=>!motionPreference.matches&&!document.hidden;
 function reset(){for(const el of document.querySelectorAll('.project-visual')){el.style.removeProperty('--rx');el.style.removeProperty('--ry');}if(cinema){cinema.classList.remove('depth-tilt');cinema.style.removeProperty('--cine');}}
 function update(){frame=0;if(!allowed()){reset();return;}const vh=innerHeight;
  for(const el of document.querySelectorAll('.project-visual')){const r=el.getBoundingClientRect();if(!r.width||r.bottom<-80||r.top>vh+80)continue;
   const c=clamp((r.top+r.height/2-vh/2)/(vh/2+r.height/2),-1,1);let rx=c*7,ry=lean*7;if(el===held){rx-=hy*7;ry+=hx*9;}
   el.style.setProperty('--rx',rx.toFixed(2));el.style.setProperty('--ry',ry.toFixed(2));}
  if(cinema){const busy=document.body.classList.contains('is-watching')||cinema.classList.contains('theater-mode')||document.fullscreenElement===cinema,r=cinema.getBoundingClientRect(),p=busy?0:clamp((r.bottom-vh*.95)/(vh*.6),0,1);
   cinema.classList.toggle('depth-tilt',p>.002);cinema.style.setProperty('--cine',p.toFixed(3));}}
 const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
 // Anchor the hero lens to the portrait frame at every breakpoint.
 const hero=document.querySelector('.hero'),photo=document.querySelector('.hero-photo');
 function place(){if(!hero||!photo)return;hero.style.setProperty('--ph-l',photo.offsetLeft+'px');hero.style.setProperty('--ph-r',photo.offsetLeft+photo.offsetWidth+'px');hero.style.setProperty('--ph-b',photo.offsetTop+photo.offsetHeight+'px');}
 place();if(hero&&'ResizeObserver'in window)new ResizeObserver(place).observe(hero);
 function point(e){const card=e.target.closest?.('.project-visual');if(e.pointerType!=='mouse'&&e.type==='pointermove'&&!held)return;if(card){const r=card.getBoundingClientRect();hx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);hy=clamp((e.clientY-r.top)/r.height*2-1,-1,1);}if(card!==held||card){held=card;queue();}}
 const release=()=>{if(held){held=null;queue();}};
 document.addEventListener('pointermove',point,{passive:true});document.addEventListener('pointerdown',point,{passive:true});
 document.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')release();},{passive:true});document.addEventListener('pointercancel',release,{passive:true});document.documentElement.addEventListener('pointerleave',release);
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});
 if('DeviceOrientationEvent'in window&&typeof DeviceOrientationEvent.requestPermission!=='function')addEventListener('deviceorientation',e=>{if(!coarse.matches||e.gamma==null)return;if(base==null)base=e.gamma;const next=clamp((e.gamma-base)/30,-1,1);if(Math.abs(next-lean)>.015){lean=next;queue();}},{passive:true});
 motionPreference.addEventListener('change',queue);document.addEventListener('portfolio:playback',queue);document.addEventListener('fullscreenchange',queue);document.addEventListener('visibilitychange',queue);
 queue();
}
