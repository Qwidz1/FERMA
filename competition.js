'use strict';

let selectedBatchId = '';
let presentationCase = 'A';

function chartEventMarkers(batch,start,total) {
  const markers=batch.events.filter(event=>['Pembalikan','Sampling'].includes(event.type)).map(event=>({type:event.type,hours:(new Date(event.at)-new Date(batch.start))/3600000})).filter(event=>event.hours>=start&&event.hours<=total).slice(-3);
  if(metric==='temp'&&batch.location==='B'&&42>=start&&42<=total)markers.push({type:'Pemeriksaan jam 42',hours:42});
  return markers.map((event,index)=>{
    const x=45+(event.hours-start)/Math.max(total-start,1)*555;
    return `<line x1="${x}" x2="${x}" y1="35" y2="192" stroke="#826043" stroke-dasharray="2 4" opacity=".6"/><text x="${x>500?x-5:x+5}" y="${25+index*16}" text-anchor="${x>500?'end':'start'}" style="fill:#705236">${esc(event.type)}</text>`;
  }).join('');
}

function decisionFor(batch) {
  if(!batch)return {title:'Siapkan batch pertama',reason:'Buat batch untuk mulai mencatat fermentasi.',tone:'quiet'};
  if(batch.status==='draft')return {title:'Batch siap dimulai',reason:'Tekan Mulai batch saat fermentasi dimulai.',tone:'quiet'};
  if(batch.status==='done')return {title:'Fermentasi selesai',reason:'Tinjau riwayat dan lengkapi hasil laboratorium.',tone:'quiet'};
  if(!batch.demo)return {title:'Menunggu data sensor',reason:'Anda tetap dapat mencatat tindakan di lapangan.',tone:'quiet'};
  if(batch.location==='B')return {title:'Periksa suhu fermentasi',reason:`Suhu tengah ${num(batch.temp)} °C, di bawah acuan 35 °C pada jam ke-42.`,tone:'warning'};
  if(batch.type==='Terkontrol'&&duration(batch)>=48&&!batch.events.some(event=>event.type==='Pembalikan'))return {title:'Saatnya membalik biji',reason:'Batch memasuki jam ke-48. Catat setelah biji dibalik.',tone:'action'};
  return {title:'Lanjutkan pemantauan',reason:'Pantau kondisi dan catat tindakan berikutnya.',tone:'quiet'};
}

function decisionActions(batch) {
  if(!batch)return newButton();
  if(batch.status!=='active')return `<a class="btn primary" href="#batch/${encodeURIComponent(batch.id)}">Lihat batch</a>`;
  const type=batch.location==='B'?'Tindak lanjut':'Pembalikan';
  return `<button class="btn primary" data-action="event" data-id="${esc(batch.id)}" data-type="${type}">${type==='Tindak lanjut'?'Catat pemeriksaan':'Catat pembalikan'}</button><a class="btn" href="#batch/${encodeURIComponent(batch.id)}">Detail batch</a>`;
}

function predictionEvidence(batch,recorded=false) {
  if(!batch?.demo)return '<section class="evidence-block"><h2>Perkiraan kematangan</h2><p>Prediksi belum tersedia.</p></section>';
  const hit=batch.lower>=1;
  const position=value=>Math.max(0,Math.min(100,value/1.3*100));
  return `<section class="evidence-block">
    <div class="evidence-title"><h2>Perkiraan kematangan</h2>${recorded?tag('Hasil akhir','neutral'):''}</div>
    <div class="if-comparison"><div><span>Prediksi IF</span><strong>${num(batch.ifValue,2)}</strong></div><div><span>Batas bawah</span><strong>${num(batch.lower,2)}</strong></div><div><span>Acuan henti</span><strong>1,00</strong></div></div>
    <div class="if-scale" role="img" aria-label="Prediksi indeks fermentasi ${num(batch.ifValue,2)}, batas bawah ${num(batch.lower,2)}, acuan henti 1,00">
      <span class="if-threshold" style="left:${position(1)}%"><span>Acuan 1,00</span></span>
      <span class="if-span" style="left:${position(batch.lower)}%;width:${position(batch.ifValue)-position(batch.lower)}%"></span>
      <span class="if-lower" style="left:${position(batch.lower)}%"></span><span class="if-mean" style="left:${position(batch.ifValue)}%"></span>
    </div>
    <div class="if-legend"><span><i class="if-key lower"></i>Batas bawah</span><span><i class="if-key mean"></i>Prediksi IF</span></div>
    <p class="evidence-verdict ${hit?'good':'muted'}">${hit?'Acuan henti tercapai.':'Acuan henti belum tercapai.'}</p>
    <p class="evidence-note">IF adalah indeks fermentasi. Acuan henti dinilai dari batas bawah prediksi.</p>
  </section>`;
}

