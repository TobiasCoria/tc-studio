type Language='es'|'en';
const details:Record<string,{es:string;en:string;mark:string}>={
 software:{es:'Aplicaciones y sistemas para tu negocio',en:'Applications and systems for your business',mark:'01'},
 odoo:{es:'Módulos, procesos y personalizaciones',en:'Modules, processes and customization',mark:'02'},
 collaboration:{es:'Capacidad de desarrollo para tu equipo',en:'Development support for your team',mark:'03'},
 pilot:{es:'Revisamos el caso y definimos un piloto',en:'Assess the use case and define a pilot',mark:'04'},
 other:{es:'Contame qué tenés en mente',en:'Tell me what you have in mind',mark:'05'},
};
export function mountServicePicker(getLanguage:()=>Language){
 const source=document.querySelector<HTMLSelectElement>('#service');if(!source)return;
 const select=source;
 const label=document.querySelector<HTMLLabelElement>('label[for="service"]')!;
 const wrapper=document.createElement('div');wrapper.className='service-picker';
 const button=document.createElement('button');button.type='button';button.id='service-trigger';button.className='service-trigger';button.setAttribute('role','combobox');button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','service-options');
 label.id='service-label';label.htmlFor=button.id;button.setAttribute('aria-labelledby','service-label service-current');
 const value=document.createElement('span');value.id='service-current';value.className='service-current';
 const chevron=document.createElement('span');chevron.className='service-chevron';chevron.setAttribute('aria-hidden','true');chevron.innerHTML='<svg viewBox="0 0 24 24" fill="none"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 button.append(value,chevron);select.after(wrapper);wrapper.append(button);select.hidden=true;
 const list=document.createElement('div');list.className='service-list';list.id='service-options';list.setAttribute('role','listbox');list.setAttribute('aria-labelledby','service-label');list.setAttribute('data-lenis-prevent','');
 const popover=typeof list.showPopover==='function';if(popover)list.setAttribute('popover','manual');else list.hidden=true;
 document.body.append(list);
 const options=[...select.options];let placementFrame=0;let closeVersion=0,closingAnimation:Animation|undefined;let open=false,active=select.selectedIndex,search='',searchTimer:ReturnType<typeof setTimeout>|undefined;
 const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.dataset.motion==='off';
 const rows=options.map((option,i)=>{
  const row=document.createElement('div');row.id=`service-option-${i}`;row.className='service-option';row.setAttribute('role','option');row.dataset.value=option.value;
  const number=document.createElement('span');number.className='service-option-number';number.setAttribute('aria-hidden','true');number.textContent=details[option.value]?.mark??String(i+1);
  const copy=document.createElement('span');copy.className='service-option-copy';const title=document.createElement('span');title.className='service-option-title';const description=document.createElement('span');description.className='service-option-description';copy.append(title,description);
  const check=document.createElement('span');check.className='service-check';check.setAttribute('aria-hidden','true');check.textContent='✓';row.append(number,copy,check);
  row.addEventListener('pointerdown',event=>event.preventDefault());row.addEventListener('pointermove',()=>activate(i));row.addEventListener('click',()=>choose(i));list.append(row);return row;
 });
 function render(){
  value.textContent=select.selectedOptions[0]?.textContent??'';
  rows.forEach((row,i)=>{row.querySelector('.service-option-title')!.textContent=options[i].textContent;row.querySelector('.service-option-description')!.textContent=details[options[i].value]?.[getLanguage()]??'';row.setAttribute('aria-selected',String(select.selectedIndex===i));});
 }
 function place(){
  const rect=button.getBoundingClientRect();const bottom=innerHeight-rect.bottom-16,top=rect.top-16;const above=bottom<280&&top>bottom;const available=Math.max(100,(above?top:bottom)-8);
  list.style.width=`${Math.min(rect.width,innerWidth-24)}px`;list.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-rect.width-12))}px`;list.style.maxHeight=`${Math.min(390,available)}px`;
  list.style.top=above?'auto':`${rect.bottom+8}px`;list.style.bottom=above?`${innerHeight-rect.top+8}px`:'auto';list.dataset.side=above?'above':'below';
 }
 function trackPosition(){if(!open)return;place();placementFrame=requestAnimationFrame(trackPosition);}
 function activate(i:number){active=i;rows.forEach((row,n)=>row.toggleAttribute('data-active',n===i));button.setAttribute('aria-activedescendant',rows[i].id);}
 function revealActive(){const row=rows[active];if(row.offsetTop<list.scrollTop)list.scrollTop=row.offsetTop;else if(row.offsetTop+row.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=row.offsetTop+row.offsetHeight-list.clientHeight;}
 function show(){if(open)return;++closeVersion;closingAnimation?.cancel();open=true;render();place();if(popover){if(!list.matches(':popover-open'))list.showPopover();}else list.hidden=false;button.setAttribute('aria-expanded','true');trackPosition();activate(select.selectedIndex);revealActive();if(!still())list.animate([{opacity:0,transform:`translateY(${list.dataset.side==='above'?6:-6}px) scale(.99)`},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360,easing:'cubic-bezier(.25,.8,.25,1)'});}
 function close(){if(!open)return;open=false;const ticket=++closeVersion;cancelAnimationFrame(placementFrame);button.setAttribute('aria-expanded','false');button.removeAttribute('aria-activedescendant');const hide=()=>{if(ticket!==closeVersion)return;if(popover)list.hidePopover();else list.hidden=true;};if(still())hide();else{closingAnimation=list.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:list.dataset.side==='above'?'0 5px':'0 -5px'}],{duration:170,easing:'ease-out'});closingAnimation.finished.then(hide).catch(()=>{});}}
 function choose(i:number){select.value=options[i].value;select.dispatchEvent(new Event('change',{bubbles:true}));render();close();button.focus({preventScroll:true});}
 button.addEventListener('click',()=>open?close():show());
 button.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)){
   event.preventDefault();const wasOpen=open;if(!open)show();
   if(event.key==='ArrowDown'&&wasOpen)activate((active+1)%rows.length);
   if(event.key==='ArrowUp'&&wasOpen)activate((active-1+rows.length)%rows.length);
   if(event.key==='Home')activate(0);if(event.key==='End')activate(rows.length-1);
   if((event.key==='Enter'||event.key===' ')&&wasOpen)choose(active);else revealActive();return;
  }
  if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();close();}
  if(event.key==='Tab')close();
  if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();if(!open)show();clearTimeout(searchTimer);search+=event.key.toLocaleLowerCase();const found=options.findIndex(option=>option.textContent?.trim().toLocaleLowerCase().startsWith(search));if(found>=0){activate(found);revealActive();}searchTimer=setTimeout(()=>{search='';},600);}
 });
 document.addEventListener('pointerdown',event=>{if(!wrapper.contains(event.target as Node)&&!list.contains(event.target as Node))close();});
 button.addEventListener('blur',close);
 window.addEventListener('resize',close,{passive:true});
 document.addEventListener('scroll',event=>{if(open&&event.target!==list)close();},{capture:true,passive:true});
 document.addEventListener('tc-language-change',()=>{render();if(open)place();});
 select.addEventListener('change',render);select.form?.addEventListener('reset',()=>queueMicrotask(()=>{render();close();}));render();
}
