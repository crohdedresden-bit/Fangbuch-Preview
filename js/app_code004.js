(()=>{
const img=document.getElementById('screenImage');
const overlay=document.getElementById('overlay');
const dayStoreKey='fangbuch-code003-designlock-days';
const catchStoreKey='fangbuch-code004-catches';
let days=JSON.parse(localStorage.getItem(dayStoreKey)||'[]');
let catches=JSON.parse(localStorage.getItem(catchStoreKey)||'[]');
let currentId=null;
let currentCatchId=null;
let editDayMode=false;
let curves=[];

const assets={
 splash:'assets/code004_00_splash.png',
 home:'assets/code004_01_home.png',
 newDay:'assets/code004_02_new_day.png',
 catch:'assets/code004_03_catch.png',
 detail:'assets/code004_04_day_detail.png',
 season:'assets/code004_05_season.png',
 report:'assets/code004_06_report.png'
};

const fishCatalog=[
['A','Aal',50,null,null,'aal'],['Ad','Aland',20,null,null,null],['Am','Amurkarpfen (Graskarpfen)',80,null,null,null],['Ä','Äsche',35,'01.01','15.06','salmoniden'],['L','Atlantischer Lachs',60,'01.10','30.04','salmoniden'],['Bf','Bachforelle',28,'01.10','30.04','salmoniden'],['Bs','Bachsaibling',25,'01.10','30.04','salmoniden'],['Ba','Barbe',50,'15.04','30.06','barbe'],['B','Barsch',null,null,null,'barsch'],['GM','Große Maräne',30,'01.10','31.12','grosse_maraene'],['H','Hecht',50,'01.02','30.04','hecht'],['Ka','Karausche',15,'01.02','30.06',null],['K','Karpfen',40,null,null,'karpfen'],['Mf','Meerforelle',60,'01.10','30.04','salmoniden'],['N','Nase',40,'01.01','15.06',null],['Q','Quappe',30,'01.01','31.03',null],['Ra','Rapfen',40,'01.01','31.05',null],['Rf','Regenbogenforelle',25,'01.10','30.04','salmoniden'],['Ro','Rotfeder',20,null,null,null],['S','Schleie',25,null,null,'schleie'],['Sf','Seeforelle',60,'01.10','30.04','salmoniden'],['Ss','Seesaibling',28,'01.10','30.04','salmoniden'],['Sh','Störhybride',70,null,null,null],['Z','Zander',50,'01.02','31.05','zander'],['Bl','Blei / Brachse',null,null,null,'brachse'],['D','Döbel',null,null,null,'doebel'],['Gi','Giebel',null,null,null,null],['Gru','Grundelarten',null,null,null,null],['Gr','Gründling',null,null,null,null],['Gü','Güster',null,null,null,null],['Ha','Hasel',null,null,null,null],['Kb','Kaulbarsch',null,null,null,null],['KM','Kleine Maräne',null,null,null,'salmoniden'],['Ma','Marmorkarpfen',null,null,null,null],['Mo','Moderlieschen',null,null,null,null],['Pl','Plötze',null,null,null,'ploetze'],['Sk','Silberkarpfen',null,null,null,null],['Sb','Sonnenbarsch',null,null,null,null],['UK','Ukelei',null,null,null,null],['W','Wels',null,null,null,null],['Zw','Zwergwels',null,null,null,null]
].map(([code,name,min,start,end,curve])=>({code,name,min,start,end,curve}));

function saveDays(){localStorage.setItem(dayStoreKey,JSON.stringify(days))}
function saveCatches(){localStorage.setItem(catchStoreKey,JSON.stringify(catches))}
function id(prefix='d'){return prefix+Date.now()+Math.random().toString(16).slice(2)}
function today(){const d=new Date();const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function deDate(v){if(!v)return'';const [y,m,d]=v.split('-');return `${d}.${m}.${y}`}
function weekday(v){return new Intl.DateTimeFormat('de-DE',{weekday:'long'}).format(new Date(v+'T12:00:00'))}
function deNum(v,max=2){return new Intl.NumberFormat('de-DE',{minimumFractionDigits:1,maximumFractionDigits:max}).format(v)}
function clear(){overlay.innerHTML=''}
function dayCatches(dayId){return catches.filter(c=>c.dayId===dayId)}
function totalQuantity(dayId){return dayCatches(dayId).reduce((s,c)=>s+(c.quantity||1),0)}
function speciesFor(code){return fishCatalog.find(f=>f.code.toLocaleLowerCase('de-DE')===String(code||'').trim().toLocaleLowerCase('de-DE'))||null}
function canonicalCode(code){const s=speciesFor(code);return s?s.code:String(code||'').trim()}
function hotspot(x,y,w,h,label,onClick){const b=document.createElement('button');b.className='hotspot';b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',label);b.onclick=onClick;overlay.appendChild(b);return b}
function formControl(x,y,w,h,type,value,kind){
 const wrap=document.createElement('div');wrap.className='form-control '+kind;wrap.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;
 const icon=document.createElement('span');icon.className='leading-icon';icon.innerHTML=kind==='water'?'<span class="pin-shape"></span>':'<span class="calendar-shape"></span>';
 const input=document.createElement('input');input.type=type;input.value=value;
 wrap.append(icon,input);overlay.appendChild(wrap);return input;
}
function speciesFishSvg(code,sizeClass=''){
 const c=String(code||'').trim();
 const key=c.toLocaleLowerCase('de-DE');
 const common=key==='h'?'pike':key==='k'?'carp':key==='b'?'perch':key==='z'?'zander':key==='a'?'eel':['bf','bs','mf','rf','sf','ss','ä','l','km'].includes(key)?'salmonid':'generic';
 const cls=`species-fish-svg ${sizeClass} ${common}`;
 if(common==='pike')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M20 35 6 24v22l14-11Z" fill="#168c70"/><path d="M18 34c15-14 56-17 82-4 6 3 10 5 15 5-6 5-11 7-17 9-28 9-64 2-80-10Z" fill="#168c70"/><path d="M92 30h20l-9 8H89Z" fill="#168c70"/><circle cx="92" cy="31" r="2.2" fill="#fff"/></svg>`;
 if(common==='carp')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M22 35 7 23v24l15-12Z" fill="#b98a32"/><ellipse cx="64" cy="36" rx="40" ry="22" fill="#b98a32"/><path d="M46 18c12-9 29-7 42 0l-8 7H50Z" fill="#8d6926"/><path d="M58 53c10 7 23 8 34 2l-11-8Z" fill="#8d6926"/><circle cx="91" cy="31" r="2.5" fill="#fff"/><path d="M94 38c6 1 10 0 14-2" fill="none" stroke="#6f511c" stroke-width="2" stroke-linecap="round"/></svg>`;
 if(common==='perch')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M22 35 7 24v22l15-11Z" fill="#61835a"/><ellipse cx="63" cy="36" rx="39" ry="20" fill="#6e965f"/><path d="M38 19c15-10 31-8 44-2l-8 8H45Z" fill="#4c6d46"/><g stroke="#2e5235" stroke-width="5" opacity=".65"><path d="M48 20v30"/><path d="M62 17v36"/><path d="M76 20v30"/></g><circle cx="91" cy="31" r="2.4" fill="#fff"/></svg>`;
 if(common==='zander')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M20 35 6 24v22l14-11Z" fill="#77909c"/><path d="M19 34c16-12 57-14 83-2 5 2 9 3 13 3-5 4-9 7-14 9-27 10-65 3-82-10Z" fill="#77909c"/><path d="M43 18c10-8 23-8 33-2l-8 8H47Z" fill="#536e7b"/><path d="M70 19c8-6 18-6 25-2l-7 7H75Z" fill="#536e7b"/><circle cx="94" cy="30" r="2.3" fill="#fff"/></svg>`;
 if(common==='eel')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M10 43c18-21 42-22 63-14 18 7 27 5 37-1" fill="none" stroke="#55735e" stroke-width="12" stroke-linecap="round"/><path d="M14 43 3 34v18l11-9Z" fill="#55735e"/><circle cx="104" cy="29" r="2.3" fill="#fff"/></svg>`;
 if(common==='salmonid')return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M20 35 6 24v22l14-11Z" fill="#5a8a7b"/><ellipse cx="63" cy="35" rx="41" ry="17" fill="#6f9f8d"/><path d="M45 20c10-8 22-7 31-2l-8 7H49Z" fill="#4f7d70"/><g fill="#e9f5f1" opacity=".65"><circle cx="51" cy="32" r="2"/><circle cx="62" cy="38" r="2"/><circle cx="73" cy="30" r="2"/><circle cx="82" cy="39" r="2"/></g><circle cx="94" cy="31" r="2.3" fill="#fff"/></svg>`;
 return `<svg class="${cls}" viewBox="0 0 120 70" aria-hidden="true"><path d="M20 35 6 24v22l14-11Z" fill="#5e7b8a"/><ellipse cx="64" cy="35" rx="40" ry="18" fill="#6f8d9b"/><path d="M49 21c9-7 20-7 28-2l-7 6H53Z" fill="#526d79"/><circle cx="94" cy="31" r="2.3" fill="#fff"/><text x="63" y="41" text-anchor="middle" font-size="14" font-family="Arial,sans-serif" fill="#fff" opacity=".9">${c||'?'}</text></svg>`;
}
function friendlyFishSvg(sizeClass=''){return speciesFishSvg('',sizeClass)}
function show(name){clear();img.src=assets[name];if(name==='home')home();if(name==='newDay')newDay();if(name==='catch')catchScreen();if(name==='detail')detail();if(name==='season')season();if(name==='report')report()}

function home(){
  hotspot(11.8,37.8,24.5,18.3,'Neuer Angeltag',()=>{editDayMode=false;show('newDay')});
  hotspot(37.4,37.8,24.4,18.3,'Jahresauswertung',()=>show('report'));
  hotspot(62.8,37.8,24.5,18.3,'Saison',()=>show('season'));
  tabs();
  if(days.length){
    const list=document.createElement('div');list.className='dynamic-home-list';
    const visible=days.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    visible.forEach(d=>{
      const n=totalQuantity(d.id);
      const label=n===0?'kein Fang':n===1?'1 Fang':`${n} Fänge`;
      const r=document.createElement('div');r.className='row';
      r.innerHTML=`<div class="date"><strong>${deDate(d.date)}</strong><small>${weekday(d.date)}</small></div><div class="sep"></div><div class="water"><span class="pin-icon" aria-hidden="true"></span><div class="water-copy"><strong>${d.water}</strong><small>Vereinsgewässer</small></div></div><div class="state ${n?'has-catch':''}"><span class="fish-icon" aria-hidden="true"></span><span>${label}</span></div><div class="chev">›</div>`;
      r.onclick=()=>{currentId=d.id;show('detail')};list.appendChild(r)
    });
    if(visible.length<3){const filler=document.createElement('div');filler.className='empty-slot';filler.style.height=`${(3-visible.length)*33.333}%`;list.appendChild(filler)}
    overlay.appendChild(list);
  }
}

function newDay(){
  const existing=editDayMode&&currentId?days.find(d=>d.id===currentId):null;
  const date=formControl(14.75,31.95,69.25,5.65,'date',existing?.date||today(),'date');
  const water=formControl(14.75,42.95,69.25,5.65,'text',existing?.water||'','water');
  water.placeholder='z. B. D02-101';
  water.addEventListener('input',()=>{const s=water.selectionStart,e=water.selectionEnd;water.value=water.value.toUpperCase();try{water.setSelectionRange(s,e)}catch(_){}});
  hotspot(12,9,12,6,'Zurück',()=>show(editDayMode?'detail':'home'));
  hotspot(14.7,51.3,69.6,6.8,editDayMode?'Änderungen speichern':'Angeltag speichern',()=>{
    const w=water.value.trim().toUpperCase();
    if(!w){overlay.querySelector('.error-note')?.remove();const e=document.createElement('div');e.className='error-note';e.style.cssText='left:16%;top:49.3%';e.textContent='Bitte eine Gewässernummer eingeben.';overlay.appendChild(e);return}
    if(existing){existing.date=date.value||today();existing.water=w}else{const d={id:id(),date:date.value||today(),water:w};days.push(d);currentId=d.id}
    saveDays();show('detail');
  });
  hotspot(14.7,59.0,69.6,6.1,'Abbrechen',()=>show(editDayMode?'detail':'home'));
  tabs();
}

function detail(){
  let d=days.find(x=>x.id===currentId);if(!d){d=days.slice().sort((a,b)=>b.date.localeCompare(a.date))[0]||{id:'demo',date:'2026-10-02',water:'D02-101'};currentId=d.id}
  const left=document.createElement('div');left.className='detail-copy';left.style.cssText='left:22.3%;top:22.65%;width:22.6%;height:5.55%';left.innerHTML=`<strong>${deDate(d.date)}</strong><span>${weekday(d.date)}</span>`;overlay.appendChild(left);
  const right=document.createElement('div');right.className='detail-copy';right.style.cssText='left:53.1%;top:22.65%;width:24.8%;height:5.55%';right.innerHTML=`<strong>${d.water}</strong><span>Vereinsgewässer</span>`;overlay.appendChild(right);
  const dc=dayCatches(d.id);
  const count=document.createElement('div');count.className='detail-count';count.textContent=`${dc.length} ${dc.length===1?'Eintrag':'Einträge'}`;overlay.appendChild(count);
  const mask=document.createElement('div');mask.className='detail-list-mask';
  if(dc.length===0){
    mask.innerHTML=`<div class="detail-empty">${friendlyFishSvg('large')}<strong>Noch keine Fänge eingetragen</strong><span>Dieser Angeltag ist gültig und bleibt auch ohne Fang gespeichert.</span></div>`;
  }else{
    mask.classList.add('has-rows');
    dc.slice(0,3).forEach(c=>{
      const r=document.createElement('button');r.className='catch-row';
      r.innerHTML=`<span class="catch-mini-fish">${speciesFishSvg(c.code,'mini')}</span><span class="catch-copy"><strong>${c.code}</strong><small>${c.quantity>1?`${c.quantity} Stk.`:`${deNum(c.length,1)} cm`} &nbsp; • &nbsp; ${c.weight!=null?deNum(c.weight):'–'} kg</small></span><span class="catch-chevron">›</span>`;
      r.onclick=()=>{currentCatchId=c.id;show('catch')};mask.appendChild(r)
    });
  }
  overlay.appendChild(mask);
  hotspot(11.5,9.2,12,6.3,'Zurück',()=>show('home'));
  hotspot(12,62.8,75,6.8,'Fang hinzufügen',()=>{currentCatchId=null;show('catch')});
  hotspot(12,71.0,75,6.8,'Angeltag bearbeiten',()=>{editDayMode=true;show('newDay')});
  hotspot(12,79.2,75,6.8,'Angeltag löschen',()=>confirmDeleteDay(d));
  tabs();
}

function catchScreen(){
  const d=days.find(x=>x.id===currentId)||{id:'demo',date:'2026-10-02',water:'D02-101'};
  const existing=currentCatchId?catches.find(c=>c.id===currentCatchId):null;
  const model={code:existing?.code||'H',length:existing?.length??55,weight:existing?.weight??1.0,source:existing?.source||'estimated'};
  const subtitle=document.createElement('div');subtitle.className='catch-subtitle-mask';subtitle.textContent=`${deDate(d.date)}  •  ${d.water}`;overlay.appendChild(subtitle);

  const form=document.createElement('div');form.className='catch-form-grid';form.innerHTML=`
    <label class="cf-cell"><span>Datum</span><div class="cf-readonly">▣ ${deDate(d.date)}</div></label>
    <label class="cf-cell"><span>Gewässer</span><div class="cf-readonly">● ${d.water}</div></label>
    <label class="cf-cell"><span>Art</span><input id="cfCode" type="text" value="${model.code}" autocomplete="off"></label>
    <label class="cf-cell"><span>Länge</span><div class="cf-with-unit"><input id="cfLength" type="number" step="0.1" value="${model.length}"><b>cm</b></div></label>
    <label class="cf-cell cf-weight-cell"><span>Gewicht</span><button type="button" id="cfWeight"><strong class="weight-value">${model.weight>0?deNum(model.weight):'–'}</strong><b>kg</b><em class="weight-source">${model.source==='estimated'?'✨':'✎'}</em><i>⌄</i></button></label>`;
  overlay.appendChild(form);
  const code=form.querySelector('#cfCode');const length=form.querySelector('#cfLength');const weight=form.querySelector('#cfWeight');

  const picker=document.createElement('div');picker.className='weight-popover hidden';
  const sel=document.createElement('select');sel.size=6;
  for(let i=0;i<=400;i++){const val=i*0.05;const opt=document.createElement('option');opt.value=val.toFixed(2);opt.textContent=`${deNum(val)} kg`;if(Math.abs(val-model.weight)<0.001)opt.selected=true;sel.appendChild(opt)}
  const done=document.createElement('button');done.type='button';done.textContent='Fertig';
  picker.append(sel,done);overlay.appendChild(picker);
  weight.onclick=()=>picker.classList.toggle('hidden');
  done.onclick=()=>picker.classList.add('hidden');
  sel.onchange=()=>{model.weight=Number(sel.value);model.source='manual';weight.querySelector('.weight-value').textContent=deNum(model.weight);weight.querySelector('.weight-source').textContent='✎';updateCatchInfo()};

  code.addEventListener('input',()=>{estimateWeight();updateCatchInfo()});
  length.addEventListener('input',()=>{estimateWeight();updateCatchInfo()});

  function estimateWeight(){
    const sp=speciesFor(code.value);const len=Number(length.value);if(!sp||!Number.isFinite(len)){return}
    const est=estimate(sp,len);if(est!=null){model.weight=est;model.source='estimated';weight.querySelector('.weight-value').textContent=deNum(est);weight.querySelector('.weight-source').textContent='✨';selectClosest(sel,est)}
    else if(model.source==='estimated'){model.weight=0;model.source=null;weight.querySelector('.weight-value').textContent='–';weight.querySelector('.weight-source').textContent='';selectClosest(sel,0)}
  }

  function updateCatchInfo(){
    overlay.querySelector('.catch-info-dynamic')?.remove();overlay.querySelector('.catch-species-name')?.remove();overlay.querySelector('.catch-fish-illustration')?.remove();overlay.querySelector('.catch-info-note')?.remove();
    const sp=speciesFor(code.value);const len=Number(length.value);
    const nameEl=document.createElement('div');nameEl.className='catch-species-name';nameEl.textContent=sp?sp.name:'Fischart unbekannt';overlay.appendChild(nameEl);
    const fish=document.createElement('div');fish.className='catch-fish-illustration';fish.innerHTML=speciesFishSvg(sp?.code||code.value,'editor');overlay.appendChild(fish);
    const panel=document.createElement('div');panel.className='catch-info-dynamic';
    if(sp){
      const minOk=sp.min==null||!Number.isFinite(len)?null:len>=sp.min;const closed=inClosedSeason(sp,d.date);
      panel.innerHTML=`<div class="rule-status ${minOk===false||closed?'warning':'ok'}">${minOk===false||closed?'! Hinweis prüfen':'✓ Eintrag gültig'}</div><div class="rule-line"><span>▰</span><div><small>Mindestmaß:</small><strong>${sp.min==null?'–':`${deNum(sp.min,0)} cm`}</strong></div></div><div class="rule-line"><span>▣</span><div><small>Schonzeit:</small><strong>${sp.start?`${sp.start} – ${sp.end}`:'–'}</strong></div></div>`;
    }else panel.innerHTML='<div class="rule-status warning">! Code prüfen</div><div class="rule-line"><div><small>Keine Regelprüfung</small><strong>Keine Gewichtsschätzung</strong></div></div>';
    overlay.appendChild(panel);
    const note=document.createElement('div');note.className='catch-info-note';
    note.textContent=model.source==='estimated'?'Das Gewicht wurde automatisch anhand der Länge vorgeschlagen und kann bei Bedarf angepasst werden.':(model.weight>0?'Das Gewicht wurde manuell angepasst.':'Kein automatischer Gewichtsvorschlag verfügbar. Gewicht bitte manuell wählen.');overlay.appendChild(note);
  }
  updateCatchInfo();

  const cancel=document.createElement('button');cancel.type='button';cancel.className='catch-action-button cancel';cancel.textContent='Abbrechen';cancel.onclick=()=>show('detail');overlay.appendChild(cancel);
  const save=document.createElement('button');save.type='button';save.className='catch-action-button save';save.textContent=existing?'Änderungen speichern':'Fang speichern';save.onclick=()=>{
    const sp=speciesFor(code.value);const len=Number(length.value);
    if(!sp){showCatchError('Bitte eine gültige Fischart-Abkürzung eingeben.');return}
    if(!Number.isFinite(len)||len<0){showCatchError('Bitte eine gültige Länge eingeben.');return}
    if(model.weight<0){showCatchError('Das Gewicht darf nicht negativ sein.');return}
    const saved={id:existing?.id||id('c'),dayId:d.id,code:sp.code,quantity:1,length:len,weight:model.weight>0?model.weight:null,source:model.weight>0?(model.source||'manual'):null};
    if(existing){Object.assign(existing,saved)}else{catches.push(saved)}saveCatches();currentCatchId=null;show('detail');
  };overlay.appendChild(save);
  hotspot(11.5,9.0,12,6.3,'Zurück',()=>show('detail'));
  if(existing){const del=document.createElement('button');del.className='catch-delete-test';del.textContent='Fang löschen';del.onclick=()=>confirmDeleteCatch(existing);overlay.appendChild(del)}
}

function catchReadonly(x,y,w,h,text,kind){const el=document.createElement('div');el.className='catch-field readonly '+kind;el.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;el.textContent=text;overlay.appendChild(el);return el}
function catchInput(x,y,w,h,type,value,kind){const wrap=document.createElement('div');wrap.className='catch-field input '+kind;wrap.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;const i=document.createElement('input');i.type=type;i.value=value;i.autocomplete='off';wrap.appendChild(i);if(kind==='length'){const u=document.createElement('span');u.textContent='cm';wrap.appendChild(u)}overlay.appendChild(wrap);return i}
function catchWeightControl(x,y,w,h,value,source){const b=document.createElement('button');b.className='catch-field weight';b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.innerHTML=`<strong class="weight-value">${value>0?deNum(value):'–'}</strong><span>kg</span><span class="weight-source">${source==='estimated'?'✨':'✎'}</span>`;b.onclick=()=>document.querySelector('.weight-wheel')?.focus();overlay.appendChild(b);return b}
function showCatchError(text){overlay.querySelector('.catch-error')?.remove();const e=document.createElement('div');e.className='catch-error';e.textContent=text;overlay.appendChild(e)}
function selectClosest(select,value){let best=0,diff=Infinity;[...select.options].forEach((o,i)=>{const d=Math.abs(Number(o.value)-value);if(d<diff){best=i;diff=d}});select.selectedIndex=best}
function estimate(sp,length){if(!sp.curve)return null;const c=curves.find(x=>x.id===sp.curve);if(!c||!c.points?.length)return null;const pts=c.points.slice().sort((a,b)=>a.lengthCm-b.lengthCm);if(length<pts[0].lengthCm||length>pts[pts.length-1].lengthCm)return null;const exact=pts.find(p=>Math.abs(p.lengthCm-length)<1e-9);if(exact)return exact.weightKg;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(length>a.lengthCm&&length<b.lengthCm)return a.weightKg+(b.weightKg-a.weightKg)*(length-a.lengthCm)/(b.lengthCm-a.lengthCm)}return null}
function inClosedSeason(sp,date){if(!sp.start||!sp.end)return false;const [,m,d]=date.match(/(\d{4})-(\d{2})-(\d{2})/)||[];if(!m)return false;const cur=Number(m)*100+Number(d);const parse=s=>{const [dd,mm]=s.split('.').map(Number);return mm*100+dd};const a=parse(sp.start),b=parse(sp.end);return a<=b?(cur>=a&&cur<=b):(cur>=a||cur<=b)}

function confirmDeleteDay(d){
  modal('Angeltag wirklich löschen?','Alle zu diesem Angeltag gespeicherten Fänge werden ebenfalls gelöscht.',()=>{catches=catches.filter(c=>c.dayId!==d.id);days=days.filter(x=>x.id!==d.id);saveCatches();saveDays();currentId=null;show('home')});
}
function confirmDeleteCatch(c){modal('Diesen Fang wirklich löschen?','Nur dieser Fang wird gelöscht. Der Angeltag bleibt erhalten.',()=>{catches=catches.filter(x=>x.id!==c.id);saveCatches();currentCatchId=null;show('detail')})}
function modal(title,text,onDelete){const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="modal-card"><h3>${title}</h3><p>${text}</p><div class="modal-actions"><button class="cancel">Abbrechen</button><button class="destructive">Löschen</button></div></div>`;document.body.appendChild(m);m.querySelector('.cancel').onclick=()=>m.remove();m.querySelector('.destructive').onclick=()=>{m.remove();onDelete()}}
function tabs(){hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'))}
function season(){tabs();hotspot(13,38.7,73,8.1,'Fangbuch abgegeben',()=>alert('Saisonabschluss bleibt auf dem bereits freigegebenen Stand.'))}
function report(){tabs()}

document.getElementById('resetPreview').onclick=()=>{localStorage.removeItem(dayStoreKey);localStorage.removeItem(catchStoreKey);days=[];catches=[];currentId=null;currentCatchId=null;show('home')};
fetch('data/weight_curves_v1.0.json').then(r=>r.json()).then(data=>{curves=data.curves||[]}).catch(()=>{}).finally(()=>setTimeout(()=>show('home'),2200));
})();
