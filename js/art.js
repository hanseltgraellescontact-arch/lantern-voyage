/* All artwork is drawn in code (SVG), so there are no image files to lose or break. */
var Art = (function () {
  var SKINS = ['#ffe0c2', '#f6c99a', '#dda271', '#b97a4d', '#8d5730', '#5e3a1f'];
  var HAIRCOLORS = ['#2a1b12', '#5b3a1e', '#a4652d', '#e4b75c', '#c4472c', '#151515'];
  var OUTFITS = ['#e5533d', '#3b8fd9', '#2fa35a', '#f2a01e', '#8d4fc2', '#17a5a0'];
  var HAIRS = ['Short', 'Curly', 'Ponytail', 'Long', 'Braids', 'Spiky'];
  var HATS = ['None', 'Captain hat', 'Bandana', 'Straw hat'];

  /* ---- The captain: one cohesive cartoon character (sailor outfit), drawn with a single outline style. ---- */
  function shade(hex, amt) { // amt < 0 darker, > 0 lighter
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, t = amt < 0 ? 0 : 255, k = Math.abs(amt);
    r = Math.round(r + (t - r) * k); g = Math.round(g + (t - g) * k); b = Math.round(b + (t - b) * k);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  var O4 = ' stroke="#2b2a3a" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  /* draw a group of circles as ONE blob: outlines first, then fills on top, so only the outer edge shows */
  function blob(circles, col) {
    return circles.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + (c[2] + 2) + '" fill="#2b2a3a"/>'; }).join('') +
      circles.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + col + '"/>'; }).join('');
  }
  function hairBack(style, col) {
    switch (style) {
      case 2: return '<path d="M160 92 q34 18 26 70 q-6 26 -24 30 q12 -34 -8 -60z" fill="' + col + '"' + O4 + '/><path d="M170 112 q8 20 2 44" stroke="' + shade(col, .3) + '" stroke-width="4" fill="none"/>';
      case 3: return '<path d="M48 100 q-16 70 4 112 q20 8 40 -2 l36 0 q22 10 42 2 q18 -44 2 -112z" fill="' + col + '"' + O4 + '/>';
      case 4: return blob([[48, 150, 11], [46, 170, 11], [48, 190, 10], [52, 208, 9], [172, 150, 11], [174, 170, 11], [172, 190, 10], [168, 208, 9]], col) +
        '<circle cx="53" cy="220" r="7" fill="#e5533d"' + O4.replace('4"', '3"') + '/><circle cx="167" cy="220" r="7" fill="#e5533d"' + O4.replace('4"', '3"') + '/>';
    }
    return '';
  }
  function hairFront(style, col) {
    var hl = shade(col, .28);
    switch (style) {
      case 0: return '<path d="M48 108 q-6 -62 62 -66 q68 4 62 66 q-8 -24 -30 -30 q-10 12 -30 8 q-12 10 -34 6 q-20 0 -30 16z" fill="' + col + '"' + O4 + '/><path d="M80 56 q20 -8 44 -4" stroke="' + hl + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
      case 1: return blob([[58, 82, 18], [74, 60, 20], [98, 48, 21], [124, 48, 21], [148, 60, 20], [164, 82, 18], [168, 104, 12], [52, 104, 12], [84, 74, 14], [112, 66, 14], [138, 74, 14]], col) +
        '<path d="M92 50 q12 -6 26 -2" stroke="' + hl + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
      case 2: case 3: case 4:
        return '<path d="M46 112 q-4 -68 64 -70 q68 2 64 70 q-12 -34 -46 -40 q-6 14 -30 18 q-20 4 -36 22 q-8 -4 -16 0z" fill="' + col + '"' + O4 + '/><path d="M120 50 q24 4 36 22" stroke="' + hl + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
      case 5: return '<path d="M48 108 l-4 -40 l20 14 l6 -34 l20 22 l12 -32 l14 28 l16 -28 l10 32 l22 -20 l2 34 l20 -10 l-8 34 q-16 -18 -62 -18 q-46 0 -68 18z" fill="' + col + '"' + O4 + '/>';
    }
    return '';
  }
  function hat(h, outfit) {
    switch (h) {
      case 1: return '<path d="M52 66 q-6 -36 58 -40 q64 4 58 40 q-58 -12 -116 0z" fill="#fbfbf5"' + O4 + '/><path d="M54 66 q56 -12 112 0 l0 12 q-56 -12 -112 0z" fill="#22335e"' + O4 + '/>' +
        '<path d="M58 78 q52 -12 104 0 q-4 14 -52 14 q-48 0 -52 -14z" fill="#1d2b4f"' + O4 + '/><path d="M104 54 l6 -10 l6 10 l-6 6z" fill="#f2c94c" stroke="#2b2a3a" stroke-width="2.5"/>';
      case 2: return '<path d="M46 86 q-2 -54 64 -56 q66 2 64 56 q-64 -18 -128 0z" fill="' + outfit + '"' + O4 + '/><circle cx="72" cy="62" r="4" fill="#fff"/><circle cx="102" cy="50" r="4" fill="#fff"/><circle cx="134" cy="56" r="4" fill="#fff"/><circle cx="156" cy="74" r="4" fill="#fff"/>' +
        '<path d="M170 82 l22 4 l-6 16 z M172 84 l18 -8 l0 14z" fill="' + outfit + '"' + O4.replace('4"', '3"') + '/>';
      case 4: return '<path d="M50 84 q-6 -60 60 -62 q66 2 60 62 q-60 -14 -120 0z" fill="' + shade(outfit, -.25) + '"' + O4 + '/><path d="M50 84 q60 -16 120 0 l2 12 q-62 -14 -124 0z" fill="' + shade(outfit, -.4) + '"' + O4 + '/>' +
        '<path d="M80 40 v38 M110 30 v44 M140 40 v38" stroke="' + shade(outfit, -.45) + '" stroke-width="3" opacity=".5"/><circle cx="110" cy="22" r="11" fill="' + shade(outfit, .2) + '"' + O4 + '/>';
      case 5: return '<path d="M58 70 q-4 -34 52 -36 q56 2 52 36z" fill="#fbfbf5"' + O4 + '/><path d="M56 70 q54 -10 108 0 l0 10 q-54 -10 -108 0z" fill="#22335e"' + O4 + '/>';
      case 3: return '<ellipse cx="110" cy="72" rx="80" ry="16" fill="#e9c46a"' + O4 + '/><path d="M70 72 q2 -44 40 -46 q38 2 40 46 q-40 -8 -80 0z" fill="#f4d58d"' + O4 + '/><path d="M71 64 q39 -8 78 0 l1 8 q-40 -8 -80 0z" fill="#c0392b"/>';
    }
    return '';
  }
  function captain(c, size) {
    c = c || {}; size = size || 200;
    var skin = SKINS[c.skin || 0], hc = HAIRCOLORS[c.hairColor || 0], out = OUTFITS[c.outfit || 0], hair = c.hair || 0;
    var rank = c.rank, plain = rank !== undefined && rank < 5; // Lantern Harbor ranks: plain clothes first, the sailor suit comes later
    var skinD = shade(skin, -.14), outD = shade(out, -.2), navy = plain ? '#3a5f9a' : '#22335e';
    var girl = c.gender === 'girl';
    var lashes = girl ? '<path d="M75 106 l-8 -3 M76 100 l-6 -6 M145 106 l8 -3 M144 100 l6 -6" stroke="#2b2a3a" stroke-width="3" stroke-linecap="round"/>' : '';
    var eye = function (x) {
      return '<ellipse cx="' + x + '" cy="112" rx="12" ry="14" fill="#fff"' + O4.replace('4"', '3"') + '/><ellipse cx="' + (x + 1) + '" cy="115" rx="7.5" ry="9" fill="#3a2a22"/>' +
        '<circle cx="' + (x + 4) + '" cy="110" r="3.2" fill="#fff"/><circle cx="' + (x - 2) + '" cy="119" r="1.6" fill="#fff"/>';
    };
    return '<svg viewBox="0 0 220 320" width="' + size + '" height="' + (size * 320 / 220) + '" aria-hidden="true">' +
      hairBack(hair, hc) +
      // legs (navy trousers) and shoes
      '<path d="M74 238 l72 0 l4 56 l-34 0 l-6 -36 l-6 36 l-34 0z" fill="' + navy + '"' + O4 + '/>' +
      '<path d="M108 262 l2 28" stroke="#3a4f86" stroke-width="3"/>' +
      '<path d="M64 300 q0 -14 26 -12 q18 0 18 12z" fill="#5b3a1e"' + O4 + '/><path d="M112 300 q0 -12 18 -12 q26 -2 26 12z" fill="#5b3a1e"' + O4 + '/>' +
      // body + arms as one shape (sailor shirt)
      '<path d="M82 166 q-26 2 -34 26 l-12 44 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -30 l0 34 l72 0 l0 -34 l6 30 q2 10 12 10 l10 -2 q12 -2 10 -14 l-12 -44 q-8 -24 -34 -26z" fill="' + out + '"' + O4 + '/>' +
      '<path d="M146 172 q14 6 20 22 l12 44 q2 10 -8 12 l-6 0 q8 -4 6 -14 l-12 -40 q-4 -14 -12 -24z" fill="' + outD + '" opacity=".55"/>' +
      '<path d="M40 238 l18 4 M180 238 l-18 4" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' +
      // belt
      '<path d="M72 236 l76 0 l0 10 l-76 0z" fill="#5b3a1e"' + O4.replace('4"', '3"') + '/><rect x="102" y="234" width="16" height="14" rx="3" fill="#f2c94c" stroke="#2b2a3a" stroke-width="3"/>' +
      // hands
      '<ellipse cx="46" cy="252" rx="13" ry="12" fill="' + skin + '"' + O4 + '/><ellipse cx="174" cy="252" rx="13" ry="12" fill="' + skin + '"' + O4 + '/>' +
      (plain ? rankExtras(rank, out) :
      // sailor collar and neckerchief
      '<path d="M74 168 q36 12 72 0 l8 22 q-44 18 -88 0z" fill="#22335e"' + O4 + '/><path d="M78 178 q32 12 64 0" stroke="#fff" stroke-width="3" fill="none"/>' +
      '<path d="M96 174 l14 20 l14 -20z" fill="#fff" stroke="#2b2a3a" stroke-width="3" stroke-linejoin="round"/>' +
      (rank === 5 ? '' : '<path d="M98 192 l12 8 l12 -8 l4 26 l-10 -8 l-6 12 l-6 -12 l-10 8z" fill="#e5533d"' + O4.replace('4"', '3"') + '/><circle cx="110" cy="198" r="6" fill="#c4472c" stroke="#2b2a3a" stroke-width="3"/>')) +
      // neck, ears, head
      '<path d="M96 150 l28 0 l0 22 q-14 8 -28 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="50" cy="118" rx="12" ry="15" fill="' + skin + '"' + O4 + '/><ellipse cx="170" cy="118" rx="12" ry="15" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M48 118 q4 -6 6 2 M172 118 q-4 -6 -6 2" stroke="' + skinD + '" stroke-width="3" fill="none"/>' +
      '<ellipse cx="110" cy="108" rx="62" ry="60" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M150 70 q26 30 12 76 q-14 18 -36 20 q34 -24 24 -96z" fill="' + skinD + '" opacity=".35"/>' +
      // face
      eye(86) + eye(134) + lashes +
      '<path d="M74 92 q12 -8 24 -2 M122 90 q12 -6 24 2" stroke="' + shade(hc, -.1) + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M107 126 q4 4 8 0" stroke="' + shade(skin, -.35) + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="134" rx="10" ry="6" fill="#ff7a7a" opacity=".35"/><ellipse cx="148" cy="134" rx="10" ry="6" fill="#ff7a7a" opacity=".35"/>' +
      '<path d="M94 138 q16 18 32 0 q-16 6 -32 0z" fill="#8a2f2f" stroke="#2b2a3a" stroke-width="3" stroke-linejoin="round"/><path d="M100 140 q10 3 20 0" stroke="#fff" stroke-width="3" fill="none"/>' +
      hairFront(hair, hc) + hat(rank !== undefined ? RANKHAT[rank] : (c.hat || 0), out) +
      '</svg>';
  }
  /* Lantern Harbor ranks change the outfit: 0 Harbor Helper, 1 Dock Hand, 2 Deckhand, 3 Boat Builder, 4 Navigator-in-Training, 5 First Mate, 6 Captain */
  var RANKHAT = [0, 4, 4, 2, 5, 5, 1];
  function rankExtras(rank, out) {
    var o = '<path d="M90 170 q20 12 40 0" stroke="#2b2a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; // round t-shirt neck
    if (rank >= 2) o += '<path d="M60 200 h100 M56 216 h108 M58 232 h104" stroke="#fff" stroke-width="7" opacity=".85"/>'; // deckhand stripes
    if (rank >= 3) o += '<path d="M68 230 l84 0 l0 14 l-84 0z" fill="#8a5a2b"' + O4.replace('4"', '3"') + '/><path d="M144 240 l10 22 M138 244 l20 -6" stroke="#5b5f66" stroke-width="5" stroke-linecap="round"/><rect x="76" y="238" width="10" height="16" rx="2" fill="#c98a3a" stroke="#2b2a3a" stroke-width="2.5"/>'; // tool belt
    if (rank >= 4) o += '<path d="M82 168 q-10 30 -6 64 l24 0 l6 -58z M138 168 q10 30 6 64 l-24 0 l-6 -58z" fill="#22335e"' + O4.replace('4"', '3"') + '/><circle cx="110" cy="206" r="9" fill="#f2c94c" stroke="#2b2a3a" stroke-width="3"/><path d="M110 200 l3 6 l-3 6 l-3 -6z" fill="#e5533d"/>'; // navigator vest + compass
    return o;
  }

  /* The parrot: the child chooses its colors and what it wears. */
  var PBODY = ['#e8402f', '#2a7de1', '#36b37e', '#f5c400', '#8d5ad6', '#ff6fa8', '#1fb5ad'];
  var PWING = ['#2a6fdb', '#e8402f', '#f2c230', '#36b37e', '#8d5ad6', '#ff9f1c'];
  var PBEAK = ['#f4b63c', '#d9d2c3', '#58b947', '#ff8a3d'];
  var PWEAR = [['none', 'Nothing'], ['sunglasses', 'Sunglasses'], ['glasses', 'Glasses'], ['bandana', 'Bandana'], ['captain', 'Captain hat'], ['bowtie', 'Bow tie'], ['flower', 'Flower'], ['tricorn', 'Sailor\'s tricorn']];
  function lighten(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  function parrot(size, mood, cfg) {
    size = size || 120;
    if (!cfg && window.Store && Store.get && Store.get()) { var ap = Store.active(); cfg = ap && ap.parrot; }
    cfg = cfg || {};
    var O = '#2b2a3a', body = PBODY[cfg.body || 0], wing = PWING[cfg.wing || 0], beak = PBEAK[cfg.beak || 0], wear = cfg.wear || 'none';
    var belly = cfg.body === 3 ? '#fff3b0' : '#ffd23f', st = ' stroke="' + O + '" stroke-width="3" stroke-linejoin="round"';
    var eye = mood === 'happy' ? '<circle cx="89" cy="45" r="16" fill="#ffd23f"' + st + '/><path d="M80 48 q10 -12 20 0"' + st + ' fill="none" stroke-linecap="round"/>' :
      '<circle cx="89" cy="45" r="16" fill="#ffd23f"' + st + '/><circle cx="90" cy="45" r="11" fill="#fff"' + st + '/><circle cx="92" cy="46" r="6.5" fill="' + O + '"/><circle cx="94.5" cy="43" r="2.4" fill="#fff"/>';
    var w = '';
    switch (wear) {
      case 'sunglasses': w = '<path d="M60 40 h10"' + st + '/><rect x="72" y="34" width="34" height="20" rx="8" fill="#1f6fd1"' + st + '/><path d="M78 38 l8 0" stroke="#bfe6ff" stroke-width="3" stroke-linecap="round"/>'; break;
      case 'glasses': w = '<circle cx="89" cy="45" r="15" fill="none" stroke="#7b5b3a" stroke-width="4"/><path d="M74 44 h-12" stroke="#7b5b3a" stroke-width="4"/>'; break;
      case 'bandana': w = '<path d="M50 34 q28 -26 56 -6 l-4 8 q-26 -16 -50 4z" fill="#e5533d"' + st + '/><circle cx="66" cy="26" r="2.5" fill="#fff"/><circle cx="82" cy="22" r="2.5" fill="#fff"/><path d="M50 34 l-14 4 l8 8z" fill="#e5533d"' + st + '/>'; break;
      case 'captain': w = '<path d="M52 30 q26 -30 54 0 z" fill="#22335e"' + st + '/><path d="M46 31 q34 -10 66 0 q-33 8 -66 0z" fill="#1d2b4f"' + st + '/><rect x="58" y="22" width="40" height="6" rx="3" fill="#f2c94c"/><circle cx="79" cy="14" r="4" fill="#f2c94c"/>'; break;
      case 'bowtie': w = '<path d="M80 78 l-16 -9 v18z M80 78 l16 -9 v18z" fill="#e5533d"' + st + '/><circle cx="80" cy="78" r="4.5" fill="#c4472c"' + st + '/>'; break;
      case 'flower': w = '<g transform="translate(58,22)">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-8" rx="5" ry="8" fill="#ff8ad8" stroke="' + O + '" stroke-width="2" transform="rotate(' + a + ')"/>'; }).join('') + '<circle r="5" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/></g>'; break;
      case 'tricorn': w = '<path d="M46 32 q34 -36 68 0 q-10 -6 -34 -4 q-24 -2 -34 4z" fill="#3a2a22"' + st + '/><path d="M54 28 q26 -8 52 0" stroke="#f2c94c" stroke-width="3" fill="none"/>'; break;
    }
    return '<svg viewBox="0 0 150 175" width="' + size + '" height="' + (size * 175 / 150) + '" aria-hidden="true" class="bob">' +
      '<path d="M58 132 q-14 24 -10 40 q12 -10 20 -34z" fill="' + wing + '"' + st + '/><path d="M68 134 q2 26 12 36 q6 -14 0 -36z" fill="' + body + '"' + st + '/>' +
      '<ellipse cx="72" cy="100" rx="34" ry="42" fill="' + body + '"' + st + '/>' +
      '<ellipse cx="82" cy="108" rx="18" ry="26" fill="' + belly + '" opacity=".9"/>' +
      '<path d="M44 82 q-20 34 4 66 q24 -12 26 -48 q-8 -20 -30 -18z" fill="' + wing + '"' + st + '/>' +
      '<path d="M50 104 q8 4 14 -2 M50 118 q8 4 16 -2 M54 132 q6 2 12 -4" stroke="' + lighten(wing, .45) + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M66 22 q-6 -18 8 -20 q0 8 6 12 q4 -12 15 -8 q-9 6 -7 16z" fill="' + body + '"' + st + '/>' +
      '<circle cx="80" cy="48" r="30" fill="' + body + '"' + st + '/>' +
      '<ellipse cx="88" cy="47" rx="16" ry="15" fill="' + lighten(body, .55) + '"/>' + eye +
      '<path d="M104 40 q26 0 22 28 q-2 6 -6 4 q0 -12 -16 -14z" fill="' + beak + '"' + st + '/><path d="M104 56 q8 4 14 12" stroke="' + O + '" stroke-width="2.5" fill="none"/>' +
      '<circle cx="72" cy="58" r="5" fill="#ff8a80" opacity=".5"/>' +
      '<path d="M62 140 v10 M60 150 l-6 4 M62 150 l0 6 M64 150 l6 4 M84 140 v10 M82 150 l-6 4 M84 150 l0 6 M86 150 l6 4" stroke="#f2a01e" stroke-width="4" stroke-linecap="round"/>' +
      w + '</svg>';
  }

  /* Abuela Rosa, the baker: same cohesive style as the captain. */
  function keeperRosa(size) {
    size = size || 170;
    var skin = '#c48a5c', skinD = shade(skin, -.14), hair = '#dcdcdc';
    var eye = function (x) { return '<ellipse cx="' + x + '" cy="114" rx="8" ry="9" fill="#fff" stroke="#2b2a3a" stroke-width="2.5"/><circle cx="' + (x + 1) + '" cy="116" r="5" fill="#3a2a22"/><circle cx="' + (x + 3) + '" cy="113" r="2" fill="#fff"/>'; };
    return '<svg viewBox="0 0 220 320" width="' + size + '" height="' + (size * 320 / 220) + '" aria-hidden="true">' +
      blob([[110, 40, 22]], hair) + '<path d="M100 30 q10 -6 20 0" stroke="#fff" stroke-width="3" fill="none"/>' +
      // dress (one shape with arms) and apron
      '<path d="M80 166 q-28 4 -36 30 l-10 44 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -26 l-6 92 l108 0 l-6 -92 l6 26 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -44 q-8 -26 -36 -30z" fill="#c2367a"' + O4 + '/>' +
      '<path d="M150 176 q14 8 18 24 l10 40 q2 10 -8 12 q6 -6 4 -14 l-10 -40 q-4 -14 -14 -22z" fill="#8f2459" opacity=".5"/>' +
      '<path d="M82 196 l56 0 l8 116 l-72 0z" fill="#fffaf0"' + O4 + '/><path d="M96 242 l28 0 l0 22 l-28 0z" fill="#f3e6cf" stroke="#2b2a3a" stroke-width="3"/>' +
      '<path d="M82 200 q-10 -18 2 -32 M138 200 q10 -18 -2 -32" stroke="#2b2a3a" stroke-width="3" fill="none"/>' +
      // shawl collar
      '<path d="M74 168 q36 16 72 0 l6 14 q-42 22 -84 0z" fill="#f2a01e"' + O4 + '/>' +
      // pie in hand
      '<ellipse cx="176" cy="234" rx="34" ry="12" fill="#c98a3a"' + O4 + '/><ellipse cx="176" cy="228" rx="30" ry="9" fill="#e8b25a" stroke="#2b2a3a" stroke-width="3"/><path d="M160 226 l6 4 M174 224 l4 6 M188 225 l2 6" stroke="#a8692a" stroke-width="3"/>' +
      '<ellipse cx="46" cy="252" rx="13" ry="12" fill="' + skin + '"' + O4 + '/><ellipse cx="158" cy="240" rx="12" ry="11" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M86 312 l0 4 M134 312 l0 4" stroke="#2b2a3a"/><path d="M78 312 q0 -8 20 -8 q12 0 12 8z M110 312 q0 -8 12 -8 q20 0 20 8z" fill="#5b3a1e"' + O4 + '/>' +
      // neck and head
      '<path d="M98 150 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="118" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="118" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<circle cx="52" cy="134" r="4" fill="#f2c94c" stroke="#2b2a3a" stroke-width="2"/><circle cx="168" cy="134" r="4" fill="#f2c94c" stroke="#2b2a3a" stroke-width="2"/>' +
      '<ellipse cx="110" cy="110" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M146 76 q22 28 10 70 q-12 14 -30 16 q30 -22 20 -86z" fill="' + skinD + '" opacity=".35"/>' +
      '<path d="M52 108 q-4 -56 58 -58 q62 2 58 58 q-10 -28 -58 -30 q-48 2 -58 30z" fill="' + hair + '"' + O4 + '/><path d="M72 70 q20 -12 40 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      eye(88) + eye(132) +
      '<circle cx="88" cy="114" r="15" fill="none" stroke="#7b5b3a" stroke-width="3.5"/><circle cx="132" cy="114" r="15" fill="none" stroke="#7b5b3a" stroke-width="3.5"/><path d="M103 112 q7 -4 14 0" stroke="#7b5b3a" stroke-width="3.5" fill="none"/>' +
      '<path d="M76 94 q10 -5 20 -1 M124 93 q10 -4 20 1" stroke="#b9b9b9" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M71 120 q-4 4 0 8 M149 120 q4 4 0 8" stroke="' + skinD + '" stroke-width="2.5" fill="none"/>' +
      '<path d="M106 128 q4 4 8 0" stroke="' + shade(skin, -.35) + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="76" cy="136" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/><ellipse cx="144" cy="136" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/>' +
      '<path d="M94 140 q16 16 32 0" stroke="#6b2e22" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '</svg>';
  }


  var SAILS = { white: '#fbfbf5', sky: '#8fd3ff', sunset: '#ffb35c', berry: '#e35d8f', mint: '#8fe3b8', royal: '#5b6fe0', gold: '#ffd54a' };
  var GLOWS = { gold: '#ffd76b', rose: '#ff9db8', aqua: '#7ff0ff', lime: '#c6ff7a' };
  function ship(s, size) {
    s = s || {}; size = size || 260;
    var sail = SAILS[s.sail] || SAILS.white, glow = GLOWS[s.glow] || GLOWS.gold;
    var pat = '';
    if (s.pattern === 'stripes') pat = '<path d="M118 48 L118 146 M132 52 L134 146 M146 62 L148 146" stroke="#e5533d" stroke-width="7" opacity=".75"/>';
    if (s.pattern === 'stars') pat = star(126, 80, 9, '#f2c230', true) + star(140, 116, 8, '#f2c230', true) + star(120, 132, 6, '#f2c230', true);
    if (s.pattern === 'dots') pat = '<g fill="#3b8fd9" opacity=".85"><circle cx="122" cy="70" r="6"/><circle cx="140" cy="96" r="6"/><circle cx="120" cy="112" r="6"/><circle cx="142" cy="130" r="5"/></g>';
    if (s.pattern === 'fish') pat = '<path d="M114 100 q16 -14 30 0 q-14 14 -30 0z M144 100 l10 -8 v16z" fill="#2a6fdb" opacity=".85"/>';
    var FB = 'stroke="#2b2a3a" stroke-width="2"', FBOX = '<path d="M104 22 h40 v20 h-40z" fill="#fff" ' + FB + '/>', FBLUE = '<path d="M104 22 h40 v20 h-40z" fill="#2a6fdb" ' + FB + '/>';
    var flag = { wave: '<path d="M104 22 q10 -6 20 0 t20 0 v20 q-10 6 -20 0 t-20 0z" fill="#fff" ' + FB + '/><path d="M104 29 q10 -6 20 0 t20 0 v6 q-10 6 -20 0 t-20 0z" fill="#2a6fdb"/>',
      fish: FBOX + '<path d="M110 32 q10 -8 20 0 q-10 8 -20 0z M130 32 l7 -5 v10z" fill="#2a6fdb"/>',
      star: FBLUE + star(124, 32, 7, '#fff'),
      lantern: FBLUE + '<rect x="120" y="25" width="8" height="13" rx="2" fill="#fff"/><path d="M119 25 h10 M124 22 v3" stroke="#fff" stroke-width="2"/>',
      heart: FBOX + '<path d="M124 38 q-10 -6 -6 -11 q4 -3 6 1 q2 -4 6 -1 q4 5 -6 11z" fill="#2a6fdb"/>',
      cross: FBOX + '<path d="M120 24 h6 v6 h8 v5 h-8 v6 h-6 v-6 h-8 v-5 h8z" fill="#2a6fdb"/>' }[s.flag || 'wave'] || '';
    var fig = { none: '',
      dolphin: '<path d="M244 140 q22 -22 32 -4 q-8 -2 -12 4 q-6 -6 -20 0z" fill="#6aa8d8" stroke="#2b2a3a" stroke-width="3"/><circle cx="266" cy="132" r="2" fill="#222"/>',
      lion: '<circle cx="258" cy="132" r="15" fill="#c98a12" stroke="#2b2a3a" stroke-width="3"/><circle cx="260" cy="133" r="9" fill="#f2c230"/><circle cx="263" cy="130" r="1.8" fill="#222"/>',
      eagle: '<path d="M244 138 q14 -24 32 -12 l-8 4 l6 6 q-14 2 -30 2z" fill="#8d5730" stroke="#2b2a3a" stroke-width="3"/><circle cx="264" cy="128" r="2" fill="#fff"/>',
      turtle: '<ellipse cx="256" cy="136" rx="15" ry="10" fill="#2fa35a" stroke="#2b2a3a" stroke-width="3"/><circle cx="272" cy="132" r="6" fill="#8fd18f" stroke="#2b2a3a" stroke-width="2.5"/>' }[s.figure || 'none'];
    var O3 = ' stroke="#2b2a3a" stroke-width="3.5" stroke-linejoin="round"';
    var sailD = shade(sail, -.12);
    return '<svg viewBox="0 0 280 200" width="' + size + '" height="' + (size * 200 / 280) + '" aria-hidden="true">' +
      '<circle cx="34" cy="110" r="24" fill="' + glow + '" opacity=".35" class="glow"/>' +
      // masts and rigging
      '<path d="M100 14 l0 136 M100 30 l-58 112 M100 30 l130 112" stroke="#6b4423" stroke-width="2" opacity=".6"/>' +
      '<rect x="97" y="14" width="7" height="140" rx="2" fill="#8d5730"' + O3 + '/>' + flag +
      // main sail (billowing) and fore sail
      '<path d="M106 44 q56 10 52 52 q0 30 -6 50 l-46 0z" fill="' + sail + '"' + O3 + '/><path d="M140 52 q14 30 6 92 l6 0 q6 -20 6 -50 q2 -30 -18 -42z" fill="' + sailD + '" opacity=".6"/>' + pat +
      '<path d="M94 58 q-44 26 -44 92 l44 0z" fill="' + sail + '"' + O3 + '/><path d="M60 120 q2 -30 18 -50" stroke="' + sailD + '" stroke-width="5" fill="none" opacity=".7"/>' +
      '<path d="M100 44 l60 0 M100 146 l58 0" stroke="#6b4423" stroke-width="4" stroke-linecap="round"/>' +
      // hull: red with yellow trim, planks and portholes
      '<path d="M14 146 q8 -4 16 -2 l220 0 q12 -4 18 0 l-28 46 q-4 6 -14 6 l-160 0 q-10 0 -16 -6z" fill="#e5533d"' + O3 + '/>' +
      '<path d="M22 158 l232 0 M30 172 l214 0" stroke="#b83c2b" stroke-width="3"/>' +
      '<path d="M14 146 q8 -4 16 -2 l220 0 q12 -4 18 0 l-3 6 q-120 6 -248 0z" fill="#f2c230"' + O3 + '/>' +
      [70, 120, 170, 210].map(function (x) { return '<circle cx="' + x + '" cy="166" r="7" fill="#7fd0f0" stroke="#2b2a3a" stroke-width="3"/><circle cx="' + (x - 2) + '" cy="164" r="2" fill="#fff"/>'; }).join('') +
      // stern lantern
      '<path d="M34 120 l0 26" stroke="#3a3550" stroke-width="3"/><rect x="27" y="104" width="14" height="20" rx="3" fill="#3a3550" stroke="#2b2a3a" stroke-width="2.5"/><rect x="30" y="108" width="8" height="12" rx="2" fill="' + glow + '"/>' + fig +
      '</svg>';
  }
  function star(cx, cy, r, col, outline) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1));
    }
    return '<polygon points="' + p.join(' ') + '" fill="' + col + '"' + (outline ? ' stroke="#2b2a3a" stroke-width="2.5" stroke-linejoin="round"' : '') + '/>';
  }

  function lighthouse(x, y, s, lit) {
    s = s || 1;
    var g = '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">';
    if (lit) g += '<path d="M0 -76 L-120 -110 L-120 -40z" fill="#fff6b0" opacity=".45" class="glow"/><path d="M0 -76 L120 -110 L120 -40z" fill="#fff6b0" opacity=".45" class="glow"/>' +
      '<circle cx="0" cy="-76" r="26" fill="#fff3a0" opacity=".6" class="glow"/>';
    g += '<path d="M-16 0 L-11 -64 h22 L16 0z" fill="#fff"/>' +
      '<path d="M-15 -14 h30 l-1 -12 h-28z M-13 -40 h26 l-1 -12 h-24z" fill="#e5533d"/>' +
      '<rect x="-14" y="-84" width="28" height="20" rx="3" fill="' + (lit ? '#ffe46b' : '#5d6475') + '"/>' +
      '<path d="M-17 -84 h34 l-17 -16z" fill="#22335e"/><rect x="-18" y="-66" width="36" height="4" fill="#22335e"/>';
    return g + '</g>';
  }

  function palm(x, y, s) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">' +
      '<path d="M0 0 q-4 -30 6 -56" stroke="#8d5730" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M6 -56 q-26 -10 -38 6 q20 -4 38 -6z M6 -56 q24 -14 38 2 q-20 -4 -38 -2z M6 -56 q-10 -24 -30 -26 q14 10 30 26z M6 -56 q14 -24 34 -22 q-18 8 -34 22z" fill="#2fa35a"/>' +
      '</g>';
  }

  /* Map island marker. kind gives each island its own landmark. */
  function mapIsland(o) {
    var x = o.x, y = o.y, lit = o.lit, locked = o.locked;
    var g = '<g class="map-island ol" data-island="' + o.id + '" transform="translate(' + x + ',' + y + ')">';
    g += '<ellipse cx="0" cy="20" rx="88" ry="26" fill="#7fd0f0" opacity=".5"/>';
    g += '<g class="isle-body"><ellipse cx="0" cy="10" rx="78" ry="26" fill="#f7e3b5"/><path d="M-60 6 q30 -50 70 -40 q40 8 50 40z" fill="#5fbf5f"/>';
    g += palm(-46, 4, .7) + palm(50, 6, .6);
    g += landmark(o.kind);
    g += lighthouse(18, 4, .55, lit);
    g += '</g>';
    if (locked) g += '<ellipse cx="0" cy="-10" rx="100" ry="58" fill="#e8eef3" opacity=".82"/><ellipse cx="-30" cy="-20" rx="50" ry="30" fill="#f5f8fb" opacity=".7"/>';
    g += '<text class="lbl" x="0" y="58" text-anchor="middle">' + o.name + '</text>';
    if (o.badge) g += '<g transform="translate(64,-46)"><circle r="18" fill="#ffc23c" stroke="#fff" stroke-width="3"/><text y="7" text-anchor="middle" font-weight="800" font-size="20" fill="#2b2a3a">' + o.badge + '</text></g>';
    return g + '</g>';
  }
  function landmark(kind) {
    switch (kind) {
      case 'bakery': return '<rect x="-34" y="-30" width="34" height="26" fill="#ffefd2"/><path d="M-38 -30 l21 -16 l21 16z" fill="#e5533d"/><circle cx="-17" cy="-18" r="6" fill="#e8b25a"/>';
      case 'kite': return '<path d="M-26 -60 l10 14 l-10 14 l-10 -14z" fill="#e35d8f"/><path d="M-26 -32 q4 12 -4 24" stroke="#555" fill="none"/>';
      case 'weather': return '<rect x="-32" y="-34" width="6" height="30" fill="#8d8d8d"/><path d="M-29 -34 l14 -6 l-14 -4z" fill="#e5533d"/><circle cx="-12" cy="-50" r="10" fill="#fff"/><circle cx="-2" cy="-48" r="12" fill="#fff"/>';
      case 'dunes': return '<path d="M-56 0 q20 -26 40 0 q20 -20 40 0z" fill="#e8c987"/>';
      case 'share': return '<rect x="-36" y="-22" width="14" height="14" fill="#c98a3a"/><rect x="-20" y="-22" width="14" height="14" fill="#c98a3a"/><rect x="-28" y="-36" width="14" height="14" fill="#e0a85a"/>';
      case 'basket': return '<path d="M-36 -24 h28 l-4 18 h-20z" fill="#c98a3a"/><path d="M-30 -24 q8 -14 16 0" stroke="#8d5730" stroke-width="3" fill="none"/>';
      case 'compass': return '<circle cx="-20" cy="-22" r="14" fill="#fff" stroke="#22335e" stroke-width="3"/><path d="M-20 -34 l4 12 l-4 12 l-4 -12z" fill="#e5533d"/>';
    }
    return '';
  }

  function icon(kind, size, color) {
    size = size || 46; color = color || null;
    var v = '<svg viewBox="0 0 60 60" width="' + size + '" height="' + size + '" aria-hidden="true">';
    switch (kind) {
      case 'fish': v += '<path d="M8 30 q18 -20 36 0 q-18 20 -36 0z" fill="' + (color || '#3b8fd9') + '"/><path d="M44 30 l12 -10 v20z" fill="' + (color || '#3b8fd9') + '"/><circle cx="18" cy="27" r="3" fill="#fff"/>'; break;
      case 'shell': v += '<path d="M30 52 l-20 -24 q20 -26 40 0z" fill="' + (color || '#ffb3a7') + '"/><path d="M30 52 l-10 -30 M30 52 v-32 M30 52 l10 -30" stroke="#fff" stroke-width="2"/>'; break;
      case 'apple': v += '<circle cx="24" cy="34" r="16" fill="' + (color || '#e5533d') + '"/><circle cx="36" cy="34" r="16" fill="' + (color || '#e5533d') + '"/><path d="M30 18 q2 -8 8 -10" stroke="#5b3a1e" stroke-width="3" fill="none"/><path d="M32 14 q10 -6 14 2 q-8 4 -14 -2z" fill="#2fa35a"/>'; break;
      case 'pie': v += '<ellipse cx="30" cy="36" rx="24" ry="12" fill="#c98a3a"/><ellipse cx="30" cy="32" rx="22" ry="10" fill="' + (color || '#e8b25a') + '"/><path d="M14 30 l8 4 M26 26 l4 8 M38 27 l2 8" stroke="#a8692a" stroke-width="2"/>'; break;
      case 'loaf': v += '<path d="M8 40 q0 -20 22 -20 q22 0 22 20z" fill="' + (color || '#d49a4a') + '"/><path d="M20 26 l4 8 M30 24 l2 8 M40 26 l-2 8" stroke="#a8692a" stroke-width="2"/>'; break;
      case 'shellcoin': v += '<circle cx="30" cy="30" r="22" fill="#ffd1c4" stroke="#f08a73" stroke-width="3"/><path d="M30 46 l-12 -14 q12 -16 24 0z" fill="#ff9f8a"/>'; break;
      case 'marble': v += '<circle cx="30" cy="30" r="18" fill="' + (color || '#e5533d') + '"/><circle cx="24" cy="24" r="5" fill="#fff" opacity=".6"/>'; break;
      case 'lighthouse': v += '<g transform="translate(30,56) scale(.6)">' + lighthouse(0, 0, 1, true).replace(/^<g[^>]*>/, '').replace(/<\/g>$/, '') + '</g>'; break;
      case 'joystick': v += '<rect x="10" y="36" width="40" height="16" rx="6" fill="#5b6fe0"/><rect x="27" y="14" width="6" height="24" fill="#555"/><circle cx="30" cy="14" r="9" fill="#e5533d"/>'; break;
      case 'book': v += '<path d="M8 14 q12 -4 22 4 v34 q-10 -8 -22 -4z" fill="#e5533d"/><path d="M52 14 q-12 -4 -22 4 v34 q10 -8 22 -4z" fill="#c4472c"/>'; break;
      case 'clock': v += '<circle cx="30" cy="30" r="22" fill="#fff" stroke="#2b2a3a" stroke-width="3"/><path d="M30 30 v-14 M30 30 h10" stroke="#e5533d" stroke-width="4" stroke-linecap="round"/>'; break;
      case 'ruler': v += '<rect x="6" y="22" width="48" height="16" rx="3" fill="#f2c230" stroke="#2b2a3a" stroke-width="2.5"/><path d="M14 22 v6 M22 22 v9 M30 22 v6 M38 22 v9 M46 22 v6" stroke="#2b2a3a" stroke-width="2"/>'; break;
      case 'chart': v += '<circle cx="30" cy="30" r="22" fill="#3b8fd9" stroke="#2b2a3a" stroke-width="3"/><path d="M30 30 v-22 a22 22 0 0 1 22 22z" fill="#ffc23c" stroke="#2b2a3a" stroke-width="2"/><path d="M30 30 h22 a22 22 0 0 1 -22 22z" fill="#e5533d" stroke="#2b2a3a" stroke-width="2"/>'; break;
      case 'duck': v += '<ellipse cx="30" cy="38" rx="20" ry="13" fill="' + (color || '#ffd23f') + '" stroke="#2b2a3a" stroke-width="2.5"/><circle cx="42" cy="22" r="10" fill="' + (color || '#ffd23f') + '" stroke="#2b2a3a" stroke-width="2.5"/><path d="M51 22 l8 2 l-8 3z" fill="#ff8a3d" stroke="#2b2a3a" stroke-width="1.5"/><circle cx="44" cy="20" r="2" fill="#2b2a3a"/><path d="M18 36 q8 -6 16 0" stroke="#2b2a3a" stroke-width="2" fill="none"/>'; break;
      case 'crate': v += '<rect x="10" y="14" width="40" height="34" rx="3" fill="' + (color || '#c98a3a') + '" stroke="#2b2a3a" stroke-width="2.5"/><path d="M10 26 h40 M10 38 h40 M22 14 v34 M38 14 v34" stroke="#8d5730" stroke-width="2"/>'; break;
      case 'gull': v += '<ellipse cx="30" cy="34" rx="18" ry="11" fill="' + (color || '#ffffff') + '" stroke="#2b2a3a" stroke-width="2.5"/><circle cx="44" cy="24" r="8" fill="' + (color || '#ffffff') + '" stroke="#2b2a3a" stroke-width="2.5"/><path d="M51 24 l7 2 l-7 2z" fill="#f2c230"/><path d="M20 30 q8 -12 18 -2" fill="#c9d1db" stroke="#2b2a3a" stroke-width="2"/><circle cx="46" cy="22" r="1.8" fill="#2b2a3a"/>'; break;
      case 'star': v += star(30, 30, 22, color || '#ffd23f', true); break;
      case 'boat': v += '<path d="M8 36 h44 l-8 14 h-28z" fill="' + (color || '#e5533d') + '" stroke="#2b2a3a" stroke-width="2.5"/><path d="M30 8 v28 M31 10 q14 8 12 24 h-12z" fill="#fff" stroke="#2b2a3a" stroke-width="2.5"/>'; break;
      case 'egg': v += '<ellipse cx="30" cy="32" rx="17" ry="22" fill="#fff6e6" stroke="#2b2a3a" stroke-width="3"/><circle cx="24" cy="24" r="3" fill="#7fc8a9"/><circle cx="36" cy="34" r="4" fill="#ffb3a7"/><circle cx="27" cy="44" r="3" fill="#9fd0ff"/>'; break;
      case 'heart': v += '<path d="M30 52 C8 36 6 18 18 12 C26 8 30 16 30 20 C30 16 34 8 42 12 C54 18 52 36 30 52z" fill="' + (color || '#e5533d') + '" stroke="#2b2a3a" stroke-width="3" stroke-linejoin="round"/>'; break;
      case 'anchor': v += '<circle cx="30" cy="12" r="6" fill="none" stroke="#22335e" stroke-width="4"/><path d="M30 18 v34 M18 26 h24 M12 38 q4 14 18 14 q14 0 18 -14" stroke="#22335e" stroke-width="4" fill="none" stroke-linecap="round"/>'; break;
    }
    return v + '</svg>';
  }

  /* Big island scene (Slice Isle). restored = lighthouse relit: fog gone, villagers and flowers back. */
  function sliceIsleScene(restored, id) {
    var s = '<svg viewBox="0 0 800 420" width="100%" aria-hidden="true" style="max-height:420px">' +
      '<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (restored ? '#ffd9a8' : '#c9d6df') + '"/><stop offset="1" stop-color="' + (restored ? '#bfe9ff' : '#e1e8ee') + '"/></linearGradient></defs>' +
      '<rect width="800" height="420" fill="url(#skyg)"/>' +
      (restored ? '<circle cx="680" cy="80" r="44" fill="#ffd54a"/>' : '') +
      '<rect y="270" width="800" height="150" fill="' + (restored ? '#3aa3d8' : '#7a9bb0') + '"/>' +
      '<path d="M0 290 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>' +
      '<ellipse cx="400" cy="300" rx="360" ry="70" fill="#f7e3b5"/>' +
      '<path d="M90 290 q120 -140 330 -120 q170 20 290 120z" fill="' + (restored ? '#5fbf5f' : '#8aa38a') + '"/>' +
      palm(95, 292, 1.3) + palm(690, 296, 1.1) +
      (id === 'P15' ? '<g transform="translate(160,150) scale(1.6)">' + kiteShop(0, 0) + '</g>' : id === 'P16' ? '<g transform="translate(170,168) scale(1.4)">' + weatherStation(0, 0) + '</g>' : id === 'P17' ? '<g transform="translate(150,175) scale(1.4)">' + caravanTent(0, 0) + '</g>' :
      '<g transform="translate(160,180)"><rect x="0" y="20" width="150" height="90" fill="#ffefd2"/><path d="M-12 22 l87 -50 l87 50z" fill="#e5533d"/>' +
      '<rect x="56" y="58" width="36" height="52" rx="4" fill="#a0612b"/><rect x="14" y="40" width="30" height="24" fill="#bfe9ff"/><rect x="106" y="40" width="30" height="24" fill="#bfe9ff"/>' +
      '<rect x="30" y="-4" width="90" height="22" rx="6" fill="#fff"/><text x="75" y="12" text-anchor="middle" font-size="14" font-weight="800" fill="#c2367a">PANADERÍA</text></g>') +
      lighthouse(560, 270, 1.9, restored) +
      '<path d="M690 330 l40 -6 l-10 16z" fill="#a0612b"/>';
    if (restored) {
      s += '<g>' + [120, 210, 440, 470, 620].map(function (fx, i) {
        var c = ['#e35d8f', '#ffd54a', '#ff7a59', '#b48ef0', '#ffffff'][i];
        return '<g transform="translate(' + fx + ',' + (300 + (i % 2) * 14) + ')"><circle r="6" fill="' + c + '"/><circle cx="10" cy="4" r="5" fill="' + c + '"/><circle cx="-8" cy="5" r="5" fill="' + c + '"/></g>';
      }).join('') + '</g>';
      s += '<g transform="translate(40,318) scale(.45)">' + ship({ sail: 'berry', flag: 'heart' }, 200).replace(/<svg[^>]*>/, '').replace('</svg>', '') + '</g>';
      s += '<g transform="translate(470,250) scale(.32)">' + keeperBody('#3b8fd9') + '</g><g transform="translate(330,252) scale(.3)">' + keeperBody('#f2a01e') + '</g>';
    } else {
      s += '<g class="fog"><ellipse cx="300" cy="200" rx="360" ry="120" fill="#eef2f5" opacity=".75"/><ellipse cx="620" cy="160" rx="240" ry="100" fill="#f4f7f9" opacity=".7"/>' +
        '<ellipse cx="420" cy="300" rx="420" ry="70" fill="#eef2f5" opacity=".55"/></g>';
    }
    return s + '</svg>';
  }
  function keeperBody(col) {
    return '<circle cx="100" cy="60" r="34" fill="#dda271"/><rect x="66" y="96" width="68" height="90" rx="20" fill="' + col + '"/>' +
      '<rect x="72" y="186" width="22" height="40" fill="#26385e"/><rect x="106" y="186" width="22" height="40" fill="#26385e"/>' +
      '<circle cx="88" cy="58" r="4" fill="#222"/><circle cx="112" cy="58" r="4" fill="#222"/><path d="M88 74 q12 10 24 0" stroke="#6b2e22" stroke-width="3" fill="none"/>';
  }


  /* ---- outlined pieces for the island level map ---- */
  var OL = '#2b2a3a';
  function rock(x, y, s) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')"><path d="M-30 10 q-4 -26 14 -34 q10 -14 26 -4 q18 2 20 22 q4 12 -6 16z" fill="#9aa5b4" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M-14 -18 q10 -6 20 2" stroke="#c9d1db" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-34 12 q36 8 64 0" stroke="#bdeeff" stroke-width="3" fill="none" opacity=".8"/></g>';
  }
  function islet(rx, ry, green) {
    return '<ellipse cx="0" cy="10" rx="' + (rx + 10) + '" ry="' + (ry + 8) + '" fill="#8fe0ff" opacity=".55"/>' +
      '<ellipse cx="0" cy="6" rx="' + rx + '" ry="' + ry + '" fill="#f4d58d" stroke="' + OL + '" stroke-width="3"/>' +
      '<ellipse cx="0" cy="0" rx="' + (rx * .72) + '" ry="' + (ry * .62) + '" fill="' + (green ? '#7ccf5a' : '#a9b7a0') + '" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M' + (-rx * .4) + ' ' + (-ry * .2) + ' q6 -8 12 0 M' + (rx * .25) + ' ' + (-ry * .1) + ' q5 -7 10 0" stroke="' + (green ? '#4fa63a' : '#8a9682') + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }
  function lanternPost(lit, anchor) {
    var g = '<rect x="-3" y="-44" width="6" height="44" rx="2" fill="#6b4423" stroke="' + OL + '" stroke-width="2.5"/>';
    if (lit) g += '<circle cx="0" cy="-56" r="22" fill="#fff4a8" opacity=".7" class="glow"/>';
    g += '<path d="M-10 -66 h20 l-3 -6 h-14z" fill="#22335e" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<rect x="-10" y="-66" width="20" height="22" rx="4" fill="' + (lit ? '#ffd23f' : '#5d6475') + '" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<path d="M-10 -55 h20 M0 -66 v22" stroke="' + OL + '" stroke-width="1.5" opacity=".5"/><rect x="-12" y="-46" width="24" height="4" rx="2" fill="#22335e"/>';
    if (anchor) g += '<g transform="translate(-26,-14) scale(.5)">' + icon('anchor', 40).replace(/<\/?svg[^>]*>/g, '') + '</g>';
    return g;
  }
  function compassPost(done) {
    return '<g transform="translate(0,-34)"><circle r="22" fill="#fff" stroke="' + OL + '" stroke-width="3"/><circle r="15" fill="none" stroke="#c9d1db" stroke-width="2"/>' +
      '<path d="M0 -16 l5 16 l-5 4 l-5 -4z" fill="#e5533d" stroke="' + OL + '" stroke-width="1.5"/><path d="M0 16 l5 -16 l-5 -4 l-5 4z" fill="#22335e"/>' +
      (done ? '<circle r="26" fill="none" stroke="#ffc23c" stroke-width="4"/>' : '') + '</g>';
  }
  function lighthouseO(x, y, s, lit) {
    var g = '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">';
    if (lit) g += '<path d="M0 -92 L-110 -130 L-110 -56z" fill="#fff6b0" opacity=".5" class="glow"/><path d="M0 -92 L110 -130 L110 -56z" fill="#fff6b0" opacity=".5" class="glow"/><circle cx="0" cy="-92" r="30" fill="#fff3a0" opacity=".7" class="glow"/>';
    g += '<path d="M-20 0 L-13 -78 h26 L20 0z" fill="#fff" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M-18.6 -16 h37.2 l-1.2 -14 h-34.8z M-16 -46 h32 l-1.1 -14 h-29.8z" fill="#e5533d"/>' +
      '<rect x="-17" y="-102" width="34" height="24" rx="4" fill="' + (lit ? '#ffe46b' : '#5d6475') + '" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M-21 -102 h42 l-21 -20z" fill="#22335e" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/><rect x="-22" y="-80" width="44" height="6" rx="2" fill="#22335e" stroke="' + OL + '" stroke-width="2"/>' +
      '<rect x="-6" y="-14" width="12" height="14" rx="5" fill="#a0612b" stroke="' + OL + '" stroke-width="2"/>';
    return g + '</g>';
  }
  function lighthouseIcon(size) { return '<svg viewBox="-60 -140 120 150" width="' + size + '" height="' + size * 1.25 + '">' + lighthouseO(0, 0, 1, true) + '</svg>'; }
  function bakery(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')"><rect x="0" y="22" width="80" height="54" fill="#ffefd2" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M-8 24 l48 -30 l48 30z" fill="#e5533d" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="44" width="20" height="32" rx="3" fill="#a0612b" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<rect x="8" y="34" width="16" height="14" fill="#bfe9ff" stroke="' + OL + '" stroke-width="2"/><rect x="56" y="34" width="16" height="14" fill="#bfe9ff" stroke="' + OL + '" stroke-width="2"/>' +
      '<rect x="12" y="8" width="56" height="13" rx="4" fill="#fff" stroke="' + OL + '" stroke-width="2"/><text x="40" y="18" text-anchor="middle" font-size="9" font-weight="800" fill="#c2367a">PANADERÍA</text></g>';
  }

  function kiteShop(x, y) { // Tío Tomás's kite shop, with kites flying over it
    function kite(kx, ky, c1, c2, r) { return '<g transform="translate(' + kx + ',' + ky + ') rotate(' + r + ')"><path d="M0 -18 l13 18 l-13 22 l-13 -22z" fill="' + c1 + '" stroke="' + OL + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -18 l13 18 h-13z M0 0 h-13 l13 22z" fill="' + c2 + '"/>' +
      '<path d="M0 22 q-6 10 2 18 q6 8 -2 16" stroke="' + OL + '" stroke-width="2" fill="none"/></g>'; }
    return '<g transform="translate(' + x + ',' + y + ')"><path d="M40 20 Q30 -30 6 -58 M40 20 Q70 -40 98 -70" stroke="#666" stroke-width="1.5" fill="none"/>' +
      kite(6, -62, '#ffd23f', '#e35d8f', -12) + kite(98, -74, '#9fd0ff', '#7fc8a9', 14) +
      '<rect x="0" y="22" width="80" height="54" fill="#d9f0ff" stroke="' + OL + '" stroke-width="3"/>' +
      '<path d="M-8 24 l48 -30 l48 30z" fill="#3b8fd9" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="44" width="20" height="32" rx="3" fill="#a0612b" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<rect x="8" y="34" width="16" height="14" fill="#fff6c4" stroke="' + OL + '" stroke-width="2"/><rect x="56" y="34" width="16" height="14" fill="#fff6c4" stroke="' + OL + '" stroke-width="2"/>' +
      '<rect x="12" y="8" width="56" height="13" rx="4" fill="#fff" stroke="' + OL + '" stroke-width="2"/><text x="40" y="18" text-anchor="middle" font-size="9" font-weight="800" fill="#2a6fdb">COMETAS</text></g>';
  }

  function caravanTent(x, y) { // Don Omar's caravan tent with a camel and a palm by the oasis
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<path d="M-6 70 L40 -6 L86 70z" fill="#f2b56b" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/><path d="M40 -6 L40 70" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<path d="M8 70 L40 18 L72 70z" fill="#e5793d" stroke="' + OL + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M28 70 L40 40 L52 70z" fill="#5b3a1e"/>' +
      '<path d="M40 -6 v-14 l16 6 l-16 6" fill="#3b8fd9" stroke="' + OL + '" stroke-width="2"/>' +
      // camel
      '<g transform="translate(96,40)"><path d="M0 22 q4 -22 18 -20 q8 -14 16 0 q8 -12 14 2 l8 -12 q6 -4 10 2 l-4 6 l-8 4 l-6 18z" fill="#d9a066" stroke="' + OL + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M6 22 v18 M16 22 v18 M38 22 v18 M48 22 v18" stroke="' + OL + '" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="-4" r="1.8" fill="' + OL + '"/></g>' +
      '<rect x="-6" y="72" width="92" height="14" rx="4" fill="#fff" stroke="' + OL + '" stroke-width="2"/><text x="40" y="83" text-anchor="middle" font-size="9" font-weight="800" fill="#e5793d">CARAVANA</text></g>';
  }

  function weatherStation(x, y) { // Doña Luz's weather station: a round tower with a wind vane, wind cups and a rain gauge
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<path d="M40 -22 V-62" stroke="' + OL + '" stroke-width="3"/><path d="M40 -62 l18 -4 l-4 8z M40 -62 l-16 0" fill="#e5533d" stroke="' + OL + '" stroke-width="2.5"/>' +
      '<path d="M28 -44 h24" stroke="' + OL + '" stroke-width="2.5"/><circle cx="26" cy="-44" r="5" fill="#ffd23f" stroke="' + OL + '" stroke-width="2"/><circle cx="54" cy="-44" r="5" fill="#ffd23f" stroke="' + OL + '" stroke-width="2"/>' +
      '<rect x="14" y="-22" width="52" height="98" rx="4" fill="#ffffff" stroke="' + OL + '" stroke-width="3"/><path d="M14 0 h52 M14 30 h52" stroke="#8a5cc7" stroke-width="7"/>' +
      '<path d="M6 -20 h68 l-8 -10 h-52z" fill="#8a5cc7" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="30" y="48" width="20" height="28" rx="3" fill="#a0612b" stroke="' + OL + '" stroke-width="2.5"/><circle cx="40" cy="14" r="7" fill="#fff6c4" stroke="' + OL + '" stroke-width="2"/>' +
      '<rect x="80" y="40" width="12" height="34" rx="2" fill="#bfe9ff" stroke="' + OL + '" stroke-width="2.5"/><rect x="82" y="56" width="8" height="16" fill="#3b8fd9"/>' +
      '<rect x="-6" y="76" width="92" height="12" rx="4" fill="#fff" stroke="' + OL + '" stroke-width="2"/><text x="40" y="86" text-anchor="middle" font-size="9" font-weight="800" fill="#8a5cc7">EL TIEMPO</text></g>';
  }

  /* ---- big painted backgrounds (outlined cartoon style) ---- */
  function cloud(x, y, s) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-60 20 q-30 0 -24 -26 q8 -24 34 -16 q10 -30 44 -24 q30 4 30 30 q30 -6 34 20 q2 18 -20 16z" fill="#fff" stroke="#9cc9e6" stroke-width="3"/></g>';
  }
  function palmBig(x, y, s, flip) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (flip ? -s : s) + ',' + s + ')">' +
      '<path d="M0 0 q-10 -120 40 -250 l18 6 q-44 120 -34 244z" fill="#a8693a" stroke="' + OL + '" stroke-width="4"/>' +
      [ -60, -36, -12 ].map(function (yy, i) { return '<path d="M' + (8 + i * 8) + ' ' + (yy - 20) + ' q14 -4 20 4" stroke="#7a4a26" stroke-width="3" fill="none"/>'; }).join('') +
      '<g transform="translate(50,-248)">' +
      '<path d="M0 0 q-70 -40 -130 10 q60 -20 130 -10z" fill="#3fae5a" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 0 q60 -60 140 -20 q-70 -10 -140 20z" fill="#2f9e55" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 0 q-30 -80 -100 -80 q50 20 100 80z" fill="#4cc06a" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 0 q40 -90 110 -90 q-60 30 -110 90z" fill="#3fae5a" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 0 q-90 10 -120 80 q40 -60 120 -80z" fill="#2f9e55" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 0 q90 0 120 70 q-40 -50 -120 -70z" fill="#4cc06a" stroke="' + OL + '" stroke-width="4"/>' +
      '<circle cx="-8" cy="10" r="10" fill="#7a4a26" stroke="' + OL + '" stroke-width="3"/><circle cx="10" cy="12" r="10" fill="#8d5730" stroke="' + OL + '" stroke-width="3"/></g></g>';
  }
  function stack(x, y, s, col) {
    col = col || '#a7b0bf';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><path d="M-50 0 l6 -150 q2 -30 34 -34 q38 -2 46 30 l14 154z" fill="' + col + '" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M-30 -150 q4 -16 20 -18 M-24 -100 l40 0 M-34 -50 l60 0" stroke="#d9dee6" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M-48 -184 q20 -12 50 -6 q-10 -14 -40 -8z" fill="#5fbf5f" stroke="' + OL + '" stroke-width="3"/>' +
      '<ellipse cx="0" cy="2" rx="70" ry="10" fill="#e9f8ff" opacity=".7"/></g>';
  }
  function starfish(x, y, s, col) {
    var p = []; for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, r = i % 2 ? 7 : 18; p.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); }
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><polygon points="' + p.join(' ') + '" fill="' + (col || '#ff8a3d') + '" stroke="' + OL + '" stroke-width="3" stroke-linejoin="round"/></g>';
  }
  function nightSky() {
    var v = '<svg class="bgscene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="1350" cy="150" r="60" fill="#fff6c8" stroke="#ffe08a" stroke-width="5"/><circle cx="1375" cy="135" r="55" fill="#2a2450"/>';
    for (var i = 0; i < 70; i++) { var x = (i * 389) % 1580 + 10, y = (i * 211) % 620 + 10, r = 1 + (i % 3); v += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" class="' + (i % 4 ? '' : 'glow') + '"/>'; }
    v += '<path d="M0 760 q400 -60 800 0 t800 0 v140 h-1600z" fill="#2a2450"/><path d="M0 800 q400 -50 800 0 t800 0 v100 h-1600z" fill="#211c42"/>';
    return v + '</svg>';
  }
  function titleScene() {
    var v = '<svg class="bgscene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fb4f0"/><stop offset=".6" stop-color="#9fe0ff"/><stop offset="1" stop-color="#d8f4ff"/></linearGradient>' +
      '<linearGradient id="tsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1fb7d4"/><stop offset="1" stop-color="#2ad0c9"/></linearGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#tsky)"/>' +
      '<circle cx="1320" cy="140" r="70" fill="#ffe46b" stroke="#ffc23c" stroke-width="6"/><circle cx="1320" cy="140" r="110" fill="#fff3a0" opacity=".35"/>' +
      '<g class="drift">' + cloud(260, 120, 1.1) + cloud(820, 90, .8) + cloud(1120, 230, .7) + '</g>' +
      '<rect y="430" width="1600" height="280" fill="url(#tsea)"/>' +
      '<path d="M0 430 h1600" stroke="#0e8fb0" stroke-width="4"/>' +
      stack(980, 520, .85) + stack(1180, 500, .6, '#b9b1a6') + stack(420, 510, .55, '#9ea8b8') +
      '<g transform="translate(700,470)">' + islet(80, 18, true) + lighthouseO(10, 4, .55, true) + '</g>';
    for (var w = 0; w < 30; w++) { var wx = (w * 211) % 1560 + 20, wy = 450 + (w * 67) % 220; v += '<path d="M' + wx + ' ' + wy + ' q12 -8 24 0 t24 0" stroke="#bff6ff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>'; }
    v += '<path d="M0 690 q200 -40 420 -10 q260 30 520 -6 q300 -40 660 20 v206 h-1600z" fill="#f6dc9c" stroke="' + OL + '" stroke-width="4"/>' +
      '<path d="M0 700 q200 -40 420 -10 q260 30 520 -6 q300 -40 660 20" stroke="#fff" stroke-width="10" fill="none" opacity=".7"/>' +
      '<g fill="#e8c27a"><ellipse cx="300" cy="800" rx="40" ry="8"/><ellipse cx="900" cy="830" rx="60" ry="9"/><ellipse cx="1300" cy="790" rx="50" ry="8"/></g>' +
      starfish(520, 790, 1.2) + starfish(1380, 840, 1, '#ff6f91') + '<g transform="translate(1180,800)">' + icon('shell', 60, '#ffb3a7').replace('<svg', '<svg x="-30" y="-30"') + '</g>' +
      '<g transform="translate(150,860) scale(1.1)"><ellipse cx="0" cy="0" rx="60" ry="22" fill="#3fae5a" stroke="' + OL + '" stroke-width="4"/><path d="M-40 -6 q-10 -30 4 -40 M-10 -14 q0 -36 16 -44 M24 -8 q10 -30 30 -34" stroke="#2f9e55" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
      palmBig(90, 900, 1.25) + palmBig(1520, 900, 1.15, true) +
      '</svg>';
    return v;
  }

  return { titleScene: titleScene, nightSky: nightSky, cloud: cloud, stack: stack, starfish: starfish, palmBig: palmBig, rock: rock, islet: islet, lanternPost: lanternPost, compassPost: compassPost, lighthouseO: lighthouseO, lighthouseIcon: lighthouseIcon, bakery: bakery, kiteShop: kiteShop, weatherStation: weatherStation, caravanTent: caravanTent,
    PBODY: PBODY, PWING: PWING, PBEAK: PBEAK, PWEAR: PWEAR, captain: captain, parrot: parrot, keeperRosa: keeperRosa, ship: ship, lighthouse: lighthouse, palm: palm, mapIsland: mapIsland,
    icon: icon, star: star, sliceIsleScene: sliceIsleScene,
    SKINS: SKINS, HAIRCOLORS: HAIRCOLORS, OUTFITS: OUTFITS, HAIRS: HAIRS, HATS: HATS, SAILS: SAILS, GLOWS: GLOWS };
})();
