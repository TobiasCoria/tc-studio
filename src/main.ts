import {mountExperience} from './experience';
import {mountNavigation,takeNavigationIntent} from './navigation';
import {mountDisclosures,playIntro} from './interactions';
import './styles.css';
import './backgrounds.css';
import './navigation.css';
import './gallery.css';
import './motion-polish.css';
import './contact-refined.css';
import './service-picker.css';
import './premium.css';
import './quality.css';
import './contact-route.css';
import './light-orbit.css';
import {mountLightOrbits} from './light-orbit';
import {mountContactRoute} from './contact-route';
import {mountCommercial} from './commercial';
import {mountPremium} from './premium';
import {mountServicePicker} from './service-picker';
import {openPanel,closePanel} from './panels';
import {prepareInquiry} from './inquiry.mjs';
import {mountGallery} from './gallery';
import {createIcons,ArrowUpRight,ArrowDownRight,Layers,Monitor} from 'lucide';
const renderIcons=()=>createIcons({icons:{ArrowUpRight,ArrowDownRight,Layers,Monitor},attrs:{'aria-hidden':'true',focusable:'false','stroke-width':1.5}});
renderIcons();
const syncPixelDensity=()=>document.documentElement.style.setProperty('--pixel-ratio',String(Math.max(1,devicePixelRatio||1)));
syncPixelDensity();window.addEventListener('resize',syncPixelDensity,{passive:true});
// Every fresh visit/reload starts at the opening. In-page anchors still work normally.
const navigationIntent=takeNavigationIntent();
history.scrollRestoration='manual';
const startAtTop=()=>{
 history.replaceState(history.state,'',location.pathname+location.search);
 window.scrollTo({top:0,left:0,behavior:'auto'});
};
startAtTop();
if(!navigationIntent)window.addEventListener('load',()=>requestAnimationFrame(startAtTop),{once:true});
type Language='es'|'en';
let language:Language='es';
const caseNames:Record<string,string>={tcgym:'TCGym',pediatria:'Portal Pediatría',facility:'Facility Management'};
mountContactRoute();
const translated=[...document.querySelectorAll<HTMLElement>('[data-en]')].map(el=>({el,es:el.innerHTML,en:el.dataset.en!}));
const languageButton=document.querySelector<HTMLButtonElement>('.language')!;
const form=document.querySelector<HTMLFormElement>('#contact-form')!;
const panel=document.querySelector<HTMLElement>('#draft-panel')!;
const status=document.querySelector<HTMLElement>('.form-status')!;
const preview=document.querySelector<HTMLElement>('#draft-preview')!;
const emailLink=document.querySelector<HTMLAnchorElement>('#draft-email')!;
form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled=false;
document.documentElement.dataset.enhanced='true';
function invalidateDraft(){panel.hidden=true;preview.textContent='';emailLink.removeAttribute('href');status.textContent='';}
function translate(next:Language){language=next;document.documentElement.lang=language;
  // Both variants are trusted, static author content. User input is rendered only with textContent.
  translated.forEach(({el,es,en})=>el.innerHTML=language==='es'?es:en);
  languageButton.textContent=language==='es'?'EN':'ES';languageButton.setAttribute('aria-label',language==='es'?'EN — Switch to English':'ES — Cambiar a español');
  renderIcons();
  document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-placeholder-es]').forEach(el=>el.placeholder=(language==='es'?el.dataset.placeholderEs:el.dataset.placeholderEn)!);
  document.querySelectorAll('.case-close').forEach(el=>el.setAttribute('aria-label',language==='es'?'Cerrar proyecto':'Close project'));
  const copyStatus=document.querySelector<HTMLElement>('.copy-status');if(copyStatus)copyStatus.textContent='';
  document.querySelectorAll<HTMLAnchorElement>('.cv-link').forEach(el=>el.href=`/Tobias_Coria_Software_${language.toUpperCase()}.pdf`);
  document.querySelector('.menu-toggle')?.setAttribute('aria-label',language==='es'?'Abrir índice de secciones':'Open section index');
  document.querySelector('.menu-close')?.setAttribute('aria-label',language==='es'?'Cerrar índice':'Close index');
  document.querySelector('.gallery-close')?.setAttribute('aria-label',language==='es'?'Cerrar galería':'Close gallery');
  document.querySelector('.gallery-prev')?.setAttribute('aria-label',language==='es'?'Imagen anterior':'Previous image');
  document.querySelector('.gallery-next')?.setAttribute('aria-label',language==='es'?'Imagen siguiente':'Next image');
  document.querySelector('.site-nav>nav')?.setAttribute('aria-label',language==='es'?'Principal':'Main');

  document.querySelector('.site-nav .wordmark')?.setAttribute('aria-label',language==='es'?'TC Studio inicio':'TC Studio home');
  if(document.body.dataset.page==='home')document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content=language==='es'?'TC/STUDIO. Software a medida, aplicaciones web, Odoo y sistemas empresariales. Desarrollo con dirección, desde Rosario para equipos y negocios.':'TC/STUDIO. Custom software, web applications, Odoo and business systems. Development with direction, from Rosario for teams and businesses.';
  invalidateDraft();const ideaContext=form.querySelector<HTMLElement>('#idea-context');if(ideaContext)ideaContext.hidden=true;updateMotionButton();document.dispatchEvent(new Event('tc-language-change'));
  const query=new URLSearchParams(location.search);if(language==='en')query.set('lang','en');else query.delete('lang');
  history.replaceState(null,'',`${location.pathname}${query.size?'?'+query.toString():''}${location.hash}`);
  document.title=document.body.dataset.page==='home'?(language==='es'?'TC/STUDIO — Ideas reales. Sistemas vivos.':'TC/STUDIO — Real ideas. Living systems.'):`${caseNames[document.body.dataset.page||'']||'TC/STUDIO'} — ${language==='es'?'Caso de desarrollo':'Development case study'} / TC STUDIO`;
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link=>{if(link.origin===location.origin&&(link.pathname==='/'||link.pathname.startsWith('/proyectos/'))){const url=new URL(link.href);if(language==='en')url.searchParams.set('lang','en');else url.searchParams.delete('lang');link.href=url.pathname+url.search+url.hash;}});
}
languageButton.addEventListener('click',()=>translate(language==='es'?'en':'es'));
form.addEventListener('input',invalidateDraft);form.addEventListener('change',invalidateDraft);
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form),service=form.querySelector<HTMLSelectElement>('#service')!;
  try{const draft=prepareInquiry({name:data.get('name'),email:data.get('email'),company:data.get('company'),timeline:data.get('timeline'),message:data.get('message'),service:service.selectedOptions[0].textContent},language);
    preview.textContent=`${language==='es'?'Asunto':'Subject'}: ${draft.subject}\n\n${draft.body}`;emailLink.href=draft.href;panel.hidden=false;status.textContent=language==='es'?'Consulta preparada. Todavía no se envió ningún correo.':'Inquiry prepared. No email has been sent.';
  }catch{status.textContent=language==='es'?'Revisá los datos. El mensaje debe tener entre 20 y 2.500 caracteres.':'Check your details. The message must contain 20 to 2,500 characters.';}
});
const menu=document.querySelector<HTMLDialogElement>('#mobile-menu')!;
const menuToggle=document.querySelector<HTMLButtonElement>('.menu-toggle')!;
function closeMenu(){void closePanel(menu);}
menuToggle.addEventListener('click',()=>{openPanel(menu);menuToggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';});
menu.querySelector('.menu-close')?.addEventListener('click',closeMenu);
menu.addEventListener('cancel',event=>{event.preventDefault();closeMenu();});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
menu.addEventListener('close',()=>{menuToggle.setAttribute('aria-expanded','false');document.body.style.overflow='';menuToggle.focus({preventScroll:true});});

mountGallery(()=>language);
mountNavigation();

const reduced=matchMedia('(prefers-reduced-motion: reduce)');const desktop=matchMedia('(min-width: 900px) and (pointer:fine)');
const motionButton=document.querySelector<HTMLButtonElement>('.motion-control')!;
let paused=false;try{paused=localStorage.getItem('tc-motion')==='off';}catch{}
if(import.meta.env.DEV&&new URLSearchParams(location.search).get('a11y')==='1')paused=true;
let disposeMotion:(()=>void)|undefined;let motionVersion=0;
function updateMotionButton(){const off=reduced.matches||paused;document.documentElement.dataset.motion=off?'off':'on';motionButton.setAttribute('aria-pressed',String(off));motionButton.setAttribute('aria-label',language==='es'?(off?'Activar movimiento':'Pausar movimiento'):(off?'Enable motion':'Pause motion'));motionButton.querySelector('.motion-icon')!.textContent=off?'▶':'Ⅱ';motionButton.querySelector('.motion-label')!.textContent=language==='es'?(off?'Activar movimiento':'Pausar movimiento'):(off?'Enable motion':'Pause motion');motionButton.disabled=reduced.matches;document.dispatchEvent(new Event('tc-motion-change'));if(reduced.matches)motionButton.setAttribute('aria-label',language==='es'?'Movimiento reducido por preferencia del sistema':'Reduced motion follows your system preference');}
async function applyMotion(){const version=++motionVersion;disposeMotion?.();disposeMotion=undefined;updateMotionButton();if(reduced.matches||paused)return;
  try{const {mountMotion}=await import('./motion-green');if(version!==motionVersion)return;disposeMotion=mountMotion();}catch{/* Static content remains available if an enhancement fails. */}

}
motionButton.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('tc-motion',paused?'off':'on');}catch{}void applyMotion();});reduced.addEventListener('change',()=>void applyMotion());desktop.addEventListener('change',()=>void applyMotion());
mountDisclosures();
const introReady=playIntro(()=>reduced.matches||paused,applyMotion);
const progress=document.querySelector<HTMLElement>('.reading-progress')!;let scheduled=false;
const updateProgress=()=>{const total=document.documentElement.scrollHeight-innerHeight;const fraction=total>0?scrollY/total:0;progress.style.transform=`scaleX(${fraction})`;
 const thread=document.querySelector<HTMLElement>('.story-thread');
 if(thread){thread.style.setProperty('--thread-progress',String(fraction));let phase=0;['.sequence-bridge','#enaccion','#contacto'].forEach((selector,index)=>{const section=document.querySelector(selector);if(section&&section.getBoundingClientRect().top<=innerHeight*.55)phase=index+1;});thread.querySelectorAll('b').forEach((label,index)=>label.toggleAttribute('data-current',index===phase));}
 scheduled=false;};
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});updateProgress();
if(new URLSearchParams(location.search).get('lang')==='en')translate('en');
void introReady.then(()=>requestAnimationFrame(()=>{const target=navigationIntent?document.getElementById(navigationIntent):null;if(target){window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-110),behavior:'instant'});history.replaceState(history.state,'',location.pathname+location.search+'#'+navigationIntent);}else startAtTop();}));
window.addEventListener('pagehide',()=>{disposeMotion?.();});
window.addEventListener('pageshow',event=>{
 if(event.persisted){startAtTop();void applyMotion().then(()=>requestAnimationFrame(startAtTop));}
});
if(import.meta.env.DEV&&new URLSearchParams(location.search).get('a11y')==='1')void import('./audit').then(({audit})=>audit());

