import {chapters} from './chapters';
const intentKey='tc-navigation-intent';
export function takeNavigationIntent():string|null{
 try{const raw=sessionStorage.getItem(intentKey);sessionStorage.removeItem(intentKey);if(!raw)return null;const value=JSON.parse(raw);const reloaded=(performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined)?.type==='reload';return !reloaded&&value.path===location.pathname&&value.hash===location.hash&&Date.now()-value.at<15000&&chapters.some(ch=>'#'+ch.id===value.hash)?value.hash.slice(1):null;}catch{return null;}
}
export function mountNavigation(){
 const header=document.querySelector<HTMLElement>('.site-nav')!;
 const capsule=header.querySelector<HTMLElement>('.nav-capsule')!;
 const links=[...document.querySelectorAll<HTMLAnchorElement>('.chapter-nav a[data-section],.chapter-index a[data-section]')];
 const isHome=document.body.dataset.page==='home';
 const sections=chapters.map(ch=>document.getElementById(ch.id)).filter((el):el is HTMLElement=>!!el);
 let frame=0;
 const update=()=>{
  frame=0;header.classList.toggle('is-scrolled',scrollY>24);
  let current=isHome?'inicio':(document.body.dataset.page||'tcgym');
  if(isHome)for(const section of sections)if(section.getBoundingClientRect().top<=160)current=section.id;
  const chapter=chapters.find(ch=>ch.id===current)!;const en=document.documentElement.lang==='en';
  header.querySelector('.nav-location-name')!.textContent=`${String(chapters.indexOf(chapter)+1).padStart(2,'0')} / ${en?chapter.en:chapter.es}`;
  links.forEach(link=>{if(link.dataset.section===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  const group=chapter.group==='work'?'proyectos':current;
  const quick=[...capsule.querySelectorAll<HTMLAnchorElement>('a')].find(a=>a.dataset.section===group);
  capsule.classList.toggle('has-current',!!quick);
  if(quick){capsule.style.setProperty('--nav-x',`${quick.offsetLeft}px`);capsule.style.setProperty('--nav-width',`${quick.offsetWidth}px`);}
  header.querySelector('.nav-cta')?.classList.toggle('is-current',current==='contacto');
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('hashchange',schedule);
 document.addEventListener('tc-language-change',schedule);document.addEventListener('tc-layout-change',schedule);
 new ResizeObserver(schedule).observe(capsule);document.fonts.ready.then(schedule);update();
 document.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href);if(url.origin!==location.origin||url.pathname===location.pathname||!chapters.some(ch=>'#'+ch.id===url.hash))return;
  try{sessionStorage.setItem(intentKey,JSON.stringify({path:url.pathname,hash:url.hash,at:Date.now()}));}catch{}
 });
}
