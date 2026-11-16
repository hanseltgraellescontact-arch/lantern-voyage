/* Arcade Cove: Pearl Maze — an original maze-chase game. Steer the boat, gobble pearls with right answers.
   Real-time movement, so it is used only for practice and fun, never for scored checks.
   Puffer fish just bounce the boat back to the start; wrong pearls show the right idea and cost nothing. */
var Maze = (function () {
  var LAYOUTS = [[
    '###############',
    '#.............#',
    '#.##.#####.##.#',
    '#.#...#.#...#.#',
    '#.#.#.#.#.#.#.#',
    '#...#.....#...#',
    '###.#.###.#.###',
    '#.....#.#.....#',
    '#.###.#.#.###.#',
    '#.............#',
    '###############'], [
    '###############',
    '#......#......#',
    '#.####.#.####.#',
    '#.#.........#.#',
    '#.#.##.#.##.#.#',
    '#......#......#',
    '#.##.#####.##.#',
    '#....#...#....#',
    '#.##...#...##.#',
    '#......#......#',
    '###############'], [
    '###############',
    '#.....#.#.....#',
    '#.###.....###.#',
    '#...#.###.#...#',
    '###.#.....#.###',
    '#.....#.#.....#',
    '#.###.#.#.###.#',
    '#.#.........#.#',
    '#.#.##.#.##.#.#',
    '#.............#',
    '###############']];
  var LAYOUT = LAYOUTS[0];
  var C = 46, COLS = 15, ROWS = 11;
  var raf = null, running = false;

  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; document.onkeydown = null; }
  function open(x, y) { return y >= 0 && y < ROWS && x >= 0 && x < COLS && LAYOUT[y][x] !== '#'; }

  /* Every pearl is a right answer, so the child sees (and hears) many ways to make the same amount. */
  /* Addition facts: every pearl is a right answer for this play's target, so the child sees many ways to make it. */
  function makeRound() {
    var T = U.pick([10, 11, 12, 13, 14, 15, 16, 18, 20]), pairs = [];
    for (var a = Math.max(0, T - 10); a <= Math.min(10, T); a++) pairs.push([a, T - a]);
    pairs = U.shuffle(pairs).slice(0, 8);
    var NW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    return { prompt: 'Every pearl makes ' + T + '. Gobble them all!', say: 'Every pearl makes ' + NW[T] + '! Gobble them all.',
      pearls: pairs.map(function (f) { return { label: f[0] + '+' + f[1], speak: f[0] + ' plus ' + f[1] + ' equals ' + T, show: f[0] + ' + ' + f[1] + ' = ' + T, ok: true }; }) };
  }

  App.register('maze', function (root, args) {
    var p = Store.active();
    if (!args.paid && !p.preview) {
      if (p.arcadeTokens <= 0) { U.toast('Earn a token by finishing three quests!'); App.go('map'); return; }
      p.arcadeTokens--; Store.save();
    }
    var round = makeRound();
    LAYOUT = U.pick(LAYOUTS);
    root.innerHTML = '<div class="screen" style="background:linear-gradient(#0f4f7a,#0a3354)">' +
      '<div class="topbar"><button class="iconbtn" id="mx">✕</button><h1 style="color:#fff" class="grow">🕹 Pearl Maze</h1>' +
      '<div class="pill" id="left"></div></div>' +
      '<div class="paperbox center" style="padding:12px 18px;margin-bottom:12px"><div class="row" style="justify-content:center"><button class="iconbtn" id="say">🔊</button>' +
      '<h2 style="margin:0">' + round.prompt + '</h2></div><div id="msg" class="muted" style="min-height:26px;font-weight:700"></div></div>' +
      '<div class="maze-wrap"><canvas class="maze" id="cv" width="' + COLS * C + '" height="' + ROWS * C + '"></canvas>' +
      '<div class="center"><div class="dpad"><span></span><button data-d="up">▲</button><span></span><button data-d="left">◀</button><span></span><button data-d="right">▶</button><span></span><button data-d="down">▼</button><span></span></div>' +
      '<p style="color:#fff;max-width:220px">Each press moves your boat one space. Use the arrow keys or these buttons. Puffer fish just bounce you back to the start!</p></div></div></div>';
    U.$('#say', root).onclick = function () { Audio2.speak(round.say, { who: 'parrot' }); };
    U.$('#mx', root).onclick = function () { stop(); App.go('arcade'); };
    Audio2.speak(round.say, { who: 'parrot' });

    var cv = U.$('#cv', root), ctx = cv.getContext('2d');
    var cells = [];
    for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (open(x, y)) cells.push([x, y]);
    var start = [1, 9];
    var far = cells.filter(function (c) { return Math.abs(c[0] - start[0]) + Math.abs(c[1] - start[1]) > 9; });
    var f1 = U.pick(far), f2 = U.pick(far.filter(function (c) { return c !== f1; }));
    var avoid = function (c) { return (Math.abs(c[0] - start[0]) + Math.abs(c[1] - start[1]) < 3) || c === f1 || c === f2; };
    var spots = U.shuffle(cells.filter(function (c) { return !avoid(c); }));
    var pearls = round.pearls.map(function (pl, i) { return { x: spots[i][0], y: spots[i][1], label: pl.label, speak: pl.speak, show: pl.show, ok: true, gone: false }; });
    var boat = { x: start[0], y: start[1], px: start[0], py: start[1], speed: 7 };
    var fish = [{ x: f1[0], y: f1[1], px: f1[0], py: f1[1], dir: 'left', speed: 1.4 }, { x: f2[0], y: f2[1], px: f2[0], py: f2[1], dir: 'right', speed: 1.2 }];
    var D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    var leftCount = function () { return pearls.filter(function (q) { return q.ok && !q.gone; }).length; };
    function updLeft() { U.$('#left', root).textContent = leftCount() + ' pearls left'; }
    updLeft();

    /* one press = one space */
    function setWant(d) {
      if (!running) return;
      if (boat.px !== boat.x || boat.py !== boat.y) return; // still sliding into the last square
      if (open(boat.x + D[d][0], boat.y + D[d][1])) { boat.x += D[d][0]; boat.y += D[d][1]; Audio2.sfx('tap'); }
      else Audio2.sfx('bump');
    }
    U.$$('[data-d]', root).forEach(function (b) {
      b.onpointerdown = function (e) { e.preventDefault(); setWant(b.getAttribute('data-d')); };
    });
    document.onkeydown = function (e) {
      var m = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }[e.key];
      if (m) { e.preventDefault(); setWant(m); }
    };

    function stepActor(a, dt, choose) {
      // moves toward (a.x,a.y) target cell; when arrived, choose next
      var tx = a.x, ty = a.y, dx = tx - a.px, dy = ty - a.py, dist = Math.abs(dx) + Math.abs(dy), move = a.speed * dt;
      if (dist <= move) { a.px = tx; a.py = ty; choose(a); }
      else { a.px += Math.sign(dx) * move; a.py += Math.sign(dy) * move; }
    }
    function chooseBoat() { eat(); }
    function chooseFish(f) {
      var back = { up: 'down', down: 'up', left: 'right', right: 'left' }[f.dir];
      var opts = Object.keys(D).filter(function (d) { return d !== back && open(f.x + D[d][0], f.y + D[d][1]); });
      if (!opts.length) opts = [back];
      f.dir = U.pick(opts); f.x += D[f.dir][0]; f.y += D[f.dir][1];
    }
    var msgTimer = null;
    function msg(t, good) {
      var m = U.$('#msg', root); if (!m) return;
      m.textContent = t; m.style.color = good ? '#2f9e55' : '#b4621a';
      clearTimeout(msgTimer); msgTimer = setTimeout(function () { if (m) m.textContent = ''; }, 2500);
    }
    function eat() {
      pearls.forEach(function (q) {
        if (q.gone || q.x !== boat.x || q.y !== boat.y) return;
        q.gone = true;
        Audio2.sfx('chomp'); msg('Yum! ' + q.show, true); Audio2.speak(q.speak, { who: 'parrot' });
        updLeft();
        if (!leftCount()) win();
      });
    }
    function win() {
      running = false; Audio2.sfx('fanfare');
      p.shells += 5; Store.save();
      setTimeout(function () {
        U.modal('<div class="center">' + Art.parrot(120, 'happy') + '<h2>You cleared the maze!</h2><p style="font-size:1.2rem">+5 shells</p>' +
          '<button class="btn big" data-x="1">Back to sailing</button></div>', function (o, api) {
            o.querySelector('[data-x]').onclick = function () { api.close(); App.go('arcade'); };
          });
        Audio2.speak('You cleared the maze! Five shells for you!', { who: 'parrot' });
      }, 400);
    }

    /* underwater reef: the background is painted once, then pearls, puffer fish, bubbles and the little submarine on top */
    var bg = document.createElement('canvas'); bg.width = cv.width; bg.height = cv.height;
    (function paintReef() {
      var g = bg.getContext('2d'), W = bg.width, H = bg.height;
      var grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, '#2ec4e8'); grad.addColorStop(.55, '#1a8fd0'); grad.addColorStop(1, '#14629e');
      g.fillStyle = grad; g.fillRect(0, 0, W, H);
      g.globalAlpha = .12; g.fillStyle = '#fff';
      [[80, 140], [260, 330], [470, 560]].forEach(function (r) { g.beginPath(); g.moveTo(r[0], 0); g.lineTo(r[0] + 60, 0); g.lineTo(r[1] + 160, H); g.lineTo(r[1], H); g.closePath(); g.fill(); });
      // sunken ship silhouette and kelp in the far background
      g.globalAlpha = .18; g.fillStyle = '#0b3a5c';
      g.beginPath(); g.moveTo(330, H - 70); g.lineTo(560, H - 90); g.lineTo(520, H - 30); g.lineTo(360, H - 30); g.closePath(); g.fill();
      g.fillRect(430, H - 230, 8, 150); g.fillRect(500, H - 190, 6, 110);
      g.beginPath(); g.moveTo(438, H - 225); g.lineTo(490, H - 200); g.lineTo(438, H - 170); g.fill();
      g.strokeStyle = '#0b3a5c'; g.lineWidth = 6;
      [60, 150, 610, 650].forEach(function (x, i) { g.beginPath(); g.moveTo(x, H); for (var y = H; y > H - 160 - i * 20; y -= 20) g.quadraticCurveTo(x + (y % 40 ? 14 : -14), y - 10, x, y - 20); g.stroke(); });
      g.globalAlpha = 1;
      var cols = ['#9a86d0', '#a7b0bf', '#ff8a80', '#f2a65a', '#7fc8a9'];
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        if (LAYOUT[y][x] !== '#') continue;
        var c = cols[(x * 7 + y * 13) % cols.length], px = x * C, py = y * C;
        g.fillStyle = c; g.strokeStyle = '#2b2a3a'; g.lineWidth = 3;
        g.beginPath(); g.moveTo(px + 6, py + C - 3); g.quadraticCurveTo(px + 1, py + 10, px + 14, py + 4); g.quadraticCurveTo(px + C / 2, py - 2, px + C - 10, py + 5);
        g.quadraticCurveTo(px + C + 1, py + 14, px + C - 4, py + C - 3); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(px + 16, py + 14, 7, 4, -0.4, 0, 7); g.fill();
        if ((x * 3 + y) % 5 === 0 && y > 0 && LAYOUT[y - 1][x] !== '#') { // a little coral on top
          g.strokeStyle = '#ff6f91'; g.lineWidth = 5; g.lineCap = 'round';
          g.beginPath(); g.moveTo(px + C / 2, py + 6); g.lineTo(px + C / 2, py - 10); g.moveTo(px + C / 2, py - 2); g.lineTo(px + C / 2 - 9, py - 12); g.moveTo(px + C / 2, py); g.lineTo(px + C / 2 + 9, py - 9); g.stroke();
        }
      }
    })();
    var bubbles = []; for (var bi = 0; bi < 14; bi++) bubbles.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: 2 + Math.random() * 4, v: 15 + Math.random() * 25 });
    function draw(dt) {
      ctx.drawImage(bg, 0, 0);
      ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5;
      bubbles.forEach(function (b) { b.y -= b.v * (dt || 0.016); if (b.y < -10) { b.y = cv.height + 10; b.x = Math.random() * cv.width; } ctx.beginPath(); ctx.arc(b.x + Math.sin(b.y / 20) * 3, b.y, b.r, 0, 7); ctx.stroke(); });
      pearls.forEach(function (q) {
        if (q.gone) return;
        var cx = q.x * C + C / 2, cy = q.y * C + C / 2;
        var pg = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 21); pg.addColorStop(0, '#ffffff'); pg.addColorStop(1, '#e9e2ff');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill();
        ctx.strokeStyle = '#2b2a3a'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#2b2a3a'; ctx.font = 'bold ' + (q.label.length > 4 ? 13 : 15) + 'px Trebuchet MS, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(q.label, cx, cy + 1);
      });
      fish.forEach(function (f) {
        var cx = f.px * C + C / 2, cy = f.py * C + C / 2;
        ctx.strokeStyle = '#2b2a3a'; ctx.lineWidth = 2.5;
        for (var a = 0; a < 10; a++) { var an = a * Math.PI / 5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 16, cy + Math.sin(an) * 16); ctx.lineTo(cx + Math.cos(an) * 23, cy + Math.sin(an) * 23); ctx.stroke(); }
        ctx.fillStyle = '#ffd54a'; ctx.beginPath(); ctx.arc(cx, cy, 17, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx - 6, cy - 4, 5, 0, 7); ctx.arc(cx + 6, cy - 4, 5, 0, 7); ctx.fill();
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(cx - 5, cy - 4, 2.4, 0, 7); ctx.arc(cx + 7, cy - 4, 2.4, 0, 7); ctx.fill();
        ctx.strokeStyle = '#a05a00'; ctx.beginPath(); ctx.arc(cx, cy + 4, 5, 0.2, Math.PI - 0.2); ctx.stroke();
      });
      // the little submarine (painted in your sail color)
      var bx = boat.px * C + C / 2, by = boat.py * C + C / 2;
      ctx.strokeStyle = '#2b2a3a'; ctx.lineWidth = 3;
      ctx.fillStyle = Art.SAILS[p.ship.sail] === '#fbfbf5' ? '#ffc23c' : Art.SAILS[p.ship.sail] || '#ffc23c';
      ctx.fillRect(bx - 2, by - 21, 5, 10); ctx.strokeRect(bx - 2, by - 21, 5, 10);
      ctx.beginPath(); ctx.ellipse(bx, by, 19, 13, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#bfe9ff'; ctx.beginPath(); ctx.arc(bx + 6, by - 1, 6, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2b2a3a'; ctx.beginPath(); ctx.moveTo(bx - 19, by); ctx.lineTo(bx - 26, by - 7); ctx.lineTo(bx - 26, by + 7); ctx.closePath(); ctx.fill();
    }
    function roundRect(x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    var last = performance.now(), invuln = 0;
    function loop(t) {
      if (!running) return;
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      stepActor(boat, dt, chooseBoat);
      fish.forEach(function (f) { stepActor(f, dt, chooseFish); });
      invuln = Math.max(0, invuln - dt);
      if (!invuln) fish.forEach(function (f) {
        if (Math.abs(f.px - boat.px) + Math.abs(f.py - boat.py) < 0.7) {
          Audio2.sfx('bump'); msg('Boing! A puffer fish bounced you back.');
          boat.x = boat.px = start[0]; boat.y = boat.py = start[1]; invuln = 1.5;
        }
      });
      draw(dt);
      raf = requestAnimationFrame(loop);
    }
    running = true; raf = requestAnimationFrame(loop);
  });

  return { stop: stop };
})();
