/* Lantern Harbor screens: the town map (one district per BJU chapter), a district's dock map with one stop per quest,
   and the boat shed where the child's boat grows one part at a time and the outfit changes with each rank. */
var Harbor = (function () {
  var C = function () { return CONTENT.courses.harbor; };
  function rank(p) { return C().rank(p); }
  function rankName(p) { return C().ranks[rank(p)]; }

  /* ---------- top bar for harbor screens ---------- */
  function hud(p, opts) {
    opts = opts || {};
    var egg = p.egg && p.egg.found && !p.egg.hatched ? '<div class="pill" title="Your speckled egg">' + Art.icon('egg', 28) + ' Egg</div>' : '';
    return '<div class="topbar noprint">' +
      (opts.back ? '<button class="iconbtn" data-back="1" aria-label="Back">←</button>' : '<button class="iconbtn" data-home="1" aria-label="Change player">⌂</button>') +
      '<div class="pill">' + Art.sailor(p.captain, 30, rank(p)).replace('<svg', '<svg style="margin:-6px 0"') + U.esc(p.name) + ' · ' + U.esc(rankName(p)) + '</div>' +
      '<div class="pill">' + Art.icon('shellcoin', 26) + '<span data-shells>' + p.shells + '</span></div>' + egg +
      '<div class="spacer"></div>' + (opts.extra || '') +
      '<button class="btn small plain" data-boat="1">🛶 My boat</button><button class="btn small plain" data-log="1">📖 Logbook</button></div>';
  }
  function bindHud(root, back) {
    var b;
    if ((b = U.$('[data-back]', root))) b.onclick = back;
    if ((b = U.$('[data-home]', root))) b.onclick = function () { App.go('title'); };
    U.$('[data-boat]', root).onclick = function () { App.go('boat'); };
    U.$('[data-log]', root).onclick = function () { App.go('logbook'); };
  }

  function nextQuest(p, isl) {
    for (var i = 0; i < isl.quests.length; i++) if (!Store.questState(p, isl.id, isl.quests[i].id).done) return isl.quests[i];
    return null;
  }
  function districtOpen(p, i) {
    if (p.preview) return true;
    var ds = C().districts;
    return i === 0 || !!(p.progress[ds[i - 1].id] && p.progress[ds[i - 1].id].lit);
  }

  /* ---------- the town map ---------- */
  var SEASON = { summer: ['#bfe9a3', '#9fd98a', 'Summer'], fall: ['#ffd9a0', '#f2b56b', 'Fall'], winter: ['#e6f2fb', '#c9e1f2', 'Winter'], spring: ['#d7f5c6', '#b5e8a0', 'Spring'] };
  function townPos(i) { var xs = [200, 500, 800, 500]; return [xs[i % 4], 170 + i * 150]; }
  App.register('town', function (root) {
    var p = Store.active(), ds = C().districts, H = 170 + ds.length * 150 + 60, cur = 0;
    ds.forEach(function (d, i) { if (districtOpen(p, i) && CONTENT.islands[d.id]) cur = i; });
    var svg = '<svg viewBox="0 0 1000 ' + H + '" class="townmap" preserveAspectRatio="xMidYMin meet">';
    // season bands
    var bandStart = 0;
    ds.forEach(function (d, i) {
      var last = i === ds.length - 1 || ds[i + 1].season !== d.season;
      if (!last) return;
      var y0 = bandStart === 0 ? 0 : townPos(bandStart)[1] - 75, y1 = last && i === ds.length - 1 ? H : townPos(i)[1] + 75, se = SEASON[d.season];
      svg += '<rect x="0" y="' + y0 + '" width="1000" height="' + (y1 - y0) + '" fill="' + se[0] + '"/>' +
        '<text x="980" y="' + (y0 + 44) + '" text-anchor="end" font-size="30" font-weight="800" fill="' + se[1] + '" stroke="#fff" stroke-width="5" paint-order="stroke">' + se[2] + '</text>';
      for (var k = 0; k < 10; k++) { var sx = (k * 137 + y0) % 940 + 30, sy = y0 + 60 + (k * 97) % Math.max(60, y1 - y0 - 80); svg += seasonBit(d.season, sx, sy); }
      bandStart = i + 1;
    });
    // the sea runs along the left edge, with the harbor lighthouse at the end
    svg += '<path d="M0 0 h60 q-30 ' + H / 8 + ' 0 ' + H / 4 + ' q30 ' + H / 8 + ' 0 ' + H / 4 + ' q-30 ' + H / 8 + ' 0 ' + H / 4 + ' q30 ' + H / 8 + ' 0 ' + H / 4 + ' h-60z" fill="#3fb4f0" opacity=".85"/>';
    svg += '<text x="500" y="70" text-anchor="middle" font-size="46" font-weight="800" fill="#fff" stroke="#22335e" stroke-width="8" paint-order="stroke">Lantern Harbor</text>';
    // the road between districts
    var pts = ds.map(function (d, i) { return townPos(i).join(','); }).join(' ');
    svg += '<polyline points="' + pts + '" fill="none" stroke="#c8a873" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="#f1d9a6" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="10 18" stroke-linecap="round"/>';
    ds.forEach(function (d, i) {
      var pos = townPos(i), built = !!CONTENT.islands[d.id], open = built && districtOpen(p, i), st = p.progress[d.id] || {}, lit = !!st.lit;
      var isl = CONTENT.islands[d.id], nq = built ? nextQuest(p, isl) : null;
      svg += '<g class="district' + (open ? '' : ' locked') + (i === cur ? ' current' : '') + '" data-d="' + i + '" transform="translate(' + pos[0] + ',' + pos[1] + ')">' +
        (i === cur ? '<circle r="88" fill="#fff4a8" opacity=".7" class="pulse"/>' : '') +
        '<ellipse cx="0" cy="22" rx="86" ry="26" fill="' + (open ? '#fff' : '#e6e6e6') + '" stroke="#2b2a3a" stroke-width="4"/>' +
        '<g transform="translate(0,10)"' + (open ? '' : ' opacity=".45"') + '>' + Art.landmarkH(d.kind) + '</g>' +
        '<g transform="translate(64,-62)"><circle r="22" fill="' + (lit ? '#ffc23c' : open ? '#fff' : '#c9cfd6') + '" stroke="#2b2a3a" stroke-width="3"/><text y="8" text-anchor="middle" font-size="22" font-weight="800" fill="#2b2a3a">' + (lit ? '✓' : i === 0 ? '★' : i) + '</text></g>' +
        '<text class="stoplbl" y="74" text-anchor="middle" style="font-size:22px">' + U.esc(d.name) + '</text>' +
        (!built ? '<text y="98" text-anchor="middle" font-size="16" fill="#6b6b6b" font-weight="700">coming soon</text>' : (!lit && nq && open ? '<text y="98" text-anchor="middle" font-size="16" fill="#2f7d3a" font-weight="700">' + U.esc(nq.title) + '</text>' : '')) +
        '</g>';
    });
    var cp = townPos(cur);
    svg += '<g transform="translate(' + (cp[0] - 150) + ',' + (cp[1] - 90) + ')"><g class="bob">' + Art.sailor(p.captain, 80, rank(p)).replace('<svg', '<svg x="0" y="0"') + '</g></g>';
    svg += '</svg>';
    var finished = C().finished(p);
    root.innerHTML = '<div class="screen paper harborbg">' + hud(p) +
      '<div class="islandwrap"><div class="todaybar big">' + Store.goalDots(Store.todayStats(p).quests, Store.setting(p, 'sessionGoal') || 2) +
      '<span><b>Today:</b> ' + Store.todayStats(p).quests + ' of ' + (Store.setting(p, 'sessionGoal') || 2) + ' quests · ' + Store.todayStats(p).minutes + ' min</span><span class="spacer"></span><b>' + finished + ' of ' + ds.length + ' harbor parts done</b></div>' +
      '<button class="btn big green continue" data-go="' + cur + '">▶ Go to ' + U.esc(ds[cur].name) + '</button>' +
      '<div class="card" style="padding:6px;overflow:hidden">' + svg + '</div></div></div>';
    bindHud(root);
    U.$('[data-go]', root).onclick = function () { open(cur); };
    U.$$('.district', root).forEach(function (g) { g.onclick = function () { open(+g.getAttribute('data-d')); }; });
    function open(i) {
      var d = ds[i];
      if (!CONTENT.islands[d.id]) { Audio2.speak(d.name + ' is coming soon!', { who: 'parrot' }); U.toast(d.name + ': coming soon'); return; }
      if (!districtOpen(p, i)) { Audio2.sfx('gentle'); Audio2.speak('Finish ' + ds[i - 1].name + ' first. Then this part of the harbor opens!', { who: 'parrot' }); U.toast('Finish ' + ds[i - 1].name + ' first'); return; }
      Audio2.sfx('whoosh'); p.lastIsland = d.id; Store.save();
      App.go('island', { id: d.id });
    }
    setTimeout(function () { var g = U.$('.district.current', root); if (g && g.scrollIntoView) g.scrollIntoView({ block: 'center' }); }, 60);
    if (!p.mapHintSeen) { Audio2.speak('This is Lantern Harbor! Tap the glowing spot to begin.', { who: 'parrot' }); p.mapHintSeen = true; Store.save(); }
  });
  function seasonBit(season, x, y) {
    if (season === 'winter') return '<path d="M' + x + ' ' + (y - 10) + ' v20 M' + (x - 9) + ' ' + (y - 5) + ' l18 10 M' + (x + 9) + ' ' + (y - 5) + ' l-18 10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
    if (season === 'fall') return '<path d="M' + x + ' ' + y + ' q8 -14 16 0 q-8 12 -16 0z" fill="#e5833d" opacity=".7"/>';
    if (season === 'spring') return '<g transform="translate(' + x + ',' + y + ')">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-5" rx="3.5" ry="5" fill="#ff9fd0" transform="rotate(' + a + ')"/>'; }).join('') + '<circle r="3" fill="#ffd23f"/></g>';
    return '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#ffd23f" opacity=".7"/>';
  }

  /* ---------- a district: one dock stop per quest ---------- */
  function stopList(p, isl) {
    var list = [], st = Store.islandState(p, isl.id);
    if (!isl.noPretest) list.push({ pre: true });
    isl.quests.forEach(function (q) { list.push({ q: q }); });
    var gate = isl.noPretest || st.pretestDone || p.preview, nq = nextQuest(p, isl);
    list.forEach(function (s) {
      if (s.pre) { s.done = !!st.pretestDone; s.open = true; s.current = !st.pretestDone && !p.preview; return; }
      s.qs = Store.questState(p, isl.id, s.q.id); s.done = s.qs.done;
      s.open = p.preview || (gate && (s.done || nq === s.q)); s.current = gate && nq === s.q;
    });
    return list;
  }
  function stopPos(i, n) { var per = 5, row = Math.floor(i / per), col = i % per; if (row % 2) col = per - 1 - col; return [110 + col * 195, 120 + row * 195]; }
  function dockMap(p, isl) {
    var list = stopList(p, isl), rows = Math.ceil(list.length / 5), H = 120 + rows * 195 + 30, O = '#2b2a3a';
    var svg = '<svg viewBox="0 0 1000 ' + H + '" class="levelmap" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="dmsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc4f0"/><stop offset="1" stop-color="#1d8fd0"/></linearGradient>' +
      '<radialGradient id="dmglow"><stop offset="0" stop-color="#fff4a8" stop-opacity=".95"/><stop offset="1" stop-color="#fff4a8" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1000" height="' + H + '" rx="28" fill="url(#dmsea)"/>';
    for (var w = 0; w < 30; w++) { var wx = (w * 263) % 960 + 20, wy = (w * 151) % (H - 40) + 20; svg += '<path d="M' + wx + ' ' + wy + ' q8 -6 16 0 t16 0" stroke="#bdeeff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>'; }
    // boardwalk between stops
    for (var i = 0; i < list.length - 1; i++) {
      var a = stopPos(i), b = stopPos(i + 1);
      svg += '<path d="M' + a[0] + ' ' + (a[1] + 12) + ' L' + b[0] + ' ' + (b[1] + 12) + '" stroke="' + (list[i].done ? '#e8c27a' : '#b89c6e') + '" stroke-width="26" stroke-linecap="round"/>' +
        '<path d="M' + a[0] + ' ' + (a[1] + 12) + ' L' + b[0] + ' ' + (b[1] + 12) + '" stroke="#8a5a2b" stroke-width="2" stroke-dasharray="3 14"/>';
    }
    var num = 0;
    list.forEach(function (s, idx) {
      var pos = stopPos(idx), kind = s.pre ? 'pre' : s.q.kind;
      var g = '<g class="stop' + (s.open ? '' : ' locked') + (s.current ? ' current' : '') + '" data-stop="' + idx + '" transform="translate(' + pos[0] + ',' + pos[1] + ')">';
      if (s.current) g += '<circle r="72" fill="url(#dmglow)" class="pulse"/>';
      g += '<ellipse cx="0" cy="16" rx="62" ry="24" fill="' + (s.open ? '#d8ad75' : '#b9b1a6') + '" stroke="' + O + '" stroke-width="4"/><path d="M-44 16 h88" stroke="#8a5a2b" stroke-width="2"/>';
      var ic = kind === 'pre' ? Art.compassPost(s.done) : kind === 'readiness' ? '<g transform="translate(-34,-60)">' + Art.icon(s.q.icon || 'crate', 68) .replace('<svg', '<svg x="0" y="0"') + '</g>' :
        kind === 'boss' ? '' : Art.lanternPost(s.done, kind === 'review');
      g += kind === 'boss' ? '<g transform="translate(-40,-60)"><svg viewBox="0 0 320 240" width="80" height="60">' + Art.boat(Math.max(3, C().finished(p) + 1), 320).replace(/<\/?svg[^>]*>/g, '') + '</svg></g>' : ic;
      var label = kind === 'pre' ? '🧭' : kind === 'readiness' ? '🧰' : kind === 'review' ? '⚓' : kind === 'boss' ? '★' : String(++num);
      g += '<g transform="translate(40,-52)"><circle r="17" fill="' + (s.done ? '#ffc23c' : s.open ? '#fff' : '#c9cfd6') + '" stroke="' + O + '" stroke-width="3"/><text y="7" text-anchor="middle" font-size="17" font-weight="800" fill="' + O + '">' + label + '</text></g>';
      if (!s.open) g += '<g transform="translate(0,-24)"><rect x="-11" y="-4" width="22" height="18" rx="4" fill="#8a8f99" stroke="' + O + '" stroke-width="2.5"/><path d="M-6 -4 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="' + O + '" stroke-width="3"/></g>';
      if (s.qs && (s.qs.done || s.qs.attempts) && kind !== 'readiness') g += '<g transform="translate(0,46)">' + [0, 1, 2].map(function (k) { return Art.star((k - 1) * 22, 0, 10, k < s.qs.stars ? '#ffc23c' : '#e2e2e2', true); }).join('') + '</g>';
      if (s.qs && s.qs.pretested) g += '<text y="80" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" stroke="#2f7d3a" stroke-width="4" paint-order="stroke">ready!</text>';
      g += stopLabel(s.pre ? W('check') : s.q.title, s.qs && s.qs.pretested ? 100 : 76);
      svg += g + '</g>';
    });
    return svg + '</svg>';
  }
  function W(k) { return C().words[k]; }
  /* stop names wrap onto two short lines so neighbors never overlap */
  function stopLabel(t, y) {
    var words = String(t).split(' '), lines = [''];
    words.forEach(function (w) { var cur = lines[lines.length - 1]; if (cur && (cur + ' ' + w).length > 12) lines.push(w); else lines[lines.length - 1] = cur ? cur + ' ' + w : w; });
    return '<text class="stoplbl dock" y="' + y + '" text-anchor="middle">' + lines.slice(0, 3).map(function (l, i) { return '<tspan x="0" dy="' + (i ? 18 : 0) + '">' + U.esc(l) + '</tspan>'; }).join('') + '</text>';
  }

  App.register('district', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.id], st = Store.islandState(p, isl.id), today = Store.todayStats(p), goal = Store.setting(p, 'sessionGoal') || 2;
    var list = stopList(p, isl), cur = -1;
    list.forEach(function (s, i) { if (cur < 0 && s.current) cur = i; });
    var missionsLeft = (isl.missions || []).filter(function (m) { return !(p.missions[m.id] && p.missions[m.id].done); }).length;
    root.innerHTML = '<div class="screen paper harborbg">' + hud(p, { back: true }) +
      '<div class="todaybar big islandwrap">' + Store.goalDots(today.quests, goal) + '<span><b>Today:</b> ' + today.quests + ' of ' + goal + ' quests' + (today.quests >= goal ? ' ✓' : '') + ' · ' + today.minutes + ' min</span>' +
      '<span class="spacer"></span><b>' + isl.name + (st.lit ? ' <span style="color:#2f9e55">· finished!</span>' : '') + '</b></div>' +
      (cur >= 0 ? '<div class="islandwrap"><button class="btn big green continue" data-cont="' + cur + '">▶ ' + U.esc(list[cur].pre ? W('check') : list[cur].q.title) + '</button></div>' : '') +
      '<div class="islandwrap"><div class="card" style="padding:6px;overflow:hidden">' + dockMap(p, isl) + '</div>' +
      '<div class="card row" style="margin-top:14px;align-items:flex-start">' + Art.keeper(isl.keeper.art, 110) +
      '<div class="grow"><h2 style="margin:0 0 4px">' + isl.keeper.name + '</h2><p style="font-size:1.15rem;margin:0 0 10px">' + isl.keeper.greetText + '</p>' +
      '<div class="row"><button class="btn small plain" data-greet="1">🔊 Hear again</button><button class="btn small" data-story="1">📜 Bible story</button>' +
      '<button class="btn small green" data-missions="1">🧺 Hands-on missions' + (missionsLeft ? ' (' + missionsLeft + ')' : ' ✓') + '</button></div>' +
      (p.preview ? '<p class="muted" style="margin:8px 0 0">' + isl.bju + '</p>' : '') + '</div></div></div></div>';
    bindHud(root, function () { App.go('town'); });
    U.$('[data-greet]', root).onclick = function () { Audio2.speak(isl.keeper.greet, { who: isl.keeper.voice }); };
    U.$('[data-story]', root).onclick = function () { App.go('story', { id: isl.id }); };
    U.$('[data-missions]', root).onclick = function () { App.go('missions', { id: isl.id }); };
    var cb = U.$('[data-cont]', root);
    if (cb) cb.onclick = function () { start(+cb.getAttribute('data-cont')); };
    U.$$('[data-stop]', root).forEach(function (g) { g.onclick = function () { start(+g.getAttribute('data-stop')); }; });
    function start(idx) {
      var s = list[idx];
      if (!s.open) { Audio2.sfx('gentle'); U.toast('Do the glowing stop first!'); Audio2.speak('Do the glowing stop first!', { who: 'parrot' }); return; }
      var title = s.pre ? W('check') : s.q.title, kind = s.pre ? 'pre' : s.q.kind;
      var info = kind === 'pre' ? 'A short check to see what you already know.' : kind === 'readiness' ? 'Let\'s see what you already know! Things you know get a star right away.' :
        kind === 'boss' ? 'The big challenge. Pass it to earn a new piece for your boat!' : kind === 'review' ? 'Review everything here and build the memory verse.' :
        (s.q.mastered ? 'Today: ' + s.q.mastered[0] + '.' : '');
      U.modal('<div class="center"><h2 style="margin-top:0">' + U.esc(title) + '</h2>' + (s.qs && s.qs.done && kind !== 'readiness' ? '<div style="font-size:2rem">' + U.stars(s.qs.stars) + '</div>' + (s.qs.pretested ? '<p class="muted">You already knew this one!</p>' : '') : '') +
        '<p style="font-size:1.2rem;max-width:520px">' + U.esc(info) + '</p><div class="row" style="justify-content:center"><button class="btn plain" data-x="no">Not now</button><button class="btn big green" data-x="go">' + (s.done ? 'Play again' : 'Start!') + '</button></div></div>',
        function (o, api) {
          o.querySelector('[data-x=no]').onclick = api.close;
          o.querySelector('[data-x=go]').onclick = function () { api.close(); go(); };
        });
      function go() { Audio2.sfx('tap'); App.go('quest', { island: isl.id, quest: s.pre ? 'pretest' : s.q.id }); }
      Audio2.speak(title + '. ' + info);
    }
    if (!st.storySeen && !p.preview) { setTimeout(function () { App.go('story', { id: isl.id, first: true }); }, 50); return; }
    if (args.from === 'quest' && !p.preview) {
      var maxM = Store.setting(p, 'maxMinutes'), tired = maxM > 0 && today.minutes >= maxM;
      // first grade: suggest being done for the day (once a day), but let him keep going if he wants
      p.doneAsked = p.doneAsked || {};
      if ((tired || today.quests >= goal) && !p.doneAsked[U.today() + (tired ? 't' : 'g')]) {
        p.doneAsked[U.today() + (tired ? 't' : 'g')] = 1; Store.save();
        Audio2.sfx('fanfare');
        var msg = tired ? 'You worked hard for ' + today.minutes + ' minutes today! You can be done for today, or keep going if you want.' : 'You did your quests for today! You can be done for today, or keep going if you want.';
        U.modal('<div class="center">' + App.buddyArt(120, 'happy') + '<h2>Great work today! 🎉</h2><p style="font-size:1.25rem;max-width:520px">' + U.esc(msg) + '</p>' +
          '<div class="row" style="justify-content:center"><button class="btn big green" data-x="done">👋 I\'m done for today</button><button class="btn big plain" data-x="more">⛵ Keep going</button></div></div>',
          function (o, api) {
            o.querySelector('[data-x=done]').onclick = function () { api.close(); var gone = false, leave = function () { if (!gone) { gone = true; App.go('title'); } }; Audio2.speak('See you next time! Great job today.', { who: 'parrot' }).then(leave); setTimeout(leave, 4000); };
            o.querySelector('[data-x=more]').onclick = function () { api.close(); Audio2.speak('Okay! Let\'s keep going.', { who: 'parrot' }); };
          });
        Audio2.speak(msg, { who: 'parrot' });
        return;
      }
    }
    if (!isl.noPretest && !st.pretestDone && !p.preview) { Audio2.speak('Let\'s start with the Harbor Check. Tap the glowing compass.', { who: 'parrot' }); return; }
    Audio2.speak(isl.keeper.greet, { who: isl.keeper.voice });
  });

  /* ---------- the boat shed: the boat, the parts, and the rank ---------- */
  App.register('boat', function (root, args) {
    var p = Store.active(), n = C().finished(p), r = rank(p), ranks = C().ranks;
    var rankUp = (p.rankSeen || 0) < r;
    var newPart = args && args.new && n > 0 ? Art.BOAT_PARTS[n - 1] : null;
    p.rankSeen = Math.max(p.rankSeen || 0, r); Store.save();
    var parts = Art.BOAT_PARTS.map(function (name, i) { return '<li class="' + (i < n ? 'got' : '') + '">' + (i < n ? '✓ ' : '○ ') + U.esc(name) + '<span class="muted"> · ' + U.esc(C().districts[i].name) + '</span></li>'; }).join('');
    root.innerHTML = '<div class="screen titlescreen">' + Art.harborScene() + hud(p, { back: true }) +
      '<div class="paperbox"><div class="row" style="align-items:flex-start">' +
      '<div class="center" style="min-width:300px">' + (newPart ? '<div class="hooray">New boat part!</div><h2 style="margin:4px 0">Grandpa Eli gives you: ' + U.esc(newPart) + '</h2>' : '<h1 style="margin:0">My Boat</h1>') +
      '<div class="pop">' + Art.boat(n, 420, p.name) + '</div><p style="font-size:1.15rem">' + n + ' of ' + Art.BOAT_PARTS.length + ' parts</p></div>' +
      '<div class="grow center"><div>' + Art.sailor(p.captain, 170, r) + '</div><h2 style="margin:4px 0">' + U.esc(p.name) + '</h2><div class="pill" style="font-size:1.2rem">⚓ ' + U.esc(ranks[r]) + '</div>' +
      (r < ranks.length - 1 ? '<p class="muted">Next rank: ' + U.esc(ranks[r + 1]) + '</p>' : '') +
      '<div class="row" style="justify-content:center;margin-top:8px"><button class="btn small plain" data-look="1">Change my look</button></div>' +
      '<details style="text-align:left;margin-top:10px"><summary><b>All the boat parts</b></summary><ul class="boatparts">' + parts + '</ul></details></div></div>' +
      '<div class="center" style="margin-top:12px"><button class="btn big green" data-go="1">' + (newPart ? 'Back to the harbor' : 'Back') + '</button></div></div></div>';
    bindHud(root, back);
    function back() { App.go(newPart ? 'town' : (p.lastIsland ? 'island' : 'town'), { id: p.lastIsland }); }
    U.$('[data-go]', root).onclick = back;
    U.$('[data-look]', root).onclick = function () { App.go('builder', { mode: 'edit', back: 'boat' }); };
    var say = [];
    if (newPart) { Audio2.sfx('hooray'); Quest.confetti(); say.push('Grandpa Eli gives you a new boat part: the ' + newPart.toLowerCase() + '!'); }
    if (rankUp) say.push('And you have a new rank! You are now a ' + ranks[r] + '! Look at your new outfit!');
    if (say.length) setTimeout(function () { Audio2.speak(say.join(' '), { who: 'eli' }); }, newPart ? 1400 : 200);
  });

  return { hud: hud, bindHud: bindHud, rank: rank, rankName: rankName, nextQuest: nextQuest };
})();
