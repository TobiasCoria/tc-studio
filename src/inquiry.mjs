export function prepareInquiry(input,language='es') {
  const name=String(input.name??'').trim();
  const email=String(input.email??'').trim();
  const company=String(input.company??'').trim();
  const message=String(input.message??'').trim();
  const timeline=String(input.timeline??'').trim();
  if(timeline.length>100||/[\r\n]/.test(timeline))throw new Error('invalid timeline');
  const service=String(input.service??'').trim();
  if(!name||name.length>100||email.length>200||company.length>150||/[\r\n]/.test(name+email+company)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<20||message.length>2500) throw new Error('invalid inquiry');
  const subject=`${language==='es'?'Proyecto':'Project'} / TC STUDIO — ${service}`;
  const body=language==='es'?`Hola Tobías,\n\nSoy ${name}${company?' de '+company:''}.\n\nConsulta: ${service}${timeline?'\nPlazo estimado: '+timeline:''}\n\n${message}\n\nMi email: ${email}\n\nSaludos,\n${name}`:`Hi Tobías,\n\nI'm ${name}${company?' from '+company:''}.\n\nInquiry: ${service}${timeline?'\nExpected timeline: '+timeline:''}\n\n${message}\n\nMy email: ${email}\n\nBest,\n${name}`;
  return {subject,body,href:`mailto:tobicoria09@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
}
