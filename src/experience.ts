type Language='es'|'en';
export function mountExperience(getLanguage:()=>Language){
 const walk=document.querySelector<HTMLElement>('.product-walkthrough');
 const lab=document.querySelector<HTMLElement>('.solution-lab');
 const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off';
 function switchPanel(button:HTMLButtonElement,control:string,view:string,scope:Element){
  scope.querySelectorAll<HTMLButtonElement>(control).forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  const key=button.dataset.demo??button.dataset.need;
  scope.querySelectorAll<HTMLElement>(view).forEach(el=>el.hidden=(el.dataset.demoView??el.dataset.demoCopy??el.dataset.needView)!==key);
  scope.querySelectorAll<HTMLElement>(view).forEach(active=>{
   active.getAnimations().forEach(animation=>animation.cancel());
   if(!active.hidden&&!still())active.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.25,.8,.25,1)'});
  });
  document.dispatchEvent(new Event('tc-layout-change'));
 }
 if(lab)lab.querySelectorAll<HTMLButtonElement>('[data-need]').forEach(button=>button.addEventListener('click',()=>switchPanel(button,'[data-need]','[data-need-view]',lab)));
 if(!walk)return;
 const play=walk.querySelector<HTMLButtonElement>('.walk-play')!;
 const marker=walk.querySelector<HTMLElement>('.walk-marker')!;
 const counter=walk.querySelector<HTMLElement>('.walk-count')!;
 const demoButtons=[...walk.querySelectorAll<HTMLButtonElement>('[data-demo]')];
 // Coordinates only annotate the real captures; no transactions or live app state.
 const points={schedule:[[50,31],[49,54],[50,86]],metrics:[[61,36],[63,63],[12,27]]};
 let view:keyof typeof points='schedule',step=0,timer:ReturnType<typeof setTimeout>|undefined,playing=false,frame=0;
 function label(){
  play.textContent=getLanguage()==='es'?(playing?'Pausar recorrido':'Reproducir recorrido'):(playing?'Pause walkthrough':'Play walkthrough');
  play.setAttribute('aria-pressed',String(playing));
  play.disabled=still();
  walk?.querySelector('.walk-controls')?.setAttribute('aria-label',getLanguage()==='es'?'Vistas de TCGym':'TCGym views');
  lab?.querySelector('.need-controls')?.setAttribute('aria-label',getLanguage()==='es'?'Necesidad a resolver':'Problem to solve');
 }
 function stop(){if(timer)clearTimeout(timer);timer=undefined;playing=false;label();}
 function selectStep(next:number){
  step=next;const [x,y]=points[view][step];
  marker.style.setProperty('--spot-x',`${x}%`);marker.style.setProperty('--spot-y',`${y}%`);
  marker.textContent=String(step+1).padStart(2,'0');counter.textContent=`${String(step+1).padStart(2,'0')} / 03`;
  walk!.querySelectorAll<HTMLButtonElement>('[data-walk-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.walkStep)===step)));
 }
 function selectView(next:keyof typeof points){view=next;const button=demoButtons.find(el=>el.dataset.demo===view)!;switchPanel(button,'[data-demo]','[data-demo-view],[data-demo-copy]',walk!);selectStep(0);}
 demoButtons.forEach(button=>button.addEventListener('click',()=>{stop();selectView(button.dataset.demo as keyof typeof points);}));
 walk.querySelectorAll<HTMLButtonElement>('[data-walk-step]').forEach(button=>button.addEventListener('click',()=>{stop();selectStep(Number(button.dataset.walkStep));}));
 function advance(){
  frame++;if(frame>=6){stop();return;}
  const nextView=frame<3?'schedule':'metrics';if(view!==nextView)selectView(nextView);
  selectStep(frame%3);timer=setTimeout(advance,1800);
 }
 play.addEventListener('click',()=>{if(playing){stop();return;}if(still())return;playing=true;frame=0;selectView('schedule');label();timer=setTimeout(advance,1800);});
 document.addEventListener('tc-language-change',label);
 document.addEventListener('tc-motion-change',()=>{if(still()){stop();walk.getAnimations({subtree:true}).forEach(animation=>animation.cancel());}label();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.addEventListener('pagehide',stop);
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();},{threshold:0}).observe(walk);
 selectStep(0);label();
}
