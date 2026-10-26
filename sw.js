// Guarda o app para funcionar sem internet e atualiza em segundo plano.
// A cada atualização publicada no GitHub, suba o número abaixo (v1 → v2 → v3...).
const CACHE='orcamentos-v3';
const ARQS=['./','index.html','mtm.html','3d.html','orcamentos.webmanifest','html2pdf.bundle.min.js',
  'app-icon-192.png','app-icon-512.png','app-icon-apple-180.png',
  'mtm-icon-192.png','3d-icon-192.png','logo-mtm.png','logo-alves3d.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net;
  }));
});
