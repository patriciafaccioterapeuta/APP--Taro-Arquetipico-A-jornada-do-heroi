/* Cache simples: funciona offline depois do primeiro acesso. */
var V='taro-v3',SHELL=['./','index.html','style.css','app.js','data.js','manifest.webmanifest','hero.jpg','capa.jpg','cormorant-garamond-latin-700-normal.woff2','cormorant-garamond-latin-600-normal.woff2','lora-latin-400-normal.woff2','poppins-latin-400-normal.woff2'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  var heavy=/\/(rws_|mars_|diario|hero|capa|icon)/.test(r.url);
  e.respondWith(heavy?caches.match(r).then(function(m){return m||fetch(r).then(function(x){var c=x.clone();caches.open(V).then(function(ca){ca.put(r,c)});return x})})
   :fetch(r).then(function(x){var c=x.clone();caches.open(V).then(function(ca){ca.put(r,c)});return x}).catch(function(){return caches.match(r)}))});
