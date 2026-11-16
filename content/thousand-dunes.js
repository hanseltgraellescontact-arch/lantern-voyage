/* Thousand Dunes — Prelude unit P17: Exploring 4-Digit Numbers.
   Matches BJU Press Math 2, 5th edition, Chapter 17, lessons 156–164 (Lesson Plan Overview).
   Keeper: Don Omar, the caravan leader. Lesson 156 is split into two quests (counting by hundreds; thousands,
   hundreds, tens and ones), so the island has ten stops like the others. */
(function () {
  var R = U.rand, P = U.pick;
  function C(n) { return Number(n).toLocaleString('en-US'); }
  function txt(t, err, say) { return { html: '<span style="font-size:1.25rem">' + t + '</span>', value: t, err: err, say: say || t }; }
  function walk(prob, tip, tip2) {
    var s = [{ say: tip, show: prob.visual || '' }];
    if (tip2) s.push({ say: tip2, show: prob.visual || '' });
    s.push({ say: 'Now you try it.', show: prob.visual || '', ask: prob.type === 'number' ? { type: 'number', answer: prob.answer } : { type: 'choice', options: prob.choices, answer: prob.answer }, final: true });
    return s;
  }
  function done(prob, tip, tip2) { prob.walk = walk(prob, tip, tip2); return prob; }
  function digits(n) { var s = String(n).padStart(4, '0'); return [+s[0], +s[1], +s[2], +s[3]]; }
  var PLACES = ['thousands', 'hundreds', 'tens', 'ones'], VAL = [1000, 100, 10, 1];

  var G = {};
  /* 156 — counting by hundreds; ten hundreds make one thousand */
  G.countBy100 = function (level) {
    var start = level === 3 ? R(5, 7) * 100 : R(1, level === 1 ? 4 : 6) * 100, seq = [start, start + 100, start + 200], ans = start + 300;
    return done({ skill: 'countBy100', type: 'number', answer: ans, data: { start: start }, prompt: 'Count by hundreds: ' + seq.map(C).join(', ') + ', ___', say: 'Count by hundreds. ' + seq.map(C).join(', ') + '. What comes next?',
      visual: Models.pvBlocks(0, Math.min(ans / 100, 10) | 0, 0, 0, 520), hints: ['Each number is 100 more.', 'Add 1 more hundred: ' + C(seq[2]) + ' + 100.', 'It is ' + C(ans) + '.'], explain: C(seq[2]) + ' + 100 = ' + C(ans) + '.' + (ans === 1000 ? ' Ten hundreds make one thousand!' : '') },
      'When we count by hundreds, each number is one hundred more.', 'Say them with me: ' + seq.map(C).join(', ') + '. One more hundred is next.');
  };
  G.tenHundreds = function (level) {
    var kind = level === 1 ? P(['how', 'equals']) : P(['how', 'equals', 'rename', 'rename']);
    if (kind === 'rename') {
      var h = R(11, 19), v = Models.pvBlocks(0, h, 0, 0, 560);
      return done({ skill: 'tenHundreds', type: 'number', answer: h - 10, data: { h: h }, prompt: h + ' hundreds = 1 thousand and ___ hundreds', say: h + ' hundreds equals one thousand and how many hundreds?', visual: v,
        hints: ['Ten hundreds make one thousand.', 'Take 10 hundreds away to make the thousand: ' + h + ' − 10.', h + ' − 10 = ' + (h - 10) + '.'], explain: 'Ten of the ' + h + ' hundreds make 1 thousand. ' + (h - 10) + ' hundreds are left: ' + C(h * 100) + '.' },
        'Ten hundreds can be traded for one thousand.', 'Take away ten hundreds from ' + h + '. How many hundreds are left?');
    }
    var p = kind === 'how' ? 'How many hundreds make 1 thousand?' : '1 thousand = ___ hundreds';
    return done({ skill: 'tenHundreds', type: 'number', answer: 10, data: { kind: kind }, prompt: p, say: kind === 'how' ? 'How many hundreds make one thousand?' : 'One thousand equals how many hundreds?', visual: Models.pvBlocks(0, 10, 0, 0, 560) + '<span class="g1op">=</span>' + Models.pvBlocks(1, 0, 0, 0, 90),
      hints: ['Count the hundred flats by hundreds: 100, 200, 300…', 'Count all the way to 1,000.', 'Ten hundreds make one thousand.'], explain: 'Ten hundreds make one thousand: 10 × 100 = 1,000.' },
      'Count the hundred flats by hundreds until you reach one thousand.', 'One hundred, two hundred, three hundred… all the way to one thousand.');
  };
  G.pvRead = function (level) {
    var th = R(1, level === 1 ? 2 : 4), h = R(level === 3 ? 0 : 1, level === 1 ? 4 : 7), t = R(level === 3 ? 0 : 1, level === 1 ? 4 : 8), o = R(level === 3 ? 0 : 1, 9), n = th * 1000 + h * 100 + t * 10 + o;
    var v = Models.pvBlocks(th, h, t, o, 560);
    return done({ skill: 'pvRead', type: 'number', answer: n, data: { n: n }, prompt: 'What number do the blocks show? (cubes are thousands, flats are hundreds, rods are tens, small squares are ones)', say: 'What number do the blocks show?', visual: v,
      hints: ['Count each kind: cubes, flats, rods, little squares.', th + ' thousands, ' + h + ' hundreds, ' + t + ' tens, ' + o + ' ones.', 'The number is ' + C(n) + '.'], explain: th + ' thousands, ' + h + ' hundreds, ' + t + ' tens and ' + o + ' ones make ' + C(n) + '.' },
      'A big cube is one thousand. A flat is one hundred. A rod is ten. A little square is one.', 'Count each kind. ' + th + ' thousands, ' + h + ' hundreds, ' + t + ' tens, and ' + o + ' ones.');
  };
  G.pvCount = function (level) {
    var n = R(1001, 9999), d = digits(n), i = R(0, 3);
    return done({ skill: 'pvCount', type: 'number', answer: d[i], data: { n: n, i: i }, prompt: 'How many ' + PLACES[i].toUpperCase() + ' are in ' + C(n) + '?', say: 'How many ' + PLACES[i] + ' are in ' + C(n) + '?', visual: Models.pvChart(n, level === 1 ? i : undefined),
      hints: ['Put the number in a place-value chart.', 'From the right: ones, tens, hundreds, thousands.', 'The ' + PLACES[i] + ' digit is ' + d[i] + '.'], explain: 'In ' + C(n) + ', the ' + PLACES[i] + ' digit is ' + d[i] + '.' },
      'Read the places from right to left: ones, tens, hundreds, thousands.', 'Find the ' + PLACES[i] + ' place. What digit is there?');
  };
  /* 157 — value of a digit; standard and expanded form */
  G.digitValue = function (level) {
    var d; do { d = [R(1, 9), R(1, 9), R(1, 9), R(1, 9)]; } while (U.uniq(d).length < 4);
    var n = +d.join(''), i = R(0, 3), x = d[i], ans = x * VAL[i];
    var opts = U.uniq([ans].concat(U.shuffle([x, x * 10, x * 100, x * 1000].filter(function (v) { return v !== ans; })).slice(0, level === 1 ? 1 : 2)));
    return done({ skill: 'digitValue', type: 'choice', data: { n: n, i: i }, prompt: 'What is the VALUE of the ' + x + ' in ' + C(n) + '?', say: 'What is the value of the ' + x + ' in ' + C(n) + '?', visual: Models.pvChart(n, level === 1 ? i : undefined),
      choices: U.shuffle(opts).map(function (v) { return txt(C(v), v === ans ? null : 'place-value'); }), answer: C(ans),
      hints: ['Find which place the ' + x + ' is in.', 'It is in the ' + PLACES[i] + ' place.', x + ' ' + PLACES[i] + ' = ' + C(ans) + '.'], explain: 'The ' + x + ' is in the ' + PLACES[i] + ' place, so it means ' + C(ans) + '.',
      why: ['The ' + x + ' is in the ' + PLACES[i] + ' place.', 'A digit is always worth itself.', 'The biggest choice is always right.'] },
      'A digit\'s value depends on its place.', 'The ' + x + ' is in the ' + PLACES[i] + ' place.');
  };
  function expStr(n) { var d = digits(n); return d.map(function (x, i) { return x * VAL[i]; }).filter(Boolean).map(C).join(' + '); }
  G.expanded = function (level) {
    var d = [R(1, 9), R(level === 3 ? 0 : 1, 9), R(1, 9), R(level === 3 ? 0 : 1, 9)], n = +d.join('');
    if (level >= 2 && Math.random() < 0.5) {
      return done({ skill: 'expanded', type: 'number', answer: n, data: { n: n, dir: 'std' }, prompt: 'Write the STANDARD form: ' + expStr(n) + ' = ___', say: 'Write the standard form. ' + expStr(n) + ' equals what?', visual: Models.pvChart(n).replace(/<td( class="hi")?>\d<\/td>/g, '<td>?</td>'),
        hints: ['Put each part in its place.', 'Thousands, hundreds, tens, ones: ' + d.join(', ') + '.', 'It is ' + C(n) + '.'], explain: expStr(n) + ' = ' + C(n) + '.' },
        'Standard form is the number written the usual way.', 'Put each digit in its place: ' + d.join(', ') + '.');
    }
    var right = expStr(n), sw = +[d[0], d[2], d[1], d[3]].join(''), wrong1 = expStr(sw === n ? n + 10 : sw), wrong2 = d.map(function (x, i) { return x * VAL[Math.min(3, i + 1)]; }).filter(Boolean).map(C).join(' + ');
    var opts = U.uniq([right, wrong1, wrong2]);
    return done({ skill: 'expanded', type: 'choice', data: { n: n, dir: 'exp' }, prompt: 'Which is the EXPANDED form of ' + C(n) + '?', say: 'Which is the expanded form of ' + C(n) + '?', visual: Models.pvChart(n),
      choices: U.shuffle(opts).map(function (o) { return txt(o, o === right ? null : 'expanded-form'); }), answer: right,
      hints: ['Expanded form shows what each digit is worth.', 'Write each digit with its place value, then add.', right + '.'], explain: C(n) + ' = ' + right + '.',
      why: ['Each part shows a digit\'s place value.', 'Every part is the same number.', 'The longest choice is expanded form.'] },
      'Expanded form shows the value of every digit, added together.', 'The ' + d[0] + ' is ' + C(d[0] * 1000) + '. The ' + d[1] + ' is ' + C(d[1] * 100) + '.');
  };
  /* 158–160 — adding 4-digit numbers */
  function addPair(rule) {
    var a, b, t = 0;
    do {
      a = R(1000, 7999); b = R(1000, 9999 - a);
      var A = digits(a), B = digits(b), c = [A[3] + B[3] >= 10, A[2] + B[2] + (A[3] + B[3] >= 10 ? 1 : 0) >= 10];
      var hc = A[1] + B[1] + (c[1] ? 1 : 0) >= 10, ok;
      if (rule === 'none') ok = !c[0] && !c[1] && !hc;
      else if (rule === 'onesTens') ok = (c[0] || c[1]) && !hc;
      else ok = hc && a + b <= 9999;
    } while (!ok && ++t < 400);
    return [a, b];
  }
  function addProb(skill, rule, tip2) {
    return function (level) {
      var p = addPair(rule), a = p[0], b = p[1], s = a + b, v = Models.vertical4(a, b, '+');
      return done({ skill: skill, type: 'number', answer: s, data: { a: a, b: b }, prompt: 'Add: ' + C(a) + ' + ' + C(b) + ' = ?', say: 'Add. ' + C(a) + ' plus ' + C(b) + '.', visual: v,
        hints: ['Start with the ones. Then tens, hundreds, and thousands.', tip2, C(a) + ' + ' + C(b) + ' = ' + C(s) + '.'], explain: C(a) + ' + ' + C(b) + ' = ' + C(s) + '.' },
        'Line up the places. Always start adding with the ones.', tip2);
    };
  }
  G.add4 = addProb('add4', 'none', 'No place adds up to 10 or more, so there is no renaming.');
  G.add4R = addProb('add4R', 'onesTens', 'If the ones or tens make 10 or more, rename 10 of them as 1 of the next place.');
  G.add4RH = addProb('add4RH', 'hundreds', 'If the hundreds make 10 or more, rename 10 hundreds as 1 thousand.');
  var ADD_STORIES = [
    function (a, b) { return 'The caravan carried ' + C(a) + ' dates on Monday and ' + C(b) + ' dates on Tuesday to share with hungry families. How many dates in all?'; },
    function (a, b) { return 'Don Omar\'s camels walked ' + C(a) + ' steps in the morning and ' + C(b) + ' steps in the afternoon. How many steps in all?'; },
    function (a, b) { return 'A church collected ' + C(a) + ' cans of food in March and ' + C(b) + ' cans in April for the food bank. How many cans in all?'; },
    function (a, b) { return 'The well gave ' + C(a) + ' cups of water for the travelers and ' + C(b) + ' cups for the camels. How many cups in all?'; }
  ];
  G.word4 = function (level) {
    var p = addPair(level === 1 ? 'none' : P(['onesTens', 'hundreds'])), a = p[0], b = p[1], s = a + b, text = P(ADD_STORIES)(a, b);
    return done({ skill: 'word4', type: 'number', answer: s, data: { a: a, b: b }, prompt: text, say: text, visual: level === 3 ? '' : Models.vertical4(a, b, '+'),
      hints: ['"In all" means put the groups together: add.', C(a) + ' + ' + C(b) + ' = ?', 'The answer is ' + C(s) + '.'], explain: C(a) + ' + ' + C(b) + ' = ' + C(s) + '.' },
      '"How many in all" means add the two amounts.', 'Write ' + C(a) + ' plus ' + C(b) + ' up and down, and start with the ones.');
  };
  /* 161–162 — subtracting 4-digit numbers */
  function subPair(rule) {
    var a, b, t = 0, ok;
    do {
      a = R(2000, 9999); b = R(1000, a - 1);
      var A = digits(a), B = digits(b);
      if (rule === 'none') ok = A[0] >= B[0] && A[1] >= B[1] && A[2] >= B[2] && A[3] >= B[3] && a > b;
      else ok = A[1] < B[1] && A[2] >= B[2] && A[3] >= B[3] && A[0] > B[0];
    } while (!ok && ++t < 400);
    return [a, b];
  }
  function subProb(skill, rule, tip2) {
    return function (level) {
      var p = subPair(rule), a = p[0], b = p[1], d = a - b, v = Models.vertical4(a, b, '−');
      return done({ skill: skill, type: 'number', answer: d, data: { a: a, b: b }, prompt: 'Subtract: ' + C(a) + ' − ' + C(b) + ' = ?', say: 'Subtract. ' + C(a) + ' minus ' + C(b) + '.', visual: v,
        hints: ['Start with the ones. Then tens, hundreds, and thousands.', tip2, C(a) + ' − ' + C(b) + ' = ' + C(d) + '.'], explain: C(a) + ' − ' + C(b) + ' = ' + C(d) + '. Check: ' + C(d) + ' + ' + C(b) + ' = ' + C(a) + '.' },
        'Line up the places. Start subtracting with the ones.', tip2);
    };
  }
  G.sub4 = subProb('sub4', 'none', 'Every top digit is big enough, so there is no renaming.');
  G.sub4R = subProb('sub4R', 'thousand', 'There are not enough hundreds, so rename 1 thousand as 10 hundreds.');
  var CMP = [
    function (a, b) { return 'The big dune is ' + C(a) + ' steps around. The small dune is ' + C(b) + ' steps around. How many MORE steps is the big dune?'; },
    function (a, b) { return 'Don Omar has ' + C(a) + ' dates. Sara has ' + C(b) + ' dates. How many MORE dates does Don Omar have?'; },
    function (a, b) { return 'The town needs ' + C(a) + ' bricks to build a school. It has ' + C(b) + ' bricks. How many more bricks does it need?'; }
  ];
  G.subCompare = function (level) {
    var p = subPair('none'), a = p[0], b = p[1], d = a - b, text = P(CMP)(a, b);
    return done({ skill: 'subCompare', type: 'number', answer: d, data: { a: a, b: b }, prompt: text, say: text, visual: level === 3 ? '' : Models.vertical4(a, b, '−'),
      hints: ['"How many more" means compare: subtract the smaller from the bigger.', C(a) + ' − ' + C(b) + ' = ?', 'The answer is ' + C(d) + '.'], explain: C(a) + ' − ' + C(b) + ' = ' + C(d) + '.' },
      '"How many more" compares two amounts. Subtract the smaller number from the bigger number.', 'Write ' + C(a) + ' minus ' + C(b) + ' up and down.');
  };

  /* spiral review from Weather Rock, Kite Cove and Slice Isle */
  var S16 = CONTENT.islands.P16.generators;
  ['perimeterCm', 'measureCm', 'thermoRead', 'coordRead', 'massUnit', 'perimeter', 'planeName', 'solidName', 'mulFact', 'add2', 'sub2', 'clockTime', 'shadedFraction'].forEach(function (k) { G[k] = S16[k]; });

  /* "Show me how" guides (videos only from the family's approved channels) */
  var PV = { label: 'I Can Show Numbers in Different Ways (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=twqFHfIjPP4' };
  Help.extend({
    pv100: { title: 'Counting by hundreds', steps: [
      ['Each flat is one hundred. Count them by hundreds: 100, 200, 300…', function () { return Models.pvBlocks(0, 5, 0, 0, 300); }],
      ['Ten hundreds make one thousand: the big cube!', function () { return Models.pvBlocks(0, 10, 0, 0, 380) + '<span class="g1op">=</span>' + Models.pvBlocks(1, 0, 0, 0, 70); }]] },
    pv4: { title: 'Thousands, hundreds, tens, ones', video: PV, steps: [
      ['Cube = 1,000. Flat = 100. Rod = 10. Little square = 1.', function () { return Models.pvBlocks(1, 1, 1, 1, 220); }],
      ['Count each kind and write the digits in order: 2 thousands, 3 hundreds, 1 ten, 4 ones = 2,314.', function () { return Models.pvBlocks(2, 3, 1, 4, 360) + Models.pvChart(2314); }]] },
    pvForms: { title: 'Standard and expanded form', video: PV, steps: [
      ['Standard form is the usual way: 5,826.', function () { return Models.pvChart(5826); }],
      ['Expanded form shows each digit\'s value: 5,000 + 800 + 20 + 6.', function () { return '<span class="g1num">5,000 + 800 + 20 + 6</span>'; }]] },
    add4: { title: 'Adding 4-digit numbers', steps: [
      ['Line up the places. Add the ones first, then tens, hundreds, thousands.', function () { return Models.vertical4(2345, 1432, '+', 3777); }],
      ['If a place makes 10 or more, rename 10 of them as 1 in the next place to the left.', function () { return Models.vertical4(2587, 1645, '+', 4232); }]] },
    sub4: { title: 'Subtracting 4-digit numbers', steps: [
      ['Line up the places. Subtract the ones first, then tens, hundreds, thousands.', function () { return Models.vertical4(5876, 2341, '−', 3535); }],
      ['Not enough hundreds? Rename 1 thousand as 10 hundreds, then subtract.', function () { return Models.vertical4(5326, 2714, '−', 2612); }],
      ['Check by adding: the answer plus the number you took away equals the top number.', function () { return '<span class="g1num">2,612 + 2,714 = 5,326</span>'; }]] }
  }, { countBy100: 'pv100', tenHundreds: 'pv100', pvRead: 'pv4', pvCount: 'pv4', digitValue: 'pvForms', expanded: 'pvForms', add4: 'add4', add4R: 'add4', add4RH: 'add4', word4: 'add4', sub4: 'sub4', sub4R: 'sub4', subCompare: 'sub4' });

  CONTENT.islands.P17 = {
    id: 'P17', name: 'Thousand Dunes', sea: 'home',
    bju: 'BJU Press Math 2 (5th ed.), Chapter 17: Exploring 4-Digit Numbers — lessons 156–164',
    keeper: { name: 'Don Omar', art: 'omar', voice: 'keeperM',
      greet: [{ t: '¡Hola, capitán!', lang: 'es' }, { t: '¡Mil gracias por venir!', lang: 'es' }, 'Hello, captain! A thousand thanks for coming! I am Don Omar. My caravan carries food and water across a thousand sand dunes. Big numbers help me take care of everyone!'],
      greetText: '<b>¡Hola, capitán! ¡Mil gracias por venir!</b><br><i>Hello, captain! A thousand thanks for coming!</i> ("mil" means one thousand!) I am Don Omar. My caravan carries food and water across a thousand sand dunes. Big numbers help me take care of everyone!' },
    factSets: ['add', 'sub', 'mul'],
    missions: [
      { id: 'P17-m1', icon: 'star', title: 'Count to 1,000', shells: 20, text: 'With a parent, count by hundreds from 100 to 1,000 while doing 10 jumping jacks for each hundred. How many jumping jacks did you do?' },
      { id: 'P17-m2', icon: 'book', title: 'Thousand Hunt', shells: 20, text: 'Find a 4-digit number at home: a page in a big book, a price, a year on a coin. Write it in a place-value chart and say what each digit is worth.' },
      { id: 'P17-m3', icon: 'crate', title: 'Paper Blocks', shells: 25, text: 'Cut paper into hundred squares, ten strips, and one squares (draw a big box for a thousand). Build 1,234, then build your own number for a parent to read.' },
      { id: 'P17-m4', icon: 'heart', title: 'Food Drive', shells: 25, text: 'With your family, gather food to give to someone in need. Count the items, and figure out how many more you would need to reach 100 or 1,000.' },
      { id: 'P17-m5', icon: 'chart', title: 'Expanded Form Cards', shells: 15, text: 'Write 4 numbers on cards. On the back, write them in expanded form, like 3,000 + 400 + 20 + 5. Quiz someone in your family!' }
    ],
    generators: G,
    skillNames: { countBy100: 'Counting by hundreds', tenHundreds: 'Ten hundreds = one thousand', pvRead: 'Reading place-value blocks', pvCount: 'Thousands, hundreds, tens, ones', digitValue: 'Value of a digit',
      expanded: 'Standard and expanded form', add4: 'Adding 4-digit numbers', add4R: 'Adding with renaming ones or tens', add4RH: 'Adding with renaming hundreds', word4: '4-digit word problems',
      sub4: 'Subtracting 4-digit numbers', sub4R: 'Subtracting with renaming a thousand', subCompare: 'Comparison word problems', perimeterCm: 'Perimeter (metric)', measureCm: 'Measuring in centimeters',
      thermoRead: 'Reading a thermometer', coordRead: 'Coordinate graphs', massUnit: 'Grams or kilograms', perimeter: 'Perimeter', planeName: 'Naming plane figures', solidName: 'Naming solid figures',
      mulFact: 'Multiplication facts', add2: '2-digit adding', sub2: '2-digit subtracting', clockTime: 'Telling time', shadedFraction: 'Writing fractions' },
    verse: { ref: 'Psalm 139:17–18', version: 'ESV', text: 'How precious to me are your thoughts, O God! How vast is the sum of them! If I would count them, they are more than the sand. I awake, and I am still with you.' },
    story: {
      title: 'Count the Stars', ref: 'Genesis 15:5 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. Abram was old, and he had no children. But God had made him a big promise.' },
        { say: 'One night God took Abram outside under the desert sky, full of stars.', quote: '"Look toward heaven, and number the stars, if you are able to number them." Then he said to him, "So shall your offspring be."' },
        { say: 'There were more stars than Abram could ever count, thousands and thousands! God kept His promise. Abram\'s family grew bigger than he could count. God always keeps His promises.' }
      ],
      question: { prompt: 'What did God tell Abram to count?', choices: ['The stars', 'The camels', 'The sand dunes'], answer: 'The stars', right: 'Yes! The stars, more than anyone could count. God always keeps His promises!', after: 'Now let\'s go help Don Omar count!', wrong: 'Listen again: "Look toward heaven, and number the stars."' }
    },
    quests: [
      { id: 'P17-1', num: 1, lesson: 156, title: 'Counting by Hundreds', kind: 'lesson', mastered: ['Count by hundreds to 1,000', 'Know that 10 hundreds make 1 thousand'], pre: ['countBy100', 'tenHundreds', 'countBy100'],
        objectives: ['Count by 100s', 'Relate 10 hundreds to 1 thousand'],
        slides: [
          { say: 'Welcome to Thousand Dunes! My caravan carries crates of dates. Each crate holds one hundred dates.', visual: function () { return Art.keeper('omar', 120) + Models.pvBlocks(0, 1, 0, 0, 90); } },
          { say: 'Let\'s count the crates by hundreds: one hundred, two hundred, three hundred, four hundred, five hundred.', visual: function () { return Models.pvBlocks(0, 5, 0, 0, 380) + '<span class="g1num">500</span>'; } },
          { say: 'Keep going: six hundred, seven hundred, eight hundred, nine hundred… one thousand!', visual: function () { return Models.pvBlocks(0, 10, 0, 0, 520) + '<span class="g1num">1,000</span>'; } },
          { say: 'Ten hundreds make one thousand. We can trade the ten flats for one big thousand cube.', visual: function () { return Models.pvBlocks(0, 10, 0, 0, 380) + '<span class="g1op">=</span>' + Models.pvBlocks(1, 0, 0, 0, 90); } },
          { say: 'We write one thousand with a comma: one, comma, zero, zero, zero. The comma helps us read big numbers.', visual: function () { return '<span class="g1num" style="font-size:4rem">1,000</span>'; } }
        ],
        practice: ['countBy100', 'tenHundreds', 'countBy100'],
        today: ['countBy100', 'tenHundreds', 'countBy100', 'tenHundreds'], review: ['perimeterCm', 'mulFact'],
        explain: { q: 'How many hundreds make one thousand?', options: ['Ten hundreds make one thousand.', 'One hundred hundreds make it.', 'Five hundreds make one thousand.'], answer: 0 },
        worldview: 'God counts every star and every grain of sand. Nothing is too big for Him to know.' },
      { id: 'P17-2', num: 2, lesson: 156, title: 'Thousands, Hundreds, Tens & Ones', kind: 'lesson', mastered: ['Read a 4-digit number from blocks', 'Tell how many thousands, hundreds, tens, and ones'], pre: ['pvRead', 'pvCount', 'pvRead'],
        objectives: ['Identify the number of thousands, hundreds, tens, and ones in a 4-digit number'],
        slides: [
          { say: 'Here are my place-value blocks. A big cube is one thousand. A flat is one hundred. A rod is ten. A little square is one.', visual: function () { return Models.pvBlocks(1, 1, 1, 1, 260); } },
          { say: 'This is two thousands, three hundreds, one ten, and four ones.', visual: function () { return Models.pvBlocks(2, 3, 1, 4, 420); } },
          { say: 'In a place-value chart, it looks like this: two, three, one, four. We read it: two thousand, three hundred fourteen.', visual: function () { return Models.pvChart(2314) + '<span class="g1num">2,314</span>'; } },
          { say: 'If a place has nothing, we write a zero to hold the place. Three thousands and five ones is three thousand five: 3,005.', visual: function () { return Models.pvBlocks(3, 0, 0, 5, 260) + Models.pvChart(3005); } }
        ],
        practice: ['pvRead', 'pvCount', 'pvRead'],
        today: ['pvRead', 'pvCount', 'pvRead', 'pvCount'], review: ['countBy100', 'thermoRead', 'add2'],
        explain: { q: 'Why do we write a zero in 3,005?', options: ['The zeros hold the empty places.', 'Zeros make the number bigger.', 'Every number has two zeros.'], answer: 0 },
        worldview: 'Every place matters, even the zeros. In God\'s family, every person has a place.' },
      { id: 'P17-3', num: 3, lesson: 157, title: 'Standard & Expanded Form', kind: 'lesson', mastered: ['Tell the value of a digit', 'Write standard and expanded form'], pre: ['digitValue', 'expanded', 'digitValue'],
        objectives: ['Identify the value of a digit in a 4-digit number', 'Write a 4-digit number in standard and expanded form', 'Explain how place value helps people care for others (BWS)'],
        slides: [
          { say: 'The same digit can mean different amounts. In 5,555, each five is worth something different!', visual: function () { return Models.pvChart(5555); } },
          { say: 'This five is five thousand. This one is five hundred. Then fifty. Then five.', visual: function () { return '<span class="g1num">5,000 · 500 · 50 · 5</span>'; } },
          { say: 'Standard form is the usual way to write a number: 5,826. Expanded form shows what every digit is worth: 5,000 plus 800 plus 20 plus 6.', visual: function () { return Models.pvChart(5826) + '<span class="g1num">5,000 + 800 + 20 + 6</span>'; } },
          { say: 'Place value helps us care for people. If a food bank needs 1,200 cans, not 120, getting the places right means more families can eat!', visual: function () { return '<span class="g1num">1,200 ≠ 120</span>'; } }
        ],
        practice: ['digitValue', 'expanded', 'digitValue'],
        today: ['digitValue', 'expanded', 'digitValue', 'expanded'], review: ['pvRead', 'coordRead', 'sub2'],
        explain: { q: 'How can place value help us care for others?', options: ['Right numbers mean the right help.', 'Place value is only for tests.', 'Big numbers never matter to anyone.'], answer: 0 },
        worldview: 'Getting numbers right is one way to love our neighbors well.' },
      { id: 'P17-4', num: 4, lesson: 158, title: 'Adding 4-Digit Numbers', kind: 'lesson', mastered: ['Add 4-digit numbers without renaming'], pre: ['add4', 'add4', 'expanded'],
        objectives: ['Add 4-digit numbers by joining sets', 'Solve a 4-digit addition problem without renaming'],
        slides: [
          { say: 'My caravan had 2,345 dates. A friend gave us 1,432 more. Let\'s add them!', visual: function () { return Models.pvBlocks(2, 3, 4, 5, 320) + '<span class="g1op">+</span>' + Models.pvBlocks(1, 4, 3, 2, 260); } },
          { say: 'Line up the places. Start with the ones: five plus two is seven.', visual: function () { return Models.vertical4(2345, 1432, '+'); } },
          { say: 'Tens: four plus three is seven. Hundreds: three plus four is seven. Thousands: two plus one is three.', visual: function () { return Models.vertical4(2345, 1432, '+', 3777); } },
          { say: 'Two thousand, three hundred forty-five plus one thousand, four hundred thirty-two equals three thousand, seven hundred seventy-seven.', visual: function () { return '<span class="g1num">2,345 + 1,432 = 3,777</span>'; } }
        ],
        practice: ['add4', 'add4', 'add4'],
        today: ['add4', 'add4', 'add4', 'word4'], review: ['digitValue', 'measureCm', 'mulFact'],
        explain: { q: 'Where do you start when you add 4-digit numbers?', options: ['With the ones place, on the right.', 'With the thousands, on the left.', 'With whatever digit is biggest.'], answer: 0 },
        worldview: 'When friends give, our supply grows. God provides through the kindness of others.' },
      { id: 'P17-5', num: 5, lesson: 159, title: 'Renaming Ones or Tens', kind: 'lesson', mastered: ['Add with renaming ones or tens', 'Solve 4-digit word problems'], pre: ['add4R', 'add4R', 'word4'],
        objectives: ['Add 4-digit numbers with renaming 10 ones as 1 ten or 10 tens as 1 hundred', 'Solve a word problem'],
        slides: [
          { say: 'Sometimes a place adds up to ten or more. Look at the ones: eight plus five is thirteen.', visual: function () { return Models.vertical4(2318, 1405, '+'); } },
          { say: 'Thirteen ones is one ten and three ones. Write the three, and carry the one ten over to the tens place.', visual: function () { return '<span class="g1num">13 ones = 1 ten + 3 ones</span>'; } },
          { say: 'Now the tens: one plus zero plus the one we carried is two. Then hundreds and thousands. The answer is 3,723.', visual: function () { return Models.vertical4(2318, 1405, '+', 3723); } },
          { say: 'Renaming works for tens too. Ten tens make one hundred.', visual: function () { return Models.pvBlocks(0, 0, 10, 0, 140) + '<span class="g1op">=</span>' + Models.pvBlocks(0, 1, 0, 0, 80); } }
        ],
        practice: ['add4R', 'add4R', 'word4'],
        today: ['add4R', 'word4', 'add4R', 'add4'], review: ['expanded', 'perimeter', 'clockTime'],
        explain: { q: 'The ones add up to 13. What do you do?', options: ['Write 3 and carry 1 ten.', 'Write 13 in the ones place.', 'Carry 3 and write the 1.'], answer: 0 },
        worldview: 'Ten little gifts can become one big gift. God multiplies what we share.' },
      { id: 'P17-6', num: 6, lesson: 160, title: 'Renaming Hundreds', kind: 'lesson', mastered: ['Rename 10 hundreds as 1 thousand', 'Add with renaming hundreds'], pre: ['add4RH', 'tenHundreds', 'add4RH'],
        objectives: ['Rename 10 hundreds as 1 thousand', 'Add 4-digit numbers with renaming 10 hundreds as 1 thousand', 'Solve a word problem'],
        slides: [
          { say: 'Ten hundreds make one thousand. So twelve hundreds is one thousand and two hundreds.', visual: function () { return Models.pvBlocks(0, 12, 0, 0, 520) + '<span class="g1num">12 hundreds = 1,200</span>'; } },
          { say: 'Let\'s add 2,540 plus 1,730. Ones: zero. Tens: four plus three is seven.', visual: function () { return Models.vertical4(2540, 1730, '+'); } },
          { say: 'Hundreds: five plus seven is twelve hundreds. Write the two, and carry one thousand.', visual: function () { return '<span class="g1num">12 hundreds = 1 thousand + 2 hundreds</span>'; } },
          { say: 'Thousands: two plus one plus the one we carried is four. The answer is 4,270!', visual: function () { return Models.vertical4(2540, 1730, '+', 4270); } }
        ],
        practice: ['add4RH', 'tenHundreds', 'add4RH'],
        today: ['add4RH', 'word4', 'add4RH', 'add4R'], review: ['add4', 'thermoRead', 'sub2'],
        explain: { q: 'The hundreds add up to 12. What do you write?', options: ['Write 2 and carry 1 thousand.', 'Write 12 in the hundreds place.', 'Write 1 and carry 2 hundreds.'], answer: 0 },
        worldview: 'Little by little, hundreds become thousands. Faithful work adds up.' },
      { id: 'P17-7', num: 7, lesson: 161, title: 'Subtracting 4-Digit Numbers', kind: 'lesson', mastered: ['Subtract 4-digit numbers without renaming', 'Solve comparison word problems'], pre: ['sub4', 'subCompare', 'sub4'],
        objectives: ['Subtract 4-digit numbers without renaming', 'Solve a comparison word problem', 'Formulate how subtraction helps people care for others (BWS)'],
        slides: [
          { say: 'The big dune is 5,876 steps around. The small dune is 2,341 steps. How many more steps is the big dune?', visual: function () { return '<span style="font-size:3rem">🏜️ 🐪</span>'; } },
          { say: 'How many more means we compare, so we subtract. Line up the places and start with the ones: six minus one is five.', visual: function () { return Models.vertical4(5876, 2341, '−'); } },
          { say: 'Tens: seven minus four is three. Hundreds: eight minus three is five. Thousands: five minus two is three.', visual: function () { return Models.vertical4(5876, 2341, '−', 3535); } },
          { say: 'The big dune is 3,535 steps more. Subtracting helps us know how much more someone needs, so we can help.', visual: function () { return '<span class="g1num">5,876 − 2,341 = 3,535</span>'; } }
        ],
        practice: ['sub4', 'subCompare', 'sub4'],
        today: ['sub4', 'subCompare', 'sub4', 'subCompare'], review: ['add4RH', 'coordRead', 'mulFact'],
        explain: { q: 'Which operation answers "How many more?"', options: ['Subtraction: it compares two amounts.', 'Addition: it always finds more.', 'Counting by hundreds every time.'], answer: 0 },
        worldview: 'Knowing what someone still needs helps us give them the right help.' },
      { id: 'P17-8', num: 8, lesson: 162, title: 'Subtracting with Renaming', kind: 'lesson', mastered: ['Rename 1 thousand as 10 hundreds', 'Subtract with renaming'], pre: ['sub4R', 'sub4R', 'subCompare'],
        objectives: ['Rename 1 thousand as 10 hundreds', 'Subtract 4-digit numbers with renaming', 'Solve a word problem'],
        slides: [
          { say: 'Let\'s subtract 5,326 minus 2,714. Ones: six minus four is two. Tens: two minus one is one.', visual: function () { return Models.vertical4(5326, 2714, '−'); } },
          { say: 'Hundreds: three minus seven? There are not enough hundreds!', visual: function () { return Models.pvChart(5326, 1); } },
          { say: 'Rename one thousand as ten hundreds. Now there are four thousands and thirteen hundreds. Thirteen minus seven is six.', visual: function () { return Models.pvBlocks(1, 0, 0, 0, 80) + '<span class="g1op">→</span>' + Models.pvBlocks(0, 10, 0, 0, 380); } },
          { say: 'Thousands: four minus two is two. The answer is 2,612. Check it by adding: 2,612 plus 2,714 equals 5,326!', visual: function () { return Models.vertical4(5326, 2714, '−', 2612); } }
        ],
        practice: ['sub4R', 'sub4R', 'subCompare'],
        today: ['sub4R', 'sub4', 'sub4R', 'subCompare'], review: ['add4R', 'massUnit', 'add2'],
        explain: { q: 'How do you check a subtraction answer?', options: ['Add the answer to the bottom number.', 'Subtract the answer from itself.', 'Count the digits in the problem.'], answer: 0 },
        worldview: 'When we make a mistake, we can check our work and fix it. God helps us grow.' },
      { id: 'P17-9', num: 9, lesson: 163, title: 'Caravan Review', kind: 'review', mastered: ['Remember everything from Thousand Dunes', 'Build the memory verse, Psalm 139:17–18'],
        objectives: ['Recall concepts and terms from Chapter 17'],
        mix: ['countBy100', 'tenHundreds', 'pvRead', 'pvCount', 'digitValue', 'expanded', 'add4', 'add4R', 'add4RH', 'word4', 'sub4', 'sub4R', 'subCompare'],
        worldview: 'God\'s thoughts toward us are more than the sand. He never forgets us.' },
      { id: 'P17-10', num: 10, lesson: 164, title: 'Lighthouse Challenge', kind: 'boss', mastered: ['Show what you know about 4-digit numbers', 'Relight the Thousand Dunes lighthouse!'],
        objectives: ['Demonstrate knowledge of Chapter 17 (chapter test)'],
        mix: ['countBy100', 'tenHundreds', 'pvRead', 'pvCount', 'digitValue', 'expanded', 'add4', 'add4R', 'add4RH', 'word4', 'sub4', 'sub4R', 'subCompare'],
        worldview: 'The light shines over Thousand Dunes! God keeps every one of His promises.' }
    ]
  };
})();
