/* "Watch & learn" videos for Lantern Harbor: short animated how-to clips made in the game itself (works offline),
   with narration, counting animations and sing-along chants over a little song. Each one can also offer a
   YouTube song picked for 5- to 7-year-olds (needs internet; best watched with a parent).
   Scene types:
     { say, show }                 narration with a picture that pops in
     { count: n, kind, color }     things appear one at a time while the narrator counts them
     { song: [ {t, show} ] }       a sing-along: one line every 4 beats over the song track (3 seconds a line)
     { beat: [words], kind }       a counting chant: one word per beat, one picture per beat */
var Video = (function () {
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  var BEAT = 0.75, LINE = 3.0; // the song track is 80 beats per minute
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* Render a player into `host`. keys: list of video ids. onDone(): called when the child presses the finish button. */
  function player(host, keys, opts) {
    opts = opts || {};
    var vids = keys.map(function (k) { return VIDEOS[k]; }).filter(Boolean);
    if (!vids.length) { if (opts.onDone) opts.onDone(); return; }
    var p = Store.active(), seen = vids.every(function (v) { return p && p.videosSeen && p.videosSeen[v.id]; });
    var token = 0, song = null, total = vids.reduce(function (a, v) { return a + v.scenes.length; }, 0);
    var tube = [];
    vids.forEach(function (v) { (v.tube || []).forEach(function (t) { tube.push(t); }); });
    host.innerHTML = '<div class="vplayer"><div class="vtop"><span class="vbadge">🎬 Watch &amp; learn</span><b id="vtitle"></b><span class="spacer"></span><div class="vdots" id="vdots"></div></div>' +
      '<div class="vscreen" id="vscreen"></div><div class="vcap" id="vcap"></div>' +
      '<div class="vctl"><button class="btn small plain" id="vagain">↻ Watch again</button>' +
      (tube.length ? '<button class="btn small blue" id="vtube">📺 Watch on YouTube</button>' : '') +
      '<span class="spacer"></span><button class="btn big green" id="vdone"' + (seen || opts.free ? '' : ' disabled') + '>' + (opts.doneLabel || 'I\'m ready! →') + '</button></div></div>';
    var scr = U.$('#vscreen', host), cap = U.$('#vcap', host);
    function dots(i) { U.$('#vdots', host).innerHTML = Array.from({ length: total }, function (_, k) { return '<i class="' + (k < i ? 'd' : k === i ? 'c' : '') + '"></i>'; }).join(''); }
    function stopSong() { if (song) { try { song.pause(); } catch (e) {} song = null; } Audio2.holdMusic(false); }
    function show(html) { scr.innerHTML = '<div class="vpop">' + html + '</div>'; }

    function runScene(sc, my) {
      if (sc.say && !sc.count && !sc.song && !sc.beat) {
        show(sc.show ? sc.show() : ''); cap.textContent = sc.say;
        return Audio2.speak(sc.say).then(function () { return wait(App.isHarbor() ? 1400 : 500); });
      }
      if (sc.count) {
        var n = sc.count, k = 0;
        cap.textContent = sc.say || 'Let\'s count!';
        scr.innerHTML = '<div class="vcount"><div class="g1set vset" style="max-width:520px">' + Array.from({ length: n }, function () { return '<span class="g1item vhide">' + Art.icon(sc.kind || 'duck', 64, sc.color) + '</span>'; }).join('') + '</div><div class="g1num vbig" id="vnum"></div></div>';
        var items = U.$$('.g1item', scr);
        return (sc.say ? Audio2.speak(sc.say) : Promise.resolve()).then(function step() {
          if (my !== token || k >= n) return;
          items[k].classList.remove('vhide'); items[k].classList.add('vin'); k++;
          U.$('#vnum', scr).textContent = k; Audio2.sfx('tap');
          return Audio2.speak(NUMW[k]).then(function () { return wait(App.isHarbor() ? 700 : 250); }).then(step);
        }).then(function () {
          if (my !== token) return;
          var end = sc.end || ('The last number we said was ' + NUMW[n] + '. So there are ' + NUMW[n] + '!');
          cap.textContent = end; return Audio2.speak(end).then(function () { return wait(500); });
        });
      }
      if (sc.song || sc.beat) {
        Audio2.holdMusic(true);
        song = Audio2.el('song'); song.src = 'audio/music/hsong.mp3'; song.loop = true; song.volume = Math.min(1, (Store.get().settings.music || 0.25) * 2.4);
        var pr = song.play(); if (pr && pr.catch) pr.catch(function () {});
        var t0 = Date.now() + 120, lines = sc.song || [], words = sc.beat || [];
        if (sc.song) {
          return lines.reduce(function (acc, ln, i) {
            return acc.then(function () {
              if (my !== token) return;
              var at = t0 + i * LINE * 1000 * (ln.bars || 1);
              return wait(Math.max(0, at - Date.now())).then(function () {
                if (my !== token) return;
                show(ln.show ? ln.show() : ''); cap.innerHTML = '🎵 ' + U.esc(ln.t);
                Audio2.clip(ln.t);
              });
            });
          }, Promise.resolve()).then(function () { return wait(LINE * 1000); }).then(stopSong);
        }
        // counting chant: one word per beat with a picture for each
        scr.innerHTML = '<div class="vcount"><div class="g1set vset" style="max-width:560px">' + words.map(function (_, i) { return '<span class="g1item vhide">' + Art.icon(sc.kind || 'star', 56, sc.colors ? sc.colors[i % sc.colors.length] : sc.color) + '</span>'; }).join('') + '</div><div class="g1num vbig" id="vnum"></div></div>';
        var its = U.$$('.g1item', scr);
        cap.innerHTML = '🎵 ' + U.esc(sc.say || 'Count with me!');
        return words.reduce(function (acc, w, i) {
          return acc.then(function () {
            if (my !== token) return;
            return wait(Math.max(0, t0 + (i + 4) * BEAT * 1000 - Date.now())).then(function () { // 4-beat count-in
              if (my !== token) return;
              its[i].classList.remove('vhide'); its[i].classList.add('vin');
              U.$('#vnum', scr).textContent = sc.labels ? sc.labels[i] : (i + (sc.from || 1));
              Audio2.clip(w);
            });
          });
        }, Promise.resolve()).then(function () { return wait(BEAT * 2000); }).then(function () {
          if (my !== token) return; stopSong();
          if (sc.end) { cap.textContent = sc.end; return Audio2.speak(sc.end).then(function () { return wait(400); }); }
        });
      }
      return Promise.resolve();
    }
    function play() {
      var my = ++token, idx = 0; Audio2.stop(); stopSong();
      return vids.reduce(function (acc, v) {
        return acc.then(function () {
          if (my !== token) return;
          U.$('#vtitle', host).textContent = v.title;
          return v.scenes.reduce(function (a2, sc) {
            return a2.then(function () { if (my !== token) return; dots(idx++); return runScene(sc, my); });
          }, Promise.resolve());
        });
      }, Promise.resolve()).then(function () {
        if (my !== token) return;
        dots(total); stopSong();
        if (p && !p.preview) { p.videosSeen = p.videosSeen || {}; vids.forEach(function (v) { p.videosSeen[v.id] = U.today(); }); Store.save(); }
        var d = U.$('#vdone', host); if (d) { d.disabled = false; d.classList.add('pop'); }
        cap.textContent = opts.endSay || 'Great watching! Now you try it.';
        Audio2.speak(opts.endSay || 'Great watching! Now you try it.', { who: 'parrot' });
      });
    }
    U.$('#vagain', host).onclick = function () { play(); };
    var tb = U.$('#vtube', host);
    if (tb) tb.onclick = function () {
      token++; stopSong(); Audio2.stop(); Audio2.holdMusic(true, 'youtube');
      U.modal('<div><h2 style="margin-top:0">📺 Videos on YouTube</h2><p>These open in a new tab and need the internet. YouTube shows other videos and sometimes ads around them, so it\'s best to watch together with a parent.</p>' +
        tube.map(function (t) { return '<p><button class="btn blue" data-yt="' + t.id + '">▶ ' + U.esc(t.label) + '</button></p>'; }).join('') +
        '<div class="row" style="justify-content:flex-end"><button class="btn plain" data-x="1">Close</button></div></div>', function (o, api) {
          o.querySelector('[data-x]').onclick = function () { Audio2.holdMusic(false, 'youtube'); api.close(); };
          U.$$('[data-yt]', o).forEach(function (b) { b.onclick = function () { window.open('https://www.youtube.com/watch?v=' + b.getAttribute('data-yt'), '_blank', 'noopener'); }; });
        });
    };
    U.$('#vdone', host).onclick = function () { token++; stopSong(); Audio2.stop(); if (opts.onDone) opts.onDone(); };
    if (window.__fastVideo) { U.$('#vdone', host).disabled = false; return { stop: function () {} }; } // automated tests only
    // safety: the "I'm ready" button always opens after 40 seconds, even if a sound gets stuck on the device
    setTimeout(function () { var d = U.$('#vdone', host); if (d && d.disabled) { d.disabled = false; d.classList.add('pop'); } }, 40000);
    play();
    return { stop: function () { token++; stopSong(); } };
  }

  /* which videos go with a skill (used when a quest does not list its own) */
  var OF_SKILL = { numeral: 'numbers', numberWord: 'numbers', dots: 'numbers', tally: 'tally', countSet: 'count10', makeSet: 'makeSet', compareSets: 'compare',
    nextNumber: 'order', missingNumber: 'order', ordinal: 'ordinal', evenOdd: 'evenOdd', namesForTen: 'make10', shapeFind: 'shapes', pattern: 'pattern', oddOneOut: 'sort',
    add10: 'add', sub10: 'sub', coinName: 'coins', coinValue: 'coins', countPennies: 'coins', clockHour: 'clock', dayAfter: 'days', longer: 'measure', equalShares: 'equal', pictograph: 'graph', dozen: 'dozen', barGraph: 'bargraph', matchUp: 'match',
    plusEquals: 'signs', addTo6: 'add', addSentence: 'signs', addStory: 'addStory', addVertical: 'addVert', addNames: 'addNames', turnAround: 'turnAround' };
  function forSkills(skills) { return U.uniq(skills.map(function (s) { return OF_SKILL[s]; }).filter(Boolean)); }

  var VIDEOS = {};
  function add(id, v) { v.id = id; VIDEOS[id] = v; }
  return { player: player, add: add, VIDEOS: VIDEOS, forSkills: forSkills, OF_SKILL: OF_SKILL };
})();
