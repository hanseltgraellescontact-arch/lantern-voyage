/* Sea map, island, Lantern Story, shipyard, logbook, island restoration. */
var World = (function () {
  var SHOP = {
    sail: { label: 'Sails', items: [['white', 'White', 0], ['sky', 'Sky blue', 30], ['sunset', 'Sunset', 40], ['berry', 'Berry', 40], ['mint', 'Mint', 40], ['royal', 'Royal blue', 60], ['gold', 'Gold', 80]] },
    pattern: { label: 'Sail pattern', items: [['none', 'Plain', 0], ['stripes', 'Stripes', 50], ['dots', 'Dots', 50], ['stars', 'Stars', 70], ['fish', 'Fish', 70]] },
    flag: { label: 'Flag (blue & white)', items: [['wave', 'Wave', 0], ['fish', 'Fish', 30], ['star', 'Star', 30], ['lantern', 'Lantern', 40], ['heart', 'Heart', 40], ['cross', 'Cross', 40]] },
    figure: { label: 'Figurehead', items: [['none', 'None', 0], ['dolphin', 'Dolphin', 90], ['turtle', 'Turtle', 90], ['lion', 'Lion', 120], ['eagle', 'Eagle', 120]] },
    glow: { label: 'Lantern glow', items: [['gold', 'Gold', 0], ['aqua', 'Aqua', 40], ['rose', 'Rose', 40], ['lime', 'Lime', 40]] }
  };

  function hud(p, opts) {
    if (p.course === 'harbor' && window.Harbor) return Harbor.hud(p, opts);
    opts = opts || {};
    return '<div class="topbar noprint">' +
      (opts.back ? '<button class="iconbtn" data-back="1" aria-label="Back">←</button>' : '<button class="iconbtn" data-home="1" aria-label="Change captain">⌂</button>') +
      '<div class="pill">' + Art.captain(p.captain, 34).replace('<svg', '<svg style="margin:-6px 0"') + U.esc(p.name) + '</div>' +
      '<div class="pill">' + Art.icon('shellcoin', 26) + '<span data-shells>' + p.shells + '</span></div>' +
      '<div class="spacer"></div>' + (opts.extra || '') +
      '<button class="btn small blue" data-arcade="1" ' + (p.arcadeTokens > 0 ? '' : 'disabled title="Earn a token every three quests"') + '>🕹 Arcade Cove (' + p.arcadeTokens + ')</button>' +
      '<button class="btn small plain" data-ship="1">⚓ Shipyard</button><button class="btn small plain" data-log="1">📖 Logbook</button>' +
      '</div>';
  }
  function bindHud(root, back) {
    if (App.isHarbor() && window.Harbor) return Harbor.bindHud(root, back);
    var b;
    if ((b = U.$('[data-back]', root))) b.onclick = back;
    if ((b = U.$('[data-home]', root))) b.onclick = function () { App.go('title'); };
    U.$('[data-arcade]', root).onclick = function () { App.go('arcade'); };
    U.$('[data-ship]', root).onclick = function () { App.go('shipyard'); };
    U.$('[data-log]', root).onclick = function () { App.go('logbook'); };
  }

  function questUnlocked(p, isl, q) {
    if (p.preview) return true;
    if (q.num === 1) return true;
    var prev = isl.quests[q.num - 2];
    return Store.questState(p, isl.id, prev.id).done;
  }
  function nextQuest(p, isl) {
    for (var i = 0; i < isl.quests.length; i++) if (!Store.questState(p, isl.id, isl.quests[i].id).done) return isl.quests[i];
    return null;
  }

  /* ------------ map ------------ */
  App.register('map', function (root) {
    var p = Store.active(), sea = CONTENT.seas[0];
    var shipAt = p.lastIsland || 'P14';
    var at = sea.islands.filter(function (i) { return i.id === shipAt; })[0] || sea.islands[0];
    var svg = '<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet">' +
      '<defs><radialGradient id="seag" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#5fd6f5"/><stop offset=".6" stop-color="#2ab3e6"/><stop offset="1" stop-color="#1679b8"/></radialGradient></defs>' +
      '<rect width="1200" height="700" rx="30" fill="url(#seag)" stroke="#2b2a3a" stroke-width="5"/>';
    for (var w = 0; w < 26; w++) {
      var wx = (w * 173) % 1150 + 20, wy = (w * 97) % 640 + 30;
      svg += '<path d="M' + wx + ' ' + wy + ' q10 -8 20 0 t20 0" stroke="#bfeaff" stroke-width="3" fill="none" opacity=".6"/>';
    }
    // scenery: sea stacks, rocks, fish schools, a whale spout, clouds and their shadows
    svg += '<g opacity=".18" fill="#0b4a73"><ellipse cx="300" cy="200" rx="120" ry="40"/><ellipse cx="1050" cy="620" rx="140" ry="44"/></g>';
    svg += Art.stack(120, 200, .45) + Art.stack(1120, 140, .5, '#b9b1a6') + Art.stack(1130, 450, .35, '#9ea8b8');
    [[90, 640, .9], [600, 650, .7], [860, 120, .8], [300, 360, .6], [1150, 650, .7], [610, 380, .55]].forEach(function (r) { svg += Art.rock(r[0], r[1], r[2]); });
    svg += '<g opacity=".35" fill="#0b4a73">' + [[820, 400], [845, 410], [830, 425], [160, 520], [180, 530]].map(function (f) { return '<path d="M' + f[0] + ' ' + f[1] + ' q8 -6 16 0 q-8 6 -16 0z M' + (f[0] + 16) + ' ' + f[1] + ' l6 -4 v8z"/>'; }).join('') + '</g>';
    svg += '<g transform="translate(560,150)"><path d="M-40 10 q40 -30 80 0 q-40 16 -80 0z" fill="#3a5f86" stroke="#2b2a3a" stroke-width="3"/><path d="M0 -6 q-6 -20 -16 -26 M0 -6 q6 -20 16 -26 M0 -6 v-28" stroke="#dff6ff" stroke-width="4" stroke-linecap="round" fill="none"/></g>';
    svg += '<g class="drift">' + Art.cloud(340, 120, .7) + Art.cloud(980, 560, .6) + '</g>';
    for (var sp = 0; sp < 18; sp++) { var sx = (sp * 331) % 1150 + 25, sy = (sp * 199) % 640 + 30; svg += '<path d="M' + sx + ' ' + (sy - 6) + ' v12 M' + (sx - 6) + ' ' + sy + ' h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>'; }
    var pts = sea.islands.map(function (i) { return i.x + ',' + i.y; }).join(' ');
    svg += '<polyline points="' + pts + '" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" opacity=".7"/>';
    svg += '<text x="600" y="60" text-anchor="middle" font-size="40" font-weight="800" fill="#fff" stroke="#0b4a73" stroke-width="6" paint-order="stroke">' + sea.name + '</text>';
    function sailable(idx) { // an island opens once the one before it is lit (a parent preview opens everything)
      var i = sea.islands[idx]; if (!CONTENT.islands[i.id]) return false;
      if (idx === 0 || p.preview) return true;
      var prev = p.progress[sea.islands[idx - 1].id]; return !!(prev && prev.lit) || !!(p.progress[i.id] && p.progress[i.id].pretestDone);
    }
    sea.islands.forEach(function (i, idx) {
      var built = sailable(idx);
      var st = p.progress[i.id];
      var isl = CONTENT.islands[i.id], badge = '';
      if (built) { var nq = nextQuest(p, isl); badge = st && st.lit ? '✓' : (nq ? nq.num : ''); }
      svg += Art.mapIsland({ id: i.id, name: i.name, kind: i.kind, x: i.x, y: i.y, lit: st && st.lit, locked: !built, badge: badge });
    });
    svg += '<g id="mapship" style="transition:transform 1.4s ease-in-out" transform="translate(' + (at.x - 150) + ',' + (at.y + 20) + ')"><g class="bob">' +
      Art.ship(p.ship, 140).replace(/<svg[^>]*>/, '<svg x="0" y="0" width="140" height="100" viewBox="0 0 280 200">') + '</g></g>';
    svg += '<g transform="translate(1080,600)"><circle r="44" fill="#fff" opacity=".85"/><path d="M0 -36 l8 30 l-8 6 l-8 -6z" fill="#e5533d"/><path d="M0 36 l8 -30 l-8 -6 l-8 6z" fill="#22335e"/><text y="-48" text-anchor="middle" font-weight="800" fill="#fff">N</text></g>';
    svg += '</svg>';
    root.innerHTML = '<div class="screen sea" style="padding-top:12px">' + hud(p) + '<div class="mapwrap">' + svg + '</div>' +
      '<div class="hud" style="position:static;justify-content:center">' + Art.parrot(70) +
      '<div class="speaker"><div class="bubble">Tap an island to sail there! The islands in the fog are still ahead of us.</div></div></div></div>';
    bindHud(root);
    U.$$('.map-island', root).forEach(function (g) {
      g.onclick = function () {
        var id = g.getAttribute('data-island');
        var info = sea.islands.filter(function (i) { return i.id === id; })[0];
        var ix = sea.islands.indexOf(info);
        if (CONTENT.islands[id] && !sailable(ix)) {
          Audio2.speak('First let\'s relight the lighthouse on ' + sea.islands[ix - 1].name + '. Then we can sail to ' + info.name + '!', { who: 'parrot' });
          U.toast('Light ' + sea.islands[ix - 1].name + ' first'); return;
        }
        if (!CONTENT.islands[id]) {
          Audio2.speak(info.name + ' is still covered in fog. We will sail there later in our voyage!', { who: 'parrot' });
          U.toast(info.name + ': coming later in the voyage');
          return;
        }
        var ship = U.$('#mapship', root);
        ship.setAttribute('transform', 'translate(' + (info.x - 150) + ',' + (info.y + 20) + ')');
        Audio2.sfx('whoosh');
        p.lastIsland = id; Store.save();
        setTimeout(function () { App.go('island', { id: id }); }, shipAt === id ? 200 : 1400);
      };
    });
    if (!p.mapHintSeen) { Audio2.speak('Ahoy, Captain! This is the map of the Home Waters. Tap Slice Isle to sail there.', { who: 'parrot' }); p.mapHintSeen = true; Store.save(); }
  });

  /* ------------ island: a level map with one lantern stop per quest ------------ */
  var STOPS = [[95, 520], [285, 545], [490, 520], [700, 545], [900, 430], [705, 345], [495, 365], [285, 340], [105, 235], [330, 130], [640, 115]];
  function stopsFor(isl) { var n = isl.quests.length + 1; return n >= STOPS.length ? STOPS : STOPS.slice(0, n - 1).concat([STOPS[STOPS.length - 1]]); }
  function stopState(p, isl, idx) {
    // idx 0 = Lighthouse Check (pretest); 1..n = quests
    var st = Store.islandState(p, isl.id);
    if (idx === 0) return { done: !!st.pretestDone, open: true, current: !st.pretestDone && !p.preview };
    var q = isl.quests[idx - 1], qs = Store.questState(p, isl.id, q.id), nq = nextQuest(p, isl);
    var gate = st.pretestDone || p.preview;
    return { q: q, qs: qs, done: qs.done, open: p.preview || (gate && (qs.done || nq === q)), current: gate && nq === q };
  }
  function levelMap(p, isl) {
    var st = Store.islandState(p, isl.id), O = '#2b2a3a';
    var svg = '<svg viewBox="0 0 1000 640" class="levelmap" preserveAspectRatio="xMidYMid meet">' +
      '<defs><linearGradient id="lmsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc4f0"/><stop offset="1" stop-color="#1d8fd0"/></linearGradient>' +
      '<radialGradient id="lmglow"><stop offset="0" stop-color="#fff4a8" stop-opacity=".95"/><stop offset="1" stop-color="#fff4a8" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1000" height="640" rx="28" fill="url(#lmsea)"/>';
    // sparkles and wave marks
    for (var w = 0; w < 40; w++) { var wx = (w * 263) % 960 + 20, wy = (w * 151) % 600 + 20; svg += '<path d="M' + wx + ' ' + wy + ' q8 -6 16 0 t16 0" stroke="#bdeeff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>'; }
    // decorative rocks and a fish shadow
    [[60, 380, 1], [960, 600, .8], [560, 230, .9], [940, 70, 1.1], [180, 610, .7]].forEach(function (r) { svg += Art.rock(r[0], r[1], r[2]); });
    svg += '<g opacity=".25" fill="#0b4a73"><path d="M840 560 q20 -12 40 0 q-20 12 -40 0z M880 560 l10 -7 v14z"/><path d="M420 600 q14 -9 28 0 q-14 9 -28 0z M448 600 l8 -5 v10z"/></g>';
    // the bakery island with Abuela Rosa's shop and the big lighthouse
    svg += '<g transform="translate(860,190)">' + Art.islet(130, 52, true) + (isl.id === 'P15' ? Art.kiteShop(-58, -78) : isl.id === 'P16' ? Art.weatherStation(-50, -96) : isl.id === 'P17' ? Art.caravanTent(-62, -84) : Art.bakery(-58, -78)) + Art.palm(70, -10, .8) + '</g>';
    // stepping stones between stops
    var SP = stopsFor(isl);
    for (var i = 0; i < SP.length - 1; i++) {
      var a = SP[i], b = SP[i + 1], done = stopState(p, isl, i).done;
      for (var t = 1; t < 4; t++) {
        var x = a[0] + (b[0] - a[0]) * t / 4, y = a[1] + (b[1] - a[1]) * t / 4;
        svg += '<ellipse cx="' + x + '" cy="' + (y + 10) + '" rx="13" ry="7" fill="' + (done ? '#f4d58d' : '#c8b48a') + '" stroke="' + O + '" stroke-width="2.5"/>';
      }
    }
    SP.forEach(function (pos, idx) {
      var s = stopState(p, isl, idx), isBoss = idx === SP.length - 1, isReview = idx === SP.length - 2;
      var g = '<g class="stop' + (s.open ? '' : ' locked') + (s.current ? ' current' : '') + '" data-stop="' + idx + '" transform="translate(' + pos[0] + ',' + pos[1] + ')">';
      if (s.current) g += '<circle r="70" fill="url(#lmglow)" class="pulse"/>';
      g += Art.islet(isBoss ? 78 : 62, isBoss ? 30 : 24, s.open);
      if (isBoss) g += Art.lighthouseO(0, 6, 1.05, st.lit);
      else if (idx === 0) g += Art.compassPost(s.done);
      else g += Art.lanternPost(s.done, isReview);
      // number badge
      var label = idx === 0 ? '🧭' : isReview ? '⚓' : isBoss ? '' : String(idx);
      if (label) g += '<g transform="translate(34,-56)"><circle r="17" fill="' + (s.done ? '#ffc23c' : s.open ? '#ffffff' : '#c9cfd6') + '" stroke="' + O + '" stroke-width="3"/>' +
        '<text y="7" text-anchor="middle" font-size="' + (label.length > 1 ? 16 : 19) + '" font-weight="800" fill="' + O + '">' + label + '</text></g>';
      if (!s.open) g += '<g transform="translate(0,-30)"><rect x="-11" y="-4" width="22" height="18" rx="4" fill="#8a8f99" stroke="' + O + '" stroke-width="2.5"/><path d="M-6 -4 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="' + O + '" stroke-width="3"/></g>';
      if (s.qs && (s.qs.done || s.qs.attempts)) g += '<g transform="translate(0,40)">' + [0, 1, 2].map(function (k) { return Art.star((k - 1) * 22, 0, 10, k < s.qs.stars ? '#ffc23c' : '#e2e2e2', true); }).join('') + '</g>';
      var name = idx === 0 ? 'Lighthouse Check' : s.q.title;
      g += '<text class="stoplbl" y="' + (s.qs && (s.qs.done || s.qs.attempts) ? 70 : 52) + '" text-anchor="middle">' + U.esc(name) + '</text>';
      svg += g + '</g>';
    });
    // the ship waits next to the current stop
    var cur = 0; stopsFor(isl).forEach(function (pos, idx) { if (stopState(p, isl, idx).current) cur = idx; });
    var sp = stopsFor(isl)[cur];
    svg += '<g transform="translate(' + (sp[0] - 120) + ',' + (sp[1] - 30) + ')"><g class="bob">' + Art.ship(p.ship, 110).replace(/<svg[^>]*>/, '<svg x="0" y="0" width="110" height="80" viewBox="0 0 280 200">') + '</g></g>';
    return svg + '</svg>';
  }

  function canStartQuest(p) {
    if (p.preview) return true;
    var s = Store.get().settings, today = Store.todayStats(p), maxM = Store.setting(p, 'maxMinutes');
    if (maxM > 0 && today.minutes >= maxM) {
      U.modal('<div class="center">' + App.buddyArt(120, 'happy') + '<h2>Time to rest, Captain!</h2><p style="font-size:1.15rem">You sailed ' + today.minutes + ' minutes today. Great work! The keepers will be ready for you tomorrow.</p><button class="btn" data-x="1">OK</button></div>',
        function (o, api) { o.querySelector('[data-x]').onclick = api.close; });
      Audio2.speak('Time to rest, Captain! Great work today. The keepers will be ready for you tomorrow.', { who: 'parrot' });
      return false;
    }
    if (s.dailyLimit > 0 && today.quests >= s.dailyLimit) {
      U.modal('<div class="center">' + App.buddyArt(120, 'happy') + '<h2>Great sailing today!</h2><p style="font-size:1.15rem">You finished ' + s.dailyLimit + ' quests today. See you tomorrow!</p><button class="btn" data-x="1">OK</button></div>',
        function (o, api) { o.querySelector('[data-x]').onclick = api.close; });
      return false;
    }
    return true;
  }

  var greetedThisSession = {};
  App.register('island', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.id], st = Store.islandState(p, isl.id), s = Store.get().settings;
    var today = Store.todayStats(p), goal = Store.setting(p, 'sessionGoal') || 3;
    var lessons = isl.quests.filter(function (q) { return q.kind === 'lesson'; });
    var lessonsDone = lessons.filter(function (q) { return Store.questState(p, isl.id, q.id).done; }).length;
    var canTestOut = (st.pretestDone || p.preview) && !st.lit && lessonsDone >= Math.ceil(lessons.length / 2) && lessonsDone < lessons.length && st.earlyTried !== U.today();
    var missionsLeft = (isl.missions || []).filter(function (m) { return !(p.missions[m.id] && p.missions[m.id].done); }).length;
    root.innerHTML = '<div class="screen paper">' + hud(p, { back: true }) +
      '<div class="todaybar big islandwrap">' + Store.goalDots(today.quests, goal) + '<span><b>Today\'s voyage:</b> ' + today.quests + ' of ' + goal + ' quests' + (today.quests >= goal ? ' ✓' : '') + ' · ' + today.minutes + ' min</span>' +
      '<span class="spacer"></span><b>' + isl.name + (st.lit ? ' <span style="color:#2f9e55">· lighthouse lit!</span>' : '') + '</b></div>' +
      (function () {
        var cur = -1; stopsFor(isl).forEach(function (pos, idx) { if (cur < 0 && stopState(p, isl, idx).current) cur = idx; });
        if (cur < 0) return '';
        var t = cur === 0 ? 'Lighthouse Check' : 'Quest ' + cur + ': ' + isl.quests[cur - 1].title;
        return '<div class="islandwrap"><button class="btn big green continue" data-cont="' + cur + '">▶ Continue: ' + U.esc(t) + '</button></div>';
      })() +
      '<div class="islandwrap"><div class="card" style="padding:6px;overflow:hidden">' + levelMap(p, isl) + '</div>' +
      '<div class="card row" style="margin-top:14px;align-items:flex-start">' + Art.keeper((isl.keeper && isl.keeper.art) || 'rosa', 110) +
      '<div class="grow"><h2 style="margin:0 0 4px">' + isl.keeper.name + '</h2><p style="font-size:1.1rem;margin:0 0 10px">' + isl.keeper.greetText + '</p>' +
      '<div class="row"><button class="btn small plain" data-greet="1">🔊 Hear again</button><button class="btn small" data-story="1">📜 Lantern Story</button>' +
      '<button class="btn small green" data-missions="1">🧺 Hands-on missions' + (missionsLeft ? ' (' + missionsLeft + ')' : ' ✓') + '</button>' +
      (canTestOut ? '<button class="btn small coral" data-early="1">🏮 Test out early</button>' : '') + '</div>' +
      (p.preview ? '<p class="muted" style="margin:8px 0 0">' + isl.bju + '</p>' : '') + '</div></div></div></div>';
    bindHud(root, function () { App.go('map'); });
    U.$('[data-greet]', root).onclick = function () { Audio2.speak(isl.keeper.greet, { who: isl.keeper.voice || 'keeperF' }); };
    U.$('[data-story]', root).onclick = function () { App.go('story', { id: isl.id }); };
    U.$('[data-missions]', root).onclick = function () { App.go('missions', { id: isl.id }); };
    var eb = U.$('[data-early]', root);
    if (eb) eb.onclick = function () {
      U.modal('<div class="center">' + Art.lighthouseIcon(90) + '<h2>Test out early?</h2><p style="font-size:1.12rem;max-width:520px">You can take the Lighthouse Challenge now. Score 85% or more and you finish ' + isl.name + ' early! If it is not your day, no problem: just keep going with the lessons. (One try per day.)</p>' +
        '<div class="row" style="justify-content:center"><button class="btn plain" data-x="no">Not now</button><button class="btn green" data-x="go">Take the challenge</button></div></div>', function (o, api) {
          o.querySelector('[data-x=no]').onclick = api.close;
          o.querySelector('[data-x=go]').onclick = function () { api.close(); if (canStartQuest(p)) App.go('quest', { island: isl.id, quest: isl.quests[isl.quests.length - 1].id, early: true }); };
        });
      Audio2.speak('You can take the Lighthouse Challenge now. Score eighty five percent and you finish this island early!');
    };
    var cb = U.$('[data-cont]', root);
    if (cb) cb.onclick = function () { var g0 = U.$('[data-stop="' + cb.getAttribute('data-cont') + '"]', root); if (g0) g0.onclick(); };
    U.$$('[data-stop]', root).forEach(function (g) {
      g.onclick = function () {
        var idx = +g.getAttribute('data-stop'), sst = stopState(p, isl, idx);
        if (!sst.open) { Audio2.sfx('gentle'); U.toast(st.pretestDone ? 'Light the lanterns in order to sail here.' : 'Start with the Lighthouse Check!'); return; }
        var title = idx === 0 ? 'Lighthouse Check' : sst.q.title;
        var info = idx === 0 ? 'A short check to see what you already know. Lessons you already know light up right away!' :
          (sst.q.kind === 'boss' ? 'The island test. No hints. Pass to relight the lighthouse!' : sst.q.kind === 'review' ? 'Review everything on the island and build the memory verse.' : 'Today: ' + (sst.q.mastered ? sst.q.mastered[0] + '.' : ''));
        U.modal('<div class="center"><h2 style="margin-top:0">' + (idx ? (sst.q.kind === 'lesson' ? 'Quest ' + idx + ': ' : '') : '') + U.esc(title) + '</h2>' +
          (sst.qs && sst.qs.done ? '<div style="font-size:2rem">' + U.stars(sst.qs.stars) + '</div>' + (sst.qs.pretested ? '<p class="muted">You already knew this one!</p>' : '') : '') +
          '<p style="font-size:1.1rem;max-width:520px">' + U.esc(info) + '</p>' +
          '<div class="row" style="justify-content:center"><button class="btn plain" data-x="no">Not now</button><button class="btn big green" data-x="go">' + (sst.done ? 'Play again' : 'Start!') + '</button></div></div>',
        function (o, api) {
          o.querySelector('[data-x=no]').onclick = api.close;
          o.querySelector('[data-x=go]').onclick = function () {
            api.close();
            if (!canStartQuest(p)) return;
            Audio2.sfx('tap');
            App.go('quest', { island: isl.id, quest: idx === 0 ? 'pretest' : sst.q.id });
          };
        });
        Audio2.speak(title + '. ' + info);
      };
    });
    if (!st.storySeen && !p.preview) { setTimeout(function () { App.go('story', { id: isl.id, first: true }); }, 50); return; }
    if (args.from === 'quest' && !p.preview) {
      var mins = today.minutes;
      if (Store.setting(p, 'maxMinutes') > 0 && mins >= Store.setting(p, 'maxMinutes')) { canStartQuest(p); return; }
      if (today.quests === goal) {
        Audio2.sfx('fanfare');
        U.modal('<div class="center">' + Art.parrot(120, 'happy', p.parrot) + '<h2>Today\'s voyage is complete! 🎉</h2><p style="font-size:1.15rem">You finished ' + goal + ' quests today. Great work, Captain! You can stop here, or try a hands-on mission off the screen.</p><button class="btn big" data-x="1">Yay!</button></div>',
          function (o, api) { o.querySelector('[data-x]').onclick = api.close; });
        Audio2.speak('Today\'s voyage is complete! You finished ' + goal + ' quests. Great work, Captain!', { who: 'parrot' });
        return;
      }
    }
    if (!st.pretestDone && !p.preview) { Audio2.speak('Ahoy! Let\'s start with the Lighthouse Check. Tap the compass on the map.', { who: 'parrot' }); return; }
    if (!greetedThisSession[isl.id]) { greetedThisSession[isl.id] = 1; Audio2.speak(isl.keeper.greet, { who: isl.keeper.voice || 'keeperF' }); }
  });

  /* ------------ hands-on missions (optional; a parent confirms with the PIN) ------------ */
  App.register('missions', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.id];
    function draw() {
      root.innerHTML = '<div class="screen paper">' + hud(p, { back: true }) + '<div class="paperbox"><h1>🧺 Hands-on Missions: ' + isl.name + '</h1>' +
        '<p style="font-size:1.1rem">These are real-world missions to do off the screen. They are optional, and you can do them anytime. When you finish one, ask a parent to check it and type the PIN to earn your shells!</p>' +
        '<div class="missions">' + isl.missions.map(function (m) {
          var done = p.missions[m.id] && p.missions[m.id].done;
          return '<div class="mission' + (done ? ' done' : '') + '"><div class="micon">' + Art.icon(m.icon, 54) + '</div><div class="grow"><h3>' + U.esc(m.title) + ' <span class="pill">' + Art.icon('shellcoin', 22) + ' ' + m.shells + '</span></h3>' +
            '<p>' + U.esc(m.text) + '</p><div class="row"><button class="btn small plain" data-say="' + m.id + '">🔊 Read it to me</button>' +
            (done ? '<span class="pill" style="background:#d9f5df">✓ Done ' + done + '</span>' : (p.preview ? '' : '<button class="btn small green" data-done="' + m.id + '">I did it! (parent PIN)</button>')) + '</div></div></div>';
        }).join('') + '</div></div></div>';
      bindHud(root, function () { App.go('island', { id: isl.id }); });
      U.$$('[data-say]', root).forEach(function (b) { b.onclick = function () { var m = isl.missions.filter(function (x) { return x.id === b.getAttribute('data-say'); })[0]; Audio2.speak(m.title + '. ' + m.text); }; });
      U.$$('[data-done]', root).forEach(function (b) {
        b.onclick = function () {
          var m = isl.missions.filter(function (x) { return x.id === b.getAttribute('data-done'); })[0];
          Parent.requirePin(function () {
            p.missions[m.id] = { done: U.today() }; p.shells += m.shells;
            p.log.push({ date: U.today(), island: isl.id, quest: m.id, title: 'Mission: ' + m.title, score: 100, stars: 0, pass: true, mission: true });
            Store.save(); Audio2.sfx('fanfare'); Quest.confetti();
            U.toast('+' + m.shells + ' shells! Mission complete.'); Audio2.speak('Mission complete! ' + m.shells + ' shells for you!');
            draw();
          });
        };
      });
    }
    draw();
  });

  /* ------------ Lantern Story (Bible scene, kept separate from the island fiction) ------------ */
  App.register('story', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.id], s = isl.story, i = 0;
    function draw() {
      var last = i >= s.panels.length;
      var body;
      if (!last) {
        var pan = s.panels[i];
        body = '<p style="font-size:1.3rem">' + U.esc(pan.say) + '</p>' +
          (pan.quote ? '<blockquote style="background:#fff;border-left:8px solid #c98a12;border-radius:12px;padding:14px 18px;font-size:1.15rem;font-style:italic">' + U.esc(pan.quote) + '<div style="font-style:normal;font-weight:800;margin-top:8px">— ' + s.ref + '</div></blockquote>' : '') +
          (pan.visual === 'fifths' ? '<div class="row" style="justify-content:center">' + Models.set(5, 1, 'loaf', '#d49a4a', '#e9e2d6') + '<span style="font-size:3rem">' + U.frac(1, 5) + '</span></div>' : '') +
          (pan.visual === 'fish' ? '<div class="row" style="justify-content:center">' + Models.row(18, 'fish', '#3b8fd9', 0, 620) + '</div>' : '') +
          (pan.visual === 'twelve' ? '<div class="row" style="justify-content:center">' + Array.from({ length: 12 }, function (_, k) { return '<span class="center" style="display:inline-flex;flex-direction:column;align-items:center">' + Art.sailor({ skin: k % 4, hairColor: (k * 3) % 5, outfit: k % 6, hair: k % 3 }, 46, 0) + '<b>' + (k + 1) + '</b></span>'; }).join('') + '</div>' : '') +
          (pan.visual === 'stars' ? '<div class="row" style="justify-content:center;background:#1d1a3a;border-radius:16px;padding:10px">' + Models.row(14, 'star', '#ffd23f', 0, 620) + '</div>' : '');
      } else {
        body = '<p style="font-size:1.3rem">' + s.question.prompt.replace('1/5', U.frac(1, 5)) + '</p><div class="choices" style="margin:10px 0">' +
          s.question.choices.map(function (c) { var t = c.split('/'); return '<button class="choicebtn" data-a="' + U.esc(c) + '">' + (/^\d+\/\d+$/.test(c) ? U.frac(t[0], t[1]) : '<span class="g1word">' + U.esc(c) + '</span>') + '</button>'; }).join('') + '</div><div class="feedback" id="fb"></div>';
      }
      root.innerHTML = '<div class="screen titlescreen" style="background:linear-gradient(#1d1a3a,#4a3a6e)">' + Art.nightSky() +
        '<div class="paperbox" style="margin-top:20px;max-width:860px"><div class="row">' + App.buddyArt(90) + Art.icon('book', 60) +
        '<div class="grow"><div class="muted">' + (App.isHarbor() ? 'Bible story' : 'Lantern Story — from ' + U.esc(App.parrotName()) + '\'s logbook') + '</div><h1>' + s.title + '</h1></div></div>' + body +
        '<div class="row" style="justify-content:space-between;margin-top:14px"><button class="iconbtn" data-say="1">🔊</button>' +
        (last ? '' : '<button class="btn big" data-next="1">Next</button>') + '</div></div></div>';
      var sayText = last ? s.question.prompt : (s.panels[i].say + (s.panels[i].quote ? ' ' + s.panels[i].quote : ''));
      U.$('[data-say]', root).onclick = function () { Audio2.speak(sayText); };
      if (!last) U.$('[data-next]', root).onclick = function () { i++; draw(); };
      U.$$('[data-a]', root).forEach(function (b) {
        b.onclick = function () {
          var fb = U.$('#fb', root);
          if (b.getAttribute('data-a') === s.question.answer) {
            b.classList.add('right'); Audio2.sfx('right');
            fb.className = 'feedback good'; fb.textContent = s.question.right || 'Yes! One out of five is one fifth.';
            var st = Store.islandState(p, isl.id); st.storySeen = true;
            if (p.verses.indexOf(isl.id + ':story') < 0) p.verses.push(isl.id + ':story');
            Store.save();
            U.$$('[data-a]', root).forEach(function (x) { x.disabled = true; });
            fb.insertAdjacentHTML('afterend', '<div class="center" style="margin-top:12px"><button class="btn big green" id="sdone">' + (App.isHarbor() ? 'Back to the dock →' : 'Back to the island →') + '</button></div>');
            U.$('#sdone', root).onclick = function () { App.go('island', { id: isl.id }); };
            Audio2.speak((s.question.right || 'Yes! One out of five is one fifth.') + ' ' + (s.question.after || 'Now let\'s go help Abuela Rosa!'), { who: 'parrot' });
          } else { b.classList.add('wrong'); Audio2.sfx('gentle'); fb.className = 'feedback gentle'; fb.textContent = s.question.wrong || 'Try again: 1 basket out of 5 baskets.'; if (s.question.wrong) Audio2.speak(s.question.wrong); }
        };
      });
      Audio2.speak(sayText);
    }
    draw();
  });

  /* ------------ shipyard: try things on first, then decide to buy ------------ */
  App.register('shipyard', function (root) {
    var p = Store.active(), trial = null; // {cat, val, label, price}
    function draw() {
      var look = {}; Object.keys(p.ship).forEach(function (k) { look[k] = p.ship[k]; });
      if (trial) look[trial.cat] = trial.val;
      var html = '<div class="screen titlescreen">' + Art.titleScene() + hud(p, { back: true }) +
        '<div class="paperbox"><div class="row" style="align-items:flex-start"><div class="center" style="min-width:320px;max-width:360px">' +
        '<div class="bob">' + Art.ship(look, 320) + '</div><h2>The Shipyard</h2>' +
        (trial ? '<div class="tryon pop"><b>Trying on: ' + U.esc(trial.label) + '</b><br>' + trial.price + ' shells' +
          (p.shells < trial.price ? '<br><span style="color:#b4621a">You need ' + (trial.price - p.shells) + ' more shells. Keep questing!</span>' : '') +
          '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn small plain" id="putback">Put it back</button>' +
          '<button class="btn small green" id="buy"' + (p.shells < trial.price ? ' disabled' : '') + '>Buy it!</button></div></div>' :
          '<p class="muted">Tap anything to try it on. Spend shells you earn on quests and missions.</p>') +
        '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn plain small" data-cap="1">Change my captain\'s look</button><button class="btn plain small" data-par="1">Change my parrot</button></div></div><div class="grow">';
      Object.keys(SHOP).forEach(function (cat) {
        html += '<div class="optgroup"><div class="label">' + SHOP[cat].label + '</div><div class="row">';
        SHOP[cat].items.forEach(function (it) {
          var key = cat + ':' + it[0], owned = p.owned.indexOf(key) >= 0, on = look[cat] === it[0];
          html += '<button class="choice' + (on ? ' on' : '') + '" data-item="' + key + '">' + it[1] + (owned ? (p.ship[cat] === it[0] ? ' ✓' : '') : ' · ' + it[2] + ' 🐚') + '</button>';
        });
        html += '</div></div>';
      });
      html += '</div></div></div></div>';
      root.innerHTML = html;
      bindHud(root, function () { App.go(p.lastIsland ? 'island' : 'map', { id: p.lastIsland }); });
      U.$('[data-cap]', root).onclick = function () { App.go('builder', { mode: 'edit' }); };
      U.$('[data-par]', root).onclick = function () { App.go('parrot', { mode: 'edit' }); };
      var x;
      if ((x = U.$('#putback', root))) x.onclick = function () { trial = null; Audio2.sfx('tap'); draw(); };
      if ((x = U.$('#buy', root))) x.onclick = function () {
        var key = trial.cat + ':' + trial.val;
        p.shells -= trial.price; p.owned.push(key); p.ship[trial.cat] = trial.val; trial = null;
        Store.save(); Audio2.sfx('coin'); Audio2.speak('It\'s yours! Your ship looks great.', { who: 'parrot' }); draw();
      };
      U.$$('[data-item]', root).forEach(function (b) {
        b.onclick = function () {
          var key = b.getAttribute('data-item'), cat = key.split(':')[0], val = key.split(':')[1];
          var it = SHOP[cat].items.filter(function (i) { return i[0] === val; })[0];
          if (p.owned.indexOf(key) >= 0) { trial = null; p.ship[cat] = val; Store.save(); Audio2.sfx('tap'); }
          else { trial = { cat: cat, val: val, label: SHOP[cat].label + ': ' + it[1], price: it[2] }; Audio2.sfx('whoosh'); Audio2.speak('Trying on ' + it[1] + '. It costs ' + it[2] + ' shells. Do you want to buy it?', { who: 'parrot' }); }
          draw();
        };
      });
    }
    draw();
  });

  /* ------------ logbook ------------ */
  App.register('logbook', function (root) {
    var p = Store.active();
    var html = '<div class="screen paper">' + hud(p, { back: true }) + '<div class="paperbox"><h1>📖 ' + U.esc(p.name) + '\'s Logbook</h1>';
    Object.keys(CONTENT.islands).filter(function (id) { return (CONTENT.islands[id].course || 'voyage') === (p.course || 'voyage'); }).forEach(function (id) {
      var isl = CONTENT.islands[id], st = Store.islandState(p, id);
      html += '<div class="card" style="margin-bottom:14px"><h2>' + isl.name + (st.lit ? ' 🏮' : '') + '</h2>' +
        '<p><b>Memory verse</b> (' + isl.verse.ref + ', ' + isl.verse.version + ')' + (p.verses.indexOf(id + ':verse') >= 0 ? ' ✓ learned' : '') + ':<br><span style="font-size:1.15rem">"' + isl.verse.text + '"</span></p>' +
        '<div class="row"><button class="btn small plain" data-v="' + id + '">🔊 Hear verse</button>' +
        (st.storySeen ? '<button class="btn small" data-st="' + id + '">📜 ' + isl.story.title + '</button>' : '<span class="muted">Lantern Story: visit the island to hear it.</span>') + '</div></div>';
    });
    html += '</div></div>';
    root.innerHTML = html;
    bindHud(root, function () { App.go(p.lastIsland ? 'island' : 'map', { id: p.lastIsland }); });
    U.$$('[data-v]', root).forEach(function (b) { b.onclick = function () { var v = CONTENT.islands[b.getAttribute('data-v')].verse; Audio2.speak(v.text + ' ' + v.ref.replace(':', ', verse ')); }; });
    U.$$('[data-st]', root).forEach(function (b) { b.onclick = function () { App.go('story', { id: b.getAttribute('data-st') }); }; });
  });

  /* ------------ restoration (after the Lighthouse Challenge) ------------ */
  App.register('restore', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.id];
    root.innerHTML = '<div class="screen" style="background:#1d2840"><div class="paperbox center" style="margin-top:16px;max-width:1000px">' +
      '<div id="scene" style="width:100%">' + Art.sliceIsleScene(false, isl.id) + '</div>' +
      '<h1 id="rtitle">The lighthouse is ready…</h1><p id="rtext" style="font-size:1.2rem"></p>' +
      '<button class="btn big green" id="rgo" style="visibility:hidden">Back to the map</button></div></div>';
    setTimeout(function () {
      var fog = U.$('#scene .fog', root);
      if (fog) fog.style.opacity = 0;
      Audio2.sfx('fanfare');
      setTimeout(function () {
        U.$('#scene', root).innerHTML = Art.sliceIsleScene(true, isl.id);
        U.$('#rtitle', root).textContent = 'The light of ' + isl.name + ' shines again!';
        var t = 'The fog is lifting! Villagers are coming home, flowers are blooming, and ships can find their way. ' + isl.quests[isl.quests.length - 1].worldview;
        U.$('#rtext', root).textContent = t;
        U.$('#rgo', root).style.visibility = 'visible';
        Audio2.speak(t);
      }, 2500);
    }, 600);
    U.$('#rgo', root).onclick = function () { App.go('map'); };
  });

  return { SHOP: SHOP, nextQuest: nextQuest, canStartQuest: canStartQuest, hud: hud, bindHud: bindHud };
})();
