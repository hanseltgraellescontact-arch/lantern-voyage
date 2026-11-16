/* Geometry pictures for Kite Cove (BJU Math 2, ch. 15): vertices, slides/flips/turns, pattern blocks, symmetry,
   congruent and similar shapes, lines, perimeter and a Venn diagram. Same bold-outline style as models.js. */
(function () {
  var O = '#2b2a3a', S = ' stroke="' + O + '" stroke-width="4" stroke-linejoin="round"';
  var POLY = { triangle: [[50, 10], [92, 88], [8, 88]], square: [[12, 12], [88, 12], [88, 88], [12, 88]], rectangle: [[4, 26], [96, 26], [96, 76], [4, 76]],
    pentagon: [[50, 8], [92, 40], [76, 90], [24, 90], [8, 40]], hexagon: [[28, 10], [72, 10], [94, 50], [72, 90], [28, 90], [6, 50]],
    rhombus: [[50, 6], [86, 50], [50, 94], [14, 50]], trapezoid: [[28, 22], [72, 22], [94, 78], [6, 78]] };
  /* a plane figure with its corners (vertices) marked */
  function vertices(kind, size, col) {
    var p = POLY[kind];
    return '<svg viewBox="-4 -4 108 108" width="' + (size || 150) + '" height="' + (size || 150) + '"><path d="M' + p.map(function (q) { return q.join(' '); }).join(' L') + 'z" fill="' + (col || '#ffd23f') + '"' + S + '/>' +
      p.map(function (q) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="6" fill="#e5533d" stroke="' + O + '" stroke-width="2"/>'; }).join('') + '</svg>';
  }
  /* an L-shaped flag piece: easy to see slides, flips and turns */
  var LSHAPE = 'M10 10 H34 V58 H58 V80 H10z';
  function moveShape(move, size) {
    var t = move === 'slide' ? 'translate(120,0)' : move === 'flip' ? 'translate(200,0) scale(-1,1)' : 'translate(160,10) rotate(90,34,45)';
    return '<svg viewBox="0 0 210 100" width="' + (size || 300) + '" height="' + ((size || 300) * 100 / 210) + '"><path d="' + LSHAPE + '" fill="#3b8fd9"' + S + '/>' +
      '<path d="M78 50 h30" stroke="#9aa1ad" stroke-width="4" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#9aa1ad"/></marker></defs>' +
      '<path d="' + LSHAPE + '" transform="' + t + '" fill="#ffb35c"' + S + '/></svg>';
  }
  /* pattern blocks: a hexagon built from 6 triangles, 3 rhombuses or 2 trapezoids */
  function hexFrom(piece, size) {
    var c = [50, 50], R = 44, pts = [0, 1, 2, 3, 4, 5].map(function (i) { var a = Math.PI / 3 * i - Math.PI / 2 + Math.PI / 6; return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]; });
    var o = '<svg viewBox="0 0 100 100" width="' + (size || 150) + '" height="' + (size || 150) + '">', cols = { tri: '#36b37e', rho: '#3b8fd9', tra: '#e5533d' };
    if (piece === 'tri') for (var i = 0; i < 6; i++) o += '<path d="M50 50 L' + pts[i].join(' ') + ' L' + pts[(i + 1) % 6].join(' ') + 'z" fill="' + cols.tri + '"' + S.replace('4"', '3"') + '/>';
    else if (piece === 'rho') for (var j = 0; j < 3; j++) o += '<path d="M50 50 L' + pts[j * 2].join(' ') + ' L' + pts[j * 2 + 1].join(' ') + ' L' + pts[(j * 2 + 2) % 6].join(' ') + 'z" fill="' + cols.rho + '"' + S.replace('4"', '3"') + '/>';
    else { o += '<path d="M' + pts[5].join(' ') + ' L' + pts[0].join(' ') + ' L' + pts[1].join(' ') + ' L' + pts[2].join(' ') + 'z" fill="' + cols.tra + '"' + S.replace('4"', '3"') + '/><path d="M' + pts[2].join(' ') + ' L' + pts[3].join(' ') + ' L' + pts[4].join(' ') + ' L' + pts[5].join(' ') + 'z" fill="#ff9f8a"' + S.replace('4"', '3"') + '/>'; }
    return o + '</svg>';
  }
  function block(piece, size) {
    var s = size || 60, d = { tri: 'M50 12 L94 88 H6z', rho: 'M50 6 L80 50 L50 94 L20 50z', tra: 'M28 30 H72 L96 74 H4z', hex: 'M28 10 H72 L94 50 L72 90 H28 L6 50z', sq: 'M14 14 H86 V86 H14z' }[piece];
    var col = { tri: '#36b37e', rho: '#3b8fd9', tra: '#e5533d', hex: '#ffd23f', sq: '#ff9f1c' }[piece];
    return '<svg viewBox="0 0 100 100" width="' + s + '" height="' + s + '"><path d="' + d + '" fill="' + col + '"' + S + '/></svg>';
  }
  /* pattern blocks drawn to true scale (every side = unit), so pieces can be compared by size */
  function blockTrue(piece, unit) {
    var u = unit || 50, h = 0.866, P = { tri: [[0, h], [1, h], [0.5, 0]], rho: [[0, h], [1, h], [1.5, 0], [0.5, 0]], tra: [[0, h], [2, h], [1.5, 0], [0.5, 0]], hex: [[0.5, 0], [1.5, 0], [2, h], [1.5, 2 * h], [0.5, 2 * h], [0, h]] }[piece];
    var w = Math.max.apply(null, P.map(function (q) { return q[0]; })), ht = Math.max.apply(null, P.map(function (q) { return q[1]; })), pad = 4;
    var col = { tri: '#36b37e', rho: '#3b8fd9', tra: '#e5533d', hex: '#ffd23f' }[piece];
    return '<svg viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (w * u + 2 * pad) + ' ' + (ht * u + 2 * pad) + '" width="' + (w * u + 2 * pad) + '" height="' + (ht * u + 2 * pad) + '"><path d="M' + P.map(function (q) { return (q[0] * u).toFixed(1) + ' ' + (q[1] * u).toFixed(1); }).join(' L') + 'z" fill="' + col + '"' + S + '/></svg>';
  }
  /* a shape with a dashed line through it (is it a line of symmetry?) */
  var SYM = { heart: 'M50 88 C10 60 6 30 26 18 C40 10 50 22 50 30 C50 22 60 10 74 18 C94 30 90 60 50 88z', star: 'M50 6 L61 38 L95 38 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 L39 38z',
    rect: 'M10 24 H90 V76 H10z', tri: 'M50 10 L90 88 H10z', moon: 'M62 10 A40 40 0 1 0 62 90 A30 30 0 1 1 62 10z', flag: 'M20 10 V92 M20 12 H80 L66 30 L80 48 H20', lshape: LSHAPE };
  function symmetry(kind, line, size, col) {
    var ln = line === 'v' ? '<path d="M50 0 V100"' : line === 'h' ? '<path d="M0 50 H100"' : line === 'd' ? '<path d="M0 0 L100 100"' : '';
    return '<svg viewBox="0 0 100 100" width="' + (size || 150) + '" height="' + (size || 150) + '"><path d="' + SYM[kind] + '" fill="' + (kind === 'flag' ? 'none' : (col || '#ff9fd0')) + '"' + S + '/>' +
      (ln ? ln + ' stroke="#e5533d" stroke-width="4" stroke-dasharray="8 6"/>' : '') + '</svg>';
  }
  /* two shapes side by side: same size and shape (congruent), same shape different size (similar), or different */
  function pair(kind, how, size) {
    var a = Models.figure(kind, size || 100, '#9fd0ff'), b;
    if (how === 'congruent') b = Models.figure(kind, size || 100, '#ffb3a7');
    else if (how === 'similar') b = Models.figure(kind, (size || 100) * 0.55, '#ffb3a7');
    else b = Models.figure(how, size || 100, '#ffb3a7');
    return '<div class="g1row" style="align-items:flex-end">' + a + b + '</div>';
  }
  /* lines: horizontal, vertical, parallel, intersecting */
  function lines(kind, size) {
    var d = { horizontal: '<path d="M10 50 H110"/>', vertical: '<path d="M60 4 V96"/>', parallel: '<path d="M10 30 H110 M10 70 H110"/>', parallelV: '<path d="M40 4 V96 M80 4 V96"/>',
      intersecting: '<path d="M14 14 L106 86 M14 86 L106 14"/>', intersectingT: '<path d="M10 50 H110 M60 4 V96"/>', slanted: '<path d="M14 86 L106 14"/>' }[kind];
    return '<svg viewBox="0 0 120 100" width="' + (size || 170) + '" height="' + ((size || 170) * 100 / 120) + '"><g stroke="#3b6fd9" stroke-width="6" stroke-linecap="round" fill="none">' + d + '</g></svg>';
  }
  /* a figure with every side labeled in inches, for perimeter */
  function perimeter(kind, sides, unit, size) {
    unit = unit || 'in'; var w = size || 240, o = '<svg viewBox="0 0 140 110" width="' + w + '" height="' + (w * 110 / 140) + '">', lab = function (x, y, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="12" font-weight="800" fill="#2b2a3a">' + t + ' ' + unit + '</text>'; };
    if (kind === 'triangle') o += '<path d="M70 14 L124 92 H16z" fill="#c9f0d6"' + S + '/>' + lab(32, 50, sides[0]) + lab(110, 50, sides[1]) + lab(70, 106, sides[2]);
    else if (kind === 'rectangle' || kind === 'square') { var h = kind === 'square' ? 70 : 54; o += '<rect x="30" y="' + (55 - h / 2) + '" width="' + (kind === 'square' ? 70 : 84) + '" height="' + h + '" fill="#ffe8a8"' + S + '/>' +
      lab(kind === 'square' ? 65 : 72, 50 - h / 2 - 2, sides[0]) + lab(kind === 'square' ? 118 : 130, 59, sides[1]) + lab(kind === 'square' ? 65 : 72, 70 + h / 2, sides[2]) + lab(12, 59, sides[3]); }
    else { o += '<path d="M70 10 L120 46 L100 98 H40 L20 46z" fill="#ffd1e6"' + S + '/>' + lab(104, 24, sides[0]) + lab(126, 76, sides[1]) + lab(70, 109, sides[2]) + lab(14, 76, sides[3]) + lab(36, 24, sides[4]); }
    return o + '</svg>';
  }
  /* a Venn diagram with labels and items placed in the right part */
  function venn(la, lb, items, size) {
    var w = size || 380, o = '<svg viewBox="0 0 300 170" width="' + w + '" height="' + (w * 170 / 300) + '"><circle cx="110" cy="92" r="72" fill="#9fd0ff" fill-opacity=".45"' + S + '/><circle cx="190" cy="92" r="72" fill="#ffb3a7" fill-opacity=".45"' + S + '/>' +
      '<text x="80" y="14" text-anchor="middle" font-size="13" font-weight="800">' + la + '</text><text x="220" y="14" text-anchor="middle" font-size="13" font-weight="800">' + lb + '</text>';
    var slots = { a: [[72, 70], [70, 118]], b: [[228, 70], [230, 118]], both: [[150, 70], [150, 118]] }, used = { a: 0, b: 0, both: 0 };
    (items || []).forEach(function (it) { var s = slots[it.where][used[it.where]++] || slots[it.where][0]; o += '<g transform="translate(' + (s[0] - 18) + ',' + (s[1] - 18) + ')">' + it.svg.replace('<svg', '<svg width="36" height="36"') + '</g>'; });
    return o + '</svg>';
  }
  /* a straight line with a ruler under it, for measuring in inches */
  function lineOnRuler(len) {
    var o = '<svg viewBox="0 0 330 70" width="330" height="70"><path d="M15 18 H' + (15 + len * 40) + '" stroke="#e5533d" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="10" y="32" width="300" height="32" rx="3" fill="#ffe27a" stroke="#2b2a3a" stroke-width="2"/>';
    for (var i = 0; i <= 7; i++) o += '<path d="M' + (15 + i * 40) + ' 32 v14" stroke="#2b2a3a" stroke-width="2"/><text x="' + (15 + i * 40) + '" y="60" text-anchor="middle" font-size="11" font-weight="700">' + i + '</text>';
    return o + '</svg>';
  }
  Models.vertices = vertices; Models.moveShape = moveShape; Models.hexFrom = hexFrom; Models.block = block; Models.blockTrue = blockTrue; Models.symmetry = symmetry; Models.pair = pair;
  Models.lines = lines; Models.perimeter = perimeter; Models.venn = venn; Models.lineOnRuler = lineOnRuler; Models.POLY = POLY; Models.SYM = SYM;
})();
