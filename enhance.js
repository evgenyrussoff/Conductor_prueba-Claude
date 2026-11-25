/* V5.6.1 - Detalles visuales inspirados en Claude. Solo lectura; no modifica datos. */
(()=>{
 const $=id=>document.getElementById(id), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const parseMins=t=>{const m=/(\d+):(\d{2})/.exec(t||'');return m?+m[1]*60+ +m[2]:0};
 function setRing(svg,pct,level){
   const fg=svg.querySelector('.rg-fg'),label=svg.querySelector('text');
   const c=113.1; fg.style.strokeDashoffset=String(c*(1-Math.max(0,Math.min(1,pct))));
   fg.setAttribute('class','rg-fg '+level);label.textContent=Math.round(Math.max(0,Math.min(1,pct))*100)+'%';
 }
 function ensureRing(card,cls='ring'){
   let svg=card.querySelector('.'+cls);
   if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 44 44');svg.setAttribute('aria-hidden','true');svg.setAttribute('class',cls);
     svg.innerHTML='<circle class="rg-bg" cx="22" cy="22" r="18"></circle><circle class="rg-fg" cx="22" cy="22" r="18" stroke-dasharray="113.1" stroke-dashoffset="113.1"></circle><text x="22" y="26" text-anchor="middle"></text>';card.appendChild(svg);}
   return svg;
 }
 function tachRings(){
   [['tachWeekValue',3360],['tachBiValue',5400]].forEach(([id,limit])=>{
     const v=$(id),card=v?.closest('article');if(!v||!card)return;
     const used=parseMins(v.textContent),remaining=Math.max(0,limit-used),pct=remaining/limit;
     card.classList.add('has-ring');const svg=ensureRing(card);
     setRing(svg,pct,remaining<270?'bad':remaining<540?'warn':'ok');
   });
 }
 function homeJourneyRing(){
   const card=document.querySelector('#home .status-card');if(!card)return;
   const data=window.getNoriegaJourneyVisualData?.();
   let wrap=$('homeAvailability');
   if(!data){if(wrap)wrap.remove();card.classList.remove('has-home-ring');return;}
   if(!wrap){wrap=document.createElement('div');wrap.id='homeAvailability';wrap.className='home-availability';wrap.innerHTML='<div class="home-ring"></div><div class="home-availability-copy"><small>Disponibilidad de jornada</small><strong></strong><span></span></div>';card.appendChild(wrap);}
   const elapsed=Math.max(0,(Date.now()-new Date(data.startDate))/60000),left=Math.max(0,data.limitMin-elapsed),pct=left/data.limitMin;
   const ring=ensureRing(wrap.querySelector('.home-ring'),'home-ring-svg');
   setRing(ring,pct,left<60?'bad':left<180?'warn':'ok');
   wrap.querySelector('strong').textContent=`${Math.floor(left/60)} h ${String(Math.floor(left%60)).padStart(2,'0')} min`;
   wrap.querySelector('span').textContent=`Límite ${data.limitMin===900?'15':'13'} h`;
   card.classList.add('has-home-ring');
 }
 function refresh(){tachRings();homeJourneyRing();}
 function animateStats(){
   const screen=$('statsScreen');if(!screen?.classList.contains('active'))return;
   ['monthKm','totalKm','yearKm'].forEach(id=>{const el=$(id);if(!el||el.dataset.counted)return;el.dataset.counted='1';});
 }
 refresh();setInterval(refresh,1000);
 const tach=$('tachScreen');if(tach)new MutationObserver(refresh).observe(tach,{attributes:true,attributeFilter:['class']});
 ['tachWeekValue','tachBiValue'].forEach(id=>{const el=$(id);if(el)new MutationObserver(refresh).observe(el,{childList:true,characterData:true,subtree:true});});
 const stats=$('statsScreen');if(stats)new MutationObserver(animateStats).observe(stats,{attributes:true,attributeFilter:['class']});
 document.addEventListener('click',e=>{if(navigator.vibrate&&e.target.closest('.main-action,.secondary-action,.icon-btn')){try{navigator.vibrate(10)}catch(_){}}},true);
})();