/* Pictures for metric measurement (Weather Rock) and early addition (Fish Market):
   a Celsius thermometer, a balance scale, a centimeter ruler, a coordinate graph, dominoes and vertical addition. */
(function () {
  var O = '#2b2a3a';
  /* Celsius thermometer from 0° to 40°: a tick every degree-5, a number every 10. */
  function thermometer(c, size, o) {
    o = o || {}; var h = size || 260, lo = o.lo === undefined ? 0 : o.lo, hi = o.hi === undefined ? 40 : o.hi, top = 24, bot = 222, per = (bot - top) / (hi - lo);
    var y = function (t) { return bot - (t - lo) * per; };
    var s = '<svg class="thermo" viewBox="0 0 120 270" width="' + (h * 120 / 270) + '" height="' + h + '" aria-hidden="true">' +
      '<rect x="44" y="10" width="32" height="226" rx="16" fill="#fff" stroke="' + O + '" stroke-width="3"/>' +
      '<rect x="54" y="' + y(c) + '" width="12" height="' + (236 - y(c)) + '" fill="#e5533d"/>' +
      '<circle cx="60" cy="244" r="19" fill="#e5533d" stroke="' + O + '" stroke-width="3"/><rect x="54" y="214" width="12" height="20" fill="#e5533d"/>';
    for (var t = lo; t <= hi; t += 5) {
      var big = t % 10 === 0;
      s += '<path d="M76 ' + y(t) + ' h' + (big ? 14 : 8) + '" stroke="' + O + '" stroke-width="' + (big ? 2.5 : 1.8) + '"/>';
      if (big) s += '<text x="94" y="' + (y(t) + 5) + '" font-size="14" font-weight="800" fill="' + O + '">' + t + '</text>';
    }
    if (o.mark !== undefined) s += '<path d="M40 ' + y(o.mark) + ' h-14" stroke="#3b8fd9" stroke-width="4" marker-end=""/><path d="M26 ' + (y(o.mark) - 6) + ' l10 6 l-10 6z" fill="#3b8fd9"/>';
    return s + '<text x="22" y="22" font-size="15" font-weight="800" fill="' + O + '">°C</text></svg>';
  }
  /* things to measure (emoji, so they read well on an iPad) */
  var THINGS = {
    paperclip: ['📎', 'a paper clip'], feather: ['🪶', 'a feather'], grape: ['🍇', 'a grape'], pencil: ['✏️', 'a pencil'], crayon: ['🖍️', 'a crayon'], key: ['🔑', 'a key'], coin: ['🪙', 'a coin'],
    watermelon: ['🍉', 'a watermelon'], bike: ['🚲', 'a bike'], dog: ['🐕', 'a big dog'], pumpkin: ['🎃', 'a pumpkin'], suitcase: ['🧳', 'a suitcase'], cat: ['🐈', 'a cat'],
    spoon: ['🥄', 'a spoon'], cup: ['☕', 'a cup'], bucket: ['🪣', 'a bucket'], bathtub: ['🛁', 'a bathtub'], pool: ['🏊', 'a swimming pool'], teapot: ['🫖', 'a teapot'], bottle: ['🧴', 'a small bottle'],
    apple: ['🍎', 'an apple'], book: ['📕', 'a book'], shoe: ['👟', 'a shoe'], door: ['🚪', 'a door'], tree: ['🌳', 'a tree'], bus: ['🚌', 'a school bus'], ant: ['🐜', 'an ant'], house: ['🏠', 'a house'],
    eraser: ['🧽', 'an eraser'], fish: ['🐟', 'a fish'], whale: ['🐋', 'a whale'], car: ['🚗', 'a car'], banana: ['🍌', 'a banana'], hammer: ['🔨', 'a hammer'], button: ['🔘', 'a button'], rock: ['🪨', 'a big rock']
  };
  function thing(k, size) { return '<span class="mthing" style="font-size:' + (size || 64) + 'px">' + THINGS[k][0] + '</span>'; }
  /* a balance scale: tilt -1 = left side down (left is heavier), 0 = even, 1 = right side down */
  function balance(left, right, tilt, size) {
    var w = size || 300, a = (tilt || 0) * 12, r = a * Math.PI / 180, dx = 92 * Math.cos(r), dy = 92 * Math.sin(r);
    var pan = function (x, y, item) { return '<g transform="translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')"><path d="M0 0 L-36 58 M0 0 L36 58" stroke="' + O + '" stroke-width="2" fill="none"/>' +
      '<foreignObject x="-36" y="10" width="72" height="50"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;font-size:38px;line-height:50px">' + item + '</div></foreignObject>' +
      '<path d="M-42 58 h84 q-6 22 -42 22 q-36 0 -42 -22z" fill="#ffd23f" stroke="' + O + '" stroke-width="3"/></g>'; };
    return '<svg class="balance" viewBox="0 0 300 210" width="' + w + '" height="' + (w * 210 / 300) + '" aria-hidden="true">' +
      '<path d="M150 50 V190" stroke="' + O + '" stroke-width="7" stroke-linecap="round"/><path d="M112 202 l38 -22 l38 22z" fill="#8d5730" stroke="' + O + '" stroke-width="3"/>' +
      '<path d="M' + (150 - dx).toFixed(1) + ' ' + (44 - dy).toFixed(1) + ' L' + (150 + dx).toFixed(1) + ' ' + (44 + dy).toFixed(1) + '" stroke="#8d5730" stroke-width="8" stroke-linecap="round"/>' +
      '<circle cx="150" cy="44" r="8" fill="#ffd23f" stroke="' + O + '" stroke-width="3"/>' +
      pan(150 - dx, 44 - dy, left) + pan(150 + dx, 44 + dy, right) + '</svg>';
  }
  /* a centimeter ruler with up to two lines above it. lines: [[length, color], ...] */
  function cmRuler(lines, o) {
    o = o || {}; var n = o.max || 15, u = 20, W = n * u + 30, rows = lines.length, H = 26 * rows + 52;
    var s = '<svg class="cmruler" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.min(o.width || 420, W * 1.25) + '" aria-hidden="true">';
    lines.forEach(function (l, i) { var y = 14 + i * 26; s += '<path d="M15 ' + y + ' H' + (15 + l[0] * u) + '" stroke="' + (l[1] || '#e5533d') + '" stroke-width="8" stroke-linecap="round"/>'; if (o.dash) s += '<path d="M' + (15 + l[0] * u) + ' ' + y + ' V' + (26 * rows + 4) + '" stroke="' + (l[1] || '#e5533d') + '" stroke-width="1.5" stroke-dasharray="3 3"/>'; });
    var ry = 26 * rows + 4;
    s += '<rect x="5" y="' + ry + '" width="' + (W - 10) + '" height="40" rx="3" fill="#ffe27a" stroke="' + O + '" stroke-width="2"/>';
    for (var i = 0; i <= n; i++) s += '<path d="M' + (15 + i * u) + ' ' + ry + ' v' + (i % 5 === 0 ? 16 : 11) + '" stroke="' + O + '" stroke-width="' + (i % 5 === 0 ? 2.2 : 1.5) + '"/><text x="' + (15 + i * u) + '" y="' + (ry + 32) + '" text-anchor="middle" font-size="10" font-weight="700">' + i + '</text>';
    return s + '<text x="' + (W - 12) + '" y="' + (ry + 14) + '" text-anchor="end" font-size="9" font-weight="800">cm</text></svg>';
  }
  /* a line with no ruler, and a 1-cm square to compare with (for estimating) */
  function cmEstimate(len, col) {
    var u = 20, W = Math.max(len, 4) * u + 40;
    return '<svg viewBox="0 0 ' + W + ' 90" width="' + Math.min(420, W * 1.25) + '" aria-hidden="true"><path d="M15 20 H' + (15 + len * u) + '" stroke="' + (col || '#3b8fd9') + '" stroke-width="9" stroke-linecap="round"/>' +
      '<rect x="15" y="50" width="' + u + '" height="' + u + '" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/><text x="' + (22 + u) + '" y="65" font-size="12" font-weight="800">= 1 cm</text></svg>';
  }
  /* a coordinate graph from 0 to n with things placed on points. pts: [{x, y, html}] */
  function coordGrid(pts, o) {
    o = o || {}; var n = o.n || 5, u = 44, P = 36, TOP = 40, W = P + n * u + 24, H = n * u + 36 + TOP;
    var s = '<svg class="coord" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.min(o.width || 330, W * 1.15) + '" aria-hidden="true">';
    var X = function (x) { return P + x * u; }, Y = function (y) { return TOP + (n - y) * u; };
    for (var i = 0; i <= n; i++) s += '<path d="M' + X(i) + ' ' + Y(0) + ' V' + Y(n) + ' M' + X(0) + ' ' + Y(i) + ' H' + X(n) + '" stroke="#c9d6e3" stroke-width="1.5"/>' +
      '<text x="' + X(i) + '" y="' + (Y(0) + 20) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#e5533d">' + i + '</text><text x="' + (P - 12) + '" y="' + (Y(i) + 5) + '" text-anchor="end" font-size="14" font-weight="800" fill="#3b6fd9">' + i + '</text>';
    s += '<path d="M' + X(0) + ' ' + Y(n) + ' V' + Y(0) + ' H' + X(n) + '" stroke="' + O + '" stroke-width="3" fill="none"/>';
    if (o.path) s += '<path d="M' + X(0) + ' ' + Y(0) + ' H' + X(o.path[0]) + ' V' + Y(o.path[1]) + '" stroke="#36b37e" stroke-width="4" stroke-dasharray="7 5" fill="none"/>';
    (pts || []).forEach(function (p) { s += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="5" fill="' + O + '"/>' + (p.html ? '<foreignObject x="' + (X(p.x) - 18) + '" y="' + (Y(p.y) - 38) + '" width="36" height="36"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:26px;text-align:center;line-height:36px">' + p.html + '</div></foreignObject>' : ''); });
    return s + '</svg>';
  }
  /* a domino with pips; a vertical addition problem */
  var PIPS = { 0: [], 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]] };
  function domino(a, b, size, flat) {
    var w = size || 80, half = function (n, ox, oy) { return PIPS[n].map(function (p) { return '<circle cx="' + (ox + 12 + p[0] * 13) + '" cy="' + (oy + 12 + p[1] * 13) + '" r="5" fill="' + O + '"/>'; }).join(''); };
    if (flat) return '<svg viewBox="0 0 104 54" width="' + (w * 104 / 54) + '" height="' + w + '" aria-hidden="true"><rect x="2" y="2" width="100" height="50" rx="8" fill="#fff" stroke="' + O + '" stroke-width="3"/><path d="M52 6 V48" stroke="' + O + '" stroke-width="2.5"/>' + half(a, 6, 2) + half(b, 58, 2) + '</svg>';
    return '<svg viewBox="0 0 54 104" width="' + (w * 54 / 104) + '" height="' + w + '" aria-hidden="true"><rect x="2" y="2" width="50" height="100" rx="8" fill="#fff" stroke="' + O + '" stroke-width="3"/><path d="M6 52 H48" stroke="' + O + '" stroke-width="2.5"/>' + half(a, 2, 6) + half(b, 2, 58) + '</svg>';
  }
  function vertical(a, b, ans, op) {
    return '<div class="vprob"><span></span><span>' + a + '</span><span class="vop">' + (op || '+') + '</span><span>' + b + '</span><span class="vline"></span><span class="vline">' + (ans === undefined ? '?' : ans) + '</span></div>';
  }
  Models.thermometer = thermometer; Models.THINGS = THINGS; Models.thing = thing; Models.balance = balance; Models.cmRuler = cmRuler; Models.cmEstimate = cmEstimate;
  Models.coordGrid = coordGrid; Models.domino = domino; Models.vertical = vertical;

  /* base-ten blocks: thousand cubes, hundred flats, ten rods and ones, in groups left to right */
  function pvBlocks(th, h, t, o, size) {
    var u = 4.4, parts = [], x = 6, H = 70;
    function cube(x0) { var s = 10 * u * 0.82, d = s * 0.42, y0 = H - s - 4;
      return '<g><path d="M' + x0 + ' ' + (y0 + d) + ' h' + s + ' v' + s + ' h-' + s + 'z" fill="#8fd3ff" stroke="' + O + '" stroke-width="2"/>' +
        '<path d="M' + x0 + ' ' + (y0 + d) + ' l' + d + ' -' + d + ' h' + s + ' l-' + d + ' ' + d + 'z" fill="#c7ebff" stroke="' + O + '" stroke-width="2"/>' +
        '<path d="M' + (x0 + s) + ' ' + (y0 + d) + ' l' + d + ' -' + d + ' v' + s + ' l-' + d + ' ' + d + 'z" fill="#5fb6e6" stroke="' + O + '" stroke-width="2"/>' +
        Array.from({ length: 9 }, function (_, i) { var q = s / 10 * (i + 1); return '<path d="M' + (x0 + q) + ' ' + (y0 + d) + ' v' + s + ' M' + x0 + ' ' + (y0 + d + q) + ' h' + s + '" stroke="#3a8cc4" stroke-width=".7"/>'; }).join('') + '</g>'; }
    function flat(x0) { var s = 10 * u, y0 = H - s - 4;
      return '<g><rect x="' + x0 + '" y="' + y0 + '" width="' + s + '" height="' + s + '" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/>' +
        Array.from({ length: 9 }, function (_, i) { var q = u * (i + 1); return '<path d="M' + (x0 + q) + ' ' + y0 + ' v' + s + ' M' + x0 + ' ' + (y0 + q) + ' h' + s + '" stroke="#c99a00" stroke-width=".7"/>'; }).join('') + '</g>'; }
    function rod(x0) { var y0 = H - 10 * u - 4;
      return '<g><rect x="' + x0 + '" y="' + y0 + '" width="' + u + '" height="' + (10 * u) + '" fill="#7fc97a" stroke="' + O + '" stroke-width="1.6"/>' +
        Array.from({ length: 9 }, function (_, i) { return '<path d="M' + x0 + ' ' + (y0 + u * (i + 1)) + ' h' + u + '" stroke="#3d8a3a" stroke-width=".7"/>'; }).join('') + '</g>'; }
    function one(x0, k) { return '<rect x="' + x0 + '" y="' + (H - 4 - u - (k % 5) * (u + 2)) + '" width="' + u + '" height="' + u + '" fill="#ff8a7a" stroke="' + O + '" stroke-width="1.4"/>'; }
    for (var i = 0; i < th; i++) { parts.push(cube(x)); x += 10 * u * 0.82 + 10 * u * 0.82 * 0.42 + 6; }
    if (th) x += 8;
    for (var j = 0; j < h; j++) { parts.push(flat(x)); x += 10 * u + 5; }
    if (h) x += 8;
    for (var k = 0; k < t; k++) { parts.push(rod(x)); x += u + 5; }
    if (t) x += 8;
    for (var m = 0; m < o; m++) { parts.push(one(x + Math.floor(m / 5) * (u + 3), m)); }
    if (o) x += Math.ceil(o / 5) * (u + 3);
    var W = Math.max(x + 6, 60);
    return '<svg class="pvblocks" viewBox="0 0 ' + W + ' ' + H + '" width="' + Math.min(size || 560, W * 1.6) + '" aria-hidden="true">' + parts.join('') + '</svg>';
  }
  /* a place-value chart: thousands | hundreds | tens | ones */
  function pvChart(n, hi) {
    var d = String(n).padStart(4, '0').split(''), names = ['thousands', 'hundreds', 'tens', 'ones'];
    return '<table class="pvchart"><tr>' + names.map(function (nm, i) { return '<th' + (hi === i ? ' class="hi"' : '') + '>' + nm + '</th>'; }).join('') + '</tr><tr>' +
      d.map(function (x, i) { return '<td' + (hi === i ? ' class="hi"' : '') + '>' + x + '</td>'; }).join('') + '</tr></table>';
  }
  function vertical4(a, b, op, ans) {
    var f = function (n) { return n.toLocaleString('en-US'); };
    return '<div class="vprob big4"><span></span><span>' + f(a) + '</span><span class="vop">' + (op || '+') + '</span><span>' + f(b) + '</span><span class="vline"></span><span class="vline">' + (ans === undefined ? '?' : f(ans)) + '</span></div>';
  }
  Models.pvBlocks = pvBlocks; Models.pvChart = pvChart; Models.vertical4 = vertical4;
})();
