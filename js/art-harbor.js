/* Lantern Harbor artwork (1st-grade course): Grandpa Eli, Dockmaster Ruth, the boat the child builds,
   the harbor background and the town map pieces. Same bold-outline cartoon style as the rest of the game. */
(function () {
  var O = '#2b2a3a', O4 = ' stroke="' + O + '" stroke-width="4" stroke-linejoin="round"', O3 = ' stroke="' + O + '" stroke-width="3" stroke-linejoin="round"';
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var f = function (x) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? x * (1 + amt) : x + (255 - x) * amt))); };
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  function svg(size, body) { return '<svg viewBox="0 0 220 320" width="' + size + '" height="' + (size * 320 / 220) + '" aria-hidden="true">' + body + '</svg>'; }
  function eyes(y, kind) {
    var e = function (x) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="8" ry="9" fill="#fff"' + O3 + '/><circle cx="' + (x + 1) + '" cy="' + (y + 2) + '" r="5" fill="#3a2a22"/><circle cx="' + (x + 3) + '" cy="' + (y - 1) + '" r="2" fill="#fff"/>'; };
    return e(88) + e(132);
  }
  function hands(skin, lx, ly, rx, ry) { return '<ellipse cx="' + lx + '" cy="' + ly + '" rx="13" ry="12" fill="' + skin + '"' + O4 + '/><ellipse cx="' + rx + '" cy="' + ry + '" rx="13" ry="12" fill="' + skin + '"' + O4 + '/>'; }

  /* Grandpa Eli, the Harbor Master: white beard, navy cap, cream fisherman's sweater, a lantern in his hand. */
  function keeperEli(size) {
    var skin = '#eab38c', skinD = shade(skin, -.14), hair = '#f1f1f1', sweater = '#efe3c8';
    return svg(size || 170,
      // trousers and boots
      '<path d="M76 238 l68 0 l4 60 l-32 0 l-6 -40 l-6 40 l-32 0z" fill="#4a4f5c"' + O4 + '/>' +
      '<path d="M66 304 q0 -14 24 -12 q18 0 18 12z M112 304 q0 -12 18 -12 q24 -2 24 12z" fill="#2f2a26"' + O4 + '/>' +
      // sweater with arms
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l0 32 l76 0 l0 -32 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + sweater + '"' + O4 + '/>' +
      '<path d="M96 186 q4 10 0 20 q-4 10 0 20 M124 186 q4 10 0 20 q-4 10 0 20 M110 182 v56" stroke="#d6c39b" stroke-width="4" fill="none"/>' +
      '<path d="M78 236 l64 0" stroke="#d6c39b" stroke-width="6"/>' +
      // lantern in his right hand
      '<path d="M176 222 v-10 q0 -6 6 -6 q6 0 6 6 v10" fill="none"' + O3 + '/><rect x="166" y="222" width="32" height="40" rx="6" fill="#ffe27a"' + O4 + '/><path d="M170 228 h24 M170 256 h24" stroke="' + O + '" stroke-width="3"/><circle cx="182" cy="242" r="7" fill="#ff9f1c"/>' +
      hands(skin, 46, 254, 170, 252) +
      // neck, ears, head
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      // white hair at the sides
      '<path d="M54 96 q-8 20 2 36 q6 -18 10 -34z M166 96 q8 20 -2 36 q-6 -18 -10 -34z" fill="' + hair + '"' + O3 + '/>' +
      // full white beard and mustache
      '<path d="M58 118 q-2 58 52 62 q54 -4 52 -62 q-10 22 -26 24 q-26 -10 -52 0 q-16 -2 -26 -24z" fill="' + hair + '"' + O4 + '/>' +
      '<path d="M84 132 q26 -12 52 0 q-10 10 -26 6 q-16 4 -26 -6z" fill="#ffffff"' + O3 + '/>' +
      '<path d="M100 142 q10 8 20 0" stroke="#8a2f2f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      eyes(108) + '<path d="M74 92 q12 -8 26 -2 M120 90 q14 -6 26 2" stroke="#d9d9d9" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M71 116 q-4 4 0 8 M149 116 q4 4 0 8" stroke="' + skinD + '" stroke-width="2.5" fill="none"/>' +
      '<ellipse cx="110" cy="124" rx="10" ry="8" fill="' + shade(skin, -.08) + '"' + O3 + '/>' +
      '<ellipse cx="76" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".4"/><ellipse cx="144" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".4"/>' +
      // Harbor Master cap
      '<path d="M54 76 q-4 -40 56 -44 q60 4 56 44 q-56 -12 -112 0z" fill="#22335e"' + O4 + '/>' +
      '<path d="M54 76 q56 -12 112 0 l0 10 q-56 -12 -112 0z" fill="#16213f"' + O4 + '/>' +
      '<path d="M62 86 q48 -10 96 0 q-4 12 -48 12 q-44 0 -48 -12z" fill="#111a33"' + O4 + '/>' +
      '<g transform="translate(110,56)"><path d="M0 -12 a12 12 0 1 1 -.1 0z" fill="#f2c94c"' + O3 + '/><path d="M0 -6 v12 M-6 2 h12 M-5 6 q5 5 10 0" stroke="' + O + '" stroke-width="2.5" fill="none"/></g>');
  }

  /* Dockmaster Ruth: yellow rain jacket, curly hair in a bun, a clipboard for counting cargo. */
  function keeperRuth(size) {
    var skin = '#8d5730', skinD = shade(skin, -.16), hair = '#2a1b12', coat = '#ffcf3f';
    return svg(size || 170,
      '<path d="M78 238 l64 0 l4 60 l-30 0 l-6 -40 l-6 40 l-30 0z" fill="#3a5f9a"' + O4 + '/>' +
      '<path d="M68 304 q0 -14 24 -12 q16 0 16 12z M112 304 q0 -12 16 -12 q24 -2 24 12z" fill="#e5533d"' + O4 + '/>' +
      blob([[110, 36, 20], [96, 40, 12], [124, 40, 12]], hair) +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-4 34 l84 0 l-4 -34 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + coat + '"' + O4 + '/>' +
      '<path d="M110 170 v72" stroke="' + O + '" stroke-width="3"/><circle cx="102" cy="190" r="3.5" fill="' + O + '"/><circle cx="102" cy="210" r="3.5" fill="' + O + '"/><circle cx="102" cy="230" r="3.5" fill="' + O + '"/>' +
      '<path d="M76 166 q34 14 68 0 l4 12 q-38 18 -76 0z" fill="' + shade(coat, -.12) + '"' + O4 + '/>' +
      // clipboard
      '<rect x="148" y="204" width="44" height="56" rx="5" fill="#c98a3a"' + O4 + '/><rect x="154" y="212" width="32" height="42" fill="#fff" stroke="' + O + '" stroke-width="2"/>' +
      '<path d="M158 222 h24 M158 232 h24 M158 242 h16" stroke="#3b8fd9" stroke-width="3"/><rect x="162" y="200" width="16" height="8" rx="2" fill="#9aa1ad" stroke="' + O + '" stroke-width="2"/>' +
      hands(skin, 46, 254, 152, 244) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="114" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="114" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<circle cx="52" cy="130" r="4" fill="#ff9f8a" stroke="' + O + '" stroke-width="2"/><circle cx="168" cy="130" r="4" fill="#ff9f8a" stroke="' + O + '" stroke-width="2"/>' +
      '<ellipse cx="110" cy="106" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M52 104 q-6 -58 58 -60 q64 2 58 60 q-8 -30 -36 -36 q-8 10 -26 8 q-22 -4 -30 -6 q-18 10 -24 34z" fill="' + hair + '"' + O4 + '/>' +
      eyes(110) + '<path d="M106 120 q4 4 8 0" stroke="' + shade(skin, -.4) + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M76 92 q10 -6 22 -2 M122 90 q12 -4 22 2" stroke="' + hair + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="76" cy="132" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/><ellipse cx="144" cy="132" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/>' +
      '<path d="M92 134 q18 18 36 0 q-18 6 -36 0z" fill="#8a2f2f"' + O3 + '/><path d="M98 136 q12 3 24 0" stroke="#fff" stroke-width="3" fill="none"/>');
  }
  function blob(circles, col) {
    return circles.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="' + col + '"' + O4 + '/>'; }).join('');
  }

  /* Tío Tomás, the kite maker: straw hat, red bandana, striped shirt, holding a diamond kite. */
  function keeperTomas(size) {
    var skin = '#b9784b', skinD = shade(skin, -.15), hair = '#3a2a22', shirt = '#4aa3df';
    return svg(size || 170,
      '<path d="M78 238 l64 0 l4 60 l-30 0 l-6 -40 l-6 40 l-30 0z" fill="#c9a36b"' + O4 + '/>' +
      '<path d="M68 304 q0 -14 24 -12 q16 0 16 12z M112 304 q0 -12 16 -12 q24 -2 24 12z" fill="#6b3f1f"' + O4 + '/>' +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-4 34 l84 0 l-4 -34 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + shirt + '"' + O4 + '/>' +
      '<path d="M84 186 h52 M80 204 h60 M78 222 h64" stroke="#fff" stroke-width="5" opacity=".8"/>' +
      '<path d="M88 162 l22 22 l22 -22 l-6 -4 l-16 14 l-16 -14z" fill="#e5533d"' + O3 + '/>' +
      // kite with tail
      '<path d="M182 150 l24 34 l-24 40 l-24 -40z" fill="#ffd23f"' + O4 + '/><path d="M182 150 v74 M158 184 h48" stroke="' + O + '" stroke-width="3"/>' +
      '<path d="M182 150 l24 34 l-24 0z" fill="#e35d8f" opacity=".85"/><path d="M182 184 l-24 0 l24 40z" fill="#e35d8f" opacity=".85"/>' +
      '<path d="M182 224 q-10 14 2 24 q10 10 -2 22" stroke="' + O + '" stroke-width="3" fill="none"/><path d="M176 240 l12 -4 l-2 10z M178 262 l12 -2 l-4 10z" fill="#7fc8a9"' + O3 + '/>' +
      hands(skin, 46, 254, 170, 238) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M56 100 q-4 16 4 30 q4 -14 8 -28z M164 100 q4 16 -4 30 q-4 -14 -8 -28z" fill="' + hair + '"' + O3 + '/>' +
      eyes(110) + '<path d="M76 94 q10 -6 22 -2 M122 92 q12 -4 22 2" stroke="' + hair + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="124" rx="9" ry="7" fill="' + shade(skin, -.08) + '"' + O3 + '/>' +
      '<path d="M84 136 q26 -10 52 0 q-6 8 -26 4 q-20 4 -26 -4z" fill="' + hair + '"' + O3 + '/>' +
      '<path d="M96 146 q14 10 28 0" stroke="#7a2a22" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="76" cy="130" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/><ellipse cx="144" cy="130" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/>' +
      // straw hat
      '<ellipse cx="110" cy="70" rx="84" ry="18" fill="#f2d27a"' + O4 + '/><path d="M66 70 q0 -42 44 -44 q44 2 44 44 q-44 10 -88 0z" fill="#f6dc8c"' + O4 + '/>' +
      '<path d="M68 62 q42 10 84 0 l0 8 q-42 10 -84 0z" fill="#e5533d"' + O3 + '/>');
  }

  /* Fisherman Pete: green rain hat, orange overalls, a striped shirt and a fish on a line. */
  function keeperPete(size) {
    var skin = '#f0c09a', skinD = shade(skin, -.14), hair = '#c0612b';
    return svg(size || 170,
      '<path d="M78 238 l64 0 l4 60 l-30 0 l-6 -40 l-6 40 l-30 0z" fill="#f08a24"' + O4 + '/>' +
      '<path d="M68 304 q0 -14 24 -12 q16 0 16 12z M112 304 q0 -12 16 -12 q24 -2 24 12z" fill="#2f5a3a"' + O4 + '/>' +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-4 34 l84 0 l-4 -34 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="#fff"' + O4 + '/>' +
      '<path d="M66 184 h88 M62 202 h96 M60 220 h100" stroke="#3b6fd9" stroke-width="6"/>' +
      '<path d="M84 196 l52 0 l6 46 l-64 0z" fill="#f08a24"' + O4 + '/><path d="M88 196 l-6 -30 M132 196 l6 -30" stroke="#f08a24" stroke-width="7"/><circle cx="90" cy="202" r="3" fill="' + O + '"/><circle cx="130" cy="202" r="3" fill="' + O + '"/>' +
      // fish on a line
      '<path d="M172 240 v-56" stroke="' + O + '" stroke-width="2"/><path d="M160 196 q14 -16 28 0 q-14 16 -28 0z" fill="#9fd0ff"' + O3 + '/><path d="M188 196 l10 -8 v16z" fill="#9fd0ff"' + O3 + '/><circle cx="166" cy="194" r="2.5" fill="' + O + '"/>' +
      hands(skin, 46, 254, 172, 248) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M58 120 q-2 46 52 50 q54 -4 52 -50 q-10 18 -26 20 q-26 -8 -52 0 q-16 -2 -26 -20z" fill="' + hair + '"' + O4 + '/>' +
      eyes(108) + '<path d="M76 92 q10 -6 22 -2 M122 90 q12 -4 22 2" stroke="' + hair + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="124" rx="10" ry="8" fill="' + shade(skin, -.1) + '"' + O3 + '/>' +
      '<path d="M98 144 q12 8 24 0" stroke="#7a2a22" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="76" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".45"/><ellipse cx="144" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".45"/>' +
      // rain hat
      '<path d="M44 84 q66 -24 132 0 q-4 10 -66 8 q-62 2 -66 -8z" fill="#3a8f4a"' + O4 + '/><path d="M64 80 q0 -44 46 -46 q46 2 46 46 q-46 -10 -92 0z" fill="#4caf5e"' + O4 + '/>');
  }
  /* Doña Luz, the weather watcher: silver hair in a bun, round glasses, purple raincoat, a big thermometer. */
  function keeperLuz(size) {
    var skin = '#d39a6a', skinD = shade(skin, -.15), hair = '#d9d9e3', coat = '#8a5cc7';
    return svg(size || 170,
      '<path d="M78 238 l64 0 l4 60 l-30 0 l-6 -40 l-6 40 l-30 0z" fill="#3a5f9a"' + O4 + '/>' +
      '<path d="M68 304 q0 -14 24 -12 q16 0 16 12z M112 304 q0 -12 16 -12 q24 -2 24 12z" fill="#ffd23f"' + O4 + '/>' +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-6 60 l88 0 l-6 -60 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + coat + '"' + O4 + '/>' +
      '<path d="M110 172 v76" stroke="' + O + '" stroke-width="3"/><circle cx="102" cy="190" r="3.5" fill="#ffd23f" stroke="' + O + '" stroke-width="1.5"/><circle cx="102" cy="212" r="3.5" fill="#ffd23f" stroke="' + O + '" stroke-width="1.5"/><circle cx="102" cy="234" r="3.5" fill="#ffd23f" stroke="' + O + '" stroke-width="1.5"/>' +
      '<path d="M84 162 q26 16 52 0 l4 10 q-30 18 -60 0z" fill="' + shade(coat, .25) + '"' + O3 + '/>' +
      // thermometer
      '<rect x="166" y="150" width="20" height="96" rx="10" fill="#fff"' + O4 + '/><rect x="172" y="186" width="8" height="58" fill="#e5533d"/><circle cx="176" cy="250" r="13" fill="#e5533d"' + O4 + '/>' +
      '<path d="M186 166 h6 M186 182 h6 M186 198 h6 M186 214 h6" stroke="' + O + '" stroke-width="2.5"/>' +
      hands(skin, 46, 254, 176, 228) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<circle cx="52" cy="132" r="4" fill="#7fc8a9" stroke="' + O + '" stroke-width="2"/><circle cx="168" cy="132" r="4" fill="#7fc8a9" stroke="' + O + '" stroke-width="2"/>' +
      '<circle cx="110" cy="30" r="22" fill="' + hair + '"' + O4 + '/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M52 108 q-4 -60 58 -62 q62 2 58 62 q-10 -28 -30 -34 q-14 12 -28 6 q-14 6 -28 -6 q-20 6 -30 34z" fill="' + hair + '"' + O4 + '/>' +
      eyes(110) + '<circle cx="88" cy="110" r="15" fill="none" stroke="' + O + '" stroke-width="3"/><circle cx="132" cy="110" r="15" fill="none" stroke="' + O + '" stroke-width="3"/><path d="M103 108 h14" stroke="' + O + '" stroke-width="3"/>' +
      '<path d="M74 88 q12 -6 24 -2 M122 86 q12 -4 24 2" stroke="#b8b8c8" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="128" rx="8" ry="6" fill="' + shade(skin, -.08) + '"' + O3 + '/>' +
      '<path d="M71 120 q-4 4 0 8 M149 120 q4 4 0 8" stroke="' + skinD + '" stroke-width="2.5" fill="none"/>' +
      '<ellipse cx="74" cy="136" rx="9" ry="5" fill="#ff7a7a" opacity=".4"/><ellipse cx="146" cy="136" rx="9" ry="5" fill="#ff7a7a" opacity=".4"/>' +
      '<path d="M94 140 q16 14 32 0 q-16 5 -32 0z" fill="#8a2f2f"' + O3 + '/>');
  }

  /* Señora Marisol, the fish seller: dark braid with a red flower, coral dress, white apron, a basket of fish. */
  function keeperMarisol(size) {
    var skin = '#c88a5a', skinD = shade(skin, -.15), hair = '#2a1b12', dress = '#ff7f6e';
    return svg(size || 170,
      '<path d="M70 236 l80 0 l10 50 l-100 0z" fill="' + dress + '"' + O4 + '/>' +
      '<path d="M76 286 v14 M144 286 v14" stroke="' + skinD + '" stroke-width="12"/><path d="M62 306 q0 -12 20 -10 q14 0 14 10z M124 306 q0 -10 14 -10 q20 -2 20 10z" fill="#8d5730"' + O4 + '/>' +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-2 18 l80 0 l-2 -18 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + dress + '"' + O4 + '/>' +
      '<path d="M86 172 q24 10 48 0 l8 106 l-64 0z" fill="#ffffff"' + O4 + '/><path d="M90 236 h40" stroke="#9fd0ff" stroke-width="5"/><rect x="98" y="244" width="24" height="16" rx="3" fill="none" stroke="#9fd0ff" stroke-width="3"/>' +
      // braid over the shoulder
      '<path d="M152 120 q18 30 10 70 q-2 12 -10 18" stroke="' + hair + '" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M152 150 l14 6 M154 168 l14 4 M152 186 l12 4" stroke="#4a3426" stroke-width="3"/><circle cx="152" cy="212" r="6" fill="#e5533d"' + O3 + '/>' +
      // basket of fish
      '<path d="M156 226 q2 26 26 26 q24 0 26 -26z" fill="#c98a3a"' + O4 + '/><path d="M162 238 h40 M166 248 h32" stroke="#8d5730" stroke-width="2.5"/>' +
      '<path d="M162 222 q10 -14 22 0 q-12 12 -22 0z" fill="#9fd0ff"' + O3 + '/><path d="M180 218 q10 -14 22 0 q-12 12 -22 0z" fill="#ffd23f"' + O3 + '/>' +
      hands(skin, 46, 254, 160, 230) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<circle cx="52" cy="134" r="5" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/><circle cx="168" cy="134" r="5" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M50 110 q-6 -64 60 -64 q66 0 60 64 q-14 -34 -60 -38 q-46 4 -60 38z" fill="' + hair + '"' + O4 + '/>' +
      // flower
      '<g transform="translate(66,62)">' + [0, 72, 144, 216, 288].map(function (a) { return '<ellipse rx="7" ry="11" cy="-9" fill="#e5533d" transform="rotate(' + a + ')"' + O3 + '/>'; }).join('') + '<circle r="5" fill="#ffd23f" stroke="' + O + '" stroke-width="2"/></g>' +
      eyes(110) + '<path d="M78 92 q10 -6 20 -2 M122 90 q10 -4 20 2" stroke="' + hair + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M80 104 l-6 -4 M140 104 l6 -4" stroke="' + O + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="126" rx="7" ry="5" fill="' + shade(skin, -.08) + '"' + O3 + '/>' +
      '<ellipse cx="76" cy="132" rx="9" ry="5" fill="#ff7a7a" opacity=".45"/><ellipse cx="144" cy="132" rx="9" ry="5" fill="#ff7a7a" opacity=".45"/>' +
      '<path d="M94 138 q16 14 32 0 q-16 5 -32 0z" fill="#c2367a"' + O3 + '/>');
  }
  /* Don Omar, the caravan leader: white head wrap, dark beard, long blue robe with a sash, holding a lantern. */
  function keeperOmar(size) {
    var skin = '#b9805a', skinD = shade(skin, -.15), beard = '#2b1d14', robe = '#2f6fb5';
    return svg(size || 170,
      '<path d="M70 236 l80 0 l12 64 l-104 0z" fill="' + robe + '"' + O4 + '/>' +
      '<path d="M66 306 q0 -10 22 -10 q14 0 14 10z M118 306 q0 -10 14 -10 q22 0 22 10z" fill="#8d5730"' + O4 + '/>' +
      '<path d="M80 164 q-28 4 -36 30 l-10 46 q-2 12 10 14 l10 2 q10 0 12 -10 l6 -28 l-2 18 l80 0 l-2 -18 l6 28 q2 10 12 10 l10 -2 q12 -2 10 -14 l-10 -46 q-8 -26 -36 -30z" fill="' + robe + '"' + O4 + '/>' +
      '<path d="M110 166 v120" stroke="' + shade(robe, -.25) + '" stroke-width="3"/><path d="M68 230 h84 l2 12 h-88z" fill="#ffd23f"' + O3 + '/>' +
      // lantern
      '<path d="M176 196 v-18" stroke="' + O + '" stroke-width="3"/><path d="M164 200 h24 l-3 30 h-18z" fill="#ffe27a"' + O3 + '/><path d="M162 198 h28 M164 232 h24" stroke="' + O + '" stroke-width="4"/><circle cx="176" cy="215" r="5" fill="#ff9f1c"/>' +
      hands(skin, 46, 254, 176, 238) +
      '<path d="M98 148 l24 0 l0 20 q-12 6 -24 0z" fill="' + skinD + '"' + O4 + '/>' +
      '<ellipse cx="52" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/><ellipse cx="168" cy="116" rx="11" ry="14" fill="' + skin + '"' + O4 + '/>' +
      '<ellipse cx="110" cy="108" rx="58" ry="56" fill="' + skin + '"' + O4 + '/>' +
      '<path d="M56 116 q-2 52 54 54 q56 -2 54 -54 q-12 22 -28 24 q-26 -10 -52 0 q-16 -2 -28 -24z" fill="' + beard + '"' + O4 + '/>' +
      eyes(108) + '<path d="M76 92 q10 -6 22 -2 M122 90 q12 -4 22 2" stroke="' + beard + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="110" cy="124" rx="9" ry="7" fill="' + shade(skin, -.1) + '"' + O3 + '/>' +
      '<path d="M96 144 q14 10 28 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="76" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/><ellipse cx="144" cy="128" rx="9" ry="5" fill="#ff7a7a" opacity=".35"/>' +
      // head wrap
      '<path d="M50 92 q4 -56 60 -58 q56 2 60 58 q-60 -16 -120 0z" fill="#ffffff"' + O4 + '/><path d="M54 84 q56 -18 112 0" stroke="#d9d4c6" stroke-width="4" fill="none"/><path d="M64 70 q46 -14 92 0" stroke="#d9d4c6" stroke-width="3" fill="none"/>' +
      '<path d="M50 92 q-8 30 4 60 l10 -4 q-6 -26 0 -52z" fill="#ffffff"' + O3 + '/><path d="M106 40 h8 v16 h-8z" fill="#e5533d"' + O3 + '/>');
  }
  function keeper(kind, size) {
    if (kind === 'omar') return keeperOmar(size);
    if (kind === 'luz') return keeperLuz(size);
    if (kind === 'marisol') return keeperMarisol(size);
    if (kind === 'tomas') return keeperTomas(size);
    if (kind === 'pete') return keeperPete(size);
    if (kind === 'eli') return keeperEli(size);
    if (kind === 'ruth') return keeperRuth(size);
    return Art.keeperRosa(size);
  }

  /* The boat the child builds, one part per harbor district (22 steps: the K5 yard + 21 chapters). */
  var BOAT_PARTS = ['Keel', 'Bow post', 'Stern post', 'Ribs', 'More ribs', 'First planks', 'Second planks', 'Third planks', 'Top planks', 'Paint', 'Bench seat',
    'Oarlocks', 'Oars', 'Mast', 'Boom', 'Sail', 'Rudder', 'Tiller', 'Anchor', 'Name board', 'Flag', 'Lantern'];
  function boat(parts, size, name) {
    var n = parts, has = function (i) { return n > i; }, out = '';
    var hullCol = has(9) ? '#e5533d' : '#c99a62', wood = '#b07a43', woodD = '#8a5a2b';
    out += '<svg viewBox="0 0 320 240" width="' + (size || 300) + '" height="' + ((size || 300) * 0.75) + '" aria-hidden="true">';
    // building stand (shown until the boat is painted)
    if (!has(9)) out += '<path d="M60 214 l20 -24 M260 214 l-20 -24 M110 214 l10 -20 M210 214 l-10 -20" stroke="#7b5b3a" stroke-width="8" stroke-linecap="round"/><path d="M30 216 h260" stroke="#7b5b3a" stroke-width="6"/>';
    else out += '<path d="M10 206 q40 -10 80 0 t80 0 t80 0 t70 0 v34 h-310z" fill="#2ab3e6"' + O3 + '/>';
    if (has(0)) out += '<path d="M70 190 h180" stroke="' + woodD + '" stroke-width="10" stroke-linecap="round"/>';
    if (has(1)) out += '<path d="M250 190 q22 -30 26 -66" stroke="' + woodD + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
    if (has(2)) out += '<path d="M70 190 q-14 -24 -14 -60" stroke="' + woodD + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
    var ribs = has(4) ? [90, 115, 140, 165, 190, 215, 238] : has(3) ? [100, 150, 200] : [];
    ribs.forEach(function (x) { out += '<path d="M' + x + ' 190 q-6 -30 -2 -62" stroke="' + wood + '" stroke-width="6" fill="none" stroke-linecap="round"/>'; });
    // hull planks: 4 rows from the bottom up
    var rows = [[190, 172], [172, 156], [156, 140], [140, 126]];
    rows.forEach(function (r, i) {
      if (!has(5 + i)) return;
      out += '<path d="M' + (70 - i * 4) + ' ' + r[0] + ' L' + (64 - i * 3) + ' ' + r[1] + ' L' + (266 + i * 3) + ' ' + r[1] + ' L' + (252 + i * 6) + ' ' + r[0] + 'z" fill="' + (has(9) ? (i === 3 ? '#ffffff' : hullCol) : (i % 2 ? '#c99a62' : '#d8ad75')) + '"' + O3 + '/>';
    });
    if (has(9)) out += '<path d="M60 128 L270 128" stroke="#22335e" stroke-width="5"/>';
    if (has(10)) out += '<path d="M130 132 h60 v-8 h-60z" fill="' + wood + '"' + O3 + '/>';
    if (has(11)) out += '<circle cx="110" cy="124" r="5" fill="#9aa1ad"' + O3 + '/><circle cx="210" cy="124" r="5" fill="#9aa1ad"' + O3 + '/>';
    if (has(12)) out += '<path d="M110 124 l-56 52 M210 124 l56 52" stroke="' + wood + '" stroke-width="6" stroke-linecap="round"/><ellipse cx="50" cy="180" rx="10" ry="5" fill="' + wood + '"' + O3 + ' transform="rotate(-42 50 180)"/><ellipse cx="270" cy="180" rx="10" ry="5" fill="' + wood + '"' + O3 + ' transform="rotate(42 270 180)"/>';
    if (has(13)) out += '<path d="M160 126 V26" stroke="' + woodD + '" stroke-width="8" stroke-linecap="round"/>';
    if (has(14)) out += '<path d="M160 112 H236" stroke="' + woodD + '" stroke-width="6" stroke-linecap="round"/>';
    if (has(15)) out += '<path d="M164 30 Q214 70 232 108 L164 108z" fill="#fbfbf5"' + O3 + '/><path d="M174 60 q16 20 24 40" stroke="#d7e3ea" stroke-width="4" fill="none"/>';
    if (has(16)) out += '<path d="M58 140 q-18 10 -10 40 l10 -6z" fill="' + wood + '"' + O3 + '/>';
    if (has(17)) out += '<path d="M60 138 l34 -12" stroke="' + woodD + '" stroke-width="5" stroke-linecap="round"/>';
    if (has(18)) out += '<g transform="translate(250,150) scale(.55)">' + '<circle cx="0" cy="-26" r="7" fill="none" stroke="#22335e" stroke-width="5"/><path d="M0 -19 v40 M-14 -10 h28 M-20 8 q4 18 20 18 q16 0 20 -18" stroke="#22335e" stroke-width="5" fill="none" stroke-linecap="round"/></g>';
    if (has(19)) out += '<rect x="96" y="144" width="96" height="22" rx="6" fill="#fff6e0"' + O3 + '/><text x="144" y="160" text-anchor="middle" font-size="14" font-weight="800" fill="#22335e">' + String(name || 'MY BOAT').slice(0, 12).replace(/[<&]/g, '') + '</text>';
    if (has(20)) out += '<path d="M160 28 l30 8 l-30 10z" fill="#3b8fd9"' + O3 + '/><path d="M166 34 h12" stroke="#fff" stroke-width="3"/>';
    if (has(21)) out += '<circle cx="160" cy="18" r="16" fill="#fff3a0" opacity=".7"/><rect x="152" y="10" width="16" height="18" rx="4" fill="#ffd23f"' + O3 + '/>';
    if (!n) out += '<text x="160" y="150" text-anchor="middle" font-size="18" font-weight="800" fill="#7b5b3a">An empty boat stand</text>';
    return out + '</svg>';
  }

  /* The harbor in the background of harbor screens: docks, a little town, fishing boats, gulls. */
  function harborScene() {
    var v = '<svg class="bgscene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<defs><linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8f2"/><stop offset="1" stop-color="#fde8c8"/></linearGradient>' +
      '<linearGradient id="hsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a9fd6"/><stop offset="1" stop-color="#1f7fb8"/></linearGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#hsky)"/><circle cx="1360" cy="150" r="64" fill="#ffe46b" stroke="#ffc23c" stroke-width="6"/>' +
      '<g class="drift">' + Art.cloud(300, 120, 1) + Art.cloud(900, 80, .8) + '</g>' +
      // hills and town
      '<path d="M0 470 q200 -120 420 -40 q220 -110 460 -10 q260 -90 720 10 v80 h-1600z" fill="#7fc97a"' + O4 + '/>';
    [[120, 420, '#e5533d'], [230, 404, '#3b8fd9'], [340, 418, '#f2a01e'], [980, 412, '#8d4fc2'], [1100, 400, '#2fa35a'], [1220, 414, '#e5533d']].forEach(function (h) { v += house(h[0], h[1], h[2], 1); });
    v += '<g transform="translate(1440,470)">' + Art.lighthouseO(0, 0, .9, true) + '</g>';
    v += '<rect y="480" width="1600" height="420" fill="url(#hsea)"/>';
    for (var w = 0; w < 30; w++) { var wx = (w * 211) % 1560 + 20, wy = 520 + (w * 67) % 340; v += '<path d="M' + wx + ' ' + wy + ' q12 -8 24 0 t24 0" stroke="#bfeaff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>'; }
    // long wooden dock
    v += '<path d="M0 640 h720 v26 h-720z" fill="#c99a62"' + O4 + '/>';
    for (var px = 30; px < 720; px += 70) v += '<rect x="' + px + '" y="664" width="16" height="70" fill="#8a5a2b"' + O3 + '/>';
    for (var bx = 0; bx < 720; bx += 36) v += '<path d="M' + bx + ' 640 v26" stroke="#8a5a2b" stroke-width="2"/>';
    v += '<g transform="translate(980,590)">' + fishingBoat('#3b8fd9') + '</g><g transform="translate(1230,640) scale(.8)">' + fishingBoat('#ffd23f') + '</g>';
    v += gullShape(560, 220) + gullShape(640, 260) + gullShape(1120, 200);
    return v + '</svg>';
  }
  function gullShape(x, y) { return '<path d="M' + x + ' ' + y + ' q12 -12 24 0 q12 -12 24 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>'; }
  function fishingBoat(col) {
    return '<path d="M-90 0 h180 l-26 40 h-128z" fill="' + col + '"' + O4 + '/><path d="M-90 0 h180" stroke="#fff" stroke-width="6"/>' +
      '<rect x="-30" y="-46" width="60" height="46" fill="#fbfbf5"' + O4 + '/><rect x="-18" y="-36" width="16" height="14" fill="#9fd8ff"' + O3 + '/><rect x="6" y="-36" width="16" height="14" fill="#9fd8ff"' + O3 + '/>' +
      '<path d="M40 0 v-80 M40 -76 l40 60" stroke="' + O + '" stroke-width="5" fill="none"/>';
  }
  function house(x, y, col, s) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')"><rect x="-40" y="-50" width="80" height="60" fill="' + col + '"' + O4 + '/>' +
      '<path d="M-50 -48 l50 -42 l50 42z" fill="#7b4a2a"' + O4 + '/><rect x="-10" y="-20" width="20" height="30" fill="#5b3a1e"' + O3 + '/><rect x="-32" y="-38" width="16" height="14" fill="#fff6c2"' + O3 + '/><rect x="16" y="-38" width="16" height="14" fill="#fff6c2"' + O3 + '/></g>';
  }
  /* A building for one district on the town map */
  function landmarkH(kind, col) {
    switch (kind) {
      case 'shed': return house(0, 0, '#c98a3a', 1) + '<path d="M-20 4 h40" stroke="#fff" stroke-width="3"/>';
      case 'dock': return '<path d="M-60 0 h120 v12 h-120z" fill="#c99a62"' + O3 + '/><path d="M-50 12 v24 M0 12 v24 M50 12 v24" stroke="#8a5a2b" stroke-width="8"/><g transform="translate(30,-8) scale(.35)">' + fishingBoat('#e5533d') + '</g>';
      case 'pier': return '<path d="M-60 0 h120 v12 h-120z" fill="#c99a62"' + O3 + '/>' + gullShape(-24, -30) + '<g transform="translate(0,-12)">' + Art.icon('gull', 50).replace('<svg', '<svg x="-25" y="-30"') + '</g>';
      case 'market': return house(0, 0, '#ffffff', 1) + '<path d="M-44 -50 h88 l-6 14 h-76z" fill="#e5533d"' + O3 + '/>';
      case 'loft': return house(0, 0, '#5fa8d3', 1.1);
      case 'bakery': return house(0, 0, '#f6c99a', 1) + '<g transform="translate(26,-74)">' + Art.icon('loaf', 34).replace('<svg', '<svg x="-17" y="-17"') + '</g>';
      case 'shop': return house(0, 0, '#2fa35a', 1) + '<circle cx="0" cy="-66" r="12" fill="#f2c94c"' + O3 + '/>';
      case 'clock': return '<rect x="-24" y="-90" width="48" height="100" fill="#d9c7a7"' + O4 + '/><path d="M-30 -88 l30 -30 l30 30z" fill="#7b4a2a"' + O4 + '/><circle cx="0" cy="-56" r="16" fill="#fff"' + O3 + '/><path d="M0 -56 v-10 M0 -56 h8" stroke="' + O + '" stroke-width="3"/>';
      case 'hill': return '<path d="M-70 10 q70 -90 140 0z" fill="#ffffff"' + O4 + '/><path d="M-20 -20 l30 -10" stroke="#e5533d" stroke-width="6" stroke-linecap="round"/>';
      case 'pond': return '<ellipse cx="0" cy="0" rx="64" ry="22" fill="#cfefff"' + O4 + '/><path d="M-30 -2 q10 -6 20 0" stroke="#fff" stroke-width="4" fill="none"/>';
      case 'yard': return '<path d="M-60 10 h120" stroke="#7b5b3a" stroke-width="6"/><path d="M-40 10 l14 -20 M40 10 l-14 -20" stroke="#7b5b3a" stroke-width="6"/><path d="M-50 -14 q50 26 100 0 l-10 14 h-80z" fill="#d8ad75"' + O3 + '/>';
      case 'kite': return '<path d="M0 -90 l22 30 l-22 34 l-22 -34z" fill="#ff6fa8"' + O3 + '/><path d="M0 -26 q10 20 -6 40 q10 10 0 30" stroke="' + O + '" stroke-width="2.5" fill="none"/><ellipse cx="0" cy="10" rx="60" ry="10" fill="#7fc97a"' + O3 + '/>';
      case 'garden': return '<ellipse cx="0" cy="6" rx="60" ry="14" fill="#8a5a2b"' + O3 + '/>' + [-36, -12, 12, 36].map(function (x) { return '<circle cx="' + x + '" cy="-10" r="10" fill="' + (x % 24 ? '#ff6fa8' : '#ffd23f') + '"' + O3 + '/><path d="M' + x + ' 0 v6" stroke="#2fa35a" stroke-width="4"/>'; }).join('');
      case 'bay': return '<g transform="scale(.45)">' + fishingBoat('#8d4fc2') + '</g><path d="M-14 -50 l26 20 l-26 0z" fill="#ffd23f"' + O3 + '/>';
      case 'sundial': return '<ellipse cx="0" cy="6" rx="40" ry="12" fill="#d9d4c6"' + O3 + '/><path d="M0 4 l20 -34 v34z" fill="#9aa1ad"' + O3 + '/>';
      case 'quay': return '<g transform="translate(0,10)">' + Art.lighthouseO(0, 0, .55, true) + '</g>';
      case 'warehouse': return house(0, 0, '#9ea8b8', 1.2);
      case 'rope': return '<path d="M-60 -10 q30 20 60 0 t60 0" stroke="#c98a3a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-60 -10 q30 20 60 0 t60 0" stroke="#8a5a2b" stroke-width="3" fill="none" stroke-dasharray="6 6"/>';
      case 'fleet': return '<g transform="translate(-22,0) scale(.32)">' + fishingBoat('#3b8fd9') + '</g><g transform="translate(26,8) scale(.3)">' + fishingBoat('#e5533d') + '</g>';
      case 'store': return house(0, 0, '#ffb3a7', 1.1);
    }
    return house(0, 0, col || '#e5533d', 1);
  }

  /* extra icons for the hands-on activities */
  var baseIcon = Art.icon, S3 = ' stroke="#2b2a3a" stroke-width="2.5" stroke-linejoin="round"';
  var EXTRA = {
    log: function (c) { return '<rect x="8" y="22" width="42" height="18" rx="9" fill="' + (c || '#a0652d') + '"' + S3 + '/><ellipse cx="50" cy="31" rx="7" ry="9" fill="#e8c27a"' + S3 + '/><path d="M47 31 a3 3 0 1 0 6 0" stroke="#a0652d" stroke-width="1.5" fill="none"/>'; },
    letter: function (c) { return '<rect x="8" y="16" width="44" height="30" rx="3" fill="' + (c || '#fff') + '"' + S3 + '/><path d="M8 17 L30 34 L52 17" fill="none"' + S3 + '/><rect x="40" y="20" width="8" height="8" fill="#e5533d"/>'; },
    sail: function (c) { return '<path d="M14 50 L30 6 L46 50z" fill="' + (c || '#fbfbf5') + '"' + S3 + '/><path d="M30 6 V54" stroke="#8a5a2b" stroke-width="3"/>'; },
    basket: function () { return '<path d="M6 26 h48 l-6 28 h-36z" fill="#d8ad75"' + S3 + '/><path d="M12 34 h36 M14 42 h32 M16 50 h28" stroke="#a0652d" stroke-width="2"/><path d="M14 26 q16 -24 32 0" fill="none" stroke="#a0652d" stroke-width="4"/>'; },
    logpile: function () { return '<rect x="6" y="36" width="48" height="12" rx="6" fill="#a0652d"' + S3 + '/><rect x="12" y="24" width="36" height="12" rx="6" fill="#b5763a"' + S3 + '/><rect x="18" y="12" width="24" height="12" rx="6" fill="#a0652d"' + S3 + '/>'; },
    mailbag: function () { return '<path d="M10 20 q20 -10 40 0 l4 32 q-24 8 -48 0z" fill="#3b6fd9"' + S3 + '/><rect x="22" y="28" width="16" height="10" fill="#fff"' + S3 + '/>'; },
    jar: function () { return '<rect x="12" y="14" width="36" height="40" rx="8" fill="#d9f0ff" opacity=".9"' + S3 + '/><rect x="14" y="8" width="32" height="8" rx="3" fill="#9aa1ad"' + S3 + '/>'; },
    worm: function () { return '<path d="M8 40 q8 -16 16 0 t16 0 t14 -6" fill="none" stroke="#ff8fb1" stroke-width="9" stroke-linecap="round"/><circle cx="53" cy="33" r="2" fill="#2b2a3a"/>'; },
    crateicon: function () { return baseIcon('crate', 60).replace(/<\/?svg[^>]*>/g, ''); }
  };
  Art.icon = function (kind, size, color) {
    if (!EXTRA[kind]) return baseIcon(kind, size, color);
    size = size || 46; return '<svg viewBox="0 0 60 60" width="' + size + '" height="' + size + '" aria-hidden="true">' + EXTRA[kind](color) + '</svg>';
  };
  Art.keeper = keeper; Art.keeperOmar = keeperOmar; Art.keeperLuz = keeperLuz; Art.keeperMarisol = keeperMarisol; Art.keeperTomas = keeperTomas; Art.keeperPete = keeperPete; Art.keeperEli = keeperEli; Art.keeperRuth = keeperRuth;
  Art.boat = boat; Art.BOAT_PARTS = BOAT_PARTS; Art.harborScene = harborScene; Art.house = house; Art.landmarkH = landmarkH; Art.fishingBoat = fishingBoat;
  /* the child's figure in the harbor course: rank decides the outfit */
  Art.sailor = function (c, size, rank) { var x = {}; Object.keys(c || {}).forEach(function (k) { x[k] = c[k]; }); x.rank = rank || 0; return Art.captain(x, size); };
})();
