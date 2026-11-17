/* Voice, sound effects and music. Placeholder voice uses the computer's built-in speech;
   the final version will play pre-recorded audio files from the audio/ folder instead. */
var Audio2 = (function () {
  var synth = window.speechSynthesis || null;
  var voices = [];
  var ctx = null, musicGain = null, musicOn = false;

  function settings() { return Store.get().settings; }

  function loadVoices() { if (synth) voices = synth.getVoices() || []; }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  var preferEn = ['Jenny', 'Aria', 'Ana', 'Libby', 'Sonia', 'Samantha', 'Zira', 'Google US English', 'Female'];
  function chooseVoice(lang) {
    if (!voices.length) loadVoices();
    var s = settings();
    var wanted = lang === 'es' ? s.voiceNameEs : s.voiceName;
    if (wanted) { var w = voices.filter(function (v) { return v.name === wanted; })[0]; if (w) return w; }
    var pool = voices.filter(function (v) { return (v.lang || '').toLowerCase().indexOf(lang) === 0; });
    if (!pool.length) return null;
    var local = pool.filter(function (v) { return v.localService; });
    var list = local.length ? local : pool;
    if (lang === 'en') {
      for (var i = 0; i < preferEn.length; i++) {
        var m = list.filter(function (v) { return v.name.indexOf(preferEn[i]) >= 0; })[0];
        if (m) return m;
      }
      var us = list.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0];
      if (us) return us;
    }
    return list[0];
  }
  function englishVoices() { if (!voices.length) loadVoices(); return voices.filter(function (v) { return /^en/i.test(v.lang); }); }
  function spanishVoices() { if (!voices.length) loadVoices(); return voices.filter(function (v) { return /^es/i.test(v.lang); }); }

  var speakToken = 0;
  /* speak("text") or speak([{t:"Hola", lang:"es"}, "Hello"]) — resolves when finished or cancelled. */
  /* speak("text", {who:'parrot'}) or speak([{t:"Hola", lang:"es"}, "Hello"], {who:'abuela'}).
     Uses the recorded voices when a clip exists, otherwise the computer voice. Resolves when finished or cancelled. */
  var curAudio = null;
  /* iPad/iPhone Safari only lets a sound element play if it was first started by a tap. So the game keeps a few
     reusable players and "unlocks" them all on the very first tap (playing a moment of silence). */
  var SILENT = 'data:audio/wav;base64,UklGRkQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YSADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
  var pool = {};
  function el(name) { if (!pool[name]) pool[name] = new Audio(); return pool[name]; }
  function unlock() {
    ['voice', 'line', 'song', 'hooray', 'musicA', 'musicB'].forEach(function (n) {
      var a = el(n); if (a.dataset.unlocked) return;
      try { a.src = SILENT; var pp = a.play(); a.dataset.unlocked = '1'; if (pp && pp.then) pp.then(function () { a.pause(); }).catch(function () { a.dataset.unlocked = ''; }); } catch (e) {}
    });
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(function (ev) { document.addEventListener(ev, unlock, true); });
  function remap(who) { return who === 'parrot' && window.App && App.buddyIsEli && App.buddyIsEli() ? 'eli' : who; }
  function speak(parts, opts) {
    opts = opts || {};
    if (opts.who) opts = { who: remap(opts.who), pitch: opts.pitch };
    stop();
    var token = ++speakToken;
    var list = Array.isArray(parts) ? parts : [parts];
    if (window.__voiceLog) list.forEach(function (part) {
      var text = typeof part === 'string' ? part : part.t, lang = typeof part === 'string' ? 'en' : (part.lang || 'en');
      if (text) window.__voiceLog.push.apply(window.__voiceLog, Voice.needed(text, remap((part && part.who) || opts.who || 'narrator'), lang));
    });
    if (!settings().voiceOn) return Promise.resolve();
    var useClips = settings().voiceMode !== 'computer' && window.Voice && Voice.available();
    duck(true);
    // never let a stuck sound hold the game: a whole line gets at most about twice its normal speaking time
    var chars = list.reduce(function (n, part) { return n + String(typeof part === 'string' ? part : (part && part.t) || '').length; }, 0);
    var cap = new Promise(function (r) { setTimeout(r, 3000 + chars * 140); });
    return Promise.race([cap, list.reduce(function (prev, part) {
      return prev.then(function () {
        if (token !== speakToken) return;
        var text = typeof part === 'string' ? part : part.t;
        var lang = typeof part === 'string' ? 'en' : (part.lang || 'en');
        var who = remap((part && part.who) || opts.who || 'narrator');
        if (!text) return;
        if (!useClips) return ttsSay(text, lang, opts, token);
        return Voice.plan(text, who, lang).reduce(function (p2, step) {
          return p2.then(function () {
            if (token !== speakToken) return;
            if (step.pause) return new Promise(function (r) { setTimeout(r, step.pause); });
            if (step.tts) return ttsSay(step.tts, step.lang, opts, token);
            return playClip(step.src, token);
          });
        }, Promise.resolve());
      });
    }, Promise.resolve())]).then(function () { if (token === speakToken) duck(false); });
  }
  function playClip(src, token) {
    return new Promise(function (res) {
      var a = el('voice'); a.onended = null; a.onerror = null; a.loop = false; a.src = src; curAudio = a;
      a.preservesPitch = true; a.webkitPreservesPitch = true; a.playbackRate = Math.max(0.7, Math.min(1.3, (settings().rate || 0.95) / 0.95 * (window.App && App.isHarbor && App.isHarbor() ? 0.82 : 1))); // 1st grade / K5: slower, same pitch
      var done = false, t1 = null; function fin() { if (!done) { done = true; clearTimeout(t1); a.onplaying = null; res(); } }
      a.onended = fin; a.onerror = fin; a.onstalled = fin;
      // iPad safety: if the clip has not started within 2.5 s, move on; once it plays, allow its own length plus a little
      t1 = setTimeout(fin, 2500);
      a.onplaying = function () { clearTimeout(t1); var d = isFinite(a.duration) && a.duration > 0 ? a.duration : 8; t1 = setTimeout(fin, d * 1000 / (a.playbackRate || 1) + 1500); };
      var p = a.play(); if (p && p.catch) p.catch(fin);
    });
  }
  function ttsSay(text, lang, opts, token) {
    if (!synth) return Promise.resolve();
    return new Promise(function (res) {
      if (token !== speakToken) return res();
      var u = new SpeechSynthesisUtterance(clean(text));
      var v = chooseVoice(lang);
      if (v) u.voice = v;
      u.lang = v ? v.lang : (lang === 'es' ? 'es-MX' : 'en-US');
      u.rate = settings().rate || 0.95;
      u.pitch = opts.pitch || 1.08;
      var done = false;
      function fin() { if (!done) { done = true; res(); } }
      u.onend = fin; u.onerror = fin;
      setTimeout(fin, 1500 + text.length * 110);
      try { synth.speak(u); } catch (e) { fin(); }
    });
  }
  function clean(t) {
    return String(t).replace(/<[^>]+>/g, ' ').replace(/(\d+)\s*\/\s*(\d+)/g, function (m, a, b) { return fracWords(+a, +b); })
      .replace(/\s+/g, ' ').trim();
  }
  var den = { 1: ['whole', 'wholes'], 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
  var num = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function fracWords(a, b) {
    var w = den[b]; if (!w) return a + ' over ' + b;
    return (num[a] || a) + ' ' + (a === 1 ? w[0] : w[1]);
  }
  function stop() { speakToken++; if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; } if (synth) { try { synth.cancel(); } catch (e) {} } }

  /* ---- sound effects (generated, so no files are needed) ---- */
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, vol, dest, at) {
    var c = ac(); if (!c) return;
    var t = (at !== undefined ? at : c.currentTime) + start;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  var noiseBuf = null;
  function noise(t, dur, vol, hp, dest) {
    var c = ac(); if (!c) return;
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp || 6000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(dest || c.destination); src.start(t); src.stop(t + dur + 0.02);
  }
  function kick(t, vol, dest) {
    var c = ac(); var o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.3);
  }
  function sfx(name) {
    var v = settings().sfx; if (!v) return;
    var c = ac(); if (!c) return;
    if (name === 'hooray') { var hj = el('hooray'); hj.src = 'audio/music/hooray.mp3'; hj.volume = Math.min(1, v * 1.2); var hp = hj.play(); if (hp && hp.catch) hp.catch(function () {}); return; }
    if (name === 'hooray-synth') { // drum roll, then a big happy chord and a run up
      var t0 = c.currentTime;
      for (var r = 0; r < 14; r++) noise(t0 + r * 0.045, 0.06, 0.12 * v * (0.4 + r / 20), 1800);
      [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.68, 1.4, 'triangle', 0.13 * v, null, t0); tone(f / 2, 0.68, 1.4, 'square', 0.03 * v, null, t0); });
      [784, 880, 988, 1047, 1175, 1319, 1568].forEach(function (f, i) { tone(f, 0.7 + i * 0.07, 0.18, 'square', 0.05 * v, null, t0); });
      tone(2093, 1.25, 0.6, 'triangle', 0.08 * v, null, t0);
      kick(t0 + 0.68, 0.5 * v, c.destination);
      return;
    }
    var s = {
      right: [[784, 0, .15], [1047, .1, .25]],
      gentle: [[392, 0, .18], [349, .14, .25]],
      coin: [[1319, 0, .08], [1760, .07, .18]],
      tap: [[660, 0, .06]],
      star: [[523, 0, .12], [659, .1, .12], [784, .2, .12], [1047, .3, .35]],
      whoosh: [[220, 0, .3], [330, .05, .3]],
      chomp: [[300, 0, .05], [500, .05, .05], [700, .1, .08]],
      bump: [[180, 0, .15]],
      fanfare: [[523, 0, .2], [659, .18, .2], [784, .36, .2], [1047, .54, .5], [784, .8, .15], [1047, .95, .6]]
    }[name];
    if (!s) return;
    s.forEach(function (n) { tone(n[0], n[1], n[2], name === 'whoosh' ? 'sawtooth' : 'triangle', 0.18 * v); });
  }

  /* ---- background music: original tunes played by a tiny built-in band
     (lead melody, chord pad, plucked arpeggio, bass line, light drums, a little echo). ---- */
  var NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function nm(n) { var m = /^([A-G][#b]?)(\d)$/.exec(n); return 12 * (+m[2] + 1) + NOTE[m[1]]; }
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function chord(name) { // 'D', 'Bm', 'A7'
    var m = /^([A-G][#b]?)(m?)(7?)$/.exec(name), root = 48 + NOTE[m[1]];
    if (root > 54) root -= 12;
    var tones = [root, root + (m[2] ? 3 : 4), root + 7];
    if (m[3]) tones.push(root + 10);
    return tones;
  }
  function bars(str) { return str.split('|').map(function (b) { return b.trim().split(/\s+/).map(function (t) { var x = t.split(':'); return [x[0], +x[1]]; }); }); }
  var TRACKS = {
    title: { bpm: 92, vol: 1, lead: 'triangle', drums: { k: 'x.......x.......', s: '', h: '....x.......x...' }, arp: 8,
      chords: 'G Em C D G Em C G',
      mel: bars('D5:4 G5:4 B5:6 A5:2 | G5:4 E5:4 B4:8 | C5:4 E5:4 G5:6 F#5:2 | A5:12 -:4 | D5:4 G5:4 B5:4 D6:4 | C6:4 B5:4 G5:8 | E5:4 G5:4 C6:4 B5:4 | A5:4 F#5:4 G5:8') },
    sea: { bpm: 104, vol: 1, lead: 'triangle', drums: { k: 'x.......x.......', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' }, arp: 8,
      chords: 'D G D A D G A D Bm G D A Bm G A7 D',
      mel: bars('A4:2 D5:2 D5:2 E5:2 F#5:4 E5:2 D5:2 | B4:2 D5:2 G5:4 F#5:2 E5:2 D5:4 | A4:2 D5:2 F#5:2 A5:2 A5:4 F#5:2 D5:2 | E5:4 C#5:2 E5:2 A4:8 |' +
        'A4:2 D5:2 D5:2 E5:2 F#5:4 A5:4 | B5:4 A5:2 G5:2 F#5:2 E5:2 D5:4 | E5:2 F#5:2 E5:2 D5:2 C#5:4 E5:4 | D5:12 -:4 |' +
        'F#5:4 F#5:2 E5:2 D5:4 B4:4 | D5:4 E5:2 F#5:2 G5:8 | A5:4 F#5:2 D5:2 F#5:4 A5:4 | E5:6 F#5:2 E5:8 |' +
        'F#5:2 G5:2 A5:4 B5:4 A5:4 | G5:2 F#5:2 E5:4 D5:4 B4:4 | C#5:4 E5:4 A5:4 G5:4 | F#5:4 E5:2 C#5:2 D5:8') },
    quest: { bpm: 76, vol: 0.55, lead: 'sine', drums: null, arp: 8,
      chords: 'F Dm Bb C F Am Bb C',
      mel: bars('A4:8 C5:8 | D5:12 C5:4 | Bb4:8 D5:8 | C5:16 | A4:4 C5:4 F5:8 | E5:8 C5:8 | D5:4 F5:4 D5:8 | C5:12 -:4') },
    arcade: { bpm: 140, vol: 0.9, lead: 'square', drums: { k: 'x...x...x...x...', s: '....x.......x...', h: '..x...x...x...x.' }, arp: 16,
      chords: 'C Am F G C Am F G F G Em Am F G C C',
      mel: bars('E5:2 G5:2 C6:2 G5:2 E5:2 G5:2 C6:4 | A5:2 C6:2 E6:2 C6:2 A5:4 G5:4 | F5:2 A5:2 C6:2 A5:2 F5:2 A5:2 C6:2 D6:2 | B5:4 G5:4 D6:4 B5:4 |' +
        'E5:2 G5:2 C6:2 E6:2 D6:2 C6:2 G5:4 | A5:2 C6:2 E6:4 D6:2 C6:2 A5:4 | F5:2 G5:2 A5:2 B5:2 C6:2 D6:2 E6:4 | D6:4 B5:4 G5:4 -:4 |' +
        'A5:4 C6:4 F6:4 C6:4 | B5:4 D6:4 G6:4 D6:4 | G5:2 B5:2 E6:4 B5:2 G5:2 E5:4 | A5:2 C6:2 E6:4 C6:4 A5:4 |' +
        'F5:2 A5:2 C6:2 F6:2 E6:2 C6:2 A5:4 | G5:2 B5:2 D6:2 G6:2 F6:2 D6:2 B5:4 | E6:4 D6:2 C6:2 G5:4 E5:4 | C6:8 -:8') }
  };
  /* Music: real-instrument recordings in audio/music/ (title, sea, quest, arcade), looped, with a gentle crossfade. */
  var trackName = 'title', musicEl = null, lastMusic = null, ducked = false;
  var TRACKVOL = { title: 1, sea: 0.9, quest: 0.55, arcade: 0.8, htown: 0.9, hquest: 0.55 };
  function targetVol() { if (isHeld()) return 0; return Math.max(0, Math.min(1, (settings().music || 0) * 1.25 * (TRACKVOL[trackName] || 1) * (ducked ? 0.2 : 1))); } // quieter overall; much quieter under voices
  function fade(el, to, ms, done) {
    var from = el.volume, t0 = Date.now();
    (function step() {
      var k = Math.min(1, (Date.now() - t0) / ms); el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) setTimeout(step, 40); else if (done) done();
    })();
  }
  function startMusic() {
    if (musicOn || !settings().music) return;
    musicOn = true;
    var mel = el(lastMusic === pool.musicA ? 'musicB' : 'musicA'); lastMusic = mel; mel.src = 'audio/music/' + trackName + '.mp3'; mel.loop = true; mel.volume = 0; musicEl = mel;
    var pr = mel.play(); if (pr && pr.catch) pr.catch(function () { musicOn = false; });
    fade(mel, targetVol(), 1200);
  }
  function stopMusic() {
    musicOn = false;
    var old = musicEl; musicEl = null;
    if (old) fade(old, 0, 500, function () { if (old !== musicEl) { try { old.pause(); } catch (e) {} } });
  }
  function refreshMusic() { if (musicEl && settings().music) { musicEl.volume = targetVol(); return; } stopMusic(); startMusic(); }
  function setTrack(name) {
    if (name === trackName) return;
    trackName = name;
    if (musicOn) { stopMusic(); startMusic(); }
  }
  function duck(on) { ducked = on; if (musicEl) fade(musicEl, targetVol(), 300); }

  /* play one line without interrupting anything else (used by the sing-along videos, which time each line to the music) */
  function clip(text, who) {
    if (!settings().voiceOn) return Promise.resolve();
    if (window.__voiceLog) window.__voiceLog.push.apply(window.__voiceLog, Voice.needed(text, remap(who || 'narrator'), 'en'));
    var useClips = settings().voiceMode !== 'computer' && window.Voice && Voice.available();
    if (!useClips) return ttsSay(text, 'en', {}, speakToken);
    return Voice.plan(text, remap(who || 'narrator'), 'en').reduce(function (p2, step) {
      return p2.then(function () {
        if (step.pause) return new Promise(function (r) { setTimeout(r, Math.min(step.pause, 120)); });
        if (step.tts) return ttsSay(step.tts, 'en', {}, speakToken);
        return new Promise(function (res) { var a = el('line'); a.onended = null; a.onerror = null; a.loop = false; a.src = step.src; a.playbackRate = Math.max(0.7, Math.min(1.3, (settings().rate || 0.95) / 0.95)); a.onended = res; a.onerror = res; var pp = a.play(); if (pp && pp.catch) pp.catch(res); setTimeout(res, 6000); });
      });
    }, Promise.resolve());
  }
  /* pause the background music while a video's own song plays */
  /* the music goes silent while something else needs the room: a video's song, a YouTube video, a hands-on activity, or the game being hidden */
  var holds = {};
  function isHeld() { return Object.keys(holds).some(function (k) { return holds[k]; }); }
  function holdMusic(on, reason) { holds[reason || 'song'] = !!on; if (musicEl) fade(musicEl, targetVol(), 300); }
  document.addEventListener('visibilitychange', function () { holdMusic(document.visibilityState !== 'visible', 'hidden'); });

  return { el: el, unlock: unlock, clip: clip, holdMusic: holdMusic, speak: speak, stop: stop, sfx: sfx, startMusic: startMusic, stopMusic: stopMusic, refreshMusic: refreshMusic, setTrack: setTrack,
    englishVoices: englishVoices, spanishVoices: spanishVoices, fracWords: fracWords };
})();
