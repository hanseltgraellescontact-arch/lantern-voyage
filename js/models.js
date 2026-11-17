/* On-screen math models (like BJU's manipulatives): fraction shapes, fraction bars, sets, circle graphs, clocks, rulers, marble jars. */
var Models = (function () {
  var FILL = '#ffb347', EMPTY = '#ffffff', LINE = '#2b2a3a';

  function isShaded(shaded, i) {
    if (Array.isArray(shaded)) return shaded.indexOf(i) >= 0;
    return i < (shaded || 0);
  }
  function arc(cx, cy, r, a0, a1) {
    var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    var large = (a1 - a0) > Math.PI ? 1 : 0;
    return 'M' + cx + ' ' + cy + ' L' + x0.toFixed(2) + ' ' + y0.toFixed(2) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + 'Z';
  }
  function unevenCuts(n) {
    // random but clearly unequal sizes
    var w = []; for (var i = 0; i < n; i++) w.push(1 + (i % 2 ? 1.9 : 0) + Math.random() * 0.4);
    w = U.shuffle(w); var sum = w.reduce(function (a, b) { return a + b; }, 0);
    return w.map(function (x) { return x / sum; });
  }

  /* shape({kind:'circle'|'rect'|'square', n, shaded, unequal, interactive, size, fill, id}) */
  function shape(o) {
    var n = o.n, size = o.size || 170, fill = o.fill || FILL, parts = [];
    var cls = o.interactive ? ' class="part shadeable"' : ' class="part"';
    var sizes = o.unequal ? unevenCuts(n) : null;
    var svg = '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '"' + (o.id ? ' id="' + o.id + '"' : '') + ' role="img">';
    if (o.kind === 'circle') {
      var a = -Math.PI / 2;
      for (var i = 0; i < n; i++) {
        var step = 2 * Math.PI * (sizes ? sizes[i] : 1 / n);
        var d = n === 1 ? 'M100 10 A90 90 0 1 1 99.99 10Z' : arc(100, 100, 90, a, a + step);
        parts.push('<path d="' + d + '" data-i="' + i + '"' + cls + ' fill="' + (isShaded(o.shaded, i) ? fill : EMPTY) + '" stroke="' + LINE + '" stroke-width="4" stroke-linejoin="round"/>');
        a += step;
      }
    } else if (o.cut === 'diag' || o.cut === 'horiz') {
      // other ways to cut a square: corner-to-corner (2 or 4 triangles) or horizontal strips
      var x0d = 10, y0d = 10, S = 180, polys = [];
      if (o.cut === 'diag' && n === 2) polys = [[[x0d, y0d], [x0d + S, y0d], [x0d, y0d + S]], [[x0d + S, y0d], [x0d + S, y0d + S], [x0d, y0d + S]]];
      else if (o.cut === 'diag') { var c = [100, 100]; polys = [[[x0d, y0d], [x0d + S, y0d], c], [[x0d + S, y0d], [x0d + S, y0d + S], c], [[x0d + S, y0d + S], [x0d, y0d + S], c], [[x0d, y0d + S], [x0d, y0d], c]]; }
      else for (var h = 0; h < n; h++) polys.push([[x0d, y0d + h * S / n], [x0d + S, y0d + h * S / n], [x0d + S, y0d + (h + 1) * S / n], [x0d, y0d + (h + 1) * S / n]]);
      polys.forEach(function (pl, i2) {
        parts.push('<polygon points="' + pl.map(function (pt) { return pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(' ') + '" data-i="' + i2 + '"' + cls +
          ' fill="' + (isShaded(o.shaded, i2) ? fill : EMPTY) + '" stroke="' + LINE + '" stroke-width="4" stroke-linejoin="round"/>');
      });
    } else {
      var W = o.kind === 'square' ? 180 : 190, H = o.kind === 'square' ? 180 : 110;
      var x0 = (200 - W) / 2, y0 = (200 - H) / 2;
      // thin slivers are hard to count: 6 or 8 parts always go in two rows (unless the cuts are meant to be unequal)
      var rows = (!sizes && n % 2 === 0 && (n >= 6 || (o.grid && n >= 4))) ? 2 : 1, cols = n / rows;
      var x = x0, idx = 0;
      for (var r = 0; r < rows; r++) {
        x = x0;
        for (var c = 0; c < cols; c++) {
          var w = sizes ? W * sizes[idx] * rows : W / cols;
          parts.push('<rect x="' + x.toFixed(2) + '" y="' + (y0 + r * H / rows).toFixed(2) + '" width="' + w.toFixed(2) + '" height="' + (H / rows).toFixed(2) + '" data-i="' + idx + '"' + cls +
            ' fill="' + (isShaded(o.shaded, idx) ? fill : EMPTY) + '" stroke="' + LINE + '" stroke-width="4" stroke-linejoin="round"/>');
          x += w; idx++;
        }
      }
    }
    return svg + parts.join('') + '</svg>';
  }

  /* horizontal fraction bar: n parts, k shaded */
  function bar(n, k, o) {
    o = o || {}; var W = o.width || 320, H = 44, fill = o.fill || FILL;
    var s = '<svg viewBox="0 0 ' + (W + 4) + ' ' + (H + 4) + '" width="' + (W + 4) + '" height="' + (H + 4) + '">';
    for (var i = 0; i < n; i++) {
      s += '<rect x="' + (2 + i * W / n).toFixed(2) + '" y="2" width="' + (W / n).toFixed(2) + '" height="' + H + '" fill="' + (i < k ? fill : EMPTY) + '" stroke="' + LINE + '" stroke-width="3.5"/>';
    }
    if (o.label) s += '<text x="' + (W / 2 + 2) + '" y="30" text-anchor="middle" font-weight="800" font-size="18" fill="#2b2a3a">' + o.label + '</text>';
    return s + '</svg>';
  }
  function barStack(rows) { // rows: [{n,k,label}]
    return '<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">' + rows.map(function (r) {
      return '<div class="row" style="gap:10px">' + bar(r.n, r.k, { fill: r.fill }) + (r.text ? '<span style="font-size:1.4rem">' + r.text + '</span>' : '') + '</div>';
    }).join('') + '</div>';
  }

  /* set of objects: n items, first k "special" (or shaded list), icon kind */
  function set(n, k, kind, onColor, offColor, interactive) {
    var out = '<div style="display:flex;flex-wrap:wrap;gap:8px;max-width:440px;justify-content:center">';
    for (var i = 0; i < n; i++) {
      var on = i < k;
      out += '<span data-i="' + i + '" class="' + (interactive ? 'shadeable setitem' : '') + '" style="display:inline-flex;border-radius:12px;padding:2px;' +
        (interactive ? 'border:3px solid transparent' : '') + '">' + Art.icon(kind, 54, on ? onColor : offColor) + '</span>';
    }
    return out + '</div>';
  }

  /* circle graph: slices [{label, parts, color}] where parts are out of den */
  function circleGraph(slices, den, title) {
    var a = -Math.PI / 2, s = '<div class="row" style="gap:18px;justify-content:center">' +
      '<svg viewBox="0 0 200 200" width="190" height="190">';
    // every equal part is drawn separately, with a clear dark line between parts, so the parts can be counted
    slices.forEach(function (sl) {
      for (var k = 0; k < sl.parts; k++) {
        var step = 2 * Math.PI / den;
        s += '<path d="' + (den === 1 ? 'M100 10 A90 90 0 1 1 99.99 10Z' : arc(100, 100, 90, a, a + step)) + '" fill="' + sl.color + '" stroke="#2b2a3a" stroke-width="3" stroke-linejoin="round"/>';
        a += step;
      }
    });
    s += '</svg><div style="text-align:left">' + (title ? '<div style="font-weight:800;margin-bottom:6px">' + title + '</div>' : '');
    slices.forEach(function (sl) {
      s += '<div class="row" style="gap:8px;margin:4px 0"><span style="width:22px;height:22px;border-radius:6px;background:' + sl.color + ';display:inline-block"></span>' + U.esc(sl.label) + '</div>';
    });
    return s + '</div></div>';
  }

  function clock(h, m, size) {
    size = size || 170;
    var s = '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#22335e" stroke-width="7"/>';
    for (var i = 1; i <= 12; i++) {
      var a = Math.PI / 6 * i - Math.PI / 2;
      s += '<line x1="' + (100 + Math.cos(a) * 84).toFixed(1) + '" y1="' + (100 + Math.sin(a) * 84).toFixed(1) + '" x2="' + (100 + Math.cos(a) * 91).toFixed(1) + '" y2="' + (100 + Math.sin(a) * 91).toFixed(1) + '" stroke="#22335e" stroke-width="3"/>';
      s += '<text x="' + (100 + Math.cos(a) * 70).toFixed(1) + '" y="' + (107 + Math.sin(a) * 70).toFixed(1) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#22335e">' + i + '</text>';
    }
    var ma = Math.PI / 30 * m - Math.PI / 2, ha = Math.PI / 6 * ((h % 12) + m / 60) - Math.PI / 2;
    s += '<line x1="100" y1="100" x2="' + (100 + Math.cos(ha) * 38).toFixed(1) + '" y2="' + (100 + Math.sin(ha) * 38).toFixed(1) + '" stroke="#e5533d" stroke-width="8" stroke-linecap="round"/>';
    s += '<line x1="100" y1="100" x2="' + (100 + Math.cos(ma) * 54).toFixed(1) + '" y2="' + (100 + Math.sin(ma) * 54).toFixed(1) + '" stroke="#22335e" stroke-width="5" stroke-linecap="round"/>';
    return s + '<circle cx="100" cy="100" r="6" fill="#22335e"/></svg>';
  }
  /* clock face shaded from 12 for a fraction of an hour */
  function clockFraction(quarters, size) {
    size = size || 170;
    var s = '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size + '"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#22335e" stroke-width="7"/>';
    if (quarters > 0) s += '<path d="' + (quarters === 4 ? 'M100 12 A88 88 0 1 1 99.99 12Z' : arc(100, 100, 88, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2 * quarters)) + '" fill="#ffd7a1"/>';
    for (var q = 0; q < 4; q++) { var qa = Math.PI / 2 * q - Math.PI / 2; s += '<path d="M100 100 L' + (100 + Math.cos(qa) * 88).toFixed(1) + ' ' + (100 + Math.sin(qa) * 88).toFixed(1) + '" stroke="#22335e" stroke-width="3"/>'; }
    [0, 15, 30, 45].forEach(function (mm, i) {
      var a = Math.PI / 2 * i - Math.PI / 2;
      s += '<text x="' + (100 + Math.cos(a) * 66).toFixed(1) + '" y="' + (107 + Math.sin(a) * 66).toFixed(1) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#22335e">' + (mm === 0 ? '12' : ':' + mm) + '</text>';
    });
    return s + '<circle cx="100" cy="100" r="5" fill="#22335e"/></svg>';
  }

  function ruler(inches, highlight) {
    var px = 34, W = inches * px + 30;
    var s = '<svg viewBox="0 0 ' + W + ' 80" width="' + Math.min(W, 520) + '" height="80"><rect x="4" y="10" width="' + (inches * px + 20) + '" height="56" rx="6" fill="#ffe08a" stroke="#c98a12" stroke-width="2"/>';
    if (highlight) s += '<rect x="14" y="10" width="' + (highlight * px) + '" height="56" fill="#ffb347" opacity=".55"/>';
    for (var i = 0; i <= inches * 2; i++) {
      var x = 14 + i * px / 2, big = i % 2 === 0;
      s += '<line x1="' + x + '" y1="10" x2="' + x + '" y2="' + (big ? 36 : 26) + '" stroke="#5a4632" stroke-width="2"/>';
      if (big) s += '<text x="' + x + '" y="56" text-anchor="middle" font-size="14" font-weight="800" fill="#5a4632">' + (i / 2) + '</text>';
    }
    return s + '</svg>';
  }

  /* jar of marbles for probability */
  function jar(counts) { // {color: n}
    var balls = [];
    Object.keys(counts).forEach(function (c) { for (var i = 0; i < counts[c]; i++) balls.push(c); });
    balls = U.shuffle(balls);
    var s = '<svg viewBox="0 0 200 200" width="180" height="180"><path d="M50 30 h100 v14 q20 10 20 40 v90 q0 16 -16 16 h-108 q-16 0 -16 -16 v-90 q0 -30 20 -40z" fill="#e8f6ff" stroke="#7aa6c2" stroke-width="4"/>';
    balls.forEach(function (c, i) {
      var col = i % 5, row = Math.floor(i / 5);
      s += '<circle cx="' + (52 + col * 24) + '" cy="' + (172 - row * 24) + '" r="10" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
    });
    return s + '</svg>';
  }

  /* pies on a counter for fair-share problems: total items split into groups (drawn as plates) */
  function plates(groups, perGroup, kind) {
    var out = '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">';
    for (var g = 0; g < groups; g++) {
      out += '<div style="background:#fff;border:3px solid #e3d8bd;border-radius:50%;width:120px;height:120px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:10px">';
      for (var i = 0; i < perGroup; i++) out += Art.icon(kind, perGroup > 4 ? 26 : 36);
      out += '</div>';
    }
    return out + '</div>';
  }


  /* ---- Grade 1 pictures ---- */
  var OLc = '#2b2a3a';
  /* dot pattern like dice for 0-6, ten-frame style for 7-10 */
  function dots(n, size) {
    size = size || 140;
    var P = { 0: [], 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]] };
    if (n <= 6) return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '"><rect x="4" y="4" width="92" height="92" rx="16" fill="#fff" stroke="' + OLc + '" stroke-width="4"/>' +
      P[n].map(function (d) { return '<circle class="cnt" cx="' + d[0] + '" cy="' + d[1] + '" r="9" fill="#e5533d"/>'; }).join('') + '</svg>';
    if (n > 10) return '<span class="g1frames">' + tenFrame(10, 'dot', size * 1.6) + tenFrame(n - 10, 'dot', size * 1.6) + '</span>'; // teen numbers: one full ten and some more
    return tenFrame(n, 'dot', size * 1.6);
  }
  /* ten-frame (2 rows of 5); filled k cells with dots or an icon */
  function tenFrame(k, kind, width) {
    width = width || 230; var c = 44, s = '<svg viewBox="0 0 232 100" width="' + width + '" height="' + (width * 100 / 232) + '"><rect x="4" y="4" width="224" height="92" rx="8" fill="#fff" stroke="' + OLc + '" stroke-width="4"/>';
    for (var i = 1; i < 5; i++) s += '<path d="M' + (4 + i * 44.8) + ' 4 v92" stroke="' + OLc + '" stroke-width="3"/>';
    s += '<path d="M4 50 h224" stroke="' + OLc + '" stroke-width="3"/>';
    for (var j = 0; j < k && j < 10; j++) {
      var x = 26 + (j % 5) * 44.8, y = j < 5 ? 27 : 73;
      s += kind === 'dot' || !kind ? '<circle class="cnt" cx="' + x + '" cy="' + y + '" r="14" fill="#e5533d" stroke="' + OLc + '" stroke-width="2"/>' : '<g transform="translate(' + (x - 18) + ',' + (y - 18) + ') scale(.6)">' + Art.icon(kind, 60).replace(/<\/?svg[^>]*>/g, '') + '</g>';
    }
    return s + '</svg>';
  }
  /* tally marks (groups of five with a slash) */
  function tally(n) {
    var s = '<svg viewBox="0 0 ' + (Math.ceil(n / 5) * 70 + 10) + ' 80" width="' + (Math.ceil(n / 5) * 70 + 10) * 1.4 + '" height="112">';
    for (var g = 0; g * 5 < n; g++) {
      var m = Math.min(5, n - g * 5), x0 = 10 + g * 70;
      for (var i = 0; i < Math.min(4, m); i++) s += '<path class="cnt" d="M' + (x0 + i * 12) + ' 12 v56" stroke="' + OLc + '" stroke-width="5" stroke-linecap="round"/>';
      if (m === 5) s += '<path class="cnt" d="M' + (x0 - 6) + ' 58 L' + (x0 + 44) + ' 20" stroke="#e5533d" stroke-width="5" stroke-linecap="round"/>';
    }
    return s + '</svg>';
  }
  /* a row/group of icons; crossed: how many at the end are crossed out (for take-away) */
  /* items come in groups of five (like a ten-frame) so a child can see 5 and count on; line: keep one row, lined up at the left */
  function row(n, kind, color, crossed, max, line) {
    max = Math.max(max || 440, Math.min(n, 5) * 58 + 8); // always room for a full group of five
    var out = '<div class="g1set' + (line ? ' line' : '') + '" style="max-width:' + max + 'px">';
    for (var i = 0; i < n; i++) {
      var x = crossed && i >= n - crossed;
      if (i % 5 === 0) out += (i ? '</span>' : '') + '<span class="g1five">';
      out += '<span class="g1item' + (x ? ' crossed' : '') + '">' + Art.icon(kind, line ? 44 : 50, color) + '</span>';
    }
    return out + (n ? '</span>' : '') + '</div>';
  }
  /* an egg carton: 2 rows of 6 cups. Fewer than 12 leaves empty cups; more than 12 puts the extra eggs outside. */
  function carton(n, size) {
    size = size || 44;
    var cup = function (i) { return i < n ? '<span class="g1item">' + Art.icon('egg', size, '#fff6e0') + '</span>' : '<span class="g1cup" style="width:' + size + 'px;height:' + size + 'px"></span>'; };
    var out = '<span class="g1carton"><span class="g1crow">';
    for (var i = 0; i < 12; i++) { if (i === 6) out += '</span><span class="g1crow">'; out += cup(i); }
    out += '</span></span>';
    if (n > 12) { out += '<span class="g1extra">'; for (var j = 12; j < n; j++) out += '<span class="g1item">' + Art.icon('egg', size, '#fff6e0') + '</span>'; out += '</span>'; }
    return '<div class="g1cartonwrap">' + out + '</div>';
  }
  /* coins */
  var COINS = { penny: { c: 1, col: '#c9773b', r: 22, label: '1¢' }, nickel: { c: 5, col: '#b8c0c8', r: 26, label: '5¢' }, dime: { c: 10, col: '#d6dbe0', r: 20, label: '10¢' }, quarter: { c: 25, col: '#c6ccd2', r: 29, label: '25¢' } };
  function coin(name, size) {
    var k = COINS[name], s = size || 80;
    return '<svg viewBox="0 0 64 64" width="' + s * k.r / 26 + '" height="' + s * k.r / 26 + '"><circle cx="32" cy="32" r="29" fill="' + k.col + '" stroke="' + OLc + '" stroke-width="3"/>' +
      '<circle cx="32" cy="32" r="22" fill="none" stroke="' + shadeC(k.col) + '" stroke-width="2"/><text x="32" y="38" text-anchor="middle" font-size="16" font-weight="800" fill="' + OLc + '">' + k.label + '</text></svg>';
  }
  function shadeC(h) { var n = parseInt(h.slice(1), 16), r = (n >> 16) * .75, g = ((n >> 8) & 255) * .75, b = (n & 255) * .75; return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'; }
  /* bundles of ten sticks plus loose ones */
  function sticks(tens, ones) {
    var s = '<svg viewBox="0 0 ' + (tens * 46 + ones * 14 + 20) + ' 110" width="' + Math.min(460, (tens * 46 + ones * 14 + 20) * 1.2) + '" height="132">';
    for (var t = 0; t < tens; t++) {
      var x0 = 10 + t * 46;
      for (var i = 0; i < 10; i++) s += '<rect x="' + (x0 + i * 3.4) + '" y="10" width="4" height="90" rx="2" fill="#e8b25a" stroke="#8d5730" stroke-width="1"/>';
      s += '<rect x="' + (x0 - 2) + '" y="48" width="40" height="12" rx="3" fill="#e5533d" stroke="' + OLc + '" stroke-width="2"/>';
    }
    for (var o = 0; o < ones; o++) s += '<rect x="' + (14 + tens * 46 + o * 14) + '" y="10" width="7" height="90" rx="3" fill="#e8b25a" stroke="#8d5730" stroke-width="1.5"/>';
    return s + '</svg>';
  }
  /* plain 2D / 3D shape */
  /* 3-D solids drawn the way geometry books show them: each face its own shade, hidden back edges dashed. */
  function mixC(h, t, k) { var n = parseInt(h.slice(1), 16), m = parseInt(t.slice(1), 16), f = function (sh) { return Math.round(((n >> sh) & 255) * (1 - k) + ((m >> sh) & 255) * k); }; return 'rgb(' + f(16) + ',' + f(8) + ',' + f(0) + ')'; }
  function solid(kind, col) {
    var lt = mixC(col, '#ffffff', 0.45), dk = mixC(col, '#000000', 0.22), E = ' stroke="' + OLc + '" stroke-width="3.5" stroke-linejoin="round"', D = ' stroke="' + OLc + '" stroke-width="2.2" stroke-dasharray="5 4" fill="none" opacity=".75"';
    function poly(pts, fill) { return '<path d="M' + pts.join(' L') + 'z" fill="' + fill + '"' + E + '/>'; }
    function dash(a, b) { return '<path d="M' + a + ' L' + b + '"' + D + '/>'; }
    switch (kind) {
      case 'cube': // front square, top and right faces; hidden corner at back-bottom-left
        return poly(['14 38', '62 38', '62 86', '14 86'], col) + poly(['14 38', '36 18', '84 18', '62 38'], lt) + poly(['62 38', '84 18', '84 66', '62 86'], dk) +
          dash('36 66', '14 86') + dash('36 66', '84 66') + dash('36 66', '36 18');
      case 'prism': // a box: wider than tall
        return poly(['6 44', '68 44', '68 84', '6 84'], col) + poly(['6 44', '28 26', '92 26', '68 44'], lt) + poly(['68 44', '92 26', '92 66', '68 84'], dk) +
          dash('28 66', '6 84') + dash('28 66', '92 66') + dash('28 66', '28 26');
      case 'pyramid': // SQUARE pyramid: a square base (back edges dashed) and four triangle faces meeting at the top
        return poly(['50 8', '10 80', '60 90'], col) + poly(['50 8', '60 90', '92 68'], dk) +
          '<path d="M10 80 L60 90 L92 68" fill="none"' + E + '/>' +
          dash('42 60', '10 80') + dash('42 60', '92 68') + dash('42 60', '50 8');
      case 'tripyramid': // TRIANGULAR pyramid: a triangle base, three triangle faces
        return poly(['50 10', '10 82', '62 90'], col) + poly(['50 10', '62 90', '90 70'], dk) + '<path d="M10 82 L62 90 L90 70" fill="none"' + E + '/>' +
          dash('10 82', '90 70');
      case 'cylinder':
        return '<path d="M16 24 V78 A34 11 0 0 0 84 78 V24" fill="' + col + '"' + E + '/>' + '<path d="M16 78 A34 11 0 0 1 84 78"' + D + '/>' +
          '<ellipse cx="50" cy="24" rx="34" ry="11" fill="' + lt + '"' + E + '/>';
      case 'cone':
        return '<path d="M50 8 L84 80 A34 11 0 0 1 16 80 Z" fill="' + col + '"' + E + '/>' + '<path d="M16 80 A34 11 0 0 1 84 80"' + D + '/>';
      case 'sphere':
        return '<circle cx="50" cy="50" r="40" fill="' + col + '"' + E + '/>' + '<path d="M10 50 A40 12 0 0 0 90 50" fill="none" stroke="' + OLc + '" stroke-width="2"/>' +
          '<path d="M10 50 A40 12 0 0 1 90 50"' + D + '/>' + '<ellipse cx="34" cy="32" rx="10" ry="7" fill="#fff" opacity=".55"/>';
    }
    return null;
  }
  function figure(kind, size, col) {
    size = size || 110; col = col || '#7fc8a9'; var st = ' fill="' + col + '" stroke="' + OLc + '" stroke-width="4" stroke-linejoin="round"';
    var c6 = /^#[0-9a-f]{3}$/i.test(col) ? '#' + col.slice(1).split('').map(function (x) { return x + x; }).join('') : col;
    var sd = /^#[0-9a-f]{6}$/i.test(c6) ? solid(kind, c6) : null;
    if (sd) return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '">' + sd + '</svg>';
    var d = { circle: '<circle cx="50" cy="50" r="40"' + st + '/>', square: '<rect x="12" y="12" width="76" height="76"' + st + '/>', triangle: '<path d="M50 10 L92 88 H8z"' + st + '/>',
      rectangle: '<rect x="4" y="26" width="92" height="50"' + st + '/>', hexagon: '<path d="M28 10 H72 L94 50 L72 90 H28 L6 50z"' + st + '/>',
      cube: '<path d="M20 34 L44 20 H86 V62 L62 76 H20z"' + st + '/><path d="M20 34 H62 V76 M62 34 L86 20" stroke="' + OLc + '" stroke-width="4" fill="none"/>',
      sphere: '<circle cx="50" cy="50" r="40"' + st + '/><ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="' + OLc + '" stroke-width="2" opacity=".5"/><circle cx="36" cy="36" r="8" fill="#fff" opacity=".6"/>',
      cone: '<path d="M50 8 L84 80 Q50 98 16 80z"' + st + '/><ellipse cx="50" cy="80" rx="34" ry="10" fill="none" stroke="' + OLc + '" stroke-width="3"/>',
      cylinder: '<path d="M18 22 V78 Q50 96 82 78 V22"' + st + '/><ellipse cx="50" cy="22" rx="32" ry="10"' + st + '/>',
      pentagon: '<path d="M50 8 L92 40 L76 90 H24 L8 40z"' + st + '/>', oval: '<ellipse cx="50" cy="50" rx="44" ry="28"' + st + '/>',
      rhombus: '<path d="M50 6 L86 50 L50 94 L14 50z"' + st + '/>', trapezoid: '<path d="M28 22 H72 L94 78 H6z"' + st + '/>',
      prism: '<path d="M8 38 L30 22 H92 V66 L70 82 H8z"' + st + '/><path d="M8 38 H70 V82 M70 38 L92 22" stroke="' + OLc + '" stroke-width="4" fill="none"/>',
      pyramid: '<path d="M50 8 L90 74 L62 90 L10 78z"' + st + '/><path d="M50 8 L62 90" stroke="' + OLc + '" stroke-width="4" fill="none"/><path d="M10 78 L90 74" stroke="' + OLc + '" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".6"/>' }[kind];
    return '<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '">' + d + '</svg>';
  }
  /* simple measuring pictures */
  function lengthBar(len, col, max) { return '<svg viewBox="0 0 ' + (max * 30 + 20) + ' 40" width="' + (max * 30 + 20) + '" height="40"><rect x="6" y="8" width="' + len * 30 + '" height="24" rx="10" fill="' + col + '" stroke="' + OLc + '" stroke-width="3"/></svg>'; }

  return { carton: carton, dots: dots, tenFrame: tenFrame, tally: tally, row: row, coin: coin, COINS: COINS, sticks: sticks, figure: figure, lengthBar: lengthBar, shape: shape, bar: bar, barStack: barStack, set: set, circleGraph: circleGraph, clock: clock, clockFraction: clockFraction,
    ruler: ruler, jar: jar, plates: plates, FILL: FILL };
})();
