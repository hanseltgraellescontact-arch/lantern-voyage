/* Grade 1 skill bank (Lantern Harbor). Each skill is built and checked once, then reused by any chapter.
   make(skill, options) returns a generator function(level) for a quest. Options narrow the number range
   so a chapter can match BJU's lesson exactly (for example numbers 0–3 in lesson 1). */
var G1 = (function () {
  var R = U.rand, P = U.pick;
  var W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  var ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  var THINGS = [['duck', 'ducks', '#ffd23f'], ['fish', 'fish', '#3b8fd9'], ['crate', 'crates', '#c98a3a'], ['gull', 'seagulls', '#ffffff'], ['shell', 'shells', '#ff9f8a'], ['star', 'stars', '#ffd23f'], ['apple', 'apples', '#e5533d']];
  function big(t) { return '<span class="g1num">' + t + '</span>'; }
  function numChoices(n, lo, hi, count, err) {
    var opts = [n], tries = 0;
    while (opts.length < (count || 3) && tries++ < 60) { var x = n + P([-2, -1, 1, 2, 3, -3]); if (x >= lo && x <= hi && opts.indexOf(x) < 0) opts.push(x); }
    for (var y = lo; opts.length < (count || 3) && y <= hi; y++) if (opts.indexOf(y) < 0) opts.push(y);
    return U.shuffle(opts).map(function (x) { return { html: big(x), value: String(x), err: x === n ? null : (err || 'count'), say: W[x] || String(x) }; });
  }
  function rng(o, lvl, defLo, defHi) { var lo = o.min !== undefined ? o.min : defLo, hi = o.max !== undefined ? o.max : defHi; if (!o.max && lvl === 1) hi = Math.min(hi, defLo + 5); return [lo, hi]; }
  function countWalk(n, plural, show) {
    return [{ say: 'Touch each one with your finger and count out loud: one, two, three… Count each one only once.', show: show },
      { say: 'How many ' + plural + ' did you count?', show: show, ask: { type: 'number', answer: n }, final: true }];
  }

  var S = {};
  /* ---------- numbers ---------- */
  S.numeral = function (o, l) { var r = rng(o, l, 0, 10), n = R(r[0], r[1]);
    return { skill: 'numeral', type: 'choice', data: { n: n }, prompt: 'Tap the number ' + W[n] + '.', say: 'Tap the number ' + W[n] + '.', visual: '',
      choices: numChoices(n, r[0], Math.max(r[1], r[0] + 3)), answer: String(n), key: r[1] > 10 ? 'teens' : undefined, hints: ['Listen: ' + W[n] + '.', n > 10 ? 'A teen number starts with a 1. That 1 means one ten.' : 'Look for the number ' + n + '.'], explain: 'This is the number ' + W[n] + ': ' + n + '.' }; };
  S.numberWord = function (o, l) { var r = rng(o, l, 0, 10), n = R(r[0], r[1]), opts = [n];
    while (opts.length < 3) { var x = R(r[0], Math.max(r[1], 5)); if (opts.indexOf(x) < 0) opts.push(x); }
    return { skill: 'numberWord', type: 'choice', data: { n: n }, prompt: 'Which word says ' + big(n) + '?', say: 'Which word says this number?', visual: '',
      choices: U.shuffle(opts).map(function (x) { return { html: '<span class="g1word">' + W[x] + '</span>', value: String(x), err: x === n ? null : 'number-word', say: W[x] }; }),
      answer: String(n), key: r[1] > 10 ? 'teenWords' : undefined, hints: ['Tap the 🔊 to hear each word.', 'The number ' + n + ' is spelled ' + W[n].split('').join('-') + '.'], explain: n + ' is the word ' + W[n] + '.' }; };
  S.dots = function (o, l) { var r = rng(o, l, 0, 10), n = R(Math.max(r[0], 1), r[1]);
    return { tapCount: true, readOut: true, skill: 'dots', type: 'choice', data: { n: n }, prompt: 'How many dots?', say: n > 10 ? 'How many dots? The top ten-frame is full. That is ten. Then count on.' : 'How many dots?', visual: Models.dots(n), choices: numChoices(n, 0, Math.max(r[1], 5)), answer: String(n), key: n > 10 ? 'teens' : undefined,
      hints: [n > 10 ? 'The full ten-frame is ten. Count on: eleven, twelve…' : 'Count each dot one time.', 'There are ' + n + ' dots.'], explain: 'There are ' + W[n] + ' dots.', walk: countWalk(n, 'dots', Models.dots(n)) }; };
  S.tally = function (o, l) { var r = rng(o, l, 1, 5), n = R(Math.max(1, r[0]), r[1]);
    return { tapCount: true, readOut: true, skill: 'tally', type: 'choice', data: { n: n }, prompt: 'How many tally marks?', say: 'How many tally marks?', visual: Models.tally(n), choices: numChoices(n, 1, Math.max(r[1], 5)), answer: String(n),
      hints: ['Count each line.', n >= 5 ? 'A slash across 4 lines makes a group of 5.' : 'Count: one, two, three…'], explain: 'There are ' + W[n] + ' tally marks.', walk: countWalk(n, 'marks', Models.tally(n)) }; };
  S.countSet = function (o, l) { var r = rng(o, l, 1, 10), n = R(Math.max(1, r[0]), r[1]), t = P(THINGS), v = Models.row(n, t[0], t[2]);
    return { tapCount: true, readOut: true, skill: 'countSet', type: 'choice', data: { n: n, t: t }, prompt: 'How many ' + t[1] + '?', say: 'How many ' + t[1] + '?', visual: v, choices: numChoices(n, 0, Math.max(r[1], 5)), answer: String(n),
      hints: ['Touch each one and count.', 'There are ' + n + '.'], explain: 'There are ' + W[n] + ' ' + (n === 1 ? t[0] : t[1]) + '.', walk: countWalk(n, t[1], v) }; };
  S.makeSet = function (o, l) { var r = rng(o, l, 1, 10), k = R(Math.max(1, r[0]), r[1]), n = Math.min(12, k + R(1, 3)), t = P(THINGS.slice(0, 3));
    return { skill: 'makeSet', type: 'shadeSet', n: n, answer: k, item: [t[0], t[2], '#d9d4c6', t[1], 'colored'], data: { n: n, k: k },
      prompt: 'Tap ' + W[k] + ' ' + (k === 1 ? t[0] : t[1]) + ' to color ' + (k === 1 ? 'it' : 'them') + '.', say: 'Tap ' + W[k] + ' ' + (k === 1 ? t[0] : t[1]) + '. Then press check.',
      visual: '<div id="setTarget">' + Models.set(n, 0, t[0], t[2], '#d9d4c6', true) + '</div>', hints: ['Count as you tap: one, two…', 'Stop at ' + k + ', then press Check.'],
      explain: 'Make a set of ' + W[k] + ' by tapping ' + W[k] + ' of them.',
      walk: [{ say: 'Tap one and say one. Tap the next one and say two. Keep going. When you say ' + W[k] + ', stop and press Check.', show: Models.row(k, t[0], t[2], 0, 300), back: true }] }; };
  S.compareSets = function (o, l) { var hi = o.max || 9, a = R(1, hi), b = R(1, hi); while (b === a) b = R(1, hi);
    var t = P(THINGS), more = Math.random() < 0.6, want = more ? (a > b ? 'a' : 'b') : (a < b ? 'a' : 'b');
    var opt = function (n, v) { return { html: Models.row(n, t[0], t[2], 0, 220), value: v, err: v === want ? null : 'compare-sets', say: W[n] + ' ' + t[1] }; };
    return { skill: 'compareSets', type: 'choice', big: true, data: { a: a, b: b, more: more }, prompt: 'Which group has ' + (more ? 'MORE' : 'FEWER') + ' ' + t[1] + '?', say: 'Which group has ' + (more ? 'more' : 'fewer') + ' ' + t[1] + '?',
      visual: '', choices: [opt(a, 'a'), opt(b, 'b')], answer: want, hints: ['Count each group.', 'One group has ' + a + ', the other has ' + b + '.'],
      explain: W[Math.max(a, b)] + ' is more than ' + W[Math.min(a, b)] + '.', walk: [
        { say: 'Count the first group. How many?', show: Models.row(a, t[0], t[2], 0, 300), ask: { type: 'number', answer: a } },
        { say: 'Count the second group. How many?', show: Models.row(b, t[0], t[2], 0, 300), ask: { type: 'number', answer: b } },
        { say: 'Which group has ' + (more ? 'more' : 'fewer') + '?', show: '', ask: { type: 'choice', options: [opt(a, 'a'), opt(b, 'b')], answer: want }, final: true }] }; };
  S.nextNumber = function (o, l) { var lo = o.min || 0, hi = o.max || 10, after = !o.before && (o.after || Math.random() < 0.6), n = after ? R(lo, hi - 1) : R(lo + 1, hi), ans = after ? n + 1 : n - 1;
    return { readOut: true, skill: 'nextNumber', type: 'choice', data: { n: n, after: after }, prompt: 'What number comes ' + (after ? 'AFTER' : 'BEFORE') + ' ' + n + '?', say: 'What number comes ' + (after ? 'after' : 'before') + ' ' + W[n] + '?',
      visual: '', choices: numChoices(ans, lo, hi + 1), answer: String(ans), hints: [after ? 'Count up from ' + n + '.' : 'Count back from ' + n + '.', after ? n + ', then…' : '…, then ' + n + '.'],
      explain: after ? ans + ' comes after ' + n + '.' : ans + ' comes before ' + n + '.' }; };
  S.missingNumber = function (o, l) { var lo = o.min || 0, hi = o.max || 10, back = o.backward && Math.random() < 0.5, start = R(lo, hi - 3), seq = [start, start + 1, start + 2, start + 3];
    if (back) seq.reverse(); var miss = R(1, 2), ans = seq[miss];
    var shown = seq.map(function (x, i) { return i === miss ? '<span class="g1blank">?</span>' : x; }).join(', ');
    return { readOut: true, skill: 'missingNumber', type: 'choice', data: { seq: seq, ans: ans }, prompt: 'What number is missing? ' + big(shown), say: 'What number is missing?' + (back ? ' We are counting backward.' : ''),
      visual: '', choices: numChoices(ans, lo, hi), answer: String(ans), hints: [back ? 'These numbers count backward.' : 'Count up by one.', 'Say the numbers out loud.'], explain: 'The missing number is ' + ans + '.' }; };
  S.ordinal = function (o, l) { var n = o.max || 5, k = R(1, n), cols = ['#ffd23f', '#3b8fd9', '#e5533d', '#36b37e', '#b48ef0', '#ff9f1c', '#ff6fa8', '#1fb5ad', '#8d5730', '#ffffff'];
    return { skill: 'ordinal', type: 'choice', big: true, data: { k: k, n: n }, prompt: 'The ducks are in line, going this way ➜. Tap the ' + ORD[k - 1].toUpperCase() + ' duck.', say: 'The ducks are in a line. Tap the ' + ORD[k - 1] + ' duck.',
      visual: '', ordinalRow: true, choices: Array.from({ length: n }, function (_, i) { return { html: Art.icon('duck', 54, cols[i]), value: String(i + 1), err: i + 1 === k ? null : 'ordinal', say: ORD[i] }; }),
      answer: String(k), key: n > 5 ? 'ordinal10' : undefined, hints: ['Start at the front of the line.', 'Count: first, second, third…'], explain: 'Counting from the front, the ' + ORD[k - 1] + ' duck is number ' + k + '.' }; };
  S.evenOdd = function (o, l) { var n = R(o.min || 1, o.max || 10), even = n % 2 === 0;
    var pairs = '<div class="g1pairs">' + Array.from({ length: Math.ceil(n / 2) }, function (_, i) { return '<span>' + Art.icon('fish', 40, '#3b8fd9') + (i * 2 + 1 < n ? Art.icon('fish', 40, '#3b8fd9') : '<i class="g1alone"></i>') + '</span>'; }).join('') + '</div>';
    return { readOut: true, skill: 'evenOdd', type: 'choice', data: { n: n }, prompt: 'Is ' + n + ' EVEN or ODD?', say: 'Is ' + W[n] + ' even or odd?', visual: pairs,
      choices: [{ html: big('Even'), value: 'even', err: even ? null : 'even-odd', say: 'even' }, { html: big('Odd'), value: 'odd', err: even ? 'even-odd' : null, say: 'odd' }], answer: even ? 'even' : 'odd',
      hints: ['Put the fish in pairs.', 'If every fish has a partner, the number is even. If one is left over, it is odd.'], explain: even ? 'Every fish has a partner, so ' + n + ' is even.' : 'One fish is left over, so ' + n + ' is odd.',
      walk: [{ say: 'Look at the fish in pairs, two in each box.', show: pairs }, { say: 'Does every fish have a partner? If yes, it is even. If one is left over, it is odd.', show: pairs, ask: { type: 'choice', options: [{ html: big('Even'), value: 'even', say: 'even' }, { html: big('Odd'), value: 'odd', say: 'odd' }], answer: even ? 'even' : 'odd' }, final: true }] }; };
  S.namesForTen = function (o, l) { var k = R(1, 9), ans = 10 - k;
    return { readOut: true, skill: 'namesForTen', type: 'choice', data: { k: k }, prompt: k + ' and how many more make 10?', say: W[k] + ' and how many more make ten?', visual: Models.tenFrame(k, 'duck'),
      choices: numChoices(ans, 0, 10), answer: String(ans), hints: ['Count the empty boxes.', 'A ten-frame holds 10.'], explain: k + ' and ' + ans + ' make 10.', walk: [
        { say: 'A ten-frame has 10 boxes. How many boxes have ducks?', show: Models.tenFrame(k, 'duck'), ask: { type: 'number', answer: k } },
        { say: 'Now count the EMPTY boxes. How many?', show: Models.tenFrame(k, 'duck'), ask: { type: 'number', answer: ans }, final: true }] }; };
  S.countTens = function (o, l) { var t = R(1, o.maxTens || 9), ones = o.noOnes ? 0 : R(0, 9), n = t * 10 + ones;
    if (o.max && n > o.max) { t = Math.floor(o.max / 10); ones = Math.min(ones, o.max - t * 10); n = t * 10 + ones; }
    return { skill: 'countTens', type: 'choice', data: { t: t, ones: ones }, prompt: 'Each bundle has 10 sticks. How many sticks in all?', say: 'Each bundle has ten sticks. How many sticks in all?', visual: Models.sticks(t, ones),
      choices: numChoices(n, 1, 100), answer: String(n), hints: ['Count the bundles by tens: 10, 20, 30…', 'Then count on the loose sticks by ones.'], explain: t + ' tens and ' + ones + ' ones make ' + n + '.', walk: [
        { say: 'Count the bundles by tens. How many bundles are there?', show: Models.sticks(t, ones), ask: { type: 'number', answer: t } },
        { say: 'Count the loose sticks. How many?', show: Models.sticks(t, ones), ask: { type: 'number', answer: ones } },
        { say: t + ' tens and ' + ones + ' ones. How many in all?', show: '', ask: { type: 'number', answer: n }, final: true }] }; };
  /* ---------- shapes, patterns, sorting ---------- */
  var SH2 = ['circle', 'square', 'triangle', 'rectangle'], SH3 = ['cube', 'sphere', 'cone', 'cylinder'];
  S.shapeFind = function (o, l) { var pool = l >= 3 && o.solids ? SH3 : SH2, k = P(pool), opts = U.shuffle([k].concat(U.shuffle(pool.filter(function (x) { return x !== k; })).slice(0, 2)));
    var cols = ['#7fc8a9', '#ffd23f', '#9fd0ff', '#ffb3a7'];
    return { skill: 'shapeFind', type: 'choice', big: true, data: { k: k }, prompt: 'Tap the ' + k.toUpperCase() + '.', say: 'Tap the ' + k + '.', visual: '',
      choices: opts.map(function (x, i) { return { html: Models.figure(x, 100, cols[i]), value: x, err: x === k ? null : 'shape-name', say: x }; }), answer: k,
      hints: ['A circle is round. A triangle has 3 sides. A square has 4 equal sides. A rectangle has 4 sides, 2 long and 2 short.'], explain: 'This is a ' + k + '.' }; };
  var PCOL = [['#e5533d', 'red'], ['#3b8fd9', 'blue'], ['#ffd23f', 'yellow'], ['#36b37e', 'green']];
  S.pattern = function (o, l) { var type = P(l === 1 ? ['AB'] : l === 2 ? ['AB', 'AAB', 'ABB'] : ['AAB', 'ABC', 'ABB']), units = type.split(''), cols = U.shuffle(PCOL).slice(0, 3), shp = Math.random() < 0.5;
    var shapes = U.shuffle(SH2).slice(0, 3);
    var seq = []; for (var i = 0; i < 7; i++) seq.push(units[i % units.length].charCodeAt(0) - 65);
    var nextI = units[7 % units.length].charCodeAt(0) - 65, item = function (j, sz) { return shp ? Models.figure(shapes[j], sz || 50, cols[0][0]) : '<span class="g1dot" style="background:' + cols[j][0] + '"></span>'; };
    var opts = U.uniq([nextI, (nextI + 1) % (units.indexOf('C') >= 0 ? 3 : 2), 2]).slice(0, 3);
    return { skill: 'pattern', type: 'choice', data: { type: type }, prompt: 'What comes next in the pattern?', say: 'What comes next in the pattern?', visual: '<div class="g1row">' + seq.map(function (j) { return item(j); }).join('') + '<span class="g1blank">?</span></div>',
      choices: U.shuffle(opts).map(function (j) { return { html: item(j, 70), value: String(j), err: j === nextI ? null : 'pattern', say: shp ? shapes[j] : cols[j][1] }; }), answer: String(nextI), big: true,
      hints: ['Say the pattern out loud.', 'Find the part that repeats.'], explain: 'The pattern repeats, so the next one matches the start of the pattern part.' }; };
  S.oddOneOut = function (o, l) { var groups = [['fish', 'duck', 'gull'], ['apple', 'pie', 'loaf']], g = P(groups), other = P(groups.filter(function (x) { return x !== g; })), odd = P(other);
    var items = U.shuffle([g[0], g[1], g[2], odd]);
    return { skill: 'oddOneOut', type: 'choice', big: true, data: { odd: odd }, prompt: 'Which one does NOT belong?', say: 'Which one does not belong?', visual: '',
      choices: items.map(function (x) { return { html: Art.icon(x, 70), value: x, err: x === odd ? null : 'sorting', say: x }; }), answer: odd,
      hints: ['Three of them are alike in some way.', g === groups[0] ? 'Three are animals.' : 'Three are foods.'], explain: 'The ' + odd + ' is not like the others.' }; };
  /* ---------- adding and taking away within 10 ---------- */
  S.add10 = function (o, l) { var hi = o.max || 10, a = R(1, hi - 1), b = R(1, hi - a), t = P(THINGS), n = a + b;
    var v = '<div class="g1row">' + Models.row(a, t[0], t[2], 0, 220) + '<span class="g1op">+</span>' + Models.row(b, t[0], t[2], 0, 220) + '</div>';
    return { tapCount: true, readOut: true, skill: 'add10', type: 'choice', data: { a: a, b: b }, prompt: a + ' ' + (a === 1 ? t[0] : t[1]) + ' and ' + b + ' more. How many in all? ' + big(a + ' + ' + b + ' = ?'), say: W[a] + ' and ' + W[b] + ' more. How many in all?', visual: v,
      choices: numChoices(n, 0, hi + 2), answer: String(n), hints: ['Put the two groups together.', 'Count them all, or count on from ' + Math.max(a, b) + '.'], explain: a + ' + ' + b + ' = ' + n + '.', walk: [
        { say: 'How many are in the first group?', show: Models.row(a, t[0], t[2], 0, 300), ask: { type: 'number', answer: a } },
        { say: 'Now count on with the second group: ' + W[a] + '… How many in all?', show: v, ask: { type: 'number', answer: n }, final: true }] }; };
  S.sub10 = function (o, l) { var hi = o.max || 10, a = R(2, hi), b = R(1, a - 1), t = P(THINGS), n = a - b;
    var v = Models.row(a, t[0], t[2], b);
    return { tapCount: true, readOut: true, skill: 'sub10', type: 'choice', data: { a: a, b: b }, prompt: 'There were ' + a + '. ' + b + ' went away. How many are left? ' + big(a + ' − ' + b + ' = ?'), say: 'There were ' + W[a] + '. ' + W[b] + ' went away. How many are left?', visual: v,
      choices: numChoices(n, 0, hi), answer: String(n), hints: ['The crossed-out ones are gone.', 'Count only the ones that are NOT crossed out.'], explain: a + ' − ' + b + ' = ' + n + '.', walk: [
        { say: 'How many were there at the start?', show: Models.row(a, t[0], t[2], 0), ask: { type: 'number', answer: a } },
        { say: 'Cross out the ones that went away. Count the ones that are left.', show: v, ask: { type: 'number', answer: n }, final: true }] }; };
  /* ---------- money, time, calendar, measurement, shares, graphs (K5 review) ---------- */
  S.coinName = function (o, l) { var names = ['penny', 'nickel', 'dime', 'quarter'], k = P(l === 1 ? ['penny', 'dime'] : names), opts = U.shuffle([k].concat(U.shuffle(names.filter(function (x) { return x !== k; })).slice(0, 2)));
    return { skill: 'coinName', type: 'choice', big: true, data: { k: k }, prompt: 'Tap the ' + k.toUpperCase() + '.', say: 'Tap the ' + k + '.', visual: '',
      choices: opts.map(function (x) { return { html: Models.coin(x, 80), value: x, err: x === k ? null : 'coin-name', say: x }; }), answer: k,
      hints: ['A penny is brown. A dime is the smallest coin. A quarter is the biggest.'], explain: 'This coin is a ' + k + ', worth ' + Models.COINS[k].c + ' cents.' }; };
  S.coinValue = function (o, l) { var k = P(['penny', 'nickel', 'dime', 'quarter']), c = Models.COINS[k].c;
    return { readOut: true, skill: 'coinValue', type: 'choice', data: { k: k }, prompt: 'A ' + k + ' is worth how many cents?', say: 'A ' + k + ' is worth how many cents?', visual: Models.coin(k, 110),
      choices: U.shuffle([1, 5, 10, 25]).slice(0, 4).map(function (x) { return { html: big(x + '¢'), value: String(x), err: x === c ? null : 'coin-value', say: x + ' cents' }; }), answer: String(c),
      hints: ['Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢.'], explain: 'A ' + k + ' is worth ' + c + ' cents.' }; };
  S.countPennies = function (o, l) { var n = R(2, o.max || 10), v = '<div class="g1row">' + Array.from({ length: n }, function () { return '<span class="g1item">' + Models.coin('penny', 50) + '</span>'; }).join('') + '</div>';
    return { tapCount: true, readOut: true, skill: 'countPennies', type: 'choice', data: { n: n }, prompt: 'How many cents?', say: 'How many cents?', visual: v, choices: numChoices(n, 1, 12).map(function (c) { c.html = big(c.value + '¢'); c.say = c.value + ' cents'; return c; }), answer: String(n),
      hints: ['Each penny is 1 cent.', 'Count the pennies.'], explain: W[n] + ' pennies make ' + n + ' cents.' }; };
  S.clockHour = function (o, l) { var h = R(1, 12), opts = U.uniq([h, h % 12 + 1, (h + 10) % 12 + 1, (h + 5) % 12 + 1]).slice(0, 3);
    return { readOut: true, skill: 'clockHour', type: 'choice', data: { h: h }, prompt: 'What time is it?', say: 'What time is it?', visual: Models.clock(h, 0),
      choices: U.shuffle(opts).map(function (x) { return { html: big(x + ':00'), value: String(x), err: x === h ? null : 'clock-hour', say: W[x] + " o'clock" }; }), answer: String(h),
      hints: ['The long hand points straight up to 12.', 'The short hand points to the hour.'], explain: 'The short hand is on ' + h + ', so it is ' + h + ":00, " + W[h] + " o'clock." }; };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  S.dayAfter = function (o, l) { var i = R(0, 6), after = Math.random() < 0.65, ans = after ? DAYS[(i + 1) % 7] : DAYS[(i + 6) % 7], opts = U.uniq([ans, DAYS[(i + 2) % 7], DAYS[i], DAYS[(i + 5) % 7]]).slice(0, 3);
    return { readOut: true, skill: 'dayAfter', type: 'choice', data: { i: i, after: after }, prompt: 'What day comes ' + (after ? 'AFTER' : 'BEFORE') + ' ' + DAYS[i] + '?', say: 'What day comes ' + (after ? 'after' : 'before') + ' ' + DAYS[i] + '?', visual: '',
      choices: U.shuffle(opts).map(function (x) { return { html: '<span class="g1word">' + x + '</span>', value: x, err: x === ans ? null : 'days', say: x }; }), answer: ans,
      hints: ['Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.'], explain: ans + ' comes ' + (after ? 'after ' : 'before ') + DAYS[i] + '.' }; };
  S.longer = function (o, l) { var a = R(2, 8), b = R(2, 8); while (b === a) b = R(2, 8); var longer = Math.random() < 0.6, want = longer ? (a > b ? 'a' : 'b') : (a < b ? 'a' : 'b');
    var cols = ['#e5533d', '#3b8fd9'];
    return { skill: 'longer', type: 'choice', big: true, data: { a: a, b: b, longer: longer }, prompt: 'Which rope is ' + (longer ? 'LONGER' : 'SHORTER') + '?', say: 'Which rope is ' + (longer ? 'longer' : 'shorter') + '?', visual: '',
      choices: [{ html: Models.lengthBar(a, cols[0], 8), value: 'a', err: want === 'a' ? null : 'length', say: 'the red rope' }, { html: Models.lengthBar(b, cols[1], 8), value: 'b', err: want === 'b' ? null : 'length', say: 'the blue rope' }],
      answer: want, hints: ['Line up the ends.', 'See which one sticks out farther.'], explain: (want === 'a' ? 'The red' : 'The blue') + ' rope is ' + (longer ? 'longer' : 'shorter') + '.' }; };
  S.equalShares = function (o, l) { var n = P([2, 4]), name = n === 2 ? 'halves' : 'fourths', k = P(['circle', 'rect']);
    var opts = U.shuffle([{ html: Models.shape({ kind: k, n: n, shaded: 0, size: 110 }), value: 'eq' }, { html: Models.shape({ kind: k, n: n, shaded: 0, unequal: true, size: 110 }), value: 'un' }]);
    opts.forEach(function (x) { x.err = x.value === 'eq' ? null : 'unequal-parts'; x.say = 'this one'; });
    return { skill: 'equalShares', type: 'choice', big: true, data: { n: n }, prompt: 'Which one is cut into ' + name.toUpperCase() + ' (' + n + ' EQUAL parts)?', say: 'Which one is cut into ' + name + ', ' + W[n] + ' equal parts?', visual: '',
      choices: opts, answer: 'eq', hints: ['Equal parts are all the same size.'], explain: 'Equal parts are all the same size.' }; };
  S.pictograph = function (o, l) { var t = U.shuffle([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#ffffff']]), counts = U.shuffle([2, 3, 4, 5]).slice(0, 3);
    var most = Math.random() < 0.6, idx = counts.indexOf(most ? Math.max.apply(null, counts) : Math.min.apply(null, counts));
    var v = '<div class="g1graph">' + t.map(function (x, i) { return '<div class="g1grow"><b>' + x[1] + '</b>' + Array.from({ length: counts[i] }, function () { return Art.icon(x[0], 36, x[2]); }).join('') + '</div>'; }).join('') + '</div>';
    return { readOut: true, skill: 'pictograph', type: 'choice', data: { counts: counts, most: most }, prompt: 'Which row has the ' + (most ? 'MOST' : 'FEWEST') + '?', say: 'Look at the picture graph. Which row has the ' + (most ? 'most' : 'fewest') + '?', visual: v,
      choices: t.map(function (x, i) { return { html: '<span class="g1word">' + x[1] + '</span>', value: x[1], err: i === idx ? null : 'graph-read', say: x[1] }; }), answer: t[idx][1],
      hints: ['Count the pictures in each row.'], explain: t[idx][1] + ' has the ' + (most ? 'most' : 'fewest') + ': ' + counts[idx] + '.' }; };

  /* ---------- numbers to 20 (Math 1, chapter 2) ---------- */
  S.dozen = function (o, l) {
    var isQ = Math.random() < 0.5 || l === 1, n = isQ ? 12 : P([10, 11, 12, 12, 13, 14]), v = '<div class="g1carton">' + Models.row(n, 'egg', '#fff6e0', 0, 420) + '</div>';
    if (isQ) return { tapCount: true, readOut: true, skill: 'dozen', type: 'choice', data: { n: 12 }, prompt: 'A DOZEN eggs. How many eggs are in a dozen?', say: 'Here is a dozen eggs. How many eggs are in a dozen? Tap each egg to count.', visual: v,
      choices: numChoices(12, 6, 14), answer: '12', hints: ['Touch each egg and count.', 'A dozen is twelve.'], explain: 'A dozen is twelve. There are twelve eggs.', walk: countWalk(12, 'eggs', v) };
    return { tapCount: true, readOut: true, skill: 'dozen', type: 'choice', data: { n: n }, prompt: 'Is this a DOZEN eggs?', say: 'Is this a dozen eggs? A dozen is twelve. Tap each egg to count.', visual: v,
      choices: [{ html: big('Yes'), value: 'yes', err: n === 12 ? null : 'dozen', say: 'yes' }, { html: big('No'), value: 'no', err: n === 12 ? 'dozen' : null, say: 'no' }], answer: n === 12 ? 'yes' : 'no',
      hints: ['A dozen is twelve.', 'Count the eggs. Is it twelve?'], explain: 'There are ' + W[n] + ' eggs. ' + (n === 12 ? 'Twelve is a dozen!' : 'A dozen is twelve, so this is not a dozen.'), walk: countWalk(n, 'eggs', v) };
  };
  var BARS = [['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad'], ['crate', 'Crates', '#c98a3a']];
  function barSvg(cats, counts, max) {
    var w = 80, h = 26, H = max * h, s = '<svg class="g1bars" viewBox="0 0 ' + (60 + cats.length * w) + ' ' + (H + 86) + '" width="' + Math.min(420, (60 + cats.length * w) * 1.15) + '">';
    for (var y = 0; y <= max; y++) s += '<path d="M40 ' + (20 + H - y * h) + ' H' + (50 + cats.length * w) + '" stroke="#d6d6d6" stroke-width="1.5"/><text x="30" y="' + (25 + H - y * h) + '" text-anchor="end" font-size="15" font-weight="700" fill="#2b2a3a">' + y + '</text>';
    cats.forEach(function (c, i) { var x = 54 + i * w, bh = counts[i] * h;
      for (var k = 0; k < counts[i]; k++) s += '<rect class="cnt" x="' + x + '" y="' + (20 + H - (k + 1) * h) + '" width="' + (w - 22) + '" height="' + h + '" fill="' + c[2] + '" stroke="#2b2a3a" stroke-width="2.5"/>';
      s += '<g transform="translate(' + (x + (w - 22) / 2 - 18) + ',' + (H + 22) + ') scale(.6)">' + Art.icon(c[0], 60, c[2]).replace(/<\/?svg[^>]*>/g, '') + '</g><text x="' + (x + (w - 22) / 2) + '" y="' + (H + 78) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#2b2a3a">' + c[1] + '</text>'; });
    return s + '<path d="M40 20 V' + (20 + H) + ' H' + (50 + cats.length * w) + '" stroke="#2b2a3a" stroke-width="3" fill="none"/></svg>';
  }
  S.barGraph = function (o, l) {
    var max = o.max || 8, cats = U.shuffle(BARS).slice(0, 3), counts = U.shuffle([R(1, max), R(1, max), R(1, max)]);
    while (new Set(counts).size < 3) counts = [R(1, max), R(1, max), R(1, max)];
    var v = barSvg(cats, counts, max), t = l === 1 ? 'most' : P(['most', 'fewest', 'how']);
    if (t === 'how') { var i = R(0, 2);
      return { readOut: true, skill: 'barGraph', type: 'choice', data: { counts: counts, i: i }, prompt: 'Look at the bar graph. How many ' + cats[i][1].toUpperCase() + '?', say: 'Look at the bar graph. How many ' + cats[i][1].toLowerCase() + '? Find the top of the bar, then look across to the number.', visual: v,
        choices: numChoices(counts[i], 1, max), answer: String(counts[i]), hints: ['Find the ' + cats[i][1].toLowerCase() + ' bar.', 'Slide your finger from the top of the bar across to the numbers.'], explain: 'The ' + cats[i][1].toLowerCase() + ' bar stops at ' + counts[i] + '.',
        walk: [{ say: 'Find the ' + cats[i][1].toLowerCase() + ' bar. Put your finger at the very top of it.', show: v }, { say: 'Slide your finger across to the numbers. What number is it?', show: v, ask: { type: 'number', answer: counts[i] }, final: true }] }; }
    var most = t === 'most', idx = counts.indexOf(most ? Math.max.apply(null, counts) : Math.min.apply(null, counts));
    var opts = cats.map(function (c, i) { return { html: '<span class="g1word">' + c[1] + '</span>', value: c[1], err: i === idx ? null : 'graph-read', say: c[1] }; });
    return { readOut: true, skill: 'barGraph', type: 'choice', data: { counts: counts, most: most }, prompt: 'Which has the ' + (most ? 'MOST' : 'FEWEST') + '?', say: 'Look at the bar graph. Which has the ' + (most ? 'most' : 'fewest') + '?', visual: v,
      choices: opts, answer: cats[idx][1], hints: [most ? 'The most is the tallest bar.' : 'The fewest is the shortest bar.', cats[idx][1] + ' has the ' + (most ? 'tallest' : 'shortest') + ' bar.'], explain: cats[idx][1] + ' has the ' + (most ? 'tallest' : 'shortest') + ' bar: ' + counts[idx] + '.',
      walk: [{ say: 'Look at how tall each bar is.', show: v }, { say: most ? 'The tallest bar shows the most. Which one is it?' : 'The shortest bar shows the fewest. Which one is it?', show: v, ask: { type: 'choice', options: opts, answer: cats[idx][1] }, final: true }] };
  };
  S.matchUp = function (o, l) { // one-to-one: are there enough?
    var t = P([['boat', 'boats', '#e5533d', 'nets', 'net', 'basket'], ['fish', 'fish', '#3b8fd9', 'worms', 'worm', 'worm'], ['duck', 'ducks', '#ffd23f', 'loaves', 'bread', 'loaf']]);
    var a = R(3, o.max || 8), b = P([a, a, a - 1, a + 1].filter(function (x) { return x >= 2; })), ans = b === a ? 'Yes' : 'No';
    var v = '<div class="g1match">' + Array.from({ length: Math.max(a, b) }, function (_, i) { return '<div class="g1mcol">' + (i < a ? Art.icon(t[0], 46, t[2]) : '<span class="g1ghost"></span>') + (i < b ? Art.icon(t[5], 40) : '<span class="g1ghost"></span>') + '</div>'; }).join('') + '</div>';
    return { readOut: true, skill: 'matchUp', type: 'choice', data: { a: a, b: b }, prompt: 'Does every one of the ' + t[1] + ' get one ' + t[4] + '?', say: 'Match them one to one. Does every one of the ' + t[1] + ' get one ' + t[4] + '?', visual: v,
      choices: [{ html: big('Yes'), value: 'Yes', err: ans === 'Yes' ? null : 'match', say: 'yes' }, { html: big('No'), value: 'No', err: ans === 'No' ? null : 'match', say: 'no' }], answer: ans,
      hints: ['Look at each column. Is anything missing a partner?', a === b ? 'Every one has a partner.' : 'Look for an empty space.'], explain: a === b ? 'There are ' + W[a] + ' of each. Every one gets one!' : a > b ? 'There are more ' + t[1] + ' than ' + t[3] + '. Not every one gets one.' : 'There are extra ' + t[3] + '. Every one gets one, and some are left over.',
      walk: [{ say: 'Look down each column. Each one of the ' + t[1] + ' should have one ' + t[4] + ' under it.', show: v }, { say: 'Is any of the ' + t[1] + ' missing a ' + t[4] + '?', show: v, ask: { type: 'choice', options: [{ html: big('Yes'), value: 'Yes', say: 'yes' }, { html: big('No'), value: 'No', say: 'no' }], answer: ans }, final: true }] };
  };

  /* ---------- addition facts to 6 (Math 1, chapter 3) ---------- */
  var DUCKW = '#ffffff', DUCKB = '#b07a4a';
  function ducks(n, col, size) { return n ? '<span class="g1row" style="gap:2px">' + Array.from({ length: n }, function () { return Art.icon('duck', size || 44, col); }).join('') + '</span>' : '<span class="g1word">0</span>'; }
  function twoGroups(a, b) { return '<div class="g1row">' + ducks(a, DUCKW) + '<span class="g1op">+</span>' + ducks(b, DUCKB) + '</div>'; }
  function sumPair(max, zero) { var c = R(zero ? 1 : 2, max), a = R(zero ? 0 : 1, zero ? c : c - 1); return [a, c - a]; }
  function sumChoices(n, max) { return numChoices(n, 0, Math.max(max, 6)); }
  S.plusEquals = function (o, l) {
    var want = P(['plus', 'equals']), opts = [['+', 'plus'], ['=', 'equals'], ['−', 'minus']];
    return { readOut: true, skill: 'plusEquals', type: 'choice', big: true, data: { want: want }, prompt: 'Tap the ' + want.toUpperCase() + ' sign.', say: 'Tap the ' + want + ' sign.', visual: big('2 + 3 = 5'),
      choices: U.shuffle(opts).map(function (x) { return { html: '<span class="g1num" style="font-size:3rem">' + x[0] + '</span>', value: x[1], err: x[1] === want ? null : 'signs', say: x[1] }; }), answer: want,
      hints: ['The plus sign looks like a little cross: +. It means put together.', 'The equals sign is two short lines: =. It means is the same as.'], explain: want === 'plus' ? 'This is the plus sign: +. It means put together.' : 'This is the equals sign: =. It means is the same as.' };
  };
  S.addTo6 = function (o, l) {
    var max = o.max || 6, p = sumPair(max, o.zero && Math.random() < 0.3), a = p[0], b = p[1], n = a + b, v = twoGroups(a, b);
    return { tapCount: true, readOut: true, skill: 'addTo6', type: 'choice', data: { a: a, b: b }, prompt: a + ' white duck' + (a === 1 ? '' : 's') + ' and ' + b + ' brown duck' + (b === 1 ? '' : 's') + '. How many in all? ' + big(a + ' + ' + b + ' = ?'), say: W[a] + ' white duck' + (a === 1 ? '' : 's') + ' and ' + W[b] + ' brown duck' + (b === 1 ? '' : 's') + '. How many in all?', visual: v,
      choices: sumChoices(n, max), answer: String(n), key: (a === 0 || b === 0) ? 'zeroPrinciple' : undefined,
      hints: [a === 0 || b === 0 ? 'Adding zero means adding nothing. The number stays the same!' : 'Put the two groups together.', 'Count them all, or count on from ' + Math.max(a, b) + '.'], explain: a + ' + ' + b + ' = ' + n + '.',
      walk: [{ say: 'How many white ducks?', show: ducks(a, DUCKW), ask: { type: 'number', answer: a } }, { say: 'Now count on with the brown ducks. How many in all?', show: v, ask: { type: 'number', answer: n }, final: true }] };
  };
  S.addSentence = function (o, l) {
    var max = o.max || 6, p = sumPair(max, o.zero), a = p[0], b = p[1], n = a + b, v = twoGroups(a, b), right = a + ' + ' + b + ' = ' + n, opts = [right], tries = 0;
    while (opts.length < 3 && tries++ < 40) { var x = Math.max(0, a + P([-1, 1, 0])), y = Math.max(0, b + P([-1, 1, 0])), s = x + ' + ' + y + ' = ' + (x + y); if (opts.indexOf(s) < 0 && !(x === b && y === a)) opts.push(s); }
    return { readOut: true, skill: 'addSentence', type: 'choice', data: { a: a, b: b }, prompt: 'Which addition sentence tells about the ducks?', say: 'Which addition sentence tells about the ducks? The white ducks come first.', visual: v,
      choices: U.shuffle(opts).map(function (s) { return { html: big(s), value: s, err: s === right ? null : 'add-sentence', say: s.replace('+', 'plus').replace('=', 'equals') }; }), answer: right,
      hints: ['Count the white ducks. That is the first number.', 'Count the brown ducks. Then count them all.'], explain: a + ' white ducks plus ' + b + ' brown ducks equals ' + n + ' ducks: ' + right + '.',
      walk: [{ say: 'Count the white ducks.', show: ducks(a, DUCKW), ask: { type: 'number', answer: a } }, { say: 'Count the brown ducks.', show: ducks(b, DUCKB), ask: { type: 'number', answer: b } },
        { say: 'Which sentence matches?', show: v, ask: { type: 'choice', options: opts.map(function (s) { return { html: big(s), value: s, say: s.replace('+', 'plus').replace('=', 'equals') }; }), answer: right }, final: true }] };
  };
  var STORIES = [
    ['fish', 'fish', '#3b8fd9', function (a, b) { return 'Pete caught ' + a + ' fish in the morning and ' + b + ' fish in the afternoon. How many fish did he catch?'; }],
    ['loaf', 'loaves', '#d49a4a', function (a, b) { return 'Marisol baked ' + a + ' loaves of bread for a sick neighbor. Then she baked ' + b + ' more. How many loaves in all?'; }],
    ['apple', 'apples', '#e5533d', function (a, b) { return 'Ana put ' + a + ' apples in a basket to share. Leo added ' + b + ' more. How many apples are in the basket?'; }],
    ['gull', 'seagulls', '#ffffff', function (a, b) { return a + ' seagulls sat on the pier. ' + b + ' more flew in. How many seagulls are there now?'; }],
    ['boat', 'boats', '#e5533d', function (a, b) { return a + ' boats were at the dock. ' + b + ' more came in. How many boats are at the dock now?'; }]
  ];
  S.addStory = function (o, l) {
    var max = o.max || 6, a = R(2, max - 1), b = R(o.zero && Math.random() < 0.3 ? 0 : 1, max - a), n = a + b, st = P(STORIES), text = st[3](a, b);
    var v = '<div class="g1row">' + Models.row(a, st[0], st[2], 0, 200) + '<span class="g1op">+</span>' + (b ? Models.row(b, st[0], st[2], 0, 200) : '<span class="g1word">0</span>') + '</div>';
    return { tapCount: true, readOut: true, skill: 'addStory', type: 'choice', data: { a: a, b: b }, prompt: text, say: text.replace(/\b(\d)\b/g, function (m) { return W[+m]; }), visual: l === 3 ? '' : v,
      choices: sumChoices(n, max), answer: String(n), hints: ['Draw a picture: ' + a + ' and ' + b + ' more.', a + ' + ' + b + ' = ?'], explain: a + ' + ' + b + ' = ' + n + '.',
      walk: [{ say: 'Draw ' + W[a] + ' ' + st[1] + '. Then draw ' + W[b] + ' more.', show: v }, { say: 'Count them all. How many?', show: v, ask: { type: 'number', answer: n }, final: true }] };
  };
  S.addVertical = function (o, l) {
    var max = o.max || 6, p = sumPair(max, o.zero), a = p[0], b = p[1], n = a + b, dom = Math.random() < 0.5;
    var v = '<div class="g1row">' + Models.vertical(a, b) + (dom ? Models.domino(a, b, 110) : '<div>' + Array.from({ length: a }, function () { return Models.coin('penny', 34); }).join('') + '<br>' + Array.from({ length: b }, function () { return Models.coin('penny', 34); }).join('') + '</div>') + '</div>';
    return { tapCount: true, readOut: true, skill: 'addVertical', type: 'choice', data: { a: a, b: b }, prompt: 'Add. ' + (dom ? 'Use the domino to help.' : 'Use the pennies to help.'), say: 'Add ' + W[a] + ' plus ' + W[b] + '. ' + (dom ? 'Use the domino to help.' : 'Use the pennies to help.'), visual: v,
      choices: sumChoices(n, max), answer: String(n), key: 'addVertical', hints: ['Add the top number and the bottom number.', dom ? 'Count all the dots on the domino.' : 'Count all the pennies.'], explain: a + ' + ' + b + ' = ' + n + '. The answer goes under the line.',
      walk: [{ say: 'When we add up and down, we add the top number and the bottom number. The answer goes under the line.', show: v }, { say: 'Count all the ' + (dom ? 'dots' : 'pennies') + '. How many?', show: v, ask: { type: 'number', answer: n }, final: true }] };
  };
  S.addNames = function (o, l) {
    var t = o.target ? P(o.target) : R(4, 6), a = R(0, t), right = a + ' + ' + (t - a), opts = [right], tries = 0;
    while (opts.length < 3 && tries++ < 40) { var x = R(0, 5), y = R(0, 5), s = x + ' + ' + y; if (x + y !== t && x + y <= 7 && opts.indexOf(s) < 0) opts.push(s); }
    return { readOut: true, skill: 'addNames', type: 'choice', data: { t: t, a: a }, prompt: 'Which one is another name for ' + t + '?', say: 'Which one is another name for ' + W[t] + '? Which one makes ' + W[t] + '?', visual: Models.dots(t, 70),
      choices: U.shuffle(opts).map(function (s) { return { html: big(s), value: s, err: s === right ? null : 'add-names', say: s.replace('+', 'plus') }; }), answer: right,
      hints: ['Add each one. Which one makes ' + t + '?', right + ' = ' + t + '.'], explain: right + ' = ' + t + ', so ' + right + ' is a name for ' + t + '.',
      walk: [{ say: 'A number has many names. ' + W[t] + ' can be made in different ways.', show: Models.dots(t, 70) }, { say: 'Add each one. Which one makes ' + W[t] + '?', show: '', ask: { type: 'choice', options: opts.map(function (s) { return { html: big(s), value: s, say: s.replace('+', 'plus') }; }), answer: right }, final: true }] };
  };
  S.turnAround = function (o, l) {
    var max = o.max || 6, a, b; do { var p = sumPair(max); a = p[0]; b = p[1]; } while (a === b); var n = a + b;
    var v = '<div class="g1row">' + Models.domino(a, b, 70, true) + '<span class="g1op">↻</span>' + Models.domino(b, a, 70, true) + '</div>';
    return { readOut: true, skill: 'turnAround', type: 'choice', data: { a: a, b: b }, prompt: big(a + ' + ' + b + ' = ' + n) + ' So, ' + big(b + ' + ' + a + ' = ?'), say: W[a] + ' plus ' + W[b] + ' equals ' + W[n] + '. So, ' + W[b] + ' plus ' + W[a] + ' equals what?', visual: v,
      choices: sumChoices(n, max), answer: String(n), key: 'turnAround', hints: ['Turn the domino around. Are there more dots, or the same?', 'Changing the order does not change the answer.'], explain: 'Turn-around facts have the same answer: ' + b + ' + ' + a + ' = ' + n + '.',
      walk: [{ say: 'Look at the domino. Turn it around. It has the same dots!', show: v }, { say: 'So the answer is the same. What is ' + W[b] + ' plus ' + W[a] + '?', show: v, ask: { type: 'number', answer: n }, final: true }] };
  };

  var NAMES = { plusEquals: 'Plus and equals signs', addTo6: 'Adding to 6', addSentence: 'Addition sentences', addStory: 'Addition stories', addVertical: 'Adding up and down', addNames: 'Names for 4, 5 and 6', turnAround: 'Turn-around facts',
    numeral: 'Knowing numbers', numberWord: 'Number words', dots: 'Dot patterns', tally: 'Tally marks', countSet: 'Counting', makeSet: 'Making sets', compareSets: 'More and fewer',
    nextNumber: 'Before and after', missingNumber: 'Number order', ordinal: 'First, second, third', evenOdd: 'Even and odd', namesForTen: 'Ways to make 10', countTens: 'Counting by tens',
    shapeFind: 'Shapes', pattern: 'Patterns', oddOneOut: 'Sorting', add10: 'Adding to 10', sub10: 'Taking away to 10', coinName: 'Coins', coinValue: 'Coin values', countPennies: 'Counting pennies',
    clockHour: 'Time to the hour', dayAfter: 'Days of the week', longer: 'Longer and shorter', equalShares: 'Equal parts', pictograph: 'Picture graphs', dozen: 'A dozen', barGraph: 'Bar graphs', matchUp: 'Matching one to one' };

  /* simple picture guides ("Show me how") for the Grade 1 skills */
  var GUIDES = {
    g1count: { title: 'Counting', steps: [['Touch each one and say a number: one, two, three…', function () { return Models.row(4, 'duck', '#ffd23f'); }], ['Count each one only once. The last number you say is how many!', function () { return big('1, 2, 3, 4'); }]] },
    g1numbers: { title: 'Numbers 0 to 10', steps: [['Each number has a name and a picture of dots.', function () { return big('3') + Models.dots(3, 80) + '<span class="g1word">three</span>'; }], ['Counting goes up by one: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.', function () { return ''; }]] },
    g1compare: { title: 'More and fewer', steps: [['Count both groups.', function () { return Models.row(5, 'fish', '#3b8fd9', 0, 220) + Models.row(3, 'fish', '#3b8fd9', 0, 220); }], ['The bigger number has MORE. The smaller number has FEWER.', function () { return big('5 is more than 3'); }]] },
    g1ordinal: { title: 'First, second, third', steps: [['Start at the front of the line and count: first, second, third, fourth, fifth.', function () { return '<div class="g1row">' + ['first', 'second', 'third'].map(function (w, i) { return '<div class="center">' + Art.icon('duck', 50) + '<b>' + w + '</b></div>'; }).join('') + '</div>'; }]] },
    g1even: { title: 'Even and odd', steps: [['Make pairs. If every one has a partner, the number is EVEN.', function () { return big('2, 4, 6, 8, 10'); }], ['If one is left over, the number is ODD.', function () { return big('1, 3, 5, 7, 9'); }]] },
    g1ten: { title: 'Ways to make 10', steps: [['A ten-frame has 10 boxes.', function () { return Models.tenFrame(7, 'duck'); }], ['Count the full boxes, then the empty boxes. 7 and 3 make 10.', function () { return big('7 + 3 = 10'); }]] },
    g1add: { title: 'Adding', steps: [['Put the groups together.', function () { return '<div class="g1row">' + Models.row(2, 'duck', '#ffd23f', 0, 140) + '<span class="g1op">+</span>' + Models.row(3, 'duck', '#ffd23f', 0, 140) + '</div>'; }], ['Count them all, or count on from the bigger number: 3… 4, 5.', function () { return big('2 + 3 = 5'); }]] },
    g1sub: { title: 'Taking away', steps: [['Start with all of them. Cross out the ones that go away.', function () { return Models.row(5, 'apple', '#e5533d', 2); }], ['Count the ones that are left.', function () { return big('5 − 2 = 3'); }]] },
    g1shapes: { title: 'Shapes', steps: [['Circle, square, triangle, rectangle.', function () { return SH2.map(function (k) { return '<div class="center">' + Models.figure(k, 70) + '<b>' + k + '</b></div>'; }).join(''); }]] },
    g1pattern: { title: 'Patterns', steps: [['A pattern repeats. Say it out loud: red, blue, red, blue…', function () { return '<div class="g1row"><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span></div>'; }]] },
    g1coins: { title: 'Coins', steps: [['Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢.', function () { return ['penny', 'nickel', 'dime', 'quarter'].map(function (k) { return Models.coin(k, 60); }).join(''); }]] },
    g1clock: { title: 'Time to the hour', steps: [['When the long hand points to 12, it is an o\'clock time.', function () { return Models.clock(3, 0, 120); }], ['The short hand tells the hour. This is 3:00.', function () { return big('3:00'); }]] },
    g1bar: { title: 'Bar graphs', video: { label: 'Data! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=zF_dBk8EPDk' }, steps: [['The taller the bar, the more there are.', function () { return barSvg([BARS[0], BARS[1], BARS[2]], [5, 2, 3], 6); }], ['To read a bar, put your finger on top and slide across to the number.', function () { return ''; }]] },
    g1tens: { title: 'Counting by tens', steps: [['Each bundle has 10. Count bundles by tens: 10, 20, 30.', function () { return Models.sticks(3, 0); }], ['Then count the loose ones: 31, 32.', function () { return Models.sticks(3, 2); }]] }
  };
  var GUIDE_OF = { numeral: 'g1numbers', numberWord: 'g1numbers', dots: 'g1count', tally: 'g1count', countSet: 'g1count', makeSet: 'g1count', compareSets: 'g1compare', nextNumber: 'g1numbers',
    missingNumber: 'g1numbers', ordinal: 'g1ordinal', evenOdd: 'g1even', namesForTen: 'g1ten', countTens: 'g1tens', shapeFind: 'g1shapes', pattern: 'g1pattern', add10: 'g1add', sub10: 'g1sub',
    coinName: 'g1coins', coinValue: 'g1coins', countPennies: 'g1coins', clockHour: 'g1clock', dozen: 'g1count', barGraph: 'g1bar', matchUp: 'g1compare',
    plusEquals: 'g1add6', addTo6: 'g1add6', addSentence: 'g1add6', addStory: 'g1add6', addVertical: 'g1add6', addNames: 'g1add6', turnAround: 'g1add6' };
  GUIDES.g1sort = { title: 'Which one does not belong?', steps: [
    ['Look at all of them. Which ones are alike?', function () { return '<div class="g1row">' + Art.icon('fish', 60, '#3b8fd9') + Art.icon('duck', 60, '#ffd23f') + Art.icon('gull', 60) + Art.icon('apple', 60, '#e5533d') + '</div>'; }],
    ['The fish, duck and seagull are all animals. The apple is a food. The apple does not belong!', function () { return Art.icon('apple', 80, '#e5533d'); }]] };
  GUIDES.g1long = { title: 'Longer and shorter', video: { label: 'Measuring! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=2wUsdsae0ro' }, steps: [
    ['Line up the ends on one side.', function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + '<br>' + Models.lengthBar(4, '#3b8fd9', 8) + '</div>'; }],
    ['The one that sticks out farther is LONGER. The other one is SHORTER.', function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + ' <b>longer</b><br>' + Models.lengthBar(4, '#3b8fd9', 8) + ' <b>shorter</b></div>'; }]] };
  GUIDES.g1pict = { title: 'Picture graphs', video: { label: 'Data! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=zF_dBk8EPDk' }, steps: [
    ['Each picture means one. Count the pictures in each row.', function () { return '<div class="g1graph"><div class="g1grow"><b>Fish</b>' + Art.icon('fish', 34, '#3b8fd9') + Art.icon('fish', 34, '#3b8fd9') + Art.icon('fish', 34, '#3b8fd9') + '</div><div class="g1grow"><b>Ducks</b>' + Art.icon('duck', 34, '#ffd23f') + '</div></div>'; }],
    ['The longest row has the MOST. The shortest row has the FEWEST.', function () { return big('Fish: 3 · Ducks: 1'); }]] };
  GUIDES.g1equal = { title: 'Equal parts', video: { label: 'Fractions! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=362JVVvgYPE' }, steps: [
    ['Equal parts are all the same size. Two equal parts are halves.', function () { return Models.shape({ kind: 'circle', n: 2, shaded: 0, size: 120 }); }],
    ['Four equal parts are fourths. If one part is bigger, they are NOT equal.', function () { return Models.shape({ kind: 'circle', n: 4, shaded: 0, size: 120 }) + Models.shape({ kind: 'rect', n: 2, shaded: 0, unequal: true, size: 120 }); }]] };
  GUIDES.g1days = { title: 'Days of the week', video: { label: 'Seven Days a Week (The Singing Walrus)', url: 'https://www.youtube.com/watch?v=lPgTdgvj_jc' }, steps: [
    ['Say the days in order: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.', function () { return big('Sun · Mon · Tue · Wed · Thu · Fri · Sat'); }],
    ['The day AFTER comes next. The day BEFORE comes just in front. After Monday comes Tuesday!', function () { return big('Monday → Tuesday'); }]] };
  Object.assign(GUIDE_OF, { oddOneOut: 'g1sort', longer: 'g1long', pictograph: 'g1pict', equalShares: 'g1equal', dayAfter: 'g1days' });
  GUIDES.g1add6 = { title: 'Adding to 6', video: { label: 'Adding & Subtracting! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=7J1OkxuyLD0' }, steps: [
    ['Plus (+) means put together. Equals (=) means is the same as.', function () { return '<div class="g1row">' + ducks(2, DUCKW, 40) + '<span class="g1op">+</span>' + ducks(3, DUCKB, 40) + '</div>' + big('2 + 3 = 5'); }],
    ['Adding zero changes nothing: 4 + 0 = 4.', function () { return big('4 + 0 = 4'); }],
    ['Up and down: add the top and the bottom. The answer goes under the line.', function () { return Models.vertical(2, 3, 5); }],
    ['Turn-around facts have the same answer: 2 + 3 = 3 + 2.', function () { return Models.domino(2, 3, 50, true) + ' ↻ ' + Models.domino(3, 2, 50, true); }]] };
  Help.extend(GUIDES, GUIDE_OF);

  /* A picture key for every concept: shown beside each question in Lantern Harbor, with a 🔊 to hear it. */
  function sm(n, k, c) { return Models.row(n, k || 'fish', c || '#3b8fd9', 0, 200); }
  function line(a, b) { var o = '<div class="keyline">'; for (var i = a; i <= b; i++) o += '<span>' + i + '</span>'; return o + '</div>'; }
  var KEYS = {
    numeral: { say: 'Here are the numbers from zero to ten, with dots to help you.', html: function () { return '<div class="keynums">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return '<span><b>' + n + '</b>' + Models.dots(n, 34) + '</span>'; }).join('') + '</div>'; } },
    numberWord: { say: 'Each number has a word. Zero, one, two, three, four, five, six, seven, eight, nine, ten.', html: function () { return '<div class="keynums">' + W.slice(0, 11).map(function (w, n) { return '<span><b>' + n + '</b><i>' + w + '</i></span>'; }).join('') + '</div>'; } },
    dots: { say: 'Count each dot one time. The last number you say is how many.', html: function () { return Models.dots(3, 50) + Models.dots(5, 50) + '<div>3 &nbsp; 5</div>'; } },
    tally: { say: 'Each line is one. Four lines with a line across them make five.', html: function () { return Models.tally(1).replace(/width="[^"]*" height="112"/, 'width="40" height="50"') + ' = 1 &nbsp; ' + Models.tally(5).replace(/width="[^"]*" height="112"/, 'width="60" height="50"') + ' = 5'; } },
    countSet: { say: 'Touch each one and say a number. The last number you say tells how many.', html: function () { return sm(3, 'duck', '#ffd23f') + '<div>1, 2, 3 → 3</div>'; } },
    makeSet: { say: 'Count as you tap. Stop when you reach the number.', html: function () { return sm(3, 'duck', '#ffd23f') + '<div>stop at 3</div>'; } },
    compareSets: { say: 'More means the bigger group. Fewer means the smaller group.', html: function () { return '<div><b>MORE</b> ' + sm(5) + '</div><div><b>FEWER</b> ' + sm(2) + '</div>'; } },
    nextNumber: { say: 'After means one more. Before means one less. Use the number line.', html: function () { return line(0, 20) + '<div>← before · after →</div>'; } },
    missingNumber: { say: 'Numbers go in order on the number line. Say them out loud to find the missing one.', html: function () { return line(0, 20); } },
    ordinal: { say: 'Start at the front of the line. First, second, third, fourth, fifth.', html: function () { return '<div class="g1row">' + ['1st', '2nd', '3rd', '4th', '5th'].map(function (o) { return '<span class="center">' + Art.icon('duck', 30) + '<b>' + o + '</b></span>'; }).join('') + '</div>'; } },
    evenOdd: { say: 'Even means every one has a partner. Odd means one is left over with no partner.', html: function () { return '<div><b>EVEN</b> <span class="g1pairs"><span>' + Art.icon('fish', 26) + Art.icon('fish', 26) + '</span><span>' + Art.icon('fish', 26) + Art.icon('fish', 26) + '</span></span></div><div><b>ODD</b> <span class="g1pairs"><span>' + Art.icon('fish', 26) + Art.icon('fish', 26) + '</span><span>' + Art.icon('fish', 26) + '<i class="g1alone" style="width:26px;height:26px"></i></span></span></div>'; } },
    namesForTen: { say: 'A ten-frame has ten boxes. Count the empty boxes to find how many more make ten.', html: function () { return Models.tenFrame(7, 'dot', 140) + '<div>7 + 3 = 10</div>'; } },
    countTens: { say: 'Each bundle is ten. Count bundles by tens, then the loose sticks by ones.', html: function () { return Models.sticks(2, 3).replace(/width="[^"]*" height="132"/, 'width="150" height="80"') + '<div>10, 20 … 21, 22, 23</div>'; } },
    shapeFind: { say: 'A circle is round. A triangle has three sides. A square has four sides the same. A rectangle has two long sides and two short sides.', html: function () { return '<div class="g1row">' + ['circle', 'triangle', 'square', 'rectangle'].map(function (k) { return '<span class="center">' + Models.figure(k, 40) + '<i>' + k + '</i></span>'; }).join('') + '</div>'; } },
    pattern: { say: 'A pattern repeats again and again. Find the part that repeats, and say it out loud.', html: function () { return '<div class="g1row"><span class="g1dot" style="background:#e5533d;width:26px;height:26px"></span><span class="g1dot" style="background:#3b8fd9;width:26px;height:26px"></span><span class="g1dot" style="background:#e5533d;width:26px;height:26px"></span><span class="g1dot" style="background:#3b8fd9;width:26px;height:26px"></span> …</div>'; } },
    oddOneOut: { say: 'Three things are alike. Find the one that is different.', html: function () { return Art.icon('fish', 34) + Art.icon('duck', 34) + Art.icon('gull', 34) + ' ≠ ' + Art.icon('apple', 34); } },
    add10: { say: 'Plus means put the groups together. Count them all.', html: function () { return sm(2, 'duck', '#ffd23f') + ' + ' + sm(1, 'duck', '#ffd23f') + '<div>2 + 1 = 3</div>'; } },
    sub10: { say: 'Minus means take away. Count only the ones that are left.', html: function () { return Models.row(4, 'apple', '#e5533d', 1, 200) + '<div>4 − 1 = 3</div>'; } },
    coinName: { say: 'Penny, one cent. Nickel, five cents. Dime, ten cents. Quarter, twenty-five cents.', html: function () { return ['penny', 'nickel', 'dime', 'quarter'].map(function (k) { return '<span class="center">' + Models.coin(k, 34) + '<i>' + k + '</i></span>'; }).join(''); } },
    clockHour: { say: 'The short hand tells the hour. When the long hand points to twelve, it is o\'clock.', html: function () { return Models.clock(3, 0, 90) + '<div>short hand → 3 · 3:00</div>'; } },
    dayAfter: { say: 'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. After means the next day.', html: function () { return '<div class="keyline">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>'; } },
    longer: { say: 'Line up the ends. The longer one sticks out farther.', html: function () { return Models.lengthBar(6, '#e5533d', 7) + ' longer<br>' + Models.lengthBar(3, '#3b8fd9', 7) + ' shorter'; } },
    equalShares: { say: 'Equal parts are all the same size. Halves are two equal parts. Fourths are four equal parts.', html: function () { return Models.shape({ kind: 'circle', n: 2, shaded: 0, size: 60 }) + Models.shape({ kind: 'circle', n: 4, shaded: 0, size: 60 }) + '<div>halves · fourths</div>'; } },
    pictograph: { say: 'Count the pictures in each row. Most means the biggest number. Fewest means the smallest number.', html: function () { return '<div>' + Art.icon('fish', 24) + Art.icon('fish', 24) + Art.icon('fish', 24) + ' = 3</div><div>' + Art.icon('duck', 24) + ' = 1</div>'; } }
  };
  KEYS.teens = { say: 'Teen numbers are ten and some more. Eleven is ten and one. Twelve is ten and two. Twenty is two tens.', html: function () { return '<div class="keynums">' + [11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(function (n) { return '<span><b>' + n + '</b><i>10 + ' + (n - 10) + '</i></span>'; }).join('') + '</div>'; } };
  KEYS.teenWords = { say: 'Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.', html: function () { return '<div class="keynums">' + W.slice(11, 21).map(function (w, i) { return '<span><b>' + (i + 11) + '</b><i>' + w + '</i></span>'; }).join('') + '</div>'; } };
  KEYS.ordinal10 = { say: 'Start at the front. First, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth.', html: function () { return '<div class="keyline">' + ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(function (o) { return '<span>' + o + '</span>'; }).join('') + '</div><div>🚩 front →</div>'; } };
  KEYS.dozen = { say: 'A dozen means twelve. A carton of eggs holds a dozen.', html: function () { return Models.row(12, 'egg', '#fff6e0', 0, 200) + '<div>a dozen = 12</div>'; } };
  KEYS.barGraph = { say: 'In a bar graph, the taller the bar, the more there are. Look from the top of the bar across to the number.', html: function () { return barSvg([BARS[0], BARS[1]], [4, 2], 5).replace(/width="[^"]*"/, 'width="150"') + '<div>taller bar = more</div>'; } };
  KEYS.matchUp = { say: 'Match one to one. Give each one a partner. If any are left over, the groups are not the same.', html: function () { return '<div class="g1match">' + [0, 1, 2].map(function (i) { return '<div class="g1mcol">' + Art.icon('boat', 30, '#e5533d') + (i < 2 ? Art.icon('basket', 26) : '<span class="g1ghost" style="width:26px;height:26px"></span>') + '</div>'; }).join('') + '</div>'; } };
  KEYS.plusEquals = { say: 'The plus sign means put together. The equals sign means is the same as.', html: function () { return big('2 + 3 = 5') + '<div>+ plus · = equals</div>'; } };
  KEYS.addTo6 = { say: 'Plus means put the groups together. Count them all, or start with the bigger group and count on.', html: function () { return ducks(2, DUCKW, 26) + ' + ' + ducks(1, DUCKB, 26) + '<div>2 + 1 = 3</div>'; } };
  KEYS.zeroPrinciple = { say: 'Adding zero means adding nothing. The number stays the same. Four plus zero is four.', html: function () { return ducks(4, DUCKW, 24) + ' + 0<div>4 + 0 = 4</div>'; } };
  KEYS.addSentence = { say: 'An addition sentence tells the story with numbers. The first group, plus the second group, equals how many in all.', html: function () { return ducks(3, DUCKW, 24) + ' + ' + ducks(2, DUCKB, 24) + '<div>3 + 2 = 5</div>'; } };
  KEYS.addStory = { say: 'In a story problem, find the two groups. Draw them, then count them all.', html: function () { return Models.row(2, 'fish', '#3b8fd9', 0, 80) + ' + ' + Models.row(3, 'fish', '#3b8fd9', 0, 110) + '<div>2 + 3 = 5</div>'; } };
  KEYS.addVertical = { say: 'Adding up and down: add the top number and the bottom number. The answer goes under the line.', html: function () { return Models.vertical(2, 3, 5); } };
  KEYS.addNames = { say: 'A number has many names. Five is four plus one, three plus two, and five plus zero.', html: function () { return '<div class="keynums"><span><b>5</b><i>4 + 1</i></span><span><b>5</b><i>3 + 2</i></span><span><b>5</b><i>5 + 0</i></span></div>'; } };
  KEYS.turnAround = { say: 'Turn-around facts: changing the order does not change the answer. Two plus three and three plus two are both five.', html: function () { return Models.domino(2, 3, 34, true) + ' ↻ ' + Models.domino(3, 2, 34, true) + '<div>2 + 3 = 3 + 2</div>'; } };
  KEYS.coinValue = KEYS.coinName; KEYS.countPennies = { say: 'Each penny is one cent. Count the pennies.', html: function () { return Models.coin('penny', 34) + ' = 1¢'; } };

  function make(skill, opts) { opts = opts || {}; return function (level) { return S[skill](opts, level || 2); }; }
  return { make: make, S: S, NAMES: NAMES, W: W, KEYS: KEYS, barSvg: barSvg };
})();
