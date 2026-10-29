'use strict';

let publicMenuOpen = false;
const publicRoutes = new Set(['landing','home','feature','product','faq','masuk','daftar']);

function fermaLogo() {
  return '<span class="ferma-logo-frame"><img src="assets/ferma-logo.png" width="1833" height="858" alt="FERMA, logo buah kakao dan daun"></span>';
}

function publicNavigation(active = 'home') {
  const links=[['home','Home'],['feature','Feature'],['product','Product'],['faq','FAQ']];
  return `<header class="pub-header"><div class="pub-nav-wrap"><a class="pub-logo" href="#landing" aria-label="FERMA, halaman awal">${fermaLogo()}</a><nav class="pub-nav ${publicMenuOpen?'is-open':''}" id="public-navigation" aria-label="Menu utama">${links.map(([id,label])=>`<a class="pub-nav-link ${active===id?'is-active':''}" href="#${id}" ${active===id?'aria-current="location"':''}>${label}</a>`).join('')}</nav><div class="pub-account"><a class="pub-login-link" href="#masuk">Masuk</a><a class="pub-button pub-button-primary pub-register" href="#daftar">Daftar</a><button class="pub-menu-toggle" type="button" data-public-action="menu" aria-controls="public-navigation" aria-expanded="${publicMenuOpen}" aria-label="${publicMenuOpen?'Tutup':'Buka'} menu">${icon(publicMenuOpen?'close':'menu')}</button></div></div></header>`;
}

