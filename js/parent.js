/* Parent area (PIN-protected): dashboard, Parent Preview, settings, backups and profiles. */
var Parent = (function () {
  var ERR = {
    'unequal-parts': 'Accepted unequal parts as a fraction (parts must be the same size)',
    'counted-unshaded': 'Counted the unshaded parts instead of the shaded parts',
    'swapped': 'Swapped the top and bottom numbers of a fraction',
    'part-to-part': 'Compared shaded parts to unshaded parts instead of to the whole',
    'miscount': 'Miscounted the parts',
    'count-parts': 'Miscounted the number of equal parts',
    'fraction-names': 'Mixed up fraction names (halves, thirds, fourths…)',
    'whole': 'Did not see n/n as one whole',
    'compare-like': 'Compared fractions with the same denominator incorrectly',
    'bigger-denominator': 'Thought a bigger bottom number means a bigger piece',
    'probability': 'Mixed up more likely / less likely / impossible',
    'shade-count': 'Colored the wrong number of parts',
    'set-count': 'Colored the wrong number of items in a set',
    'share': 'Mixed up the fraction for a fair share',
    'graph-read': 'Misread the circle graph',
    'clock-quarter': 'Mixed up quarter, half and three-quarter hours',
    'clock-hands': 'Mixed up the hour and minute hands',
    'fact': 'Missed a math fact in the warm-up',
    fairShare: 'Fair-share division', hourFraction: 'Fractions of an hour or a foot', mulFact: 'Multiplication fact (review)',
    add2: '2-digit addition (review)', sub2: '2-digit subtraction (review)', clockTime: 'Telling time (review)'
  };

  function requirePin(cb) {
    var d = Store.get();
    if (!d.pin) {
      U.modal('<h2>Create a parent PIN</h2><p>This 4-digit PIN protects the parent area, Parent Preview and settings.</p>' +
        '<input class="textin" id="p1" inputmode="numeric" maxlength="4" type="password" placeholder="New PIN"><br><br>' +
        '<input class="textin" id="p2" inputmode="numeric" maxlength="4" type="password" placeholder="Type it again">' +
        '<p id="pe" style="color:#b4621a;font-weight:700"></p><div class="row" style="justify-content:flex-end"><button class="btn plain" data-x="c">Cancel</button><button class="btn green" data-x="ok">Save PIN</button></div>',
        function (o, api) {
          o.querySelector('[data-x=c]').onclick = api.close;
          o.querySelector('[data-x=ok]').onclick = function () {
            var a = o.querySelector('#p1').value, b = o.querySelector('#p2').value;
            if (!/^\d{4}$/.test(a)) { o.querySelector('#pe').textContent = 'Use exactly 4 digits.'; return; }
            if (a !== b) { o.querySelector('#pe').textContent = 'The two PINs do not match.'; return; }
            d.pin = a; Store.save(); api.close(); cb();
          };
          o.querySelector('#p1').focus();
        });
      return;
    }
    U.modal('<h2>🔒 Parent PIN</h2><input class="textin" id="pp" inputmode="numeric" maxlength="4" type="password" placeholder="PIN">' +
      '<p id="pe" style="color:#b4621a;font-weight:700"></p><div class="row" style="justify-content:flex-end"><button class="btn plain" data-x="c">Cancel</button><button class="btn" data-x="ok">Enter</button></div>',
      function (o, api) {
        var inp = o.querySelector('#pp');
        function tryIt() { if (inp.value === d.pin) { api.close(); cb(); } else { o.querySelector('#pe').textContent = 'That PIN is not right.'; inp.value = ''; } }
        o.querySelector('[data-x=c]').onclick = api.close;
        o.querySelector('[data-x=ok]').onclick = tryIt;
        inp.onkeydown = function (e) { if (e.key === 'Enter') tryIt(); };
        inp.focus();
      });
  }

  var tab = 'kids', kidId = null;
  App.register('parent', function (root) {
    var d = Store.get(), kids = Store.children(true);
    if (!kidId || !kids.some(function (k) { return k.id === kidId; })) kidId = (kids.filter(function (k) { return !k.archived; })[0] || kids[0] || {}).id;
    var tabs = [['kids', 'Children'], ['hours', 'Hours & records'], ['preview', 'Parent Preview'], ['settings', 'Settings'], ['backup', 'Profiles & backup']];
    var lb = d.lastBackup, stale = !lb || (Date.now() - new Date(lb + 'T12:00:00').getTime()) / 864e5 > 30;
    root.innerHTML = '<div class="screen paper"><div class="topbar noprint"><button class="iconbtn" id="home">⌂</button><h1 class="grow">Parent area</h1></div>' +
      '<div class="paperbox" style="max-width:1100px">' +
      (stale && kids.length ? '<div class="hintbox noprint" style="margin-bottom:12px">💾 <b>Backup reminder:</b> ' + (lb ? 'your last backup was ' + lb + '.' : 'you have not made a backup yet.') + ' Go to <b>Profiles & backup</b> and tap <b>Export full backup</b>. It takes 5 seconds.</div>' : '') +
      '<div class="tabs noprint">' + tabs.map(function (t) { return '<button data-tab="' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="tabbody"></div></div></div>';
    U.$('#home', root).onclick = function () { App.go('title'); };
    U.$$('[data-tab]', root).forEach(function (b) { b.onclick = function () { tab = b.getAttribute('data-tab'); App.go('parent'); }; });
    var body = U.$('#tabbody', root);
    ({ kids: kidsTab, hours: hoursTab, preview: previewTab, settings: settingsTab, backup: backupTab })[tab](body, d, kids);
  });

  function kidsTab(body, d, kids) {
    var active = kids.filter(function (k) { return !k.archived; });
    if (!active.length) { body.innerHTML = '<p style="font-size:1.1rem">No children yet. Go back to the title screen and tap <b>New Captain</b>.</p>'; return; }
    var p = active.filter(function (k) { return k.id === kidId; })[0] || active[0]; kidId = p.id;
    var html = '<div class="row noprint" style="margin-bottom:12px">' + active.map(function (k) { return '<button class="choice' + (k.id === p.id ? ' on' : '') + '" data-kid="' + k.id + '">' + U.esc(k.name) + '</button>'; }).join('') +
      '<span class="grow"></span><button class="btn small plain" id="print">🖨 Print summary</button></div>';
    var hb = p.course === 'harbor', crs = CONTENT.courses[p.course || 'voyage'];
    html += '<div class="row" style="align-items:flex-start">' + (hb ? Art.sailor(p.captain, 90, Harbor.rank(p)) : Art.captain(p.captain, 90)) + '<div class="grow"><h2>' + U.esc(p.name) + '</h2>' +
      '<div class="muted">Course: <b>' + U.esc(crs.name) + '</b> (' + U.esc(crs.grade) + ') <button class="btn small plain noprint" id="course">Change course</button><br>Profile started ' + p.created + ' · ' + p.shells + ' shells · ' +
      (hb ? 'rank: ' + U.esc(Harbor.rankName(p)) + ' · boat parts: ' + CONTENT.courses.harbor.finished(p) + ' · egg: ' + (p.egg.hatched ? 'hatched' : p.egg.found ? 'found' : 'not yet') : p.arcadeTokens + ' arcade tokens · parrot: ' + U.esc(p.parrotName)) + '</div>';
    var today = p.log.filter(function (l) { return l.date === U.today(); });
    html += '<p><b>Today:</b> ' + (today.length ? today.map(function (l) { return U.esc(l.title) + ' ' + l.score + '%' + (l.pass ? ' ✓' : ''); }).join(' · ') : 'no quests yet') + '</p></div></div>';

    var flagged = [];
    if (hb) html += readinessReport(p);
    Object.keys(CONTENT.islands).filter(function (id) { return (CONTENT.islands[id].course || 'voyage') === (p.course || 'voyage'); }).forEach(function (id) {
      var isl = CONTENT.islands[id];
      html += '<h3>' + isl.name + ' <span class="muted" style="font-size:.85rem">' + isl.bju + '</span>' + (Store.islandState(p, id).lit ? ' 🏮 lit' : '') + '</h3>';
      html += '<p class="muted" style="margin:2px 0 6px">Stars: ★★★ = 90%+ · ★★ = 85–89% (passed) · "not yet" = tried but under 85%. Lighthouse Challenge needs 90%. Mastery of skills is tracked separately below.</p>';
      html += '<table class="grid"><tr><th>#</th><th>Quest</th><th>BJU lesson</th><th>Stars</th><th>Best</th><th>Last</th><th>Tries</th><th class="noprint">Actions</th></tr>';
      isl.quests.forEach(function (q) {
        var qs = Store.questState(p, id, q.id);
        if (qs.flagged) flagged.push(q.title);
        var tag = qs.pretested ? ' <span class="pill tiny">' + (hb ? 'ready on the check' : 'knew it (pretest)') + '</span>' : qs.testedOut ? ' <span class="pill tiny">tested out</span>' : qs.skipped ? ' <span class="pill tiny">skipped</span>' : '';
        html += '<tr' + (qs.flagged ? ' style="background:#fff1e0"' : '') + '><td>' + q.num + '</td><td>' + U.esc(q.title) + tag + (qs.flagged ? ' ⚑ <b>check in</b>' : '') + '</td><td>' + (q.lesson || (q.kind === 'readiness' ? 'K5 check' : q.kind === 'teach' ? 'K5 review' : '—')) + '</td><td>' +
          (qs.done ? U.stars(qs.stars) : qs.attempts ? 'not yet' : '—') + '</td><td>' + (qs.attempts ? qs.best + '%' : '—') + '</td><td>' + (qs.last || '—') + '</td><td>' + qs.attempts + '</td>' +
          '<td class="noprint"><button class="btn small plain" data-reset="' + id + '|' + q.id + '">Repeat</button> <button class="btn small plain" data-skip="' + id + '|' + q.id + '">Skip</button>' +
          ' <button class="btn small plain" data-paper="' + id + '|' + q.id + '" title="Printable practice page with answer key">🖨 Paper</button></td></tr>';
      });
      html += '</table>';
      var st = Store.islandState(p, id);
      if (!isl.noPretest) html += '<p class="muted">' + (hb ? 'Harbor Check' : 'Lighthouse Check') + ' (pretest): ' + (st.pretestDone ? 'done, score ' + st.pretestScore + '%' : 'not taken yet') +
        ' <button class="btn small plain noprint" data-repre="' + id + '">Let them retake it</button></p>';
      if (isl.missions) html += '<p><b>Hands-on missions:</b> ' + isl.missions.map(function (m) { var dn = p.missions[m.id] && p.missions[m.id].done; return (dn ? '✓ ' : '○ ') + U.esc(m.title) + (dn ? ' (' + dn + ')' : ''); }).join(' · ') + '</p>';
    });
    if (flagged.length) html = '<div class="hintbox" style="margin-bottom:12px">⚑ <b>Needs a 5-minute check-in:</b> ' + flagged.map(U.esc).join(', ') + '. Sit with them for the lesson, or work two problems together with the matching BJU manipulative.</div>' + html;

    var errs = Object.keys(p.errors).sort(function (a, b) { return p.errors[b] - p.errors[a]; });
    html += '<h3>Mistake patterns</h3>' + (errs.length ? '<table class="grid"><tr><th>What happened</th><th>Times</th></tr>' + errs.slice(0, 10).map(function (e) {
      return '<tr><td>' + U.esc(ERR[e] || e) + '</td><td>' + p.errors[e] + '</td></tr>';
    }).join('') + '</table>' : '<p class="muted">No mistakes recorded yet.</p>');

    var SN = {}; Object.keys(CONTENT.islands).forEach(function (id) { var m = CONTENT.islands[id].skillNames || {}; Object.keys(m).forEach(function (k) { SN[k] = m[k]; }); });
    var sk = Object.keys(p.skills || {});
    html += '<h3>Skill mastery</h3><p class="muted">Separate from finishing quests. A skill is <b>mastered</b> after 4+ right answers on at least 2 different days, with 4 of the last 5 right. Only independent answers count (challenges, reviews, checks), not practice with help.</p>' +
      (sk.length ? '<table class="grid"><tr><th>Skill</th><th>Status</th><th>Right</th><th>Days</th><th>Last 5</th></tr>' + sk.map(function (k) {
        var s2 = p.skills[k], st = Store.skillState(p, k);
        return '<tr><td>' + U.esc(SN[k] || k) + '</td><td>' + (st === 'mastered' ? '★ Mastered' : st === 'growing' ? '◐ Getting stronger' : '○ Practicing') + '</td><td>' + s2.right + ' of ' + s2.n + '</td><td>' + Object.keys(s2.days).length + '</td><td>' + s2.recent.map(function (r) { return r ? '✓' : '✗'; }).join(' ') + '</td></tr>';
      }).join('') + '</table>' : '<p class="muted">No skill data yet.</p>');
    var fs = Facts.summary(p);
    html += '<h3>Math facts (Lantern warm-up)</h3><p>' + fs.seen + ' facts practiced. Mastered: <b>' + fs.boxes[5] + '</b> · Strong: ' + (fs.boxes[3] + fs.boxes[4]) + ' · Learning: ' + fs.boxes[2] + ' · Needs work: ' + fs.boxes[1] + '</p>' +
      (fs.weak.length ? '<p><b>Needs work:</b> ' + fs.weak.map(function (k) { return k.replace('x', ' × ').replace('+', ' + ').replace('-', ' − '); }).join(', ') + '</p>' : '');

    html += '<h3>✏️ Handwriting practice</h3><p class="muted">Every number your child traces or writes is saved here (on this device), newest first, so you can watch the handwriting grow.</p><div id="writing" class="muted">Loading…</div>';
    html += '<h3>"Tell your parrot" recordings</h3><div id="recs" class="muted">Loading…</div>';
    html += '<h3>Recent quests</h3><table class="grid"><tr><th>Date</th><th>Quest</th><th>Score</th><th>Passed</th></tr>' +
      p.log.slice(-15).reverse().map(function (l) { return '<tr><td>' + l.date + '</td><td>' + U.esc(l.title) + '</td><td>' + l.score + '%</td><td>' + (l.pass ? '✓' : '—') + '</td></tr>'; }).join('') + '</table>';
    body.innerHTML = html;

    U.$$('[data-kid]', body).forEach(function (b) { b.onclick = function () { kidId = b.getAttribute('data-kid'); App.go('parent'); }; });
    U.$('#print', body).onclick = function () { window.print(); };
    U.$('#course', body).onclick = function () {
      U.modal('<div><h2 style="margin-top:0">Course for ' + U.esc(p.name) + '</h2><p>Progress in each course is kept separately, so switching back later loses nothing.</p><div class="row">' +
        Object.keys(CONTENT.courses).map(function (k) { var c = CONTENT.courses[k]; return '<button class="btn' + ((p.course || 'voyage') === k ? ' green' : ' plain') + '" data-c="' + k + '">' + U.esc(c.name) + '<br><small>' + U.esc(c.grade) + '</small></button>'; }).join('') +
        '</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn plain" data-x="1">Cancel</button></div></div>', function (o, api) {
          o.querySelector('[data-x]').onclick = api.close;
          U.$$('[data-c]', o).forEach(function (b) { b.onclick = function () { p.course = b.getAttribute('data-c'); p.mapHintSeen = false; if (p.course === 'harbor' && !p.harborIntro) { p.introSeen = false; p.harborIntro = true; } Store.save(); api.close(); App.go('parent'); }; });
        });
    };
    U.$$('[data-reset]', body).forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-reset').split('|');
        U.confirmBox('Clear this quest so it can be played again? Later quests stay unlocked.', 'Repeat quest', function () {
          var isl = Store.islandState(p, a[0]); delete isl.quests[a[1]];
          var q = CONTENT.islands[a[0]].quests.filter(function (x) { return x.id === a[1]; })[0];
          if (q.kind === 'boss' || q.finale) isl.lit = false;
          Store.save(); App.go('parent');
        });
      };
    });
    U.$$('[data-skip]', body).forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-skip').split('|');
        U.confirmBox('Mark this quest as complete so the next one unlocks?', 'Skip quest', function () {
          var qs = Store.questState(p, a[0], a[1]); qs.done = true; qs.flagged = false; qs.skipped = true;
          var q = CONTENT.islands[a[0]].quests.filter(function (x) { return x.id === a[1]; })[0];
          if (q.kind === 'boss' || q.finale) Store.islandState(p, a[0]).lit = true;
          Store.save(); App.go('parent');
        });
      };
    });
    U.$$('[data-paper]', body).forEach(function (b) { b.onclick = function () { var a = b.getAttribute('data-paper').split('|'); printPractice(a[0], a[1], p); }; });
    U.$$('[data-repre]', body).forEach(function (b) { b.onclick = function () { var st = Store.islandState(p, b.getAttribute('data-repre')); st.pretestDone = false; Store.save(); U.toast('The Lighthouse Check is ready to take again.'); }; });
    Store.listRecordings(p.id).then(function (all) {
      var wl = all.filter(function (r) { return r.type === 'writing'; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      var we = U.$('#writing', body);
      if (we) {
        if (!wl.length) we.textContent = 'No handwriting yet.';
        else {
          we.className = '';
          var days = {}; wl.forEach(function (w) { var d = w.date.slice(0, 10); (days[d] = days[d] || []).push(w); });
          we.innerHTML = Object.keys(days).map(function (d) {
            return '<div class="wday"><b>' + d + '</b> · ' + days[d].length + ' number' + (days[d].length > 1 ? 's' : '') + '<div class="wgrid">' + days[d].map(function (w) {
              return '<figure class="wcard"><div class="wimg">' + w.svg + '</div><figcaption>' + w.number + ' · ' + (w.mode === 'write' ? 'wrote' : 'traced') + ' · ' + w.date.slice(11, 16) + '</figcaption></figure>'; }).join('') + '</div></div>';
          }).join('');
        }
      }
      return all.filter(function (r) { return r.type !== 'writing'; });
    }).then(function (list) {
      var el = U.$('#recs', body); if (!el) return;
      if (!list.length) { el.textContent = 'No recordings yet.'; return; }
      el.className = '';
      el.innerHTML = list.sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 20).map(function (r) {
        return '<div class="card" style="margin:8px 0;padding:10px"><b>' + U.esc(r.title) + '</b> — ' + U.esc(r.question) + ' <span class="muted">(' + r.date.slice(0, 10) + ')</span><br>' +
          '<audio controls src="' + URL.createObjectURL(r.blob) + '"></audio></div>';
      }).join('');
    });
  }


  /* K5 readiness: one row per concept. Helper's Yard teaches one concept per lesson; 80% or more on a lesson's practice shows it is ready. */
  function readinessReport(p) {
    var isl = CONTENT.islands.H0, st = Store.islandState(p, 'H0'), r = st.readiness || {}, ready = 0, started = 0;
    var rows = isl.quests.filter(function (q) { return q.kind === 'teach'; }).map(function (q) {
      var x = r[q.id], qs = Store.questState(p, 'H0', q.id);
      var first = qs.first !== undefined ? qs.first : (x && x.total ? Math.round(x.right / x.total * 100) : null);
      var best = qs.attempts ? qs.best : (x && x.total ? Math.round(x.right / x.total * 100) : null);
      if (first !== null || best !== null) started++;
      var ok = best !== null && best >= 80; if (ok) ready++;
      var status = best === null ? '—' : ok ? '<b style="color:#2f9e55">Ready ✓</b>' : '<b style="color:#c98a12">Keep practicing</b>';
      return '<tr><td>' + U.esc(q.title) + '</td><td>' + (first === null ? 'not started' : first + '%') + '</td><td>' + (best === null ? '—' : best + '%') + '</td><td>' + status + '</td></tr>';
    }).join('');
    return '<h3>K5 readiness report</h3><p class="muted">Helper\'s Yard teaches one K5 concept per lesson: a short how-to video, a few teaching pages, a hands-on activity, then a short practice. 80% or more on the practice shows the concept is ready. ' +
      (started ? ready + ' of ' + started + ' concepts started are ready.' : 'No lessons taken yet.') + '</p>' +
      '<table class="grid"><tr><th>Concept</th><th>First try</th><th>Best</th><th>Status</th></tr>' + rows + '</table>';
  }

  /* ---------------- Hours & records: course time by week, month, quarter, school year ---------------- */
  function ds(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function hm(min) { var h = Math.floor(min / 60), m = Math.round(min % 60); return (h ? h + ' h ' : '') + m + ' min'; }
  function ranges(d) {
    var now = new Date(), y = now.getFullYear(), m = now.getMonth(), sy = (d.settings.schoolYearStart || 8) - 1;
    var wkStart = new Date(now); wkStart.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday
    var qStart = new Date(y, Math.floor(m / 3) * 3, 1), qEnd = new Date(y, Math.floor(m / 3) * 3 + 3, 0);
    var syStart = new Date(m >= sy ? y : y - 1, sy, 1), syEnd = new Date(syStart.getFullYear() + 1, sy, 0);
    var wkEnd = new Date(wkStart); wkEnd.setDate(wkStart.getDate() + 6);
    return [['This week', ds(wkStart), ds(wkEnd)], ['This month', ds(new Date(y, m, 1)), ds(new Date(y, m + 1, 0))],
      ['This quarter (Q' + (Math.floor(m / 3) + 1) + ')', ds(qStart), ds(qEnd)], ['This school year', ds(syStart), ds(syEnd)], ['All time', '2000-01-01', '2999-12-31']];
  }
  var TOTAL_LESSONS = 235; // BJU Math 2 lessons 126–180 (55) + BJU Math 3 lessons 1–180
  function lessonsDone(p) {
    var n = 0;
    Object.keys(p.progress).forEach(function (id) { if (!CONTENT.islands[id] || (CONTENT.islands[id].course || 'voyage') !== (p.course || 'voyage')) return; var qs = p.progress[id].quests || {}; Object.keys(qs).forEach(function (k) { if (qs[k].done) n++; }); });
    return n;
  }
  function hoursTab(body, d, kids) {
    var active = kids.filter(function (k) { return !k.archived; });
    if (!active.length) { body.innerHTML = '<p>No children yet.</p>'; return; }
    var p = active.filter(function (k) { return k.id === kidId; })[0] || active[0]; kidId = p.id;
    var R = ranges(d);
    var html = '<div class="row noprint" style="margin-bottom:12px">' + active.map(function (k) { return '<button class="choice' + (k.id === p.id ? ' on' : '') + '" data-kid="' + k.id + '">' + U.esc(k.name) + '</button>'; }).join('') +
      '<span class="grow"></span><button class="btn small plain" id="csv">⬇ Download log (CSV)</button><button class="btn small plain" id="print">🖨 Print</button></div>' +
      '<h2>' + U.esc(p.name) + ' · Course hours</h2><p class="muted">Time counts only while ' + U.esc(p.name) + ' is actively playing (the window is open and in use). Parent-added time (workbook pages, hands-on work) is included.</p>' +
      '<div class="statgrid">' + R.map(function (r) { var t = Store.minutesBetween(p, r[1], r[2]); return '<div class="stat"><div class="muted">' + r[0] + '</div><div class="big">' + hm(t.minutes) + '</div><div class="muted">' + t.days + ' school day' + (t.days === 1 ? '' : 's') + ' (5+ min)</div></div>'; }).join('') + '</div>';
    // pace tracker
    var crs = CONTENT.courses[p.course || 'voyage'], TOTAL = crs.totalLessons || TOTAL_LESSONS;
    var done = lessonsDone(p), left = TOTAL - done, pace = '';
    if (p.finishDate) {
      var days = Math.max(1, Math.round((new Date(p.finishDate + 'T12:00:00') - new Date()) / 864e5)), schoolDays = Math.max(1, Math.round(days * 5 / 7));
      var per = left / schoolDays;
      pace = '<p style="font-size:1.1rem">To finish by <b>' + p.finishDate + '</b>: about <b>' + per.toFixed(1) + ' lessons per school day</b> (' + (per * 5).toFixed(1) + ' per week). ' +
        (per <= 1.05 ? '<span style="color:#2f9e55;font-weight:800">On track ✓</span>' : per <= 1.5 ? '<span style="color:#c98a12;font-weight:800">A little behind. Try an extra quest some days.</span>' : '<span style="color:#b4621a;font-weight:800">Behind. Consider a later finish date, or the pretest/test-out to skip what is already known.</span>') + '</p>';
    }
    html += '<h3>Pace tracker</h3><p>' + done + ' of ' + TOTAL + ' quests done (' + (p.course === 'harbor' ? 'K5 readiness checks and lessons, then Math 1 lessons 1–170' : 'Math 2 lessons 126–180, then Math 3 lessons 1–180') + '). Parts still being built count toward the total.</p>' +
      '<div class="row noprint"><label>Target finish date: <input type="date" class="textin" id="fd" value="' + (p.finishDate || '') + '" style="max-width:220px"></label></div>' + pace;
    // weekly table for the school year
    var sy = R[3], start = new Date(sy[1] + 'T12:00:00'), rows = '';
    var wk = new Date(start); wk.setDate(wk.getDate() - ((wk.getDay() + 6) % 7));
    while (ds(wk) <= ds(new Date())) {
      var we = new Date(wk); we.setDate(wk.getDate() + 6);
      var t = Store.minutesBetween(p, ds(wk), ds(we));
      if (t.minutes) rows = '<tr><td>' + ds(wk) + ' – ' + ds(we) + '</td><td>' + hm(t.minutes) + '</td><td>' + t.days + '</td></tr>' + rows;
      wk.setDate(wk.getDate() + 7);
    }
    html += '<h3>Week by week (this school year)</h3>' + (rows ? '<table class="grid"><tr><th>Week</th><th>Time</th><th>Days</th></tr>' + rows + '</table>' : '<p class="muted">No time logged yet this school year.</p>');
    // manual time
    html += '<h3>Add time worked off the screen</h3><div class="row noprint"><input type="date" class="textin" id="md" value="' + U.today() + '" style="max-width:200px">' +
      '<input class="textin" id="mm" type="number" min="1" max="300" placeholder="Minutes" style="max-width:120px"><input class="textin" id="mn" placeholder="What (e.g., BJU workbook p. 214)" style="max-width:340px">' +
      '<button class="btn small green" id="madd">Add</button></div>' +
      ((p.manualTime || []).length ? '<table class="grid" style="margin-top:8px"><tr><th>Date</th><th>Minutes</th><th>Note</th><th class="noprint"></th></tr>' + p.manualTime.slice().reverse().map(function (m, i) {
        return '<tr><td>' + m.date + '</td><td>' + m.minutes + '</td><td>' + U.esc(m.note) + '</td><td class="noprint"><button class="btn small plain" data-mdel="' + (p.manualTime.length - 1 - i) + '">Remove</button></td></tr>'; }).join('') + '</table>' : '');
    body.innerHTML = html;
    U.$$('[data-kid]', body).forEach(function (b) { b.onclick = function () { kidId = b.getAttribute('data-kid'); App.go('parent'); }; });
    U.$('#print', body).onclick = function () { window.print(); };
    U.$('#fd', body).onchange = function () { p.finishDate = this.value; Store.save(); App.go('parent'); };
    U.$('#madd', body).onclick = function () {
      var m = +U.$('#mm', body).value, dt = U.$('#md', body).value;
      if (!m || !dt) { U.toast('Enter a date and minutes.'); return; }
      p.manualTime.push({ date: dt, minutes: m, note: U.$('#mn', body).value || '' }); Store.save(); App.go('parent');
    };
    U.$$('[data-mdel]', body).forEach(function (b) { b.onclick = function () { p.manualTime.splice(+b.getAttribute('data-mdel'), 1); Store.save(); App.go('parent'); }; });
    U.$('#csv', body).onclick = function () {
      var days = {};
      Object.keys(p.time).forEach(function (k) { days[k] = 1; }); p.manualTime.forEach(function (m) { days[m.date] = 1; });
      var lines = ['date,game_minutes,parent_added_minutes,total_minutes,quests,notes'];
      Object.keys(days).sort().forEach(function (k) {
        var g = Math.round((p.time[k] || 0) / 60), man = p.manualTime.filter(function (m) { return m.date === k; });
        var mm = man.reduce(function (a, m) { return a + m.minutes; }, 0), qn = p.log.filter(function (l) { return l.date === k && !l.mission; }).length;
        lines.push([k, g, mm, g + mm, qn, '"' + man.map(function (m) { return m.note.replace(/"/g, "'"); }).join('; ') + '"'].join(','));
      });
      var blob = new Blob([lines.join('\n')], { type: 'text/csv' }), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = p.name + '-course-hours-' + U.today() + '.csv'; document.body.appendChild(a); a.click(); a.remove();
    };
  }

  /* ---------------- printable practice page (with answer key) ---------------- */
  function printPractice(islandId, questId, p) {
    var isl = CONTENT.islands[islandId], q = isl.quests.filter(function (x) { return x.id === questId; })[0];
    var keys = q.kind === 'lesson' || q.kind === 'teach' ? q.today.concat(q.today).slice(0, 5).concat((q.review || []).slice(0, 3)) :
      q.kind === 'readiness' ? [].concat.apply([], q.covers.map(function (id) { return isl.quests.filter(function (x) { return x.id === id; })[0].pre.slice(0, 3); })) : U.shuffle(q.mix).slice(0, 8);
    var g1 = isl.course === 'harbor';
    var seen = {}, probs = keys.map(function (k) { var pr; for (var t = 0; t < 30; t++) { pr = isl.generators[k](2); var sg = pr.prompt + JSON.stringify(pr.data || pr.answer); if (!seen[sg]) { seen[sg] = 1; break; } } return pr; });
    function ans(pr) {
      if (pr.type === 'shade' || pr.type === 'shadeSet') return 'Color ' + pr.answer + ' of ' + pr.n;
      if (pr.type === 'choice') { var c = pr.choices.filter(function (x) { return x.value === pr.answer; })[0]; return c && c.html.indexOf('<svg') < 0 ? c.html : '(the shape with equal parts)'; }
      return pr.answer;
    }
    var page = '<div class="sheet"><div class="sheethead"><h1>' + U.esc(isl.name) + ' · ' + U.esc(q.title) + '</h1><div>Name ____________________ &nbsp; Date ____________</div></div>' +
      '<p>' + (g1 ? 'Read each problem to your child. Circle or write the answer.' : 'Work each problem. For adding and subtracting, stack the numbers and show your work in the box.') + '</p><ol class="sheetlist">' +
      probs.map(function (pr) {
        var body = '<div class="sp">' + pr.prompt.replace(/Tap (parts )?to color/i, 'Color').replace(/^Tap /, g1 ? 'Circle ' : 'Tap ') + '</div><div class="sv">' + String(pr.visual || '').replace(/\sid="[^"]*"/g, '') + '</div>';
        if (pr.type === 'choice') body += '<div class="sc">' + pr.choices.map(function (c) { return '<span>○ ' + c.html + '</span>'; }).join('') + '</div>';
        else if (pr.type === 'number') body += (/[+−×]/.test(pr.prompt) ? '<div class="work">Show your work</div>' : '') + '<div class="sa">Answer: ____________</div>';
        if (pr.type === 'choice' && !g1) body += '<div class="sa">Why? ____________________________________________</div>';
        return '<li>' + body + '</li>';
      }).join('') + '</ol></div>' +
      '<div class="sheet key"><h2>Answer key · ' + U.esc(q.title) + '</h2><ol>' + probs.map(function (pr) { return '<li>' + ans(pr) + ' — ' + U.esc(pr.explain) + '</li>'; }).join('') + '</ol></div>';
    var w = window.open('', '_blank');
    if (!w) { U.toast('Please allow pop-ups to print the practice page.'); return; }
    var css = new URL('css/style.css', location.href).href;
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Practice: ' + U.esc(q.title) + '</title><link rel="stylesheet" href="' + css + '"></head><body class="printsheet">' + page +
      '<div class="noprint" style="text-align:center;margin:20px"><button onclick="window.print()" style="font-size:20px;padding:10px 24px">🖨 Print</button></div></body></html>');
    w.document.close();
  }

  function previewTab(body, d) {
    var pv = d.profiles.filter(function (x) { return x.preview; })[0];
    body.innerHTML = '<h2>Parent Preview</h2><p style="font-size:1.1rem">Play every island and quest yourself before your child does. Everything is unlocked, answers can be shown, and nothing you do here touches any child\'s progress, stars or reports.</p>' +
      '<label class="row" style="font-size:1.1rem"><input type="checkbox" id="sa"' + (pv.showAnswers ? ' checked' : '') + ' style="width:24px;height:24px"> Show the answer on every problem</label><br>' +
      '<div class="optgroup"><div class="label">Course to preview</div><div class="row">' + Object.keys(CONTENT.courses).map(function (k) { var c = CONTENT.courses[k]; return '<button class="choice' + ((pv.course || 'voyage') === k ? ' on' : '') + '" data-pc="' + k + '">' + U.esc(c.name) + ' · ' + U.esc(c.grade) + '</button>'; }).join('') + '</div></div>' +
      '<div class="row"><button class="btn big green" id="go">▶ Enter Parent Preview</button><button class="btn plain" id="rs">Reset preview progress</button></div>';
    U.$('#sa', body).onchange = function () { pv.showAnswers = this.checked; Store.save(); };
    U.$$('[data-pc]', body).forEach(function (b) { b.onclick = function () { pv.course = b.getAttribute('data-pc'); Store.save(); App.go('parent'); }; });
    U.$('#go', body).onclick = function () { pv.introSeen = true; Store.setActive(pv.id); App.go(pv.course === 'harbor' ? 'town' : 'map'); };
    U.$('#rs', body).onclick = function () { U.confirmBox('Clear all preview progress?', 'Reset', function () { pv.progress = {}; pv.log = []; pv.facts = {}; pv.errors = {}; Store.save(); U.toast('Preview reset.'); }); };
  }

  function settingsTab(body, d) {
    var s = d.settings, en = Audio2.englishVoices(), es = Audio2.spanishVoices();
    function opts(list, cur) { return '<option value="">Automatic</option>' + list.map(function (v) { return '<option' + (v.name === cur ? ' selected' : '') + '>' + U.esc(v.name) + '</option>'; }).join(''); }
    body.innerHTML = '<h2>Settings</h2>' +
      '<div class="optgroup"><label class="row"><input type="checkbox" id="von"' + (s.voiceOn ? ' checked' : '') + ' style="width:24px;height:24px"> <b>Read everything aloud</b></label></div>' +
      '<div class="optgroup"><div class="label">Voices</div><select id="vmode" class="textin" style="max-width:420px"><option value="recorded"' + (s.voiceMode !== 'computer' ? ' selected' : '') + '>Recorded character voices (recommended, offline)</option><option value="computer"' + (s.voiceMode === 'computer' ? ' selected' : '') + '>This computer\'s built-in voice</option></select>' +
      ' <button class="btn small plain" id="tvo">Test</button><p class="muted">Recorded cast: narrator, parrot, Abuela Rosa, and two keeper voices. Lines without a recording use the computer voice.</p></div>' +
      '<div class="optgroup"><div class="label">English voice</div><select id="ven" class="textin">' + opts(en, s.voiceName) + '</select> <button class="btn small plain" id="ten">Test</button></div>' +
      '<div class="optgroup"><div class="label">Spanish voice (keeper greetings)</div><select id="ves" class="textin">' + opts(es, s.voiceNameEs) + '</select> <button class="btn small plain" id="tes">Test</button>' +
      (es.length ? '' : '<p class="muted">No Spanish voice is installed on this computer. In Windows, add one under Settings › Time & language › Speech.</p>') + '</div>' +
      '<p class="muted">The computer voice is only used when "built-in voice" is chosen above, or for a line that has no recording.</p>' +
      '<div class="optgroup"><div class="label">Voice speed: <span id="rv">' + s.rate + '</span></div><input type="range" id="rate" min="0.7" max="1.2" step="0.05" value="' + s.rate + '" style="width:320px"></div>' +
      '<div class="optgroup"><div class="label">Music volume</div><input type="range" id="mus" min="0" max="1" step="0.05" value="' + s.music + '" style="width:320px"></div>' +
      '<div class="optgroup"><div class="label">Sound effects volume</div><input type="range" id="sfx" min="0" max="1" step="0.05" value="' + s.sfx + '" style="width:320px"></div>' +
      '<div class="optgroup"><div class="label">Daily goal (minimum quests per day)</div><select id="goal" class="textin" style="max-width:220px">' + [1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (s.sessionGoal === n ? ' selected' : '') + '>' + n + ' quests</option>'; }).join('') + '</select></div>' +
      '<div class="optgroup"><div class="label">Daily time limit (the current quest always finishes)</div><select id="maxm" class="textin" style="max-width:220px">' + [0, 30, 35, 40, 45, 50, 60].map(function (n) { return '<option value="' + n + '"' + (s.maxMinutes === n ? ' selected' : '') + '>' + (n ? n + ' minutes' : 'No limit') + '</option>'; }).join('') + '</select></div>' +
      '<div class="optgroup"><div class="label">Lantern Harbor (1st grade): daily goal, and when to suggest stopping (he may keep going)</div><select id="hgoal" class="textin" style="max-width:220px">' + [1, 2, 3].map(function (n) { return '<option value="' + n + '"' + (s.harbor.sessionGoal === n ? ' selected' : '') + '>' + n + ' quest' + (n > 1 ? 's' : '') + '</option>'; }).join('') + '</select> ' +
      '<select id="hmax" class="textin" style="max-width:220px">' + [0, 15, 20, 25, 30].map(function (n) { return '<option value="' + n + '"' + (s.harbor.maxMinutes === n ? ' selected' : '') + '>' + (n ? n + ' minutes' : 'No limit') + '</option>'; }).join('') + '</select><p class="muted">The settings above are for The Lantern Voyage. In Lantern Harbor these are gentle suggestions: your child is told they can be done for the day, and may choose to keep going.</p></div>' +
      '<div class="optgroup"><div class="label">Answer buttons wait while the question is read</div><select id="aw" class="textin" style="max-width:220px">' + [0, 1, 2, 2.5, 3].map(function (n) { return '<option value="' + n + '"' + (s.answerWait === n ? ' selected' : '') + '>' + (n ? n + ' seconds' : 'No wait') + '</option>'; }).join('') + '</select></div>' +
      '<div class="optgroup"><div class="label">School year starts in</div><select id="sys" class="textin" style="max-width:220px">' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(function (m, i) { return '<option value="' + (i + 1) + '"' + (s.schoolYearStart === i + 1 ? ' selected' : '') + '>' + m + '</option>'; }).join('') + '</select></div>' +
      '<div class="optgroup"><div class="label">Daily quest limit (maximum)</div><select id="lim" class="textin" style="max-width:220px">' + [0, 1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (s.dailyLimit === n ? ' selected' : '') + '>' + (n ? n + ' per day' : 'No limit') + '</option>'; }).join('') + '</select></div>' +
      '<div class="optgroup"><div class="label">iPad / offline</div>' + (/^https?:/.test(location.protocol) ?
        '<button class="btn plain" id="offl">⬇ Save the whole game on this device for offline use</button> <span id="offs" class="muted"></span><p class="muted">About 130 MB. Do this once on Wi-Fi; afterwards the game works without internet.</p>' :
        '<p class="muted">Opened from a folder on this computer: everything is already offline.</p>') + '</div>' +
      '<div class="optgroup"><button class="btn plain" id="pin">Change parent PIN</button></div>';
    U.$('#von', body).onchange = function () { s.voiceOn = this.checked; Store.save(); };
    U.$('#vmode', body).onchange = function () { s.voiceMode = this.value; Store.save(); };
    U.$('#tvo', body).onclick = function () { Audio2.speak('Squawk! Hello, Captain! I\'m so happy to see you!', { who: 'parrot' }).then(function () { return Audio2.speak('Welcome to my bakery! Every pie I bake must be cut fairly, so everyone gets the same amount. Today we learn about equal parts.', { who: 'abuela' }); }); };
    U.$('#ven', body).onchange = function () { s.voiceName = this.value; Store.save(); };
    U.$('#ves', body).onchange = function () { s.voiceNameEs = this.value; Store.save(); };
    U.$('#ten', body).onclick = function () { Audio2.speak('Ahoy, Captain! Three fourths of the pie is left.'); };
    U.$('#tes', body).onclick = function () { Audio2.speak([{ t: '¡Hola, capitán! Bienvenido.', lang: 'es' }]); };
    U.$('#rate', body).oninput = function () { s.rate = +this.value; U.$('#rv', body).textContent = s.rate; Store.save(); };
    U.$('#mus', body).onchange = function () { s.music = +this.value; Store.save(); Audio2.refreshMusic(); };
    U.$('#sfx', body).onchange = function () { s.sfx = +this.value; Store.save(); Audio2.sfx('right'); };
    U.$('#lim', body).onchange = function () { s.dailyLimit = +this.value; Store.save(); };
    U.$('#goal', body).onchange = function () { s.sessionGoal = +this.value; Store.save(); };
    U.$('#maxm', body).onchange = function () { s.maxMinutes = +this.value; Store.save(); };
    U.$('#sys', body).onchange = function () { s.schoolYearStart = +this.value; Store.save(); };
    U.$('#aw', body).onchange = function () { s.answerWait = +this.value; Store.save(); };
    U.$('#hgoal', body).onchange = function () { s.harbor.sessionGoal = +this.value; Store.save(); };
    U.$('#hmax', body).onchange = function () { s.harbor.maxMinutes = +this.value; Store.save(); };
    var ob = U.$('#offl', body);
    if (ob) ob.onclick = function () {
      var files = ['audio/music/title.mp3', 'audio/music/sea.mp3', 'audio/music/quest.mp3', 'audio/music/arcade.mp3', 'audio/music/hooray.mp3', 'audio/music/htown.mp3', 'audio/music/hquest.mp3', 'audio/music/hsong.mp3']
        .concat(Object.keys(window.VOICE_CLIPS || {}).map(function (k) { return 'audio/voice/' + k + '.mp3'; }));
      var done = 0, failed = 0, i = 0, st = U.$('#offs', body); ob.disabled = true;
      function worker() { if (i >= files.length) return Promise.resolve(); var f = files[i++]; return fetch(f).then(function (r) { if (!r.ok) failed++; }).catch(function () { failed++; }).then(function () { done++; if (done % 50 === 0 || done === files.length) st.textContent = done + ' of ' + files.length + ' saved'; return worker(); }); }
      Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]).then(function () { st.textContent = failed ? 'Done, but ' + failed + ' files did not save. Try again on Wi-Fi.' : '✓ Saved. The game now works offline on this device.'; ob.disabled = false; });
    };
    U.$('#pin', body).onclick = function () { d.pin = null; Store.save(); requirePin(function () { U.toast('PIN changed.'); }); };
  }

  function backupTab(body, d, kids) {
    var html = '<h2>Backups</h2><p style="font-size:1.05rem">Progress is saved in this browser on this computer. Export a backup monthly and keep it with your copies of the game folder (PC, USB drive, cloud). Clearing browser history and site data would erase progress that has not been backed up.</p>' +
      '<div class="row"><button class="btn green" id="exp">⬇ Export full backup</button><label class="btn plain">⬆ Import a backup file<input type="file" id="imp" accept=".json,application/json" style="display:none"></label></div>' +
      '<h2 style="margin-top:24px">Children\'s profiles</h2><p class="muted">Up to 6 profiles. Archive a profile when a child finishes: it is saved to a file, then hidden from the menu. You can restore it anytime.</p>' +
      '<table class="grid"><tr><th>Name</th><th>Started</th><th>Status</th><th>Actions</th></tr>' +
      kids.map(function (k) {
        return '<tr><td>' + U.esc(k.name) + '</td><td>' + k.created + '</td><td>' + (k.archived ? 'Archived' : 'Active') + '</td><td>' +
          '<button class="btn small plain" data-ex="' + k.id + '">Export</button> ' +
          (k.archived ? '<button class="btn small" data-un="' + k.id + '">Restore</button>' : '<button class="btn small coral" data-ar="' + k.id + '">Archive</button>') + '</td></tr>';
      }).join('') + '</table>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="add"' + (kids.filter(function (k) { return !k.archived; }).length >= 6 ? ' disabled' : '') + '>+ Add a child</button></div>';
    body.innerHTML = html;
    U.$('#exp', body).onclick = function () { U.downloadText('lantern-voyage-backup-' + U.today() + '.json', Store.exportAll()); };
    U.$('#imp', body).onchange = function () {
      var f = this.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { try { U.toast(Store.importText(r.result)); App.go('parent'); } catch (e) { U.toast(e.message); } };
      r.readAsText(f);
    };
    function find(id) { return d.profiles.filter(function (x) { return x.id === id; })[0]; }
    U.$$('[data-ex]', body).forEach(function (b) { b.onclick = function () { var k = find(b.getAttribute('data-ex')); U.downloadText('lantern-voyage-' + k.name.replace(/\W+/g, '') + '-' + U.today() + '.json', Store.exportProfile(k)); }; });
    U.$$('[data-ar]', body).forEach(function (b) {
      b.onclick = function () {
        var k = find(b.getAttribute('data-ar'));
        U.confirmBox('Archive ' + U.esc(k.name) + '? A backup file downloads first, then the profile is hidden from the menu.', 'Archive', function () {
          U.downloadText('lantern-voyage-' + k.name.replace(/\W+/g, '') + '-' + U.today() + '.json', Store.exportProfile(k));
          k.archived = true; Store.save(); App.go('parent');
        });
      };
    });
    U.$$('[data-un]', body).forEach(function (b) { b.onclick = function () { find(b.getAttribute('data-un')).archived = false; Store.save(); App.go('parent'); }; });
    U.$('#add', body).onclick = function () { App.go('builder', { mode: 'new' }); };
  }

  return { requirePin: requirePin, ERR: ERR, printPractice: printPractice };
})();
