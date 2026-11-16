/* Slice Isle — Prelude unit P14: Fractions.
   Matches BJU Press Math 2, 5th edition, Chapter 14, lessons 126–135 (Lesson Plan Overview).
   Each quest = one BJU lesson. Problems are generated fresh every time, at three difficulty levels. */
(function () {
  var F = U.frac, R = U.rand, P = U.pick;
  function PN() { return window.App && App.parrotName ? App.parrotName() : 'Pip'; }
  var NAMES = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'] };
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function fw(k, n) { return Audio2.fracWords(k, n); }
  function dens(level) { return level === 1 ? [2, 3, 4] : level === 2 ? [2, 3, 4, 6] : [3, 4, 6, 8]; }
  function kind() { return P(['circle', 'rect', 'square']); }
  function fc(k, n, err) { return { html: F(k, n), value: k + '/' + n, err: err, say: fw(k, n) }; }
  function dedupe(choices) {
    var seen = {}, out = [];
    choices.forEach(function (c) { if (!seen[c.value]) { seen[c.value] = 1; out.push(c); } });
    return U.shuffle(out);
  }
  function txt(t, err) { return { html: '<span style="font-size:1.2rem">' + t + '</span>', value: t, err: err, say: t }; }

  /* ---------------- problem generators ---------------- */
  var G = {};

  G.equalOrNot = function (level) {
    var n = P(dens(level)), k = P(['circle', 'rect']), unequal = Math.random() < 0.5;
    return { skill: 'equalOrNot', type: 'choice', data: { n: n, unequal: unequal },
      prompt: 'Are the parts of this shape equal?', say: 'Are the parts of this shape equal?',
      visual: Models.shape({ kind: k, n: n, shaded: 0, unequal: unequal, size: 190 }),
      choices: [txt('Yes, equal', unequal ? 'unequal-parts' : null), txt('No, not equal', unequal ? null : 'unequal-parts')],
      answer: unequal ? 'No, not equal' : 'Yes, equal',
      hints: ['Equal parts are all exactly the same size.', 'Look at each piece. Is any piece bigger or smaller than the others?',
        unequal ? 'Some pieces are bigger than others, so the parts are not equal.' : 'Every piece is the same size, so the parts are equal.'],
      explain: unequal ? 'Some pieces are bigger, so these parts are not equal.' : 'All the pieces are the same size, so they are equal parts.' };
  };

  G.countParts = function (level) {
    var n = P(dens(level));
    var opts = U.uniq([n, n + 1, n - 1 > 1 ? n - 1 : n + 2, n * 2 > 8 ? n + 3 : n * 2]).slice(0, 4);
    return { skill: 'countParts', type: 'choice', data: { n: n },
      prompt: 'How many equal parts does this shape have?', say: 'How many equal parts does this shape have?',
      visual: Models.shape({ kind: kind(), n: n, shaded: 0, grid: level > 1, size: 190 }),
      choices: U.shuffle(opts.map(function (x) { return { html: String(x), value: String(x), err: 'count-parts', say: String(x) }; })),
      answer: String(n),
      hints: ['Touch each part with your eyes and count.', 'Count slowly: 1, 2, 3...', 'There are ' + n + ' equal parts.'],
      explain: 'This shape has ' + n + ' equal parts.' };
  };

  G.nameParts = function (level) {
    var n = P(level === 1 ? [2, 3, 4] : [2, 3, 4, 6, 8]);
    var all = ['halves', 'thirds', 'fourths', 'sixths', 'eighths'];
    var opts = U.shuffle(all.filter(function (x) { return x !== NAMES[n][1]; })).slice(0, 2).concat([NAMES[n][1]]);
    return { skill: 'nameParts', type: 'choice', data: { n: n },
      prompt: 'This shape is cut into ' + n + ' equal parts. What are the parts called?', say: 'This shape is cut into ' + NUMW[n] + ' equal parts. What are the parts called?',
      visual: Models.shape({ kind: kind(), n: n, shaded: 1, size: 190 }),
      choices: U.shuffle(opts.map(function (x) { return txt(x, 'fraction-names'); })),
      answer: NAMES[n][1],
      hints: ['Count the equal parts first.', '2 parts: halves. 3: thirds. 4: fourths. 6: sixths. 8: eighths.', n + ' equal parts are called ' + NAMES[n][1] + '.'],
      explain: n + ' equal parts are called ' + NAMES[n][1] + '.' };
  };

  G.wholeFraction = function (level) {
    var n = P(dens(level));
    if (Math.random() < 0.5) {
      return { skill: 'wholeFraction', type: 'choice', data: { n: n, t: 0 },
        prompt: 'How many ' + NAMES[n][1] + ' make one whole?', say: 'How many ' + NAMES[n][1] + ' make one whole?',
        visual: Models.shape({ kind: 'circle', n: n, shaded: n, size: 170 }),
        choices: U.shuffle(U.uniq([n, 1, n + 1, n * 2]).map(function (x) { return { html: String(x), value: String(x), err: 'whole', say: String(x) }; })),
        answer: String(n),
        hints: ['Count all the parts in the whole shape.', 'When every part is shaded, you have the whole thing.', n + ' ' + NAMES[n][1] + ' make one whole.'],
        explain: n + ' ' + NAMES[n][1] + ' make one whole.' };
    }
    return { skill: 'wholeFraction', type: 'choice', data: { n: n, t: 1 },
      prompt: F(n, n) + ' is the same as...', say: fw(n, n) + ' is the same as what?',
      visual: Models.shape({ kind: kind(), n: n, shaded: n, size: 170 }),
      choices: U.shuffle([txt('1 whole'), txt(n + ' wholes', 'whole'), txt('0', 'whole')]),
      answer: '1 whole',
      hints: ['Look: every part is shaded.', 'All the parts together make the whole shape.', F(n, n) + ' is 1 whole.'],
      explain: 'All ' + n + ' parts are shaded, so ' + fw(n, n) + ' is 1 whole.' };
  };

  G.shadedFraction = function (level) {
    var n = P(dens(level)), k = R(1, n - 1);
    var ch = [fc(k, n), fc(n - k, n, 'counted-unshaded'), fc(n, k, 'swapped')];
    if (n - k !== k) ch.push(fc(k, n - k, 'part-to-part'));
    if (n - k === k) ch.push(fc(k + 1 <= n ? k + 1 : k - 1, n, 'miscount'));
    return { skill: 'shadedFraction', type: 'choice', data: { n: n, k: k },
      prompt: 'What fraction of the shape is shaded?', say: 'What fraction of the shape is shaded?',
      visual: Models.shape({ kind: kind(), n: n, shaded: k, grid: level > 1, size: 190 }),
      choices: dedupe(ch).filter(function (c) { var p = c.value.split('/'); return +p[0] <= +p[1] || c.err; }).slice(0, 4),
      answer: k + '/' + n,
      hints: ['The bottom number (denominator) is how many equal parts in all.', 'Count all the parts: that is the bottom number. Count the shaded parts: that is the top number.',
        'There are ' + n + ' parts and ' + k + (k === 1 ? ' is' : ' are') + ' shaded, so the fraction is ' + k + '/' + n + '.'],
      explain: k + ' of ' + n + ' equal parts are shaded: ' + fw(k, n) + '.' };
  };

  G.shadeTo = function (level) {
    var n = P(dens(level)), k = R(1, n - 1);
    return { skill: 'shadeTo', type: 'shade', n: n, answer: k, data: { n: n, k: k },
      prompt: 'Tap parts to color ' + F(k, n) + ' of the shape.', say: 'Tap parts to color ' + fw(k, n) + ' of the shape.',
      visual: Models.shape({ kind: kind(), n: n, shaded: [], interactive: true, grid: level > 1, size: 220, id: 'shadeTarget' }),
      hints: ['The top number tells how many parts to color.', 'Color ' + k + ' part' + (k > 1 ? 's' : '') + '. It does not matter which ones.', 'Color exactly ' + k + ' of the ' + n + ' parts, then press Check.'],
      explain: 'To show ' + fw(k, n) + ', color ' + k + ' of the ' + n + ' parts.' };
  };

  G.whichShows = function (level) {
    var n = P(dens(level)), k = level === 1 ? 1 : R(1, n - 1);
    var other = n === 2 ? 3 : n - 1;
    var opts = [
      { html: Models.shape({ kind: 'rect', n: n, shaded: k, size: 120 }), value: 'right', say: 'this one' },
      { html: Models.shape({ kind: 'rect', n: n, shaded: k, unequal: true, size: 120 }), value: 'unequal', err: 'unequal-parts', say: 'this one' },
      { html: Models.shape({ kind: 'rect', n: other, shaded: Math.min(k, other - 1) || 1, size: 120 }), value: 'other', err: 'miscount', say: 'this one' }
    ];
    return { skill: 'whichShows', type: 'choice', data: { n: n, k: k },
      prompt: 'Which shape shows ' + F(k, n) + '?', say: 'Which shape shows ' + fw(k, n) + '?',
      visual: '', choices: U.shuffle(opts), answer: 'right', big: true,
      hints: ['A fraction needs equal parts.', 'Find the shape with ' + n + ' EQUAL parts and ' + k + ' shaded.', 'Watch out: one shape has parts that are not the same size.'],
      explain: 'The right shape has ' + n + ' equal parts with ' + k + ' shaded.' };
  };

  G.probability = function (level) {
    var colors = [['red', '#e5533d'], ['blue', '#3b8fd9'], ['yellow', '#f2c230'], ['green', '#2fa35a']];
    var a = P(colors), b = P(colors.filter(function (c) { return c !== a; }));
    var na = R(3, 7), nb = R(1, na - 1), counts = {}; counts[a[1]] = na; counts[b[1]] = nb;
    var askLess = level > 1 && Math.random() < 0.5;
    if (level === 3 && Math.random() < 0.35) {
      var c = P(colors.filter(function (x) { return x !== a && x !== b; }));
      return { skill: 'probability', type: 'choice', data: { t: 'none', c: c[0], na: na, nb: nb, a: a[0], b: b[0] },
        prompt: PN() + ' reaches into the jar without looking. Could it pull a ' + c[0] + ' marble?', say: PN() + ' reaches into the jar without looking. Could it pull a ' + c[0] + ' marble?',
        visual: Models.jar(counts),
        choices: U.shuffle([txt('Impossible'), txt('Likely', 'probability'), txt('Certain', 'probability')]), answer: 'Impossible',
        hints: ['Look at every marble in the jar.', 'Is there any ' + c[0] + ' marble at all?', 'There are no ' + c[0] + ' marbles, so it is impossible.'],
        explain: 'There are no ' + c[0] + ' marbles, so pulling one is impossible.' };
    }
    var right = askLess ? b[0] : a[0];
    return { skill: 'probability', type: 'choice', data: { t: askLess ? 'less' : 'more', na: na, nb: nb, a: a[0], b: b[0] },
      prompt: PN() + ' reaches into the jar without looking. Which color is it ' + (askLess ? 'LESS' : 'MORE') + ' likely to pull?',
      say: PN() + ' reaches into the jar without looking. Which color is it ' + (askLess ? 'less' : 'more') + ' likely to pull?',
      visual: Models.jar(counts),
      choices: U.shuffle([txt(a[0], askLess ? 'probability' : null), txt(b[0], askLess ? null : 'probability')]), answer: right,
      hints: ['Count the marbles of each color.', 'There are ' + na + ' ' + a[0] + ' and ' + nb + ' ' + b[0] + '.', (askLess ? 'Fewer marbles means less likely.' : 'More marbles means more likely.')],
      explain: 'There are ' + na + ' ' + a[0] + ' and ' + nb + ' ' + b[0] + ' marbles, so ' + right + ' is ' + (askLess ? 'less' : 'more') + ' likely.' };
  };

  function cmpChoices(right, errTag) {
    return ['>', '<', '='].map(function (s) {
      return { html: '<span style="font-size:2.2rem">' + s + '</span>', value: s, err: s === right ? null : errTag,
        say: s === '>' ? 'greater than' : s === '<' ? 'less than' : 'equal to' };
    });
  }
  G.compareLike = function (level) {
    var n = P(level === 1 ? [3, 4] : level === 2 ? [4, 6] : [6, 8]), a = R(1, n - 1), b = R(1, n - 1);
    if (level < 3) while (b === a) b = R(1, n - 1);
    var right = a > b ? '>' : a < b ? '<' : '=';
    return { skill: 'compareLike', type: 'choice', data: { a: a, b: b, n: n },
      prompt: 'Compare: ' + F(a, n) + ' &nbsp;?&nbsp; ' + F(b, n), say: 'Compare ' + fw(a, n) + ' and ' + fw(b, n) + '.',
      visual: Models.barStack([{ n: n, k: a, text: F(a, n) }, { n: n, k: b, text: F(b, n), fill: '#8fd3ff' }]),
      choices: cmpChoices(right, 'compare-like'), answer: right,
      hints: ['Both fractions have the same size parts.', 'With the same size parts, more parts means a bigger fraction.', a + ' parts ' + (a > b ? 'is more than' : a < b ? 'is less than' : 'is the same as') + ' ' + b + ' parts.'],
      explain: fw(a, n) + ' is ' + (right === '>' ? 'greater than' : right === '<' ? 'less than' : 'equal to') + ' ' + fw(b, n) + '.' };
  };

  G.compareUnit = function (level) {
    var ds = level === 1 ? [2, 4] : U.shuffle([2, 3, 4, 6, 8]).slice(0, 2);
    var a = ds[0], b = ds[1];
    if (level === 3 && Math.random() < 0.2) b = a;
    var right = a < b ? '>' : a > b ? '<' : '=';
    return { skill: 'compareUnit', type: 'choice', data: { a: a, b: b },
      prompt: 'Compare: ' + F(1, a) + ' &nbsp;?&nbsp; ' + F(1, b), say: 'Compare ' + fw(1, a) + ' and ' + fw(1, b) + '.',
      visual: level === 3 ? '' : Models.barStack([{ n: a, k: 1, text: F(1, a) }, { n: b, k: 1, text: F(1, b), fill: '#8fd3ff' }]),
      choices: cmpChoices(right, 'bigger-denominator'), answer: right,
      hints: ['Both bars are the same size whole.', 'When a whole is cut into MORE pieces, each piece is SMALLER.', (a === b ? 'Both are cut into ' + a + ' pieces, so the pieces are the same size.' : fw(1, Math.min(a, b)) + ' is the bigger piece.')],
      explain: 'Fewer pieces means bigger pieces, so ' + fw(1, a) + ' is ' + (right === '>' ? 'greater than' : right === '<' ? 'less than' : 'equal to') + ' ' + fw(1, b) + '.' };
  };

  var KIDS = ['Mateo', 'Lucía', 'Sam', 'Ava', 'Eli', 'Nora', 'Isaac', 'Sofía'];
  G.fractionWord = function (level) {
    var t = R(0, 2);
    if (t === 0) {
      var n = P(dens(level)), k = R(1, n - 1), who = P(KIDS);
      return { skill: 'fractionWord', type: 'choice', data: { t: 0, n: n, k: k, who: who },
        prompt: 'Abuela Rosa cut a pie into ' + n + ' equal slices. ' + who + ' ate ' + k + ' slice' + (k > 1 ? 's' : '') + '. What fraction of the pie did ' + who + ' eat?',
        say: 'Abuela Rosa cut a pie into ' + NUMW[n] + ' equal slices. ' + who + ' ate ' + NUMW[k] + '. What fraction of the pie did ' + who + ' eat?',
        visual: Models.shape({ kind: 'circle', n: n, shaded: k, size: 160 }),
        choices: dedupe([fc(k, n), fc(n - k, n, 'counted-unshaded'), fc(n, k, 'swapped')]), answer: k + '/' + n,
        hints: ['How many slices in the whole pie? That is the bottom number.', 'How many slices were eaten? That is the top number.', who + ' ate ' + k + ' of ' + n + ' slices.'],
        explain: who + ' ate ' + k + ' of ' + n + ' equal slices: ' + fw(k, n) + '.' };
    }
    var ds = U.shuffle([2, 3, 4, 6, 8]).slice(0, 2), w1 = P(KIDS), w2 = P(KIDS.filter(function (x) { return x !== w1; }));
    var more = ds[0] < ds[1] ? w1 : w2;
    return { skill: 'fractionWord', type: 'choice', data: { t: 1, d1: ds[0], d2: ds[1], w1: w1, w2: w2 },
      prompt: w1 + ' ate ' + F(1, ds[0]) + ' of a pie. ' + w2 + ' ate ' + F(1, ds[1]) + ' of the same size pie. Who ate more pie?',
      say: w1 + ' ate ' + fw(1, ds[0]) + ' of a pie. ' + w2 + ' ate ' + fw(1, ds[1]) + ' of the same size pie. Who ate more pie?',
      visual: level === 1 ? Models.barStack([{ n: ds[0], k: 1, text: w1 }, { n: ds[1], k: 1, text: w2, fill: '#8fd3ff' }]) : '',
      choices: U.shuffle([txt(w1, more === w1 ? null : 'bigger-denominator'), txt(w2, more === w2 ? null : 'bigger-denominator')]), answer: more,
      hints: ['Picture the two pies cut into pieces.', 'The pie cut into fewer pieces has bigger pieces.', more + ' had the bigger piece.'],
      explain: fw(1, Math.min(ds[0], ds[1])) + ' is bigger than ' + fw(1, Math.max(ds[0], ds[1])) + ', so ' + more + ' ate more.' };
  };

  var SETITEMS = [['fish', '#3b8fd9', '#9fb3c2', 'fish', 'blue'], ['shell', '#ff6f91', '#cdbfa6', 'shells', 'pink'], ['apple', '#e5533d', '#7cc46a', 'apples', 'red']];
  G.setFraction = function (level) {
    var it = P(SETITEMS), n = level === 1 ? R(3, 5) : level === 2 ? R(4, 7) : R(6, 10), k = R(1, n - 1);
    var ch = [fc(k, n), fc(n - k, n, 'counted-unshaded')];
    if (k !== n - k) ch.push(fc(k, n - k, 'part-to-part'));
    ch.push(fc(n, k, 'swapped'));
    return { skill: 'setFraction', type: 'choice', data: { n: n, k: k, it: it },
      prompt: 'What fraction of the ' + it[3] + ' are ' + it[4] + '?', say: 'What fraction of the ' + it[3] + ' are ' + it[4] + '?',
      visual: Models.set(n, k, it[0], it[1], it[2]),
      choices: dedupe(ch).slice(0, 4), answer: k + '/' + n,
      hints: ['Count ALL the ' + it[3] + '. That is the bottom number.', 'Count the ' + it[4] + ' ' + it[3] + '. That is the top number.', k + ' of the ' + n + ' ' + it[3] + (k === 1 ? ' is ' : ' are ') + it[4] + '.'],
      explain: k + ' out of ' + n + ' ' + it[3] + (k === 1 ? ' is ' : ' are ') + it[4] + ': ' + fw(k, n) + '.' };
  };

  G.shadeSet = function (level) {
    var it = P(SETITEMS), n = level === 1 ? R(3, 5) : R(4, 8), k = R(1, n - 1);
    return { skill: 'shadeSet', type: 'shadeSet', n: n, answer: k, item: it, data: { n: n, k: k, it: it },
      prompt: 'Tap to color ' + F(k, n) + ' of the ' + it[3] + ' ' + it[4] + '.', say: 'Tap to color ' + fw(k, n) + ' of the ' + it[3] + ' ' + it[4] + '.',
      visual: '<div id="setTarget">' + Models.set(n, 0, it[0], it[1], it[2], true) + '</div>',
      hints: ['There are ' + n + ' ' + it[3] + ' in the set.', 'The top number says how many to color.', 'Color ' + k + ' ' + it[3] + ', then press Check.'],
      explain: fw(k, n) + ' of the ' + it[3] + ' means ' + k + ' out of ' + n + '.' };
  };

  G.fairShare = function (level) {
    var groups = P(level === 1 ? [2, 3] : [2, 3, 4]), each = level === 1 ? R(2, 4) : R(2, 6), total = groups * each;
    var thing = P([['loaves', 'loaf'], ['pies', 'pie'], ['fish', 'fish']]);
    var who = groups === 2 ? 'two friends' : groups === 3 ? 'three tables' : 'four families';
    if (level > 1 && Math.random() < 0.4) {
      return { skill: 'fairShare', type: 'choice', data: { t: 'frac', groups: groups, each: each, total: total, thing: thing },
        prompt: total + ' ' + thing[0] + ' are shared equally by ' + who + '. What fraction of the ' + thing[0] + ' does each one get?',
        say: total + ' ' + thing[0] + ' are shared equally by ' + who + '. What fraction of the ' + thing[0] + ' does each one get?',
        visual: Models.plates(groups, each, thing[1] === 'fish' ? 'fish' : thing[1] === 'pie' ? 'pie' : 'loaf'),
        choices: dedupe([fc(1, groups), fc(each, groups, 'share'), fc(1, total, 'share')]), answer: '1/' + groups,
        hints: ['How many equal groups are there?', 'Each group is one of the ' + groups + ' equal groups.', 'Each gets ' + fw(1, groups) + '.'],
        explain: 'There are ' + groups + ' equal groups, so each gets ' + fw(1, groups) + '.' };
    }
    return { skill: 'fairShare', type: 'number', answer: each, data: { t: 'count', groups: groups, each: each, total: total, thing: thing },
      prompt: 'Share ' + total + ' ' + thing[0] + ' equally among ' + who + '. How many does each get?',
      say: 'Share ' + total + ' ' + thing[0] + ' equally among ' + who + '. How many does each get?',
      visual: Models.set(total, total, thing[1] === 'fish' ? 'fish' : thing[1] === 'pie' ? 'pie' : 'loaf', null, null),
      hints: ['Make ' + groups + ' equal groups.', 'Give one to each group, then another, until they are all shared.', groups + ' groups of ' + each + ' make ' + total + '.'],
      explain: groups + ' groups of ' + each + ' make ' + total + ', so each gets ' + each + '.' };
  };

  var GRAPHS = [
    { title: 'Favorite pies', items: [['Apple', '#e5533d'], ['Peach', '#f7d046'], ['Cherry', '#c2367a'], ['Pumpkin', '#e08a2e']] },
    { title: 'Fish caught today', items: [['Tuna', '#3b8fd9'], ['Snapper', '#e5533d'], ['Grouper', '#2fa35a'], ['Mackerel', '#8d4fc2']] },
    { title: 'Favorite sea animals', items: [['Turtles', '#2fa35a'], ['Dolphins', '#3b8fd9'], ['Whales', '#22335e'], ['Crabs', '#e5533d']] }
  ];
  G.circleGraph = function (level) {
    var g = P(GRAPHS), den = level === 1 ? 4 : P([4, 8]);
    var splits = den === 4 ? P([[2, 1, 1], [1, 1, 1, 1], [3, 1]]) : P([[4, 2, 1, 1], [3, 3, 2], [4, 2, 2], [5, 2, 1]]);
    if (level === 1) splits = [2, 1, 1];
    var items = U.shuffle(g.items).slice(0, splits.length);
    var slices = items.map(function (it, i) { return { label: it[0], parts: splits[i], color: it[1] }; });
    var visual = Models.circleGraph(slices, den, g.title);
    var maxS = slices.reduce(function (a, b) { return b.parts > a.parts ? b : a; });
    var tied = slices.filter(function (s) { return s.parts === maxS.parts; }).length > 1;
    var t = (tied || level > 1) ? R(1, 2) : 0;
    if (t === 0) {
      return { skill: 'circleGraph', type: 'choice', data: { t: 'max', slices: slices, den: den, max: maxS }, prompt: 'Which one has the biggest part of the circle graph?', say: 'Which one has the biggest part of the circle graph?',
        visual: visual, choices: U.shuffle(slices.map(function (s) { return txt(s.label, 'graph-read'); })), answer: maxS.label,
        hints: ['Look for the biggest slice.', 'Match the slice color to the key.', maxS.label + ' has the biggest slice.'], explain: maxS.label + ' has the biggest part of the circle.' };
    }
    var s = P(slices);
    var ch = [fc(s.parts, den), fc(den - s.parts, den, 'graph-read'), fc(den, s.parts, 'swapped')];
    if (den === 8 && s.parts % 2 === 0) ch.push(fc(s.parts / 2, 4, null)); // equivalent also right? keep only exact answer
    ch = ch.filter(function (c) { return c.value !== (s.parts / 2) + '/4'; });
    return { skill: 'circleGraph', type: 'choice', data: { t: 'frac', slices: slices, den: den, s: s }, prompt: 'What fraction of the circle is ' + s.label + '?', say: 'What fraction of the circle is ' + s.label + '?',
      visual: visual, choices: dedupe(ch), answer: s.parts + '/' + den,
      hints: ['The circle is cut into ' + den + ' equal parts.', 'Count how many parts are ' + s.label + '.', s.label + ' is ' + s.parts + ' of ' + den + ' parts.'],
      explain: s.label + ' covers ' + s.parts + ' of the ' + den + ' equal parts: ' + fw(s.parts, den) + '.' };
  };

  G.hourFraction = function (level) {
    var t = level === 1 ? R(0, 1) : R(0, 2);
    if (t === 2) {
      var half = Math.random() < 0.5;
      return { skill: 'hourFraction', type: 'number', answer: half ? 6 : 12, data: { t: 'foot', half: half },
        prompt: half ? F(1, 2) + ' foot is how many inches?' : '1 foot is how many inches?', say: half ? 'One half foot is how many inches?' : 'One foot is how many inches?',
        visual: Models.ruler(12, half ? 6 : 12),
        hints: ['A foot is 12 inches long.', half ? 'Half of 12 is...' : 'Look at the ruler: it ends at 12.', half ? '6 + 6 = 12, so half of 12 is 6.' : '1 foot = 12 inches.'],
        explain: half ? 'One half foot is 6 inches, because 6 + 6 = 12.' : 'One foot is 12 inches.' };
    }
    var q = P(level === 1 ? [1, 2, 4] : [1, 2, 3, 4]);
    var frac = q === 4 ? '1 hour' : q === 2 ? F(1, 2) + ' hour' : F(q, 4) + ' hour';
    var fsay = q === 4 ? 'one hour' : q === 2 ? 'one half hour' : fw(q, 4) + ' of an hour';
    if (t === 0) {
      return { skill: 'hourFraction', type: 'number', answer: q * 15, data: { t: 'min', q: q },
        prompt: frac + ' is how many minutes?', say: fsay + ' is how many minutes?', visual: Models.clockFraction(q),
        hints: ['One hour is 60 minutes.', 'One fourth of an hour is 15 minutes. Count by 15s.', q + ' fourths of an hour: ' + [15, 30, 45, 60].slice(0, q).join(', ') + ' minutes.'],
        explain: fsay + ' is ' + q * 15 + ' minutes.' };
    }
    var mins = q * 15;
    return { skill: 'hourFraction', type: 'choice', data: { t: 'part', q: q }, prompt: mins + ' minutes is what part of an hour?', say: mins + ' minutes is what part of an hour?',
      visual: Models.clockFraction(q),
      choices: U.shuffle([1, 2, 3, 4].map(function (x) {
        var h = x === 4 ? '1 hour' : x === 2 ? F(1, 2) + ' hour' : F(x, 4) + ' hour';
        return { html: '<span style="font-size:1.2rem">' + h + '</span>', value: String(x), err: 'clock-quarter', say: x === 4 ? 'one hour' : x === 2 ? 'one half hour' : fw(x, 4) + ' hour' };
      })), answer: String(q),
      hints: ['Each fourth of the clock is 15 minutes.', 'Count by 15s until you reach ' + mins + '.', mins + ' minutes is ' + fsay + '.'],
      explain: mins + ' minutes is ' + fsay + '.' };
  };


  /* BJU 127: the same shape can be cut into equal parts in different ways. Tap EVERY square that shows the fraction. */
  G.partitionWays = function (level) {
    var n = level === 1 ? 2 : P([2, 4]), name = NAMES[n][1];
    var good = n === 2 ? [{ cut: 'vert' }, { cut: 'horiz' }, { cut: 'diag' }] : [{ cut: 'vert' }, { cut: 'horiz' }, { cut: 'grid' }, { cut: 'diag' }];
    good = U.shuffle(good).slice(0, n === 2 ? U.rand(2, 3) : U.rand(2, 3));
    var bad = [{ unequal: true }, { other: n === 2 ? 3 : 3 }].slice(0, 5 - good.length > 1 ? 2 : 1);
    var opts = U.shuffle(good.map(function (g) { return { ok: true, g: g }; }).concat(bad.map(function (b) { return { ok: false, g: b }; })));
    var choices = opts.map(function (o, i) {
      var g = o.g, svg = g.other ? Models.shape({ kind: 'square', n: g.other, shaded: 0, size: 110 }) : g.unequal ? Models.shape({ kind: 'square', n: n, shaded: 0, unequal: true, size: 110 }) :
        Models.shape({ kind: 'square', n: n, shaded: 0, size: 110, cut: g.cut === 'vert' ? null : g.cut, grid: g.cut === 'grid' });
      return { html: svg, value: String(i), ok: o.ok, err: o.ok ? null : (g.unequal ? 'unequal-parts' : 'count-parts') };
    });
    return { skill: 'partitionWays', type: 'multi', data: { n: n }, choices: choices, answer: choices.filter(function (c) { return c.ok; }).map(function (c) { return c.value; }).join(','),
      prompt: 'Tap EVERY square that is cut into ' + name + ' (' + n + ' equal parts). Then press Check.', say: 'Tap every square that is cut into ' + name + '. Then press check.',
      visual: '', hints: [name.charAt(0).toUpperCase() + name.slice(1) + ' means ' + n + ' EQUAL parts.', 'A square can be cut different ways: up and down, side to side, or corner to corner.', 'Skip any square whose parts are different sizes, or that has a different number of parts.'],
      explain: 'Every square with ' + n + ' equal parts shows ' + name + ', no matter which way it was cut.' };
  };

  /* BJU 128: predict, do a probability experiment, record the results in a tally, then compare. */
  G.probabilityLab = function (level) {
    var colors = U.shuffle([['red', '#e5533d'], ['blue', '#3b8fd9'], ['yellow', '#f2c230'], ['green', '#2fa35a']]).slice(0, 2);
    var na = R(5, 7), nb = R(1, 3), counts = {}; counts[colors[0][1]] = na; counts[colors[1][1]] = nb;
    return { skill: 'probability', type: 'lab', data: { colors: colors, na: na, nb: nb }, counts: counts, pulls: 10,
      prompt: 'Probability experiment! The jar has ' + na + ' ' + colors[0][0] + ' and ' + nb + ' ' + colors[1][0] + ' marbles. Predict, then pull 10 times (the marble goes back in each time).',
      say: 'Probability experiment! The jar has ' + na + ' ' + colors[0][0] + ' and ' + nb + ' ' + colors[1][0] + ' marbles. First, make a prediction.',
      visual: Models.jar(counts), hints: ['More marbles of a color means that color is more likely.'], explain: 'With more ' + colors[0][0] + ' marbles, ' + colors[0][0] + ' is more likely. But chance can surprise us!', answer: null };
  };

  /* ---- spiral review from earlier BJU Math 2 chapters ---- */
  G.mulFact = function (level) {
    var f = P(level === 1 ? [0, 1, 2, 5, 10] : [2, 3, 4, 5, 10]), g = R(0, 10);
    return { skill: 'mulFact', type: 'number', answer: f * g, data: { f: f, g: g }, prompt: f + ' × ' + g + ' = ?', say: f + ' times ' + g + ' equals what?', visual: '',
      hints: ['Multiplication is equal groups.', Facts.strategy({ key: f + 'x' + g }), f + ' groups of ' + g + ' make ' + f * g + '.'], explain: f + ' × ' + g + ' = ' + f * g + '.', review: true };
  };
  /* Two-digit adding/subtracting come from fixed banks (so every spoken sentence can be pre-recorded naturally). */
  function seeded(seed) { return function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }
  var ADD = { 1: [], 2: [] }, SUB = [];
  (function () {
    var r = seeded(14), seen = {};
    function ri(a, b) { return a + Math.floor(r() * (b - a + 1)); }
    while (ADD[1].length < 30) { var a = ri(12, 49), b = ri(11, 39), k = a + '+' + b; if (!seen[k]) { seen[k] = 1; ADD[1].push([a, b]); } }
    while (ADD[2].length < 40) { var a2 = ri(15, 79), b2 = ri(11, 99 - a2); if (b2 < 11) continue; var k2 = a2 + '+' + b2; if (!seen[k2]) { seen[k2] = 1; ADD[2].push([a2, b2]); } }
    while (SUB.length < 60) { var a3 = ri(40, 99), b3 = ri(11, a3 - 10), k3 = a3 + '-' + b3; if (!seen[k3]) { seen[k3] = 1; SUB.push([a3, b3]); } }
  })();
  G.add2 = function (level) {
    var pr = P(level === 1 ? ADD[1] : ADD[1].concat(ADD[2])), a = pr[0], b = pr[1];
    return { skill: 'add2', type: 'number', answer: a + b, data: { a: a, b: b }, prompt: a + ' + ' + b + ' = ?', say: a + ' plus ' + b + ' equals what?', visual: '',
      hints: ['Add the ones first, then the tens.', 'If the ones make 10 or more, rename 10 ones as 1 ten.', a + ' + ' + b + ' = ' + (a + b) + '.'], explain: a + ' + ' + b + ' = ' + (a + b) + '.', review: true };
  };
  G.sub2 = function (level) {
    var pr = P(SUB), a = pr[0], b = pr[1];
    return { skill: 'sub2', type: 'number', answer: a - b, data: { a: a, b: b }, prompt: a + ' − ' + b + ' = ?', say: a + ' minus ' + b + ' equals what?', visual: '',
      hints: ['Subtract the ones first, then the tens.', 'If you need more ones, rename 1 ten as 10 ones.', 'Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.'], explain: a + ' − ' + b + ' = ' + (a - b) + '.', review: true };
  };
  G.clockTime = function (level) {
    var h = R(1, 12), m = P(level === 1 ? [0, 30] : [0, 5, 15, 20, 30, 45, 50]);
    function lbl(hh, mm) { return hh + ':' + String(mm).padStart(2, '0'); }
    var right = lbl(h, m);
    var wrong1 = lbl(h, (m + 15) % 60), wrong2 = lbl(m === 0 ? 12 : (m / 5) || 12, h * 5 % 60);
    return { skill: 'clockTime', type: 'choice', data: { h: h, m: m }, prompt: 'What time does the clock show?', say: 'What time does the clock show?', visual: Models.clock(h, m),
      choices: dedupe([txt(right), txt(wrong1, 'clock-quarter'), txt(wrong2, 'clock-hands')]), answer: right,
      hints: ['The short red hand shows the hour.', 'The long hand shows minutes. Count by 5s around the clock.', 'It is ' + right + '.'], explain: 'The clock shows ' + right + '.', review: true };
  };

  /* ---------------- the island ---------------- */
  var VERSE = { ref: 'Proverbs 1:7', version: 'ESV', text: 'The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction.' };

  CONTENT.islands.P14 = {
    id: 'P14', name: 'Slice Isle', sea: 'home',
    bju: 'BJU Press Math 2 (5th ed.), Chapter 14: Fractions — lessons 126–135',
    keeper: { name: 'Abuela Rosa', art: 'rosa', voice: 'abuela',
      greet: [{ t: '¡Hola, capitán! Bienvenido a Slice Isle.', lang: 'es' }, 'Hello, captain! Welcome to Slice Isle. I am Abuela Rosa, the baker.'],
      greetText: '<b>¡Hola, capitán! Bienvenido a Slice Isle.</b><br><i>Hello, captain! Welcome to Slice Isle.</i> I am Abuela Rosa, the baker. ("Abuela" means grandma.)' },
    factSets: ['add', 'sub', 'mul'],
    /* Hands-on missions: optional, off-screen, and never block progress. A parent confirms with the PIN to award the shells. */
    missions: [
      { id: 'P14-m1', icon: 'pie', title: 'Paper Pie Fractions', shells: 20,
        text: 'Trace around a plate on paper and cut out the circle. Fold it in half, then in half again. Open it up: how many equal parts? Color one part and write the fraction on it. Show a parent!' },
      { id: 'P14-m2', icon: 'ruler', title: 'Fold-a-Fraction Strips', shells: 20,
        text: 'Cut 4 strips of paper the same length. Leave one whole. Fold one into halves, one into fourths, and one into eighths. Label every part. Line them up: which piece is biggest? Which is smallest?' },
      { id: 'P14-m3', icon: 'loaf', title: 'Bake and Share', shells: 30,
        text: 'With a parent, make something to share: toast, a sandwich, a pan of brownies, or a pizza. Cut it into equal parts so everyone gets a fair share. Then give a piece to someone as a gift, just like Abuela Rosa would!' },
      { id: 'P14-m4', icon: 'apple', title: 'Fair Snack Share', shells: 20,
        text: 'Count out a snack (like 12 crackers or grapes). Share it fairly with 2, 3, or 4 people by dealing one at a time. How many does each person get? What fraction of the snack does each person get?' },
      { id: 'P14-m5', icon: 'clock', title: 'Quarter-Hour Helper', shells: 20,
        text: 'Ask a parent for a job that takes about 15 minutes (a quarter of an hour), like tidying a room or helping in the kitchen. Look at a clock when you start and when you finish. Did it take one fourth of an hour?' },
      { id: 'P14-m6', icon: 'ruler', title: 'Ruler Hunt', shells: 15,
        text: 'Use a ruler to find 3 things that are about 6 inches long (half a foot) and 3 things that are about 1 foot long (12 inches). Draw or write them on paper.' },
      { id: 'P14-m7', icon: 'chart', title: 'Family Favorite Graph', shells: 25,
        text: 'Ask 4 people in your family to pick a favorite: apples, bananas, oranges, or grapes. Draw a circle and cut it into 4 equal parts. Color one part for each answer. Which fruit got the biggest part?' }
    ],
    generators: G,
    skillNames: { equalOrNot: 'Equal parts', countParts: 'Counting parts', nameParts: 'Naming parts', wholeFraction: 'One whole', shadedFraction: 'Writing fractions',
      shadeTo: 'Showing fractions', whichShows: 'Matching fractions', partitionWays: 'Equal parts, different ways', probability: 'Probability', compareLike: 'Comparing fractions',
      compareUnit: 'Comparing unit fractions', fractionWord: 'Fraction stories', setFraction: 'Part of a set', shadeSet: 'Showing part of a set', fairShare: 'Fair shares',
      circleGraph: 'Circle graphs', hourFraction: 'Parts of an hour and a foot', mulFact: 'Multiplication facts', add2: '2-digit adding', sub2: '2-digit subtracting', clockTime: 'Telling time' },
    verse: VERSE,
    story: {
      title: 'Joseph Stores the Grain', ref: 'Genesis 41:34–36 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. Long ago, Pharaoh, the king of Egypt, had a strange dream. God showed Joseph what it meant: seven years with lots of food, then seven years with almost none.' },
        { say: 'Joseph told Pharaoh a wise plan. Listen to his words from Genesis chapter 41.', quote: '"Let Pharaoh proceed to appoint overseers over the land and take one-fifth of the produce of the land of Egypt during the seven plentiful years. And let them gather all the food of these good years that are coming and store up grain under the authority of Pharaoh for food in the cities, and let them keep it. That food shall be a reserve for the land against the seven years of famine that are to occur in the land of Egypt, so that the land may not perish through the famine."' },
        { say: 'One fifth means one out of five equal parts. For every five baskets of grain, one basket was saved.', visual: 'fifths' },
        { say: 'Because Joseph used a fraction wisely, there was food for Egypt and even for Joseph\'s own family when the hungry years came. God used math to take care of His people!' }
      ],
      question: { prompt: 'Joseph saved 1 out of every 5 baskets. What fraction is that?', choices: ['1/5', '5/1', '4/5'], answer: '1/5' }
    },
    quests: [
      { id: 'P14-1', num: 1, lesson: 126, title: 'Equal Parts', kind: 'lesson', mastered: ['Tell if a shape has equal parts', 'Name halves, thirds, fourths, sixths, and eighths', 'Know that all the parts together make one whole'], pre: ['countParts', 'nameParts', 'wholeFraction'],
        objectives: ['Identify shapes partitioned into equal parts', 'Name equal parts (halves to eighths)', 'Identify n/n as one whole'],
        slides: [
          { say: 'Welcome to my bakery! Every pie I bake must be cut fairly, so everyone gets the same amount. Today we learn about equal parts.', visual: function () { return Art.icon('pie', 160); } },
          { say: 'Equal parts are exactly the same size. This pie is cut into four equal parts.', visual: function () { return Models.shape({ kind: 'circle', n: 4, shaded: 0, size: 200 }); } },
          { say: 'Look at this one. These parts are NOT equal. Some pieces are much bigger. That would not be fair!', visual: function () { return Models.shape({ kind: 'rect', n: 3, shaded: 0, unequal: true, size: 200 }); } },
          { say: 'Equal parts have special names. Two equal parts are halves. Three are thirds. Four are fourths. Six are sixths. Eight are eighths.',
            visual: function () { return [2, 3, 4, 6, 8].map(function (n) { return '<div class="center">' + Models.shape({ kind: 'circle', n: n, shaded: 1, size: 96 }) + '<b>' + NAMES[n][1] + '</b></div>'; }).join(''); } },
          { say: 'When every equal part is together, you have one whole. Four fourths make one whole pie. We write it like this: four over four equals one.',
            visual: function () { return Models.shape({ kind: 'circle', n: 4, shaded: 4, size: 170 }) + '<span style="font-size:2.4rem">' + F(4, 4) + ' = 1</span>'; } }
        ],
        practice: ['equalOrNot', 'countParts', 'nameParts'],
        today: ['equalOrNot', 'countParts', 'nameParts', 'wholeFraction'], review: ['mulFact', 'add2'],
        explain: { q: 'How can you tell if parts are equal?', options: ['They are all the same size.', 'There are lots and lots of pieces.', 'Some of the pieces are colored in.'], answer: 0 },
        worldview: 'Cutting equal parts is fair. Math helps us treat people fairly and care for them.' },

      { id: 'P14-2', num: 2, lesson: 127, title: 'Writing Fractions', kind: 'lesson', mastered: ['Write a fraction for the shaded part of a shape', 'Color a shape to show a fraction', 'Cut a shape into equal parts in different ways', 'Know the top number (numerator) and bottom number (denominator)'], pre: ['shadedFraction', 'shadeTo', 'partitionWays'],
        objectives: ['Read and write a fraction for part of a shape', 'Color part of a shape to show a fraction', 'Partition a shape different ways', 'Know when a problem needs more than a math answer'],
        slides: [
          { say: 'A fraction names part of a whole. This pie has four equal slices, and three are filled with peaches.', visual: function () { return Models.shape({ kind: 'circle', n: 4, shaded: 3, size: 190 }); } },
          { say: 'We write it as three over four. The bottom number is the denominator. It tells how many equal parts are in the whole: four.', visual: function () { return '<span style="font-size:4rem">' + F('3', '<span style="color:#e5533d">4</span>') + '</span><div style="max-width:260px;font-size:1.1rem"><b style="color:#e5533d">4</b> = equal parts in the whole (denominator)</div>'; } },
          { say: 'The top number is the numerator. It tells how many parts we are talking about: three. So three fourths of the pie has peaches.', visual: function () { return '<span style="font-size:4rem">' + F('<span style="color:#3b8fd9">3</span>', '4') + '</span><div style="max-width:260px;font-size:1.1rem"><b style="color:#3b8fd9">3</b> = parts shaded (numerator)</div>'; } },
          { say: 'A shape can be cut into the same number of equal parts in different ways. Each of these squares shows fourths.', visual: function () { return Models.shape({ kind: 'square', n: 4, shaded: 1, size: 130 }) + Models.shape({ kind: 'square', n: 4, shaded: 1, grid: true, size: 130 }) + Models.shape({ kind: 'circle', n: 4, shaded: 1, size: 130 }); } },
          { say: 'Sometimes a problem needs more than a math answer. Math tells us how to cut the last pie fairly. But love tells us to share it with someone who is hungry.', visual: function () { return Art.icon('pie', 130) + Art.icon('loaf', 110); } }
        ],
        practice: ['shadedFraction', 'shadeTo', 'partitionWays'],
        today: ['shadedFraction', 'shadeTo', 'whichShows', 'partitionWays'], review: ['nameParts', 'equalOrNot', 'clockTime'],
        explain: { q: 'In the fraction 3/4, what does the 4 tell you?', options: ['How many equal parts in all', 'How many of the parts are shaded', 'How many pies Abuela Rosa baked'], answer: 0 },
        worldview: 'Math helps us cut things fairly, and love helps us decide to share. God made us to work and to care for others.' },

      { id: 'P14-3', num: 3, lesson: 128, title: 'Probability & Comparing', kind: 'lesson', mastered: ['Do a probability experiment: predict, pull, and keep a tally', 'Tell which color is more likely or less likely', 'Compare fractions with the same bottom number using > and <'], pre: ['probability', 'compareLike', 'compareLike'],
        objectives: ['Predict and record results of a probability activity', 'Compare fractions with common denominators using > and <'],
        slides: [
          { say: 'This jar has six red marbles and two blue ones. If you reach in without looking, which color will you probably pull? Red, because there are more red marbles. Red is more likely.', visual: function () { return Models.jar({ '#e5533d': 6, '#3b8fd9': 2 }); } },
          { say: 'Blue is less likely, because there are fewer blue marbles. And a green marble? There are none, so that is impossible!', visual: function () { return Models.jar({ '#e5533d': 6, '#3b8fd9': 2 }); } },
          { say: 'Now let\'s compare fractions. These bars are cut into eighths. One bar shows three eighths. The other shows five eighths.', visual: function () { return Models.barStack([{ n: 8, k: 3, text: F(3, 8) }, { n: 8, k: 5, text: F(5, 8), fill: '#8fd3ff' }]); } },
          { say: 'When the parts are the same size, more parts means a bigger fraction. Five eighths is greater than three eighths.', visual: function () { return '<span style="font-size:3rem">' + F(5, 8) + ' &gt; ' + F(3, 8) + '</span>'; } },
          { say: 'Remember: the open side of the sign faces the bigger number, like a hungry mouth. Three eighths is less than five eighths.', visual: function () { return '<span style="font-size:3rem">' + F(3, 8) + ' &lt; ' + F(5, 8) + '</span>'; } }
        ],
        practice: ['probabilityLab', 'probability', 'compareLike'],
        today: ['probability', 'compareLike', 'compareLike', 'probability'], review: ['shadedFraction', 'wholeFraction', 'mulFact'],
        explain: { q: 'Why is 5/8 greater than 3/8?', options: ['Same size parts, and 5 is more than 3.', 'Because 8 is a really big number.', 'Because 5/8 was written on the top.'], answer: 0 },
        worldview: 'God made a world full of order. Even chance follows patterns we can study.' },

      { id: 'P14-4', num: 4, lesson: 129, title: 'Comparing Fractions', kind: 'lesson', mastered: ['Compare fractions like 1/2 and 1/4', 'Know that more pieces means smaller pieces', 'Solve fraction story problems'], pre: ['compareUnit', 'fractionWord', 'compareUnit'],
        objectives: ['Compare fractions with 1 as the numerator', 'Represent a fraction', 'Solve fraction word problems'],
        slides: [
          { say: 'Here are two pies the same size. One is cut into halves. The other is cut into fourths. Which piece would you rather have, one half or one fourth?', visual: function () { return Models.shape({ kind: 'circle', n: 2, shaded: 1, size: 150 }) + Models.shape({ kind: 'circle', n: 4, shaded: 1, size: 150, fill: '#8fd3ff' }); } },
          { say: 'One half is bigger! When a whole is cut into more pieces, each piece gets smaller.', visual: function () { return Models.barStack([{ n: 2, k: 1, text: F(1, 2) }, { n: 4, k: 1, text: F(1, 4), fill: '#8fd3ff' }, { n: 8, k: 1, text: F(1, 8), fill: '#b9f0c9' }]); } },
          { say: 'So one half is greater than one fourth, and one fourth is greater than one eighth. The bigger the bottom number, the smaller each piece.', visual: function () { return '<span style="font-size:2.6rem">' + F(1, 2) + ' &gt; ' + F(1, 4) + ' &gt; ' + F(1, 8) + '</span>'; } }
        ],
        practice: ['compareUnit', 'fractionWord', 'compareUnit'],
        today: ['compareUnit', 'fractionWord', 'compareUnit', 'fractionWord'], review: ['compareLike', 'shadeTo', 'sub2'],
        explain: { q: 'Why is 1/3 bigger than 1/6?', options: ['Fewer pieces means bigger pieces.', 'Because 6 is a bigger number than 3.', 'Because 3 comes first when counting.'], answer: 0 },
        worldview: 'Thinking carefully keeps us from being fooled by big numbers. God gave us minds to think wisely.' },

      { id: 'P14-5', num: 5, lesson: 130, title: 'Part of a Set', kind: 'lesson', mastered: ['Write a fraction for part of a group', 'Color part of a group to show a fraction'], pre: ['setFraction', 'shadeSet', 'setFraction'],
        objectives: ['Associate part of a set with a fraction', 'Write a fraction that names part of a set', 'Color part of a set to show a fraction'],
        slides: [
          { say: 'Fractions can name part of a group, too. Here is a set of five fish. Two of them are blue.', visual: function () { return Models.set(5, 2, 'fish', '#3b8fd9', '#9fb3c2'); } },
          { say: 'The bottom number tells how many are in the whole set: five. The top number tells how many are blue: two. Two fifths of the fish are blue.', visual: function () { return '<span style="font-size:3.4rem">' + F(2, 5) + '</span>'; } },
          { say: 'What fraction of the fish are NOT blue? Three of the five, so three fifths.', visual: function () { return Models.set(5, 2, 'fish', '#3b8fd9', '#9fb3c2') + '<span style="font-size:2.4rem">' + F(3, 5) + ' gray</span>'; } }
        ],
        practice: ['setFraction', 'shadeSet', 'setFraction'],
        today: ['setFraction', 'shadeSet', 'setFraction', 'shadeSet'], review: ['compareUnit', 'probability', 'add2'],
        explain: { q: 'There are 6 shells and 1 is pink. Why is the fraction of pink shells 1/6?', options: ['6 shells in all, and 1 is pink.', 'There is 1 shell, and 6 of them are pink.', 'Because pink is a really nice color.'], answer: 0 },
        worldview: 'God knows every fish in the sea and every one of us by name.' },

      { id: 'P14-6', num: 6, lesson: 131, title: 'Fair Shares', kind: 'lesson', mastered: ['Share things fairly with 2, 3, or 4 people', 'Name each fair share as a fraction'], pre: ['fairShare', 'fairShare', 'fairShare'],
        objectives: ['Determine the fraction that names part of a set', 'Find the fair share for 2, 3, or 4 people', 'Solve fraction word problems', 'Evaluate a fair-share answer by biblical teaching about work'],
        slides: [
          { say: 'Abuela Rosa baked twelve loaves for three tables. To share fairly, give one loaf to each table, then another, and another, until all twelve are shared.', visual: function () { return Models.set(12, 12, 'loaf'); } },
          { say: 'Each table gets four loaves. Three groups of four make twelve.', visual: function () { return Models.plates(3, 4, 'loaf'); } },
          { say: 'Each table got one of three equal groups, so each table got one third of the loaves.', visual: function () { return '<span style="font-size:3.4rem">' + F(1, 3) + '</span>'; } },
          { say: 'The Bible teaches that God made us to work, and that workers should share in what they make. A fair share honors the people who worked hard.', visual: function () { return Art.keeperRosa(140); } }
        ],
        practice: ['fairShare', 'fairShare', 'setFraction'],
        today: ['fairShare', 'fairShare', 'fairShare', 'setFraction'], review: ['shadedFraction', 'compareLike', 'mulFact'],
        explain: { q: '12 loaves are shared by 4 tables. How do you know each table gets 3?', options: ['4 groups of 3 make 12.', '12 take away 4 leaves 8 loaves.', 'Because 3 is a really small number.'], answer: 0 },
        worldview: 'God made us to work and to share. Fair shares help everyone get what they need.' },

      { id: 'P14-7', num: 7, lesson: 132, title: 'Circle Graphs', kind: 'lesson', mastered: ['Read a circle graph', 'Find the biggest part of a circle graph', 'Name the fraction for a part of a circle graph'], pre: ['circleGraph', 'circleGraph', 'circleGraph'],
        objectives: ['Read a circle graph', 'Interpret a circle graph'],
        slides: [
          { say: 'A circle graph shows a whole group cut into parts. Abuela Rosa asked her customers about their favorite pie.', visual: function () { return Models.circleGraph([{ label: 'Apple', parts: 2, color: '#e5533d' }, { label: 'Peach', parts: 1, color: '#ffb347' }, { label: 'Cherry', parts: 1, color: '#c2367a' }], 4, 'Favorite pies'); } },
          { say: 'The biggest part is red. The key says red means apple. So apple is the favorite! Half of the customers chose apple.', visual: function () { return Models.circleGraph([{ label: 'Apple', parts: 2, color: '#e5533d' }, { label: 'Peach', parts: 1, color: '#ffb347' }, { label: 'Cherry', parts: 1, color: '#c2367a' }], 4, 'Favorite pies'); } },
          { say: 'Peach and cherry are each one fourth of the circle. They are the same size, so the same number of people chose each one.', visual: function () { return Models.shape({ kind: 'circle', n: 4, shaded: [2], size: 150 }) + '<span style="font-size:2.4rem">' + F(1, 4) + ' peach</span>'; } }
        ],
        practice: ['circleGraph', 'circleGraph', 'circleGraph'],
        today: ['circleGraph', 'circleGraph', 'circleGraph', 'circleGraph'], review: ['fairShare', 'setFraction', 'clockTime'],
        explain: { q: 'In a circle graph, how can you tell which choice is the most popular?', options: ['It has the biggest part.', 'It is the one listed first in the key.', 'It has the brightest color of them all.'], answer: 0 },
        worldview: 'Graphs help us listen to people and serve them better, like a baker learning what pies to bake.' },

      { id: 'P14-8', num: 8, lesson: 133, title: 'Halves & Fourths', kind: 'lesson', mastered: ['Know 1/4 hour = 15 minutes, 1/2 hour = 30, 3/4 hour = 45', 'Know 1 foot = 12 inches and 1/2 foot = 6 inches'], pre: ['hourFraction', 'hourFraction', 'hourFraction'],
        objectives: ['Relate 1/4, 1/2, 3/4 hour to 15, 30, 45 minutes', 'Relate 1/2 foot to 6 inches and 1 foot to 12 inches'],
        slides: [
          { say: 'Fractions help us tell time. One whole hour is sixty minutes, all the way around the clock.', visual: function () { return Models.clockFraction(4); } },
          { say: 'One fourth of the clock is fifteen minutes. That is a quarter hour.', visual: function () { return Models.clockFraction(1) + '<span style="font-size:2.2rem">' + F(1, 4) + ' hour = 15 min</span>'; } },
          { say: 'Half of the clock is thirty minutes: a half hour. Three fourths is forty-five minutes.', visual: function () { return Models.clockFraction(2) + Models.clockFraction(3); } },
          { say: 'A foot is twelve inches long. Half a foot is six inches, because six plus six is twelve.', visual: function () { return Models.ruler(12, 6); } }
        ],
        practice: ['hourFraction', 'hourFraction', 'hourFraction'],
        today: ['hourFraction', 'hourFraction', 'hourFraction', 'hourFraction'], review: ['circleGraph', 'compareUnit', 'fairShare'],
        explain: { q: 'Why is 1/2 hour the same as 30 minutes?', options: ['Half of 60 minutes is 30.', 'There are 30 numbers on every clock.', 'Because 1/2 is a really small fraction.'], answer: 0 },
        worldview: 'God created time and gave us each day as a gift to use well.' },

      { id: 'P14-9', num: 9, lesson: 134, title: 'Harbor Review', kind: 'review', mastered: ['Remember everything from Slice Isle', 'Build the memory verse, Proverbs 1:7'],
        objectives: ['Recall concepts and terms from Chapter 14'],
        mix: ['equalOrNot', 'nameParts', 'shadedFraction', 'shadeTo', 'compareLike', 'compareUnit', 'setFraction', 'fairShare', 'circleGraph', 'hourFraction', 'probability', 'fractionWord'],
        worldview: 'Reviewing helps what we learn last. Wise people keep learning!' },

      { id: 'P14-10', num: 10, lesson: 135, title: 'Lighthouse Challenge', kind: 'boss', mastered: ['Show what you know about fractions', 'Relight the Slice Isle lighthouse!'],
        objectives: ['Demonstrate knowledge of Chapter 14 (chapter test)'],
        mix: ['equalOrNot', 'countParts', 'nameParts', 'wholeFraction', 'shadedFraction', 'shadeTo', 'whichShows', 'partitionWays', 'compareLike', 'compareUnit', 'setFraction', 'fairShare', 'circleGraph', 'hourFraction', 'probability', 'fractionWord'],
        worldview: 'The light shines again! Just as the lighthouse guides ships, God\'s Word lights our path.' }
    ]
  };
})();
