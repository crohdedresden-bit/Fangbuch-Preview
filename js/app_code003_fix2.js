(()=>{
const img=document.getElementById('screenImage');
const overlay=document.getElementById('overlay');
const storeKey='fangbuch-code003-designlock-days';
let days=JSON.parse(localStorage.getItem(storeKey)||'[]');
let currentId=null;
let editMode=false;
const assets={splash:'assets/code003_lock1_00_splash.png',home:'assets/code003_lock1_01_home.png',newDay:'assets/code003_lock1_02_new_day.png',detail:'assets/code003_lock1_04_day_detail.png',season:'assets/code003_lock1_05_season.png',report:'assets/code003_lock1_06_report.png'};
function save(){localStorage.setItem(storeKey,JSON.stringify(days))}
function id(){return 'd'+Date.now()+Math.random().toString(16).slice(2)}
function today(){const d=new Date();const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`}
function deDate(v){if(!v)return'';const [y,m,d]=v.split('-');return `${d}.${m}.${y}`}
function weekday(v){return new Intl.DateTimeFormat('de-DE',{weekday:'long'}).format(new Date(v+'T12:00:00'))}
function clear(){overlay.innerHTML=''}
function hotspot(x,y,w,h,label,onClick){const b=document.createElement('button');b.className='hotspot';b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',label);b.onclick=onClick;overlay.appendChild(b);return b}
function field(x,y,w,h,type,value,cls=''){const i=document.createElement('input');i.className='field '+cls;i.type=type;i.value=value;i.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;overlay.appendChild(i);return i}
function show(name){clear();img.src=assets[name];if(name==='home')home();if(name==='newDay')newDay();if(name==='detail')detail();if(name==='season')season();if(name==='report')report()}
function home(){
  hotspot(11.8,37.8,24.5,18.3,'Neuer Angeltag',()=>{editMode=false;show('newDay')});
  hotspot(37.4,37.8,24.4,18.3,'Jahresauswertung',()=>show('report'));
  hotspot(62.8,37.8,24.5,18.3,'Saison',()=>show('season'));
  hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'));
  if(days.length){
    const list=document.createElement('div');list.className='dynamic-home-list';
    days.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).forEach(d=>{
      const r=document.createElement('div');r.className='row';
      r.innerHTML=`<div class="date"><strong>${deDate(d.date)}</strong><small>${weekday(d.date)}</small></div><div class="sep"></div><div class="water"><span class="pin-icon" aria-hidden="true"></span><div class="water-copy"><strong>${d.water}</strong><small>Vereinsgewässer</small></div></div><div class="state"><span class="fish-icon" aria-hidden="true"></span><span>kein Fang</span></div><div class="chev">›</div>`;
      r.onclick=()=>{currentId=d.id;show('detail')};list.appendChild(r)
    });
    overlay.appendChild(list);
  } else {
    hotspot(12,62.8,75,23,'Beispiel-Angeltage',()=>{});
  }
}
function newDay(){
  const existing=editMode&&currentId?days.find(d=>d.id===currentId):null;
  const date=field(25.5,31.85,56.8,5.65,'date',existing?.date||today());
  const water=field(25.5,42.95,56.8,5.65,'text',existing?.water||'','water');
  water.placeholder='z. B. D02-101';
  water.addEventListener('input',()=>{const s=water.selectionStart,e=water.selectionEnd;water.value=water.value.toUpperCase();try{water.setSelectionRange(s,e)}catch(_){}});
  hotspot(12,9,12,6,'Zurück',()=>show(editMode?'detail':'home'));
  hotspot(14.7,51.3,69.6,6.8,editMode?'Änderungen speichern':'Angeltag speichern',()=>{
    const w=water.value.trim().toUpperCase();
    if(!w){const e=document.createElement('div');e.className='error-note';e.style.cssText='left:26%;top:49.2%';e.textContent='Bitte eine Gewässernummer eingeben.';overlay.appendChild(e);return}
    if(existing){existing.date=date.value||today();existing.water=w}else{const d={id:id(),date:date.value||today(),water:w};days.push(d);currentId=d.id}
    save();show('detail');
  });
  hotspot(14.7,59.0,69.6,6.1,'Abbrechen',()=>show(editMode?'detail':'home'));
  hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'));
}
function detail(){
  let d=days.find(x=>x.id===currentId);if(!d){d=days.slice().sort((a,b)=>b.date.localeCompare(a.date))[0]||{id:'demo',date:'2026-10-02',water:'D02-101'};currentId=d.id}

  const dv=document.createElement('div');dv.className='detail-value';dv.style.cssText='left:23.45%;top:23.15%;width:20.3%;height:2.65%';dv.textContent=deDate(d.date);overlay.appendChild(dv);
  const dsv=document.createElement('div');dsv.className='detail-subvalue';dsv.style.cssText='left:23.45%;top:25.75%;width:19.2%;height:2.45%';dsv.textContent=weekday(d.date);overlay.appendChild(dsv);
  const wv=document.createElement('div');wv.className='detail-value';wv.style.cssText='left:54.65%;top:23.15%;width:19.0%;height:2.65%';wv.textContent=d.water;overlay.appendChild(wv);

  const count=document.createElement('div');count.className='detail-count';count.textContent='0 Einträge';overlay.appendChild(count);
  const mask=document.createElement('div');mask.className='detail-list-mask';mask.innerHTML='<div class="detail-empty"><span class="fish-icon" aria-hidden="true"></span><strong>Noch keine Fänge eingetragen</strong><span>Dieser Angeltag ist gültig und bleibt auch ohne Fang gespeichert.</span></div>';overlay.appendChild(mask);

  hotspot(11.5,9.2,12,6.3,'Zurück',()=>show('home'));
  hotspot(12,62.8,75,6.8,'Fang hinzufügen',()=>alert('Die Fangerfassung folgt in Code004.'));
  hotspot(12,71.0,75,6.8,'Angeltag bearbeiten',()=>{editMode=true;show('newDay')});
  hotspot(12,79.2,75,6.8,'Angeltag löschen',()=>confirmDelete(d));
  hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'));
}
function confirmDelete(d){
  const m=document.createElement('div');m.className='modal';m.innerHTML='<div class="modal-card"><h3>Angeltag wirklich löschen?</h3><p>Alle zu diesem Angeltag gespeicherten Fänge werden ebenfalls gelöscht.</p><div class="modal-actions"><button class="cancel">Abbrechen</button><button class="destructive">Löschen</button></div></div>';document.body.appendChild(m);
  m.querySelector('.cancel').onclick=()=>m.remove();m.querySelector('.destructive').onclick=()=>{days=days.filter(x=>x.id!==d.id);save();currentId=null;m.remove();show('home')}
}
function season(){hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'));hotspot(13,38.7,73,8.1,'Fangbuch abgegeben',()=>alert('Saisonabschluss bleibt funktional auf Code002-Niveau; Bestätigungsdialog ist für die reale App verbindlich.'))}
function report(){hotspot(16,89.1,21,7.2,'Angeltage',()=>show('home'));hotspot(40,89.1,21,7.2,'Auswertung',()=>show('report'));hotspot(65,89.1,21,7.2,'Saison',()=>show('season'))}
document.getElementById('resetPreview').onclick=()=>{localStorage.removeItem(storeKey);days=[];currentId=null;show('home')};
setTimeout(()=>show('home'),2200);
})();
