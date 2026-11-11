const closing=new WeakSet<HTMLDialogElement>();
const enabled=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&document.documentElement.dataset.motion!=='off';
export function openPanel(dialog:HTMLDialogElement){
 dialog.showModal();
 if(enabled())dialog.animate([{opacity:0,transform:'translateY(16px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:440,easing:'cubic-bezier(.25,.8,.25,1)'});
}
export async function closePanel(dialog:HTMLDialogElement){
 if(!dialog.open||closing.has(dialog))return;closing.add(dialog);
 if(enabled())await dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(8px)'}],{duration:220,easing:'cubic-bezier(.4,0,.6,1)'}).finished.catch(()=>{});
 dialog.close();closing.delete(dialog);
}
