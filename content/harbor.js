/* LANTERN HARBOR — the 1st-grade course (a prequel to The Lantern Voyage).
   A regular boy or girl helps Grandpa Eli, the Harbor Master, and works up through the ranks to Captain,
   building a boat one part per district. H0 (Helper's Yard) reviews BJU K5 and shows readiness;
   H1–H21 follow BJU Press Math 1 (5th ed.) chapter by chapter. */
var CONTENT = window.CONTENT || {};
CONTENT.islands = CONTENT.islands || {};
CONTENT.courses = CONTENT.courses || {};
CONTENT.courses.voyage = CONTENT.courses.voyage || { id: 'voyage', name: 'The Lantern Voyage', grade: '2nd–3rd grade (BJU Math 2 ch. 14 → Math 3)', totalLessons: 235 };

(function () {
  var M = G1.make;
  CONTENT.courses.harbor = {
    id: 'harbor', name: 'Lantern Harbor', grade: '1st grade (BJU K5 review → BJU Math 1)', totalLessons: 21 + 6 + 170,
    why: false, pip: false, // first graders: one question at a time, no "How do you know?" part, no "spot the mistake"
    sizes: { lessonNew: 3, lessonReview: 1, review: 6, boss: 8, warm: 3 }, // short "show me" checks: this course teaches by doing
    passBoss: 70,
    words: { check: 'Harbor Check', challenge: 'Show what you learned', boss: 'Chapter Challenge', review: 'Harbor Review', back: 'Back to the dock',
      bossWin: 'You finished this part of the harbor!', bossBtn: 'Get your boat part!', bossNeed: 'You need 90% to finish this part of the harbor.' },
    ranks: ['Harbor Helper', 'Dock Hand', 'Deckhand', 'Boat Builder', 'Navigator-in-Training', 'First Mate', 'Captain'],
    rankAt: [0, 1, 5, 9, 13, 17, 22], // districts finished to reach each rank
    intro: [
      { say: 'Welcome to Lantern Harbor! Fishing boats come and go, gulls call, and every evening the harbor lanterns glow.', art: 'harbor' },
      { say: 'This is you! Right now you are a regular kid who loves boats. Your Grandpa Eli is the Harbor Master.', art: 'kid' },
      { say: 'Grandpa Eli says: If you want to be a captain someday, you start as a helper. Learn your numbers, help your neighbors, and build your own boat, one piece at a time.', art: 'eli' },
      { say: 'Each part of the harbor will teach you something new. Finish a part, and you earn a new piece for your boat. Let\'s begin in Grandpa\'s yard!', art: 'boat' }
    ],
    districts: [
      { id: 'H0', name: "Helper's Yard", kind: 'yard', season: 'summer', unit: 'K5 review: are you ready?' },
      { id: 'H1', name: 'Welcome Dock', kind: 'dock', season: 'fall', unit: 'Numbers to 10 (Math 1, ch. 1)' },
      { id: 'H2', name: 'Seagull Pier', kind: 'pier', season: 'fall', unit: 'Numbers to 20 (ch. 2)' },
      { id: 'H3', name: 'Fish Market', kind: 'market', season: 'fall', unit: 'Addition facts to 6 (ch. 3)' },
      { id: 'H4', name: 'Net Loft', kind: 'loft', season: 'fall', unit: 'Two-digit numbers (ch. 4)' },
      { id: 'H5', name: 'Bakery Row', kind: 'bakery', season: 'fall', unit: 'Subtraction facts to 6 (ch. 5)' },
      { id: 'H6', name: 'Coin Corner', kind: 'shop', season: 'winter', unit: 'Counting coins (ch. 6)' },
      { id: 'H7', name: 'Sledding Hill', kind: 'hill', season: 'winter', unit: 'Addition facts to 12 (ch. 7)' },
      { id: 'H8', name: 'Clock Tower Square', kind: 'clock', season: 'winter', unit: 'Time and calendar (ch. 8)' },
      { id: 'H9', name: 'Pie Shop', kind: 'bakery', season: 'winter', unit: 'Fractions (ch. 9)' },
      { id: 'H10', name: 'Ice Pond', kind: 'pond', season: 'winter', unit: 'Subtraction facts to 12 (ch. 10)' },
      { id: 'H11', name: 'Rope Walk', kind: 'rope', season: 'spring', unit: 'Inches, feet, cups (ch. 11)' },
      { id: 'H12', name: 'Boatyard', kind: 'yard', season: 'spring', unit: 'Adding two-digit numbers (ch. 12)' },
      { id: 'H13', name: 'Fishing Fleet', kind: 'fleet', season: 'spring', unit: 'Subtracting two-digit numbers (ch. 13)' },
      { id: 'H14', name: 'Market Day', kind: 'market', season: 'spring', unit: 'Count on with coins (ch. 14)' },
      { id: 'H15', name: 'Kite Field', kind: 'kite', season: 'spring', unit: 'Geometry (ch. 15)' },
      { id: 'H16', name: 'Cargo Warehouse', kind: 'warehouse', season: 'spring', unit: 'Three-digit numbers (ch. 16)' },
      { id: 'H17', name: 'Garden Gate', kind: 'garden', season: 'summer', unit: 'Metric measurement (ch. 17)' },
      { id: 'H18', name: 'Regatta Bay', kind: 'bay', season: 'summer', unit: 'Facts to 20 (ch. 18)' },
      { id: 'H19', name: 'General Store', kind: 'store', season: 'summer', unit: 'Equations with coins (ch. 19)' },
      { id: 'H20', name: 'Sundial Point', kind: 'sundial', season: 'summer', unit: 'Time and calendar (ch. 20)' },
      { id: 'H21', name: "Captain's Quay", kind: 'quay', season: 'summer', unit: 'Adding three-digit numbers (ch. 21)' }
    ]
  };

  function B(t) { return '<span class="g1num">' + t + '</span>'; }
  function icons(n, kind, col) { return Models.row(n, kind, col); }
  function eggHook(p, q, pass, finale) {
    if (!finale) return null;
    var first = !p.egg.found;
    p.egg.found = true;
    return { html: '<div class="eggfound pop">' + Art.icon('egg', 90) + '<div><b>' + (first ? 'You found a speckled egg in the net!' : 'Your speckled egg is safe and warm.') + '</b><br>Grandpa Eli says: "Keep it warm. Something wonderful is inside!"</div></div>',
      say: first ? 'Look! You found a speckled egg in the net! Grandpa Eli says to keep it warm. Something wonderful is inside!' : '' };
  }

  /* ======================= H0: HELPER'S YARD (K5 readiness) ======================= */
  var G0 = {
    shapes: M('shapeFind'), sort: M('oddOneOut'), pattern: M('pattern'),
    num10: M('numeral', { max: 10 }), dots10: M('dots', { max: 10 }), count10: M('countSet', { max: 10 }), more: M('compareSets', { max: 9 }),
    num20: M('missingNumber', { min: 0, max: 19 }), next20: M('nextNumber', { max: 19 }),
    count20: M('countSet', { min: 11, max: 20 }), graph: M('pictograph'), longer: M('longer'),
    add5: M('add10', { max: 5 }), add10: M('add10', { max: 10 }), sub: M('sub10', { max: 10 }), equal: M('equalShares'),
    coins: M('coinName'), coinVal: M('coinValue'), pennies: M('countPennies', { max: 10 }), clock: M('clockHour'), days: M('dayAfter')
  };
  /* ---------- hands-on activities (see js/activities.js). Functions, so every replay is a little different. ---------- */
  var R = U.rand, P = U.pick;
  function fig(k, c) { return Models.figure(k, 64, c); }
  var SHAPECOL = ['#ffd23f', '#7fc8a9', '#9fd0ff', '#ffb3a7', '#b48ef0'];
  var A = {
    catchN: function (n, theme, from) { return function () { return { type: 'catch', n: n || R(6, 10), theme: theme || P(['fish', 'wood', 'apples', 'mail', 'sails']), from: from || 0 }; }; },
    trace: function (digits, mode) { return function () { return { type: 'trace', digits: typeof digits === 'function' ? digits() : digits, mode: mode }; }; },
    frame: function (lo, hi) { return function () { return { type: 'tenframe', n: R(lo, hi), kind: 'duck' }; }; },
    makeTen: function () { return function () { return { type: 'tenframe', mode: 'ten', fill: R(3, 8), kind: 'duck', n: 10 }; }; },
    join: function (max) { return function () { var a = R(1, max - 1), b = R(1, max - a); return { type: 'join', a: a, b: b }; }; },
    take: function (max) { return function () { var a = R(3, max), b = R(1, a - 1); return { type: 'takeaway', a: a, b: b }; }; },
    match: function (max) { return function () { var a = R(2, max), b = R(2, max); while (b === a) b = R(2, max); return { type: 'match', a: a, b: b }; }; },
    pairs: function () { return function () { return { type: 'pairs', n: R(4, 9) }; }; },
    lineup: function () { return { type: 'lineup', n: 5 }; },
    pattern: function (units) { return function () { return { type: 'pattern', unit: P(units) }; }; },
    clock: function () { return { type: 'clock', hours: U.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3) }; },
    numOrder: function (from, to, back) { return function () { var l = []; for (var i = from; i <= to; i++) l.push(i); if (back) l.reverse();
      return { type: 'sequence', title: back ? 'Count back' : 'Number order', items: l.map(function (n) { return { html: '<span class="g1num">' + n + '</span>', say: G1.W[n] }; }),
        say: back ? 'Count back! Put the numbers in order from ' + G1.W[from === 0 ? to : from] + ' down to ' + G1.W[from] + '. Touch a card to hear it.' : 'Put the numbers in order, starting with ' + G1.W[from] + '. Touch a card to hear it.', end: back ? 'Blast off! You counted back.' : 'The numbers are in order!' }; }; },
    days: function () { var D = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; return { type: 'sequence', title: 'Days of the week', items: D.map(function (d) { return { html: d.slice(0, 3), say: d }; }),
      say: 'Put the days of the week in order. Start with Sunday. Touch a card to hear its name.', end: 'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. Seven days!' }; },
    shapes: function (kinds) { return function () { var items = []; kinds.forEach(function (k) { for (var i = 0; i < 2; i++) items.push({ html: fig(k, P(SHAPECOL)), key: k, say: k }); });
      return { type: 'sort', title: 'Sort the shapes', bins: kinds.map(function (k) { return { key: k, label: k, icon: Models.figure(k, 34, '#fff') }; }), items: items,
        say: 'Put each shape in its own box. Touch a shape to hear its name.', end: 'Every shape is in its box!' }; }; },
    animalsFood: function () { var an = ['fish', 'duck', 'gull'], fd = ['apple', 'loaf', 'pie']; return { type: 'sort', title: 'Animals and food',
      bins: [{ key: 'a', label: 'Animals', icon: Art.icon('duck', 34) }, { key: 'f', label: 'Food', icon: Art.icon('apple', 34) }],
      items: an.map(function (x) { return { html: Art.icon(x, 60), key: 'a', say: x === 'gull' ? 'seagull' : x }; }).concat(fd.map(function (x) { return { html: Art.icon(x, 60), key: 'f', say: x === 'loaf' ? 'bread' : x }; })),
      say: 'Animals go in one box. Food goes in the other box.', end: 'You sorted the animals and the food!' }; },
    ropes: function () { var items = []; [7, 8, 7].forEach(function (l) { items.push({ html: Models.lengthBar(l, '#e5533d', 8), key: 'L', say: 'a long rope' }); }); [2, 3, 2].forEach(function (l) { items.push({ html: Models.lengthBar(l, '#3b8fd9', 8), key: 'S', say: 'a short rope' }); });
      return { type: 'sort', title: 'Long and short', bins: [{ key: 'L', label: 'Longer' }, { key: 'S', label: 'Shorter' }], items: items, say: 'Put the long ropes in the longer box and the short ropes in the shorter box.', end: 'Good sorting! Long ropes and short ropes.' }; },
    graph: function () { return function () { var c = U.shuffle([2, 3, 4]), k = [['fish', 'Fish'], ['duck', 'Ducks'], ['gull', 'Gulls']], items = [];
      k.forEach(function (x, i) { for (var j = 0; j < c[i]; j++) items.push({ html: Art.icon(x[0], 50), key: x[0], say: x[1] === 'Gulls' ? 'seagull' : x[0] }); });
      var mi = c.indexOf(4), fi = c.indexOf(2);
      return { type: 'sort', title: 'Make a picture graph', rows: true, countBins: true, bins: k.map(function (x) { return { key: x[0], label: x[1], icon: Art.icon(x[0], 30) }; }), items: items,
        say: 'Let\'s make a picture graph! Put each animal in its own row.', end: 'Look at the graph. ' + k[mi][1] + ' has the most. ' + k[fi][1] + ' has the fewest.' }; }; },
    equal: function () { var items = []; for (var i = 0; i < 3; i++) items.push({ html: Models.shape({ kind: P(['circle', 'rect']), n: P([2, 4]), shaded: 0, size: 70 }), key: 'eq', say: 'equal parts' });
      for (var j = 0; j < 3; j++) items.push({ html: Models.shape({ kind: P(['circle', 'rect']), n: P([2, 4]), shaded: 0, unequal: true, size: 70 }), key: 'un', say: 'not equal' });
      return { type: 'sort', title: 'Equal parts', bins: [{ key: 'eq', label: 'Equal parts' }, { key: 'un', label: 'Not equal' }], items: items, sayDrop: false,
        hint: function (it) { return it.key === 'eq' ? 'Look again. Are all the parts the same size?' : 'Look again. Is one part bigger than another?'; },
        say: 'Are the parts the same size? Put the fair ones in the equal parts box.', end: 'Equal parts are fair shares!' }; },
    coins: function () { var names = ['penny', 'nickel', 'dime', 'quarter'], items = []; names.forEach(function (k) { for (var i = 0; i < 2; i++) items.push({ html: Models.coin(k, 60), key: k, say: k + ', ' + Models.COINS[k].c + (Models.COINS[k].c === 1 ? ' cent' : ' cents') }); });
      return { type: 'sort', title: 'Sort the coins', bins: names.map(function (k) { return { key: k, label: k, icon: Models.coin(k, 30) }; }), items: items, say: 'Put each coin in its own jar. Touch a coin to hear its name.', end: 'Pennies, nickels, dimes, and quarters!' }; }
  };

  function teach(id, title, pre, slides, practice, today, review, mastered, worldview) {
    return { id: id, title: title, kind: 'teach', pre: pre.slice(0, 3), slides: slides, practice: practice, today: today, review: review, mastered: mastered, worldview: worldview };
  }
  function S(say, vis) { return { say: say, visual: vis }; }
  var PLAY0 = {
    'H0-t1': [A.shapes(['circle', 'triangle', 'square']), A.shapes(['rectangle', 'circle', 'triangle'])],
    'H0-t2': [A.animalsFood],
    'H0-t3': [A.pattern([['red', 'blue']]), A.pattern([['red', 'red', 'blue'], ['yellow', 'green', 'green']])],
    'H0-t4': [A.catchN(10, 'fish'), A.frame(4, 8)],
    'H0-t5': [A.catchN(8, 'wood'), A.catchN(6, 'fish')],
    'H0-t5b': [A.match(6)],
    'H0-t6': [A.catchN(15, 'mail', 10), A.numOrder(10, 15)],
    'H0-t6b': [A.numOrder(1, 8), A.numOrder(11, 16)],
    'H0-t7': [A.catchN(20, 'apples'), A.catchN(17, 'sails')],
    'H0-t8': [A.ropes],
    'H0-t9': [A.graph()],
    'H0-t10': [A.join(6), A.join(10)],
    'H0-t11': [A.take(6), A.take(10)],
    'H0-t12': [A.equal],
    'H0-t13': [A.coins, A.catchN(8, 'pennies')],
    'H0-t14': [A.clock],
    'H0-t15': [A.days],
    'H0-f': [A.catchN(10, 'fish'), A.join(8)]
  };
  var Q0 = [
    { id: 'H0-m1', video: ['shapes', 'sort', 'pattern'], title: 'Find Your Dock', kind: 'readiness', covers: ['H0-t1', 'H0-t2', 'H0-t3'], icon: 'boat',
      intro: 'Every boat has its own dock, and everything in the yard has its own place. Let\'s see what you know about shapes, sorting, and patterns!', mastered: ['Show what you know about shapes, sorting, and patterns'] },
    teach('H0-t1', 'Shapes', ['shapes', 'shapes', 'shapes', 'shapes', 'shapes'], [
      S('Look around the harbor. Shapes are everywhere! A circle is round, like a life ring.', function () { return Models.figure('circle', 140); }),
      S('A square has four sides that are all the same length. A rectangle has four sides too: two long and two short.', function () { return Models.figure('square', 120) + Models.figure('rectangle', 160); }),
      S('A triangle has three sides and three corners, like a little sail.', function () { return Models.figure('triangle', 140); })
    ], ['shapes', 'shapes', 'shapes'], ['shapes'], [], ['Name a circle, square, triangle, and rectangle'], 'God made a world full of shapes, from round suns to pointed mountains.'),
    teach('H0-t2', 'Sorting', ['sort', 'sort', 'sort', 'sort', 'sort'], [
      S('Grandpa Eli sorts things so he can find them. Fish go with fish. Bread goes with bread.', function () { return Art.icon('fish', 70) + Art.icon('fish', 70, '#36b37e') + Art.icon('loaf', 70); }),
      S('When three things are alike, the one that is different does NOT belong. Here, the bread does not belong with the fish.', function () { return Art.icon('fish', 70) + Art.icon('duck', 70) + Art.icon('gull', 70) + '<span class="g1op">≠</span>' + Art.icon('loaf', 70); })
    ], ['sort', 'sort', 'sort'], ['sort'], ['shapes'], ['Tell which one does not belong'], 'God gave each thing its own place. Putting things in order helps everyone.'),
    teach('H0-t3', 'Patterns', ['pattern', 'pattern', 'pattern', 'pattern', 'pattern'], [
      S('A pattern repeats again and again. Say it with me: red, blue, red, blue.', function () { return '<div class="g1row"><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span></div>'; }),
      S('To find what comes next, find the part that repeats. Red, blue… then red comes next!', function () { return '<div class="g1row"><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span><span class="g1dot" style="background:#e5533d"></span><span class="g1dot" style="background:#3b8fd9"></span><span class="g1blank">?</span></div>'; })
    ], ['pattern', 'pattern', 'pattern'], ['pattern'], ['sort'], ['Find what comes next in a pattern'], 'Day and night, summer and winter: God made patterns we can count on.'),

    { id: 'H0-m2', video: ['count10', 'numbers', 'compare'], title: 'Count the Supplies', kind: 'readiness', covers: ['H0-t4', 'H0-t5', 'H0-t6'], icon: 'crate',
      intro: 'A good helper counts the supplies before the boats go out. Let\'s see how well you can count!', mastered: ['Show what you know about counting to 20'] },
    teach('H0-t4', 'Numbers to 10', ['num10', 'dots10', 'num10', 'dots10', 'num10'], [
      S('Every number has a name and a picture. This is three. Three dots, the number 3, and the word three.', function () { return B(3) + Models.dots(3) + '<span class="g1word">three</span>'; }),
      S('Here is a number line. We count up by one: zero, one, two, three, four, five, six, seven, eight, nine, ten.', function () { return Models.numberLine(0, 10); }),
      S('Ten dots fill a whole ten-frame.', function () { return Models.tenFrame(10, 'dot'); })
    ], ['num10', 'dots10', 'num10'], ['num10', 'dots10'], ['shapes'], ['Know the numbers 0 to 10'], 'God made us able to count. Counting helps us take care of what He gives us.'),
    teach('H0-t5', 'Counting to 10', ['count10', 'count10', 'count10', 'count10', 'count10'], [
      S('To count, touch each one and say one number.', function () { return icons(5, 'duck', '#ffd23f'); }),
      S('One, two, three, four, five. Each time we count, we take one step on the number line.', function () { return Models.numberLine(0, 10, { hops: [0, 5] }); }),
      S('The last number you say tells how many. Five ducks!', function () { return icons(5, 'duck', '#ffd23f') + B(5); })
    ], ['count10', 'count10', 'count10'], ['count10'], ['num10'], ['Count up to 10 things'], 'Counting carefully is a way to be faithful with small things.'),
    teach('H0-t5b', 'More and Fewer', ['more', 'more', 'more', 'more', 'more'], [
      S('Which group has more? First, count each group.', function () { return '<div>' + icons(5, 'fish', '#3b8fd9') + '</div><div>' + icons(3, 'fish', '#3b8fd9') + '</div>'; }),
      S('The top group has five. The bottom group has three. Five is farther along the number line, so five is more.', function () { return Models.numberLine(0, 10, { only: [3, 5], mark: 5 }); }),
      S('Three is less, so the bottom group has fewer.', function () { return '<div>' + icons(5, 'fish', '#3b8fd9') + ' <b>more</b></div><div>' + icons(3, 'fish', '#3b8fd9') + ' <b>fewer</b></div>'; })
    ], ['more', 'more', 'more'], ['more'], ['count10'], ['Tell which group has more or fewer'], 'God gives us more than we need, so we can share with those who have less.'),
    teach('H0-t6', 'Numbers 11 to 20', ['num20', 'num20', 'num20', 'num20', 'num20'], [
      S('After ten, we keep counting.', function () { return Models.numberLine(0, 10, { mark: 10 }); }),
      S('Eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty!', function () { return Models.numberLine(10, 20); }),
      S('Numbers go in order on the number line. If one is missing, say the numbers out loud to find it.', function () { return Models.numberLine(10, 15, { blank: 13 }); })
    ], ['num20', 'num20', 'num20'], ['num20'], ['count10'], ['Count from 11 to 20 in order'], 'God counts every one of His children. Not one is forgotten.'),
    teach('H0-t6b', 'Before and After', ['next20', 'next20', 'next20', 'next20', 'next20'], [
      S('The number after a number is one more. It is the next step on the number line. After 14 comes 15.', function () { return Models.numberLine(10, 20, { mark: 14, hops: [14, 15] }); }),
      S('The number before a number is one less. It is one step back. Before 14 comes 13.', function () { return Models.numberLine(10, 20, { mark: 14, hops: [14, 13] }); }),
      S('Put your finger on the number. Step forward for after. Step back for before.', function () { return Models.numberLine(0, 10, { mark: 6 }); })
    ], ['next20', 'next20', 'next20'], ['next20'], ['num20'], ['Tell what comes before and after'], 'Step by step, God leads us. His Word is a light for each step.'),

    { id: 'H0-m3', video: ['count20', 'measure', 'graph'], title: 'Load the Cargo', kind: 'readiness', covers: ['H0-t7', 'H0-t8', 'H0-t9'], icon: 'crate',
      intro: 'Time to load the cargo! Let\'s see how well you count big groups, measure ropes, and read a picture graph.', mastered: ['Show what you know about counting to 20, measuring, and graphs'] },
    teach('H0-t7', 'Counting to 20', ['count20', 'count20', 'count20', 'count20', 'count20'], [
      S('Big groups take careful counting. Touch each one and say the next number. Do not skip any, and do not count any twice!', function () { return icons(14, 'crate', '#c98a3a'); }),
      S('After ten comes eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty.', function () { return B('11 12 13 14 15 16 17 18 19 20'); })
    ], ['count20', 'count20', 'count20'], ['count20'], ['num20'], ['Count groups of up to 20 things'], 'Counting carefully, one by one, is a way to be faithful with what God gives us.'),
    teach('H0-t8', 'Longer and Shorter', ['longer', 'longer', 'longer', 'longer', 'longer'], [
      S('To see which rope is longer, line up the ends. The one that sticks out farther is longer.', function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + '<br>' + Models.lengthBar(4, '#3b8fd9', 8) + '</div>'; }),
      S('The one that stops sooner is shorter. The blue rope is shorter.', function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + '<br>' + Models.lengthBar(4, '#3b8fd9', 8) + '</div>'; })
    ], ['longer', 'longer', 'longer'], ['longer'], ['count20'], ['Tell longer and shorter'], 'Measuring helps us see the world God made more clearly.'),
    teach('H0-t9', 'Picture Graphs', ['graph', 'graph', 'graph', 'graph', 'graph'], [
      S('A picture graph shows how many. Count the pictures in each row.', function () { return '<div class="g1graph"><div class="g1grow"><b>Fish</b>' + Art.icon('fish', 36) + Art.icon('fish', 36) + Art.icon('fish', 36) + Art.icon('fish', 36) + '</div><div class="g1grow"><b>Ducks</b>' + Art.icon('duck', 36) + Art.icon('duck', 36) + '</div></div>'; }),
      S('The row with the most pictures has the most. Here, there are more fish than ducks.', function () { return '<div class="g1graph"><div class="g1grow"><b>Fish</b>' + Art.icon('fish', 36) + Art.icon('fish', 36) + Art.icon('fish', 36) + Art.icon('fish', 36) + '</div><div class="g1grow"><b>Ducks</b>' + Art.icon('duck', 36) + Art.icon('duck', 36) + '</div></div>'; })
    ], ['graph', 'graph', 'graph'], ['graph'], ['longer'], ['Read a picture graph'], 'Graphs help us listen to others and serve them well.'),

    { id: 'H0-m4', video: ['add', 'sub', 'equal'], title: 'Help the Neighbors', kind: 'readiness', covers: ['H0-t10', 'H0-t11', 'H0-t12'], icon: 'apple',
      intro: 'The neighbors need help with apples, fish, and pies. Let\'s see what you know about adding, taking away, and equal parts!', mastered: ['Show what you know about adding, taking away, and equal parts'] },
    teach('H0-t10', 'Adding', ['add5', 'add10', 'add5', 'add10', 'add10'], [
      S('Adding means putting groups together. Two ducks and three more ducks make five ducks.', function () { return '<div class="g1row">' + Models.row(2, 'duck', '#ffd23f', 0, 140) + '<span class="g1op">+</span>' + Models.row(3, 'duck', '#ffd23f', 0, 140) + '</div>' + B('2 + 3 = 5'); }),
      S('You can count them all, or start at the bigger number and count on.', function () { return B('3… 4, 5'); })
    ], ['add5', 'add10', 'add5'], ['add5', 'add10'], ['count10'], ['Add groups up to 10'], 'When we share and add our gifts together, everyone has more.'),
    teach('H0-t11', 'Taking Away', ['sub', 'sub', 'sub', 'sub', 'sub'], [
      S('Taking away means some go away. There were five apples. Mrs. Lee took two. The crossed-out ones are gone.', function () { return Models.row(5, 'apple', '#e5533d', 2); }),
      S('Count the ones that are left. Three apples are left. Five take away two is three.', function () { return B('5 − 2 = 3'); })
    ], ['sub', 'sub', 'sub'], ['sub'], ['add5'], ['Take away from groups up to 10'], 'Giving some away to a neighbor is a happy kind of taking away.'),
    teach('H0-t12', 'Equal Parts', ['equal', 'equal', 'equal', 'equal', 'equal'], [
      S('To share fairly, cut into equal parts. Equal parts are all the same size. Two equal parts are halves.', function () { return Models.shape({ kind: 'circle', n: 2, shaded: 0, size: 150 }); }),
      S('Four equal parts are fourths. These parts are NOT equal, so that would not be fair!', function () { return Models.shape({ kind: 'rect', n: 4, shaded: 0, size: 150 }) + Models.shape({ kind: 'rect', n: 4, shaded: 0, unequal: true, size: 150 }); })
    ], ['equal', 'equal', 'equal'], ['equal'], ['sub'], ['Tell halves and fourths (equal parts)'], 'Fair shares show love to our neighbors.'),

    { id: 'H0-m5', video: ['coins', 'clock', 'days'], title: 'Visit the Village', kind: 'readiness', covers: ['H0-t13', 'H0-t14', 'H0-t15'], icon: 'clock',
      intro: 'Let\'s walk to the village shop. We need coins, the clock, and the calendar. Show me what you know!', mastered: ['Show what you know about coins, clocks, and the calendar'] },
    teach('H0-t13', 'Coins', ['coins', 'coinVal', 'pennies', 'coins', 'coinVal'], [
      S('A penny is worth one cent. A nickel is worth five cents.', function () { return Models.coin('penny', 90) + Models.coin('nickel', 100); }),
      S('A dime is the smallest coin, but it is worth ten cents. A quarter is the biggest. It is worth twenty-five cents.', function () { return Models.coin('dime', 80) + Models.coin('quarter', 115); }),
      S('To count pennies, count by ones. Four pennies are four cents.', function () { return '<div class="g1row">' + [1, 2, 3, 4].map(function () { return Models.coin('penny', 56); }).join('') + '</div>'; })
    ], ['coins', 'coinVal', 'pennies'], ['coins', 'coinVal', 'pennies'], ['equal'], ['Name coins and their values'], 'Money is a tool. God wants us to use it wisely and to give.'),
    teach('H0-t14', 'Telling Time', ['clock', 'clock', 'clock', 'clock', 'clock'], [
      S('A clock has a short hand and a long hand. The short hand tells the hour.', function () { return Models.clock(4, 0, 160); }),
      S('When the long hand points straight up to the twelve, it is an o\'clock time. This clock says four o\'clock.', function () { return Models.clock(4, 0, 160) + B('4:00'); })
    ], ['clock', 'clock', 'clock'], ['clock'], ['coins'], ['Tell time to the hour'], 'God gives us each hour of the day as a gift.'),
    teach('H0-t15', 'Days of the Week', ['days', 'days', 'days', 'days', 'days'], [
      S('There are seven days in a week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.', function () { return '<div class="g1days">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>'; }),
      S('God made the world in six days, and on the seventh day He rested.', function () { return Art.icon('star', 80) + Art.icon('fish', 80) + Art.icon('apple', 80); })
    ], ['days', 'days', 'days'], ['days'], ['clock'], ['Know the days of the week in order'], 'God made the week: six days of work and a day of rest.'),

    { id: 'H0-f', title: 'The Big Catch', kind: 'review', finale: true, mastered: ['Remember everything from Helper\'s Yard', 'Build the memory verse, Psalm 119:105'],
      mix: ['shapes', 'pattern', 'count10', 'more', 'num20', 'count20', 'add10', 'sub', 'coins', 'clock', 'days', 'graph'],
      worldview: 'You are ready for the docks! God\'s Word is a lamp that shows us the way.' }
  ];
  /* a third "try it at home" slide for each short catch-up lesson */
  var MORE0 = {
    'H0-t2': S('Your turn at home: put your toys away by kind. Cars together, blocks together, books together!', function () { return Art.icon('crate', 80) + Art.icon('crate', 80, '#3b8fd9'); }),
    'H0-t3': S('Clap a pattern with Grandpa Eli: clap, stomp, clap, stomp. What comes next? Clap!', function () { return B('👏 🦶 👏 🦶 ?'); }),
    'H0-t7': S('A trick for big groups: move each one over after you count it. Then you never count one twice!', function () { return icons(6, 'crate', '#c98a3a'); }),
    'H0-t8': S('Find two things at home, like a spoon and a pencil. Line up the ends. Which one is longer?', function () { return '<div>' + Models.lengthBar(6, '#36b37e', 8) + '<br>' + Models.lengthBar(3, '#ff9f1c', 8) + '</div>'; }),
    'H0-t9': S('The row with the fewest pictures has the fewest. Here, there are fewer ducks than fish.', function () { return '<div class="g1graph"><div class="g1grow"><b>Fish</b>' + Art.icon('fish', 36) + Art.icon('fish', 36) + Art.icon('fish', 36) + '</div><div class="g1grow"><b>Ducks</b>' + Art.icon('duck', 36) + '</div></div>'; }),
    'H0-t10': S('Adding helps us share. Mom has one apple and you bring two more. Now there are three apples for the family!', function () { return Models.row(1, 'apple', '#e5533d', 0, 70) + '<span class="g1op">+</span>' + Models.row(2, 'apple', '#e5533d', 0, 120) + B('1 + 2 = 3'); }),
    'H0-t11': S('Take away one at a time and count what is left. Four fish, one swims away. Three are left.', function () { return Models.row(4, 'fish', '#3b8fd9', 1) + B('4 − 1 = 3'); }),
    'H0-t12': S('When you share a cookie with your brother, cut it into two equal halves. That is fair and kind!', function () { return Models.shape({ kind: 'circle', n: 2, shaded: 1, size: 140 }); }),
    'H0-t14': S('Let\'s read the clock together. The short hand points to the hour. When the long hand is on the twelve, we say o\'clock.', function () { return Models.clock(7, 0, 150); }),
    'H0-t15': S('Today, tomorrow, yesterday! If today is Monday, tomorrow is Tuesday, and yesterday was Sunday.', function () { return B('Sunday ← Monday → Tuesday'); })
  };
  Q0.forEach(function (q) { if (MORE0[q.id] && q.slides && q.slides.length < 3) q.slides.push(MORE0[q.id]); });
  /* One concept at a time (for 4- to 6-year-olds): every Helper's Yard lesson teaches a single idea, with its own short video.
     The old three-topic readiness checks are gone; each lesson's practice score feeds the parent's readiness report. */
  var VID0 = { 'H0-t1': ['shapes'], 'H0-t2': ['sort'], 'H0-t3': ['pattern'], 'H0-t4': ['numbers'], 'H0-t5': ['count10'], 'H0-t5b': ['compare'], 'H0-t6': ['teens'], 'H0-t6b': ['order'],
    'H0-t7': ['count20'], 'H0-t8': ['measure'], 'H0-t9': ['graph'], 'H0-t10': ['add'], 'H0-t11': ['sub'], 'H0-t12': ['equal'], 'H0-t13': ['coins'], 'H0-t14': ['clock'], 'H0-t15': ['days'] };
  Q0 = Q0.filter(function (q) { return q.kind !== 'readiness'; });
  Q0.forEach(function (q, i) { q.num = i + 1; if (PLAY0[q.id]) q.play = PLAY0[q.id]; if (VID0[q.id]) q.video = VID0[q.id]; });
  Q0.filter(function (q) { return q.id === 'H0-f'; })[0].video = ['count10'];

  CONTENT.islands.H0 = {
    id: 'H0', course: 'harbor', name: "Helper's Yard", noPretest: true,
    bju: 'Readiness review of BJU Press K5 Math (5th ed.): geometry, sorting, patterns, numbers to 20, measurement, graphs, addition and subtraction to 10, fractions, money, time, calendar',
    keeper: { name: 'Grandpa Eli', art: 'eli', voice: 'eli',
      greet: ['Good morning, helper! Welcome to my yard. Every captain starts right here.'],
      greetText: 'Good morning, helper! Welcome to my yard. Every captain starts right here, by helping.' },
    warmup: ['count10', 'num10', 'shapes'],
    generators: G0,
    skillNames: G1.NAMES,
    onWrap: eggHook,
    missions: [
      { id: 'H0-x1', icon: 'star', title: 'Shape Hunt', shells: 15, text: 'Walk around your house with a parent. Find something shaped like a circle, a square, a triangle, and a rectangle. Point to each one and say its name!' },
      { id: 'H0-x2', icon: 'fish', title: 'Sort the Socks', shells: 15, text: 'Help sort the clean socks. Match each sock with its partner. Count the pairs when you are done!' },
      { id: 'H0-x3', icon: 'apple', title: 'Snack Counting', shells: 15, text: 'Count out 10 crackers or grapes for a snack. Give 2 to someone you love. How many are left?' },
      { id: 'H0-x4', icon: 'clock', title: 'Clock Watcher', shells: 15, text: 'Ask a parent to tell you when it is an o\'clock time, like 3:00. Look at a clock: where are the short hand and the long hand?' }
    ],
    verse: { ref: 'Psalm 119:105', version: 'ESV', text: 'Your word is a lamp to my feet and a light to my path.' },
    story: {
      title: 'The Big Catch', ref: 'Luke 5:4–6 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. Simon Peter was a fisherman. He fished all night long, but he did not catch a single fish.' },
        { say: 'Then Jesus got into Simon\'s boat. Listen to what happened.', quote: 'And when he had finished speaking, he said to Simon, "Put out into the deep and let down your nets for a catch." And Simon answered, "Master, we toiled all night and took nothing! But at your word I will let down the nets." And when they had done this, they enclosed a large number of fish, and their nets were breaking.' },
        { say: 'So many fish! Too many to count quickly! Simon listened to Jesus, and Jesus gave more than Simon could imagine.', visual: 'fish' }
      ],
      question: { prompt: 'Simon caught nothing all night. Then who did he listen to?', choices: ['Jesus', 'The seagulls', 'Nobody'], answer: 'Jesus',
        right: 'Yes! Simon listened to Jesus, and the nets were full!', after: 'Now let\'s go help Grandpa Eli!', wrong: 'Listen again: Simon said, "At your word I will let down the nets."' }
    },
    quests: Q0
  };

  /* ======================= H1: WELCOME DOCK (Math 1, chapter 1: Numbers to 10) ======================= */
  var G = {
    num03: M('numeral', { min: 0, max: 3 }), word03: M('numberWord', { min: 0, max: 3 }), dots03: M('dots', { min: 0, max: 3 }), tally3: M('tally', { max: 3 }), make03: M('makeSet', { min: 1, max: 3 }),
    num05: M('numeral', { min: 0, max: 5 }), word45: M('numberWord', { min: 3, max: 5 }), dots45: M('dots', { min: 4, max: 5 }), make45: M('makeSet', { min: 4, max: 5 }),
    more5: M('compareSets', { max: 5 }), order5: M('missingNumber', { min: 0, max: 5, backward: true }), ordinal5: M('ordinal', { max: 5 }),
    tally5: M('tally', { max: 5 }), num69: M('numeral', { min: 6, max: 9 }), word69: M('numberWord', { min: 6, max: 9 }), dots69: M('dots', { min: 6, max: 9 }), make69: M('makeSet', { min: 6, max: 9 }), more9: M('compareSets', { max: 9 }),
    num10: M('numeral', { min: 0, max: 10 }), word10: M('numberWord', { min: 5, max: 10 }), dots10: M('dots', { min: 0, max: 10 }), names10: M('namesForTen'), evenOdd: M('evenOdd', { max: 10 }), order10: M('missingNumber', { min: 0, max: 10 }),
    count10: M('countSet', { max: 10 }), shapes: M('shapeFind'), add5: M('add10', { max: 5 }), coins: M('coinName'), clock: M('clockHour')
  };
  var DOTS = function (n) { return Models.dots(n, 90); };
  CONTENT.islands.H1 = {
    id: 'H1', course: 'harbor', name: 'Welcome Dock',
    bju: 'BJU Press Math 1 (5th ed.), Chapter 1: Numbers to 10 — lessons 1–6',
    keeper: { name: 'Dockmaster Ruth', art: 'ruth', voice: 'keeperF',
      greet: [{ t: '¡Hola, amigo!', lang: 'es' }, 'Hello, friend! Welcome to the Welcome Dock. I am Dockmaster Ruth. I count every boat, every box, and every rope!'],
      greetText: '<b>¡Hola, amigo!</b> <i>Hello, friend!</i> Welcome to the Welcome Dock. I am Dockmaster Ruth. I count every boat, every box, and every rope!' },
    warmup: ['count10', 'dots10', 'num10', 'shapes'],
    generators: G,
    skillNames: G1.NAMES,
    missions: [
      { id: 'H1-x1', icon: 'book', title: 'Write Your Numbers', shells: 20, text: 'Get paper and a pencil. Write the numbers 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Start at the top of each number. Show a parent your best ones!' },
      { id: 'H1-x2', icon: 'crate', title: 'Make a Set', shells: 15, text: 'Ask a parent to say a number from 1 to 10. Make a set with that many spoons, blocks, or toys. Count them out loud.' },
      { id: 'H1-x3', icon: 'star', title: 'Dot Pattern Hunt', shells: 15, text: 'Find a die (from a game) or dominoes. Roll or pick one, and say the number of dots without counting one by one!' },
      { id: 'H1-x4', icon: 'duck', title: 'Line Up the Toys', shells: 15, text: 'Line up 5 toys. Point and say: first, second, third, fourth, fifth. Ask a parent to call out a place, like "third," and you point to it!' },
      { id: 'H1-x5', icon: 'fish', title: 'Even or Odd Socks', shells: 15, text: 'Count some socks. Put them in pairs. If every sock has a partner, the number is even. If one is left over, it is odd!' }
    ],
    verse: { ref: 'Psalm 147:4', version: 'ESV', text: 'He determines the number of the stars; he gives to all of them their names.' },
    story: {
      title: 'God Counts the Stars', ref: 'Psalm 147:4 (ESV)',
      panels: [
        { say: 'Look up at the night sky! How many stars can you see? Too many to count!' },
        { say: 'People cannot count all the stars. But God can. The Bible says:', quote: 'He determines the number of the stars; he gives to all of them their names.' },
        { say: 'God made every star, and He knows each one by name. He knows you by name, too. When we count, we are using a gift God gave us.', visual: 'stars' }
      ],
      question: { prompt: 'Who knows the number of all the stars?', choices: ['God', 'Nobody', 'Only the sailors'], answer: 'God',
        right: 'Yes! God made every star and knows each one by name.', after: 'Now let\'s go count with Dockmaster Ruth!', wrong: 'Listen again: He determines the number of the stars.' }
    },
    quests: [
      { id: 'H1-1', num: 1, lesson: 1, title: 'Zero, One, Two, Three', kind: 'lesson',
        mastered: ['Know the numbers 0, 1, 2, and 3', 'Match dot patterns and number words to 0–3', 'Make sets of 1, 2, or 3', 'Read tally marks 1–3'], pre: ['num03', 'dots03', 'tally3'],
        objectives: ['Identify numbers, dot patterns and number words for 0–3', 'Write numbers 0–3 (paper mission)', 'Make sets for 0–3', 'Identify tally marks 1–3', 'Recall why people count (BWS Exploring)'],
        slides: [
          { say: 'Welcome to the dock! Before the boats go out, we count everything. Today we learn zero, one, two, and three.', visual: function () { return Art.icon('boat', 120); } },
          { say: 'Zero means none at all. One is a single boat. Two is a pair. Three is one more than two.', visual: function () { return [0, 1, 2, 3].map(function (n) { return '<div class="center">' + B(n) + DOTS(n) + '</div>'; }).join(''); } },
          { say: 'Each number has a word. Zero, one, two, three.', visual: function () { return ['zero', 'one', 'two', 'three'].map(function (w, i) { return '<div class="center">' + B(i) + '<span class="g1word">' + w + '</span></div>'; }).join(''); } },
          { say: 'Tally marks are little lines for counting. One line is one. Two lines are two. Three lines are three.', visual: function () { return Models.tally(1) + Models.tally(2) + Models.tally(3); } },
          { say: 'Why do people count? To know how many! Ruth counts the boats so every one comes home safe.', visual: function () { return Models.row(3, 'boat', '#e5533d'); } }
        ],
        play: [A.trace([0, 1, 2, 3]), A.catchN(3, 'fish'), A.frame(2, 3)],
        practice: ['num03', 'dots03', 'make03'],
        today: ['num03', 'word03', 'dots03', 'tally3', 'make03', 'num03'], review: ['shapes', 'count10'],
        explain: { q: 'Why do people count?', options: ['To know how many there are.', 'To make the numbers go away.', 'Because counting is very noisy.'], answer: 0 },
        worldview: 'God made a world full of things to count. Counting helps us take good care of them.' },
      { id: 'H1-2', num: 2, lesson: 2, title: 'Four, Five, First to Fifth', kind: 'lesson',
        mastered: ['Know the numbers 4 and 5', 'Tell which set has more or fewer', 'Count 0 to 5 forward and backward', 'Know first, second, third, fourth, fifth'], pre: ['dots45', 'more5', 'ordinal5'],
        objectives: ['Identify numbers, dot patterns and number words for 4–5', 'Write numbers 4–5 (paper mission)', 'Make sets for 4–5', 'Compare sets up to 5', 'Sequence 0–5 forward and backward', 'Identify and locate ordinal positions first to fifth'],
        slides: [
          { say: 'Four is one more than three. Five is one more than four. Look at the dots!', visual: function () { return '<div class="center">' + B(4) + DOTS(4) + '<span class="g1word">four</span></div><div class="center">' + B(5) + DOTS(5) + '<span class="g1word">five</span></div>'; } },
          { say: 'Which group has more boxes? Count both groups. Five is more than three.', visual: function () { return Models.row(5, 'crate', '#c98a3a', 0, 300) + Models.row(3, 'crate', '#c98a3a', 0, 300); } },
          { say: 'We can count up: zero, one, two, three, four, five. And we can count back: five, four, three, two, one, zero. Blast off!', visual: function () { return B('0 1 2 3 4 5') + '<br>' + B('5 4 3 2 1 0'); } },
          { say: 'The ducks are in a line. Start at the front. First, second, third, fourth, fifth!', visual: function () { return '<div class="g1row">' + ['first', 'second', 'third', 'fourth', 'fifth'].map(function (w) { return '<div class="center">' + Art.icon('duck', 54) + '<b>' + w + '</b></div>'; }).join('') + '</div>'; } }
        ],
        play: [A.trace([4, 5]), A.match(5), A.numOrder(0, 5), A.lineup],
        practice: ['dots45', 'more5', 'ordinal5'],
        today: ['num05', 'word45', 'make45', 'more5', 'order5', 'ordinal5'], review: ['num03', 'tally3'],
        explain: { q: 'How do you know which group has more?', options: ['I count both groups. The bigger number has more.', 'The group on the top always has more.', 'The group with bigger pictures has more.'], answer: 0 },
        worldview: 'Taking turns in line, first to fifth, is a way to love others.' },
      { id: 'H1-3', num: 3, lesson: 3, title: 'Six, Seven, Eight, Nine', kind: 'lesson',
        mastered: ['Know the numbers 6, 7, 8, and 9', 'Read tally marks up to 5', 'Make sets up to 9', 'Compare sets up to 9'], pre: ['num69', 'tally5', 'more9'],
        objectives: ['Identify tally marks 1–5', 'Identify numbers, dot patterns and number words for 6–9', 'Make sets up to 9', 'Compare sets up to 9', 'Write numbers 6–9 (paper mission)'],
        slides: [
          { say: 'Here is a tally trick. Four lines, then the fifth line crosses them all. That is a group of five!', visual: function () { return Models.tally(4) + Models.tally(5); } },
          { say: 'Six, seven, eight, nine. Each one is one more than the one before.', visual: function () { return [6, 7, 8, 9].map(function (n) { return '<div class="center">' + B(n) + DOTS(n) + '</div>'; }).join(''); } },
          { say: 'Six, seven, eight, nine. Let\'s read the words.', visual: function () { return ['six', 'seven', 'eight', 'nine'].map(function (w, i) { return '<div class="center">' + B(i + 6) + '<span class="g1word">' + w + '</span></div>'; }).join(''); } },
          { say: 'To make a set of seven, count out seven things, one at a time. Stop when you say seven!', visual: function () { return Models.row(7, 'fish', '#3b8fd9'); } }
        ],
        play: [A.trace([6, 7, 8, 9]), A.catchN(7, 'wood'), A.frame(6, 9), A.match(9)],
        practice: ['num69', 'tally5', 'make69'],
        today: ['tally5', 'num69', 'word69', 'dots69', 'make69', 'more9'], review: ['ordinal5', 'more5'],
        explain: { q: 'How do you make a set of 7?', options: ['Count out things one at a time and stop at 7.', 'Grab a big handful of things.', 'Pick the 7 biggest things.'], answer: 0 },
        worldview: 'God knows exactly how many fish are in the sea and how many hairs are on your head.' },
      { id: 'H1-4', num: 4, lesson: 4, title: 'Ten and Even Numbers', kind: 'lesson',
        mastered: ['Know the number 10', 'Find ways to make 10', 'Tell even and odd numbers', 'Put 0 to 10 in order'], pre: ['names10', 'evenOdd', 'order10'],
        objectives: ['Identify the number, dot pattern and word for 10', 'Make sets of 10 to find names for 10', 'Identify even and odd numbers to 10', 'Write numbers 0–10 in order', 'Explain how God made people to count (BWS Exploring)'],
        slides: [
          { say: 'Ten! A ten-frame has ten boxes. When every box is full, we have ten.', visual: function () { return Models.tenFrame(10, 'duck') + B(10) + '<span class="g1word">ten</span>'; } },
          { say: 'There are many ways to make ten. Seven ducks and three empty boxes. Seven and three make ten!', visual: function () { return Models.tenFrame(7, 'duck') + B('7 + 3 = 10'); } },
          { say: 'Put things in pairs. If every one has a partner, the number is even. Two, four, six, eight, ten are even.', visual: function () { return '<div class="g1pairs"><span>' + Art.icon('fish', 40) + Art.icon('fish', 40) + '</span><span>' + Art.icon('fish', 40) + Art.icon('fish', 40) + '</span></div>' + B('2 4 6 8 10'); } },
          { say: 'If one is left over, the number is odd. One, three, five, seven, nine are odd.', visual: function () { return '<div class="g1pairs"><span>' + Art.icon('fish', 40) + Art.icon('fish', 40) + '</span><span>' + Art.icon('fish', 40) + '<i class="g1alone"></i></span></div>' + B('1 3 5 7 9'); } },
          { say: 'God made people able to count. He made our minds to explore His world!', visual: function () { return Art.icon('star', 70) + Art.icon('star', 90) + Art.icon('star', 70); } }
        ],
        play: [A.makeTen(), A.pairs(), A.numOrder(0, 10), A.trace([7, 8, 9, 10], 'write')],
        practice: ['names10', 'evenOdd', 'order10'],
        today: ['num10', 'word10', 'names10', 'evenOdd', 'order10', 'names10'], review: ['num69', 'tally5'],
        explain: { q: 'How do you know if a number is even?', options: ['Every one has a partner when I make pairs.', 'The number is very big.', 'One is left over with no partner.'], answer: 0 },
        worldview: 'God made people to count and to explore His wonderful world.' },
      { id: 'H1-5', num: 5, lesson: 5, title: 'Harbor Review', kind: 'review', play: [A.catchN(10, 'fish'), A.trace(function () { return U.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3); }, 'write'), A.lineup], mastered: ['Remember everything from the Welcome Dock', 'Build the memory verse, Psalm 147:4'],
        objectives: ['Recall concepts and terms from Chapter 1'],
        mix: ['num03', 'tally3', 'dots45', 'more5', 'ordinal5', 'order5', 'tally5', 'num69', 'more9', 'names10', 'evenOdd', 'order10'],
        worldview: 'Reviewing helps us remember. God\'s Word is worth remembering most of all!' },
      { id: 'H1-6', num: 6, lesson: 6, title: 'Chapter Challenge', kind: 'boss', mastered: ['Show what you know about numbers to 10', 'Earn a new piece for your boat!'],
        objectives: ['Demonstrate knowledge of Chapter 1 (chapter test)'],
        mix: ['num03', 'word03', 'dots03', 'tally3', 'dots45', 'more5', 'order5', 'ordinal5', 'tally5', 'num69', 'word69', 'more9', 'names10', 'evenOdd', 'order10'],
        worldview: 'Well done! Just as Ruth counts every boat, God watches over every one of His children.' }
    ]
  };


  /* ======================= H2: SEAGULL PIER (Math 1, chapter 2: Numbers to 20) ======================= */
  var G2 = {
    num1112: M('numeral', { min: 10, max: 12 }), dots1112: M('dots', { min: 11, max: 12 }), dozen: M('dozen'), make12: M('makeSet', { min: 8, max: 12 }), count12: M('countSet', { min: 9, max: 12 }),
    num1314: M('numeral', { min: 11, max: 14 }), dots1314: M('dots', { min: 13, max: 14 }), word1314: M('numberWord', { min: 11, max: 14 }), ordinal10: M('ordinal', { max: 10 }),
    num1516: M('numeral', { min: 13, max: 16 }), dots1516: M('dots', { min: 15, max: 16 }), matchUp: M('matchUp'), graph: M('pictograph'),
    num1718: M('numeral', { min: 15, max: 18 }), dots1718: M('dots', { min: 17, max: 18 }), after20: M('nextNumber', { min: 10, max: 20 }), barGraph: M('barGraph'),
    num20: M('numeral', { min: 11, max: 20 }), dots20: M('dots', { min: 11, max: 20 }), word20: M('numberWord', { min: 11, max: 20 }), order20: M('missingNumber', { min: 10, max: 20 }), evenOdd20: M('evenOdd', { min: 11, max: 20 }),
    count20: M('countSet', { min: 11, max: 20 }), num10: M('numeral', { min: 0, max: 10 }), evenOdd: M('evenOdd', { max: 10 }), names10: M('namesForTen'), ordinal5: M('ordinal', { max: 5 }), more9: M('compareSets', { max: 9 })
  };
  function teenCard(n) { return '<div class="center">' + B(n) + Models.dots(n, 64) + '<span class="g1word">' + G1.W[n] + '</span></div>'; }
  var AH2 = {
    catchTo: function (lo, hi, theme) { return function () { return { type: 'catch', n: R(lo, hi), theme: theme || P(['fish', 'mail', 'apples', 'sails']), title: theme === 'eggs' ? 'Gather a dozen eggs' : undefined }; }; },
    teenFrame: function (lo, hi) { return function () { return { type: 'tenframe', n: R(lo, hi), kind: 'duck' }; }; },
    pairs20: function () { return function () { return { type: 'pairs', n: R(11, 16) }; }; },
    lineup10: { type: 'lineup', n: 10 },
    match: function () { return function () { var a = R(5, 9), b = a + P([-2, -1, 1, 2]); return { type: 'match', a: a, b: b }; }; },
    bars: function () { return function () { var c = U.shuffle([3, 5, 6]), k = [['fish', 'Fish'], ['duck', 'Ducks'], ['gull', 'Gulls']], items = [];
      k.forEach(function (x, i) { for (var j = 0; j < c[i]; j++) items.push({ html: Art.icon(x[0], 50), key: x[0], say: x[1] === 'Gulls' ? 'seagull' : x[0] }); });
      var mi = c.indexOf(6), fi = c.indexOf(3);
      return { type: 'sort', title: 'Build a bar graph', rows: true, countBins: true, bins: k.map(function (x) { return { key: x[0], label: x[1], icon: Art.icon(x[0], 30) }; }), items: U.shuffle(items),
        say: 'Pete counted the animals on the pier. Put each one in its row to build a graph. Each row is like a bar!', end: 'Look at your graph. ' + k[mi][1] + ' has the longest bar, so it has the most. ' + k[fi][1] + ' has the shortest bar, so it has the fewest.' }; }; }
  };
  CONTENT.islands.H2 = {
    id: 'H2', course: 'harbor', name: 'Seagull Pier',
    bju: 'BJU Press Math 1 (5th ed.), Chapter 2: Numbers to 20 — lessons 7–13',
    keeper: { name: 'Fisherman Pete', art: 'pete', voice: 'keeperM',
      greet: [{ t: '¡Hola, marinero!', lang: 'es' }, 'Hello, sailor! Welcome to Seagull Pier. I am Fisherman Pete. My boat brings in lots of fish, more than ten! Let\'s learn the big numbers together.'],
      greetText: '<b>¡Hola, marinero!</b> <i>Hello, sailor!</i> Welcome to Seagull Pier. I am Fisherman Pete. My boat brings in lots of fish, more than ten! Let\'s learn the big numbers together.' },
    warmup: ['num10', 'evenOdd', 'names10', 'ordinal5'],
    generators: G2,
    skillNames: G1.NAMES,
    missions: [
      { id: 'H2-x1', icon: 'egg', title: 'Count a Dozen', shells: 15, text: 'Open an egg carton with a parent (empty or full). Count the spaces. A dozen is twelve! Can you find other things that come in a dozen?' },
      { id: 'H2-x2', icon: 'star', title: 'Teen Number Hunt', shells: 15, text: 'Look for numbers 11 to 20 around the house: on a clock, a calendar, a book page, or a remote. Read each one to a parent.' },
      { id: 'H2-x3', icon: 'duck', title: 'Line Up 10 Toys', shells: 15, text: 'Line up 10 toys. Point and say: first, second, third… all the way to tenth. Ask a parent to call out a place, like "seventh," and point to it!' },
      { id: 'H2-x4', icon: 'chart', title: 'Family Bar Graph', shells: 20, text: 'Ask your family: dogs, cats, or fish? Stack one block for each answer to make bars. Which bar is tallest? Which is shortest?' },
      { id: 'H2-x5', icon: 'book', title: 'Write 11 to 20', shells: 20, text: 'Get paper and a pencil. Write the numbers 11, 12, 13, 14, 15, 16, 17, 18, 19, 20. Show a parent your best ones!' }
    ],
    verse: { ref: 'Psalm 90:12', version: 'ESV', text: 'So teach us to number our days that we may get a heart of wisdom.' },
    story: {
      title: 'Jesus Chooses Twelve', ref: 'Mark 3:13–14 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. One day Jesus went up on a mountain.', quote: 'And he went up on the mountain and called to him those whom he desired, and they came to him.' },
        { say: 'Jesus chose twelve men to be His helpers.', quote: 'And he appointed twelve (whom he also named apostles) so that they might be with him and he might send them out to preach' },
        { say: 'Twelve is a dozen. Peter, Andrew, James, John, and eight more. Some of them were fishermen, just like Pete! Jesus wanted them to be with Him and to tell others about Him.', visual: 'twelve' }
      ],
      question: { prompt: 'How many helpers did Jesus choose?', choices: ['12', '10', '3'], answer: '12',
        right: 'Yes! Jesus chose twelve. That is a dozen!', after: 'Now let\'s go help Fisherman Pete!', wrong: 'Listen again: He appointed twelve.' }
    },
    quests: [
      { id: 'H2-1', num: 1, lesson: 7, title: 'Eleven, Twelve, a Dozen', kind: 'lesson',
        mastered: ['Know the numbers 11 and 12', 'Know that a dozen is 12', 'Make sets up to 12'], pre: ['num1112', 'dozen', 'count12'],
        objectives: ['Identify numbers, dot patterns and number words for 11–12', 'Identify a dozen as 12', 'Make sets to 12', 'Write 11–12 (trace and paper)', 'Explain how sets help people work (BWS)'],
        slides: [
          { say: 'Ahoy! My boat came in with lots of fish. More than ten! Let\'s learn the numbers after ten.', visual: function () { return Art.keeper('pete', 120); } },
          { say: 'Here is ten. The ten-frame is full.', visual: function () { return Models.tenFrame(10, 'dot', 220) + B(10); } },
          { say: 'Ten and one more is eleven. We write eleven with two ones.', visual: function () { return teenCard(11); } },
          { say: 'Ten and two more is twelve. We write it with a one and a two.', visual: function () { return teenCard(12); } },
          { say: 'Twelve has a special name. A dozen! A carton of eggs holds a dozen.', visual: function () { return Models.carton(12); } },
          { say: 'Sets help people work. I pack my fish in sets of twelve, so I know how many I have to sell.', visual: function () { return Models.row(12, 'fish', '#3b8fd9', 0, 360); } }
        ],
        play: [A.trace([11, 12]), AH2.catchTo(12, 12, 'eggs'), AH2.teenFrame(11, 12)],
        practice: ['num1112', 'dots1112', 'dozen'],
        today: ['num1112', 'dots1112', 'dozen', 'make12', 'count12', 'dozen'], review: ['num10', 'evenOdd'],
        explain: { q: 'How do sets help people work?', options: ['They help people know how many they have.', 'They make the work last much longer.', 'They hide things so no one can count.'], answer: 0 },
        worldview: 'God made a world of order. Counting in sets helps us work well and serve others.' },
      { id: 'H2-2', num: 2, lesson: 8, title: 'Thirteen, Fourteen, First to Tenth', kind: 'lesson',
        mastered: ['Know the numbers 13 and 14', 'Know first through tenth'], pre: ['num1314', 'dots1314', 'ordinal10'],
        objectives: ['Identify numbers, dot patterns and number words for 13–14', 'Identify ordinal positions first through tenth', 'Write 13–14 (trace and paper)'],
        slides: [
          { say: 'Ten and three more is thirteen.', visual: function () { return teenCard(13); } },
          { say: 'Ten and four more is fourteen.', visual: function () { return teenCard(14); } },
          { say: 'Ten boats are waiting at the pier. The front of the line is by the flag.', visual: function () { return '<div class="g1row"><span style="font-size:2.4rem">🚩</span>' + Models.row(10, 'boat', '#e5533d', 0, 460) + '</div>'; } },
          { say: 'We know first to fifth. Now keep going: sixth, seventh, eighth, ninth, tenth!', visual: function () { return '<div style="align-self:center"><div class="keyline">' + ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(function (o) { return '<span>' + o + '</span>'; }).join('') + '</div></div>'; } }
        ],
        play: [A.trace([13, 14]), AH2.lineup10, AH2.teenFrame(13, 14)],
        practice: ['num1314', 'word1314', 'ordinal10'],
        today: ['num1314', 'dots1314', 'word1314', 'ordinal10', 'ordinal10', 'num1314'], review: ['dozen', 'num1112'],
        explain: { q: 'Where do you start counting first, second, third?', options: ['At the front of the line.', 'At the very end of the line.', 'In the middle of the line.'], answer: 0 },
        worldview: 'Waiting your turn in line, even when you are tenth, is a way to love others.' },
      { id: 'H2-3', num: 3, lesson: 9, title: 'Fifteen, Sixteen, Match Up', kind: 'lesson',
        mastered: ['Know the numbers 15 and 16', 'Match one to one', 'Read a picture graph'], pre: ['num1516', 'matchUp', 'graph'],
        objectives: ['Identify numbers, dot patterns and number words for 15–16', 'Use one-to-one correspondence', 'Read a pictograph', 'Write 15–16 (trace and paper)'],
        slides: [
          { say: 'Ten and five more is fifteen.', visual: function () { return teenCard(15); } },
          { say: 'Ten and six more is sixteen.', visual: function () { return teenCard(16); } },
          { say: 'Does every boat get a net? Match them one to one. One boat for each net.', visual: function () { return '<div class="g1match">' + [0, 1, 2, 3].map(function (i) { return '<div class="g1mcol">' + Art.icon('boat', 46, '#e5533d') + (i < 3 ? Art.icon('basket', 40) : '<span class="g1ghost"></span>') + '</div>'; }).join('') + '</div>'; } },
          { say: 'One boat has no net! When one is left over, the groups are not the same.', visual: function () { return B('4 boats, 3 nets'); } },
          { say: 'A picture graph shows how many. Count the pictures in each row.', visual: function () { return '<div class="g1graph"><div class="g1grow"><b>Fish</b>' + Models.row(4, 'fish', '#3b8fd9', 0, 200) + '</div><div class="g1grow"><b>Gulls</b>' + Models.row(2, 'gull', '#ffffff', 0, 110) + '</div></div>'; } }
        ],
        play: [A.trace([15, 16]), AH2.match(), A.graph()],
        practice: ['num1516', 'matchUp', 'graph'],
        today: ['num1516', 'dots1516', 'matchUp', 'graph', 'matchUp', 'num1516'], review: ['ordinal10', 'num1314'],
        explain: { q: 'How can you tell if every boat gets a net?', options: ['Match one net to each boat and look.', 'Guess by looking at the colors.', 'Count only the boats, not the nets.'], answer: 0 },
        worldview: 'God gives each of His children what they need, one by one.' },
      { id: 'H2-4', num: 4, lesson: 10, title: 'Seventeen, Eighteen, Bar Graphs', kind: 'lesson',
        mastered: ['Know the numbers 17 and 18', 'Tell what comes after a number', 'Read a bar graph'], pre: ['num1718', 'after20', 'barGraph'],
        objectives: ['Identify numbers, dot patterns and number words for 17–18', 'Identify numbers that come after (to 20)', 'Read a bar graph', 'Explain how bar graphs help people work (BWS)', 'Write 17–18 (trace and paper)'],
        slides: [
          { say: 'Ten and seven more is seventeen.', visual: function () { return teenCard(17); } },
          { say: 'Ten and eight more is eighteen.', visual: function () { return teenCard(18); } },
          { say: 'What comes after seventeen? Count up one: eighteen! After means one more.', visual: function () { return '<div style="align-self:center"><div class="keyline">' + [15, 16, 17, 18, 19, 20].map(function (n) { return '<span' + (n === 18 ? ' style="background:#ffd23f"' : '') + '>' + n + '</span>'; }).join('') + '</div></div>'; } },
          { say: 'This is a bar graph. Each box is one animal. The tallest bar shows the most.', visual: function () { return G1.barSvg([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad']], [5, 2, 4], 6); } },
          { say: 'To find how many, put your finger on top of the bar and slide across to the number.', visual: function () { return G1.barSvg([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad']], [5, 2, 4], 6); } },
          { say: 'Bar graphs help workers. I can see in one look which day I caught the most fish!', visual: function () { return Art.icon('fish', 70, '#3b8fd9') + Art.icon('basket', 70); } }
        ],
        play: [A.trace([17, 18]), AH2.bars(), AH2.teenFrame(17, 18)],
        practice: ['num1718', 'after20', 'barGraph'],
        today: ['num1718', 'dots1718', 'after20', 'barGraph', 'barGraph', 'after20'], review: ['matchUp', 'num1516'],
        explain: { q: 'How does a bar graph help people work?', options: ['It shows how many in one quick look.', 'It makes all of the numbers disappear.', 'It tells the time of day for workers.'], answer: 0 },
        worldview: 'Bar graphs help workers plan well. God wants us to work wisely.' },
      { id: 'H2-5', num: 5, lesson: 11, title: 'Nineteen, Twenty, Even and Odd', kind: 'lesson',
        mastered: ['Know the numbers 19 and 20', 'Put 10 to 20 in order', 'Tell even and odd numbers to 20'], pre: ['num20', 'order20', 'evenOdd20'],
        objectives: ['Identify numbers, dot patterns and number words for 19–20', 'Sequence numbers 0–20', 'Identify even and odd numbers to 20', 'Write 19–20 (trace and paper)'],
        slides: [
          { say: 'Ten and nine more is nineteen.', visual: function () { return teenCard(19); } },
          { say: 'Ten and ten more is twenty. Two full tens!', visual: function () { return teenCard(20); } },
          { say: 'Let\'s count from ten to twenty: ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty!', visual: function () { return '<div style="align-self:center"><div class="keyline">' + [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div></div>'; } },
          { say: 'Remember even and odd? Make pairs. Fourteen fish make seven pairs, with none left over. Fourteen is even.', visual: function () { return '<div class="g1pairs">' + Array.from({ length: 7 }, function () { return '<span>' + Art.icon('fish', 30, '#3b8fd9') + Art.icon('fish', 30, '#3b8fd9') + '</span>'; }).join('') + '</div>'; } },
          { say: 'Fifteen fish make seven pairs and one left over. Fifteen is odd.', visual: function () { return '<div class="g1pairs">' + Array.from({ length: 8 }, function (_, i) { return '<span>' + Art.icon('fish', 30, '#3b8fd9') + (i < 7 ? Art.icon('fish', 30, '#3b8fd9') : '<i class="g1alone" style="width:30px;height:30px"></i>') + '</span>'; }).join('') + '</div>'; } }
        ],
        play: [A.trace([19, 20]), A.numOrder(10, 20), AH2.pairs20()],
        practice: ['num20', 'order20', 'evenOdd20'],
        today: ['num20', 'word20', 'order20', 'evenOdd20', 'dots20', 'evenOdd20'], review: ['barGraph', 'num1718'],
        explain: { q: 'How do you know 15 is odd?', options: ['When I make pairs, one is left over.', 'Fifteen is a very big number.', 'Every fish has a partner.'], answer: 0 },
        worldview: 'God made numbers to go on and on. His love for us never ends!' },
      { id: 'H2-6', num: 6, lesson: 12, title: 'Harbor Review', kind: 'review', play: [AH2.catchTo(13, 20, 'fish'), A.trace(function () { return U.shuffle([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).slice(0, 3); }, 'write'), AH2.lineup10],
        mastered: ['Remember everything from Seagull Pier', 'Build the memory verse, Psalm 90:12'],
        objectives: ['Recall concepts and terms from Chapter 2'],
        mix: ['num1112', 'dozen', 'num1314', 'ordinal10', 'num1516', 'matchUp', 'graph', 'num1718', 'after20', 'barGraph', 'order20', 'evenOdd20'],
        worldview: 'Psalm 90 asks God to teach us to number our days, to use our time wisely.' },
      { id: 'H2-7', num: 7, lesson: 13, title: 'Chapter Challenge', kind: 'boss', mastered: ['Show what you know about numbers to 20', 'Earn a new piece for your boat!'],
        objectives: ['Demonstrate knowledge of Chapter 2 (chapter test)'],
        mix: ['num1112', 'dots1112', 'dozen', 'num1314', 'word1314', 'ordinal10', 'num1516', 'matchUp', 'graph', 'num1718', 'after20', 'barGraph', 'num20', 'order20', 'evenOdd20'],
        worldview: 'Well done! Just like Jesus\' twelve helpers, you can serve others with what you learn.' }
    ]
  };

  /* ======================= H3: FISH MARKET (Math 1, chapter 3: Addition facts to 6) ======================= */
  var G3 = {
    signs: M('plusEquals'), add6z: M('addTo6', { max: 6, zero: true }), add6: M('addTo6', { max: 6 }), add4: M('addTo6', { max: 4, zero: true }),
    sentence: M('addSentence', { max: 6 }), sentence5: M('addSentence', { max: 5 }), story: M('addStory', { max: 6 }), storyZ: M('addStory', { max: 6, zero: true }),
    vertical: M('addVertical', { max: 6 }), names456: M('addNames', { target: [4, 5, 6] }), turn: M('turnAround', { max: 6 }),
    num20: M('numeral', { min: 11, max: 20 }), evenOdd20: M('evenOdd', { min: 11, max: 20 }), after20: M('nextNumber', { min: 10, max: 20 }), ordinal10: M('ordinal', { max: 10 }),
    dozen: M('dozen'), barGraph: M('barGraph'), names10: M('namesForTen')
  };
  var AH3 = {
    sentence: function (max) { return function () { var a = R(1, max - 1), b = R(1, max - a); return { type: 'sentence', a: a, b: b }; }; },
    sentenceZ: function () { return function () { var a = R(1, 5); return { type: 'sentence', a: a, b: 0, say: 'There are ' + G1.W[a] + ' white ducks and no brown ducks at all. Zero brown ducks! Build the addition sentence.' }; }; },
    turn: function () { return function () { var a, b; do { a = R(1, 5); b = R(1, 6 - a); } while (a === b); return { type: 'sentence', a: b, b: a, given: a + ' + ' + b + ' = ' + (a + b) }; }; },
    dominoes: function () { return function () { var items = [];
      [4, 5, 6].forEach(function (t) { var pairs = []; for (var a = 0; a <= Math.min(6, t); a++) if (t - a <= 6) pairs.push([a, t - a]);
        U.shuffle(pairs).slice(0, 2).forEach(function (p) { items.push({ html: Models.domino(p[0], p[1], 66), key: 't' + t, say: G1.W[p[0]] + ' and ' + G1.W[p[1]], drop: G1.W[p[0]] + ' and ' + G1.W[p[1]] + ' make ' + G1.W[t] + '.' }); }); });
      return { type: 'sort', title: 'Sort the dominoes', bins: [4, 5, 6].map(function (t) { return { key: 't' + t, label: 'Makes ' + t }; }), items: items,
        say: 'Count all the dots on each domino. Put it in the box for four, five, or six.', end: 'Look! Four, five and six each have many names.', hint: function () { return 'Count all the dots on the domino. How many in all?'; } }; }; },
    pennies: function () { return function () { return { type: 'catch', n: R(4, 6), theme: 'pennies' }; }; }
  };
  CONTENT.islands.H3 = {
    id: 'H3', course: 'harbor', name: 'Fish Market',
    bju: 'BJU Press Math 1 (5th ed.), Chapter 3: Addition Facts to 6 — lessons 14–21',
    keeper: { name: 'Señora Marisol', art: 'marisol', voice: 'keeperF',
      greet: [{ t: '¡Bienvenidos al mercado!', lang: 'es' }, 'Welcome to the market! I am Señora Marisol. I sell fish, and I add them up all day long. Adding helps me take care of my neighbors!'],
      greetText: '<b>¡Bienvenidos al mercado!</b> <i>Welcome to the market!</i> I am Señora Marisol. I sell fish, and I add them up all day long. Adding helps me take care of my neighbors!' },
    warmup: ['num20', 'evenOdd20', 'after20', 'names10'],
    generators: G3,
    skillNames: G1.NAMES,
    missions: [
      { id: 'H3-x1', icon: 'duck', title: 'Toy Pond', shells: 15, text: 'Get 6 toys. Put some on a blue towel "pond." Add more. Say the addition sentence out loud, like "3 plus 2 equals 5." Do it 3 times!' },
      { id: 'H3-x2', icon: 'shellcoin', title: 'Market Stand', shells: 20, text: 'Set up a pretend market with a parent. Each thing costs 1, 2, or 3 pennies. Buy two things and add up the pennies.' },
      { id: 'H3-x3', icon: 'star', title: 'Domino Hunt', shells: 15, text: 'Find dominoes (or draw some). Find all the dominoes that make 5. How many did you find?' },
      { id: 'H3-x4', icon: 'heart', title: 'Share a Snack', shells: 20, text: 'Help make a snack plate to share with your family. Count how many crackers and how many apple slices. Add them up! Who will you share with?' },
      { id: 'H3-x5', icon: 'book', title: 'Draw a Story', shells: 20, text: 'Draw a picture of fish in a basket, then more fish. Write the addition sentence under it. Tell your story to a parent!' }
    ],
    verse: { ref: 'Hebrews 13:16', version: 'ESV', text: 'Do not neglect to do good and to share what you have, for such sacrifices are pleasing to God.' },
    story: {
      title: 'The Boy Who Shared', ref: 'John 6:9 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. A huge crowd came to hear Jesus. It was getting late, and the people were hungry. There was no food to buy.' },
        { say: 'Jesus\' helper Andrew found a boy with a small lunch. Listen to what Andrew said.', quote: '"There is a boy here who has five barley loaves and two fish, but what are they for so many?"' },
        { say: 'The boy shared his lunch. Jesus gave thanks, and God made it enough for more than five thousand people! When we share what we have, God can use it to care for many.' }
      ],
      question: { prompt: 'What did the boy share with Jesus?', choices: ['5 loaves and 2 fish', '10 apples', 'A big cake'], answer: '5 loaves and 2 fish',
        right: 'Yes! Five loaves and two fish, and Jesus fed the whole crowd!', after: 'Now let\'s go help Señora Marisol!', wrong: 'Listen again: five barley loaves and two fish.' }
    },
    quests: [
      { id: 'H3-1', num: 1, lesson: 14, title: 'Plus and Equals', kind: 'lesson', video: ['signs', 'addZero'],
        mastered: ['Know the plus and equals signs', 'Add by putting groups together', 'Add zero'], pre: ['signs', 'add6z', 'sentence5'],
        objectives: ['Identify plus and equals signs', 'Model addition word problems by joining sets', 'Apply the Zero Principle of Addition', 'Write an addition sentence for a word problem', 'Recall that adding helps people care for others (BWS)'],
        slides: [
          { say: '¡Hola! Welcome to my fish market. Every day I count my fish and add them up.', visual: function () { return Art.keeper('marisol', 120); } },
          { say: 'Two white ducks are swimming. Three brown ducks join them. Put them together: five ducks in all!', visual: function () { return '<div class="g1row">' + Models.row(2, 'duck', '#ffffff', 0, 120) + '<span class="g1op">+</span>' + Models.row(3, 'duck', '#b07a4a', 0, 170) + '</div>'; } },
          { say: 'This is the plus sign. Plus means put together. This is the equals sign. Equals means is the same as.', visual: function () { return B('+') + B('=') ; } },
          { say: 'We write it as an addition sentence: two plus three equals five.', visual: function () { return B('2 + 3 = 5'); } },
          { say: 'Four ducks, and zero more ducks come. Still four! Adding zero does not change the number.', visual: function () { return Models.row(4, 'duck', '#ffffff', 0, 220) + B('4 + 0 = 4'); } },
          { say: 'Adding helps us care for others. I add up the fish so every family gets enough to eat.', visual: function () { return Art.icon('fish', 70, '#3b8fd9') + Art.icon('basket', 70) + '<span style="font-size:3rem">❤️</span>'; } }
        ],
        play: [A.join(6), AH3.sentence(5), AH3.sentenceZ()],
        practice: ['signs', 'add6z', 'sentence5'],
        today: ['signs', 'add6z', 'sentence5', 'add4', 'signs', 'add6z'], review: ['num20', 'evenOdd20'],
        explain: { q: 'How does adding help people care for others?', options: ['It helps make sure everyone has enough.', 'It helps us keep everything for ourselves.', 'It makes the food disappear.'], answer: 0 },
        worldview: 'God made us to care for others. Adding helps us share fairly.' },
      { id: 'H3-2', num: 2, lesson: 15, title: 'Write Addition Sentences', kind: 'lesson', video: ['signs'],
        mastered: ['Write an addition sentence for a picture', 'Tell an addition story'], pre: ['sentence', 'add6', 'story'],
        objectives: ['Write an addition sentence for sets of objects', 'Model addition word problems by joining sets', 'Compose a word problem by using objects'],
        slides: [
          { say: 'Look at my fish. Three blue fish and one yellow fish.', visual: function () { return '<div class="g1row">' + Models.row(3, 'fish', '#3b8fd9', 0, 170) + '<span class="g1op">+</span>' + Models.row(1, 'fish', '#ffd23f', 0, 60) + '</div>'; } },
          { say: 'The first group is three. The second group is one. Three plus one equals four.', visual: function () { return B('3 + 1 = 4'); } },
          { say: 'You can make up an addition story too! Two boats were at the dock. Two more came in. Two plus two equals four.', visual: function () { return '<div class="g1row">' + Models.row(2, 'boat', '#e5533d', 0, 120) + '<span class="g1op">+</span>' + Models.row(2, 'boat', '#3b8fd9', 0, 120) + '</div>' + B('2 + 2 = 4'); } }
        ],
        play: [AH3.sentence(6), A.join(6), AH3.sentence(6)],
        practice: ['sentence', 'add6', 'story'],
        today: ['sentence', 'add6', 'story', 'sentence', 'add6z', 'story'], review: ['signs', 'dozen'],
        explain: { q: 'In 3 + 1 = 4, what does the 4 tell you?', options: ['How many there are in all.', 'How many are in the first group.', 'How many fish swam away.'], answer: 0 },
        worldview: 'God sees every person, one plus one plus one. Each one matters to Him.' },
      { id: 'H3-3', num: 3, lesson: 16, title: 'Draw Pictures to Add', kind: 'lesson', video: ['addStory'],
        mastered: ['Solve a story problem by drawing', 'Write the addition sentence for a story'], pre: ['story', 'storyZ', 'sentence'],
        objectives: ['Write an addition sentence for a word problem', 'Compose a word problem by using pictures', 'Solve a word problem by drawing pictures'],
        slides: [
          { say: 'Listen to my story. Pete brought me three fish. Then he brought two more. How many fish?', visual: function () { return Art.keeper('pete', 100); } },
          { say: 'Draw a picture! Three fish, and two more fish.', visual: function () { return '<div class="g1row">' + Models.row(3, 'fish', '#3b8fd9', 0, 170) + '<span class="g1op">+</span>' + Models.row(2, 'fish', '#3b8fd9', 0, 120) + '</div>'; } },
          { say: 'Count them all: five. Three plus two equals five fish.', visual: function () { return B('3 + 2 = 5'); } },
          { say: 'You do not have to draw fancy fish. Circles work great! Draw, count, and write the sentence.', visual: function () { return Models.dots(5, 80) + B('3 + 2 = 5'); } }
        ],
        play: [A.join(6), AH3.sentence(6), AH3.pennies()],
        practice: ['story', 'storyZ', 'sentence'],
        today: ['story', 'storyZ', 'sentence', 'story', 'add6', 'story'], review: ['sentence5', 'after20'],
        explain: { q: 'How can a picture help you solve a story problem?', options: ['I can draw the groups and count them all.', 'Pictures make the numbers bigger.', 'I only need to look at the first group.'], answer: 0 },
        worldview: 'Jesus told stories to teach. Stories help us understand.' },
      { id: 'H3-4', num: 4, lesson: 17, title: 'Adding Up and Down', kind: 'lesson', video: ['addVert'],
        mastered: ['Add up and down (vertical form)', 'Add with dot patterns and pennies'], pre: ['vertical', 'vertical', 'add6'],
        objectives: ['Complete an addition problem in vertical form', 'Add by using dot patterns 1–6', 'Add pennies to 6 cents'],
        slides: [
          { say: 'We can write addition across, like two plus three equals five.', visual: function () { return B('2 + 3 = 5'); } },
          { say: 'We can also write it up and down. The two is on top. Plus three is under it. The answer goes under the line.', visual: function () { return Models.vertical(2, 3); } },
          { say: 'A domino helps. Two dots on top, three dots on the bottom. Five dots in all!', visual: function () { return Models.vertical(2, 3, 5) + Models.domino(2, 3, 140); } },
          { say: 'Pennies work too. Four pennies plus two pennies is six cents.', visual: function () { return '<div>' + [1, 2, 3, 4].map(function () { return Models.coin('penny', 40); }).join('') + '<br>' + [1, 2].map(function () { return Models.coin('penny', 40); }).join('') + '</div>' + Models.vertical(4, 2, 6); } }
        ],
        play: [AH3.pennies(), AH3.sentence(6), AH3.dominoes()],
        practice: ['vertical', 'vertical', 'add6'],
        today: ['vertical', 'add6', 'vertical', 'sentence', 'vertical', 'story'], review: ['signs', 'ordinal10'],
        explain: { q: 'When you add up and down, where does the answer go?', options: ['Under the line.', 'At the very top.', 'Next to the plus sign.'], answer: 0 },
        worldview: 'Little by little, coins add up. God blesses faithful work.' },
      { id: 'H3-5', num: 5, lesson: 18, title: 'Names for 4, 5 and 6', kind: 'lesson', video: ['addNames'],
        mastered: ['Find many names for 4, 5, and 6', 'Join sets to add'], pre: ['names456', 'names456', 'add6'],
        objectives: ['Apply the Order Principle of Addition', 'Join sets to add 4, 5, and 6'],
        slides: [
          { say: 'A number can have many names. Here are five fish. Four plus one is five.', visual: function () { return '<div class="g1row">' + Models.row(4, 'fish', '#3b8fd9', 0, 200) + '<span class="g1op">+</span>' + Models.row(1, 'fish', '#36b37e', 0, 60) + '</div>' + B('4 + 1 = 5'); } },
          { say: 'Three plus two is five too. And five plus zero is five!', visual: function () { return B('3 + 2 = 5') + B('5 + 0 = 5'); } },
          { say: 'Six has names too: three plus three, four plus two, five plus one.', visual: function () { return Models.domino(3, 3, 100) + Models.domino(4, 2, 100) + Models.domino(5, 1, 100); } }
        ],
        play: [AH3.dominoes(), A.join(6), AH3.sentence(6)],
        practice: ['names456', 'names456', 'add6'],
        today: ['names456', 'add6', 'names456', 'vertical', 'names456', 'sentence'], review: ['story', 'barGraph'],
        explain: { q: 'Why are 3 + 2 and 4 + 1 both names for 5?', options: ['They both add up to five.', 'They both use the number three.', 'They both have a big number.'], answer: 0 },
        worldview: 'God has many names in the Bible: Shepherd, Father, King. Each one tells us who He is.' },
      { id: 'H3-6', num: 6, lesson: 19, title: 'Turn-Around Facts', kind: 'lesson', video: ['turnAround'],
        mastered: ['Use turn-around facts', 'Solve addition problems with strategies'], pre: ['turn', 'turn', 'story'],
        objectives: ['Apply the Order Principle of Addition', 'Solve addition problems by using strategies', 'Represent a word problem', 'Explain how addition helps people care for others (BWS)'],
        slides: [
          { say: 'Here is a domino with two dots and three dots. Two plus three is five.', visual: function () { return Models.domino(2, 3, 120, true) + B('2 + 3 = 5'); } },
          { say: 'Turn it around! Three dots and two dots. Three plus two is still five.', visual: function () { return Models.domino(3, 2, 120, true) + B('3 + 2 = 5'); } },
          { say: 'Changing the order does not change the answer. If you know one fact, you know its turn-around fact too!', visual: function () { return B('2 + 3 = 3 + 2'); } },
          { say: 'When I add fish for my neighbors, I can add in any order. Adding helps me make sure every family gets enough.', visual: function () { return Art.keeper('marisol', 110); } }
        ],
        play: [AH3.turn(), AH3.turn(), A.join(6)],
        practice: ['turn', 'turn', 'story'],
        today: ['turn', 'names456', 'turn', 'story', 'turn', 'vertical'], review: ['sentence', 'num20'],
        explain: { q: 'How does adding help people care for others?', options: ['It helps us share so everyone has enough.', 'It helps us take more than others.', 'It is only for math books.'], answer: 0 },
        worldview: 'Share what you have. Such sacrifices please God (Hebrews 13:16).' },
      { id: 'H3-7', num: 7, lesson: 20, title: 'Market Review', kind: 'review', play: [AH3.sentence(6), AH3.dominoes(), AH3.turn()],
        mastered: ['Remember everything from the Fish Market', 'Build the memory verse, Hebrews 13:16'],
        objectives: ['Recall concepts and terms from Chapter 3'],
        mix: ['signs', 'add6z', 'sentence', 'story', 'storyZ', 'vertical', 'names456', 'turn', 'add6', 'sentence5'],
        worldview: 'Doing good and sharing pleases God.' },
      { id: 'H3-8', num: 8, lesson: 21, title: 'Chapter Challenge', kind: 'boss', mastered: ['Show what you know about addition facts to 6', 'Earn a new piece for your boat!'],
        objectives: ['Demonstrate knowledge of Chapter 3 (chapter test)'],
        mix: ['signs', 'add6z', 'add6', 'sentence', 'sentence5', 'story', 'storyZ', 'vertical', 'names456', 'turn', 'add4'],
        worldview: 'Well done! Like the boy with five loaves and two fish, share what you have, and God will use it.' }
    ]
  };

  /* ranks and boat parts come from how many harbor districts are finished */
  CONTENT.courses.harbor.finished = function (p) { return CONTENT.courses.harbor.districts.filter(function (d) { return p.progress[d.id] && p.progress[d.id].lit; }).length; };
  CONTENT.courses.harbor.rank = function (p) {
    var n = CONTENT.courses.harbor.finished(p), r = 0;
    CONTENT.courses.harbor.rankAt.forEach(function (need, i) { if (n >= need) r = i; });
    return r;
  };
})();
