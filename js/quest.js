/* The quest runner.
   Lesson quest:  Lantern warm-up → Keeper's lesson → Practice → Island challenge → Tell your parrot → Lesson complete
   Harbor Review: warm-up → challenge → memory verse → complete.   Lighthouse Challenge: challenge → complete.
   Lighthouse Check (pretest): short check of every lesson; lessons answered fully right are marked "already known".
   Mastery: 90%+ = 3 stars, 85–89% = 2 stars (both pass), below 85% = re-teach + fresh problems. Two fails flag the quest for a parent.
   A multiple-choice problem only counts as right when the "How do you know?" part is right too.
   Every quest ends back on the island: the child must choose to start the next one. */
var Quest = (function () {
  var Q = null;
  var STEP_NAMES = { warmup: 'Lantern warm-up', lesson: "Keeper's lesson", practice: 'Practice', challenge: 'Island challenge', explain: 'Tell your parrot',
    verse: 'Memory verse', wrap: 'Quest complete', preIntro: 'Lighthouse Check', preWrap: 'Check complete' };

  function pipTxt(v) { return typeof v === 'number' && v >= 1000 ? v.toLocaleString('en-US') : v; }
  App.register('quest', function (root, args) {
    var p = Store.active(), isl = CONTENT.islands[args.island], q;
    if (args.quest === 'pretest') q = { id: isl.id + '-pre', num: 0, title: 'Lighthouse Check', kind: 'pretest' };
    else q = isl.quests.filter(function (x) { return x.id === args.quest; })[0];
    var steps;
    if (args.quest !== 'pretest' && q.kind === 'readiness') steps = ['preIntro', 'challenge', 'preWrap'];
    else if (q.kind === 'teach') steps = ['lesson', 'practice', 'challenge', 'wrap'];
    else if (q.kind === 'lesson') steps = ['warmup', 'lesson', 'practice', 'challenge', 'explain', 'wrap'];
    else if (q.kind === 'review') steps = ['warmup', 'challenge', 'verse', 'wrap'];
    else if (q.kind === 'pretest') steps = ['preIntro', 'challenge', 'preWrap'];
    else steps = args.early && p.verses.indexOf(isl.id + ':verse') < 0 ? ['challenge', 'verse', 'wrap'] : ['challenge', 'wrap'];
    STEP_NAMES.preIntro = W().check; STEP_NAMES.challenge = W().challenge; STEP_NAMES.preWrap = 'Check complete';
    if (q.kind === 'readiness') STEP_NAMES.preIntro = q.title;
    if (!isl.factSets && !isl.warmup) steps = steps.filter(function (x) { return x !== 'warmup'; });
    // Lantern Harbor teaches by doing: hands-on activities replace most problem sets, and quizzes stay short
    if (App.isHarbor() && q.play) {
      if (q.kind === 'review') steps = ['play', 'challenge', 'verse', 'wrap'];
      else steps = steps.filter(function (x) { return x !== 'warmup'; }).map(function (x) { return x === 'practice' ? 'play' : x; });
    }
    // Lantern Harbor: every quest starts with a short how-to video, before any check or problems
    if (App.isHarbor() && window.Video && !args.early) steps = ['watch'].concat(steps);
    STEP_NAMES.play = 'Let\'s do it!';
    STEP_NAMES.watch = 'Watch & learn';
    Q = { root: root, p: p, isl: isl, q: q, steps: steps, i: 0, level: 2, reteach: false, early: !!args.early, seen: {}, fast: 0, explained: false };
    run();
  });

  /* words and sizes that differ between the two courses */
  var WORDS = { check: 'Lighthouse Check', challenge: 'Island challenge', boss: 'Lighthouse Challenge', review: 'Harbor Review', back: 'Back to the island', bossWin: 'You relit the lighthouse!', bossBtn: 'See the island come alive!', bossNeed: 'You need 90% to relight the lighthouse.' };
  function W() { var w = App.course().words || {}, o = {}; Object.keys(WORDS).forEach(function (k) { o[k] = w[k] || WORDS[k]; }); return o; }
  function SZ() { var z = App.course().sizes || {}; return { lessonNew: z.lessonNew || 6, lessonReview: z.lessonReview || 4, review: z.review || 12, boss: z.boss || 15, warm: z.warm || 6 }; }
  function useWhy() { return App.course().why !== false; }
  function usePip() { return App.course().pip !== false; }
  function run() {
    var s = Q.steps[Q.i];
    ({ play: play, watch: watch, warmup: warmup, lesson: lesson, practice: practice, challenge: challenge, explain: explain, verse: verse, wrap: wrap, preIntro: preIntro, preWrap: preWrap })[s]();
  }
  function next() { Q.i++; run(); }

  /* One place that defines how each kind of section treats a wrong answer (shown to the child as a label). */
  var RULES = {
    practice: { label: '🔁 Two tries, and help is here', say: 'Practice. You get two tries, and help is here.' },
    challenge: { label: '🎯 One try each', say: 'Challenge. One try for each problem.' },
    pretest: { label: '🧭 One try. Just do your best!', say: '' }
  };
  function frame(speakerHtml, speakerText, boardHtml) {
    var stepsBar = Q.steps.map(function (s, i) { return '<span class="' + (i < Q.i ? 'done' : i === Q.i ? 'on' : '') + '" title="' + STEP_NAMES[s] + '"></span>'; }).join('');
    Q.root.innerHTML = '<div class="screen titlescreen" style="padding-top:12px">' + (App.isHarbor() ? Art.harborScene() : Art.titleScene()) +
      '<div class="qhead noprint"><button class="iconbtn" data-quit="1" aria-label="Leave quest">✕</button>' +
      '<div class="pill">' + U.esc(Q.isl.name) + (Q.q.num ? ' · Quest ' + Q.q.num : '') + ': ' + U.esc(Q.q.title) + '</div><div class="spacer"></div>' +
      '<div class="pill">' + STEP_NAMES[Q.steps[Q.i]] + '</div><div class="steps">' + stepsBar + '</div></div>' +
      '<div class="stage"><div class="speaker">' + speakerHtml + '<div class="bubble" id="bubble">' + (speakerText || '') + '</div></div>' +
      '<div class="board" id="board">' + boardHtml + '</div></div></div>';
    U.$('[data-quit]', Q.root).onclick = function () {
      U.confirmBox('Leave this quest? Your progress in this quest will not be saved.', 'Leave', function () { App.go('island', { id: Q.isl.id }); });
    };
    return U.$('#board', Q.root);
  }
  function parrot(mood) { return App.buddyArt(150, mood) + '<b>' + U.esc(App.parrotName()) + '</b>'; }
  function keeper() { return Art.keeper(Q.isl.keeper.art, 160) + '<b>' + Q.isl.keeper.name + '</b>'; }
  function thanks() { return App.buddyIsEli() ? 'That\'s it! You explained it well.' : 'Squawk! Now I understand!'; }
  function KV() { return (Q.isl.keeper && Q.isl.keeper.voice) || 'keeperF'; }
  function bubble(t) { var b = U.$('#bubble', Q.root); if (b) b.textContent = t; }

  /* ---------------- numpad (shared) ---------------- */
  function numpadHtml() {
    return '<div class="numpad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map(function (x) {
      return '<button data-k="' + x + '"' + (x === '✓' ? ' class="ok"' : '') + '>' + x + '</button>';
    }).join('') + '</div>';
  }
  function bindNumpad(root, onChange, onEnter, maxLen) {
    var v = ''; maxLen = maxLen || 4;
    function press(k) {
      if (k === '⌫') v = v.slice(0, -1);
      else if (k === '✓') { onEnter(); return; }
      else if (v.length < maxLen) v += k;
      else { var ab0 = root.querySelector('.answerbox'); if (ab0) { ab0.classList.add('shake'); setTimeout(function () { ab0.classList.remove('shake'); }, 300); } return; }
      Audio2.sfx('tap'); onChange(v);
    }
    U.$$('[data-k]', root).forEach(function (b) { b.onclick = function () { press(b.getAttribute('data-k')); }; });
    document.onkeydown = function (e) {
      if (!document.body.contains(root)) return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === 'Enter') press('✓');
    };
    return { reset: function () { v = ''; onChange(v); } };
  }

  /* ---------------- help: picture guide ---------------- */
  function showGuide(skills, prob, allowVideo) {
    // lesson guides are asked for by generator name; turn those into skill names (Lantern Harbor generators have their own names)
    skills = skills.map(function (k) { var g = Q && Q.isl && Q.isl.generators[k]; if (g && !(Help.guideKey(k, prob))) { try { return g(2).skill; } catch (e) {} } return k; });
    var keys = U.uniq(skills.map(function (s) { return Help.guideKey(s, prob); }).filter(Boolean));
    if (!keys.length) return;
    var prevKey = document.onkeydown;
    function body(k) {
      var g = Help.GUIDES[k];
      return '<h2 style="margin-top:0">📘 ' + g.title + '</h2>' +
        (g.scratch ? '<div class="scratchnote">✏️ Get your scratch paper and pencil. Work it out step by step!</div>' : '') +
        '<div class="guide">' + g.steps.map(function (s, i) {
          return '<div class="gstep"><div class="gnum">' + (i + 1) + '</div><div class="gtext">' + s[0] + '</div><div class="gvis">' + s[1]() + '</div></div>';
        }).join('') + '</div>' +
        (allowVideo && g.video ? '<div class="videobox">🎬 Want to see it explained? <button class="btn small blue" data-video="' + g.video.url + '">Watch a video</button><span class="muted"> ' + U.esc(g.video.label) + ' · needs internet, opens in a new tab</span></div>' : '');
    }
    U.modal('<div class="guidemodal">' + (keys.length > 1 ? '<div class="row" style="margin-bottom:8px">' + keys.map(function (k, i) {
      return '<button class="choice' + (i ? '' : ' on') + '" data-gk="' + k + '">' + Help.GUIDES[k].title + '</button>'; }).join('') + '</div>' : '') +
      '<div id="gbody">' + body(keys[0]) + '</div><div class="row" style="justify-content:space-between;margin-top:12px"><button class="btn small plain" data-gsay="1">🔊 Read it to me</button>' +
      (App.isHarbor() && window.Video && Video.forSkills(skills).length ? '<button class="btn small blue" data-gvid="1">🎬 Watch the video</button>' : '') + '<button class="btn" data-x="1">Got it!</button></div></div>',
    function (o, api) {
      var cur = keys[0];
      function bind() {
        U.$$('[data-video]', o).forEach(function (b) { b.onclick = function () { window.open(b.getAttribute('data-video'), '_blank', 'noopener'); }; });
      }
      function say() { Audio2.speak(Help.GUIDES[cur].steps.map(function (s) { return s[0]; }).join(' ')); }
      bind();
      U.$$('[data-gk]', o).forEach(function (b) {
        b.onclick = function () { cur = b.getAttribute('data-gk'); U.$$('[data-gk]', o).forEach(function (x) { x.classList.toggle('on', x === b); }); U.$('#gbody', o).innerHTML = body(cur); bind(); };
      });
      U.$('[data-gsay]', o).onclick = say;
      var gv = U.$('[data-gvid]', o);
      if (gv) gv.onclick = function () { U.$('#gbody', o).innerHTML = '<div id="gvhost"></div>'; gv.remove(); Video.player(U.$('#gvhost', o), Video.forSkills(skills).slice(0, 1), { free: true, doneLabel: 'Got it!', onDone: function () { Audio2.stop(); api.close(); document.onkeydown = prevKey; } }); };
      U.$('[data-x]', o).onclick = function () { Audio2.stop(); api.close(); document.onkeydown = prevKey; };
    });
  }

  /* ---------------- help: interactive step-by-step walkthrough ---------------- */
  function walkthrough(prob, onFinish) {
    var steps = Help.walk(prob), k = 0, wrongs = 0, prevKey = document.onkeydown;
    U.modal('<div class="walk"><div class="row"><h2 style="margin:0" class="grow">👣 Let\'s solve it together</h2><span class="pill" id="wstep"></span></div>' +
      '<div class="wprompt">' + prob.prompt + '</div><div id="wbody"></div></div>', function (o, api) {
      function close(result) { Audio2.stop(); api.close(); document.onkeydown = prevKey; onFinish(result); }
      function show() {
        var s = steps[k]; wrongs = 0; window.__walk = s;
        U.$('#wstep', o).textContent = 'Step ' + (k + 1) + ' of ' + steps.length;
        var html = '<div class="wsay">' + U.esc(s.say) + '</div><div class="visual">' + (s.show || '') + '</div>';
        var a = s.ask;
        if (!a) html += '<div class="center"><button class="btn big" id="wnext">' + (s.back ? 'OK, I\'ll do it!' : 'Next →') + '</button></div>';
        else if (a.type === 'number') html += '<div class="center"><span class="answerbox" id="wab">&nbsp;</span>' + numpadHtml() + '</div>';
        else if (a.type === 'choice') html += '<div class="choices">' + a.options.map(function (c, i) { return '<button class="choicebtn" data-wc="' + i + '">' + c.html + '</button>'; }).join('') + '</div>';
        else if (a.type === 'deal') html += '<div id="deal"></div><div class="center"><button class="btn big green" id="give">Give one to each</button></div>';
        html += '<div class="feedback" id="wfb"></div>';
        U.$('#wbody', o).innerHTML = html;
        Audio2.speak(s.say);
        if (!a) { U.$('#wnext', o).onclick = function () { advance(); }; return; }
        if (a.type === 'number') {
          var val = '', pad = bindNumpad(o, function (v) { val = v; U.$('#wab', o).textContent = v || ' '; }, function () {
            if (val === '') return;
            if (+val === a.answer) good(); else { bad(a.answer >= 1000 ? a.answer.toLocaleString('en-US') : String(a.answer)); pad.reset(); }
          });
        } else if (a.type === 'choice') {
          U.$$('[data-wc]', o).forEach(function (b) {
            b.onclick = function () {
              var c = a.options[+b.getAttribute('data-wc')];
              if (c.value === a.answer) { b.classList.add('right'); good(); }
              else { b.classList.add('wrong'); b.disabled = true; var r = a.options.filter(function (x) { return x.value === a.answer; })[0]; bad(r ? r.html : a.answer); }
            };
          });
        } else if (a.type === 'deal') {
          var dealt = 0, per = 0;
          function drawDeal() { U.$('#deal', o).innerHTML = Models.plates(a.groups, per, 'loaf') + '<p class="center" style="font-size:1.2rem">' + dealt + ' of ' + a.total + ' shared</p>'; }
          drawDeal();
          U.$('#give', o).onclick = function () {
            if (dealt >= a.total) return;
            per++; dealt += a.groups; Audio2.sfx('coin'); drawDeal();
            if (dealt >= a.total) { U.$('#give', o).disabled = true; good(); }
          };
        }
      }
      function good() {
        Audio2.sfx('right');
        var fb = U.$('#wfb', o); fb.className = 'feedback good'; fb.textContent = U.pick(['Yes!', 'Right!', 'Good thinking!', 'You got it!']);
        setTimeout(advance, 700);
      }
      function bad(rightHtml) {
        wrongs++; Audio2.sfx('gentle');
        var fb = U.$('#wfb', o); fb.className = 'feedback gentle';
        if (wrongs >= 2) { fb.innerHTML = 'It\'s ' + rightHtml + '. Now you try it!'; Audio2.speak('It is ' + rightHtml + '. Now you try it.'); }
        else { fb.textContent = 'Not quite. Look again and try once more!'; }
      }
      function advance() {
        var s = steps[k];
        if (s.final) { Audio2.sfx('star'); close('solved'); return; }
        if (s.back) { close('back'); return; }
        k++; if (k >= steps.length) close('back'); else show();
      }
      show();
    });
  }

  /* ---------------- problem generation (no repeats inside one quest) ---------------- */
  function sig(p) { return p.skill + '|' + p.prompt + '|' + JSON.stringify(p.answer) + '|' + (p.data ? JSON.stringify(p.data) : p.visual); }
  function gen(key, level) {
    var p = null;
    for (var t = 0; t < 40; t++) {
      p = Q.isl.generators[key](level);
      if (!Q.seen[sig(p)]) break;
    }
    Q.seen[sig(p)] = 1;
    return p;
  }
  /* Spot Pip's mistake: Pip shows an answer. Usually it is wrong, sometimes right, so the child must really check. */
  function pipify(prob) {
    if (prob.type !== 'choice' && prob.type !== 'number') return prob;
    var right = Math.random() < 0.3, shown;
    if (prob.type === 'choice') {
      var wrong = prob.choices.filter(function (c) { return c.value !== prob.answer; });
      var c = right || !wrong.length ? prob.choices.filter(function (x) { return x.value === prob.answer; })[0] : U.pick(wrong);
      right = c.value === prob.answer; shown = c.html;
    } else {
      var a = prob.answer, opts = [a + 1, a - 1, a + 10, a - 10, a + 2].filter(function (x) { return x >= 0 && x !== a; });
      if (prob.skill === 'add2' && (prob.data.a % 10 + prob.data.b % 10) >= 10) opts.unshift(a - 10); // forgot to carry
      shown = right ? a : opts[0 + (Math.random() < 0.5 ? 0 : 1) % opts.length];
    }
    prob.pip = { right: right, shown: String(shown) };
    return prob;
  }

  /* ---------------- solving one problem (all parts) ----------------
     mode: { practice, help, video, why, header } ; done(ok, err) */
  function solve(board, prob, mode, done) {
    window.__prob = prob; // used by the automated tests
    // "How do you know?" only on about every 3rd or 4th multiple-choice problem
    var whyQ = null;
    if (mode.why && useWhy() && prob.type === 'choice' && !prob.pip) {
      Q.sinceWhy = (Q.sinceWhy || 0) + 1; Q.whyGap = Q.whyGap || U.rand(3, 4);
      if (Q.sinceWhy >= Q.whyGap) { whyQ = Help.why(prob); if (whyQ) { Q.sinceWhy = 0; Q.whyGap = U.rand(3, 4); } }
    }
    var firstTry = true, lastErr = null, readChoices = null;
    function finish(ok, err) { done(ok && firstTry, err || lastErr); }

    var KEYID = prob.key || prob.skill, KEY = App.isHarbor() && window.G1 && G1.KEYS[KEYID];
    function head() {
      return (mode.header || '') + '<div class="prompt"><button class="iconbtn say" id="say" aria-label="Hear it">🔊</button><div>' + String(prob.prompt).replace(/\b(LESS|MORE|NOT|FEWER|EVERY)\b/g, '<b class="emph">$1</b>') + '</div></div>' +
        (KEY ? '<div class="conceptkey"><button class="iconbtn" data-key="1" aria-label="Hear the key">🔊</button><div class="keybody"><b>🔑 Key</b>' + KEY.html(prob) + '</div></div>' : '') +
        '<div class="visual">' + (prob.visual || '') + '</div>';
    }
    function helpRow(extra) {
      return '<div class="qfoot"><div class="row">' +
        (mode.help ? '<button class="btn small plain" id="guide">📘 Show me how</button>' : '') +
        (mode.practice ? '<button class="btn small plain" id="walk">👣 Walk me through it</button>' : '') +
        (mode.practice ? '<button class="btn small plain" id="hint">💡 Hint</button>' : '') +
        '<button class="btn small plain" id="sayc" style="display:none">🔊 Read the choices</button></div>' +
        (Q.p.showAnswers ? '<span class="pill" style="background:#efe7ff">Answer: ' + answerText(prob) + '</span>' : '') +
        '<div id="nextArea">' + (extra || '') + '</div></div>';
    }
    function bindHelp(onWalkSolved) {
      var g = U.$('#guide', board), w = U.$('#walk', board), h = U.$('#hint', board), hintN = 0;
      if (g) g.onclick = function () { showGuide([prob.skill], prob, mode.video && !prob.review); };
      if (w) w.onclick = function () { firstTry = false; walkthrough(prob, onWalkSolved); };
      if (h) h.onclick = function () {
        firstTry = false;
        var t = prob.hints[Math.min(hintN++, prob.hints.length - 1)];
        U.$('#hintArea', board).innerHTML = '<div class="hintbox">💡 ' + t + (prob.hintPic ? '<div class="hintpic">' + prob.hintPic + '</div>' : '') + '</div>'; Audio2.speak(t.replace(/<[^>]+>/g, ''));
      };
      U.$('#say', board).onclick = function () { Audio2.speak(prob.say); };
      var kb = U.$('[data-key]', board); if (kb) kb.onclick = function () { Audio2.speak(KEY.say); };
      var sc = U.$('#sayc', board);
      if (sc && readChoices) { sc.style.display = ''; sc.onclick = readChoices; }
    }
    function wrongFinal(err, note) {
      if (Q.q.kind === 'pretest' || Q.q.kind === 'readiness') { // Lighthouse Check / readiness check: one try, no teaching, keep moving
        var pf = U.$('#fb', board); pf.className = 'feedback'; pf.textContent = 'Got it. Let\'s keep going!';
        setTimeout(function () { done(false, err); }, 900); return;
      }
      // challenge mode: one try, then show the right idea; offer a walkthrough (does not change the score)
      if (err && !Q.p.preview) Store.addError(Q.p, err);
      var fb = U.$('#fb', board); fb.className = 'feedback gentle'; fb.innerHTML = '💛 ' + (note ? U.esc(note) + ' ' : '') + U.esc(prob.explain);
      Audio2.speak(note ? [note, prob.explain] : prob.explain);
      U.$('#nextArea', board).innerHTML = (mode.walkAfter ? '<button class="btn small plain" id="walk2">👣 Show me step by step</button> ' : '') + '<button class="btn" id="nx">Next →</button>';
      var w2 = U.$('#walk2', board);
      if (w2) w2.onclick = function () { walkthrough(prob, function () {}); };
      U.$('#nx', board).onclick = function () { done(false, err); };
    }

    /* Part 1 (optional): Is Pip right? */
    function pipPart() {
      board.innerHTML = head() + '<div class="pipsays">' + Art.parrot(70, '', Q.p.parrot) + '<div><b>' + U.esc(App.parrotName()) + ' says the answer is:</b> <span class="pipans">' + pipTxt(prob.pip.shown) + '</span><br>Is ' + U.esc(App.parrotName()) + ' right?</div></div>' +
        '<div class="choices"><button class="choicebtn" data-pip="yes">✔ Yes, that\'s right</button><button class="choicebtn" data-pip="no">✘ No, it\'s a mistake</button></div>' +
        '<div class="feedback" id="fb"></div><div id="hintArea"></div>' + helpRow();
      Audio2.speak([prob.say + ' Here is what ' + App.parrotName() + ' thinks.', 'The answer is ' + pipTxt(prob.pip.shown) + '. Is that right?']);
      bindHelp(function (r) { if (r === 'solved') { firstTry = false; afterMain(); } });
      U.$$('[data-pip]', board).forEach(function (b) {
        b.onclick = function () {
          var saysRight = b.getAttribute('data-pip') === 'yes', ok = saysRight === prob.pip.right;
          if (ok) {
            b.classList.add('right'); Audio2.sfx('right');
            var fb = U.$('#fb', board); fb.className = 'feedback good';
            fb.textContent = prob.pip.right ? 'Yes! ' + App.parrotName() + ' got it right.' : 'Good eye! Now help ' + App.parrotName() + ' fix it.';
            setTimeout(function () { if (prob.pip.right) afterMain(); else mainPart('Help ' + App.parrotName() + ' fix it! What is the right answer?'); }, 900);
          } else {
            b.classList.add('wrong'); Audio2.sfx('gentle'); lastErr = 'checking-work';
            if (mode.practice) { firstTry = false; b.disabled = true; var fb2 = U.$('#fb', board); fb2.className = 'feedback gentle'; fb2.textContent = 'Check it again carefully. Work the problem yourself first!'; }
            else { U.$$('[data-pip]', board).forEach(function (x) { x.disabled = true; }); wrongFinal('checking-work', prob.pip.right ? App.parrotName() + ' was right this time.' : App.parrotName() + ' made a mistake.'); }
          }
        };
      });
    }

    /* Part 2: the problem itself */
    function mainPart(lead) {
      var html = head() + (lead ? '<div class="leadline">' + lead + '</div>' : '');
      if (prob.type === 'choice') html += '<div class="choices' + (prob.stack ? ' stack' : '') + (prob.ordinalRow ? ' ordrow' : '') + '">' + prob.choices.map(function (c, i) { return '<button class="choicebtn" data-c="' + i + '"' + (prob.big ? ' style="padding:6px 14px"' : '') + '>' + c.html + '</button>'; }).join('') + '</div>';
      else if (prob.type === 'number') html += '<div class="center"><span class="answerbox" id="ab">&nbsp;</span>' + numpadHtml() + '</div>';
      else if (prob.type === 'multi') html += '<div class="choices">' + prob.choices.map(function (c, i) { return '<button class="choicebtn multi" data-m="' + i + '" style="padding:6px">' + c.html + '</button>'; }).join('') + '</div>' +
        '<div class="center"><button class="btn green" id="check">Check</button></div>';
      else if (prob.type === 'lab') html += '<div id="lab"></div>';
      else html += '<div class="center"><button class="btn green" id="check">Check</button></div>';
      html += '<div class="feedback" id="fb"></div><div id="hintArea"></div>' + helpRow();
      board.innerHTML = html;
      var firstKey = KEY && !lead && !(Q.keyRead = Q.keyRead || {})[KEYID];
      if (firstKey) Q.keyRead[KEYID] = 1;
      var spoken = !lead ? Audio2.speak(firstKey ? [prob.say, 'Here is a key to help you.', KEY.say] : prob.say) : Audio2.speak(lead);
      // Lantern Harbor: for children who can't read yet, the narrator also reads each answer, lighting up its button
      // (not for "find the word / find the shape" problems, where hearing the answer would give it away)
      if (App.isHarbor() && prob.type === 'choice' && prob.readOut && !lead) spoken = spoken.then(function readAll() {
        var btns = U.$$('[data-c]', board);
        return prob.choices.reduce(function (acc, c, i) {
          return acc.then(function () {
            if (finished || !document.body.contains(board) || !btns[i]) return;
            btns.forEach(function (x) { x.classList.remove('reading'); }); btns[i].classList.add('reading');
            return Audio2.speak((i === prob.choices.length - 1 && i ? 'Or ' : '') + (c.say || c.value));
          });
        }, Promise.resolve()).then(function () { btns.forEach(function (x) { x.classList.remove('reading'); }); });
      });
      // Answer buttons are visibly "getting ready" (dimmed, with a filling bar) while the question is read, then they light up.
      // A tap is never silently thrown away: the buttons are plainly disabled until ready. Max wait 3 seconds.
      (function () {
        var wait = Store.get().settings.answerWait; wait = wait === undefined ? 2.5 : wait;
        var box = U.$('.choices', board);
        if (!box || !wait || window.__noSlow || prob.type !== 'choice') return;
        box.classList.add('waiting'); box.style.setProperty('--wait', wait + 's');
        U.$$('.choicebtn', box).forEach(function (x) { x.disabled = true; });
        var t0 = Date.now(), ready = false;
        function go() { if (ready) return; ready = true; box.classList.remove('waiting'); box.classList.add('ready'); U.$$('.choicebtn', box).forEach(function (x) { if (!x.classList.contains('wrong')) x.disabled = false; }); }
        setTimeout(go, wait * 1000);
        if (spoken && spoken.then) spoken.then(function () { setTimeout(go, Math.max(0, 500 - 0)); });
      })();
      readChoices = prob.type === 'choice' && (!prob.big || App.isHarbor()) ? function () { Audio2.speak([].concat.apply([], prob.choices.map(function (c, n) { var t = c.say || c.html; return n ? ['Or,', t] : [t]; }))); } : null;
      var finished = false, wrongs = 0, shownAt = Date.now();
      if (prob.tapCount && App.isHarbor()) tapCount(board, prob);
      bindHelp(function (r) { if (r === 'solved') { finished = true; lockAll(); markCorrect(); afterMain(); } });

      function lockAll() { U.$$('.choicebtn', board).forEach(function (b) { b.disabled = true; }); var c = U.$('#check', board); if (c) c.disabled = true; }
      function markCorrect() {
        if (prob.type === 'choice') prob.choices.forEach(function (c, i) { if (c.value === prob.answer) U.$('[data-c="' + i + '"]', board).classList.add('right'); });
        if (prob.type === 'number') { var ab = U.$('#ab', board); ab.textContent = prob.answer; ab.style.borderColor = '#2f9e55'; }
        if (prob.type === 'multi') prob.choices.forEach(function (c, i) { if (c.ok) U.$('[data-m="' + i + '"]', board).classList.add('right'); });
      }
      function result(ok, err, el) {
        if (finished) return;
        var fb = U.$('#fb', board);
        if (ok) {
          finished = true; if (el) el.classList.add('right'); Audio2.sfx('right'); lockAll();
          fb.className = 'feedback good'; fb.textContent = whyQ ? 'Yes! Now tell me how you know.' : U.pick(['Great job!', 'You got it!', 'Wonderful!', 'That\'s right!']);
          setTimeout(afterMain, 800);
          return;
        }
        if (el) el.classList.add('wrong');
        Audio2.sfx('gentle'); lastErr = err;
        if (mode.practice) {
          if (firstTry && err && !Q.p.preview) Store.addError(Q.p, err);
          firstTry = false; wrongs++;
          if (el) el.disabled = true;
          if (wrongs >= 2) {
            fb.className = 'feedback gentle'; fb.textContent = 'Let\'s work through it together, step by step.';
            walkthrough(prob, function (r) { if (r === 'solved') { finished = true; lockAll(); markCorrect(); afterMain(); } });
          } else { fb.className = 'feedback gentle'; fb.textContent = 'Not quite. Try again, or tap 💡 for a hint.'; }
        } else {
          finished = true; lockAll(); markCorrect(); wrongFinal(err);
        }
      }
      function runLab() {
        var cols = prob.data.colors, lab = U.$('#lab', board), pred = null, tally = {}, pulls = 0;
        cols.forEach(function (c) { tally[c[0]] = 0; });
        function tallyHtml() {
          return '<table class="grid tally"><tr><th>Color</th><th>Tally</th><th>Total</th></tr>' + cols.map(function (c) {
            var t = tally[c[0]], marks = ''; for (var i = 0; i < t; i++) marks += (i % 5 === 4 ? '<s>|</s> ' : '|');
            return '<tr><td><span class="dot" style="background:' + c[1] + '"></span> ' + c[0] + '</td><td class="marks">' + marks + '</td><td>' + t + '</td></tr>'; }).join('') + '</table>';
        }
        lab.innerHTML = '<div class="leadline">1. Predict: which color will you pull MORE often?</div><div class="choices">' + cols.map(function (c) { return '<button class="choicebtn" data-pr="' + c[0] + '">' + c[0] + '</button>'; }).join('') + '</div>';
        U.$$('[data-pr]', lab).forEach(function (b) {
          b.onclick = function () {
            pred = b.getAttribute('data-pr'); Audio2.sfx('tap');
            lab.innerHTML = '<div class="leadline">2. Pull a marble 10 times. Mark each one in the tally chart.</div><div class="center"><span id="pulled" class="pulled"></span> <button class="btn big" id="pull">Pull a marble (0 of 10)</button></div><div id="tally">' + tallyHtml() + '</div>';
            Audio2.speak('Now pull a marble ten times. Each one is marked in the tally chart.');
            U.$('#pull', lab).onclick = function () {
              if (pulls >= 10) return;
              var c = Math.random() * (prob.data.na + prob.data.nb) < prob.data.na ? cols[0] : cols[1];
              tally[c[0]]++; pulls++; Audio2.sfx('coin');
              U.$('#pulled', lab).innerHTML = '<span class="dot big" style="background:' + c[1] + '"></span> ' + c[0];
              U.$('#tally', lab).innerHTML = tallyHtml();
              U.$('#pull', lab).textContent = 'Pull a marble (' + pulls + ' of 10)';
              if (pulls === 10) { U.$('#pull', lab).disabled = true; setTimeout(compare, 600); }
            };
          };
        });
        function compare() {
          var a = tally[cols[0][0]], b2 = tally[cols[1][0]], ans = a > b2 ? cols[0][0] : a < b2 ? cols[1][0] : 'a tie';
          var area = document.createElement('div');
          area.innerHTML = '<div class="leadline">3. Look at your tally. Which color did you pull the most?</div><div class="choices">' +
            [cols[0][0], cols[1][0], 'a tie'].map(function (c) { return '<button class="choicebtn" data-cm="' + c + '">' + (c === 'a tie' ? 'It was a tie' : c) + '</button>'; }).join('') + '</div>';
          lab.appendChild(area); Audio2.speak('Look at your tally. Which color did you pull the most?');
          U.$$('[data-cm]', area).forEach(function (bt) {
            bt.onclick = function () {
              var ok = bt.getAttribute('data-cm') === ans;
              if (ok) { prob.explain = 'You predicted ' + pred + ', and ' + (ans === 'a tie' ? 'it was a tie' : ans + ' came up most') + '. ' + (pred === ans ? 'Your prediction matched!' : 'Chance can surprise us!'); U.$('#fb', board).className = 'feedback good'; U.$('#fb', board).textContent = prob.explain; }
              result(ok, 'probability', bt);
            };
          });
        }
      }
      if (prob.type === 'choice') {
        U.$$('[data-c]', board).forEach(function (b) {
          b.onclick = function () {
            var c = prob.choices[+b.getAttribute('data-c')];
            result(c.value === prob.answer, c.err || prob.err || prob.skill, b);
          };
        });
      } else if (prob.type === 'number') {
        var val = '';
        var pad = bindNumpad(board, function (v) { val = v; U.$('#ab', board).textContent = v || ' '; U.$('#ab', board).style.borderColor = ''; }, function () {
          if (val === '' || finished) return;
          var ok = +val === prob.answer;
          result(ok, prob.skill, null);
          if (!ok && mode.practice && !finished) { pad.reset(); U.$('#ab', board).style.borderColor = '#e08a2e'; }
        }, String(prob.answer).length + 1);
      } else if (prob.type === 'shade') {
        var svg = U.$('#shadeTarget', board);
        U.$$('.part', svg).forEach(function (part) {
          part.onclick = function () {
            if (finished) return;
            var on = part.getAttribute('data-on') === '1';
            part.setAttribute('data-on', on ? '0' : '1'); part.setAttribute('fill', on ? '#ffffff' : Models.FILL); Audio2.sfx('tap');
          };
        });
        U.$('#check', board).onclick = function () {
          var n = U.$$('.part[data-on="1"]', svg).length;
          result(n === prob.answer, n === prob.n - prob.answer ? 'counted-unshaded' : 'shade-count', null);
        };
      } else if (prob.type === 'multi') {
        U.$$('[data-m]', board).forEach(function (b) { b.onclick = function () { if (finished) return; b.classList.toggle('sel'); Audio2.sfx('tap'); }; });
        U.$('#check', board).onclick = function () {
          var picked = U.$$('[data-m].sel', board).map(function (b) { return b.getAttribute('data-m'); });
          if (!picked.length) { U.$('#fb', board).className = 'feedback gentle'; U.$('#fb', board).textContent = 'Tap the squares first, then press Check.'; return; }
          var wrong = picked.filter(function (v) { return !prob.choices[+v].ok; })[0];
          var ok = picked.sort().join(',') === prob.answer.split(',').sort().join(',');
          result(ok, wrong !== undefined ? prob.choices[+wrong].err : 'partition-missed', null);
          if (!ok && mode.practice && !finished) U.$$('[data-m].sel', board).forEach(function (b) { if (!prob.choices[+b.getAttribute('data-m')].ok) { b.classList.remove('sel'); b.classList.add('wrong'); } });
        };
      } else if (prob.type === 'lab') {
        runLab();
      } else if (prob.type === 'shadeSet') {
        var target = U.$('#setTarget', board), it = prob.item;
        U.$$('.setitem', target).forEach(function (sp) {
          sp.onclick = function () {
            if (finished) return;
            var on = sp.getAttribute('data-on') === '1';
            sp.setAttribute('data-on', on ? '0' : '1');
            sp.innerHTML = Art.icon(it[0], 54, on ? it[2] : it[1]);
            sp.style.borderColor = on ? 'transparent' : '#ffb347'; Audio2.sfx('tap');
          };
        });
        U.$('#check', board).onclick = function () {
          var n = U.$$('.setitem[data-on="1"]', target).length;
          result(n === prob.answer, 'set-count', null);
        };
      }
    }

    /* Part 3 (choice problems): How do you know? */
    function afterMain() {
      if (!whyQ) { finish(true); return; }
      var order = U.shuffle([0, 1, 2]);
      var html = head() + '<div class="leadline">🤔 ' + whyQ.q + '</div><div class="whylist">' +
        order.map(function (i) { return '<button class="choicebtn whybtn" data-w="' + i + '">' + U.esc(whyQ.options[i]) + '</button>'; }).join('') +
        '</div><div class="feedback" id="fb"></div><div id="hintArea"></div>' + helpRow();
      board.innerHTML = html;
      Audio2.speak(whyQ.q);
      readChoices = function () { Audio2.speak([].concat.apply([], order.map(function (i, n) { return n ? ['Or,', whyQ.options[i]] : [whyQ.options[i]]; }))); };
      bindHelp(function () {});
      U.$$('[data-w]', board).forEach(function (b) {
        b.onclick = function () {
          var ok = +b.getAttribute('data-w') === 0, fb = U.$('#fb', board);
          if (ok) {
            b.classList.add('right'); Audio2.sfx('right'); U.$$('[data-w]', board).forEach(function (x) { x.disabled = true; });
            fb.className = 'feedback good'; var praise = U.pick(['Great thinking!', 'Exactly right!', 'You really know it!']); fb.textContent = praise; bubble(praise);
            setTimeout(function () { finish(true); }, 800);
          } else {
            b.classList.add('wrong'); b.disabled = true; Audio2.sfx('gentle'); lastErr = 'reasoning';
            firstTry = false; U.$$('[data-w]', board).forEach(function (x) { x.disabled = true; }); U.$$('[data-w="0"]', board)[0].classList.add('right');
            wrongFinal('reasoning', 'Good answer, but here is the reason.');
          }
        };
      });
    }

    if (prob.pip) pipPart(); else mainPart();
  }
  /* Lantern Harbor counting: the child taps each object, and the narrator says each number out loud.
     The answer buttons wake up once everything has been counted. */
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  function tapCount(board, prob) {
    var vis = U.$('.visual', board), items = U.$$('.g1item:not(.crossed), .cnt', vis), n = 0, total = items.length;
    if (!total) return;
    var box = U.$('.choices', board);
    if (box) box.classList.add('gated');
    vis.classList.add('tappable');
    vis.insertAdjacentHTML('afterend', '<div class="tapbar"><span>👆 Tap each one to count it!</span><span class="g1num" id="tcn"></span><button class="btn small plain" id="tcr">Start over</button></div>');
    function mark(el, on, k) {
      if (el.tagName === 'SPAN') { el.classList.toggle('counted', on); var b = el.querySelector('.cbadge'); if (b) b.remove(); if (on) el.insertAdjacentHTML('beforeend', '<b class="cbadge">' + k + '</b>'); }
      else { el.classList.toggle('counted', on); }
    }
    items.forEach(function (el) {
      el.addEventListener('click', function () {
        if (el.classList.contains('counted')) { Audio2.sfx('gentle'); U.toast('You already counted that one!'); return; }
        n++; mark(el, true, n); Audio2.sfx('tap');
        U.$('#tcn', board).textContent = n;
        if (n < total) { Audio2.speak(NUMW[n] || String(n)); return; }
        Audio2.speak([NUMW[n] || String(n) + '!', prob.skill === 'sub10' ? 'Now tap how many are left.' : 'You counted them all! Now tap the answer.']);
        if (box) box.classList.remove('gated');
      });
    });
    U.$('#tcr', board).onclick = function () { n = 0; items.forEach(function (el) { mark(el, false); }); U.$('#tcn', board).textContent = ''; if (box) box.classList.add('gated'); Audio2.speak('Let\'s count again. Tap each one.'); };
    setTimeout(function () { if (!n) Audio2.speak('Tap each one to count it!'); }, 2600);
  }
  function answerText(prob) {
    if (prob.type === 'shade' || prob.type === 'shadeSet') return 'color ' + prob.answer;
    if (prob.type === 'choice') {
      var c = prob.choices.filter(function (x) { return x.value === prob.answer; })[0];
      return c ? (c.html.indexOf('<svg') >= 0 ? 'the shape with equal parts' : c.html) : prob.answer;
    }
    return prob.answer;
  }

  /* ---------------- 1. Lantern warm-up (math facts) ---------------- */
  function warmup() {
    if (!Q.isl.factSets) { quickWarm(); return; }
    var facts = Facts.choose(Q.p, Q.isl.factSets, SZ().warm), k = 0, glow = 0;
    function show() {
      if (k >= facts.length) {
        Audio2.sfx('star');
        var b = frame(parrot('happy'), 'Your lantern is glowing!', '<div class="center grow"><h2>Lantern warm-up complete!</h2>' +
          '<div class="lantern-meter" style="max-width:420px"><div style="width:' + Math.round(glow / facts.length * 100) + '%"></div></div>' +
          '<p style="font-size:1.2rem">' + glow + ' of ' + facts.length + ' facts right.</p><button class="btn big" id="go">On to the island!</button></div>');
        U.$('#go', b).onclick = next;
        Audio2.speak('Your lantern is glowing! ' + glow + ' of ' + facts.length + ' right.', { who: 'parrot' });
        return;
      }
      var f = facts[k], t0 = Date.now(), val = '';
      window.__fact = f;
      var b = frame(parrot(), 'Light the lantern! Each right answer adds glow.',
        '<div class="lantern-meter"><div style="width:' + Math.round(glow / facts.length * 100) + '%"></div></div>' +
        '<div class="center grow"><div style="font-size:3.4rem;font-weight:800">' + f.q + ' = <span class="answerbox" id="ab">&nbsp;</span></div>' +
        numpadHtml() + '<div class="feedback" id="fb"></div></div>');
      Audio2.speak(f.say + ' equals?');
      var answered = false;
      bindNumpad(b, function (v) { val = v; U.$('#ab', b).textContent = v || ' '; }, function () {
        if (answered || val === '') return; answered = true;
        var ok = +val === f.ans, fb = U.$('#fb', b);
        Facts.record(Q.p, f, ok, Date.now() - t0);
        if (ok) { glow++; Audio2.sfx('right'); fb.className = 'feedback good'; fb.textContent = 'Yes!'; setTimeout(function () { k++; show(); }, 650); }
        else {
          Audio2.sfx('gentle'); fb.className = 'feedback gentle';
          fb.innerHTML = U.esc(Facts.strategy(f)) + ' So ' + f.q + ' = ' + f.ans + '. <button class="btn small" id="nx">Next</button>';
          Audio2.speak([Facts.strategy(f), 'So ' + f.say + ' equals ' + f.ans + '.']);
          U.$('#nx', b).onclick = function () { k++; show(); };
        }
      }, String(f.ans).length + 1);
    }
    show();
  }

  /* Warm-up for courses without math-fact drills yet (Lantern Harbor before addition facts): a few quick review problems. */
  function quickWarm() {
    var keys = U.shuffle(Q.isl.warmup.slice()).slice(0, SZ().warm), k = 0, glow = 0;
    function show() {
      if (k >= keys.length) {
        Audio2.sfx('star');
        var b0 = frame(parrot('happy'), 'Your lantern is glowing!', '<div class="center grow"><h2>Lantern warm-up complete!</h2>' +
          '<div class="lantern-meter" style="max-width:420px"><div style="width:' + Math.round(glow / keys.length * 100) + '%"></div></div>' +
          '<p style="font-size:1.2rem">' + glow + ' of ' + keys.length + ' right.</p><button class="btn big" id="go">Let\'s go!</button></div>');
        U.$('#go', b0).onclick = next;
        Audio2.speak('Your lantern is glowing! ' + glow + ' of ' + keys.length + ' right.', { who: 'parrot' });
        return;
      }
      var b = frame(parrot(), 'Light the lantern! Each right answer adds glow.', '');
      solve(b, gen(keys[k], 1), { practice: true, help: false, why: false,
        header: '<div class="lantern-meter"><div style="width:' + Math.round(glow / keys.length * 100) + '%"></div></div>' }, function (ok) { if (ok) glow++; k++; show(); });
    }
    show();
  }

  /* ---------------- 0. Watch & learn (Lantern Harbor) ---------------- */
  function questVideos() {
    var q = Q.q, keys, max = 3;
    if (q.video) return q.video;
    if (q.kind === 'pretest') { keys = []; Q.isl.quests.forEach(function (lq) { keys = keys.concat(lq.pre || []); }); max = 2; }
    else if (q.kind === 'readiness') { keys = []; q.covers.forEach(function (id) { keys = keys.concat(questById(id).pre); }); }
    else if (q.kind === 'review' || q.kind === 'boss') { keys = q.mix; max = 2; }
    else keys = (q.practice || []).concat(q.today || []);
    var skills = keys.map(function (k) { try { return Q.isl.generators[k](2).skill; } catch (e) { return null; } }).filter(Boolean);
    return Video.forSkills(skills).slice(0, max);
  }
  function watch() {
    var keys = questVideos();
    if (!keys.length) { next(); return; }
    var b = frame(parrot('happy'), 'Watch and learn first!', '<div id="vhost"></div>');
    Video.player(U.$('#vhost', b), keys, { onDone: next, endSay: Q.q.kind === 'pretest' || Q.q.kind === 'readiness' ? 'Great watching! Now let\'s see what you know.' : 'Great watching! Now let\'s try it together.' });
  }

  /* ---------------- Hands-on activities (Lantern Harbor) ---------------- */
  function play() {
    var list = Q.q.play, k = 0;
    Audio2.holdMusic(true, 'activity'); // quiet while he works with his hands
    function show() {
      if (k >= list.length) { Audio2.holdMusic(false, 'activity'); next(); return; }
      var b = frame(keeper(), 'Let\'s do it together!', '<div class="muted" style="margin-bottom:6px">Activity ' + (k + 1) + ' of ' + list.length + '</div><div id="acthost"></div>');
      Act.run(b.querySelector('#acthost'), list[k], function () { k++; show(); });
    }
    show();
  }

  /* ---------------- 2. Keeper's lesson ---------------- */
  function lesson() {
    var slides = Q.q.slides, k = 0;
    // 1st grade: one idea at a time. Each sentence gets its own page (same picture), and the child taps Next when ready.
    if (App.isHarbor()) slides = [].concat.apply([], slides.map(function (sl) {
      return sl.say.replace(/([.!?])\s+(?=[A-Z])/g, '$1\u0001').split('\u0001').map(function (t) { return { say: t, visual: sl.visual }; });
    }));
    function show() {
      var s = slides[k];
      var b = frame(keeper(), Q.reteach ? 'Let\'s look at it again together.' : (k === 0 ? 'Listen closely, Captain!' : ''),
        '<div class="visual" style="min-height:240px">' + s.visual() + '</div>' +
        '<p style="font-size:1.35rem;text-align:center">' + U.esc(s.say) + '</p>' +
        '<div class="qfoot"><button class="btn plain" id="back"' + (k ? '' : ' disabled') + '>← Back</button><button class="iconbtn" id="say">🔊</button>' +
        '<button class="btn small plain" id="guide">📘 Show me how</button>' +
        '<span class="muted">' + (k + 1) + ' of ' + slides.length + '</span><button class="btn big" id="nx">' + (k < slides.length - 1 ? 'Next →' : 'Let\'s practice!') + '</button></div>');
      Audio2.speak(s.say, { who: KV() });
      U.$('#say', b).onclick = function () { Audio2.speak(s.say, { who: KV() }); };
      U.$('#guide', b).onclick = function () { showGuide(Q.q.today, null, true); };
      U.$('#back', b).onclick = function () { if (k) { k--; show(); } };
      U.$('#nx', b).onclick = function () { Audio2.sfx('tap'); if (k < slides.length - 1) { k++; show(); } else next(); };
    }
    show();
  }

  /* ---------------- 3. Practice (hints, walkthroughs, ends with Spot Pip's mistake) ---------------- */
  function practice() {
    var keys = Q.q.practice.concat([U.pick(Q.q.today.filter(function (t) { return ['shadeTo', 'shadeSet', 'makeSet'].indexOf(t) < 0; }))]), k = 0;
    function show() {
      if (k >= keys.length) { next(); return; }
      var isPip = k === keys.length - 1 && usePip();
      var b = frame(parrot(), isPip ? 'Uh oh, I tried one by myself. Can you check my work?' : 'Let\'s try one together. Tap 📘 or 💡 if you want help!', '');
      var prob = gen(keys[k], k === 0 ? 1 : 2);
      if (isPip) pipify(prob);
      solve(b, prob, { practice: true, help: true, video: true, why: true,
        header: '<div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="muted">Practice ' + (k + 1) + ' of ' + keys.length + (isPip ? ' · 🦜 Spot ' + U.esc(App.parrotName()) + '\'s mistake' : '') + '</span><span class="rulelabel">' + RULES.practice.label + '</span></div>' }, function () { k++; show(); });
    }
    show();
  }

  /* ---------------- 4. Island challenge (also Harbor Review, Lighthouse Challenge, Lighthouse Check) ---------------- */
  function buildSet() {
    var q = Q.q, list = [];
    var z = SZ();
    if (q.kind === 'lesson' || q.kind === 'teach') {
      // 6 from today's lesson (one is "Spot Pip's mistake") + 4 review, mixed together (the harbor course uses a shorter set)
      var nRev = q.review && q.review.length ? z.lessonReview : 0, nNew = z.lessonNew + z.lessonReview - nRev;
      for (var i = 0; i < nNew; i++) list.push({ key: q.today[i % q.today.length] });
      for (var j = 0; j < nRev; j++) list.push({ key: q.review[j % q.review.length], review: true });
      var first = list[0], rest = U.shuffle(list.slice(1));
      list = [first].concat(rest);
      var pipAt = list.map(function (x, i) { return i; }).filter(function (i) { return i > 1 && ['shadeTo', 'shadeSet'].indexOf(list[i].key) < 0; });
      if (pipAt.length && usePip()) list[U.pick(pipAt)].pip = true;
    } else if (q.kind === 'pretest') {
      Q.isl.quests.forEach(function (lq) { (lq.pre || []).forEach(function (key) { list.push({ key: key, from: lq.id }); }); });
    } else if (q.kind === 'readiness') {
      // a readiness check: each covered teaching quest contributes its own short set of items, kept together by skill
      q.covers.forEach(function (id) { var lq = questById(id); lq.pre.forEach(function (key) { list.push({ key: key, from: lq.id }); }); });
    } else {
      var n = q.kind === 'boss' ? z.boss : z.review, mix = U.shuffle(q.mix);
      for (var m = 0; m < n; m++) list.push({ key: mix[m % mix.length] });
      if (q.kind === 'review' && (Q.isl.factSets || []).indexOf('mul') >= 0) { list.splice(4, 0, { key: 'mulFact' }); list.length = n; list[7].pip = ['shadeTo', 'shadeSet'].indexOf(list[7].key) < 0; }
    }
    return list;
  }
  function questById(id) { return Q.isl.quests.filter(function (x) { return x.id === id; })[0]; }
  function challenge() {
    var list = buildSet(), k = 0, right = 0, streakR = 0, streakW = 0, marks = [];
    Q.level = 2; Q.byLesson = {};
    var w = W(), titles = { lesson: w.challenge, teach: w.challenge, review: w.review, boss: w.boss, pretest: w.check, readiness: Q.q.title };
    var check = Q.q.kind === 'pretest' || Q.q.kind === 'readiness';
    function header() {
      var need = Math.ceil(list.length * (Q.q.kind === 'boss' ? 0.9 : 0.85)), rule = check ? RULES.pretest : App.isHarbor() ? RULES.practice : RULES.challenge;
      return '<div class="row" style="justify-content:space-between;margin-bottom:4px"><b>' + titles[Q.q.kind] + '</b><span class="rulelabel">' + rule.label + '</span><div class="progress-pies">' +
        list.map(function (_, i) { return '<span class="' + (marks[i] === 1 ? 'ok' : marks[i] === 0 ? 'miss' : i === k ? 'cur' : '') + '"></span>'; }).join('') + '</div></div>' +
        (!check && !(App.isHarbor() && Q.q.kind !== 'boss') ? '<div class="passmeter"><div style="width:' + Math.min(100, Math.round(right / need * 100)) + '%"></div><span>' + right + ' of ' + need + ' needed to light the lantern</span></div>' : '') +
        (list[k] && list[k].review ? '<div class="reviewbadge">🔄 Quick review!</div>' : '');
    }
    function show() {
      if (k >= list.length) { Q.score = Math.round(right / list.length * 100); Q.total = list.length; Q.right = right; next(); return; }
      var item = list[k], who = Q.q.kind === 'lesson' || Q.q.kind === 'teach' ? keeper() : parrot();
      var prob = gen(item.key, check ? 2 : Q.level);
      if (item.pip) pipify(prob);
      var talk = Q.q.kind === 'boss' ? (App.isHarbor() ? W().boss + '! Your first try is the one that counts. You can do it!' : 'No hints in the ' + W().boss + '. You can do it!') : check ? 'Just do your best. It\'s okay to not know some!' :
        item.pip ? 'Spot ' + App.parrotName() + '\'s mistake!' : item.review ? 'Quick review!' : 'Problem ' + (k + 1) + ' of ' + list.length;
      var b = frame(who, talk, '');
      var helpOK = false; // help is for the lesson and practice; scored work must be independent
      var teachMode = App.isHarbor() && !check; // 1st grade: a teaching tool first. Two tries and help; only first tries count toward the score.
      solve(b, prob, { practice: teachMode, help: teachMode && Q.q.kind !== 'boss', video: false, why: true, walkAfter: !check, header: header() }, function (ok) {
        marks[k] = ok ? 1 : 0;
        if (!Q.p.preview) Store.recordSkill(Q.p, prob.skill, ok);
        Q.miss = Q.miss || {}; Q.seenSkills = Q.seenSkills || {}; Q.seenSkills[prob.skill] = 1;
        if (!ok) Q.miss[prob.skill] = (Q.miss[prob.skill] || 0) + 1;
        if (item.from) { Q.byLesson[item.from] = Q.byLesson[item.from] || { right: 0, total: 0 }; Q.byLesson[item.from].total++; if (ok) Q.byLesson[item.from].right++; }
        if (ok) { right++; streakR++; streakW = 0; } else { streakW++; streakR = 0; }
        if (check) {
          // Checks stop early when a child is struggling: no reason to push through questions on a topic they haven't learned yet.
          Q.checkMiss = (Q.checkMiss || 0) + (ok ? 0 : 1);
          if (!ok && item.from) {
            var r0 = Q.byLesson[item.from], tot = list.filter(function (x) { return x.from === item.from; }).length;
            var allowed = Q.q.kind === 'readiness' ? Math.floor(tot * 0.2 + 1e-9) : 0; // readiness passes at 80%; the pretest needs every item right
            if (r0.total - r0.right > allowed) { // this topic can't pass now: skip its other questions
              var before = list.length; list = list.filter(function (x, i) { return i <= k || x.from !== item.from; });
              if (list.length < before) Q.stoppedEarly = true;
            }
          }
          if (Q.checkMiss >= 4 && k < list.length - 1) { list = list.slice(0, k + 1); Q.stoppedEarly = true; }
        }
        if (!check) {
          if (streakW >= 2) { Q.level = Math.max(1, Q.level - 1); streakW = 0; }
          if (streakR >= 4) { Q.level = Math.min(3, Q.level + 1); streakR = 0; }
        }
        k++; show();
      });
    }
    show();
  }

  /* ---------------- 5. Tell your parrot ---------------- */
  function explain() {
    if (Q.explained) { next(); return; }
    var ex = Q.q.explain, order = U.shuffle([0, 1, 2]);
    var b = frame(parrot(), App.buddyIsEli() ? 'Tell me: why does it work?' : 'Teach me! Why does it work?',
      '<h2>' + U.esc(App.parrotName()) + ' asks: ' + U.esc(ex.q) + '</h2>' +
      '<div style="display:flex;flex-direction:column;gap:12px;margin:10px 0">' + order.map(function (i) {
        return '<button class="choicebtn whybtn" data-o="' + i + '">' + U.esc(ex.options[i]) + '</button>';
      }).join('') + '</div><div class="feedback" id="fb"></div>' +
      '<div class="qfoot"><button class="btn small plain" id="sayo">🔊 Read the choices</button><button class="btn small plain" id="rec">🎤 Say it in your own words (optional)</button><span id="recstat" class="muted"></span><div id="nextArea"></div></div>');
    Audio2.speak(App.isHarbor() ? [App.parrotName() + ' asks: ' + ex.q].concat([].concat.apply([], order.map(function (i, n) { return n ? ['Or,', ex.options[i]] : [ex.options[i]]; }))) : App.parrotName() + ' asks: ' + ex.q, { who: 'parrot' });
    U.$('#sayo', b).onclick = function () { Audio2.speak([].concat.apply([], order.map(function (i, n) { return n ? ['Or,', ex.options[i]] : [ex.options[i]]; })), { who: 'parrot' }); };
    U.$$('[data-o]', b).forEach(function (btn) {
      btn.onclick = function () {
        var fb = U.$('#fb', b);
        if (+btn.getAttribute('data-o') === ex.answer) {
          btn.classList.add('right'); Audio2.sfx('right'); fb.className = 'feedback good'; fb.textContent = thanks();
          U.$$('[data-o]', b).forEach(function (x) { x.disabled = true; });
          U.$('#nextArea', b).innerHTML = '<button class="btn" id="nx">Finish →</button>';
          U.$('#nx', b).onclick = function () { Q.explained = true; next(); };
          Audio2.speak(thanks() + ' Thank you, Captain.', { who: 'parrot' });
        } else {
          btn.classList.add('wrong'); Audio2.sfx('gentle'); U.$$('[data-o]', b).forEach(function (x) { x.disabled = true; });
          U.$('[data-o="' + ex.answer + '"]', b).classList.add('right');
          fb.className = 'feedback gentle'; fb.textContent = 'Good try! Here is the reason: ' + ex.options[ex.answer];
          Audio2.speak(['Good try! Here is the reason.', ex.options[ex.answer]], { who: 'parrot' });
          U.$('#nextArea', b).innerHTML = '<button class="btn" id="nx">Finish →</button>';
          U.$('#nx', b).onclick = function () { Q.explained = true; next(); };
        }
      };
    });
    setupRecorder(b);
  }
  function setupRecorder(b) {
    var btn = U.$('#rec', b), stat = U.$('#recstat', b), rec = null, chunks = [];
    if (!navigator.mediaDevices || !window.MediaRecorder) { btn.style.display = 'none'; return; }
    btn.onclick = function () {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        chunks = []; rec = new MediaRecorder(stream);
        rec.ondataavailable = function (e) { chunks.push(e.data); };
        rec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          Store.saveRecording({ id: 'r' + Date.now(), profileId: Q.p.id, quest: Q.q.id, title: Q.q.title, question: Q.q.explain.q, date: new Date().toISOString(), blob: blob })
            .then(function () { stat.textContent = 'Saved for your parent to hear!'; }).catch(function () { stat.textContent = 'Could not save the recording.'; });
          btn.textContent = '🎤 Record again';
        };
        rec.start(); btn.textContent = '⏹ Stop recording'; stat.textContent = 'Recording… tell ' + App.parrotName() + ' why!';
      }).catch(function () { stat.textContent = 'The microphone is not available. That\'s okay!'; });
    };
  }

  /* ---------------- Memory verse: the keeper says it, the child builds it ---------------- */
  function verse() {
    var v = Q.isl.verse;
    var words = v.text.split(' '), chunks = [];
    for (var i = 0; i < words.length; i += 2) chunks.push(words.slice(i, i + 2).join(' '));
    var order = U.shuffle(chunks.map(function (_, i) { return i; })), placed = 0;
    var b = frame(keeper(), '"' + v.text + '" — ' + v.ref,
      '<div class="versecard"><div class="versefig">' + Art.keeper(Q.isl.keeper.art, 120) + '</div><div class="grow"><div class="muted">' + U.esc(Q.isl.keeper.name) + ' shares our memory verse</div>' +
      '<h2 style="margin:4px 0">' + v.ref + ' (' + v.version + ')</h2><p class="muted" style="margin:0">Listen, then tap the pieces in order.</p></div></div>' +
      '<div class="verse-line" id="line"></div><div class="tiles">' + order.map(function (i) { return '<button class="tile" data-t="' + i + '">' + U.esc(chunks[i]) + '</button>'; }).join('') + '</div>' +
      '<div class="feedback" id="fb"></div><div class="qfoot"><button class="iconbtn" id="say">🔊</button><button class="btn small plain" id="show">Show me the verse</button><div id="nextArea"></div></div>');
    function sayIt() { Audio2.speak('Here is our memory verse. ' + v.text + ' ' + v.ref.replace(':', ', verse '), { who: KV() }); }
    sayIt();
    U.$('#say', b).onclick = sayIt;
    U.$('#show', b).onclick = function () { U.$('#fb', b).className = 'feedback'; U.$('#fb', b).textContent = '"' + v.text + '"'; sayIt(); };
    U.$$('[data-t]', b).forEach(function (t) {
      t.onclick = function () {
        if (+t.getAttribute('data-t') === placed) {
          Audio2.sfx('tap'); t.classList.add('used'); placed++;
          U.$('#line', b).textContent = chunks.slice(0, placed).join(' ');
          if (placed === chunks.length) {
            Audio2.sfx('star');
            if (Q.p.verses.indexOf(Q.isl.id + ':verse') < 0) Q.p.verses.push(Q.isl.id + ':verse');
            Store.save();
            U.$('#fb', b).className = 'feedback good'; U.$('#fb', b).textContent = 'You built the whole verse!';
            U.$('#nextArea', b).innerHTML = '<button class="btn" id="nx">Finish →</button>';
            U.$('#nx', b).onclick = next;
            Audio2.speak('You built the whole verse! ' + v.text, { who: KV() });
          }
        } else { Audio2.sfx('gentle'); t.classList.add('shake'); setTimeout(function () { t.classList.remove('shake'); }, 300); }
      };
    });
  }

  /* ---------------- Lighthouse Check (pretest) ---------------- */
  function preIntro() {
    var ready = Q.q.kind === 'readiness', w = W();
    var lessons = ready ? Q.q.covers.map(questById) : Q.isl.quests.filter(function (q) { return q.pre; });
    var n = lessons.reduce(function (a, q) { return a + q.pre.length; }, 0);
    var title = ready ? Q.q.title : w.check;
    var say = ready ? (Q.q.intro || 'Let\'s see what you already know. Just do your best!') :
      'Before we start, let\'s see what you already know. If you already know a lesson, its lantern lights up and you can skip it. It is okay if some are new to you!';
    var b = frame(parrot('happy'), 'Let\'s see what you already know!',
      '<div class="center grow"><h1>' + (ready ? '🧰 ' : '🧭 ') + U.esc(title) + '</h1><p style="font-size:1.25rem;max-width:620px">' + U.esc(say) + '</p>' +
      '<p class="muted" style="font-size:1.1rem">' + n + ' problems. No hints this time. It\'s okay if some are new to you. That\'s what the lessons are for!</p>' +
      '<button class="btn big green" id="go">Start the check</button></div>');
    Audio2.speak(say, { who: 'parrot' });
    U.$('#go', b).onclick = next;
  }
  function preWrap() {
    var p = Q.p, st = Store.islandState(p, Q.isl.id), known = [], learn = [], ready = Q.q.kind === 'readiness';
    var lessons = ready ? Q.q.covers.map(questById) : Q.isl.quests.filter(function (q) { return q.pre; });
    var need = ready ? 0.8 : 1; // readiness: 80% or more on a skill shows it is ready; the island pretest needs every item right
    if (ready) { st.readiness = st.readiness || {}; }
    lessons.forEach(function (lq) {
      var r = Q.byLesson[lq.id] || { right: 0, total: 1 };
      if (ready && !p.preview) st.readiness[lq.id] = Q.byLesson[lq.id] ? { right: r.right, total: r.total, date: U.today() } : { right: 0, total: 0, skipped: true, date: U.today() };
      if (Q.byLesson[lq.id] && r.right / r.total >= need - 1e-9) {
        known.push(lq);
        var qs = Store.questState(p, Q.isl.id, lq.id);
        if (!qs.done) { qs.done = true; qs.stars = Math.max(qs.stars, 3); qs.best = Math.max(qs.best, 100); qs.pretested = true; qs.last = U.today(); }
      } else learn.push(lq);
    });
    if (ready) {
      var qs0 = Store.questState(p, Q.isl.id, Q.q.id); qs0.done = true; qs0.attempts++; qs0.last = U.today(); qs0.lastScore = Q.score; qs0.best = Math.max(qs0.best, Q.score); qs0.stars = Math.max(qs0.stars, Q.score >= 80 ? 3 : 2);
      if (!p.preview) Store.countQuest(p);
    } else { st.pretestDone = true; st.pretestScore = Q.score; }
    p.log.push({ date: U.today(), island: Q.isl.id, quest: Q.q.id, title: (ready ? Q.q.title + ' (readiness check)' : W().check + ' (pretest)'), score: Q.score, stars: 0, pass: true });
    Store.save();
    var early = Q.stoppedEarly ? ' We stopped the check early. The lessons will teach the rest!' : '';
    var pmsg = (ready ? (learn.length === 0 ? 'Wow! You are ready for all of these!' : known.length ? 'Good work! You know some of these already. Let\'s practice the rest together.' : 'Good work! Let\'s learn these together, one at a time.') :
      Q.score >= 80 ? 'Wow, you know a lot! We\'ll skip what you already know.' : Q.score >= 40 ? 'You know some of this already. Let\'s learn the rest!' : 'Great start! This island will teach you lots of new things.') + early;
    var b = frame(parrot('happy'), pmsg,
      '<div class="grow"><h1 class="center">' + U.esc(ready ? Q.q.title : W().check) + ' complete!</h1>' +
      (known.length ? '<h3>' + (ready ? '⭐ You are ready for these:' : '🏮 You already know these, so their lanterns are lit:') + '</h3><ul class="known">' + known.map(function (q) { return '<li>✓ ' + U.esc(q.title) + '</li>'; }).join('') + '</ul>' : '') +
      (learn.length ? '<h3>⛵ We\'ll learn these together:</h3><ul class="learn">' + learn.map(function (q) { return '<li>' + U.esc(q.title) + '</li>'; }).join('') + '</ul>' : (ready ? '' : '<p>You know every lesson! Try the Harbor Review next.</p>')) +
      '<div class="center"><button class="btn big green" id="isl">' + W().back + '</button></div></div>');
    Audio2.sfx('star');
    if (ready && !learn.length) { Audio2.sfx('hooray'); confetti(); }
    Audio2.speak(pmsg, { who: 'parrot' });
    U.$('#isl', b).onclick = function () { App.go('island', { id: Q.isl.id, from: 'quest' }); };
  }

  /* ---------------- Quest complete: celebration, what was mastered, back to the island ---------------- */
  function wrap() {
    var p = Q.p, qs = Store.questState(p, Q.isl.id, Q.q.id), st = Store.islandState(p, Q.isl.id);
    var score = Q.score || 0, stars = score >= 90 ? 3 : score >= 85 ? 2 : 1, pass = score >= 85;
    var weak = Object.keys(Q.miss || {}).filter(function (k) { return Q.miss[k] >= 2; });
    if (Q.q.kind === 'boss') { pass = score >= 90 && !weak.length; stars = pass ? (score === 100 ? 3 : 2) : 1; }
    if (App.isHarbor()) { // a teaching course: lessons and reviews always finish; the short check only sets the stars and what to practice again
      if (Q.q.kind === 'boss') { pass = score >= (App.course().passBoss || 70); stars = score >= 90 ? 3 : score >= 80 ? 2 : 1; }
      else { pass = true; stars = score >= 90 ? 3 : score >= 60 ? 2 : 1; }
    }
    var prevBest = qs.stars, shells = 0, tokenMsg = '', early = Q.early;
    if (!(early && !pass)) { if (qs.first === undefined) qs.first = score; qs.attempts++; qs.last = U.today(); qs.lastScore = score; qs.best = Math.max(qs.best, score); }
    if (pass) {
      shells = Math.max(0, stars - prevBest) * 10 + 5;
      qs.stars = Math.max(qs.stars, stars);
      var firstPass = !qs.done; qs.done = true; qs.flagged = false;
      p.shells += shells;
      if (firstPass && !p.preview) {
        p.passedSinceToken = (p.passedSinceToken || 0) + 1;
        if (p.passedSinceToken >= 3) { p.arcadeTokens++; p.passedSinceToken = 0; tokenMsg = 'You earned an Arcade Cove token!'; }
      }
      if (Q.q.kind === 'review') { p.arcadeTokens++; tokenMsg = 'You earned an Arcade Cove token!'; }
      if (p.preview && Q.q.kind === 'review') p.arcadeTokens = Math.max(p.arcadeTokens, 1);
      if (early) Q.isl.quests.forEach(function (oq) {
        var os = Store.questState(p, Q.isl.id, oq.id);
        if (!os.done) { os.done = true; os.stars = Math.max(os.stars, stars); os.testedOut = true; os.last = U.today(); }
      });
    } else if (!early) {
      qs.fails++; if (qs.fails >= 2) qs.flagged = true;
      qs.stars = Math.max(qs.stars, 1);
    }
    if (early) st.earlyTried = U.today();
    if (!p.preview && pass) Store.countQuest(p);
    p.log.push({ date: U.today(), island: Q.isl.id, quest: Q.q.id, title: Q.q.title + (early ? ' (test out early)' : ''), score: score, stars: stars, pass: pass });
    if (p.log.length > 600) p.log = p.log.slice(-600);
    var bossWin = pass && (Q.q.kind === 'boss' || Q.q.finale);
    if (bossWin) st.lit = true;
    var extra = Q.isl.onWrap ? Q.isl.onWrap(p, Q.q, pass, bossWin) || {} : {};
    Store.save();
    var w = W(), isLesson = Q.q.kind === 'lesson' || Q.q.kind === 'teach';

    var today = Store.todayStats(p), goal = Store.setting(p, 'sessionGoal') || 3;
    var goalLine = '<div class="todaybar">' + Store.goalDots(today.quests, goal) + '<span>' + (today.quests >= goal ? 'Today\'s goal reached!' : 'Today: ' + today.quests + ' of ' + goal + ' quests') + ' · ' + today.minutes + ' min</span></div>';
    var SN = Q.isl.skillNames || {};
    var skillChips = Object.keys(Q.seenSkills || {}).filter(function (k) { return SN[k]; }).map(function (k) {
      var st = Store.skillState(p, k);
      return '<span class="skillchip ' + st + '">' + (st === 'mastered' ? '★ ' : st === 'growing' ? '◐ ' : '○ ') + U.esc(SN[k]) + ' · ' + (st === 'mastered' ? 'mastered' : st === 'growing' ? 'getting stronger' : 'keep practicing') + '</span>';
    }).join('');
    var mastered = (Q.q.mastered || []).map(function (m) { return '<li>• ' + U.esc(m) + '</li>'; }).join('');
    var html, msg;
    if (pass) {
      msg = bossWin ? 'Hooray! ' + w.bossWin : 'Hooray! ' + (isLesson ? 'Lesson complete!' : 'Quest complete!');
      html = '<div class="celebrate"><div class="hooray">Hooray!!!</div><h1>' + (bossWin ? w.bossWin : isLesson ? 'Lesson complete!' : 'Quest complete!') + '</h1>' +
        '<div style="font-size:3.4rem">' + U.stars(stars) + '</div><p style="font-size:1.25rem;margin:4px">' + Q.right + ' of ' + Q.total + ' right (' + score + '%)</p>' +
        '<div class="row" style="justify-content:center">' + (shells ? '<div class="pill pop" style="font-size:1.2rem">' + Art.icon('shellcoin', 30) + ' +' + shells + ' shells</div>' : '') +
        (tokenMsg ? '<div class="pill pop" style="font-size:1.1rem;color:#5b6fe0">🕹 ' + tokenMsg + '</div>' : '') + '</div>' +
        (mastered ? '<div class="mastered"><h3>Today you practiced</h3><ul>' + mastered + '</ul>' + (skillChips ? '<div class="skillchips">' + skillChips + '</div><p class="muted" style="margin:6px 0 0;font-size:.9rem">A skill is mastered after right answers on two different days.</p>' : '') + '</div>' : '') +
        (App.isHarbor() && weak.length ? '<p style="font-size:1.1rem">🔁 We\'ll practice again: ' + weak.map(function (k) { return U.esc(SN[k] || k); }).join(', ') + '</p>' : '') +
        (Q.q.worldview ? '<p class="worldview">✝ ' + U.esc(Q.q.worldview) + '</p>' : '') + (extra.html || '') + goalLine +
        '<div class="row" style="justify-content:center;margin-top:10px">' + (bossWin ? '<button class="btn big green" id="rest">' + w.bossBtn + '</button>' : '<button class="btn big green" id="isl">' + w.back + '</button>') + '</div></div>';
    } else {
      msg = early ? 'Good try! Keep going with the lessons. You\'ll be ready soon.' :
        qs.flagged ? 'Good effort! This one is tricky. Ask your parent to sit with you for the next try.' : 'Good effort! Let\'s look at the lesson again, then try fresh problems.';
      html = '<div class="celebrate"><h1>' + (early ? 'Not yet. That\'s okay!' : 'Almost there!') + '</h1><p style="font-size:1.25rem">' + Q.right + ' of ' + Q.total + ' right (' + score + '%)</p>' +
        '<p style="font-size:1.15rem;max-width:560px;margin:auto">' + U.esc(msg) + (!early ? (Q.q.kind === 'boss' ? ' ' + w.bossNeed : ' You need 85% to light this lantern.') : '') + '</p>' +
        (weak.length ? '<p style="font-size:1.1rem"><b>Let\'s review:</b> ' + weak.map(function (k) { return U.esc((Q.isl.skillNames || {})[k] || k); }).join(', ') + '</p>' : '') + goalLine +
        '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn plain" id="isl">' + w.back + '</button>' +
        (!early && isLesson ? '<button class="btn big" id="retry">Review & try again</button>' : !early ? '<button class="btn big" id="retry">Try again</button>' : '') + '</div></div>';
    }
    var b = frame(parrot(pass ? 'happy' : ''), msg, html);
    if (pass) { Audio2.sfx('hooray'); confetti(); }
    else Audio2.sfx('gentle');
    setTimeout(function () {
      Audio2.speak(msg + ' ' + Q.right + ' of ' + Q.total + ' right.' + (tokenMsg ? ' ' + tokenMsg : '') +
        (pass && Q.q.mastered ? ' Today you learned to ' + Q.q.mastered[0].charAt(0).toLowerCase() + Q.q.mastered[0].slice(1) + '.' : '') +
        (pass && Q.q.worldview ? ' ' + Q.q.worldview : '') + (extra.say ? ' ' + extra.say : ''), { who: 'parrot' });
    }, pass ? 1600 : 200);
    var x;
    if ((x = U.$('#isl', b))) x.onclick = function () { App.go('island', { id: Q.isl.id, from: 'quest' }); };
    if ((x = U.$('#rest', b))) x.onclick = function () { App.go('restore', { id: Q.isl.id }); };
    if ((x = U.$('#retry', b))) x.onclick = function () {
      Q.seen = {};
      if (isLesson) { Q.reteach = true; Q.i = Q.steps.indexOf('lesson'); }
      else Q.i = Q.steps.indexOf('challenge');
      run();
    };
  }

  /* confetti burst drawn on a canvas over the page */
  function confetti() {
    var cv = document.createElement('canvas'); cv.className = 'confetti';
    cv.width = window.innerWidth; cv.height = window.innerHeight; document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), cols = ['#ff5a5f', '#ffc23c', '#3fae5a', '#3b8fd9', '#b48ef0', '#ff8ad8'], bits = [];
    for (var i = 0; i < 170; i++) bits.push({ x: cv.width / 2 + (Math.random() - .5) * 200, y: cv.height * .35, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4,
      r: Math.random() * 6 + 4, c: U.pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .3 });
    var t0 = performance.now();
    (function tick(t) {
      var el = (t - t0) / 1000;
      ctx.clearRect(0, 0, cv.width, cv.height);
      bits.forEach(function (b) {
        b.vy += .45; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.a += b.va;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.globalAlpha = Math.max(0, 1 - el / 4.5);
        ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r); ctx.restore();
      });
      if (el < 4.5 && document.body.contains(cv)) requestAnimationFrame(tick); else cv.remove();
    })(t0);
  }

  return { solve: solve, showGuide: showGuide, walkthrough: walkthrough, confetti: confetti };
})();
