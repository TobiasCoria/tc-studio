// A narrow light follows the real rounded perimeter; no rotating oversized layer.
export function mountLightOrbits(){
 const ns='http://www.w3.org/2000/svg';
 const targets=[...document.querySelectorAll<HTMLElement>('.contact-shortcut,#contact-form,.scene-art .product-browser,.engagement-grid article,.solution-explorer,.menu-toggle,.cv-link')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{(entry.target as HTMLElement).dataset.orbitVisible=String(entry.isIntersecting);}),{threshold:.08});
 const resizer=new ResizeObserver(entries=>entries.forEach(entry=>{
  const host=entry.target as HTMLElement;
  const radius=parseFloat(getComputedStyle(host).borderTopLeftRadius)||5;
  host.querySelectorAll<SVGRectElement>(':scope>.light-orbit rect').forEach(rect=>{rect.setAttribute('width',String(Math.max(0,host.clientWidth-2)));rect.setAttribute('height',String(Math.max(0,host.clientHeight-2)));rect.setAttribute('rx',String(Math.max(0,radius-1)));});
 }));
 targets.forEach((host,index)=>{
  host.classList.add('light-host');if(host.id==='contact-form')host.classList.add('light-featured');
  host.style.setProperty('--orbit-delay',`${-index*1.65}s`);
  const svg=document.createElementNS(ns,'svg');svg.classList.add('light-orbit');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  const defs=document.createElementNS(ns,'defs'),gradient=document.createElementNS(ns,'linearGradient');const id=`tc-orbit-${index}`;
  gradient.id=id;gradient.setAttribute('x1','0%');gradient.setAttribute('y1','0%');gradient.setAttribute('x2','100%');gradient.setAttribute('y2','100%');
  [['0%','#aebcc2'],['45%','#fff8e9'],['65%','#d6bd91'],['100%','#b8c7c9']].forEach(([offset,color])=>{const stop=document.createElementNS(ns,'stop');stop.setAttribute('offset',offset);stop.setAttribute('stop-color',color);gradient.append(stop);});defs.append(gradient);svg.append(defs);
  ['orbit-halo','orbit-ray'].forEach(className=>{const rect=document.createElementNS(ns,'rect');rect.classList.add('orbit-run',className);rect.setAttribute('x','1');rect.setAttribute('y','1');rect.setAttribute('pathLength','100');rect.setAttribute('fill','none');rect.setAttribute('stroke',`url(#${id})`);svg.append(rect);});
  host.append(svg);observer.observe(host);resizer.observe(host);
 });
 window.addEventListener('pagehide',()=>{observer.disconnect();resizer.disconnect();},{once:true});
}

