/**
 * Duell-Fragenpool ohne React/DOM. Der bisherige Auswahlalgorithmus bleibt
 * absichtlich unverändert: Generator-Sichtung, Umwandlung in MC, Duplikate,
 * SVG-Darstellung, Ersatzfragen und Zufallsreihenfolge.
 */
export function createDuelQuestionPool({sections,adaptTask,shuffle,taskSignature,renderStaff,renderGrandStaff,fallbackQuestions}) {
  const Et=sections,Qt=adaptTask,D=shuffle,Tt=taskSignature,Lt=renderStaff,Rt=renderGrandStaff,Jt=fallbackQuestions;
  function $t(e,t){let n=[];Et.forEach(e=>{e.id!==`gehoer`&&e.gens.forEach(t=>{let r=!1;for(let e=0;e<5&&!r;e++)try{r=!!Qt(t,t(`mixed`))}catch{}r&&n.push({secId:e.id,gen:t})})});let r=n.filter(e=>t===`all`||e.secId===t),i=[],a=new Set,o=[],s=0;for(;i.length<e&&r.length>0&&s<e*60;){o.length||(o=D(r));let e=o.pop();s++;let t=null;try{t=Qt(e.gen,e.gen(`mixed`))}catch{}if(!t)continue;let n=``;try{n=Tt(t)}catch{n=t.q+`|`+(t.options?t.options.join(`|`):``)}if(a.has(n))continue;a.add(n);let c=``;try{t.staff&&(c=t.staff.chords?Rt(t.staff):Lt(t.staff))}catch{continue}i.push({prompt:t.q,options:(t.options||[]).slice(),correct:t.correct??0,explanation:t.explanation||``,svgHtml:c})}if(i.length<e){let t=e-i.length,n=D(Jt);for(let e=0;e<Math.min(t,n.length);e++){let t=n[e];i.push({prompt:t[0],options:t[1],correct:t[2],explanation:t[3],svgHtml:``})}}return D(i)}
  return $t;
}
