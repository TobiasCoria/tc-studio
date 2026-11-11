const noMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off';
export function mountDisclosures(){
  document.querySelectorAll<HTMLDetailsElement>('.cap-list details,.idea-list details').forEach(details=>{
    const summary=details.querySelector<HTMLElement>('summary')!;
    const panel=details.querySelector<HTMLElement>(':scope>div')!;
    let animation:Animation|undefined,content:Animation|undefined;
    let target=details.open,version=0;
    const settle=()=>{version++;animation?.cancel();content?.cancel();animation=content=undefined;details.open=target;details.style.removeProperty('height');details.style.removeProperty('overflow');details.removeAttribute('data-animating');document.dispatchEvent(new Event('tc-layout-change'));};
    summary.addEventListener('click',event=>{
      if(noMotion()){target=!details.open;settle();event.preventDefault();return;}
      event.preventDefault();
      const from=details.getBoundingClientRect().height;
      target=animation?!target:!details.open;
      version++;const current=version;
      animation?.cancel();content?.cancel();
      details.style.height='auto';details.open=true;
      const to=target?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+parseFloat(getComputedStyle(details).paddingBottom)+parseFloat(getComputedStyle(details).borderTopWidth);
      details.dataset.animating=target?'opening':'closing';
      details.style.overflow='clip';
      animation=details.animate([{height:`${from}px`},{height:`${to}px`}],{duration:target?500:400,easing:'cubic-bezier(.25,.8,.25,1)',fill:'both'});
      content=panel.animate(target?[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}]:[{opacity:1},{opacity:0}],{duration:target?400:260,easing:'ease-out',fill:'both'});
      animation.finished.then(()=>{if(version===current)settle();}).catch(()=>{});
    });
    details.addEventListener('toggle',()=>{if(!animation){target=details.open;document.dispatchEvent(new Event('tc-layout-change'));}});
    document.addEventListener('tc-motion-change',()=>{if(noMotion()&&animation)settle();});
    window.addEventListener('resize',()=>{if(animation)settle();},{passive:true});
    // Changing language may change measured text heights mid-animation.
    new MutationObserver(()=>{if(animation)settle();}).observe(panel,{childList:true,subtree:true,characterData:true});
  });
}
export async function playIntro(disabled:()=>boolean,prepare:()=>Promise<void>){
  const intro=document.querySelector<HTMLElement>('.intro');if(!intro){await prepare();return;}
  if(disabled()){await prepare();intro.remove();return;}
  intro.classList.add('active');
  // Build the final layout and scroll camera while the introduction still covers it.
  const prepared=prepare();
  const assets=[...document.querySelectorAll<HTMLImageElement>('.hero-stage img')].map(img=>img.decode().catch(()=>{}));
  const ready=Promise.allSettled([document.fonts.ready,...assets]);
  // Real asset readiness, bounded wait; the decorative line is not a fake percentage.
  await Promise.all([new Promise(resolve=>setTimeout(resolve,650)),Promise.race([ready,new Promise(resolve=>setTimeout(resolve,1400))]),prepared]);
  if(disabled()){intro.remove();return;}
  await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  const finish=intro.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:780,easing:'cubic-bezier(.65,0,.25,1)',fill:'forwards'});
  await finish.finished.catch(()=>{});intro.remove();
}