function batchInstrument(batch) {
  if(!batch)return '';
  return `<section class="instrument-block"><div class="evidence-title"><h2>Suhu dalam kotak</h2><span class="muted small">${esc(batch.node)}</span></div>${box(batch)}<div class="instrument-meta"><div><span>Massa awal</span><strong>${num(batch.mass)} kg</strong></div><div><span>Durasi</span><strong>${num(duration(batch),0)} jam</strong></div></div></section>`;
}

function operationsPage() {
  const items=visible();
  const active=items.filter(batch=>batch.status==='active');
  const selected=active.find(batch=>batch.id===selectedBatchId)||active[0];
  const decision=decisionFor(selected);
  return heading('Dashboard','',newButton())+`
    <div class="work-context"><span>${active.length} batch berlangsung</span><span>${alerts().length} perlu diperiksa</span><span>${items.filter(batch=>batch.status==='done').length} batch selesai</span></div>
    <section class="decision-board ${decision.tone}">
      <div class="decision-main"><div class="decision-context">${selected?`${esc(selected.id)} · ${locName(selected.location)}`:'Batch aktif'}</div><h2>${decision.title}</h2><p>${decision.reason}</p><div class="decision-actions">${decisionActions(selected)}</div></div>
      <div class="decision-aside">${selected?`<label for="active-batch">Pilih batch</label><select class="field" id="active-batch">${active.map(batch=>`<option value="${esc(batch.id)}" ${batch.id===selected.id?'selected':''}>${esc(batch.id)} · ${locName(batch.location)}</option>`).join('')}</select><span class="decision-time">${num(duration(selected),0)} <small>jam berlangsung</small></span>`:'<p>Belum ada batch aktif.</p>'}</div>
    </section>
    <div class="process-workspace"><div>${chartPanel(selected)}${selected?`<div class="measurement-strip"><div><span>Suhu tengah</span><strong>${selected.demo?`${num(selected.temp)} °C`:'Belum tersedia'}</strong></div><div><span>pH pulp</span><strong>${selected.demo?num(selected.ph,2):'Belum tersedia'}</strong></div><div><span>Susut massa</span><strong>${selected.demo?`${num(selected.loss)} %`:'Belum tersedia'}</strong></div></div>`:''}</div><aside class="process-aside">${predictionEvidence(selected)}${batchInstrument(selected)}</aside></div>
    <section class="batch-ledger section-gap"><div class="panel-head"><h2>Daftar batch</h2><a href="#batches" class="link">Kelola batch</a></div>${batchTable(items.slice(0,5),true)}</section>`;
}

