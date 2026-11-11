type Language='es'|'en';
const groups={
  tcgym:[{src:'/media/tcgym-login.png',es:'TCGym / Acceso público',en:'TCGym / Public login'},{src:'/media/tcgym-registro.png',es:'TCGym / Registro público',en:'TCGym / Public registration'},{src:'/media/tcgym-mobile.png',es:'TCGym / Registro móvil',en:'TCGym / Mobile registration'},{src:'/media/tcgym-turnos.jpg',es:'TCGym / Agenda de turnos — captura del proyecto',en:'TCGym / Booking schedule — project capture'},{src:'/media/tcgym-admin-metrics.png',es:'TCGym / Panel de métricas — captura del proyecto',en:'TCGym / Metrics dashboard — project capture'},{src:'/media/tcgym-admin-home.png',es:'TCGym / Inicio administrativo',en:'TCGym / Admin home'},{src:'/media/tcgym-admin-calendar.png',es:'TCGym / Calendario administrativo de turnos',en:'TCGym / Admin booking calendar'}],
  izipark:[{src:'/media/izipark-mobile.png',es:'Izipark / Captura durante el desarrollo',en:'Izipark / Capture during development'}],
  facility:[{src:'/media/facility-public.png',es:'Facility Management / Acceso público',en:'Facility Management / Public login'}],
  pediatric:[{src:'/media/pediatric-access.png',es:'Portal Pediatría / Acceso por perfiles',en:'Pediatric portal / Role-based entry'},{src:'/media/pediatric-dashboard.png',es:'Portal Pediatría / Panel del consultorio',en:'Pediatric portal / Practice dashboard'},{src:'/media/pediatric-new-patient.png',es:'Portal Pediatría / Alta de paciente: formulario vacío',en:'Pediatric portal / Patient registration: empty form'},{src:'/media/pediatric-agenda-demo.png',es:'Portal Pediatría / Agenda con datos de demostración',en:'Pediatric portal / Schedule with demonstration data'}],
};
export function mountGallery(getLanguage:()=>Language){
 const modal=document.querySelector<HTMLDialogElement>('#gallery-modal')!;
 const initial=modal.querySelector<HTMLImageElement>('#gallery-image')!;
 const stage=document.createElement('div');stage.className='gallery-stage';initial.replaceWith(stage);stage.append(initial);
 const rail=document.createElement('div');rail.className='gallery-filmstrip';rail.setAttribute('aria-label','Capturas / Screenshots');modal.querySelector('.gallery-bottom')!.before(rail);
 const counter=document.createElement('span');counter.className='gallery-counter';modal.querySelector('.gallery-top')!.prepend(counter);
 const caption=modal.querySelector<HTMLElement>('#gallery-caption')!;caption.setAttribute('role','status');caption.setAttribute('aria-live','polite');
 const previous=modal.querySelector<HTMLButtonElement>('.gallery-prev')!,next=modal.querySelector<HTMLButtonElement>('.gallery-next')!;
 let group:keyof typeof groups='tcgym',index=0,sequence=0,returnFocus:HTMLElement|null=null,closing=false;
 const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&localStorage.getItem('tc-motion')!=='off';
 const animate=(el:Element,frames:Keyframe[],duration:number)=>{if(!motion())return Promise.resolve();return el.animate(frames,{duration,easing:'cubic-bezier(.22,.7,.2,1)',fill:'none'}).finished.catch(()=>{});};
 function labels(){const items=groups[group],lang=getLanguage();caption.textContent=items[index][lang];counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;rail.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.setAttribute('aria-label',items[i][lang]);});stage.querySelector('img:last-child')?.setAttribute('alt',items[index][lang]);}
 function filmstrip(){rail.replaceChildren();groups[group].forEach((item,i)=>{const button=document.createElement('button');button.type='button';const img=document.createElement('img');img.src=item.src;img.alt='';img.loading='lazy';button.append(img);button.addEventListener('click',()=>void show(i,i>index?1:-1));rail.append(button);});rail.hidden=groups[group].length<2;}
 async function show(request:number,direction=1){
  const ticket=++sequence,items=groups[group],wanted=(request+items.length)%items.length;
  if(wanted===index&&stage.querySelector('img')?.getAttribute('src')===items[wanted].src)return;
  stage.setAttribute('aria-busy','true');const image=new Image();image.alt=items[wanted][getLanguage()];image.src=items[wanted].src;image.draggable=false;
  try{await image.decode();}catch{if(ticket===sequence){stage.removeAttribute('aria-busy');caption.textContent=getLanguage()==='es'?'No pudimos cargar la captura. Probá otra imagen.':'Could not load this screenshot. Try another image.';}return;}
  if(ticket!==sequence||!modal.open||closing)return;
  const old=[...stage.querySelectorAll('img')];index=wanted;stage.append(image);labels();stage.removeAttribute('aria-busy');
  old.forEach(el=>{el.setAttribute('aria-hidden','true');el.removeAttribute('id');});image.id='gallery-image';
  await Promise.all([animate(image,[{opacity:0,transform:`translateX(${direction*24}px) scale(.985)`},{opacity:1,transform:'translateX(0) scale(1)'}],420),...old.map(el=>animate(el,[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${-direction*16}px)`}],300))]);
  old.forEach(el=>el.remove());
  if(ticket===sequence){const adjacent=new Image();adjacent.src=items[(index+1)%items.length].src;}
 }
 async function close(){if(closing||!modal.open)return;closing=true;++sequence;await animate(modal,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(12px) scale(.985)'}],200);modal.close();closing=false;}
 document.querySelectorAll<HTMLButtonElement>('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{
  group=button.dataset.gallery! in groups?button.dataset.gallery as keyof typeof groups:'tcgym';const key=button.dataset.gallery!;const requested=button.dataset.galleryIndex!==undefined?Number(button.dataset.galleryIndex):/^\d+$/.test(key)?Number(key):0;
  returnFocus=button;closing=false;stage.replaceChildren();index=-1;modal.dataset.gallery=group;modal.querySelector('#gallery-title')!.textContent=group==='tcgym'?'TCGYM / PRODUCT GALLERY':group==='izipark'?'IZIPARK / IN DEVELOPMENT':group==='facility'?'FACILITY MANAGEMENT':'PORTAL PEDIATRÍA';previous.disabled=next.disabled=groups[group].length===1;filmstrip();modal.showModal();document.body.style.overflow='hidden';void animate(modal,[{opacity:0,transform:'translateY(22px) scale(.975)'},{opacity:1,transform:'translateY(0) scale(1)'}],380);void show(Number.isInteger(requested)?requested:0);
 }));
 modal.querySelector('.gallery-close')!.addEventListener('click',()=>void close());previous.addEventListener('click',()=>void show(index-1,-1));next.addEventListener('click',()=>void show(index+1,1));
 modal.addEventListener('cancel',event=>{event.preventDefault();void close();});
 modal.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();void show(index+1,1);}if(event.key==='ArrowLeft'){event.preventDefault();void show(index-1,-1);}});
 modal.addEventListener('click',event=>{if(event.target===modal)void close();});
 let startX=0,startY=0;stage.addEventListener('pointerdown',event=>{startX=event.clientX;startY=event.clientY;});stage.addEventListener('pointerup',event=>{const dx=event.clientX-startX;if(event.pointerType==='touch'&&Math.abs(dx)>60&&Math.abs(event.clientY-startY)<60&&groups[group].length>1)void show(index+(dx<0?1:-1),dx<0?1:-1);});
 modal.addEventListener('close',()=>{++sequence;document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':'';returnFocus?.focus({preventScroll:true});});
 document.addEventListener('tc-language-change',()=>{if(modal.open&&index>=0)labels();});
}
