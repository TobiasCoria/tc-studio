// Measurement adapter only: no provider, storage, cookies or network requests.
export function mountCommercial(){
 const en=()=>document.documentElement.lang==='en';
 const preview=document.querySelector<HTMLElement>('#draft-preview');
 const whatsapp=document.querySelector<HTMLAnchorElement>('#draft-whatsapp');
 const copy=document.querySelector<HTMLButtonElement>('#draft-copy');
 const status=document.querySelector<HTMLElement>('#draft-copy-status');
 const sync=()=>{if(whatsapp&&preview?.textContent)whatsapp.href='https://wa.me/5492473476761?text='+encodeURIComponent(preview.textContent);else whatsapp?.removeAttribute('href');if(status)status.textContent='';};
 if(preview)new MutationObserver(sync).observe(preview,{childList:true,characterData:true,subtree:true});
 copy?.addEventListener('click',async()=>{if(!preview?.textContent||!status)return;try{await navigator.clipboard.writeText(preview.textContent);status.textContent=en()?'Inquiry copied. Ready to paste.':'Consulta copiada. Lista para pegar.';}catch{status.textContent=en()?'Select and copy the preview below.':'Seleccioná y copiá el texto de la consulta.';}});
 const emit=(name:string,target:string)=>document.dispatchEvent(new CustomEvent('tc-conversion',{detail:{name,target}}));
 document.addEventListener('click',event=>{
  const el=(event.target as Element).closest<HTMLElement>('a,button');if(!el)return;
  const href=el.getAttribute('href')||'';
  if(el.id==='draft-copy')emit('contact_click','copy_inquiry');
  else if(el.id==='draft-email')emit('contact_click','email_draft');
  else if(href.startsWith('https://wa.me/'))emit('contact_click','whatsapp');
  else if(href.startsWith('mailto:'))emit('contact_click','email');
  else if(href.startsWith('/proyectos/'))emit('case_open',href.split('/')[2]||'unknown');
  else if(el.dataset.gallery)emit('gallery_open',['tcgym','pediatric','facility','izipark'].includes(el.dataset.gallery)?el.dataset.gallery:'tcgym');
 });
 const panel=document.querySelector<HTMLElement>('#draft-panel');
 if(panel)new MutationObserver(()=>{if(!panel.hidden)emit('inquiry_prepared','contact_form');}).observe(panel,{attributes:true,attributeFilter:['hidden']});
 // A walkthrough is explicitly a sequence of screenshots, never a live operation.
 const tour=document.querySelector<HTMLElement>('.case-tour');if(!tour)return;
 const image=tour.querySelector<HTMLImageElement>('#tour-image')!,caption=tour.querySelector<HTMLElement>('#tour-caption')!,play=tour.querySelector<HTMLButtonElement>('.tour-play')!;
 const steps=[...tour.querySelectorAll<HTMLButtonElement>('[data-tour-src]')];
 let current=0,ticket=0,timer:ReturnType<typeof setInterval>|undefined;
 const stop=()=>{clearInterval(timer);timer=undefined;play.setAttribute('aria-pressed','false');play.textContent=en()?'Play walkthrough':'Reproducir recorrido';};
 const show=async(index:number)=>{const version=++ticket,step=steps[index],img=new Image();img.src=step.dataset.tourSrc!;try{await img.decode();}catch{stop();return;}if(ticket!==version)return;current=index;image.src=img.src;image.alt=(en()?step.dataset.tourEn:step.dataset.tourEs)!;caption.textContent=image.alt;steps.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));if(document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)image.animate([{opacity:.25,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:450,easing:'ease-out'});};
 steps.forEach((step,i)=>step.addEventListener('click',()=>{stop();void show(i);}));
 play.addEventListener('click',()=>{if(timer){stop();return;}if(document.documentElement.dataset.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;play.setAttribute('aria-pressed','true');play.textContent=en()?'Pause walkthrough':'Pausar recorrido';timer=setInterval(()=>void show((current+1)%steps.length),3500);});
 document.addEventListener('tc-language-change',()=>{stop();void show(current);});
 const syncMotion=()=>{stop();play.disabled=document.documentElement.dataset.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches;};syncMotion();
 document.addEventListener('tc-motion-change',syncMotion);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
}
