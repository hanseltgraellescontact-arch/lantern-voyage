/* Arcade Cove: five original practice games, each on a different math skill. Never scored, never "game over".
   Every play picks a new target, number set, or layout, so no two plays are the same.
   1 Pearl Maze (addition facts, in maze.js)   2 Lantern Catch (multiplication)   3 Bubble Blaster (subtraction)
   4 Lily Pad Hop (fact families)              5 Sea Serpent (skip counting) */
var Arcade = (function () {
  var raf = null, running = false, OL = '#2b2a3a';
  var NW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; document.onkeydown = null; document.onkeyup = null; }

  var GAMES = [
    { id: 'maze', name: 'Pearl Maze', skill: 'Addition facts', color: '#3b8fd9', blurb: 'Steer your sub through the reef and gobble pearls that make the target number.' },
    { id: 'catch', name: 'Lantern Catch', skill: 'Multiplication facts', color: '#f2a01e', blurb: 'Catch the falling lanterns that equal the target number.' },
    { id: 'blaster', name: 'Bubble Blaster', skill: 'Subtraction facts', color: '#17a5a0', blurb: 'Pop the fish carrying problems that equal the target.' },
    { id: 'hop', name: 'Lily Pad Hop', skill: 'Fact families', color: '#2fa35a', blurb: 'Hop across the river on pads from the right fact family.' },
    { id: 'serpent', name: 'Sea Serpent', skill: 'Skip counting', color: '#8d4fc2', blurb: 'Guide the sea serpent to eat the numbers in skip-counting order.' }
  ];
  function cabinetArt(g) {
    var icon = { maze: '<circle cx="40" cy="44" r="16" fill="#fff" stroke="' + OL + '" stroke-width="3"/><text x="40" y="50" text-anchor="middle" font-weight="800" font-size="13">3+7</text><path d="M70 30 h30 v28 h-30z" fill="#9a86d0" stroke="' + OL + '" stroke-width="3"/>',
      catch: '<path d="M30 20 h20 l-3 -6 h-14z" fill="#22335e"/><rect x="30" y="20" width="20" height="26" rx="5" fill="#ffd23f" stroke="' + OL + '" stroke-width="3"/><text x="40" y="38" text-anchor="middle" font-weight="800" font-size="11">4×6</text><path d="M62 62 h46 l-6 14 h-34z" fill="#a0612b" stroke="' + OL + '" stroke-width="3"/>',
      blaster: '<ellipse cx="80" cy="38" rx="26" ry="14" fill="#ff8a3d" stroke="' + OL + '" stroke-width="3"/><path d="M106 38 l12 -10 v20z" fill="#ff8a3d" stroke="' + OL + '" stroke-width="3"/><text x="78" y="43" text-anchor="middle" font-weight="800" font-size="12">9−4</text><circle cx="40" cy="60" r="8" fill="#bfefff" stroke="' + OL + '" stroke-width="2"/>',
      hop: '<ellipse cx="60" cy="56" rx="38" ry="14" fill="#5fbf5f" stroke="' + OL + '" stroke-width="3"/><text x="60" y="61" text-anchor="middle" font-weight="800" font-size="12">3+5=8</text><circle cx="60" cy="28" r="12" fill="#7ccf5a" stroke="' + OL + '" stroke-width="3"/>',
      serpent: '<path d="M14 60 q20 -30 40 0 t40 0" stroke="#8d4fc2" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="96" cy="60" r="9" fill="#b48ef0" stroke="' + OL + '" stroke-width="3"/><text x="40" y="30" font-weight="800" font-size="14">4, 8, 12…</text>' }[g.id];
    return '<svg viewBox="0 0 130 84" width="100%" height="100"><rect x="2" y="2" width="126" height="80" rx="12" fill="' + g.color + '" opacity=".25" stroke="' + OL + '" stroke-width="3"/>' + icon + '</svg>';
  }

  /* ------------ the Arcade Cove hub ------------ */
  App.register('arcade', function (root) {
    var p = Store.active();
    root.innerHTML = '<div class="screen titlescreen">' + Art.titleScene() + '<div class="topbar"><button class="iconbtn" id="ax">←</button><h1 class="grow" style="color:#fff;text-shadow:0 3px 0 #0b4a73">🕹 Arcade Cove</h1>' +
      '<div class="pill">🎟 ' + (p.preview ? '∞' : p.arcadeTokens) + ' token' + (p.arcadeTokens === 1 ? '' : 's') + '</div></div>' +
      '<div class="paperbox" style="max-width:1100px"><p style="font-size:1.1rem;margin-top:0">Pick a game! Each play uses one token. You earn a token every three quests, and for passing a Harbor Review. Each game practices a different math skill.</p>' +
      '<div class="cabinets">' + GAMES.map(function (g) {
        return '<div class="cabinet" style="border-color:' + g.color + '">' + cabinetArt(g) + '<h3>' + g.name + '</h3><div class="pill tiny" style="background:#fff7d6">' + g.skill + '</div><p>' + g.blurb + '</p>' +
          '<button class="btn small" data-game="' + g.id + '"' + (p.preview || p.arcadeTokens > 0 ? '' : ' disabled') + '>▶ Play</button></div>';
      }).join('') + '</div></div></div>';
    U.$('#ax', root).onclick = function () { App.go(p.lastIsland ? 'island' : 'map', { id: p.lastIsland }); };
    U.$$('[data-game]', root).forEach(function (b) {
      b.onclick = function () {
        if (!p.preview) { if (p.arcadeTokens <= 0) return; p.arcadeTokens--; Store.save(); }
        var id = b.getAttribute('data-game');
        App.go(id === 'maze' ? 'maze' : 'game', { game: id, paid: true });
      };
    });
    Audio2.speak('Welcome to Arcade Cove! Pick a game.', { who: 'parrot' });
  });

  /* ------------ shared game frame ------------ */
  function frame(root, title, prompt, say, goal, action) {
    root.innerHTML = '<div class="screen" style="background:linear-gradient(#0f4f7a,#0a3354)">' +
      '<div class="topbar"><button class="iconbtn" id="gx">✕</button><h1 style="color:#fff" class="grow">🕹 ' + title + '</h1><div class="pill" id="score"></div></div>' +
      '<div class="paperbox center" style="padding:10px 18px;margin-bottom:10px"><div class="row" style="justify-content:center"><button class="iconbtn" id="gsay">🔊</button>' +
      '<h2 style="margin:0">' + prompt + '</h2></div><div id="gmsg" class="muted" style="min-height:26px;font-weight:700"></div></div>' +
      '<div class="maze-wrap"><canvas class="maze" id="gcv" width="690" height="460"></canvas>' +
      '<div class="center"><div class="dpad"><span></span><button data-d="up">▲</button><span></span><button data-d="left">◀</button>' + (action ? '<button data-d="action" class="fire">' + action + '</button>' : '<span></span>') +
      '<button data-d="right">▶</button><span></span><button data-d="down">▼</button><span></span></div>' +
      '<p style="color:#fff;max-width:230px">Arrow keys or these buttons' + (action ? ', and the space bar or the middle button to ' + action.toLowerCase() : '') + '.</p></div></div></div>';
    U.$('#gx', root).onclick = function () { stop(); App.go('arcade'); };
    U.$('#gsay', root).onclick = function () { Audio2.speak(say, { who: 'parrot' }); };
    Audio2.speak(say, { who: 'parrot' });
    var held = {}, taps = [];
    var KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', ' ': 'action', w: 'up', s: 'down', a: 'left', d: 'right' };
    document.onkeydown = function (e) { var k = KEYS[e.key]; if (!k) return; e.preventDefault(); if (!held[k]) taps.push(k); held[k] = true; };
    document.onkeyup = function (e) { var k = KEYS[e.key]; if (k) held[k] = false; };
    U.$$('[data-d]', root).forEach(function (b) {
      var k = b.getAttribute('data-d');
      b.onpointerdown = function (e) { e.preventDefault(); held[k] = true; taps.push(k); };
      b.onpointerup = b.onpointerleave = function () { held[k] = false; };
    });
    var timer = null;
    var api = {
      cv: U.$('#gcv', root), held: held,
      tap: function () { return taps.shift(); },
      msg: function (t, good) { var m = U.$('#gmsg', root); if (!m) return; m.textContent = t; m.style.color = good ? '#2f9e55' : '#b4621a'; clearTimeout(timer); timer = setTimeout(function () { if (m) m.textContent = ''; }, 2600); },
      score: function (n) { U.$('#score', root).textContent = n + ' of ' + goal; },
      win: function (text) {
        stop(); Audio2.sfx('fanfare'); var p = Store.active(); p.shells += 5; Store.save();
        setTimeout(function () {
          U.modal('<div class="center">' + Art.parrot(120, 'happy') + '<h2>' + text + '</h2><p style="font-size:1.2rem">+5 shells</p><button class="btn big" data-x="1">Back to Arcade Cove</button></div>',
            function (o, m) { o.querySelector('[data-x]').onclick = function () { m.close(); App.go('arcade'); }; });
          Audio2.speak('You did it! Five shells for you!', { who: 'parrot' });
        }, 400);
      }
    };
    api.score(0);
    return api;
  }
  function loop(step) {
    var last = performance.now(); running = true;
    (function tick(t) {
      if (!running) return;
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      step(dt);
      raf = requestAnimationFrame(tick);
    })(last);
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function label(ctx, t, x, y, size) { ctx.fillStyle = OL; ctx.font = 'bold ' + (size || 15) + 'px Trebuchet MS, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y); }

  App.register('game', function (root, args) {
    ({ catch: lanternCatch, blaster: bubbleBlaster, hop: lilyHop, serpent: seaSerpent })[args.game](root);
  });

  /* ------------ 2. Lantern Catch: multiplication ------------ */
  var PRODUCTS = { 12: [[2, 6], [6, 2], [3, 4], [4, 3]], 16: [[2, 8], [8, 2], [4, 4]], 18: [[2, 9], [9, 2], [3, 6], [6, 3]], 20: [[2, 10], [10, 2], [4, 5], [5, 4]],
    24: [[3, 8], [8, 3], [4, 6], [6, 4]], 30: [[3, 10], [10, 3], [5, 6], [6, 5]], 36: [[4, 9], [9, 4], [6, 6]], 40: [[4, 10], [10, 4], [5, 8], [8, 5]] };
  function lanternCatch(root) {
    var T = +U.pick(Object.keys(PRODUCTS)), goal = 8, got = 0;
    var g = frame(root, 'Lantern Catch', 'Catch the lanterns that equal ' + T + '!', 'Catch the lanterns that equal ' + T + '!', goal);
    var cv = g.cv, ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var boat = { x: W / 2 }, lanterns = [], spawn = 0, stars = [];
    for (var i = 0; i < 40; i++) stars.push([Math.random() * W, Math.random() * H * .6, Math.random() * 2 + 1]);
    function newLantern() {
      var right = Math.random() < 0.55, f;
      if (right) f = U.pick(PRODUCTS[T]);
      else { do { f = [U.rand(2, 10), U.rand(2, 10)]; } while (f[0] * f[1] === T); }
      lanterns.push({ x: U.rand(40, W - 40), y: -30, v: U.rand(55, 85), a: f[0], b: f[1], ok: f[0] * f[1] === T, sway: Math.random() * 6 });
    }
    loop(function (dt) {
      if (g.held.left) boat.x -= 300 * dt; if (g.held.right) boat.x += 300 * dt;
      boat.x = Math.max(50, Math.min(W - 50, boat.x));
      spawn -= dt; if (spawn <= 0) { newLantern(); spawn = 1.3; }
      lanterns.forEach(function (l) { l.y += l.v * dt; l.sway += dt; });
      lanterns = lanterns.filter(function (l) {
        if (l.y > H - 70 && l.y < H - 30 && Math.abs(l.x - boat.x) < 55) {
          if (l.ok) { got++; g.score(got); Audio2.sfx('chomp'); g.msg(l.a + ' × ' + l.b + ' = ' + T + '!', true); Audio2.speak(l.a + ' times ' + l.b + ' equals ' + T, { who: 'parrot' }); if (got >= goal) g.win('You caught them all!'); }
          else { Audio2.sfx('gentle'); g.msg(l.a + ' × ' + l.b + ' = ' + l.a * l.b + ', not ' + T + '.'); }
          return false;
        }
        return l.y < H + 40;
      });
      // draw: night harbor
      var sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1b2350'); sky.addColorStop(1, '#3b4f8f'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; stars.forEach(function (s) { ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(s[0], s[1], s[2] / 1.5, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
      ctx.fillStyle = '#1f6fa8'; ctx.fillRect(0, H - 50, W, 50);
      lanterns.forEach(function (l) {
        var x = l.x + Math.sin(l.sway) * 4;
        ctx.fillStyle = 'rgba(255,230,120,.25)'; ctx.beginPath(); ctx.arc(x, l.y, 30, 0, 7); ctx.fill();
        ctx.fillStyle = '#22335e'; ctx.fillRect(x - 15, l.y - 26, 30, 6);
        ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = OL; ctx.lineWidth = 3; rr(ctx, x - 22, l.y - 20, 44, 40, 8); ctx.fill(); ctx.stroke();
        label(ctx, l.a + '×' + l.b, x, l.y, 15);
      });
      var bx = boat.x, by = H - 46;
      ctx.fillStyle = '#a0612b'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(bx - 55, by); ctx.lineTo(bx + 55, by); ctx.lineTo(bx + 40, by + 24); ctx.lineTo(bx - 40, by + 24); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#e8e0c8'; ctx.lineWidth = 2; for (var k = -40; k <= 40; k += 10) { ctx.beginPath(); ctx.moveTo(bx + k, by); ctx.lineTo(bx + k * 0.8, by - 18); ctx.stroke(); }
    });
  }

  /* ------------ 3. Bubble Blaster: subtraction ------------ */
  function bubbleBlaster(root) {
    var D = U.rand(3, 9), goal = 8, got = 0;
    var g = frame(root, 'Bubble Blaster', 'Pop the fish that equal ' + D + '!', 'Pop the fish that equal ' + D + '!', goal, 'Shoot');
    var cv = g.cv, ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var sub = { x: W / 2 }, bubbles = [], fish = [], cool = 0;
    var COLS = ['#ff8a3d', '#ff6f91', '#f2c230', '#7fc8a9', '#b48ef0'];
    function newFish(lane, x) {
      var right = Math.random() < 0.5, a, b;
      if (right) { a = U.rand(D + 1, D + 10); b = a - D; } else { do { a = U.rand(4, 18); b = U.rand(1, a - 1); } while (a - b === D); }
      return { lane: lane, x: x, a: a, b: b, ok: a - b === D, col: U.pick(COLS) };
    }
    var lanes = [{ y: 80, v: 60 }, { y: 160, v: -75 }, { y: 240, v: 50 }];
    lanes.forEach(function (ln, i) { for (var k = 0; k < 3; k++) fish.push(newFish(i, k * 250 + U.rand(0, 80))); });
    loop(function (dt) {
      if (g.held.left) sub.x -= 280 * dt; if (g.held.right) sub.x += 280 * dt;
      sub.x = Math.max(40, Math.min(W - 40, sub.x));
      cool -= dt;
      var t; while ((t = g.tap())) if (t === 'action' && cool <= 0) { bubbles.push({ x: sub.x, y: H - 70 }); cool = 0.35; Audio2.sfx('tap'); }
      if (g.held.action && cool <= 0) { bubbles.push({ x: sub.x, y: H - 70 }); cool = 0.45; }
      fish.forEach(function (f) { var ln = lanes[f.lane]; f.x += ln.v * dt; if (ln.v > 0 && f.x > W + 60) f.x -= W + 160; if (ln.v < 0 && f.x < -60) f.x += W + 160; });
      bubbles.forEach(function (b) { b.y -= 360 * dt; });
      bubbles = bubbles.filter(function (b) {
        for (var i = 0; i < fish.length; i++) {
          var f = fish[i], fy = lanes[f.lane].y;
          if (Math.abs(b.x - f.x) < 42 && Math.abs(b.y - fy) < 22) {
            if (f.ok) { got++; g.score(got); Audio2.sfx('chomp'); g.msg(f.a + ' − ' + f.b + ' = ' + D + '!', true); Audio2.speak(f.a + ' minus ' + f.b + ' equals ' + D, { who: 'parrot' }); fish[i] = newFish(f.lane, lanes[f.lane].v > 0 ? -80 : W + 80); if (got >= goal) g.win('You popped them all!'); }
            else { Audio2.sfx('bump'); g.msg(f.a + ' − ' + f.b + ' = ' + (f.a - f.b) + ', not ' + D + '.'); }
            return false;
          }
        }
        return b.y > -20;
      });
      var sea = ctx.createLinearGradient(0, 0, 0, H); sea.addColorStop(0, '#2ec4e8'); sea.addColorStop(1, '#14629e'); ctx.fillStyle = sea; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f4d58d'; ctx.fillRect(0, H - 30, W, 30);
      fish.forEach(function (f) {
        var y = lanes[f.lane].y, dir = lanes[f.lane].v > 0 ? 1 : -1;
        ctx.fillStyle = f.col; ctx.strokeStyle = OL; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(f.x - 42 * dir, y); ctx.lineTo(f.x - 58 * dir, y - 14); ctx.lineTo(f.x - 58 * dir, y + 14); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(f.x, y, 44, 22, 0, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x + 30 * dir, y - 6, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(f.x + 31 * dir, y - 6, 2.5, 0, 7); ctx.fill();
        label(ctx, f.a + '−' + f.b, f.x - 4 * dir, y + 1, 16);
      });
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; bubbles.forEach(function (b) { ctx.fillStyle = 'rgba(200,240,255,.6)'; ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, 7); ctx.fill(); ctx.stroke(); });
      var sx = sub.x, sy = H - 50;
      ctx.fillStyle = '#ffc23c'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
      ctx.fillRect(sx - 4, sy - 30, 8, 14); ctx.strokeRect(sx - 4, sy - 30, 8, 14);
      ctx.beginPath(); ctx.ellipse(sx, sy, 34, 18, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bfe9ff'; ctx.beginPath(); ctx.arc(sx, sy - 2, 8, 0, 7); ctx.fill(); ctx.stroke();
    });
  }

  /* ------------ 4. Lily Pad Hop: fact families ------------ */
  function lilyHop(root) {
    var a = U.rand(2, 9), b = U.rand(2, 9); while (b === a) b = U.rand(2, 9);
    var c = a + b, goal = 3, homes = 0;
    var fam = [a + ' + ' + b + ' = ' + c, b + ' + ' + a + ' = ' + c, c + ' − ' + a + ' = ' + b, c + ' − ' + b + ' = ' + a];
    function other() { var x = U.rand(2, 9), y = U.rand(2, 9); if ([x, y, x + y].sort().join() === [a, b, c].sort().join()) y++; return Math.random() < .5 ? x + ' + ' + y + ' = ' + (x + y) : (x + y) + ' − ' + x + ' = ' + y; }
    var famSay = NW[a] + ', ' + NW[b] + ', and ' + NW[c];
    var g = frame(root, 'Lily Pad Hop', 'Hop only on pads from the ' + a + ', ' + b + ', ' + c + ' fact family!', 'Hop only on lily pads from the ' + famSay + ' fact family!', goal);
    var cv = g.cv, ctx = cv.getContext('2d'), W = cv.width, H = cv.height, CW = W / 9, ROWH = H / 7;
    var lanes = [];
    for (var r = 1; r <= 5; r++) {
      var v = (r % 2 ? 1 : -1) * U.rand(30, 55), pads = [];
      var fCount = 2;
      for (var k = 0; k < 3; k++) pads.push({ x: k * (W / 3) + U.rand(0, 60), eq: k < fCount ? U.pick(fam) : other() });
      pads.forEach(function (pd) { pd.ok = fam.indexOf(pd.eq) >= 0; });
      lanes.push({ row: r, v: v, pads: U.shuffle(pads).map(function (pd, i) { pd.x = i * (W / 3) + U.rand(0, 60); return pd; }) });
    }
    var frog = { col: 4, row: 6, x: 4.5 * CW, onPad: null };
    function reset(t) { frog.row = 6; frog.col = 4; frog.x = 4.5 * CW; frog.onPad = null; if (t) g.msg(t); }
    function land() {
      if (frog.row === 0) { homes++; g.score(homes); Audio2.sfx('star'); g.msg('Home safe!', true); if (homes >= goal) g.win('You crossed the river ' + goal + ' times!'); reset(); return; }
      if (frog.row === 6) { frog.onPad = null; return; }
      var ln = lanes[frog.row - 1], pd = ln.pads.filter(function (q) { return Math.abs(q.x - frog.x) < 62; })[0];
      if (!pd) { Audio2.sfx('bump'); reset('Splash! Hop onto a lily pad.'); return; }
      if (!pd.ok) { Audio2.sfx('gentle'); reset(pd.eq + ' is not in the ' + a + ', ' + b + ', ' + c + ' family. Back to the bank!'); return; }
      frog.onPad = pd; frog.x = pd.x; Audio2.sfx('tap'); g.msg(pd.eq, true);
      Audio2.speak(pd.eq.replace('−', 'minus').replace('+', 'plus').replace('=', 'equals'), { who: 'parrot' });
    }
    loop(function (dt) {
      var t;
      while ((t = g.tap())) {
        if (t === 'up' && frog.row > 0) { frog.row--; land(); }
        else if (t === 'down' && frog.row < 6) { frog.row++; land(); }
        else if (t === 'left') { frog.x -= CW; if (frog.onPad) { frog.onPad = null; land(); } }
        else if (t === 'right') { frog.x += CW; if (frog.onPad) { frog.onPad = null; land(); } }
        frog.x = Math.max(CW / 2, Math.min(W - CW / 2, frog.x));
      }
      lanes.forEach(function (ln) { ln.pads.forEach(function (pd) { pd.x += ln.v * dt; if (ln.v > 0 && pd.x > W + 80) pd.x -= W + 160; if (ln.v < 0 && pd.x < -80) pd.x += W + 160; }); });
      if (frog.onPad) { frog.x = frog.onPad.x; if (frog.x < 10 || frog.x > W - 10) { Audio2.sfx('bump'); reset('Whoa! You drifted away. Back to the bank.'); } }
      // draw
      ctx.fillStyle = '#7ccf5a'; ctx.fillRect(0, 0, W, ROWH); ctx.fillRect(0, 6 * ROWH, W, ROWH);
      var river = ctx.createLinearGradient(0, ROWH, 0, 6 * ROWH); river.addColorStop(0, '#2ab3e6'); river.addColorStop(1, '#1679b8'); ctx.fillStyle = river; ctx.fillRect(0, ROWH, W, 5 * ROWH);
      for (var hh = 0; hh < 3; hh++) { ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = OL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W * (hh + .5) / 3, ROWH / 2, 18, 0, 7); ctx.fill(); ctx.stroke(); }
      lanes.forEach(function (ln) {
        var y = (ln.row + .5) * ROWH;
        ln.pads.forEach(function (pd) {
          ctx.fillStyle = '#5fbf5f'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.ellipse(pd.x, y, 62, 24, 0, 0.25, Math.PI * 2 - 0.05); ctx.lineTo(pd.x, y); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#fff'; rr(ctx, pd.x - 48, y - 11, 96, 22, 8); ctx.fill();
          label(ctx, pd.eq, pd.x, y + 1, 14);
        });
      });
      var fy = (frog.row + .5) * ROWH - (frog.onPad ? 22 : 0);
      ctx.fillStyle = '#4fbf3a'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(frog.x, fy, 20, 16, 0, 0, 7); ctx.fill(); ctx.stroke();
      [-8, 8].forEach(function (dx) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(frog.x + dx, fy - 14, 6, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(frog.x + dx, fy - 14, 2.5, 0, 7); ctx.fill(); });
      ctx.beginPath(); ctx.arc(frog.x, fy + 2, 7, 0.2, Math.PI - 0.2); ctx.stroke();
    });
  }

  /* ------------ 5. Sea Serpent: skip counting ------------ */
  function seaSerpent(root) {
    var S = U.pick([2, 3, 4, 5, 10]), goal = 10, n = 0;
    var NAMES = { 2: 'twos', 3: 'threes', 4: 'fours', 5: 'fives', 10: 'tens' };
    var g = frame(root, 'Sea Serpent', 'Count by ' + S + 's! Eat ' + S + ', then ' + 2 * S + ', then ' + 3 * S + '…', 'Count by ' + NAMES[S] + '! Eat the numbers in order.', goal);
    var cv = g.cv, ctx = cv.getContext('2d'), W = cv.width, H = cv.height, CW = 46, COLS = 15, ROWS = 10;
    var body = [[3, 5], [2, 5], [1, 5]], dir = 'right', want = 'right', tick = 0, foods = [];
    var D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    function free(x, y) { return !body.some(function (b) { return b[0] === x && b[1] === y; }) && !foods.some(function (f) { return f.x === x && f.y === y; }); }
    function place() {
      foods = []; var next = (n + 1) * S, vals = [next], tries = 0;
      while (vals.length < 4 && tries++ < 50) { var v = next + U.pick([-2, -1, 1, 2, S + 1, S - 1].filter(function (d) { return d !== 0; })); if (v > 0 && v % S !== 0 && vals.indexOf(v) < 0) vals.push(v); }
      vals.forEach(function (v) { var x, y; do { x = U.rand(0, COLS - 1); y = U.rand(0, ROWS - 1); } while (!free(x, y) || Math.abs(x - body[0][0]) + Math.abs(y - body[0][1]) < 3); foods.push({ x: x, y: y, v: v }); });
    }
    place();
    loop(function (dt) {
      var t; while ((t = g.tap())) if (D[t]) { var back = { up: 'down', down: 'up', left: 'right', right: 'left' }[dir]; if (t !== back) want = t; }
      tick += dt;
      if (tick > 0.3) {
        tick = 0; dir = want;
        var h = body[0], nx = h[0] + D[dir][0], ny = h[1] + D[dir][1];
        var blocked = nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || body.some(function (b) { return b[0] === nx && b[1] === ny; });
        if (!blocked) {
          body.unshift([nx, ny]);
          var f = foods.filter(function (q) { return q.x === nx && q.y === ny; })[0];
          if (f && f.v === (n + 1) * S) {
            n++; g.score(n); Audio2.sfx('chomp'); g.msg(Array.from({ length: n }, function (_, i) { return (i + 1) * S; }).join(', '), true);
            Audio2.speak(String(f.v), { who: 'parrot' });
            if (n >= goal) { g.win('You counted by ' + S + 's all the way to ' + goal * S + '!'); return; }
            place();
          } else {
            body.pop();
            if (f) { Audio2.sfx('gentle'); g.msg('Not ' + f.v + '. Counting by ' + S + 's, the next number is ' + (n + 1) * S + '.'); foods = foods.filter(function (q) { return q !== f; }); }
          }
        }
      }
      ctx.fillStyle = '#1a8fd0'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.06)'; for (var x = 0; x < COLS; x++) for (var y = 0; y < ROWS; y++) if ((x + y) % 2) ctx.fillRect(x * CW, y * CW, CW, CW);
      foods.forEach(function (f) {
        var cx = f.x * CW + CW / 2, cy = f.y * CW + CW / 2;
        ctx.fillStyle = '#fff'; ctx.strokeStyle = OL; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill(); ctx.stroke();
        label(ctx, String(f.v), cx, cy + 1, 17);
      });
      body.forEach(function (b, i) {
        var cx = b[0] * CW + CW / 2, cy = b[1] * CW + CW / 2;
        ctx.fillStyle = i ? (i % 2 ? '#8d4fc2' : '#a26ad6') : '#b48ef0'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, i ? 18 : 21, 0, 7); ctx.fill(); ctx.stroke();
        if (!i) { ctx.fillStyle = '#fff'; [-7, 7].forEach(function (dx) { ctx.beginPath(); ctx.arc(cx + dx, cy - 5, 5, 0, 7); ctx.fill(); }); ctx.fillStyle = OL; [-7, 7].forEach(function (dx) { ctx.beginPath(); ctx.arc(cx + dx, cy - 5, 2.4, 0, 7); ctx.fill(); }); }
      });
    });
  }

  return { stop: stop, GAMES: GAMES };
})();
