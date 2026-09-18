// Keeps the app working without a connection, e.g. in a club with no signal.
// Bump VERSION whenever the site is published again, so visitors get the new files.
const VERSION="vinyl-labels-v1";
const FILES=["./", "index.html", "manifest.webmanifest", "vendor/qrcode.min.js", "fonts/fonts.css", "fonts/2sDcZGJYnIjSi6H75xkzZmW5Kb8VZBHR.woff2", "fonts/2sDcZGJYnIjSi6H75xkzaGW5Kb8VZA.woff2", "fonts/2sDcZGJYnIjSi6H75xkzamW5Kb8VZBHR.woff2", "fonts/tss0ApVBdCYD5Q7hcxTE1ArZ0bb-iXxw2d8oBxk.woff2", "fonts/tss0ApVBdCYD5Q7hcxTE1ArZ0bb_iXxw2d8oBxk.woff2", "fonts/tss0ApVBdCYD5Q7hcxTE1ArZ0bbwiXxw2d8o.woff2", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-32.png", "icons/icon-512.png", "icons/icon.svg"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// network first, so a new version shows up at once; the saved copy when offline
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{
    const copy=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copy));return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
