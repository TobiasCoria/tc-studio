import axe from 'axe-core';
export async function audit(){
  await document.fonts.ready;
  const results=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
  const box=document.createElement('details');box.id='a11y-results';box.open=true;
  const summary=document.createElement('summary');summary.textContent=`LOCAL ACCESSIBILITY CHECK — ${results.violations.length} violations`;
  const pre=document.createElement('pre');pre.textContent=JSON.stringify({violations:results.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:results.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:results.passes.length},null,2);
  box.append(summary,pre);document.body.append(box);
}
