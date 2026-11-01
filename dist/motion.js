import {motionPreference} from './preferences.js';
import {setupChoreography} from './choreography.js';
const EASE='cubic-bezier(.16,1,.3,1)';
export function animateIn(el,delay=0){if(motionPreference.matches||!el?.animate)return;el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:delay*1000,easing:EASE});}
export function setupMotion({tone}){
 const scenes=setupChoreography();
 const $=s=>document.querySelector(s),fine=matchMedia('(hover:hover) and (pointer:fine)'),hero=$('.hero'),cursor=$('.cursor-orbit');
 let x=0,y=0,cx=0,cy=0,frame=0,scrollFrame=0,tilted,magnet,disposeLens,lensStarted=false;
 const enabled=()=>fine.matches&&!motionPreference.matches&&!document.hidden&&!document.body.classList.contains('is-watching');
 function reset(el){if(!el)return;for(const name of ['--tilt-x','--tilt-y','--mag-x','--mag-y'])el.style.removeProperty(name);}
 function stop(){cancelAnimationFrame(frame);frame=0;reset(tilted);reset(magnet);tilted=magnet=null;cursor.classList.remove('active');}
 function tick(){frame=0;if(!enabled())return;cx+=(x-cx)*.24;cy+=(y-cy)*.24;cursor.style.transform=`translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;if(Math.abs(x-cx)+Math.abs(y-cy)>.35)frame=requestAnimationFrame(tick);}
 function pointer(e){if(!enabled())return;x=e.clientX;y=e.clientY;if(!cursor.classList.contains('active')){cx=x;cy=y;}cursor.classList.add('active');cursor.classList.remove('hidden');if(!frame)frame=requestAnimationFrame(tick);
 const card=e.target.closest('.certificate-card');if(tilted!==card){reset(tilted);tilted=card;}if(card){const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-(y-r.top-r.height/2)/r.height*4}deg`);card.style.setProperty('--tilt-y',`${(x-r.left-r.width/2)/r.width*5}deg`);}
 const next=e.target.closest('.magnetic');if(next!==magnet){reset(magnet);magnet=next;}if(magnet){const r=magnet.getBoundingClientRect();magnet.style.setProperty('--mag-x',`${(x-r.left-r.width/2)*.08}px`);magnet.style.setProperty('--mag-y',`${(y-r.top-r.height/2)*.12}px`);}
 if(hero.classList.contains('is-inview')){hero.style.setProperty('--portrait-x',`${(x/innerWidth-.5)*6}px`);hero.style.setProperty('--portrait-y',`${(y/innerHeight-.5)*5}px`);}
 }
 document.addEventListener('pointermove',pointer,{passive:true});
 document.addEventListener('pointerover',e=>{if(!enabled())return;const target=e.target.closest('[data-cursor],a,button');cursor.classList.toggle('engaged',Boolean(target?.dataset.cursor));cursor.querySelector('span').textContent=target?.dataset.cursor||'';if(target?.matches('.certificate-card,.project-button,.primary')&&!target.contains(e.relatedTarget))tone('hover');});
 document.addEventListener('pointerout',e=>{if(magnet&&!magnet.contains(e.relatedTarget))reset(magnet);});document.documentElement.addEventListener('pointerleave',()=>{cursor.classList.add('hidden');stop();});
 const revealed=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealed.unobserve(e.target);}}),{threshold:.06});
 document.querySelectorAll('.section-top,.intro h2,.intro-aside,.project,.article,.timeline,.contact h2,.skill-groups').forEach(el=>{el.classList.add('reveal');revealed.observe(el);});
 const inView=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-inview',e.isIntersecting)),{rootMargin:'40px'});document.querySelectorAll('.section,.hero').forEach(el=>inView.observe(el));
 const navLinks=[...document.querySelectorAll('header nav a')],progress=$('.progress'),header=$('header');
 function updateScroll(){scrollFrame=0;scenes.updateScroll();const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${max>0?scrollY/max*100:0}%`;header.classList.toggle('scrolled',scrollY>40);let active=null;for(const a of navLinks){const el=document.getElementById(a.hash.slice(1));if(el&&el.getBoundingClientRect().top<innerHeight*.45)active=a;}navLinks.forEach(a=>{a.classList.toggle('active',a===active);if(a===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});addEventListener('resize',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();
 async function loadLens(){if(lensStarted||motionPreference.matches||navigator.connection?.saveData||innerWidth<850||(navigator.deviceMemory&&navigator.deviceMemory<=2))return;lensStarted=true;const canvas=document.createElement('canvas');let context;try{context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power',failIfMajorPerformanceCaveat:true});}catch{}if(!context)return;try{const module=await import('./scene.js');if(!motionPreference.matches)disposeLens=module.mountLens($('#lens-sculpture'),canvas,context,motionPreference);}catch{/* Keep the static vector lens if WebGL is unavailable. */}}
 const lazy=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){if('requestIdleCallback'in window)requestIdleCallback(loadLens,{timeout:2200});else setTimeout(loadLens,900);lazy.disconnect();}},{rootMargin:'100px'});lazy.observe(hero);
 motionPreference.addEventListener('change',()=>{if(motionPreference.matches){stop();hero.style.removeProperty('--portrait-x');hero.style.removeProperty('--portrait-y');document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));disposeLens?.();disposeLens=undefined;lensStarted=false;}else void loadLens();});
 fine.addEventListener('change',()=>{if(!fine.matches)stop();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});document.addEventListener('portfolio:playback',e=>{if(e.detail.playing)stop();});
 return()=>{scenes.destroy();stop();disposeLens?.();revealed.disconnect();inView.disconnect();lazy.disconnect();cancelAnimationFrame(scrollFrame);};
}
