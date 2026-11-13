import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
gsap.registerPlugin(ScrollTrigger);
export function mountMotion(){
 const fine=matchMedia('(min-width:900px) and (pointer:fine)').matches;
 const saveData=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;
 const cinematic=fine&&!saveData;
 const lenis=cinematic?new Lenis({lerp:.075,smoothWheel:true,syncTouch:false,anchors:false,autoRaf:true,prevent:node=>!!node.closest('dialog, textarea, pre, [data-lenis-prevent]')}):undefined;
 lenis?.on('scroll',ScrollTrigger.update);
 document.documentElement.dataset.cinema=cinematic?'full':'compact';
 // Resolve document positions explicitly: a pinned hero's viewport rect is not its scroll origin.
 const anchorClick=(event:MouseEvent)=>{
  if(!lenis||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
  let id:string;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
  const target=document.getElementById(id);if(!target)return;
  event.preventDefault();
  const top=id==='inicio'||id==='main'?0:target.getBoundingClientRect().top+scrollY-(id==='contacto'?0:112);
  lenis.scrollTo(Math.max(0,top),{duration:1.35,easing:t=>1-Math.pow(1-t,4)});history.pushState(null,'',url.pathname+url.search+url.hash);
 };
 document.addEventListener('click',anchorClick);
 const visibility=()=>document.hidden?lenis?.stop():lenis?.start();
 document.addEventListener('visibilitychange',visibility);
 const context=gsap.context(()=>{
  const hero=document.querySelector<HTMLElement>('.hero');
  if(hero){
   const camera=hero.querySelector('.hero-camera');
   if(cinematic){
    gsap.set('.hero-stage',{transformPerspective:1300,transformStyle:'preserve-3d'});
    gsap.set('.hero-phone',{z:0});gsap.set('.window-facility',{z:-100});gsap.set('.window-pediatric',{z:-190});
    gsap.set('.hero-stage',{scale:.82});
    // The opening is stable; only actual scroll drives the product camera.
    // Camera move: approach the product, pull back to reveal the wider system.
    const scene=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:()=>'+='+Math.round(innerHeight*1.15),pin:true,anticipatePin:1,scrub:1,invalidateOnRefresh:true},defaults:{ease:'none'}});
    scene.to('.hero-signature',{scale:1.5,rotation:8,duration:1},0)
     .to('.hero-wordmark',{scale:1.9,z:250,yPercent:-60,opacity:0,duration:.33},0)
     .to('.hero-bottom,.hero-footer,.camera-scroll',{y:-35,opacity:0,duration:.16},0)
     .to('.hero-stage',{scale:1.08,z:60,rotationY:7,rotationX:-4,yPercent:4,duration:.4},0)
     .to('.window-facility',{xPercent:-22,rotationY:12,rotation:-10,z:-70,duration:.4},0)
     .to('.window-pediatric',{xPercent:18,rotationY:-6,rotation:6,z:95,duration:.4},0)
     .to('.hero-phone',{z:-70,scale:.7,rotationY:-6,duration:.4},0)
     .to('.camera-rings',{scale:1.8,rotation:35,opacity:.7,duration:.4},0)
     .to('.hero-stage',{scale:.43,z:-420,rotationY:-12,rotationX:16,yPercent:-45,opacity:.25,duration:.48},.43)
     .to('.hero-phone',{z:0,scale:1,rotationY:0,duration:.48},.43)
     .to('.window-facility',{xPercent:-15,z:-100,duration:.48},.43)
     .to('.window-pediatric',{xPercent:15,z:-160,duration:.48},.43)
     .fromTo('.camera-destination',{opacity:0,yPercent:55,scale:.72,rotationX:-18},{opacity:1,yPercent:0,scale:1,rotationX:0,duration:.4},.54)
     .to('.camera-rings',{scale:.65,rotation:80,opacity:.3,duration:.5},.43)
     .to(camera,{backgroundColor:'#07120e',duration:.55},.4);
    // Keep the initial frame free of hidden interactive controls at the far end.
    scene.eventCallback('onUpdate',()=>{const hidden=scene.progress()>.28;hero.querySelectorAll<HTMLElement>('.hero-bottom,.hero-footer').forEach(el=>el.inert=hidden);});
   }else{
    gsap.fromTo('.hero-stage',{scale:.86,rotationX:8},{scale:1,rotationX:0,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom 25%',scrub:.7}});
    gsap.to('.hero-wordmark',{yPercent:18,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6}});
   }
  }
  const bridge=document.querySelector('.sequence-bridge');
  if(bridge){
   if(cinematic){
    const story=gsap.timeline({scrollTrigger:{trigger:bridge,start:'top top',end:()=>'+='+Math.round(innerHeight*.85),pin:true,scrub:.95,anticipatePin:1,invalidateOnRefresh:true},defaults:{ease:'none'}});
    story.fromTo('.bridge-title',{scale:1.9,xPercent:18,z:260},{scale:.7,xPercent:-25,z:-250,duration:.65},0)
     .fromTo('.system-stack',{scale:.45,z:-700,rotationY:-25,rotationX:55,opacity:.2},{scale:1,z:0,rotationY:-12,rotationX:30,opacity:1,duration:.7},0)
     .fromTo('.layer-interface',{z:0,y:0},{z:190,y:-65,duration:.55},.25)
     .fromTo('.layer-logic',{z:-30,y:0},{z:0,y:0,duration:.55},.25)
     .fromTo('.layer-data',{z:-60,y:0},{z:-190,y:65,duration:.55},.25)
     .to('.bridge-grid',{scale:1.5,yPercent:12,rotation:5,duration:1},0)
     .fromTo('.bridge-caption',{y:40,opacity:0},{y:0,opacity:1,duration:.3},.65)
     .to('.bridge-title',{xPercent:-45,opacity:.3,duration:.25},.75);
   }else{
    gsap.fromTo('.system-stack',{rotationY:-12,scale:.86},{rotationY:8,scale:1,ease:'none',scrollTrigger:{trigger:bridge,start:'top 85%',end:'bottom 30%',scrub:.7}});
   }
  }
  document.querySelectorAll<HTMLElement>('.project-scene').forEach((scene,index)=>{
   const art=scene.querySelector('.scene-art');const product=scene.querySelector('.product-browser,.showcase-phone');
   if(cinematic){
    const sequence=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:scene,start:'top top',end:'bottom bottom',scrub:.95,invalidateOnRefresh:true}});
    sequence.fromTo(product,{scale:.78,z:-240,rotationY:index%2?14:-14,rotationZ:index%2?-4:4},{scale:1,z:0,rotationY:0,rotationZ:0,duration:.55},0)
     .fromTo(scene.querySelector('.scene-title'),{xPercent:index%2?20:-15,scale:1.14,rotationX:-7},{xPercent:0,scale:1,rotationX:0,duration:.45},0)
     .fromTo(scene.querySelector('.art-word,.city-grid'),{scale:1.35,yPercent:20},{scale:.85,yPercent:-16,duration:1},0)
     .to(product,{scale:.88,z:-140,rotationY:index%2?-9:9,yPercent:-8,duration:.3},.7)
     .to(scene.querySelector('.scene-title'),{yPercent:-12,duration:.3},.7);
   }else{
    gsap.fromTo(art,{y:35,rotationX:5},{y:-15,rotationX:0,ease:'none',scrollTrigger:{trigger:scene,start:'top 80%',end:'bottom 20%',scrub:.7}});
   }
  });
  // Second act: the technical work becomes a person, an offer and a conversation.
  const travel=cinematic?1:.4;
  const scrub=(trigger:Element|string,start='top 88%',end='bottom 45%')=>({trigger,start,end,scrub:.85,invalidateOnRefresh:true});
  const more=document.querySelector('.more-work');
  if(more){
   gsap.fromTo('.more-work h3',{xPercent:-9*travel,rotationX:-12*travel,scale:1.08},{xPercent:0,rotationX:0,scale:1,ease:'none',scrollTrigger:scrub(more)});
   gsap.fromTo('.more-work-list article',{y:65*travel,rotationY:-9*travel},{y:0,rotationY:0,stagger:.18,duration:1.15,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:more,start:'top 82%',once:true}});
  }
  document.querySelectorAll<HTMLElement>('.capabilities,.studio,.engagement,.process,.contact').forEach((section,index)=>{
   const depth=section.querySelector('.section-depth');
   if(depth)gsap.fromTo(depth,{rotation:-30,scale:.7,yPercent:12},{rotation:30+index*7,scale:1.12,yPercent:-12,ease:'none',scrollTrigger:scrub(section,'top bottom','bottom top')});
  });
  if(document.querySelector('.capabilities')){
   gsap.fromTo('.cap-intro h2',{y:60*travel,rotationY:10*travel,scale:.9},{y:-12*travel,rotationY:0,scale:1,ease:'none',scrollTrigger:scrub('.capabilities','top 90%','top 15%')});
   document.querySelectorAll('.cap-list details').forEach(el=>gsap.fromTo(el,{x:45*travel,rotationY:-8*travel},{x:0,rotationY:0,duration:.85,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:el,start:'top 93%',once:true}}));
  }
  if(document.querySelector('.studio')){
   gsap.fromTo('.portrait',{rotation:-7*travel,y:45*travel},{rotation:3*travel,y:-30*travel,ease:'none',scrollTrigger:scrub('.studio','top 90%','bottom 30%')});
   gsap.fromTo('.studio-copy h2',{xPercent:12*travel},{xPercent:-3*travel,ease:'none',scrollTrigger:scrub('.studio')});
   gsap.fromTo('.tech-strip',{xPercent:4*travel},{xPercent:-4*travel,ease:'none',scrollTrigger:scrub('.tech-strip','top bottom','bottom 40%')});
  }
  document.querySelectorAll<HTMLElement>('.engagement-grid article').forEach((card,index)=>{
   gsap.fromTo(card,{y:(55+index*22)*travel,rotationX:12*travel,transformPerspective:1000},{y:0,rotationX:0,duration:1.15,delay:cinematic?index*.12:0,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:card,start:'top 94%',once:true}});
  });
  if(document.querySelector('.process-grid')){
   gsap.fromTo('.process-grid',{'--process-line':0},{'--process-line':1,ease:'none',scrollTrigger:scrub('.process-grid','top 90%','bottom 55%')});
   document.querySelectorAll('.process-grid article').forEach((card,index)=>gsap.fromTo(card,{y:(35+index*20)*travel,rotationY:-8*travel},{y:0,rotationY:0,ease:'none',scrollTrigger:scrub(card,'top 95%','top 55%')}));
  }
  gsap.fromTo('#contact-form',{y:65*travel,rotationY:-7*travel,scale:.97},{y:0,rotationY:0,scale:1,duration:1.15,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:'#contact-form',start:'top 95%',once:true}});
  document.querySelectorAll<HTMLElement>('.contact-channels a,.email-tools,.footer-top').forEach(el=>gsap.fromTo(el,{y:25*travel},{y:0,duration:.8,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:el,start:'top 97%',once:true}}));

  document.querySelectorAll('.process-timeline article').forEach(row=>gsap.fromTo(row,{y:35*travel},{y:0,ease:'none',scrollTrigger:scrub(row,'top 90%','top 50%')}));
  if(document.querySelector('.process-timeline'))gsap.fromTo('.process-timeline',{'--timeline-progress':0},{'--timeline-progress':1,ease:'none',scrollTrigger:scrub('.process-timeline','top 65%','bottom 65%')});
  if(document.querySelector('.ideas-heading h2'))gsap.fromTo('.ideas-heading h2',{y:45*travel,rotationX:-8*travel},{y:0,rotationX:0,ease:'none',scrollTrigger:scrub('.ideas-heading','top 95%','top 45%')});
  if(document.querySelector('.product-walkthrough')){
   gsap.fromTo('.demo-frame',{rotationY:-8*travel,y:35*travel},{rotationY:0,y:0,ease:'none',scrollTrigger:scrub('.product-walkthrough','top 90%','top 10%')});
   gsap.fromTo('.walk-heading h2',{xPercent:-4*travel},{xPercent:0,ease:'none',scrollTrigger:scrub('.walk-heading')});
  }
  const finale=document.querySelector('.contact-finale');
  if(finale){
   const contactTitle=document.querySelector<HTMLElement>('.contact-title');
   const closing=gsap.timeline({scrollTrigger:{trigger:finale,start:'top 88%',once:true},defaults:{ease:'power3.out'}});
   closing.fromTo('.finale-copy',{opacity:0,y:22},{opacity:1,y:0,duration:.75},0)
    .fromTo('.finale-slash',{opacity:0,rotation:-18,y:25},{opacity:1,rotation:0,y:0,duration:.9},.1)
    .fromTo('.finale-line',{scaleX:0},{scaleX:1,duration:1.1},.2);
   if(contactTitle)closing.fromTo(contactTitle,{opacity:0,y:25},{opacity:1,y:0,duration:.85,clearProps:'opacity,transform',onComplete:()=>contactTitle.classList.add('finale-arrived')},.6);
  }
  // Editorial titles move inside their own masks; body copy stays available.
  document.querySelectorAll<HTMLElement>('.opening h2,.work-intro h2,.engagement h2,.process h2').forEach(title=>{
   gsap.fromTo(title,{clipPath:'inset(0 0 100% 0)',yPercent:12,rotationX:-8},{clipPath:'inset(0 0 0% 0)',yPercent:0,rotationX:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:title,start:'top 94%',once:true},clearProps:'clipPath,transform'});
  });
 });
 const cleanups:(()=>void)[]=[];
 if(fine)document.querySelectorAll<HTMLElement>('.magnetic').forEach(el=>{
  const x=gsap.quickTo(el,'x',{duration:.45,ease:'power3.out'}),y=gsap.quickTo(el,'y',{duration:.45,ease:'power3.out'});
  const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.1);y((e.clientY-r.top-r.height/2)*.13);};
  const leave=()=>{x(0);y(0);};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
  cleanups.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);x.tween.kill();y.tween.kill();gsap.set(el,{clearProps:'transform'});});
 });
 if(cinematic)document.querySelectorAll<HTMLElement>('.scene-art').forEach(el=>{
  const x=gsap.quickTo(el,'rotationY',{duration:.9,ease:'power3.out'}),y=gsap.quickTo(el,'rotationX',{duration:.9,ease:'power3.out'});
  const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();x((e.clientX-r.left-r.width/2)/r.width*5);y(-(e.clientY-r.top-r.height/2)/r.height*4);};
  const leave=()=>{x(0);y(0);};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
  cleanups.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);x.tween.kill();y.tween.kill();gsap.set(el,{clearProps:'transform'});});
 });
 let alive=true,refreshFrame=0;
 const layoutChanged=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>{if(alive){ScrollTrigger.refresh();lenis?.resize();}});};
 document.addEventListener('tc-layout-change',layoutChanged);document.addEventListener('tc-language-change',layoutChanged);
 document.querySelectorAll('img').forEach(img=>{if(!img.complete){img.addEventListener('load',layoutChanged,{once:true});cleanups.push(()=>img.removeEventListener('load',layoutChanged));}});
 document.fonts.ready.then(()=>{if(alive)layoutChanged();});
 return ()=>{alive=false;document.removeEventListener('click',anchorClick);cancelAnimationFrame(refreshFrame);document.removeEventListener('tc-layout-change',layoutChanged);document.removeEventListener('tc-language-change',layoutChanged);context.revert();cleanups.forEach(fn=>fn());document.removeEventListener('visibilitychange',visibility);lenis?.destroy();delete document.documentElement.dataset.cinema;document.querySelectorAll('.hero-bottom,.hero-footer').forEach(el=>el.removeAttribute('inert'));};
}
