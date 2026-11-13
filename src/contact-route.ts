// Run before the translation registry so every added shortcut is bilingual.
export function mountContactRoute(){
 const target=document.body.dataset.page==='home'?'#contacto':'/#contacto';
 document.querySelectorAll<HTMLElement>('.work-intro,.more-work,.process').forEach(section=>{
  if(section.querySelector('a[href="#contacto"],a[href="/#contacto"]'))return;
  const link=document.createElement('a');link.href=target;link.className='contact-shortcut';
  const label=document.createElement('span');label.dataset.en='Contact us';label.textContent='Contactanos';
  const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(label,arrow);section.append(link);
 });
}