function landingPage(active) {
  return `${publicNavigation(active==='landing'?'home':active)}<main id="main" class="pub-main" tabindex="-1">
    <section id="home" class="pub-hero"><div class="pub-container pub-hero-grid"><div class="pub-hero-copy"><p class="pub-intro">Pendamping fermentasi kakao</p><h1>Fermentasi kakao,<br>lebih mudah dipantau.</h1><p>Kenali perkembangan fermentasi dalam satu tempat. FERMA membantu petani dan kelompok tani memantau kondisi kakao serta mencatat tindakan selama proses berlangsung.</p><div class="pub-hero-actions"><a class="pub-button pub-button-primary" href="#product">Kenali FERMA ${icon('leaf')}</a><a class="pub-text-link" href="#masuk">Masuk ke aplikasi ${icon('arrow')}</a></div><div class="pub-audience">${icon('pin')}<span>Dirancang untuk petani dan kelompok tani kakao.</span></div></div><figure class="pub-hero-art"><div class="pub-art-backdrop"></div><img src="assets/ferma-kebun.png" width="1448" height="1086" alt="Petani memeriksa kotak fermentasi kakao dengan sensor dan tablet" fetchpriority="high"></figure></div><div class="pub-hero-bottom"><span>Kenali kondisinya.</span><span>Catat tindakannya.</span><span>Pelajari setiap batch.</span></div></section>

    <section id="feature" class="pub-section pub-features"><div class="pub-container"><div class="pub-section-heading"><p class="pub-intro">Fitur FERMA</p><h2>Mendampingi proses,<br>dari awal hingga selesai.</h2><p>Informasi yang mudah dipahami untuk kegiatan fermentasi sehari-hari.</p></div><div class="pub-feature-grid">${[
      ['temp','Pantau kondisi kakao','Tinjau suhu dan perkembangan setiap batch fermentasi.'],
      ['bell','Kenali saat perlu perhatian','Lihat peringatan untuk membantu pemeriksaan di lapangan.'],
      ['book','Simpan catatan proses','Catat pembalikan, pengambilan sampel, dan hasil pemeriksaan.']
    ].map(([ico,title,body])=>`<article class="pub-feature"><span class="pub-feature-icon">${icon(ico)}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section>

    <section id="product" class="pub-section pub-product"><div class="pub-container"><div class="pub-product-panel"><figure class="pub-product-art"><img src="assets/ferma-kotak.png" width="1448" height="1086" alt="Kotak fermentasi FERMA, probe sensor, dan perangkat pemantauan" loading="lazy"></figure><div class="pub-product-copy"><p class="pub-intro">Mengenal produk</p><h2>Kotak fermentasi.<br>Sensor. Satu aplikasi.</h2><p>Pantau perkembangan kakao dan kelola catatan proses dari satu tempat.</p><ul class="pub-product-points"><li>${icon('check')}<span><strong>Kotak fermentasi</strong>Tempat pengolahan biji kakao per batch.</span></li><li>${icon('check')}<span><strong>Pemantauan kondisi</strong>Suhu dan perkembangan selama fermentasi.</span></li><li>${icon('check')}<span><strong>Riwayat proses</strong>Catatan tindakan dan hasil pemeriksaan.</span></li></ul><a class="pub-button pub-button-primary" href="#masuk">Buka aplikasi ${icon('arrow')}</a></div></div></div></section>

    <section class="pub-section pub-process"><div class="pub-container pub-process-grid"><div><p class="pub-intro">Alur sederhana</p><h2>Mulai dari satu batch.</h2><p>Catatan yang teratur membantu Anda memahami setiap proses fermentasi.</p></div><ol class="pub-steps"><li><span>1</span><div><h3>Siapkan batch</h3><p>Catat bahan dan waktu mulai fermentasi.</p></div></li><li><span>2</span><div><h3>Pantau perkembangannya</h3><p>Tinjau kondisi yang perlu diperhatikan.</p></div></li><li><span>3</span><div><h3>Catat tindakan</h3><p>Simpan pemeriksaan hingga batch selesai.</p></div></li></ol></div></section>

    <section id="faq" class="pub-section pub-faq"><div class="pub-container pub-faq-grid"><div class="pub-faq-heading"><p class="pub-intro">Pertanyaan umum</p><h2>Kenali FERMA<br>lebih dekat.</h2></div><div class="pub-faq-list">${[
      ['Apa itu FERMA?','FERMA membantu petani dan kelompok tani memantau fermentasi kakao serta mencatat proses setiap batch.'],
      ['Untuk siapa FERMA dibuat?','Untuk petani, operator kelompok tani kakao, dan tim riset.'],
      ['Apa saja yang dapat dicatat?','Batch, pembalikan biji, pengambilan sampel, dan hasil laboratorium.'],
      ['Di mana riwayat fermentasi dapat dilihat?','Buka menu Batch fermentasi, lalu pilih batch untuk melihat riwayat tindakannya.'],
      ['Apakah FERMA bisa dibuka lewat ponsel?','Ya. FERMA menyesuaikan tampilan untuk ponsel, tablet, dan komputer.']
    ].map(([q,a])=>`<details class="pub-faq-item"><summary>${q}<span class="pub-faq-plus" aria-hidden="true">+</span></summary><div class="pub-faq-answer"><p>${a}</p></div></details>`).join('')}</div></div></section>

    <section class="pub-section pub-final-cta"><div class="pub-container"><div class="pub-cta-inner"><span class="pub-cta-leaf" aria-hidden="true">${icon('leaf')}</span><div><h2>Kenali proses fermentasi Anda.</h2><p>Mulai memahami catatan setiap batch bersama FERMA.</p></div><a class="pub-button pub-button-light" href="#daftar">Daftar ${icon('arrow')}</a></div></div></section>
  </main><footer class="pub-footer"><div class="pub-container pub-footer-main"><div><a class="pub-logo" href="#landing" aria-label="FERMA, halaman awal">${fermaLogo()}</a><p>Teknologi untuk mendampingi<br>fermentasi kakao rakyat.</p></div><div class="pub-footer-links"><strong>Jelajahi FERMA</strong><a href="#home">Home</a><a href="#feature">Feature</a><a href="#product">Product</a><a href="#faq">FAQ</a></div><div class="pub-footer-links"><strong>Ruang aplikasi</strong><a href="#masuk">Masuk</a><a href="#daftar">Daftar</a><a href="#presentasi">Tentang FERMA</a></div></div><div class="pub-container pub-footer-bottom"><span>© 2026 FERMA</span><p>Pendamping fermentasi kakao.</p></div></footer>`;
}

function accountPage(signup = false) {
  return `<div class="auth-page"><header class="auth-header"><a class="pub-logo" href="#landing" aria-label="FERMA, halaman awal">${fermaLogo()}</a><a class="pub-text-link" href="#landing">${icon('back')}Kembali ke beranda</a></header><main id="main" class="auth-main" tabindex="-1"><section class="auth-visual"><p class="pub-intro">Pendamping fermentasi kakao</p><h1>Setiap proses<br>punya cerita.</h1><p>Pantau perkembangan dan simpan catatan fermentasi Anda bersama FERMA.</p><img src="assets/ferma-kebun.png" width="1448" height="1086" alt="Petani dan kotak fermentasi kakao FERMA"><span class="auth-visual-caption">Dari kebun, untuk proses yang lebih terarah.</span></section><section class="auth-form-panel" aria-labelledby="account-title"><div class="auth-form-card"><p class="pub-intro">${signup?'Mulai bersama FERMA':'Selamat datang kembali'}</p><h2 id="account-title">${signup?'Daftar akun':'Masuk ke FERMA'}</h2><p class="auth-description">${signup?'Catat dan pantau fermentasi kakao Anda.':'Lanjutkan pemantauan fermentasi Anda.'}</p><form id="public-account-form" autocomplete="off" novalidate data-account-mode="${signup?'signup':'login'}">${signup?'<label class="auth-field" for="signup-name">Nama lengkap<input id="signup-name" name="display_name" type="text" placeholder="Nama Anda" autocomplete="off"></label>':''}<label class="auth-field" for="account-email">Email<input id="account-email" name="email" type="email" inputmode="email" placeholder="nama@contoh.id" autocomplete="off"></label><label class="auth-field" for="account-password">Kata sandi<span class="auth-password-wrap"><input id="account-password" name="password" type="password" placeholder="Kata sandi Anda" autocomplete="${signup?'new-password':'off'}"><button type="button" class="auth-show-password" data-public-action="password" aria-label="Tampilkan kata sandi" aria-pressed="false">${icon('eye')}</button></span></label>${signup?'<label class="auth-field" for="account-confirm">Konfirmasi kata sandi<input id="account-confirm" name="password_confirmation" type="password" placeholder="Ulangi kata sandi" autocomplete="new-password"></label>':''}<button class="pub-button pub-button-primary auth-submit" type="submit">${signup?'Daftar':'Masuk'}</button></form><p class="auth-switch">${signup?'Sudah punya akun? <a href="#masuk">Masuk</a>':'Belum punya akun? <a href="#daftar">Daftar</a>'}</p></div></section></main><footer class="auth-footer">© 2026 FERMA</footer></div>`;
}

function renderPublicPage(page) {
  const signup=page==='daftar';
  document.body.classList.add('visitor-page');
  app.innerHTML=page==='masuk'||signup?accountPage(signup):landingPage(page);
  document.title=`${signup?'Daftar':page==='masuk'?'Masuk':'Fermentasi kakao lebih mudah dipantau'} | FERMA`;
}

function scrollPublicSection(page) {
  if(['feature','product','faq'].includes(page))document.getElementById(page)?.scrollIntoView();
  else window.scrollTo(0,0);
}

window.addEventListener('load',()=>{
  if(publicRoutes.has(route()))scrollPublicSection(route());
},{once:true});

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-public-action]');
  if(!target)return;
  if(target.dataset.publicAction==='menu'){
    publicMenuOpen=!publicMenuOpen;
    document.querySelector('.pub-nav')?.classList.toggle('is-open',publicMenuOpen);
    target.setAttribute('aria-expanded',String(publicMenuOpen));
    target.setAttribute('aria-label',`${publicMenuOpen?'Tutup':'Buka'} menu`);
    target.innerHTML=icon(publicMenuOpen?'close':'menu');
  }
  if(target.dataset.publicAction==='password'){
    const input=document.querySelector('#account-password');
    const show=input.type==='password';
    input.type=show?'text':'password';
    target.setAttribute('aria-pressed',String(show));
    target.setAttribute('aria-label',show?'Sembunyikan kata sandi':'Tampilkan kata sandi');
  }
});

document.addEventListener('submit',event=>{
  if(event.target.id!=='public-account-form')return;
  event.preventDefault();
  const signup=event.target.dataset.accountMode==='signup';
  event.target.reset();
  goto(signup?'masuk':'overview');
  if(signup)toast('Silakan masuk untuk melanjutkan.');
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&publicMenuOpen){
    publicMenuOpen=false;
    document.querySelector('.pub-nav')?.classList.remove('is-open');
    const trigger=document.querySelector('[data-public-action="menu"]');
    trigger?.setAttribute('aria-expanded','false');
    trigger?.setAttribute('aria-label','Buka menu');
    if(trigger){trigger.innerHTML=icon('menu');trigger.focus();}
  }
});
