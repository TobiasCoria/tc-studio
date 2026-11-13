// Small, independent enhancements. Camera transforms remain owned by GSAP.
export function mountPremium(){
 const root=document.documentElement;
 const ambient=document.createElement('div');ambient.className='ambient-light';ambient.setAttribute('aria-hidden','true');document.body.append(ambient);
 const enabled=()=>root.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(pointer:fine) and (min-width:900px)');
 const brand=document.querySelector<HTMLElement>('.hero-wordmark');
 brand?.setAttribute('aria-label',document.documentElement.lang==='en'?'TC/STUDIO — Software, web applications and Odoo':'TC/STUDIO — Software, aplicaciones web y Odoo');
 document.addEventListener('tc-language-change',()=>brand?.setAttribute('aria-label',root.lang==='en'?'TC/STUDIO — Software, web applications and Odoo':'TC/STUDIO — Software, aplicaciones web y Odoo'));
 let frame=0,px=50,py=45,lx=65,ly=35;
 const schedule=()=>{if(!frame&&enabled()&&fine.matches)frame=requestAnimationFrame(paint);};
 const paint=()=>{frame=0;if(!enabled()||!fine.matches)return;lx+=(px-lx)*.12;ly+=(py-ly)*.12;root.style.setProperty('--light-x',`${lx}%`);root.style.setProperty('--light-y',`${ly}%`);if(Math.abs(px-lx)+Math.abs(py-ly)>.1)schedule();};
 document.addEventListener('pointermove',event=>{px=event.clientX/innerWidth*100;py=event.clientY/innerHeight*100;schedule();},{passive:true});
 brand?.addEventListener('pointermove',event=>{if(!enabled()||!fine.matches)return;const r=brand.getBoundingClientRect();brand.style.setProperty('--metal-x',`${(event.clientX-r.left)/r.width*100}%`);});
 // Each project lends its own restrained temperature to the ambient light.
 const sections=[...document.querySelectorAll<HTMLElement>('.project-scene')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){root.dataset.ambient=String(sections.indexOf(entry.target as HTMLElement));}}),{rootMargin:'-25% 0px -25%',threshold:0});
 sections.forEach(section=>observer.observe(section));
 document.querySelectorAll<HTMLElement>('.scene-art').forEach(art=>{
  art.addEventListener('pointermove',event=>{if(!enabled()||!fine.matches)return;const r=art.getBoundingClientRect();art.style.setProperty('--edge-x',`${(event.clientX-r.left)/r.width*100}%`);art.style.setProperty('--edge-y',`${(event.clientY-r.top)/r.height*100}%`);},{passive:true});
 });
 const steps=[...document.querySelectorAll<HTMLElement>('.process-timeline article')];
 const stepObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('step-lit',entry.isIntersecting)),{rootMargin:'-15% 0px -22%',threshold:.2});
 steps.forEach(step=>stepObserver.observe(step));
 const menu=document.querySelector<HTMLElement>('.chapter-index');
 if(menu){
  const preview=document.createElement('aside');preview.className='index-preview';preview.setAttribute('aria-hidden','true');
  const visual=document.createElement('div');visual.className='index-preview-visual';
  const signature=document.createElement('span');signature.className='index-signature';signature.textContent='/';
  const image=document.createElement('img');image.alt='';image.hidden=true;image.decoding='async';visual.append(signature,image);
  const kicker=document.createElement('small');kicker.className='index-preview-kicker';
  const copy=document.createElement('strong');copy.className='index-preview-title';
  const detail=document.createElement('p');detail.className='index-preview-detail';
  preview.append(visual,kicker,copy,detail);menu.querySelector('.index-columns')?.before(preview);
  const assets:Record<string,string>={izipark:'/media/izipark-mobile.png',pediatria:'/media/pediatric-dashboard.png',facility:'/media/facility-public.png',tcgym:'/media/tcgym-admin-metrics.png',enaccion:'/media/tcgym-turnos.jpg'};
  const descriptions:Record<string,[string,string]>={
   izipark:['Producto móvil de estacionamiento. Actualmente en desarrollo.','A mobile parking product. Currently in development.'],
   pediatria:['Una mirada al portal, la agenda y el espacio de trabajo del consultorio.','Explore the portal, calendar and practice workspace.'],
   facility:['Desarrollo sobre Odoo para operaciones de negocio.','Odoo development for business operations.'],
   tcgym:['Del acceso del socio a la administración del gimnasio.','From member access to gym administration.'],
   contacto:['Empecemos por el desafío de tu próximo proyecto.','Let’s start with the challenge behind your next project.'],
   capacidades:['Software, Odoo y colaboración con equipos.','Software, Odoo and collaboration with teams.'],
   proceso:['Del primer mensaje a una entrega validada.','From the first conversation to a validated delivery.']
  };
  let selected:HTMLAnchorElement|undefined,transition:Animation|undefined;
  const render=(link?:HTMLAnchorElement)=>{
   const en=root.lang==='en',key=link?.dataset.section||'';const src=assets[key];
   image.hidden=!src;signature.hidden=!!src;if(src&&image.getAttribute('src')!==src)image.src=src;
   kicker.textContent=link?`${link.querySelector('.index-number')?.textContent||''} / ${en?'EXPLORE THE STUDIO':'EXPLORÁ EL ESTUDIO'}`:'TC/STUDIO / INDEX';
   copy.textContent=link?.textContent?.replace('↗','').replace(/^\s*\d+\s*/,'').trim()||(en?'Every detail. Connected.':'Cada detalle. Conectado.');
   detail.textContent=descriptions[key]?.[en?1:0]||(en?'Explore the work, approach and ways to build together.':'Explorá los proyectos, la mirada y las formas de construir juntos.');
   transition?.cancel();if(enabled())transition=preview.animate([{opacity:.55,translate:'0 5px'},{opacity:1,translate:'0 0'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
  };
  const show=(link:HTMLAnchorElement)=>{selected=link;menu.querySelectorAll('a[data-preview]').forEach(a=>a.removeAttribute('data-preview'));link.setAttribute('data-preview','true');render(link);};
  menu.querySelectorAll<HTMLAnchorElement>('a[data-section]').forEach(link=>{link.addEventListener('pointerenter',()=>show(link));link.addEventListener('focus',()=>show(link));});
  const reset=()=>{selected=undefined;menu.querySelectorAll('a[data-preview]').forEach(a=>a.removeAttribute('data-preview'));render();};
  menu.addEventListener('toggle',()=>{if((menu as HTMLDialogElement).open)reset();});
  document.addEventListener('tc-language-change',()=>render(selected));reset();
 }
 const form=document.querySelector<HTMLFormElement>('#contact-form');
 form?.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea').forEach(input=>{
  const field=input.closest<HTMLElement>('.form-field');if(!field)return;
  const feedback=document.createElement('small');feedback.className='field-feedback';feedback.id=`${input.id}-feedback`;feedback.setAttribute('aria-live','polite');field.append(feedback);
  input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),feedback.id].filter(Boolean).join(' '));
  let touched=false;
  const update=()=>{field.classList.toggle('has-value',!!input.value.trim());const invalid=touched&&!input.validity.valid;field.classList.toggle('field-invalid',invalid);input.setAttribute('aria-invalid',String(invalid));const en=root.lang==='en';feedback.textContent=invalid?(input.validity.typeMismatch?(en?'Enter a valid email address.':'Ingresá un email válido.'):(input.validity.valueMissing?(en?'Please complete this field.':'Completá este campo.'):(input.validity.tooShort?(en?`Use at least ${input.minLength} characters.`:`Usá al menos ${input.minLength} caracteres.`):(en?'Check this value.':'Revisá este dato.')))):(touched&&input.value.trim()?(en?'Ready':'Listo'):'');};
  input.addEventListener('blur',()=>{touched=true;update();});input.addEventListener('input',update);input.addEventListener('invalid',()=>{touched=true;update();});document.addEventListener('tc-language-change',update);update();
 });
 document.addEventListener('tc-motion-change',()=>{if(!enabled()){cancelAnimationFrame(frame);frame=0;document.getAnimations().forEach(animation=>animation.cancel());root.style.removeProperty('--light-x');root.style.removeProperty('--light-y');}});
}
