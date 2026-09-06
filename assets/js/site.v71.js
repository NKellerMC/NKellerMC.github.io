window.THERAN=window.THERAN||{};
window.THERAN.cleanups=window.THERAN.cleanups||{};
window.THERAN.mountSite=()=>{
  window.THERAN.cleanups.site?.();
  'use strict';
  const controller=new AbortController();
  const signal=controller.signal;
  document.querySelectorAll('.nav-lang,[data-lang-switch]').forEach(link=>link.remove());
  const header=document.querySelector('.site-header');
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-nav');
  const page=document.body.dataset.page;
  if(nav&&page){nav.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===page)a.setAttribute('aria-current','page')})}

  function closeMenu(){
    toggle?.classList.remove('open');nav?.classList.remove('open');document.body.classList.remove('menu-open');toggle?.setAttribute('aria-expanded','false');
  }
  toggle?.addEventListener('click',()=>{
    const open=!!nav&&!nav.classList.contains('open');
    nav?.classList.toggle('open',open);toggle.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));
  },{signal});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()},{signal});
  addEventListener('resize',()=>{if(innerWidth>820)closeMenu()},{passive:true,signal});

  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  document.querySelectorAll('[data-optional-image]').forEach(slot=>{
    const src=slot.dataset.optionalImage;
    if(!src||slot.classList.contains('has-image'))return;
    const image=new Image();
    image.className=slot.dataset.imageClass||'optional-image';
    image.alt=slot.dataset.imageAlt||'';
    image.loading='lazy';
    image.decoding='async';
    image.addEventListener('load',()=>{
      if(signal.aborted)return;
      slot.prepend(image);
      slot.classList.add('has-image');
    },{once:true});
    image.src=src;
  });

  document.querySelectorAll('a[href]').forEach(a=>{
    const raw=a.getAttribute('href')||'';
    if(!raw||raw.startsWith('#')||/^(https?:|mailto:|tel:)/i.test(raw))return;
    a.addEventListener('click',()=>{
      closeMenu();
      try{sessionStorage.setItem('theran-link-navigation','1')}catch{}
    },{signal});
  });
  addEventListener('pageshow',()=>{
    closeMenu();
    try{
      if(sessionStorage.getItem('theran-link-navigation')==='1'){
        sessionStorage.removeItem('theran-link-navigation');
        requestAnimationFrame(()=>scrollTo({top:0,left:0,behavior:'instant'}));
      }
    }catch{}
  },{signal});

  if(!window.THERAN.hygieneDone){
    window.THERAN.hygieneDone=true;
    if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{})}
    if('caches' in window){caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('theran-')).map(k=>caches.delete(k)))).catch(()=>{})}
  }

  const headerInner=document.querySelector('.header-inner');
  if(header&&headerInner){
    const syncHeader=()=>header.classList.toggle('is-scrolled',scrollY>36);syncHeader();addEventListener('scroll',syncHeader,{passive:true,signal});
    if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      let raf=0;headerInner.addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=headerInner.getBoundingClientRect();headerInner.style.setProperty('--header-glass-x',(((e.clientX-r.left)/r.width)*100).toFixed(1)+'%');headerInner.style.setProperty('--header-glass-y',(((e.clientY-r.top)/r.height)*100).toFixed(1)+'%')})},{passive:true,signal});
    }
  }
  const cleanup=()=>controller.abort();
  window.THERAN.cleanups.site=cleanup;
  return cleanup;
};
window.THERAN.mountSite();
export {};
