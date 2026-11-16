/* Offline support when the game is hosted on a website (it is not used when opening index.html from a folder).
   Everything the game loads is kept in the device's cache, so it keeps working without internet.
   Bump VERSION whenever the game files change, so devices pick up the new version. */
var VERSION = 'lv-9';
var CORE = ['./', 'index.html', 'css/style.css', 'manifest.json'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  var isCode = /\.(html|js|css|json)$|\/$/.test(new URL(req.url).pathname);
  // code: try the network first (so updates arrive), fall back to the saved copy; sounds and pictures: saved copy first
  e.respondWith(isCode ?
    fetch(req).then(function (res) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); return res; }).catch(function () { return caches.match(req, { ignoreSearch: true }); }) :
    caches.match(req).then(function (hit) { return hit || fetch(req).then(function (res) { if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); } return res; }); }));
});
