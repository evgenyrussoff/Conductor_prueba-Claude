/* v5.5.6 - Capa visual (anillos, gráfico, contadores, vibración). No modifica datos ni cálculos. */
(()=>{
const $=id=>document.getElementById(id),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const mins=t=>{const m=/(\d+):(\d{2})/.exec(t||'');return m?+m[1]*60+ +m[2]:0};
function ring(id,limit){const v=$(id);if(!v)return;const card=v.closest('article');if(!card)return;let r=card.querySelector('.ring');
if(!r){card.classList.add('has-ring');card.insertAdjacentHTML('beforeend','<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="rg-bg" cx="22" cy="22" r="18"/><circle class="rg-fg" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"/><text x="22" y="26" text-anchor="middle"></text></svg>');r=card.querySelector('.ring')}
const used=mins(v.textContent),pct=Math.min(1,used/limit),left=limit-used,fg=r.querySelector('.rg-fg');
fg.style.strokeDashoffset=113.1*(1-pct);fg.setAttribute('class','rg-fg '+(left<270?'bad':left<540?'warn':'ok'));r.querySelector('text').textContent=Math.round(pct*100)+'%'}
const rings=()=>{ring('tachWeekValue',3360);ring('tachBiValue',5400)};
const TT={es:'Km por periodo',en:'Km per period',fr:'Km par période',pt:'Km por período',it:'Km per periodo',de:'Km pro Periode',ro:'Km pe perioadă'};
function kmChart(){try{const wrap=document.querySelector('#statsScreen .stats-wrap'),anchor=$('consumptionHistoryBtn');if(!wrap||!anchor||typeof completedJourneys!=='function')return;
let box=$('kmChart');if(!box){box=document.createElement('div');box.id='kmChart';box.className='km-chart';wrap.insertBefore(box,anchor)}
const map=new Map();for(const j of completedJourneys()){const d=new Date(j.endDate||j.startDate);if(isNaN(d))continue;const p=monthPeriod(d),k=p.start.getTime(),o=map.get(k)||{s:p.start,km:0};o.km+=Number(j.kmDay)||0;map.set(k,o)}
const rows=[...map.values()].sort((a,b)=>a.s-b.s).slice(-6),lang=(window.I18N&&I18N.lang)||'es';
if(!rows.length){box.innerHTML='';box.style.display='none';return}
box.style.display='';const max=Math.max(...rows.map(r=>r.km),1);
box.innerHTML=`<h3>${TT[lang]||TT.es}</h3><div class="bars">`+rows.map((r,i)=>`<div class="bar"><span>${r.km.toLocaleString(lang)}</span><i style="--h:${Math.max(4,r.km/max*78)}%;--d:${i*70}ms"></i><small>${r.s.toLocaleDateString(lang,{month:'short'})}</small></div>`).join('')+'</div>'}catch(e){}}
function countUp(id){const el=$(id);if(!el||RM)return;const txt=el.textContent,m=/^([\d.,\u00a0\s]+)(.*)$/.exec(txt);if(!m)return;const n=+m[1].replace(/\D/g,'');if(!n)return;const lang=(window.I18N&&I18N.lang)||'es',t0=performance.now();
const step=t=>{const f=Math.min(1,(t-t0)/700),e=1-Math.pow(1-f,3);el.textContent=f<1?Math.round(n*e).toLocaleString(lang)+' '+m[2].trim():txt;if(f<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
function watch(id,fn){const s=$(id);if(!s)return;new MutationObserver(()=>{if(s.classList.contains('active'))fn()}).observe(s,{attributes:true,attributeFilter:['class']})}
watch('statsScreen',()=>{kmChart();['monthKm','totalKm','yearKm'].forEach(countUp)});
watch('tachScreen',rings);
['tachWeekValue','tachBiValue'].forEach(id=>{const e=$(id);if(e)new MutationObserver(rings).observe(e,{childList:true,characterData:true,subtree:true})});
rings();
document.addEventListener('click',e=>{if(navigator.vibrate&&e.target.closest('.main-action,.secondary-action,.icon-btn'))navigator.vibrate(10)},true);
})();
