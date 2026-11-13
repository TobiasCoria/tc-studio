const noMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off';
export function mountDisclosures(){
  document.querySelectorAll<HTMLDetailsElement>('.cap-list details,.idea-list details,.faq-list details').forEach(details=>{
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
      const opacity=target&&!animation?'0':getComputedStyle(panel).opacity;const transform=target&&!animation?'translateY(6px)':getComputedStyle(panel).transform;
      animation?.cancel();content?.cancel();
      details.style.height='auto';details.open=true;
      const to=target?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+parseFloat(getComputedStyle(details).paddingBottom)+parseFloat(getComputedStyle(details).borderTopWidth);
      details.dataset.animating=target?'opening':'closing';
      details.style.overflow='clip';
      animation=details.animate([{height:`${from}px`},{height:`${to}px`}],{duration:Math.min(620,Math.max(280,Math.abs(to-from)*1.1+220)),easing:'cubic-bezier(.25,.8,.25,1)',fill:'both'});
      content=panel.animate(target?[{opacity,transform},{opacity:1,transform:'translateY(0)'}]:[{opacity,transform},{opacity:0,transform:'translateY(-4px)'}],{duration:target?430:240,delay:target&&Number(opacity)===0?70:0,easing:'ease-out',fill:'both'});
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
  const root=document.documentElement,intro=document.querySelector<HTMLElement>('.intro');
  if(!intro){await prepare();return;}
  if(disabled()){await prepare();intro.remove();root.dataset.introDone='true';return;}
  intro.classList.add('active');
  const cards=[...document.querySelectorAll<HTMLElement>('.hero-stage .hero-phone,.hero-stage .window-facility,.hero-stage .window-pediatric')];
  const furniture=[...document.querySelectorAll<HTMLElement>('.site-nav,.hero-rail,.hero-bottom,.hero-footer,.camera-scroll')];
  [...cards,...furniture].forEach(el=>el.style.visibility='hidden');
  const source=intro.querySelector<HTMLElement>('.intro-mark')!;
  const count=intro.querySelector<HTMLElement>('.intro-count')!;
  const bar=intro.querySelector<HTMLElement>('.intro-line i')!;
  let skipped=false,flight:HTMLElement|undefined;
  const active:Animation[]=[];
  let releaseSkip:()=>void=()=>{};
  const skipSignal=new Promise<void>(resolve=>releaseSkip=resolve);
  const skip=()=>{skipped=true;releaseSkip();active.forEach(animation=>animation.finish());};
  intro.querySelector('.intro-skip')?.addEventListener('click',skip);
  const motionChange=()=>{if(disabled())skip();};
  document.addEventListener('tc-motion-change',motionChange);
  const animate=(element:Element,frames:Keyframe[],options:KeyframeAnimationOptions)=>{
    const animation=element.animate(frames,options);active.push(animation);return animation.finished.catch(()=>{});
  };
  const restore=()=>{
    document.querySelector<HTMLElement>('#hero-title')?.style.removeProperty('visibility');
    [...cards,...furniture].forEach(el=>el.style.removeProperty('visibility'));
    flight?.remove();intro.remove();root.dataset.introDone='true';
    document.removeEventListener('tc-motion-change',motionChange);
  };
  // All progress comes from settled real tasks, including the motion layout.
  const prepared=prepare();
  const images=[...document.querySelectorAll<HTMLImageElement>('.hero-stage img')];
  const tasks=[document.fonts.load('700 100px StartupDisplay'),document.fonts.ready,...images.map(img=>img.decode()),prepared];
  let completed=0;
  const tracked=tasks.map(task=>Promise.resolve(task).catch(()=>{}).finally(()=>{
    completed++;const progress=completed/tasks.length;count.textContent=String(Math.round(progress*100)).padStart(2,'0');bar.style.transform=`scaleX(${progress})`;
    if(completed===tasks.length)intro.querySelector('.intro-status')!.textContent=root.lang==='en'?'Ready to explore':'Todo listo para explorar';
  }));
  try{
    // Bounded asset waiting keeps the site usable on slow or failed requests.
    await Promise.all([prepared,Promise.race([Promise.all(tracked),new Promise(resolve=>setTimeout(resolve,3500)),skipSignal]),Promise.race([new Promise(resolve=>setTimeout(resolve,1850)),skipSignal])]);
    if(skipped||disabled()){restore();return;}
    await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,800))]);
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    const brand=document.querySelector<HTMLElement>('#hero-title');
    if(!brand){restore();return;}
    const target=brand.getBoundingClientRect(),origin=source.getBoundingClientRect();
    // The center mark adopts the exact final type and nested slash before travel.
    flight=brand.cloneNode(true) as HTMLElement;
    const originals=[brand,...brand.querySelectorAll<HTMLElement>('*')];
    const copies=[flight,...flight.querySelectorAll<HTMLElement>('*')];
    originals.forEach((element,index)=>{
      const computed=getComputedStyle(element);
      for(const property of computed)copies[index].style.setProperty(property,computed.getPropertyValue(property));
      copies[index].removeAttribute('id');
    });
    flight.className='intro-brand-flight';flight.setAttribute('aria-hidden','true');
    Object.assign(flight.style,{position:'fixed',left:`${target.left}px`,top:`${target.top}px`,width:`${target.width}px`,height:`${target.height}px`,margin:'0',zIndex:'10001',pointerEvents:'none',transform:'none',translate:'none',scale:'none',rotate:'none',transformOrigin:'0 0',visibility:'visible',opacity:'1',transition:'none'});
    // Match the source's visible glyph width, not its full-width layout box.
    const range=document.createRange();range.selectNodeContents(source);
    const glyph=range.getBoundingClientRect();
    const scale=glyph.width/target.width;
    const dx=glyph.left-target.left,dy=origin.top-target.top;
    flight.style.transform=`translate(${dx}px,${dy}px) scale(${scale})`;
    brand.style.visibility='hidden';document.body.append(flight);source.style.visibility='hidden';
    const travel=animate(flight,[{transform:`translate(${dx}px,${dy}px) scale(${scale})`},{transform:'translate(0,0) scale(1)'}],{duration:1500,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
    void animate(intro.querySelector('.intro-loading')!,[{opacity:1,translate:'0 0'},{opacity:0,translate:'0 12px'}],{duration:450,fill:'both'});
    void animate(intro.querySelector('small')!,[{opacity:1},{opacity:0}],{duration:400,fill:'both'});
    // Open the veil from the logo outwards, revealing the world behind it.
    const veil=animate(intro,[{clipPath:'inset(0% 0% 0% 0%)',opacity:1},{clipPath:'inset(49.9% 0% 49.9% 0%)',opacity:0}],{duration:1300,delay:200,easing:'cubic-bezier(.65,0,.2,1)',fill:'both'});
    await Promise.all([travel,veil]);
    brand.style.removeProperty('visibility');flight.remove();flight=undefined;
    intro.remove();root.dataset.introDone='true';
    // A single choreographed arrival. Native translate never competes with GSAP.
    const arrivals=[...furniture,...cards];
    arrivals.forEach((el,index)=>{
      el.style.removeProperty('visibility');
      if(!skipped&&!disabled())void animate(el,[{opacity:0,translate:`0 ${cards.includes(el)?24:12}px`},{opacity:1,translate:'0 0'}],{duration:cards.includes(el)?1100:850,delay:cards.includes(el)?150+cards.indexOf(el)*140:index*65,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    });
  }catch{restore();}finally{document.removeEventListener('tc-motion-change',motionChange);}
}
