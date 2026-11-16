/* Help for every skill:
   - GUIDES: a picture guide ("Show me how") with numbered steps; new concepts also get a video link (needs internet).
   - walk(prob): an interactive step-by-step walkthrough built from the problem's own numbers.
   - why(prob): a "How do you know?" follow-up for multiple-choice problems.
   Video links are kept together here so they are easy to update if a video ever moves. */
var Help = (function () {
  var F = function (a, b) { return U.frac(a, b); };
  var NAMES = { 2: 'halves', 3: 'thirds', 4: 'fourths', 6: 'sixths', 8: 'eighths' };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

  /* Stacked (column) addition or subtraction drawing.
     o: { hl: 'ones'|'tens', carry: '1', topT, topO (regrouped digits), strikeT, strikeO, rT, rO } */
  function col(a, b, op, o) {
    o = o || {};
    var aT = Math.floor(a / 10), aO = a % 10, bT = Math.floor(b / 10), bO = b % 10;
    function cell(v, which, extra) { return '<span class="cm-c' + (o.hl === which ? ' hl' : '') + (extra || '') + '">' + (v === undefined || v === null ? '' : v) + '</span>'; }
    return '<div class="colmath">' +
      '<div class="cm-r cm-small">' + cell('') + cell(o.carry || o.topT || '', 'tens') + cell(o.topO || '', 'ones') + '</div>' +
      '<div class="cm-r">' + cell('') + cell(o.strikeT ? '<s>' + aT + '</s>' : aT, 'tens') + cell(o.strikeO ? '<s>' + aO + '</s>' : aO, 'ones') + '</div>' +
      '<div class="cm-r">' + cell(op) + cell(bT, 'tens') + cell(bO, 'ones') + '</div>' +
      '<div class="cm-line"></div>' +
      '<div class="cm-r">' + cell('') + cell(o.rT, 'tens') + cell(o.rO, 'ones') + '</div>' +
      '<div class="cm-r cm-lbl"><span></span><span>tens</span><span>ones</span></div></div>';
  }
  /* groups of dots for multiplication; the first `lit` groups are highlighted */
  function dots(groups, each, lit) {
    var h = '<div class="dotgroups">';
    for (var g = 0; g < groups; g++) {
      h += '<div class="dg' + (g < lit ? ' on' : '') + '">';
      for (var d = 0; d < each; d++) h += '<i></i>';
      h += '</div>';
    }
    return h + '</div>';
  }
  function big(t) { return '<div style="font-size:2.6rem;font-weight:800">' + t + '</div>'; }
  function vis(prob) { return String(prob.visual || '').replace(/\sid="[^"]*"/g, ''); }
  function num(answer, label) { return { type: 'number', answer: answer, label: label }; }
  function pick(opts, answer) { return { type: 'choice', options: opts.map(function (o) { return typeof o === 'string' ? { html: o, value: o } : o; }), answer: answer }; }
  function finalChoice(prob) { return { type: 'choice', options: prob.choices, answer: prob.answer }; }

  /* "Watch a video" links: only from the family's approved channels (The Singing Walrus, Super Simple Songs,
     NUMBEROCK, Preschool Prep Company, Scratch Garden). Each link was checked. */
  var VIDEOS = {
    equal: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' },
    write: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' },
    cmpLike: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' },
    cmpUnit: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' },
    set: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' },
    hour: { label: 'The Telling Time Song (Scratch Garden)', url: 'https://www.youtube.com/watch?v=w9QK_4vrnJ0' },
    clock: { label: 'The Telling Time Song (Scratch Garden)', url: 'https://www.youtube.com/watch?v=w9QK_4vrnJ0' }
  };

  var GUIDES = {
    equal: { title: 'Equal parts and their names', steps: [
      ['Equal parts are all exactly the same size.', function () { return Models.shape({ kind: 'circle', n: 4, shaded: 0, size: 120 }); }],
      ['If one piece is bigger than the others, the parts are NOT equal.', function () { return Models.shape({ kind: 'rect', n: 3, shaded: 0, unequal: true, size: 120 }); }],
      ['Count the equal parts to name them: 2 halves, 3 thirds, 4 fourths, 6 sixths, 8 eighths.', function () { return [2, 3, 4].map(function (n) { return '<div class="center">' + Models.shape({ kind: 'circle', n: n, shaded: 1, size: 70 }) + '<b>' + NAMES[n] + '</b></div>'; }).join(''); }],
      ['All the parts together make 1 whole.', function () { return Models.shape({ kind: 'circle', n: 4, shaded: 4, size: 90 }) + big(F(4, 4) + ' = 1'); }]
    ] },
    partition: { title: 'Equal parts, different ways', steps: [
      ['Fourths means 4 EQUAL parts. A square can be cut into fourths in different ways.', function () { return Models.shape({ kind: 'square', n: 4, shaded: 1, size: 90 }) + Models.shape({ kind: 'square', n: 4, shaded: 1, size: 90, cut: 'horiz' }) + Models.shape({ kind: 'square', n: 4, shaded: 1, size: 90, grid: true }) + Models.shape({ kind: 'square', n: 4, shaded: 1, size: 90, cut: 'diag' }); }],
      ['Every one of these shows fourths: 4 parts, all the same size.', function () { return ''; }],
      ['Watch out! If the parts are different sizes, or there are not 4 of them, it is NOT fourths.', function () { return Models.shape({ kind: 'square', n: 4, shaded: 0, unequal: true, size: 90 }) + Models.shape({ kind: 'square', n: 3, shaded: 0, size: 90 }); }]
    ] },
    write: { title: 'Writing a fraction', steps: [
      ['Count ALL the equal parts. That is the bottom number (the denominator).', function () { return Models.shape({ kind: 'rect', n: 4, shaded: 3, size: 120 }) + big(F('?', '<span style="color:#e5533d">4</span>')); }],
      ['Count the SHADED parts. That is the top number (the numerator).', function () { return big(F('<span style="color:#3b8fd9">3</span>', '4')); }],
      ['Read it: three fourths. To color a fraction, color as many parts as the top number says.', function () { return Models.shape({ kind: 'circle', n: 4, shaded: 3, size: 100 }); }]
    ] },
    prob: { title: 'More likely or less likely?', steps: [
      ['Count the marbles of each color.', function () { return Models.jar({ '#e5533d': 5, '#3b8fd9': 2 }); }],
      ['More marbles of a color = MORE likely. Fewer = LESS likely.', function () { return big('5 red, 2 blue'); }],
      ['No marbles of a color = IMPOSSIBLE. Every marble the same color = CERTAIN.', function () { return ''; }]
    ] },
    cmpLike: { title: 'Comparing fractions with the same bottom number', steps: [
      ['First check: are the bottom numbers the same? Then the parts are the same size.', function () { return Models.barStack([{ n: 8, k: 3, text: F(3, 8) }, { n: 8, k: 5, text: F(5, 8), fill: '#8fd3ff' }]); }],
      ['Now compare the top numbers. More parts = bigger fraction.', function () { return big(F(5, 8) + ' &gt; ' + F(3, 8)); }],
      ['The open mouth of the sign always faces the bigger number.', function () { return big('5 &gt; 3 &nbsp; 3 &lt; 5'); }]
    ] },
    cmpUnit: { title: 'Comparing 1/2, 1/3, 1/4 …', steps: [
      ['Start with two wholes that are the same size.', function () { return Models.barStack([{ n: 2, k: 1, text: F(1, 2) }, { n: 4, k: 1, text: F(1, 4), fill: '#8fd3ff' }]); }],
      ['The more pieces you cut, the SMALLER each piece gets.', function () { return Models.barStack([{ n: 2, k: 1, text: F(1, 2) }, { n: 4, k: 1, text: F(1, 4), fill: '#8fd3ff' }, { n: 8, k: 1, text: F(1, 8), fill: '#b9f0c9' }]); }],
      ['So when the top number is 1, the SMALLER bottom number is the BIGGER piece.', function () { return big(F(1, 2) + ' &gt; ' + F(1, 4) + ' &gt; ' + F(1, 8)); }]
    ] },
    set: { title: 'Fraction of a group', steps: [
      ['Count ALL the things in the group. That is the bottom number.', function () { return Models.set(5, 2, 'fish', '#3b8fd9', '#9fb3c2'); }],
      ['Count the ones the question asks about. That is the top number.', function () { return big('2 blue'); }],
      ['Two fifths of the fish are blue.', function () { return big(F(2, 5)); }]
    ] },
    share: { title: 'Fair shares', steps: [
      ['Make one spot for each person or group.', function () { return Models.plates(3, 1, 'loaf'); }],
      ['Deal out one to each spot, again and again, until they are all gone.', function () { return Models.plates(3, 4, 'loaf'); }],
      ['Count one spot: 12 shared by 3 is 4 each. Each spot gets 1 of 3 equal groups, so each gets one third.', function () { return big('3 × 4 = 12 &nbsp; ' + F(1, 3)); }]
    ] },
    graph: { title: 'Reading a circle graph', steps: [
      ['The whole circle is everybody. Each color is one choice.', function () { return Models.circleGraph([{ label: 'Apple', parts: 2, color: '#e5533d' }, { label: 'Peach', parts: 1, color: '#f7d046' }, { label: 'Cherry', parts: 1, color: '#c2367a' }], 4, 'Favorite pies'); }],
      ['Match each color to the key. The biggest slice is the most popular.', function () { return ''; }],
      ['For a fraction: count all the equal parts (bottom), then the parts for that choice (top).', function () { return big('Apple = ' + F(2, 4)); }]
    ] },
    hour: { title: 'Fractions of an hour and a foot', steps: [
      ['One hour is 60 minutes: one trip all the way around the clock.', function () { return Models.clockFraction(4); }],
      ['Cut the clock into 4 equal parts. Each fourth is 15 minutes. Count by 15s: 15, 30, 45, 60.', function () { return Models.clockFraction(1) + Models.clockFraction(2) + Models.clockFraction(3); }],
      ['1 foot is 12 inches. Half a foot is 6 inches, because 6 + 6 = 12.', function () { return Models.ruler(12, 6); }]
    ] },
    add2: { title: 'Adding 2-digit numbers', scratch: true, steps: [
      ['Grab your scratch paper! Stack the numbers: ones under ones, tens under tens.', function () { return col(38, 47, '+'); }],
      ['Add the ONES first: 8 + 7 = 15.', function () { return col(38, 47, '+', { hl: 'ones' }); }],
      ['15 ones is 1 ten and 5 ones. Write 5 in the ones place. Carry the 1 to the top of the tens.', function () { return col(38, 47, '+', { carry: '1', rO: 5, hl: 'ones' }); }],
      ['Add the TENS: 1 + 3 + 4 = 8. The answer is 85!', function () { return col(38, 47, '+', { carry: '1', rT: 8, rO: 5, hl: 'tens' }); }]
    ] },
    sub2: { title: 'Subtracting 2-digit numbers', scratch: true, steps: [
      ['Grab your scratch paper! Stack the numbers: ones under ones, tens under tens.', function () { return col(52, 27, '−'); }],
      ['Look at the ONES: can you take 7 from 2? No! Borrow 1 ten. 5 tens become 4 tens, and 2 ones become 12 ones.', function () { return col(52, 27, '−', { topT: '4', topO: '12', strikeT: 1, strikeO: 1, hl: 'ones' }); }],
      ['Subtract the ones: 12 − 7 = 5.', function () { return col(52, 27, '−', { topT: '4', topO: '12', strikeT: 1, strikeO: 1, rO: 5, hl: 'ones' }); }],
      ['Subtract the tens: 4 − 2 = 2. The answer is 25. Check: 25 + 27 = 52.', function () { return col(52, 27, '−', { topT: '4', topO: '12', strikeT: 1, strikeO: 1, rT: 2, rO: 5, hl: 'tens' }); }]
    ] },
    mul: { title: 'Multiplying', scratch: true, steps: [
      ['3 × 4 means 3 groups of 4.', function () { return dots(3, 4, 0); }],
      ['Skip count by 4, three times: 4, 8, 12. So 3 × 4 = 12.', function () { return dots(3, 4, 3); }],
      ['Tricks: × 0 is always 0. × 1 stays the same. × 2 is double. × 5 counts by 5s. × 10 puts a 0 on the end.', function () { return big('7 × 10 = 70'); }]
    ] },
    clock: { title: 'Telling time', steps: [
      ['The SHORT hand shows the hour.', function () { return Models.clock(3, 20); }],
      ['The LONG hand shows the minutes. Count by 5s from the 12 to where it points.', function () { return big('5, 10, 15, 20'); }],
      ['Write the hour, a colon, then the minutes: 3:20.', function () { return big('3:20'); }]
    ] }
  };
  Object.keys(VIDEOS).forEach(function (k) { if (GUIDES[k]) GUIDES[k].video = VIDEOS[k]; });

  var GUIDE_OF = { equalOrNot: 'equal', countParts: 'equal', nameParts: 'equal', wholeFraction: 'equal', shadedFraction: 'write', shadeTo: 'write',
    whichShows: 'write', partitionWays: 'partition', probability: 'prob', compareLike: 'cmpLike', compareUnit: 'cmpUnit', fractionWord: 'cmpUnit', setFraction: 'set', shadeSet: 'set',
    fairShare: 'share', circleGraph: 'graph', hourFraction: 'hour', add2: 'add2', sub2: 'sub2', mulFact: 'mul', clockTime: 'clock' };
  function guideKey(skill, prob) {
    if (skill === 'fractionWord' && prob && prob.data && prob.data.t === 0) return 'write';
    return GUIDE_OF[skill];
  }

  /* ---------------- step-by-step walkthroughs ---------------- */
  function walk(prob) {
    if (prob.walk) return prob.walk; // generators can supply their own walkthrough (Grade 1 skill bank)
    var d = prob.data || {}, S = [];
    if (prob.type === 'lab') return [{ say: 'Look at your tally chart. Count the marks in each row. The row with the most marks is the color you pulled the most. If they are the same, it is a tie.', show: '', back: true }];
    switch (prob.skill) {
      case 'partitionWays':
        S.push({ say: 'We need ' + NAMES[d.n] + ', which means ' + d.n + ' EQUAL parts. How many parts should each square have?', show: '', ask: num(d.n) });
        S.push({ say: 'Now check each square. Does it have ' + d.n + ' parts? Are all the parts the same size? Skip a square if the parts are different sizes.', show: Models.shape({ kind: 'square', n: d.n, shaded: 0, unequal: true, size: 110 }) + '<div style="font-size:2rem">✘</div>' });
        S.push({ say: 'Remember: a square can be cut up and down, side to side, or corner to corner. Now tap every square that shows ' + NAMES[d.n] + '!', show: Models.shape({ kind: 'square', n: d.n, shaded: 0, size: 100 }) + Models.shape({ kind: 'square', n: d.n, shaded: 0, size: 100, cut: 'horiz' }) + Models.shape({ kind: 'square', n: d.n, shaded: 0, size: 100, cut: 'diag' }), back: true });
        return S;
      case 'add2': {
        var a = d.a, b = d.b, s1 = a % 10 + b % 10, carry = s1 >= 10 ? 1 : 0, sT = Math.floor(a / 10) + Math.floor(b / 10) + carry;
        S.push({ say: 'Grab your scratch paper and pencil! Write ' + a + ' on top and ' + b + ' under it. Line up the ones and the tens. Press Next when it is written.', show: col(a, b, '+') });
        S.push({ say: 'Start with the ONES column. What is ' + (a % 10) + ' + ' + (b % 10) + '?', show: col(a, b, '+', { hl: 'ones' }), ask: num(s1) });
        if (carry) S.push({ say: s1 + ' ones is 1 ten and ' + (s1 - 10) + ' ones. Carry the 1 to the tens. Which digit do you write in the ONES place?', show: col(a, b, '+', { carry: '1', hl: 'ones' }), ask: num(s1 - 10) });
        S.push({ say: 'Now the TENS column. What is ' + (carry ? '1 + ' : '') + Math.floor(a / 10) + ' + ' + Math.floor(b / 10) + '?', show: col(a, b, '+', { carry: carry ? '1' : '', rO: s1 % 10, hl: 'tens' }), ask: num(sT) });
        S.push({ say: 'Read the answer from your paper. What is ' + a + ' + ' + b + '?', show: col(a, b, '+', { carry: carry ? '1' : '', rO: s1 % 10, rT: sT }), ask: num(a + b), final: true });
        break;
      }
      case 'sub2': {
        var a2 = d.a, b2 = d.b, aT = Math.floor(a2 / 10), aO = a2 % 10, bT = Math.floor(b2 / 10), bO = b2 % 10, need = aO < bO;
        var reg = need ? { topT: String(aT - 1), topO: String(aO + 10), strikeT: 1, strikeO: 1 } : {};
        function o(extra) { var r = {}; Object.keys(reg).forEach(function (k) { r[k] = reg[k]; }); Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; }); return r; }
        S.push({ say: 'Grab your scratch paper! Write ' + a2 + ' on top and ' + b2 + ' under it. Line up the ones and the tens. Press Next when it is written.', show: col(a2, b2, '−') });
        S.push({ say: 'Look at the ONES column. Can you take ' + bO + ' away from ' + aO + ' without borrowing?', show: col(a2, b2, '−', { hl: 'ones' }), ask: pick(['Yes', 'No'], need ? 'No' : 'Yes') });
        if (need) {
          S.push({ say: 'We need to borrow 1 ten. The ' + aT + ' tens become how many tens?', show: col(a2, b2, '−', { hl: 'tens' }), ask: num(aT - 1) });
          S.push({ say: 'The borrowed ten goes to the ones. ' + aO + ' ones plus 10 ones is how many ones?', show: col(a2, b2, '−', { topT: String(aT - 1), strikeT: 1, hl: 'ones' }), ask: num(aO + 10) });
        }
        var onesTop = need ? aO + 10 : aO, tensTop = need ? aT - 1 : aT;
        S.push({ say: 'Subtract the ONES: ' + onesTop + ' − ' + bO + ' = ?', show: col(a2, b2, '−', o({ hl: 'ones' })), ask: num(onesTop - bO) });
        S.push({ say: 'Subtract the TENS: ' + tensTop + ' − ' + bT + ' = ?', show: col(a2, b2, '−', o({ rO: onesTop - bO, hl: 'tens' })), ask: num(tensTop - bT) });
        S.push({ say: 'So what is ' + a2 + ' − ' + b2 + '?', show: col(a2, b2, '−', o({ rO: onesTop - bO, rT: tensTop - bT || '' })), ask: num(a2 - b2), final: true });
        break;
      }
      case 'mulFact': {
        var f = d.f, g = d.g;
        S.push({ say: f + ' × ' + g + ' means ' + f + ' group' + (f === 1 ? '' : 's') + ' of ' + g + '.', show: f && g && f <= 5 ? dots(f, g, 0) : big(f + ' groups of ' + g) });
        if (f === 0 || g === 0) S.push({ say: f === 0 ? 'If there are zero groups, how many are there in all?' : 'If every group has zero, how many are there in all?', show: big(f + ' × ' + g), ask: num(0), final: true });
        else if (f === 1) S.push({ say: 'One group of ' + g + ' is just ' + g + '. What is 1 × ' + g + '?', show: dots(1, g, 1), ask: num(g), final: true });
        else if (f === 10) {
          S.push({ say: 'Times 10 trick: write ' + g + ', then put a 0 on the end. What do you get?', show: big(g + ' → ' + g + '0'), ask: num(10 * g), final: true });
        } else {
          for (var i = 1; i <= f; i++) {
            S.push({ say: i === 1 ? 'Skip count by ' + g + '. One group is…' : 'Add one more group of ' + g + '. ' + i + ' groups make…', show: dots(f, g, i), ask: num(i * g), final: i === f });
          }
        }
        break;
      }
      case 'shadedFraction': case 'setFraction': case 'circleGraph': case 'fractionWord': case 'wholeFraction': case 'nameParts': case 'countParts':
        return walkFraction(prob, d);
      case 'shadeTo': case 'shadeSet': {
        S.push({ say: 'Look at the fraction: ' + d.k + ' over ' + d.n + '. The bottom number tells how many parts there are in all. How many?', show: big(F(d.k, '<span style="color:#e5533d">' + d.n + '</span>')), ask: num(d.n) });
        S.push({ say: 'The top number tells how many to color. How many will you color?', show: big(F('<span style="color:#3b8fd9">' + d.k + '</span>', d.n)), ask: num(d.k) });
        S.push({ say: 'Now go color exactly ' + d.k + ', then press Check!', show: '', back: true });
        break;
      }
      case 'equalOrNot':
        S.push({ say: 'Find the biggest piece and the smallest piece. Are they the same size?', show: vis(prob), ask: pick(['Yes, the same', 'No, different'], d.unequal ? 'No, different' : 'Yes, the same') });
        S.push({ say: 'So are the parts equal?', show: vis(prob), ask: finalChoice(prob), final: true });
        break;
      case 'whichShows':
        S.push({ say: 'A fraction needs EQUAL parts. We need ' + d.n + ' equal parts with ' + d.k + ' shaded. How many parts should the shape have?', show: big(F(d.k, d.n)), ask: num(d.n) });
        S.push({ say: 'How many parts should be shaded?', show: big(F(d.k, d.n)), ask: num(d.k) });
        S.push({ say: 'Now find the shape with ' + d.n + ' EQUAL parts and ' + d.k + ' shaded.', show: '', ask: finalChoice(prob), final: true });
        break;
      case 'probability':
        if (d.t === 'none') {
          S.push({ say: 'Look closely. How many ' + d.c + ' marbles are in the jar?', show: vis(prob), ask: num(0) });
          S.push({ say: 'There are none! So pulling a ' + d.c + ' marble is…', show: vis(prob), ask: finalChoice(prob), final: true });
        } else {
          S.push({ say: 'How many ' + d.a + ' marbles are there?', show: vis(prob), ask: num(d.na) });
          S.push({ say: 'How many ' + d.b + ' marbles are there?', show: vis(prob), ask: num(d.nb) });
          S.push({ say: (d.t === 'more' ? 'More marbles means MORE likely.' : 'Fewer marbles means LESS likely.') + ' Which color?', show: vis(prob), ask: finalChoice(prob), final: true });
        }
        break;
      case 'compareLike': {
        S.push({ say: 'Look at the bottom numbers: ' + d.n + ' and ' + d.n + '. Are they the same?', show: big(F(d.a, d.n) + ' ? ' + F(d.b, d.n)), ask: pick(['Yes', 'No'], 'Yes') });
        var bigger = d.a > d.b ? String(d.a) : d.a < d.b ? String(d.b) : 'Same';
        S.push({ say: 'Same size parts! Now which top number is bigger, ' + d.a + ' or ' + d.b + '?', show: vis(prob), ask: pick(U.uniq([String(d.a), String(d.b)]).concat(['Same']), bigger) });
        S.push({ say: 'So which sign goes in the middle? The open mouth faces the bigger one.', show: big(F(d.a, d.n) + ' ? ' + F(d.b, d.n)), ask: finalChoice(prob), final: true });
        break;
      }
      case 'compareUnit': {
        var fewer = d.a < d.b ? d.a : d.b;
        if (d.a === d.b) {
          S.push({ say: 'Both wholes are cut into ' + d.a + ' pieces. Are the pieces the same size?', show: big(F(1, d.a) + ' ? ' + F(1, d.b)), ask: pick(['Yes', 'No'], 'Yes') });
        } else {
          S.push({ say: 'Which whole is cut into FEWER pieces: ' + d.a + ' pieces or ' + d.b + ' pieces?', show: vis(prob) || big(F(1, d.a) + ' ? ' + F(1, d.b)), ask: pick([String(d.a), String(d.b)], String(fewer)) });
          S.push({ say: 'Fewer pieces means BIGGER pieces. Which fraction is bigger?', show: '', ask: pick([{ html: F(1, d.a), value: 'a' }, { html: F(1, d.b), value: 'b' }], d.a < d.b ? 'a' : 'b') });
        }
        S.push({ say: 'So which sign goes in the middle?', show: big(F(1, d.a) + ' ? ' + F(1, d.b)), ask: finalChoice(prob), final: true });
        break;
      }
      case 'fairShare':
        if (d.t === 'count') {
          S.push({ say: 'How many groups are sharing?', show: '', ask: num(d.groups) });
          S.push({ say: 'Let\'s deal them out! Tap "Give one to each" until all ' + d.total + ' are shared.', show: '', ask: { type: 'deal', groups: d.groups, total: d.total } });
          S.push({ say: 'Count one plate. How many does each get?', show: Models.plates(d.groups, d.each, d.thing[1] === 'fish' ? 'fish' : d.thing[1] === 'pie' ? 'pie' : 'loaf'), ask: num(d.each), final: true });
        } else {
          S.push({ say: 'How many equal groups are there?', show: vis(prob), ask: num(d.groups) });
          S.push({ say: 'Each one gets 1 of the ' + d.groups + ' equal groups. Which fraction is that?', show: vis(prob), ask: finalChoice(prob), final: true });
        }
        break;
      case 'hourFraction':
        if (d.t === 'foot') {
          S.push({ say: 'How many inches are in 1 foot?', show: Models.ruler(12, 12), ask: num(12), final: !d.half });
          if (d.half) S.push({ say: 'Half of 12 is…? (What number plus itself makes 12?)', show: Models.ruler(12, 6), ask: num(6), final: true });
        } else {
          S.push({ say: 'How many minutes are in one hour?', show: Models.clockFraction(4), ask: num(60) });
          S.push({ say: 'Cut the hour into 4 equal parts. How many minutes is each fourth?', show: Models.clockFraction(1), ask: num(15) });
          if (d.t === 'min') S.push({ say: 'Count by 15s, ' + NUMW[d.q] + ' time' + (d.q > 1 ? 's' : '') + '. How many minutes?', show: Models.clockFraction(d.q), ask: num(d.q * 15), final: true });
          else {
            S.push({ say: 'How many 15s make ' + d.q * 15 + '?', show: Models.clockFraction(d.q), ask: num(d.q) });
            S.push({ say: 'So ' + d.q * 15 + ' minutes is ' + d.q + ' fourth' + (d.q > 1 ? 's' : '') + ' of an hour. Choose it!', show: '', ask: finalChoice(prob), final: true });
          }
        }
        break;
      case 'clockTime': {
        var pos = d.m === 0 ? 12 : d.m / 5;
        S.push({ say: 'The SHORT hand shows the hour. Which number is it on, or just past?', show: vis(prob), ask: num(d.h) });
        S.push({ say: 'The LONG hand shows minutes. Which number is it pointing to?', show: vis(prob), ask: num(pos) });
        S.push({ say: pos === 12 ? 'When the long hand is on the 12, it is zero minutes: o\'clock! Type 0.' : 'Count by 5s, ' + pos + ' times. How many minutes?', show: big(pos === 12 ? ':00' : '5, 10, 15…'), ask: num(d.m) });
        S.push({ say: 'Now choose the time.', show: '', ask: finalChoice(prob), final: true });
        break;
      }
      default:
        if (window.G1 && G1.S[prob.skill] && prob.type === 'choice') { S.push({ say: (prob.hints || []).join(' ') + ' Now choose the answer.', show: vis(prob), ask: finalChoice(prob), final: true }); break; }
        if (prob.type === 'choice') S.push({ say: 'Let\'s look again carefully.', show: vis(prob), ask: finalChoice(prob), final: true });
        else S.push({ say: 'Let\'s try again carefully.', show: vis(prob), ask: num(prob.answer), final: true });
    }
    return S;
  }
  function walkFraction(prob, d) {
    var S = [], v = vis(prob);
    switch (prob.skill) {
      case 'countParts':
        S.push({ say: 'Put your finger on one part. Count it, then move to the next part. Count each part only once. Press Next when you have counted.', show: v });
        S.push({ say: 'How many equal parts did you count?', show: v, ask: num(d.n), final: true });
        return S;
      case 'nameParts':
        S.push({ say: 'How many equal parts does the shape have?', show: v, ask: num(d.n) });
        S.push({ say: '2 parts are halves. 3 are thirds. 4 are fourths. 6 are sixths. 8 are eighths. So ' + d.n + ' parts are called…', show: v, ask: finalChoice(prob), final: true });
        return S;
      case 'wholeFraction':
        S.push({ say: 'How many parts does the whole shape have?', show: v, ask: num(d.n) });
        S.push({ say: 'How many parts are shaded?', show: v, ask: num(d.n) });
        S.push({ say: 'Every part is there! All the parts together make one whole. Now choose the answer.', show: v, ask: finalChoice(prob), final: true });
        return S;
      case 'circleGraph':
        if (d.t === 'max') {
          S.push({ say: 'How many equal parts is the circle cut into?', show: v, ask: num(d.den) });
          S.push({ say: 'How many parts does ' + d.max.label + ' have?', show: v, ask: num(d.max.parts) });
          S.push({ say: 'Look at every slice. Which one is the biggest?', show: v, ask: finalChoice(prob), final: true });
        } else {
          S.push({ say: 'How many equal parts is the whole circle cut into? That is the bottom number.', show: v, ask: num(d.den) });
          S.push({ say: 'How many of those parts are ' + d.s.label + '? That is the top number.', show: v, ask: num(d.s.parts) });
          S.push({ say: 'Now choose the fraction: ' + d.s.parts + ' over ' + d.den + '.', show: '', ask: finalChoice(prob), final: true });
        }
        return S;
      case 'fractionWord':
        if (d.t === 0) {
          S.push({ say: 'How many slices are in the whole pie? That is the bottom number.', show: v, ask: num(d.n) });
          S.push({ say: 'How many slices did ' + d.who + ' eat? That is the top number.', show: v, ask: num(d.k) });
          S.push({ say: 'Now choose the fraction.', show: '', ask: finalChoice(prob), final: true });
        } else {
          var fewer = Math.min(d.d1, d.d2);
          S.push({ say: 'Which pie was cut into FEWER pieces: ' + d.d1 + ' pieces or ' + d.d2 + ' pieces?', show: big(F(1, d.d1) + ' &nbsp; ' + F(1, d.d2)), ask: pick([String(d.d1), String(d.d2)], String(fewer)) });
          S.push({ say: 'Fewer pieces means bigger pieces! So who ate more?', show: '', ask: finalChoice(prob), final: true });
        }
        return S;
      default: // shadedFraction, setFraction
        var thing = prob.skill === 'setFraction' ? d.it[3] : 'parts', what = prob.skill === 'setFraction' ? d.it[4] : 'shaded';
        S.push({ say: 'Count ALL the ' + thing + '. That is the bottom number. How many?', show: v, ask: num(d.n) });
        S.push({ say: 'Now count only the ' + what + ' ' + (prob.skill === 'setFraction' ? thing : 'parts') + '. That is the top number. How many?', show: v, ask: num(d.k) });
        S.push({ say: 'So the fraction is ' + d.k + ' over ' + d.n + '. Choose it!', show: '', ask: finalChoice(prob), final: true });
        return S;
    }
  }

  /* ---------------- "How do you know?" follow-ups for multiple choice ---------------- */
  /* Reasons are written so the right one is NOT the longest: all choices are about the same length and pattern. */
  function why(prob) {
    var d = prob.data || {};
    if (prob.type !== 'choice') return null;
    // about 1 time in 3 the right reason gets a short lead-in, so length never gives the answer away
    function W(right, w1, w2) { return { q: 'How do you know?', options: [Math.random() < 0.34 ? 'I checked, and ' + right.charAt(0).toLowerCase() + right.slice(1) : right, w1, w2] }; }
    function are(k) { return k === 1 ? 'is' : 'are'; }
    if (prob.why) return W(prob.why[0], prob.why[1], prob.why[2]); // newer generators carry their own reasons
    switch (prob.skill) {
      case 'equalOrNot': return d.unequal ? W('Some pieces are bigger than others.', 'All of the pieces look the same size.', 'The shape has a lot of pieces in it.') :
        W('All the pieces are the same size.', 'Some of the pieces are bigger than others.', 'The shape is cut into many pieces.');
      case 'countParts': return W('I counted each part one time.', 'I counted only the colored parts.', 'I picked the biggest number I saw.');
      case 'nameParts': return W(d.n + ' equal parts are ' + NAMES[d.n] + '.', 'The name comes from the color of it.', 'Every shape is always cut in halves.');
      case 'wholeFraction': return W('All ' + d.n + ' parts make the whole.', 'Just one part makes the whole shape.', 'More parts always make more wholes.');
      case 'shadedFraction': return W(d.n + ' parts in all, and ' + d.k + ' shaded.', d.k + ' parts in all, and ' + d.n + ' shaded.', 'I counted the parts that are not shaded.');
      case 'whichShows': return W('It has ' + d.n + ' equal parts, ' + d.k + ' shaded.', 'It has the most parts that are shaded.', 'Its parts are all different sizes.');
      case 'probability':
        if (d.t === 'none') return W('The jar has no ' + d.c + ' marbles.', 'The jar has lots of ' + d.c + ' marbles.', 'Every marble in the jar is ' + d.c + '.');
        return d.t === 'more' ? W('There are more ' + d.a + ' marbles.', 'There are fewer ' + d.a + ' marbles here.', d.a + ' is the color I like the best.') :
          W('There are fewer ' + d.b + ' marbles.', 'There are more ' + d.b + ' marbles in it.', d.b + ' marbles sit on top of the jar.');
      case 'compareLike':
        if (d.a === d.b) return W('Same size parts, same number.', 'The first fraction is always bigger.', 'The bottom numbers are not the same.');
        return W('Same size parts, and ' + Math.max(d.a, d.b) + ' is more than ' + Math.min(d.a, d.b) + '.', 'The bottom number ' + d.n + ' is the biggest number.', 'The fraction on the left side is always bigger.');
      case 'compareUnit':
        if (d.a === d.b) return W('Both are cut into the same pieces.', 'The first fraction is always the bigger one.', 'A bigger bottom number means bigger pieces.');
        return W('Fewer pieces means bigger pieces.', 'A bigger bottom number means a bigger piece.', 'The fraction on the left is always bigger.');
      case 'fractionWord':
        if (d.t === 0) return W(d.n + ' slices in all, and ' + d.who + ' ate ' + d.k + '.', d.k + ' slices in all, and ' + d.who + ' ate ' + d.n + '.', 'I counted the slices that were left over.');
        return W('Fewer pieces means bigger pieces.', 'More pieces always means bigger pieces.', 'The first name always eats the most pie.');
      case 'setFraction': return W(d.n + ' ' + d.it[3] + ' in all, and ' + d.k + ' ' + are(d.k) + ' ' + d.it[4] + '.', d.k + ' ' + d.it[3] + ' in all, and ' + d.n + ' are ' + d.it[4] + '.', 'I counted the ones that are not ' + d.it[4] + ' at all.');
      case 'fairShare': return W('There are ' + d.groups + ' equal groups.', 'Each one gets every single ' + d.thing[1] + '.', 'I counted every ' + d.thing[1] + ' one by one.');
      case 'circleGraph': return d.t === 'max' ? W(d.max.label + ' has the biggest slice.', d.max.label + ' is listed first in the key.', d.max.label + ' has the very brightest color.') :
        W(d.s.label + ' covers ' + d.s.parts + ' of ' + d.den + ' parts.', 'The whole circle has ' + d.s.parts + ' parts in all.', 'I counted the parts that are not ' + d.s.label + '.');
      case 'hourFraction': return W('Each fourth is 15 minutes.', 'An hour has 100 minutes in it, I think.', 'Each fourth of an hour is 10 minutes.');
      case 'clockTime': return W('Short hand ' + d.h + ', long hand ' + d.m + ' minutes.', 'The long hand on the clock shows the hour.', 'I read the short hand as the minutes.');
    }
    return null;
  }

  /* other skill banks add their guides here */
  function extend(guides, map) { Object.keys(guides).forEach(function (k) { GUIDES[k] = guides[k]; }); Object.keys(map).forEach(function (k) { GUIDE_OF[k] = map[k]; }); }
  return { extend: extend, GUIDES: GUIDES, guideKey: guideKey, walk: walk, why: why, col: col, dots: dots };
})();
