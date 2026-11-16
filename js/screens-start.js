/* Title / profile select, captain builder, parrot naming, opening story. */
(function () {
  function litCount(p) {
    return Object.keys(p.progress).filter(function (k) { return p.progress[k].lit; }).length;
  }

  App.register('title', function (root) {
    var kids = Store.children();
    var html = '<div class="screen titlescreen">' + Art.titleScene() +
      '<div class="title-logo">The Lantern Voyage</div>' +
      '<div class="subtitle">Relight the lighthouses of the Bright Isles</div>' +
      '<div class="row" style="align-items:flex-end;gap:0"><div class="bob">' + Art.ship({ sail: 'sunset', flag: 'wave' }, 260) + '</div>' + Art.parrot(110, 'happy', { body: 0, wing: 0, beak: 0, wear: 'captain' }) + '</div>' +
      '<h2 style="color:#fff;text-shadow:0 2px 0 #0b4a73, 0 0 10px #0b4a73">Who is sailing today?</h2>' +
      '<div class="profiles">';
    kids.forEach(function (p) {
      var hb = p.course === 'harbor';
      html += '<div class="profile-card" data-id="' + p.id + '">' + (hb ? Art.sailor(p.captain, 120, Harbor.rank(p)) : Art.captain(p.captain, 120)) +
        '<div class="name">' + U.esc(p.name) + '</div><div class="muted">' + (hb ? 'Lantern Harbor · 1st grade' : 'Lantern Voyage · ' + U.plural(litCount(p), 'lighthouse') + ' lit') + '</div></div>';
    });
    html += '<div class="profile-card new" data-new="1"><div style="font-size:3rem">+</div><div class="name">New Captain</div></div>';
    html += '</div><div class="row" style="margin-top:auto"><button class="btn plain small" data-parent="1">🔒 Parent</button></div></div>';
    root.innerHTML = html;
    U.$$('.profile-card[data-id]', root).forEach(function (c) {
      c.onclick = function () {
        Audio2.sfx('tap');
        Store.setActive(c.getAttribute('data-id'));
        var p = Store.active();
        App.go(p.introSeen ? App.home() : 'intro');
      };
    });
    U.$('[data-new]', root).onclick = function () {
      var gate = Store.get().pin && Store.children().length ? Parent.requirePin : function (cb) { cb(); };
      gate(function () { App.go('builder', { mode: 'new' }); });
    };
    U.$('[data-parent]', root).onclick = function () { Parent.requirePin(function () { App.go('parent'); }); };
    setTimeout(function () { Audio2.speak(kids.length ? 'Welcome back, captain! Choose your profile.' : 'Welcome to The Lantern Voyage! Tap New Captain to begin.'); }, 300);
  });

  App.register('builder', function (root, args) {
    var editing = args.mode === 'edit' ? Store.active() : null;
    var c = editing ? JSON.parse(JSON.stringify(editing.captain)) : { gender: 'boy', skin: 1, hair: 0, hairColor: 1, outfit: 1, hat: 1 };
    var name = editing ? editing.name : '';
    var course = editing ? (editing.course || 'voyage') : 'voyage';
    function harbor() { return course === 'harbor'; }
    function fig(size) { return harbor() ? Art.sailor(c, size, editing ? Harbor.rank(editing) : 0) : Art.captain(c, size); }
    function sw(group, list, val) {
      return '<div class="swatches">' + list.map(function (col, i) {
        return '<span class="swatch' + (val === i ? ' on' : '') + '" style="background:' + col + '" data-g="' + group + '" data-v="' + i + '"></span>';
      }).join('') + '</div>';
    }
    function ch(group, list, val) {
      return '<div class="row">' + list.map(function (t, i) {
        var v = typeof t === 'object' ? t.v : i, label = typeof t === 'object' ? t.l : t;
        return '<button class="choice' + (val === v ? ' on' : '') + '" data-g="' + group + '" data-v="' + v + '">' + label + '</button>';
      }).join('') + '</div>';
    }
    /* new profile: choose the course first, on its own big screen */
    function chooseCourse() {
      var card = function (k, pic, title, grade, sub) {
        return '<button class="coursecard" data-course="' + k + '">' + pic + '<div class="ctitle">' + title + '</div><div class="cgrade">' + grade + '</div><div class="muted">' + sub + '</div></button>';
      };
      root.innerHTML = '<div class="screen paper"><div class="topbar"><button class="iconbtn" data-back="1" aria-label="Back">←</button><h1 class="grow">Which course?</h1></div>' +
        '<p class="center muted" style="margin:0 0 8px">For a parent to pick. You can change it later in the Parent area (Children → Change course).</p>' +
        '<div class="coursecards">' +
        card('harbor', '<div class="cpic">' + Art.sailor({ gender: 'boy', skin: 2, hair: 0, hairColor: 1, outfit: 0 }, 130, 0) + '</div>', 'Lantern Harbor', '1st grade', 'K5 review, then BJU Math 1') +
        card('voyage', '<div class="cpic">' + Art.ship({ sail: 'sunset', flag: 'wave' }, 170) + '</div>', 'The Lantern Voyage', '2nd–3rd grade', 'BJU Math 2 (ch. 14–20), then Math 3') +
        '</div></div>';
      U.$('[data-back]', root).onclick = function () { App.go('title'); };
      U.$$('[data-course]', root).forEach(function (b) { b.onclick = function () { Audio2.sfx('tap'); course = b.getAttribute('data-course'); picked = true; draw(); }; });
    }
    var picked = !!editing;
    function draw() {
      if (!picked) return chooseCourse();
      root.innerHTML = '<div class="screen paper">' +
        '<div class="topbar"><button class="iconbtn" data-back="1" aria-label="Back">←</button><h1 class="grow">' + (editing ? 'Change your look' : harbor() ? 'Who are you?' : 'Create your captain') + '</h1></div>' +
        '<div class="builder"><div class="card center">' + fig(240) + '<div style="font-size:1.4rem;font-weight:800">' + (U.esc(name) || (harbor() ? 'Your name' : 'Captain')) + '</div></div>' +
        '<div class="card">' +
        (editing ? '' : '<div class="optgroup"><div class="label">Course (for a parent to pick)</div>' + ch('course', [{ v: 'voyage', l: 'The Lantern Voyage · 2nd–3rd grade' }, { v: 'harbor', l: 'Lantern Harbor · 1st grade (K5 review + Math 1)' }], course) + '</div>') +
        '<div class="optgroup"><div class="label">' + (harbor() ? 'Your name' : 'Captain\'s name') + '</div><input class="textin" id="cname" maxlength="16" placeholder="Type your name" value="' + U.esc(name) + '"></div>' +
        '<div class="optgroup"><div class="label">I am a</div>' + ch('gender', [{ v: 'boy', l: 'Boy' }, { v: 'girl', l: 'Girl' }], c.gender) + '</div>' +
        '<div class="optgroup"><div class="label">Skin</div>' + sw('skin', Art.SKINS, c.skin) + '</div>' +
        '<div class="optgroup"><div class="label">Hair style</div>' + ch('hair', Art.HAIRS, c.hair) + '</div>' +
        '<div class="optgroup"><div class="label">Hair color</div>' + sw('hairColor', Art.HAIRCOLORS, c.hairColor) + '</div>' +
        '<div class="optgroup"><div class="label">' + (harbor() ? 'Shirt' : 'Outfit') + '</div>' + sw('outfit', Art.OUTFITS, c.outfit) + '</div>' +
        (harbor() ? '<p class="muted">You will earn new clothes and hats as you go up in rank!</p>' : '<div class="optgroup"><div class="label">Hat</div>' + ch('hat', Art.HATS, c.hat) + '</div>') +
        '<div class="row" style="justify-content:flex-end"><button class="btn green big" data-done="1">' + (editing ? 'Save' : harbor() ? 'Let\'s go!' : 'Set sail!') + '</button></div>' +
        '</div></div></div>';
      U.$$('[data-g]', root).forEach(function (b) {
        b.onclick = function () {
          var g = b.getAttribute('data-g'), v = b.getAttribute('data-v');
          if (g === 'course') course = v; else c[g] = g === 'gender' ? v : +v;
          name = U.$('#cname', root).value;
          Audio2.sfx('tap'); draw();
        };
      });
      var inp = U.$('#cname', root);
      inp.oninput = function () { name = inp.value; };
      var backTo = args.back || (editing && editing.course === 'harbor' ? 'boat' : 'shipyard');
      U.$('[data-back]', root).onclick = function () { if (editing) App.go(backTo); else { picked = false; draw(); } };
      U.$('[data-done]', root).onclick = function () {
        name = (U.$('#cname', root).value || '').trim();
        if (!name) { U.toast('Type your captain name first!'); Audio2.speak('Type your captain name first!'); return; }
        if (editing) { editing.name = name; editing.captain = c; Store.save(); App.go(backTo); return; }
        var p = Store.addChild({ name: name, captain: c, course: course });
        Store.setActive(p.id);
        App.go(course === 'harbor' ? 'intro' : 'parrot'); // in the harbor, the parrot comes later: it hatches from an egg
      };
    }
    draw();
    Audio2.speak(editing ? 'Change anything you like.' : 'Create your captain! Pick your name, your look, and your hat.');
    // (the course picker is for parents; Lantern Harbor's own screens speak everything)
  });

  /* Parrot builder: name, colors, and something to wear. Also reachable later from the shipyard. */
  App.register('parrot', function (root, args) {
    var p = Store.active(), editing = args && args.mode === 'edit';
    var cfg = { body: p.parrot.body || 0, wing: p.parrot.wing || 0, beak: p.parrot.beak || 0, wear: p.parrot.wear || 'none' };
    var sugg = ['Pip', 'Kiwi', 'Mango', 'Sunny', 'Pepper', 'Coco'];
    var nameVal = editing ? p.parrotName : '';
    function swatches(key, list) {
      return '<div class="row">' + list.map(function (c, i) { return '<button class="swatch' + (cfg[key] === i ? ' on' : '') + '" data-k="' + key + '" data-v="' + i + '" style="background:' + c + '" aria-label="color ' + (i + 1) + '"></button>'; }).join('') + '</div>';
    }
    function draw() {
      root.innerHTML = '<div class="screen titlescreen">' + Art.titleScene() + '<div class="paperbox" style="margin-top:20px"><div class="row" style="align-items:flex-start">' +
        '<div class="center" style="min-width:260px"><div id="pv">' + Art.parrot(220, 'happy', cfg) + '</div><h2 style="margin:6px 0">' + U.esc(nameVal || 'Your parrot') + '</h2></div>' +
        '<div class="grow"><h1 style="margin-top:0">' + (editing ? 'Change your parrot' : 'Squawk! Hello, Captain ' + U.esc(p.name) + '!') + '</h1>' +
        (editing ? '' : '<p style="font-size:1.15rem">I will be your navigator. Make me look just right, and give me a name!</p>') +
        '<div class="optgroup"><div class="label">Name</div><input class="textin" id="pname" maxlength="14" placeholder="Parrot name" value="' + U.esc(nameVal) + '">' +
        '<div class="row" style="margin-top:8px">' + sugg.map(function (s) { return '<button class="choice" data-s="' + s + '">' + s + '</button>'; }).join('') + '</div></div>' +
        '<div class="optgroup"><div class="label">Feathers</div>' + swatches('body', Art.PBODY) + '</div>' +
        '<div class="optgroup"><div class="label">Wings</div>' + swatches('wing', Art.PWING) + '</div>' +
        '<div class="optgroup"><div class="label">Beak</div>' + swatches('beak', Art.PBEAK) + '</div>' +
        '<div class="optgroup"><div class="label">Wears</div><div class="row">' + Art.PWEAR.map(function (w) { return '<button class="choice' + (cfg.wear === w[0] ? ' on' : '') + '" data-wear="' + w[0] + '">' + w[1] + '</button>'; }).join('') + '</div></div>' +
        '<button class="btn green big" data-ok="1">That\'s my parrot!</button></div></div></div></div>';
      U.$('#pname', root).oninput = function () { nameVal = this.value; };
      U.$$('[data-s]', root).forEach(function (b) { b.onclick = function () { nameVal = b.getAttribute('data-s'); Audio2.sfx('tap'); draw(); }; });
      U.$$('[data-k]', root).forEach(function (b) { b.onclick = function () { cfg[b.getAttribute('data-k')] = +b.getAttribute('data-v'); Audio2.sfx('tap'); draw(); }; });
      U.$$('[data-wear]', root).forEach(function (b) { b.onclick = function () { cfg.wear = b.getAttribute('data-wear'); Audio2.sfx('tap'); draw(); }; });
      U.$('[data-ok]', root).onclick = function () {
        var n = (nameVal || '').trim();
        if (!n) { U.toast('Give your parrot a name!'); return; }
        p.parrotName = n; p.parrot = cfg; Store.save();
        var gone = false, next = function () { if (!gone) { gone = true; App.go(editing ? 'shipyard' : 'intro'); } }; Audio2.speak(n + '! I love it! Squawk!', { who: 'parrot' }).then(next); setTimeout(next, 4000);
      };
    }
    draw();
    Audio2.speak(editing ? 'Change anything you like!' : 'Squawk! Hello, Captain ' + p.name + '! I will be your navigator. Pick my colors, what I wear, and my name!', { who: 'parrot' });
  });

  App.register('intro', function (root) {
    var p = Store.active(), i = 0, INTRO = p.course === 'harbor' ? CONTENT.courses.harbor.intro : CONTENT.intro;
    function art(kind) {
      if (kind === 'harbor') return '<svg viewBox="0 0 1600 900" width="520" style="max-width:100%;border-radius:18px">' + Art.harborScene().replace(/<svg[^>]*>/, '').replace('</svg>', '') + '</svg>';
      if (kind === 'kid') return '<div class="row" style="justify-content:center">' + Art.sailor(p.captain, 170, 0) + '</div>';
      if (kind === 'eli') return '<div class="row" style="justify-content:center">' + Art.keeper('eli', 170) + Art.sailor(p.captain, 130, 0) + '</div>';
      if (kind === 'boat') return '<div class="row" style="justify-content:center">' + Art.boat(0, 300) + Art.boat(22, 300, p.name) + '</div>';
      if (kind === 'lit') return '<svg viewBox="0 0 400 220" width="420">' + '<rect width="400" height="220" fill="#ffd9a8"/><rect y="150" width="400" height="70" fill="#3aa3d8"/>' + Art.lighthouse(120, 170, 1.4, true) + Art.lighthouse(300, 172, 1, true) + '</svg>';
      if (kind === 'fog') return '<svg viewBox="0 0 400 220" width="420"><rect width="400" height="220" fill="#c9d6df"/><rect y="150" width="400" height="70" fill="#7a9bb0"/>' + Art.lighthouse(120, 170, 1.4, false) + Art.lighthouse(300, 172, 1, false) + '<ellipse cx="200" cy="120" rx="240" ry="70" fill="#eef2f5" opacity=".8"/></svg>';
      if (kind === 'ship') return '<div class="row" style="justify-content:center">' + Art.captain(p.captain, 150) + '<div class="bob">' + Art.ship(p.ship, 260) + '</div></div>';
      return '<div class="row" style="justify-content:center">' + Art.keeperRosa(150) + Art.parrot(130, 'happy') + '</div>';
    }
    function draw() {
      var s = INTRO[i];
      root.innerHTML = '<div class="screen titlescreen">' + (p.course === 'harbor' ? Art.harborScene() : Art.titleScene()) + '<div class="paperbox center" style="margin-top:20px">' + art(s.art) +
        '<p style="font-size:1.35rem;max-width:720px">' + U.esc(s.say) + '</p>' +
        '<div class="row"><button class="iconbtn" data-say="1" aria-label="Hear again">🔊</button>' +
        '<button class="btn big" data-next="1">' + (i < INTRO.length - 1 ? 'Next' : p.course === 'harbor' ? 'Let\'s begin!' : 'Begin the voyage!') + '</button></div></div></div>';
      U.$('[data-say]', root).onclick = function () { Audio2.speak(s.say); };
      U.$('[data-next]', root).onclick = function () {
        Audio2.sfx('tap');
        if (i < INTRO.length - 1) { i++; draw(); }
        else { p.introSeen = true; Store.save(); App.go(App.home()); }
      };
      Audio2.speak(s.say);
    }
    draw();
  });
})();