function researchPage() {
  const cases=[
    {key:'A',label:'Pembalikan biji',question:'Kapan biji perlu dibalik?',decision:'Balik pada jam ke-48.',why:'Untuk batch terkontrol, catat pembalikan setelah dilakukan di lapangan.'},
    {key:'B',label:'Suhu rendah',question:'Apa yang perlu diperiksa?',decision:'Periksa suhu dan kondisi biji.',why:'Suhu di bawah 35 °C pada jam ke-42 perlu diperiksa. Catat temuan dan tindakan Anda.'},
    {key:'C',label:'Acuan henti',question:'Kapan fermentasi dapat dihentikan?',decision:'Tinjau batas bawah indeks fermentasi.',why:'Acuan henti tercapai saat batas bawah prediksi IF mencapai 1,00. Catat waktu selesai setelah proses dihentikan.'}
  ];
  const chosen=cases.find(item=>item.key===presentationCase)||cases[0];
  const batch=seed().batches.find(item=>item.location===chosen.key);
  return heading('Tentang FERMA','Pemantauan dan pencatatan fermentasi kakao.',`<a class="btn primary" href="#overview">Buka dashboard</a>`)+`
    <section class="research-intro"><div><h2>Dari kondisi biji,<br>ke tindakan di lapangan.</h2><p>FERMA menyatukan perkembangan suhu, perkiraan kematangan, dan catatan setiap batch.</p></div><div class="research-status"><strong>Satu riwayat per batch</strong><p>Tinjau kondisi, catat pembalikan, lalu lengkapi hasil laboratorium.</p><a class="link" href="#batches">Lihat batch</a></div></section>
    <section class="case-workspace" aria-labelledby="case-title"><div class="case-picker"><h2 id="case-title">Panduan kondisi</h2><div class="case-buttons" role="group" aria-label="Panduan kondisi">${cases.map(item=>`<button class="case-button ${item.key===chosen.key?'selected':''}" data-case="${item.key}" aria-pressed="${item.key===chosen.key}">${item.label}</button>`).join('')}</div></div>
      <div class="case-heading"><div><span class="muted">${esc(batch.id)} · ${locName(batch.location)}</span><h3>${chosen.question}</h3></div></div>
      <div class="research-case-grid"><div>${chartPanel(batch)}</div><div class="case-explanation"><h3>${chosen.decision}</h3><p>${chosen.why}</p>${chosen.key==='C'?predictionEvidence(batch,true):batchInstrument(batch)}<a class="link" href="#batch/${batch.id}">Detail batch</a></div></div>
    </section>`;
}

function batchDetailPage(id) {
  const batch=state.batches.find(item=>item.id===id);
  if(!allowed(batch))return heading('Batch tidak tersedia','Periksa lokasi atau pilih batch lain.')+'<a class="btn" href="#batches">Daftar batch</a>';
  const actions=batch.status==='draft'?`<button class="btn primary" data-action="start" data-id="${esc(id)}">Mulai batch</button>`:batch.status==='active'?`<button class="btn" data-action="event" data-id="${esc(id)}" data-type="Sampling">Catat tindakan</button><button class="btn primary" data-action="finish" data-id="${esc(id)}">Selesaikan batch</button>`:'';
  const decision=decisionFor(batch);
  return heading(esc(id),`${locName(batch.location)} · ${esc(batch.node)} · ${esc(batch.type)}`,actions)+`
    <section class="decision-board ${decision.tone}"><div class="decision-main"><span class="decision-context">${statusName(batch.status)}</span><h2>${decision.title}</h2><p>${decision.reason}</p></div><div class="decision-aside"><span class="decision-time">${num(duration(batch),0)} <small>jam fermentasi</small></span><p>${batch.start?`Mulai ${date(batch.start,true)}`:'Belum dimulai'}${batch.end?`<br>Selesai ${date(batch.end,true)}`:''}</p></div></section>
    <div class="process-workspace"><div><section class="panel"><div class="panel-head"><h2>Data batch</h2><button class="link" data-action="metadata" data-id="${esc(id)}">Ubah data</button></div><div class="details-strip"><div>Massa awal<strong>${num(batch.mass)} kg</strong></div><div>Pemeraman<strong>${batch.rest} hari</strong></div><div>Klon<strong>${esc(batch.clone)}</strong></div><div>Cuaca<strong>${esc(recordText(batch.weather))}</strong></div></div></section><div class="section-gap">${chartPanel(batch)}</div>${timeline(batch)}</div><aside class="process-aside">${predictionEvidence(batch,batch.status==='done')}${batchInstrument(batch)}<div class="evidence-block"><a class="btn" href="#lab">Hasil laboratorium</a></div></aside></div>`;
}

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-case]');
  if(!target)return;
  presentationCase=target.dataset.case;
  metric='temp';
  range='all';
  render();
  document.querySelector(`[data-case="${presentationCase}"]`).focus();
});

document.addEventListener('change',event=>{
  if(event.target.id!=='active-batch')return;
  selectedBatchId=event.target.value;
  render();
  document.querySelector('#active-batch')?.focus();
});
