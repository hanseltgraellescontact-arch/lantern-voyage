/* Recorded voices. Every spoken line is pre-recorded as a small MP3 in audio/voice/, one file per sentence
   (or per phrase + number for math sentences, so "38 plus 47" can be built from pieces).
   audio/voice-index.js lists which clips exist. Anything missing falls back to the computer's voice.
   Cast: narrator, parrot, abuela, keeperF, keeperM. */
var Voice = (function () {
  var PRE_NAMES = ['Pip', 'Kiwi', 'Mango', 'Sunny', 'Pepper', 'Coco'];
  function hash(s) { // two FNV-1a passes -> 16 hex chars
    var h1 = 0x811c9dc5, h2 = 0x01000193 ^ 0x5bd1e995;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 ^= c; h1 = Math.imul(h1, 0x01000193) >>> 0;
      h2 ^= c; h2 = Math.imul(h2, 0x5bd1e995) >>> 0; h2 ^= h2 >>> 13;
    }
    return ('0000000' + h1.toString(16)).slice(-8) + ('0000000' + (h2 >>> 0).toString(16)).slice(-8);
  }
  var DEN = { 1: ['whole', 'wholes'], 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'],
    6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function fracWords(a, b) { var w = DEN[b]; if (!w) return a + ' over ' + b; return (NUMW[a] || a) + ' ' + (a === 1 ? w[0] : w[1]); }

  /* Turn display text into the exact words that get recorded. */
  function norm(t) {
    var p = window.Store && Store.get && Store.get() ? Store.active() : null;
    t = String(t).replace(/<span class="frac[^"]*"><span class="n">([^<]*)<\/span><span class="d">([^<]*)<\/span><\/span>/g, ' $1/$2 ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
      .replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
    t = t.replace(/(\d+)\s*\/\s*(\d+)/g, function (m, a, b) { return fracWords(+a, +b); });
    // 4-digit numbers written with a comma are read as "4 thousand 725" (built from recorded number clips)
    t = t.replace(/\b(\d{1,3}),(\d{3})\b/g, function (m, a, b) { return a + ' thousand' + (+b ? ' ' + (+b) : ''); });
    t = t.replace(/(\d+):(\d\d)/g, function (m, h, mm) { return h + (mm === '00' ? " o'clock" : ' ' + (mm[0] === '0' ? 'oh ' + +mm : +mm)); });
    t = t.replace(/(\d+)\s*%/g, '$1 percent').replace(/×/g, ' times ').replace(/−/g, ' minus ').replace(/\s\+\s|\+/g, ' plus ').replace(/=/g, ' equals ')
      .replace(/…/g, '...').replace(/\s[—–]\s|[—–]/g, ', ').replace(/&/g, ' and ').replace(/[🦜💡📘👣✏️🎬🔊✝⚓🏮🧭🧺💛🤔✔✘✓]/g, '');
    if (p && !p.preview) {
      if (p.name) t = t.replace(new RegExp('Captain ' + esc(p.name) + '\\b', 'g'), 'Captain').replace(new RegExp('\\b' + esc(p.name) + '\\b', 'g'), 'Captain');
    }
    if (p && p.parrotName && PRE_NAMES.indexOf(p.parrotName) < 0) t = t.replace(new RegExp('\\b' + esc(p.parrotName) + '\\b', 'g'), 'your parrot');
    return t.replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1').replace(/([^.])\.\.(?!\.)/g, '$1.').replace(/([!?])\./g, '$1').trim();
  }
  function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function sentences(t) { return t.replace(/([.!?])\s+/g, '$1\u0001').split('\u0001').filter(function (s) { return /[A-Za-z0-9]/.test(s); }); }
  /* A sentence with digits is split into phrase pieces and number pieces. */
  function pieces(sent) {
    if (!/\d/.test(sent)) return [{ text: sent }];
    return sent.split(/(\d+)/).map(function (x) { return x.trim(); }).filter(function (x) { return /[A-Za-z0-9]/.test(x); })
      .map(function (x) { return /^\d+$/.test(x) ? { num: +x } : { text: x }; });
  }
  function keyFor(who, lang, piece) { return hash(who + '|' + (lang || 'en') + '|' + (piece.num !== undefined ? '#' + piece.num : piece.text)); }
  /* Plan for one utterance: list of {src} clips and {pause}, or null for a sentence that has no recording. */
  function plan(text, who, lang) {
    var out = [];
    sentences(norm(text)).forEach(function (s, i) {
      if (i) out.push({ pause: window.App && App.isHarbor && App.isHarbor() ? 1100 : 280 }); // 1st grade: longer pauses between sentences
      var whole = hash(who + '|' + (lang || 'en') + '|' + s);
      if (window.VOICE_CLIPS && VOICE_CLIPS[whole]) { out.push({ src: 'audio/voice/' + whole + '.mp3' }); return; }
      // fallback: build a number sentence from phrase + number pieces
      var ps = pieces(s), clips = [];
      for (var k = 0; k < ps.length; k++) {
        var key = keyFor(who, lang, ps[k]);
        if (!window.VOICE_CLIPS || !VOICE_CLIPS[key]) { clips = null; break; }
        clips.push({ src: 'audio/voice/' + key + '.mp3' });
      }
      if (clips) out = out.concat(clips); else { out.push({ tts: s, lang: lang }); missing(who, lang, s); }
    });
    return out;
  }
  var missed = {};
  function missing(who, lang, s) { missed[who + '|' + (lang || 'en') + '|' + s] = 1; }
  /* everything the collector should record for one utterance */
  function needed(text, who, lang) {
    return sentences(norm(text)).map(function (s) { return { who: who, lang: lang || 'en', text: s, key: hash(who + '|' + (lang || 'en') + '|' + s) }; });
  }
  function available() { return !!window.VOICE_CLIPS && Object.keys(VOICE_CLIPS).length > 0; }
  return { plan: plan, needed: needed, norm: norm, available: available, missed: function () { return Object.keys(missed); }, PRE_NAMES: PRE_NAMES, hash: hash };
})();
