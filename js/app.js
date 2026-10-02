(()=>{
const splash=document.getElementById('splash'),app=document.getElementById('app'),tabs=document.getElementById('tabs'),toast=document.getElementById('toast');
const screens={home:homeScreen,newDay:newDayScreen,detail:dayDetailScreen,edit:editDayScreen,report:reportScreen,season:seasonScreen};
let days=JSON.parse(localStorage.getItem('fangbuch-preview-code003-days')||'null')||[
 {id:'d1',date:'2026-11-20',water:'D02-101'},
 {id:'d2',date:'2026-11-21',water:'D02-101'},
 {id:'d3',date:'2026-11-22',water:'D02-104'}
];
let currentId=null;
function saveLocal(){localStorage.setItem('fangbuch-preview-code003-days',JSON.stringify(days))}
function show(name){Object.values(screens).forEach(s=>s.classList.remove('active'));screens[name].classList.add('active');tabs.style.display=['home','report','season'].includes(name)?'flex':'none';document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));}
function showToast(t){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
function dateDE(v){if(!v)return'';let [y,m,d]=v.split('-');return `${d}.${m}.${y}`}
function weekday(v){return new Intl.DateTimeFormat('de-DE',{weekday:'long'}).format(new Date(v+'T12:00:00'))}
function renderDays(){recentList.innerHTML='';if(!days.length){recentList.innerHTML='<div class="no-days">Noch keine Angeltage vorhanden.</div>';return}days.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).forEach(d=>{let r=document.createElement('div');r.className='day-row';r.innerHTML=`<div><strong>${dateDE(d.date)}</strong><small>${weekday(d.date)}</small></div><div class="vline"></div><div><strong>● ${d.water}</strong><small>Gewässernummer</small></div><div><small>kein Fang ›</small></div>`;r.onclick=()=>openDetail(d.id);recentList.appendChild(r)})}
function today(){let x=new Date();let off=x.getTimezoneOffset();x=new Date(x.getTime()-off*60000);return x.toISOString().slice(0,10)}
function openDetail(id){currentId=id;let d=days.find(x=>x.id===id);if(!d)return;detailDate.textContent=dateDE(d.date);detailWeekday.textContent=weekday(d.date);detailWater.textContent=d.water;show('detail')}
setTimeout(()=>{splash.style.display='none';app.classList.remove('hidden');renderDays();show('home')},2100);
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>show(b.dataset.tab));
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{if(b.dataset.back==='detail'&&currentId)openDetail(currentId);else show('home')});
openNewDay.onclick=()=>{dayDate.value=today();waterCode.value='';formError.textContent='';show('newDay')};
saveDay.onclick=()=>{let w=waterCode.value.trim().toUpperCase();if(!w){formError.textContent='Bitte eine Gewässernummer eingeben.';return}let d={id:'d'+Date.now(),date:dayDate.value||today(),water:w};days.push(d);saveLocal();renderDays();openDetail(d.id);showToast('Angeltag gespeichert')};
editDay.onclick=()=>{let d=days.find(x=>x.id===currentId);if(!d)return;editDate.value=d.date;editWater.value=d.water;editError.textContent='';show('edit')};
saveEdit.onclick=()=>{let d=days.find(x=>x.id===currentId);let w=editWater.value.trim().toUpperCase();if(!w){editError.textContent='Bitte eine Gewässernummer eingeben.';return}d.date=editDate.value;d.water=w;saveLocal();renderDays();openDetail(d.id);showToast('Angeltag geändert')};
addCatch.onclick=()=>showToast('Fangerfassung folgt mit Code004');
const modal=document.getElementById('modal');let confirmAction=null;function ask(title,text,action,confirmText='Bestätigen'){modalTitle.textContent=title;modalText.textContent=text;modalConfirm.textContent=confirmText;confirmAction=action;modal.classList.remove('hidden')};modalCancel.onclick=()=>modal.classList.add('hidden');modalConfirm.onclick=()=>{modal.classList.add('hidden');if(confirmAction)confirmAction()};
deleteDay.onclick=()=>ask('Angeltag wirklich löschen?','Der Angeltag wird gelöscht. Später würden dabei auch alle zugehörigen Fänge gelöscht.',()=>{days=days.filter(x=>x.id!==currentId);saveLocal();renderDays();currentId=null;show('home');showToast('Angeltag gelöscht')},'Löschen');
submitSeason.onclick=()=>ask('Fangbuch abgegeben?','Nach der Abgabe werden die Daten eingefroren. In der Preview wird dieser Schritt nicht dauerhaft ausgeführt.',()=>showToast('Preview: Saisonabschluss geprüft'),'Abgeben');
renderDays();
})();