// Project notes use native dialogs for focus containment and Escape support.
document.querySelectorAll<HTMLButtonElement>('[data-case]').forEach(button=>{
 const dialog=document.getElementById(button.dataset.case!) as HTMLDialogElement;
 button.addEventListener('click',()=>{openPanel(dialog);document.body.style.overflow='hidden';});
 dialog.addEventListener('cancel',event=>{event.preventDefault();void closePanel(dialog);});
 dialog.querySelector('.case-close')?.addEventListener('click',()=>void closePanel(dialog));
 dialog.querySelector('[data-case-contact]')?.addEventListener('click',()=>void closePanel(dialog));
 dialog.addEventListener('close',()=>{document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':'';button.focus({preventScroll:true});});
});
const copyButton=document.querySelector<HTMLButtonElement>('.copy-email');
copyButton?.addEventListener('click',async()=>{
 const output=document.querySelector<HTMLElement>('.copy-status')!;
 try{await navigator.clipboard.writeText('tobicoria09@gmail.com');output.textContent=language==='es'?'Email copiado':'Email copied';}
 catch{output.textContent=language==='es'?'Podés seleccionar y copiar el email de arriba.':'You can select and copy the email above.';}
});

document.querySelectorAll<HTMLAnchorElement>('[data-idea-service]').forEach(link=>link.addEventListener('click',()=>{
 const title=(language==='es'?link.dataset.ideaEs:link.dataset.ideaEn)!;
 const service=form.querySelector<HTMLSelectElement>('#service')!;
 const message=form.querySelector<HTMLTextAreaElement>('#message')!;
 const context=form.querySelector<HTMLElement>('#idea-context')!;
 service.value=link.dataset.ideaService!;
 service.dispatchEvent(new Event('change',{bubbles:true}));
 const existing=!!message.value.trim();
 if(!existing)message.value=language==='es'?`Me interesa conversar sobre: ${title}.\n\nMi contexto y lo que necesito resolver: `:`I'd like to discuss: ${title}.\n\nMy context and what I need to solve: `;
 invalidateDraft();context.hidden=false;
 context.textContent=(language==='es'?'Idea seleccionada: ':'Selected idea: ')+title+(existing?(language==='es'?'. Conservamos el mensaje que ya escribiste.':'. Your existing message has been preserved.'):'');
}));

mountExperience(()=>language);
mountServicePicker(()=>language);

mountPremium();

mountCommercial();

mountLightOrbits();
