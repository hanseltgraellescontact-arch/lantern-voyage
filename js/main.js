/* App core: screen switching and start-up. */
var App = (function () {
  var screens = {};
  var current = null;

  function register(name, fn) { screens[name] = fn; }
  function go(name, args) {
    var p0 = Store.active(), harbor = !!(p0 && p0.course === 'harbor');
    // one engine, two courses: the harbor course has its own town map and district screens
    if (name === 'map' && harbor) name = 'town';
    if (name === 'island' && args && CONTENT.islands[args.id] && CONTENT.islands[args.id].course === 'harbor') name = 'district';
    if (name === 'restore' && harbor) { name = 'boat'; args = { new: true, id: args && args.id }; }
    document.body.classList.toggle('g1', harbor && name !== 'title' && name !== 'parent');
    Audio2.stop();
    if (Audio2.holdMusic) { Audio2.holdMusic(false, 'activity'); Audio2.holdMusic(false, 'youtube'); }
    current = name;
    var app = document.getElementById('app');
    app.innerHTML = '';
    window.scrollTo(0, 0);
    if (window.Maze) Maze.stop();
    if (window.Arcade) Arcade.stop();
    Array.prototype.forEach.call(document.querySelectorAll('.confetti'), function (c) { c.remove(); });
    screens[name](app, args || {});
    if (Audio2.setTrack) Audio2.setTrack(name === 'maze' || name === 'game' || name === 'arcade' ? 'arcade' : name === 'title' || name === 'parent' ? 'title' :
      harbor ? (name === 'quest' ? 'hquest' : 'htown') : name === 'quest' ? 'quest' : 'sea');
    var p = Store.active();
    clock();
    var old = document.querySelector('.preview-banner');
    if (old) old.remove();
    if (p && p.preview && name !== 'title' && name !== 'parent') {
      var b = document.createElement('div'); b.className = 'preview-banner noprint';
      b.textContent = 'PARENT PREVIEW — progress here never touches your children\'s profiles';
      document.body.appendChild(b);
    }
  }
  function screen() { return current; }

  /* parrot helper used on many screens */
  function parrotName() { var p = Store.active(); if (buddyIsEli()) return 'Grandpa Eli'; return (p && p.parrotName) || 'Pip'; }

  /* course helpers: 'voyage' (2nd–3rd grade) or 'harbor' (K5 review + 1st grade) */
  function course() { var p = Store.active(); return (CONTENT.courses || {})[(p && p.course) || 'voyage'] || {}; }
  function isHarbor() { var p = Store.active(); return !!(p && p.course === 'harbor'); }
  // In the harbor, Grandpa Eli is the helper until the parrot egg hatches.
  function buddyIsEli() { var p = Store.active(); return !!(p && p.course === 'harbor' && !(p.egg && p.egg.hatched)); }
  function buddyArt(size, mood) { var p = Store.active(); return buddyIsEli() ? Art.keeper('eli', size * 1.1) : Art.parrot(size, mood, p && p.parrot); }
  function home() { return isHarbor() ? 'town' : 'map'; }

  /* Active-time tracker for the parent's course-hours log: counts time only while this page is visible,
     a child profile is playing (not the title or parent screens), and someone touched the keyboard/mouse in the last 2 minutes. */
  var lastInput = Date.now();
  function trackTime() {
    ['pointerdown', 'keydown', 'wheel'].forEach(function (ev) { document.addEventListener(ev, function () { lastInput = Date.now(); }, true); });
    var tick = 0;
    setInterval(function () {
      var p = Store.active();
      if (!p || p.preview || current === 'title' || current === 'parent') return;
      if (document.visibilityState !== 'visible' || Date.now() - lastInput > 120000) return;
      Store.addTime(p, 5);
      if (++tick % 6 === 0) Store.save();
      clock();
    }, 5000);
  }
  /* Today's practice time, in the top corner for the parent to see. It counts active play only and starts over each day. */
  function clock() {
    var el = document.getElementById('sessclock'), p = Store.active();
    var show = p && !p.preview && current && current !== 'title' && current !== 'parent' && current !== 'builder';
    if (!show) { if (el) el.style.display = 'none'; return; }
    // sit inside the screen's top bar when it has one, so the clock never covers a button
    var bar = document.querySelector('#app .topbar') || document.querySelector('.topbar');
    var home = bar || document.body;
    if (!el || el.parentNode !== home) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      el = document.createElement('div'); el.id = 'sessclock'; el.className = 'sessclock noprint' + (bar ? ' inbar' : ''); el.title = 'Practice time today (active play only)';
      home.appendChild(el);
    }
    var secs = (p.time && p.time[U.today()]) || 0, m = Math.floor(secs / 60), h = Math.floor(m / 60);
    el.textContent = '⏱ Today ' + (h ? h + ' h ' + (m % 60) + ' min' : m + ' min');
    el.style.display = '';
  }

  function start() {
    Store.load();
    // when the game is hosted on a website (for the iPad), keep a copy on the device so it works offline
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) { try { navigator.serviceWorker.register('sw.js'); } catch (e) {} }
    trackTime();
    // first user gesture unlocks audio in browsers
    document.addEventListener('pointerdown', function once() {
      Audio2.startMusic(); document.removeEventListener('pointerdown', once);
    });
    go('title');
  }
  return { register: register, go: go, screen: screen, parrotName: parrotName, start: start, course: course, isHarbor: isHarbor, buddyIsEli: buddyIsEli, buddyArt: buddyArt, home: home };
})();

window.addEventListener('DOMContentLoaded', App.start);
