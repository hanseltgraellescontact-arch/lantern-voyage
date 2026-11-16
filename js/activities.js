/* Lantern Harbor hands-on activities (touch-first, for an iPad; also work with a mouse).
   The child DOES the math: catches fish into a basket while the narrator counts, traces and writes numbers,
   drags things to sort them, fills ten-frames, loads ducks into a boat to add, and so on.
   Activities are practice, never a test: mistakes get a gentle hint and another try.
   Act.run(host, spec, onDone)  — spec.type is one of the keys in TYPES below. */
var Act = (function () {
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function word(n) { return n <= 20 ? NUMW[n] : String(n); }
  var ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  function say(t) { return Audio2.speak(t); }
  function praise() { return U.pick(['Great job!', 'You did it!', 'Wonderful!', 'Nice work!']); }

  /* ---------- drag and drop that works with fingers and a mouse ---------- */
  function drag(el, o) {
    el.classList.add('dragit'); el._act = o;
    el.addEventListener('pointerdown', function (e) {
      if (el.classList.contains('placed') && !o.movable) return;
      e.preventDefault();
      var sx = e.clientX, sy = e.clientY, moved = false;
      el.setPointerCapture(e.pointerId); el.classList.add('lifted');
      if (o.onPick) o.onPick(el);
      function move(ev) { var dx = ev.clientX - sx, dy = ev.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.12)'; }
      function up(ev) {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        el.classList.remove('lifted');
        var target = null;
        (o.targets() || []).forEach(function (t) { var r = t.getBoundingClientRect(); if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) target = t; });
        el.style.transform = '';
        if (!moved && o.onTap) { o.onTap(el); return; }
        if (!target || !o.onDrop(target, el)) { el.classList.add('bounce'); setTimeout(function () { el.classList.remove('bounce'); }, 400); }
      }
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
  }
  function frame(host, title, body, foot) {
    host.innerHTML = '<div class="act"><div class="acthead"><span class="actbadge">✋ Let\'s do it!</span><b>' + U.esc(title) + '</b><span class="spacer"></span>' +
      '<button class="btn small plain" data-again="1">🔊 Again</button></div><div class="actstage">' + body + '</div><div class="actfoot">' + (foot || '') + '</div></div>';
    return U.$('.actstage', host);
  }
  /* "Watch me do the first one": after the instructions, the game moves the first piece itself, slowly,
     with a pointing hand, then says "Now you try!" (I do, then you do.) */
  function teachFirst(host, text, pickDemo) {
    var stage = U.$('.actstage', host);
    stage.classList.add('demoing');
    setTimeout(function () { stage.classList.remove('demoing'); }, 14000); // safety: never keep the pieces locked for long
    return say(text).then(function () {
      var d = pickDemo && pickDemo();
      if (!d || !d[0] || !d[1] || !document.body.contains(d[0])) return;
      return say('Watch me do the first one.').then(function () { return demoMove(d[0], d[1]); }).then(function () { return new Promise(function (r) { setTimeout(r, 1200); }); })
        .then(function () { return say('Now you try!'); });
    }).then(function () { stage.classList.remove('demoing'); }, function () { stage.classList.remove('demoing'); });
  }
  function demoMove(el, target) {
    return new Promise(function (res) {
      if (window.__fastVideo) { if (el._act) el._act.onDrop(target, el); res(); return; } // automated tests
      var a = el.getBoundingClientRect(), b = target.getBoundingClientRect();
      el.classList.add('demohand'); el.style.position = 'relative'; el.style.zIndex = 60; el.style.transition = 'transform 1.4s ease-in-out';
      requestAnimationFrame(function () { el.style.transform = 'translate(' + (b.left + b.width / 2 - a.left - a.width / 2) + 'px,' + (b.top + b.height / 2 - a.top - a.height / 2) + 'px)'; });
      setTimeout(function () { el.style.transition = ''; el.style.transform = ''; el.style.zIndex = ''; el.classList.remove('demohand'); if (el._act) el._act.onDrop(target, el); res(); }, 1550);
    });
  }
  function finish(host, msg, onDone) {
    Audio2.sfx('star');
    var f = U.$('.actfoot', host);
    f.innerHTML = '<div class="feedback good" style="flex:1">⭐ ' + U.esc(msg) + '</div><button class="btn big green" id="actnext">Next →</button>';
    U.$('#actnext', host).onclick = function () { Audio2.stop(); onDone(); };
    return say(msg);
  }

  /* ---------- catch and count: fish into the basket, wood onto the pile, letters into the mailbag ---------- */
  var THEMES = {
    fish: { icon: 'fish', cols: ['#3b8fd9', '#36b37e', '#ff9f1c', '#e5533d'], box: 'basket', where: 'sea', verb: 'Catch the fish! Drag each fish into the basket, or tap it.', end: 'fish in the basket' },
    wood: { icon: 'log', cols: ['#a0652d'], box: 'woodpile', where: 'forest', verb: 'Collect the wood! Drag each log to the woodpile, or tap it.', end: 'logs on the woodpile' },
    mail: { icon: 'letter', cols: ['#ffffff', '#fff3c4', '#d9f0ff'], box: 'mailbag', where: 'post', verb: 'Sort the mail! Drag each letter into the mailbag, or tap it.', end: 'letters in the mailbag' },
    apples: { icon: 'apple', cols: ['#e5533d', '#36b37e'], box: 'crate', where: 'orchard', verb: 'Pick the apples! Drag each apple into the crate, or tap it.', end: 'apples in the crate' },
    sails: { icon: 'sail', cols: ['#fbfbf5', '#8fd3ff', '#ffb35c'], box: 'chest', where: 'loft', verb: 'Fold the sails! Drag each sail into the chest, or tap it.', end: 'sails in the chest' },
    eggs: { icon: 'egg', cols: ['#fff6e0', '#f3dfc0', '#ffffff'], box: 'basket', where: 'orchard', verb: 'Gather the eggs! Drag each egg into the basket, or tap it.', end: 'eggs in the basket' },
    pennies: { icon: 'pennycoin', cols: ['#c9773b'], box: 'jar', where: 'shop', verb: 'Save the pennies! Drag each penny into the jar, or tap it. Each penny is one cent.', end: 'cents in the jar' }
  };
  function catchCount(host, sp, onDone) {
    var th = THEMES[sp.theme || 'fish'], step = sp.step || 1, goal = sp.n, total = 0, from = sp.from || 0;
    total = from;
    var stage = frame(host, sp.title || ('Count to ' + goal), '<div class="catch ' + th.where + '"><div class="pool" id="pool"></div><div class="bin" id="bin"><div class="binlbl">' + Art.icon(th.box === 'basket' ? 'basket' : th.box === 'woodpile' ? 'logpile' : th.box === 'mailbag' ? 'mailbag' : th.box === 'jar' ? 'jar' : 'crate', 90) +
      '</div><div class="g1num catchnum" id="cnum">' + (from || '') + '</div><div class="binitems" id="binitems"></div></div></div>');
    var pool = U.$('#pool', stage), bin = U.$('#bin', stage);
    function spawn() {
      var have = U.$$('.citem', pool).length, need = Math.min(10, Math.ceil((goal - total) / step)) - have;
      for (var i = 0; i < need; i++) {
        var col = th.cols[(total / step + have + i) % th.cols.length | 0], d = document.createElement('div');
        d.className = 'citem swim'; d.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
        d.innerHTML = (th.icon === 'pennycoin' ? Models.coin('penny', 56) : Art.icon(th.icon, 80, col)) + (step > 1 ? '<b class="stepbadge">' + step + '</b>' : '');
        pool.appendChild(d); hook(d);
      }
    }
    function put(el) {
      if (total >= goal) return;
      total += step; el.remove();
      U.$('#binitems', stage).insertAdjacentHTML('beforeend', '<span class="mini">' + el.innerHTML + '</span>');
      var cn = U.$('#cnum', stage); cn.textContent = total; cn.classList.remove('pop'); void cn.offsetWidth; cn.classList.add('pop');
      Audio2.sfx('coin'); say(word(total));
      if (total >= goal) setTimeout(function () { finish(host, 'We counted ' + (step > 1 ? 'by ' + word(step) + 's ' : '') + 'to ' + word(goal) + '! There are ' + word(goal) + ' ' + th.end + '.', onDone); }, 900);
      else spawn();
    }
    function hook(d) { drag(d, { targets: function () { return [bin]; }, onDrop: function () { put(d); return true; }, onTap: put }); }
    spawn();
    var intro = th.verb + ' Let\'s count to ' + word(goal) + (step > 1 ? ' by ' + word(step) + 's' : '') + (from ? ', starting at ' + word(from) : '') + '!';
    teachFirst(host, intro, function () { var it = U.$('.citem', host); return it && [it, U.$('#bin', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- trace and write numbers ---------- */
  var DIG = {
    0: ['M50 15 C 12 15, 12 125, 50 125 C 88 125, 88 15, 50 15'],
    1: ['M50 15 L50 125'],
    2: ['M22 42 C 24 8, 80 6, 78 42 C 76 70, 42 94, 20 125 L 84 125'],
    3: ['M24 28 C 42 4, 82 14, 74 44 C 68 64, 52 67, 44 68 C 62 68, 84 76, 80 102 C 76 132, 34 130, 22 110'],
    4: ['M60 15 L18 88 L86 88', 'M66 42 L66 125'],
    5: ['M32 15 L28 62 C 46 48, 84 54, 80 92 C 76 128, 34 130, 22 110', 'M32 15 L78 15'],
    6: ['M74 20 C 46 6, 20 46, 22 90 C 24 130, 80 130, 78 94 C 76 62, 34 62, 24 88'],
    7: ['M20 15 L82 15 L40 125'],
    8: ['M72 32 C 66 10, 28 10, 28 36 C 28 60, 74 70, 76 96 C 78 126, 22 126, 24 96 C 26 70, 74 60, 72 34'],
    9: ['M76 42 C 76 8, 22 8, 24 42 C 26 72, 76 72, 76 42 L 76 125']
  };
  var HOW = { 0: 'Start at the top. Go around to the left, all the way back to the top.', 1: 'Start at the top. Pull straight down.',
    2: 'Start at the top. Curve around, slide down to the corner, then go straight across.', 3: 'Start at the top. Around and in, then around and out.',
    4: 'Start at the top. Slant down, then go across. Lift your finger. Now make a long line straight down.', 5: 'Start at the top. Pull down, then go around the belly. Lift your finger and give it a hat on top.',
    6: 'Start at the top. Curve down and around, and close the loop.', 7: 'Start at the top. Go across, then slant down.',
    8: 'Start at the top. Make an S, then go back up to close it.', 9: 'Start at the top. Make a circle, then pull straight down.' };
  function trace(host, sp, onDone) {
    var list = sp.digits.slice(), write = sp.mode === 'write', k = 0;
    var stage = frame(host, write ? 'Write the numbers' : 'Trace the numbers', '<div class="tracewrap"><div class="tracebox" id="tbox"></div><div class="traceside"><div class="tracecount" id="tcount"></div>' +
      '<div class="tracepic" id="tpic"></div></div></div>',
      '<button class="btn plain" id="tclear">↺ Try again</button><button class="btn plain" id="tshow">👀 Show me</button><span class="spacer"></span><button class="btn plain" id="tskip" style="display:none">Next →</button>');
    var busy = false, box = U.$('#tbox', stage), tries = 0, strokes = [], cur = null, checkpoints = [], paths = [];
    function digitsOf(n) { return String(n).split('').map(Number); }
    function setup() {
      var n = list[k], ds = digitsOf(n), W = 100 * ds.length + 10 * (ds.length - 1);
      tries = 0; strokes = []; busy = false; U.$('#tskip', host).style.display = 'none';
      U.$('#tcount', stage).innerHTML = '<span class="g1word">' + word(n) + '</span>';
      U.$('#tpic', stage).innerHTML = Models.dots(n, 90);
      var svg = '<svg viewBox="-5 0 ' + (W + 10) + ' 140" class="tracesvg" id="tsvg"><rect x="-5" y="0" width="' + (W + 10) + '" height="140" fill="#fff"/>' +
        '<path d="M-5 15 H' + (W + 5) + ' M-5 125 H' + (W + 5) + '" stroke="#9fd0ff" stroke-width="1.5"/><path d="M-5 70 H' + (W + 5) + '" stroke="#ffb3a7" stroke-width="1" stroke-dasharray="4 4"/>';
      paths = [];
      ds.forEach(function (d, i) {
        DIG[d].forEach(function (pd, j) {
          var tx = i * 110;
          svg += '<path d="' + pd + '" transform="translate(' + tx + ',0)" fill="none" stroke="' + (write ? '#000' : '#c9c1ad') + '" stroke-opacity="' + (write ? '.08' : '1') + '" stroke-width="' + (write ? 8 : 10) + '" stroke-linecap="round" stroke-dasharray="' + (write ? 'none' : '1 9') + '" class="guide" data-tx="' + tx + '"/>';
          paths.push({ d: pd, tx: tx });
        });
      });
      paths.forEach(function (p, i) {
        var m = p.d.match(/^M\s*([\d.]+)\s+([\d.]+)/);
        svg += '<g class="startdot"><circle cx="' + (+m[1] + p.tx) + '" cy="' + m[2] + '" r="7" fill="#2f9e55"/><text x="' + (+m[1] + p.tx) + '" y="' + (+m[2] + 4) + '" text-anchor="middle" font-size="9" font-weight="800" fill="#fff">' + (i + 1) + '</text></g>';
      });
      svg += '<path id="ink" d="" fill="none" stroke="#3b6fd9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      box.innerHTML = svg;
      // checkpoints: points along each stroke
      checkpoints = paths.map(function (p) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'path'); el.setAttribute('d', p.d);
        var L = el.getTotalLength(), pts = [];
        for (var s = 0; s <= L; s += 6) { var q = el.getPointAtLength(s); pts.push([q.x + p.tx, q.y]); }
        return pts;
      });
      bindInk(); window.__trace = { checkpoints: checkpoints };
      var intro = (write ? 'Write the number ' : 'Trace the number ') + word(n) + '. ' + (ds.length > 1 ? 'First the ' + word(ds[0]) + ', then the ' + word(ds[1]) + '. ' : HOW[ds[0]]);
      say(intro); U.$('[data-again]', host).onclick = function () { say(intro); };
    }
    function bindInk() {
      var svg = U.$('#tsvg', box), ink = U.$('#ink', box), d = '';
      function pt(e) { var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; return [vb.x + (e.clientX - r.left) / r.width * vb.width, vb.y + (e.clientY - r.top) / r.height * vb.height]; }
      svg.addEventListener('pointerdown', function (e) { e.preventDefault(); svg.setPointerCapture(e.pointerId); cur = [pt(e)]; strokes.push(cur); d += ' M' + cur[0][0].toFixed(1) + ' ' + cur[0][1].toFixed(1); ink.setAttribute('d', d); });
      svg.addEventListener('pointermove', function (e) { if (!cur) return; var p = pt(e); cur.push(p); d += (d ? ' L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); ink.setAttribute('d', d); });
      function end() { if (!cur) return; cur = null; check(); }
      svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    }
    var checkT = null;
    function check() {
      if (busy) return;
      clearTimeout(checkT);
      checkT = setTimeout(function () {
        // Gentle on purpose: it does not need to stay inside the lines. It only needs to follow the shape of the number, roughly.
        var tol = write ? 30 : 24, all = [].concat.apply([], strokes), cps = [].concat.apply([], checkpoints);
        var hit = cps.filter(function (c) { return all.some(function (u) { return (u[0] - c[0]) * (u[0] - c[0]) + (u[1] - c[1]) * (u[1] - c[1]) < tol * tol; }); }).length;
        var stray = all.filter(function (u) { return !cps.some(function (c) { return (u[0] - c[0]) * (u[0] - c[0]) + (u[1] - c[1]) * (u[1] - c[1]) < 40 * 40; }); }).length;
        var ok = hit / cps.length >= (write ? 0.4 : 0.5) && stray / Math.max(1, all.length) < 0.5;
        if (busy) return;
        if (ok || (tries >= 2 && all.length > 12)) {
          busy = true;
          Audio2.sfx('right'); U.$('#ink', box).setAttribute('stroke', '#2f9e55');
          var n = list[k];
          saveWriting(n);
          say((ok ? U.pick(['Beautiful', 'Great writing', 'Nice', 'You did it']) : 'Good try') + '! That is ' + word(n) + '.').then(function () { if (U.$('#tsvg', box)) { k++; if (k < list.length) setup(); else finish(host, 'You ' + (write ? 'wrote' : 'traced') + ' all the numbers!', onDone); } });
        } else if (checkpoints.length > strokes.length) {
          // still has strokes to go (like the second line of a 4): wait for them
        } else {
          tries++;
          Audio2.sfx('gentle'); say(tries >= 2 ? 'Let\'s watch how to make it. Then try again.' : 'Almost! Start at the green dot and follow the path.');
          if (tries >= 2) { U.$('#tskip', host).style.display = ''; demo(); }
          setTimeout(clear, 900);
        }
      }, strokes.length < checkpoints.length ? 1600 : 450);
    }
    /* keep a copy of each number he writes for the parent's handwriting folder */
    function saveWriting(n) {
      var p = Store.active(), svg = U.$('#tsvg', box);
      if (!p || p.preview || !svg) return;
      var copy = svg.cloneNode(true); U.$$('.startdot', copy).forEach(function (g) { g.remove(); });
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); copy.removeAttribute('id'); copy.removeAttribute('class');
      Store.saveRecording({ id: 'w' + Date.now() + Math.floor(Math.random() * 1000), type: 'writing', profileId: p.id, number: n, mode: write ? 'write' : 'trace', date: new Date().toISOString(), svg: copy.outerHTML }).catch(function () {});
    }
    function clear() { strokes = []; cur = null; var ink = U.$('#ink', box); if (ink) { ink.setAttribute('d', ''); ink.setAttribute('stroke', '#3b6fd9'); } bindReset(); }
    function bindReset() { var svg = U.$('#tsvg', box), old = svg; var nw = old.cloneNode(true); old.parentNode.replaceChild(nw, old); bindInk(); }
    function demo() {
      var svg = U.$('#tsvg', box); if (!svg) return;
      var dotEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dotEl.setAttribute('r', '8'); dotEl.setAttribute('fill', '#ff6f91'); svg.appendChild(dotEl);
      var all = [].concat.apply([], checkpoints), i = 0;
      (function step() { if (!document.body.contains(dotEl)) return; if (i >= all.length) { dotEl.remove(); return; } dotEl.setAttribute('cx', all[i][0]); dotEl.setAttribute('cy', all[i][1]); i++; setTimeout(step, 45); })();
      say(HOW[digitsOf(list[k])[0]]);
    }
    U.$('#tclear', host).onclick = function () { clear(); Audio2.sfx('tap'); };
    U.$('#tshow', host).onclick = demo;
    U.$('#tskip', host).onclick = function () { k++; if (k < list.length) setup(); else finish(host, 'Good practice! Keep trying on paper too.', onDone); };
    setup();
  }

  /* ---------- sort things into groups ---------- */
  function sort(host, sp, onDone) {
    var items = U.shuffle(sp.items.slice()), left = items.length;
    var stage = frame(host, sp.title || 'Sort them', '<div class="sortpool" id="spool"></div><div class="sortbins ' + (sp.rows ? 'rows' : '') + '">' + sp.bins.map(function (b, i) {
      return '<div class="sbin" data-b="' + b.key + '"><div class="sbinlbl">' + (b.icon || '') + '<b>' + U.esc(b.label) + '</b></div><div class="sbinitems"></div></div>'; }).join('') + '</div>');
    var pool = U.$('#spool', stage);
    items.forEach(function (it) {
      var d = document.createElement('div'); d.className = 'sitem'; d.innerHTML = it.html; d.setAttribute('data-k', it.key); pool.appendChild(d);
      drag(d, { targets: function () { return U.$$('.sbin', stage); }, onPick: function () { if (it.say) say(it.say); }, onTap: function () { if (it.say) say(it.say); },
        onDrop: function (bin) {
          if (bin.getAttribute('data-b') !== it.key) { Audio2.sfx('gentle'); say(sp.hint ? sp.hint(it) : 'Hmm, that one goes somewhere else. Try again!'); return false; }
          U.$('.sbinitems', bin).appendChild(d); d.classList.add('placed'); Audio2.sfx('right'); left--;
          var bn = sp.bins.filter(function (b) { return b.key === it.key; })[0];
          if (sp.countBins) say(word(U.$$('.sitem', bin).length)); else if (bn && bn.sayDrop !== false) say(it.drop || bn.label);
          if (!left) setTimeout(function () { finish(host, sp.end || 'You sorted them all!', onDone); }, 700);
          return true;
        } });
    });
    var intro = sp.say || 'Drag each one to where it belongs.';
    teachFirst(host, intro, function () { var it = U.$('#spool .sitem', host); return it && [it, U.$('.sbin[data-b="' + it.getAttribute('data-k') + '"]', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- ten-frame: make a number with counters ---------- */
  function tenframe(host, sp, onDone) {
    var goal = sp.n, placed = 0, kind = sp.kind || 'duck', fill = sp.fill || 0; // fill: how many are already there (for "make ten")
    var nf = goal > 10 ? 2 : 1; // numbers past ten use two ten-frames: one full ten and some more
    function cells(f) { return '<div class="tframe">' + Array.from({ length: 10 }, function (_, j) { var i = f * 10 + j; return '<div class="tcell' + (i < fill ? ' full pre' : '') + '" data-i="' + i + '">' + (i < fill ? Art.icon(kind, 54, '#ffd23f') : '') + '</div>'; }).join('') + '</div>'; }
    var stage = frame(host, sp.title || ('Make ' + goal), '<div class="tfwrap"><div class="tframes" id="tf">' + cells(0) + (nf > 1 ? cells(1) : '') + '</div>' +
      '<div class="tfside"><div class="g1num catchnum" id="tfn">' + (fill || '') + '</div><div class="tfsupply" id="sup"></div></div></div>',
      '<button class="btn plain" id="tfundo">↺ Start over</button><span class="spacer"></span><button class="btn big green" id="tfdone">Done</button>');
    var tf = U.$('#tf', stage), sup = U.$('#sup', stage), col = sp.color || (fill ? '#3b8fd9' : '#ffd23f');
    function supply() { sup.innerHTML = ''; for (var i = 0; i < 4; i++) { var d = document.createElement('div'); d.className = 'sitem'; d.innerHTML = Art.icon(kind, 56, col); sup.appendChild(d); hook(d); } }
    function hook(d) { drag(d, { targets: function () { return [tf]; }, onTap: function () { add(); }, onDrop: function () { add(); return true; } }); }
    function add() {
      var cells = U.$$('.tcell:not(.full)', tf); // (all frames, in order) if (!cells.length) { say(nf > 1 ? 'The ten-frames are full!' : 'The ten-frame is full!'); return; }
      cells[0].classList.add('full'); cells[0].innerHTML = Art.icon(kind, 54, col); placed++;
      U.$('#tfn', stage).textContent = fill + placed; Audio2.sfx('tap'); say(word(fill + placed));
    }
    supply();
    U.$('#tfundo', host).onclick = function () { U.$$('.tcell.full:not(.pre)', tf).forEach(function (c) { c.classList.remove('full'); c.innerHTML = ''; }); placed = 0; U.$('#tfn', stage).textContent = fill || ''; };
    U.$('#tfdone', host).onclick = function () {
      var have = fill + placed;
      if (sp.mode === 'ten') {
        if (have === 10) finish(host, word(fill) + ' and ' + word(placed) + ' make ten!', onDone);
        else { Audio2.sfx('gentle'); say('Keep going until every box is full.'); }
      } else if (have === goal) finish(host, 'That is ' + word(goal) + '! ' + (goal > 10 ? 'One full ten and ' + word(goal - 10) + ' more make ' + word(goal) + '.' : 'You made a set of ' + word(goal) + '.'), onDone);
      else if (have < goal) { Audio2.sfx('gentle'); say('You have ' + word(have) + '. We need ' + word(goal) + '. Add some more.'); }
      else { Audio2.sfx('gentle'); say('You have ' + word(have) + '. That is too many. Tap start over and try again.'); }
    };
    var intro = sp.say || (sp.mode === 'ten' ? 'There are ' + word(fill) + ' ducks. Add ducks until the ten-frame is full. Then press done.' : 'Put ' + word(goal) + ' ' + (kind === 'duck' ? 'ducks' : 'counters') + (goal > 10 ? ' in the ten-frames. Fill the first one all the way to ten, then keep going.' : ' in the ten-frame.') + ' Then press done.');
    teachFirst(host, intro, function () { var it = U.$('.tfsupply .sitem', host); return it && [it, U.$('#tf', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- adding: load ducks from two docks into the boat ---------- */
  function join(host, sp, onDone) {
    var a = sp.a, b = sp.b, n = 0;
    var stage = frame(host, 'Put them together', '<div class="joinwrap"><div class="dock" id="da">' + ducks(a, '#ffd23f') + '<b>' + a + '</b></div><div class="boatbin" id="boat">' + Art.icon('boat', 120, '#e5533d') + '<div class="binitems" id="bi"></div><div class="g1num catchnum" id="jn"></div></div>' +
      '<div class="dock" id="db">' + ducks(b, '#ff9f1c') + '<b>' + b + '</b></div></div><div class="g1num center" id="eq" style="min-height:3rem"></div>');
    function ducks(k, c) { return Array.from({ length: k }, function () { return '<div class="sitem">' + Art.icon('duck', 54, c) + '</div>'; }).join(''); }
    var boat = U.$('#boat', stage);
    U.$$('.sitem', stage).forEach(function (d) { drag(d, { targets: function () { return [boat]; }, onTap: function () { load(d); }, onDrop: function () { load(d); return true; } }); });
    function load(d) {
      if (d.classList.contains('placed')) return;
      d.classList.add('placed'); U.$('#bi', stage).appendChild(d); n++; U.$('#jn', stage).textContent = n; Audio2.sfx('tap'); say(word(n));
      if (n === a + b) setTimeout(function () { U.$('#eq', stage).textContent = a + ' + ' + b + ' = ' + (a + b); finish(host, word(a) + ' plus ' + word(b) + ' equals ' + word(a + b) + '!', onDone); }, 800);
    }
    var intro = word(a) + ' yellow ducks and ' + word(b) + ' orange ducks want a boat ride. Put them all in the boat and count them!';
    teachFirst(host, intro, function () { var it = U.$('.dock .sitem', host); return it && [it, U.$('#boat', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- taking away: some ducks swim away ---------- */
  function takeaway(host, sp, onDone) {
    var a = sp.a, b = sp.b, gone = 0;
    var stage = frame(host, 'Take away', '<div class="joinwrap"><div class="boatbin big" id="boat">' + Art.icon('boat', 120, '#e5533d') + '<div class="binitems" id="bi">' +
      Array.from({ length: a }, function () { return '<div class="sitem">' + Art.icon('duck', 54, '#ffd23f') + '</div>'; }).join('') + '</div></div><div class="water" id="water">🌊 Water</div></div><div class="g1num center" id="eq" style="min-height:3rem"></div>');
    var water = U.$('#water', stage);
    U.$$('#bi .sitem', stage).forEach(function (d) { drag(d, { targets: function () { return [water]; }, onTap: function () { swim(d); }, onDrop: function () { swim(d); return true; } }); });
    function swim(d) {
      if (gone >= b || d.classList.contains('placed')) { if (gone >= b) say('That\'s enough! Only ' + word(b) + ' swim away.'); return; }
      d.classList.add('placed'); water.appendChild(d); gone++; Audio2.sfx('whoosh'); say(word(gone));
      if (gone === b) setTimeout(function () {
        say('Now count the ducks still in the boat.').then(function () {
          var left = U.$$('#bi .sitem', stage), c = 0;
          (function next() { if (c >= left.length) { U.$('#eq', stage).textContent = a + ' − ' + b + ' = ' + (a - b); finish(host, word(a) + ' take away ' + word(b) + ' is ' + word(a - b) + '!', onDone); return; }
            left[c].classList.add('counted'); c++; say(word(c)).then(next); })();
        });
      }, 600);
    }
    var intro = 'There are ' + word(a) + ' ducks in the boat. ' + word(b) + ' ducks swim away. Drag ' + word(b) + ' ducks into the water.';
    teachFirst(host, intro, function () { var it = U.$('#bi .sitem', host); return it && [it, U.$('#water', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- line up: first, second, third… or put things in order ---------- */
  function lineup(host, sp, onDone) {
    var n = sp.n || 5, cols = ['#e5533d', '#3b8fd9', '#36b37e', '#ffd23f', '#b48ef0', '#ff9f1c', '#ff6fa8', '#1fb5ad', '#8d5730', '#ffffff'], names = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'brown', 'white'], asks = U.shuffle(Array.from({ length: n }, function (_, i) { return i; })), k = 0;
    var who = U.shuffle(Array.from({ length: n }, function (_, i) { return i; }));
    var stage = frame(host, 'First, second, third', '<div class="lineup' + (n > 5 ? ' ten' : '') + '"><div class="flag">🚩 front</div>' + Array.from({ length: n }, function (_, i) { return '<div class="lspot" data-s="' + i + '"><div class="lslot"></div><b>' + ORD[i] + '</b></div>'; }).join('') + '</div><div class="sortpool" id="lpool">' +
      who.map(function (c) { return '<div class="sitem" data-c="' + c + '">' + Art.icon('duck', 60, cols[c]) + '</div>'; }).join('') + '</div>');
    function ask() {
      if (k >= n) { finish(host, 'Everyone is in line! ' + ORD.slice(0, n).join(', ') + '.', onDone); return; }
      stage.setAttribute('data-want', asks[k]); stage.setAttribute('data-spot', k);
      var t = 'Put the ' + names[asks[k]] + ' duck in the ' + ORD[k] + ' spot.'; say(t); U.$('[data-again]', host).onclick = function () { say(t); };
    }
    U.$$('#lpool .sitem', stage).forEach(function (d) {
      drag(d, { targets: function () { return U.$$('.lspot', stage); }, onPick: function () { say(names[+d.getAttribute('data-c')]); },
        onDrop: function (spot) {
          var s = +spot.getAttribute('data-s'), c = +d.getAttribute('data-c');
          if (s !== k || c !== asks[k]) { Audio2.sfx('gentle'); say(c !== asks[k] ? 'Find the ' + names[asks[k]] + ' duck.' : 'Count from the front: first, second, third…'); return false; }
          U.$('.lslot', spot).appendChild(d); d.classList.add('placed'); Audio2.sfx('right'); k++; setTimeout(ask, 500); return true;
        } });
    });
    say('The front of the line is by the flag.').then(ask);
  }

  /* ---------- match one to one: who has more? ---------- */
  function match(host, sp, onDone) {
    var a = sp.a, b = sp.b, made = 0, pairs = Math.min(a, b);
    var stage = frame(host, 'Which group has more?', '<div class="matchrow" id="fishrow">' + Array.from({ length: a }, function (_, i) { return '<div class="mslot" data-i="' + i + '">' + Art.icon('fish', 56, '#3b8fd9') + '<div class="mspot"></div></div>'; }).join('') + '</div>' +
      '<div class="sortpool" id="wpool">' + Array.from({ length: b }, function () { return '<div class="sitem">' + Art.icon('worm', 50) + '</div>'; }).join('') + '</div>');
    U.$$('#wpool .sitem', stage).forEach(function (d) {
      drag(d, { targets: function () { return U.$$('.mslot', stage).filter(function (s) { return !U.$('.mspot', s).children.length; }); },
        onDrop: function (slot) {
          U.$('.mspot', slot).appendChild(d); d.classList.add('placed'); made++; Audio2.sfx('tap');
          if (made === pairs) setTimeout(done, 600); return true;
        } });
    });
    function done() {
      var msg = a > b ? 'Some fish have no worm. There are more fish than worms. ' + word(a) + ' is more than ' + word(b) + '.' : a < b ? 'Some worms are left over. There are more worms than fish. ' + word(b) + ' is more than ' + word(a) + '.' : 'Every fish has one worm. They are the same! ' + word(a) + ' and ' + word(b) + ' are equal.';
      U.$$('.mslot', stage).forEach(function (s) { if (!U.$('.mspot', s).children.length) s.classList.add('alone'); });
      finish(host, msg, onDone);
    }
    var intro = 'Give each fish one worm. Drag a worm under each fish. Then we will see which group has more.';
    say(intro); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- pairs: even and odd ---------- */
  function pairs(host, sp, onDone) {
    var n = sp.n, placed = 0, boxes = Math.ceil(n / 2);
    var stage = frame(host, 'Make pairs', '<div class="pairboxes">' + Array.from({ length: boxes }, function () { return '<div class="pbox"><div class="pslot"></div><div class="pslot"></div></div>'; }).join('') + '</div>' +
      '<div class="sortpool" id="ppool">' + Array.from({ length: n }, function () { return '<div class="sitem">' + Art.icon('fish', 54, '#36b37e') + '</div>'; }).join('') + '</div>');
    U.$$('#ppool .sitem', stage).forEach(function (d) {
      drag(d, { targets: function () { return U.$$('.pbox', stage).filter(function (b) { return U.$$('.pslot:empty', b).length; }); }, onTap: function () { var b = U.$$('.pslot:empty', stage)[0]; if (b) put(d, b); },
        onDrop: function (box) { put(d, U.$('.pslot:empty', box)); return true; } });
    });
    function put(d, slot) {
      slot.appendChild(d); d.classList.add('placed'); placed++; Audio2.sfx('tap'); say(word(placed));
      if (placed === n) setTimeout(function () {
        if (n % 2) { U.$$('.pslot:empty', stage).forEach(function (s) { s.classList.add('alone'); }); finish(host, 'One fish has no partner. So ' + word(n) + ' is odd!', onDone); }
        else finish(host, 'Every fish has a partner. So ' + word(n) + ' is even!', onDone);
      }, 600);
    }
    var intro = 'Put the ' + word(n) + ' fish in pairs, two in each box. Does every fish get a partner?';
    teachFirst(host, intro, function () { var it = U.$('#ppool .sitem', host); return it && [it, U.$('.pbox', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- pattern: what comes next? ---------- */
  function pattern(host, sp, onDone) {
    var unit = sp.unit, C = { red: '#e5533d', blue: '#3b8fd9', yellow: '#ffd23f', green: '#36b37e' }, shown = sp.show || unit.length * 2, slots = sp.slots || 3, k = 0;
    var seq = Array.from({ length: shown + slots }, function (_, i) { return unit[i % unit.length]; });
    var stage = frame(host, 'Finish the pattern', '<div class="beads">' + seq.map(function (c, i) { return i < shown ? '<span class="bead" style="background:' + C[c] + '"></span>' : '<span class="bead empty" data-i="' + i + '" data-want="' + c + '"></span>'; }).join('') + '</div>' +
      '<div class="sortpool">' + U.uniq(unit).map(function (c) { return '<div class="sitem beadsrc" data-c="' + c + '"><span class="bead" style="background:' + C[c] + '"></span></div>'; }).join('') + '</div>');
    function hook(d) {
      drag(d, { targets: function () { return U.$$('.bead.empty', stage).slice(0, 1); }, onPick: function () { say(d.getAttribute('data-c')); }, onTap: function () { say(d.getAttribute('data-c')); },
        onDrop: function (slot) {
          var want = seq[+slot.getAttribute('data-i')], c = d.getAttribute('data-c');
          if (c !== want) { Audio2.sfx('gentle'); say('Say the pattern out loud: ' + unit.join(', ') + '. What comes next?'); return false; }
          slot.classList.remove('empty'); slot.style.background = C[c]; Audio2.sfx('right'); say(c); k++;
          if (k === slots) setTimeout(function () { finish(host, 'The pattern goes ' + unit.join(', ') + ', again and again!', onDone); }, 600);
          return false; // the bead in the tray stays there so it can be used again
        } });
    }
    U.$$('.beadsrc', stage).forEach(hook);
    var intro = 'Look at the beads: ' + seq.slice(0, shown).join(', ') + '. What comes next? Drag the right bead.';
    say(intro); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- clock: put the short hand on the hour ---------- */
  function clockset(host, sp, onDone) {
    var list = sp.hours.slice(), k = 0;
    var stage = frame(host, 'Set the clock', '<div class="center" id="clk"></div><div class="g1num center" id="ct"></div>');
    function draw(h) {
      var s = '<svg viewBox="0 0 200 200" width="300" height="300" class="clockset"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#2b2a3a" stroke-width="5"/>';
      for (var i = 1; i <= 12; i++) { var a = (i / 12) * 2 * Math.PI - Math.PI / 2, x = 100 + Math.cos(a) * 72, y = 100 + Math.sin(a) * 72; s += '<g class="hr" data-h="' + i + '"><circle cx="' + x + '" cy="' + y + '" r="15" fill="#fff8e0" stroke="#e8c27a" stroke-width="2"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="20" font-weight="800">' + i + '</text></g>'; }
      s += '<line x1="100" y1="100" x2="100" y2="22" stroke="#3b8fd9" stroke-width="5" stroke-linecap="round"/>';
      if (h) { var ha = (h / 12) * 2 * Math.PI - Math.PI / 2; s += '<line x1="100" y1="100" x2="' + (100 + Math.cos(ha) * 46) + '" y2="' + (100 + Math.sin(ha) * 46) + '" stroke="#e5533d" stroke-width="9" stroke-linecap="round"/>'; }
      return s + '<circle cx="100" cy="100" r="6" fill="#2b2a3a"/></svg>';
    }
    function ask() {
      var h = list[k]; U.$('#clk', stage).innerHTML = draw(0); stage.setAttribute('data-want', h); U.$('#ct', stage).textContent = h + ':00';
      var t = 'The long hand is on the twelve. Tap the ' + word(h) + ' to put the short hand there, and make it ' + word(h) + ' o\'clock.';
      say(t); U.$('[data-again]', host).onclick = function () { say(t); };
      U.$$('.hr', stage).forEach(function (g) { g.addEventListener('pointerdown', function () {
        var hh = +g.getAttribute('data-h'); U.$('#clk', stage).innerHTML = draw(hh);
        if (hh === h) { Audio2.sfx('right'); say('Yes! ' + word(h) + ' o\'clock.').then(function () { k++; if (k < list.length) ask(); else finish(host, 'You can set the clock!', onDone); }); }
        else { Audio2.sfx('gentle'); say('That is ' + word(hh) + ' o\'clock. Find the ' + word(h) + '.'); setTimeout(ask, 1800); }
      }); });
    }
    ask();
  }

  /* ---------- put things in order (number cards, days of the week) ---------- */
  function sequence(host, sp, onDone) {
    var items = sp.items, k = 0;
    var stage = frame(host, sp.title || 'Put them in order', '<div class="seqrow">' + items.map(function (_, i) { return '<div class="sqslot" data-i="' + i + '"></div>'; }).join('') + '</div>' +
      '<div class="sortpool" id="qpool">' + U.shuffle(items.map(function (it, i) { return '<div class="sitem seqcard" data-i="' + i + '">' + it.html + '</div>'; })).join('') + '</div>');
    U.$$('#qpool .sitem', stage).forEach(function (d) {
      var it = items[+d.getAttribute('data-i')];
      drag(d, { targets: function () { return U.$$('.sqslot:empty', stage).slice(0, 1); }, onPick: function () { say(it.say); }, onTap: function () { say(it.say); },
        onDrop: function (slot) {
          if (+d.getAttribute('data-i') !== k) { Audio2.sfx('gentle'); say(sp.hint || ('What comes after ' + items[k - 1 >= 0 ? k - 1 : 0].say + '?')); return false; }
          slot.appendChild(d); d.classList.add('placed'); Audio2.sfx('right'); say(it.say); k++;
          if (k === items.length) setTimeout(function () { finish(host, sp.end || 'They are all in order!', onDone); }, 700);
          return true;
        } });
    });
    var intro = sp.say || 'Put them in order. Touch a card to hear it.';
    teachFirst(host, intro, function () { var it = U.$('#qpool .sitem[data-i="0"]', host); return it && [it, U.$('.sqslot', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  /* ---------- build an addition sentence with number and sign cards ---------- */
  function sentence(host, sp, onDone) {
    var a = sp.a, b = sp.b, c = a + b, parts = [String(a), '+', String(b), '=', String(c)], k = 0;
    var d = 0; while ([a, b, c].indexOf(d) >= 0) d++;
    var tokens = U.shuffle(parts.concat([String(d), '−']));
    var duck = function (n, col) { return Array.from({ length: n }, function () { return Art.icon('duck', 46, col); }).join(''); };
    var pic = sp.given ? '<div class="g1num center">' + U.esc(sp.given) + '</div><div class="center"><b>Now turn it around!</b></div>' :
      '<div class="g1row" style="justify-content:center">' + (a ? duck(a, '#ffffff') : '<b>no white ducks</b>') + '<span class="g1op">and</span>' + (b ? duck(b, '#b07a4a') : '<b>no brown ducks</b>') + '</div>';
    var stage = frame(host, 'Build the addition sentence', pic + '<div class="sentbuild" id="slots">' + parts.map(function (_, i) { return '<div class="sentslot" data-i="' + i + '"></div>'; }).join('') + '</div>' +
      '<div class="sortpool" id="cards">' + tokens.map(function (t) { return '<div class="sitem sentcard" data-t="' + t + '">' + t + '</div>'; }).join('') + '</div>');
    var HINT = sp.given ? ['Turn it around. Start with the number that came second.', 'What sign means put together?', 'Now the other number.', 'What sign comes before the answer?', 'The answer stays the same!'] :
      ['First, how many white ducks?', 'What sign means put together?', 'How many brown ducks?', 'What sign comes before the answer?', 'How many ducks in all? Count them.'];
    stage.setAttribute('data-want', parts[0]);
    function slot() { return U.$('.sentslot[data-i="' + k + '"]', stage); }
    function place(el) {
      if (k >= parts.length || el.classList.contains('placed')) return false;
      if (el.getAttribute('data-t') !== parts[k]) { Audio2.sfx('gentle'); say(HINT[k]); return false; }
      var s = slot(); s.textContent = parts[k]; s.classList.add('filled'); el.classList.add('placed'); el.style.visibility = 'hidden'; Audio2.sfx('right');
      say(parts[k] === '+' ? 'plus' : parts[k] === '=' ? 'equals' : word(+parts[k])); k++; stage.setAttribute('data-want', parts[k] || '');
      if (k === parts.length) setTimeout(function () { finish(host, word(a) + ' plus ' + word(b) + ' equals ' + word(c) + '!', onDone); }, 700);
      return true;
    }
    U.$$('.sentcard', stage).forEach(function (el) { drag(el, { targets: function () { return slot() ? [slot()] : []; }, onTap: place, onDrop: function () { return place(el); } }); });
    var intro = sp.say || (sp.given ? sp.given.replace('+', 'plus').replace('=', 'equals') + '. Turn it around! Build the sentence with the numbers switched.' :
      'There ' + (a === 1 ? 'is one white duck' : 'are ' + word(a) + ' white ducks') + ' and ' + word(b) + ' brown duck' + (b === 1 ? '' : 's') + '. Build the addition sentence. Tap the cards in order.');
    teachFirst(host, intro, function () { var it = U.$('.sentcard[data-t="' + parts[0] + '"]', host); return it && [it, U.$('.sentslot[data-i="0"]', host)]; }); U.$('[data-again]', host).onclick = function () { say(intro); };
  }

  var TYPES = { sentence: sentence, sequence: sequence, catch: catchCount, trace: trace, sort: sort, tenframe: tenframe, join: join, takeaway: takeaway, lineup: lineup, match: match, pairs: pairs, pattern: pattern, clock: clockset };
  function run(host, spec, onDone) { var s = typeof spec === 'function' ? spec() : spec; TYPES[s.type](host, s, onDone); }
  return { run: run, TYPES: TYPES, DIG: DIG, HOW: HOW, THEMES: THEMES };
})();
