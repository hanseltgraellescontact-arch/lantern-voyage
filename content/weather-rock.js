/* Weather Rock — Prelude unit P16: Metric Measurement.
   Matches BJU Press Math 2, 5th edition, Chapter 16, lessons 146–155 (Lesson Plan Overview).
   Keeper: Doña Luz, the weather watcher. Every problem is generated fresh at three levels; each carries its own
   hints, "How do you know?" reasons (why) and a step-by-step walkthrough (walk). */
(function () {
  var R = U.rand, P = U.pick, T = Models.THINGS;
  function txt(t, err, say) { return { html: '<span style="font-size:1.2rem">' + t + '</span>', value: t, err: err, say: say || t }; }
  function walk(prob, tip, tip2) {
    var s = [{ say: tip, show: prob.visual || '' }];
    if (tip2) s.push({ say: tip2, show: prob.visual || '' });
    s.push({ say: 'Now you try it.', show: prob.visual || '', ask: prob.type === 'number' ? { type: 'number', answer: prob.answer } : { type: 'choice', options: prob.choices, answer: prob.answer }, final: true });
    return s;
  }
  function done(prob, tip, tip2) { prob.walk = walk(prob, tip, tip2); return prob; }
  function name(k) { return T[k][1]; }
  function bare(k) { return T[k][1].replace(/^(a|an) /, ''); }
  function thingCard(k, size) { return '<div class="center">' + Models.thing(k, size || 80) + '<b>' + bare(k) + '</b></div>'; }

  var G = {};
  /* 146 — Celsius temperature */
  G.thermoRead = function (level) {
    var c = level === 1 ? P([0, 10, 20, 30, 40]) : R(0, 8) * 5;
    return done({ skill: 'thermoRead', type: 'number', answer: c, data: { c: c }, prompt: 'What temperature does the thermometer show? (degrees Celsius)', say: 'What temperature does the thermometer show, in degrees Celsius?',
      visual: Models.thermometer(c, 260), hints: ['Find the top of the red line.', 'Each long line is 10 more. The short line in between is 5.', 'It shows ' + c + '°C.'], explain: 'The red line stops at ' + c + ', so it is ' + c + ' degrees Celsius.' },
      'Find where the red line stops.', 'Read the number there. Long lines count by tens. A short line between them is five more.');
  };
  var ACTS = [[30, '🏖️ Swim at the beach', 'swim at the beach'], [20, '🧺 Have a picnic', 'have a picnic'], [10, '🧥 Wear a jacket', 'wear a jacket'], [0, '⛄ Build a snowman', 'build a snowman']];
  G.thermoActivity = function (level) {
    var a = P(ACTS), others = U.shuffle(ACTS.filter(function (x) { return x !== a; })).slice(0, level === 1 ? 1 : 2), opts = U.shuffle([a].concat(others));
    var feel = { 30: 'It is hot.', 20: 'It is warm.', 10: 'It is cool.', 0: 'It is freezing cold.' }[a[0]];
    return done({ skill: 'thermoActivity', type: 'choice', data: { c: a[0] }, prompt: 'The thermometer shows ' + a[0] + '°C. What would be a good thing to do outside?', say: 'The thermometer shows ' + a[0] + ' degrees Celsius. What would be a good thing to do outside?',
      visual: Models.thermometer(a[0], 240), choices: opts.map(function (o) { return txt(o[1], o === a ? null : 'temperature', o[2]); }), answer: a[1],
      hints: ['0°C is freezing: water turns to ice. 30°C is hot.', feel, 'A good thing to do is ' + a[2] + '.'], explain: a[0] + '°C: ' + feel + ' A good choice is to ' + a[2] + '.',
      why: [{ 30: 'At 30°C it is hot, good for swimming.', 20: 'At 20°C it is warm, nice for a picnic.', 10: 'At 10°C it is cool, so I need a jacket.', 0: 'At 0°C water freezes, so it can snow.' }[a[0]], 'The bigger the number, the colder it is.', 'Anything is fine to do in any weather.'] },
      'Zero degrees Celsius is freezing. Thirty degrees is hot.', feel);
  };
  G.tempChange = function (level) {
    var warmer = Math.random() < 0.5, c = warmer ? R(0, 6) * 5 : R(2, 8) * 5, by = level === 3 ? P([5, 10, 10]) : 10, ans = warmer ? c + by : c - by;
    return done({ skill: 'tempChange', type: 'number', answer: ans, data: { c: c, warmer: warmer, by: by }, prompt: 'It is ' + c + '°C. It gets ' + by + ' degrees ' + (warmer ? 'WARMER' : 'COLDER') + '. What is the temperature now?', say: 'It is ' + c + ' degrees. It gets ' + by + ' degrees ' + (warmer ? 'warmer' : 'colder') + '. What is the temperature now?',
      visual: Models.thermometer(c, 240), hints: [warmer ? 'Warmer means the red line goes UP.' : 'Colder means the red line goes DOWN.', (warmer ? c + ' + ' : c + ' − ') + by + ' = ?', 'It is now ' + ans + '°C.'], explain: (warmer ? c + ' + ' + by : c + ' − ' + by) + ' = ' + ans + '. It is now ' + ans + '°C.' },
      warmer ? 'Warmer means the red line goes up. Count up ' + by + ' from ' + c + '.' : 'Colder means the red line goes down. Count down ' + by + ' from ' + c + '.', (warmer ? c + ' plus ' : c + ' minus ') + by + '.');
  };
  /* 147 — grams, kilograms, liters */
  var HEAVY = ['watermelon', 'bike', 'dog', 'pumpkin', 'suitcase', 'cat'], LIGHT = ['paperclip', 'feather', 'grape', 'pencil', 'crayon', 'key', 'coin', 'button'];
  G.massUnit = function (level) {
    var heavy = Math.random() < 0.5, k = P(heavy ? HEAVY : LIGHT), ans = heavy ? 'kilograms' : 'grams';
    return done({ skill: 'massUnit', type: 'choice', data: { k: k, heavy: heavy }, prompt: 'Would you weigh ' + name(k) + ' in GRAMS or KILOGRAMS?', say: 'Would you weigh ' + name(k) + ' in grams or kilograms?', visual: thingCard(k, 100),
      choices: [txt('grams', heavy ? 'mass-unit' : null), txt('kilograms', heavy ? null : 'mass-unit')], answer: ans,
      hints: ['A gram is very light, like a paper clip.', 'A kilogram is heavier, like a big book or a pineapple.', 'Use ' + ans + '.'], explain: heavy ? 'It is heavy, so we use kilograms.' : 'It is light, so we use grams.',
      why: heavy ? ['It is heavy, so I use kilograms.', 'Grams are for the heaviest things.', 'Its color tells me the unit.'] : ['It is very light, so I use grams.', 'Small things are measured in meters.', 'Its color tells me the unit.'] },
      'A paper clip weighs about one gram. Light things are measured in grams.', 'Heavy things, like a dog or a bike, are measured in kilograms.');
  };
  G.kgCompare = function (level) {
    var heavy = Math.random() < 0.5, k = P(heavy ? HEAVY : ['paperclip', 'feather', 'grape', 'pencil', 'crayon', 'key', 'apple', 'banana', 'spoon']), ans = heavy ? 'More than 1 kilogram' : 'Less than 1 kilogram';
    return done({ skill: 'kgCompare', type: 'choice', data: { k: k }, prompt: 'Is the mass of ' + name(k) + ' MORE or LESS than 1 kilogram?', say: 'Is the mass of ' + name(k) + ' more or less than one kilogram?', visual: thingCard(k, 100),
      choices: [txt('More than 1 kilogram', heavy ? null : 'mass', 'more than one kilogram'), txt('Less than 1 kilogram', heavy ? 'mass' : null, 'less than one kilogram')], answer: ans,
      hints: ['One kilogram is about as heavy as a big book or a pineapple.', 'Is ' + name(k) + ' heavier or lighter than that?', ans + '.'], explain: heavy ? 'It is heavier than a big book, so it is more than 1 kilogram.' : 'It is lighter than a big book, so it is less than 1 kilogram.',
      why: heavy ? ['It is heavier than a big book.', 'It is lighter than a big book.', 'Everything is 1 kilogram.'] : ['It is lighter than a big book.', 'It is heavier than a big book.', 'Everything is 1 kilogram.'] },
      'One kilogram is about as heavy as a big book or a pineapple.', 'Think: would ' + name(k) + ' be heavier or lighter than that?');
  };
  var BIG = ['bucket', 'bathtub', 'pool'], SMALL = ['spoon', 'cup', 'bottle'];
  G.literCompare = function (level) {
    var more = Math.random() < 0.5, k = P(more ? BIG : SMALL), ans = more ? 'More than 1 liter' : 'Less than 1 liter';
    return done({ skill: 'literCompare', type: 'choice', data: { k: k }, prompt: 'Does ' + name(k) + ' hold MORE or LESS than 1 liter?', say: 'Does ' + name(k) + ' hold more or less than one liter?', visual: '<div class="g1row">' + thingCard(k, 90) + '<div class="center"><span class="mthing" style="font-size:70px">🧃</span><b>1 liter</b></div></div>',
      choices: [txt('More than 1 liter', more ? null : 'capacity', 'more than one liter'), txt('Less than 1 liter', more ? 'capacity' : null, 'less than one liter')], answer: ans,
      hints: ['A liter is about one big bottle of juice.', 'Could ' + name(k) + ' hold more water than that?', ans + '.'], explain: more ? 'It holds more water than one big bottle, so more than 1 liter.' : 'It holds less water than one big bottle, so less than 1 liter.',
      why: more ? ['It holds more than one big bottle.', 'It holds less than one big bottle.', 'All things hold just 1 liter.'] : ['It holds less than one big bottle.', 'It holds more than one big bottle.', 'All things hold just 1 liter.'] },
      'A liter is about as much as one big bottle of juice.', 'Would ' + name(k) + ' hold more water than that, or less?');
  };
  var PAIRS = [['pumpkin', 'feather'], ['book', 'paperclip'], ['watermelon', 'grape'], ['apple', 'coin'], ['hammer', 'feather'], ['rock', 'button'], ['shoe', 'key']];
  G.balanceRead = function (level) {
    var pr = P(PAIRS), heavyLeft = Math.random() < 0.5, L = heavyLeft ? pr[0] : pr[1], Rt = heavyLeft ? pr[1] : pr[0];
    var opts = U.shuffle([pr[0], pr[1]]);
    return done({ skill: 'balanceRead', type: 'choice', big: true, data: { pr: pr, heavyLeft: heavyLeft }, prompt: 'Look at the balance scale. Which one is HEAVIER?', say: 'Look at the balance scale. Which one is heavier?',
      visual: Models.balance(Models.THINGS[L][0], Models.THINGS[Rt][0], heavyLeft ? -1 : 1, 300),
      choices: opts.map(function (k) { return { html: Models.thing(k, 70), value: k, err: k === pr[0] ? null : 'balance', say: bare(k) }; }), answer: pr[0],
      hints: ['The heavier side goes DOWN.', 'Which side of the scale is lower?', 'The ' + bare(pr[0]) + ' side is down, so it is heavier.'], explain: 'The side with the ' + bare(pr[0]) + ' went down, so the ' + bare(pr[0]) + ' is heavier.',
      why: ['The heavier side goes down.', 'The heavier side goes up high.', 'The bigger picture is heavier.'] },
      'A balance scale is like a seesaw. The heavier side goes down.', 'Find the side that is lower.');
  };
  /* 148–149 — centimeters and meters */
  var SHORT = ['pencil', 'crayon', 'key', 'book', 'shoe', 'ant', 'banana', 'eraser', 'spoon'], LONG = ['door', 'tree', 'bus', 'house', 'whale', 'car'];
  G.lengthUnit = function (level) {
    var long = Math.random() < 0.5, k = P(long ? LONG : SHORT), ans = long ? 'meters' : 'centimeters';
    return done({ skill: 'lengthUnit', type: 'choice', data: { k: k }, prompt: 'Would you measure ' + name(k) + ' in CENTIMETERS or METERS?', say: 'Would you measure ' + name(k) + ' in centimeters or meters?', visual: thingCard(k, 100),
      choices: [txt('centimeters', long ? 'length-unit' : null), txt('meters', long ? null : 'length-unit')], answer: ans,
      hints: ['A centimeter is about as wide as your little finger.', 'A meter is about as long as a big step, or from the floor to a doorknob.', 'Use ' + ans + '.'], explain: long ? 'It is long, so we measure it in meters.' : 'It is small, so we measure it in centimeters.',
      why: long ? ['It is long, so I use meters.', 'It is small, so I use meters.', 'I always use centimeters.'] : ['It is small, so I use centimeters.', 'It is long, so I use centimeters.', 'I always use meters for it.'] },
      'A centimeter is tiny, about as wide as your little finger.', 'A meter is long, about one big step. Small things use centimeters. Long things use meters.');
  };
  G.measureCm = function (level) {
    var n = R(2, level === 1 ? 9 : 14);
    return done({ skill: 'measureCm', type: 'number', answer: n, data: { n: n }, prompt: 'How long is the red line, in centimeters?', say: 'How long is the red line, in centimeters?', visual: Models.cmRuler([[n, '#e5533d']], { dash: true }),
      hints: ['The line starts at 0 on the ruler.', 'Follow the dashed line down to the ruler.', 'It ends at ' + n + '. It is ' + n + ' centimeters long.'], explain: 'The line goes from 0 to ' + n + ', so it is ' + n + ' centimeters long.' },
      'The line starts at zero.', 'Read the number where the line stops.');
  };
  var TOOLS = [['Thermometer', 'how hot or cold it is outside'], ['Balance scale', 'which fruit is heavier'], ['Ruler', 'how long a crayon is'], ['Meter tape', 'how long the classroom is'], ['Liter jar', 'how much water a pot holds']];
  G.toolChoose = function (level) {
    var t = P(TOOLS), opts = U.shuffle([t].concat(U.shuffle(TOOLS.filter(function (x) { return x !== t; })).slice(0, 2)));
    var tip = { Thermometer: 'A thermometer measures temperature.', 'Balance scale': 'A balance scale compares mass.', Ruler: 'A ruler measures short lengths.', 'Meter tape': 'A meter tape measures long lengths.', 'Liter jar': 'A liter jar measures capacity.' };
    return done({ skill: 'toolChoose', type: 'choice', data: { t: t[0] }, prompt: 'Which tool would you use to find ' + t[1].toUpperCase() + '?', say: 'Which tool would you use to find ' + t[1] + '?', visual: '',
      choices: opts.map(function (o) { return txt(o[0], o === t ? null : 'tool'); }), answer: t[0],
      hints: ['Temperature: thermometer. Mass: balance. Length: ruler or meter tape. Capacity: liter jar.', tip[t[0]], 'Use the ' + t[0].toLowerCase() + '.'], explain: tip[t[0]],
      why: [tip[t[0]], 'Any tool can measure anything.', 'The biggest tool is the best one.'] },
      'Think: are we measuring how hot, how heavy, how long, or how much it holds?', tip[t[0]]);
  };
  G.estimateCm = function (level) {
    var n = R(3, 12), far = n + P([-1, 1]) * R(4, 6); if (far < 1 || far > 18) far = n + 5;
    var opts = U.shuffle([n, far]);
    return done({ skill: 'estimateCm', type: 'choice', data: { n: n, far: far }, prompt: 'The yellow square is 1 centimeter. ESTIMATE: about how long is the blue line?', say: 'The yellow square is one centimeter. Estimate. About how long is the blue line?', visual: Models.cmEstimate(n),
      choices: opts.map(function (x) { return txt('about ' + x + ' cm', x === n ? null : 'estimate', 'about ' + x + ' centimeters'); }), answer: 'about ' + n + ' cm',
      hints: ['Imagine laying yellow squares along the line.', 'How many squares would fit?', 'About ' + n + ' squares fit, so it is about ' + n + ' centimeters.'], explain: 'About ' + n + ' one-centimeter squares fit along the line.',
      why: ['About that many squares fit along it.', 'I picked the bigger number to be safe.', 'Lines are always 10 centimeters long.'] },
      'Estimate means a smart guess. Imagine the yellow squares lined up along the line.', 'Count about how many would fit.');
  };
  G.longerBy = function (level) {
    var a = R(5, 14), b = R(2, a - 1);
    return done({ skill: 'longerBy', type: 'number', answer: a - b, data: { a: a, b: b }, prompt: 'How many centimeters LONGER is the red line than the blue line?', say: 'How many centimeters longer is the red line than the blue line?',
      visual: Models.cmRuler([[a, '#e5533d'], [b, '#3b8fd9']], { dash: true }), hints: ['Measure each line first.', 'Red is ' + a + ' cm. Blue is ' + b + ' cm.', a + ' − ' + b + ' = ' + (a - b) + '.'], explain: 'Red is ' + a + ' cm and blue is ' + b + ' cm. ' + a + ' − ' + b + ' = ' + (a - b) + ' cm longer.' },
      'Measure the red line. Then measure the blue line.', 'Subtract to find how much longer: ' + a + ' minus ' + b + '.');
  };
  /* 150 — perimeter in centimeters and meters */
  G.perimeterCm = function (level) {
    var kind = P(level === 1 ? ['triangle', 'square'] : ['triangle', 'rectangle', 'square', 'pentagon']), sides;
    if (kind === 'square') { var s = R(2, level === 1 ? 5 : 9); sides = [s, s, s, s]; }
    else if (kind === 'rectangle') { var a = R(3, 9), b = R(2, a - 1); sides = [a, b, a, b]; }
    else if (kind === 'triangle') { do { sides = [R(2, 8), R(2, 8), R(2, 8)]; } while (sides[0] + sides[1] <= sides[2] || sides[0] + sides[2] <= sides[1] || sides[1] + sides[2] <= sides[0]); }
    else sides = [R(2, 6), R(2, 6), R(2, 6), R(2, 6), R(2, 6)];
    var sum = sides.reduce(function (x, y) { return x + y; }, 0), word = level >= 2 && kind === 'rectangle' && Math.random() < 0.5, unit = word ? 'm' : P(['cm', 'm']), uw = unit === 'm' ? 'meters' : 'centimeters';
    var prompt = word ? 'A farmer builds a fence around a sheep pen. The pen is a rectangle, ' + sides[0] + ' meters long and ' + sides[1] + ' meters wide. How many meters of fence does he need?' : 'Find the PERIMETER (the distance all the way around) in ' + uw + '.';
    return done({ skill: 'perimeterCm', type: 'number', answer: sum, data: { sides: sides, kind: kind }, prompt: prompt, say: word ? prompt : 'Find the perimeter, the distance all the way around, in ' + uw + '.',
      visual: Models.perimeter(kind, sides, unit, 260), hints: ['Perimeter is the distance all the way around.', 'Add every side: ' + sides.join(' + ') + '.', sides.join(' + ') + ' = ' + sum + '.'], explain: sides.join(' + ') + ' = ' + sum + ' ' + uw + '.' },
      'Perimeter means walking all the way around the edge. Add up every side.', 'Add: ' + sides.join(' + ') + '.');
  };
  /* 151 — coordinate graph */
  var WX = [['☀️', 'sun'], ['🌧️', 'rain cloud'], ['🌈', 'rainbow'], ['⚡', 'lightning'], ['❄️', 'snowflake'], ['🌪️', 'wind']];
  G.coordRead = function (level) {
    var items = U.shuffle(WX).slice(0, 4), pts = [], used = {};
    items.forEach(function (it) { var x, y; do { x = R(1, 5); y = R(1, 5); } while (used[x + ',' + y] || used[y + ',' + x]); used[x + ',' + y] = 1; pts.push({ x: x, y: y, html: it[0], name: it[1] }); });
    var t = pts[0], v = Models.coordGrid(pts);
    if (level === 1 || Math.random() < 0.5) {
      return done({ skill: 'coordRead', type: 'choice', big: true, data: { x: t.x, y: t.y }, prompt: 'What is at (' + t.x + ', ' + t.y + ')? Go ACROSS ' + t.x + ', then UP ' + t.y + '.', say: 'What is at ' + t.x + ', ' + t.y + '? Go across ' + t.x + ', then up ' + t.y + '.',
        visual: Models.coordGrid(pts, { path: level === 1 ? [t.x, t.y] : null }), choices: U.shuffle(pts).map(function (p) { return { html: '<span style="font-size:2.4rem">' + p.html + '</span>', value: p.name, err: p === t ? null : 'coordinates', say: 'the ' + p.name }; }), answer: t.name,
        hints: ['Start at 0. Go ACROSS on the red numbers first.', 'Then go UP on the blue numbers.', 'Across ' + t.x + ', up ' + t.y + ': the ' + t.name + '.'], explain: 'Across ' + t.x + ' and up ' + t.y + ' is the ' + t.name + '.',
        why: ['I went across ' + t.x + ' first, then up ' + t.y + '.', 'I went up ' + t.x + ' first, then across.', 'I picked the one at the very top.'] },
        'Start at zero, in the corner. Walk across the bottom to ' + t.x + '.', 'Now climb up to ' + t.y + '. What is there?');
    }
    var right = '(' + t.x + ', ' + t.y + ')', opts = U.uniq([right, '(' + t.y + ', ' + t.x + ')', '(' + t.x + ', ' + (t.y % 5 + 1) + ')', '(' + (t.x % 5 + 1) + ', ' + t.y + ')']).slice(0, 3);
    return done({ skill: 'coordRead', type: 'choice', data: { x: t.x, y: t.y }, prompt: 'Which ORDERED PAIR tells where the ' + t.html + ' is?', say: 'Which ordered pair tells where the ' + t.name + ' is?', visual: v,
      choices: U.shuffle(opts).map(function (o) { return txt(o, o === right ? null : 'coordinates', o.replace(/[()]/g, '').replace(', ', ' comma ')); }), answer: right,
      hints: ['The first number is how far ACROSS.', 'The second number is how far UP.', 'Across ' + t.x + ', up ' + t.y + ': ' + right + '.'], explain: 'The ' + t.name + ' is ' + t.x + ' across and ' + t.y + ' up, so it is at ' + right + '.',
      why: ['Across comes first, then up.', 'Up comes first, then across.', 'The bigger number goes first.'] },
      'Put your finger on the ' + t.name + '. Slide straight down to the red number. That is the first number.', 'Slide back and go straight left to the blue number. That is the second number.');
  };
  /* 153–154 — coding with IF… THEN… ELSE */
  var PROGS = [
    { cond: 'it is raining', yes: 'take an umbrella', no: 'wear sunglasses', show: ['🌧️', '☀️'], state: ['It is raining.', 'It is sunny.'], who: 'Doña Luz' },
    { cond: 'it is colder than 10°C', yes: 'wear a coat', no: 'wear a T-shirt', show: ['🥶 5°C', '😎 25°C'], state: ['It is 5°C.', 'It is 25°C.'], who: 'Sam' },
    { cond: 'the light is green', yes: 'go', no: 'stop', show: ['🟢', '🔴'], state: ['The light is green.', 'The light is red.'], who: 'the robot' },
    { cond: 'the soil is dry', yes: 'water the plant', no: 'wait one day', show: ['🏜️', '💧'], state: ['The soil is dry.', 'The soil is wet.'], who: 'the gardener' },
    { cond: 'a boat is near the rocks', yes: 'shine the light', no: 'keep watching', show: ['⛵🪨', '🌊'], state: ['A boat is near the rocks.', 'The sea is empty.'], who: 'the lighthouse keeper' }
  ];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  G.ifThen = function (level) {
    var p = P(PROGS), yes = Math.random() < 0.5, ans = cap(yes ? p.yes : p.no);
    var code = '<div class="codebox"><div><b class="kw">IF</b> ' + p.cond + '</div><div class="ind"><b class="kw">THEN</b> ' + p.yes + '</div><div><b class="kw">ELSE</b> ' + p.no + '</div></div>';
    var v = '<div class="g1row">' + code + '<div class="center"><span style="font-size:3rem">' + p.show[yes ? 0 : 1] + '</span><b>' + p.state[yes ? 0 : 1] + '</b></div></div>';
    return done({ skill: 'ifThen', type: 'choice', data: { p: p.cond, yes: yes }, prompt: 'Read the program. ' + p.state[yes ? 0 : 1] + ' What does ' + p.who + ' do?', say: 'Read the program. ' + p.state[yes ? 0 : 1] + ' What does ' + p.who + ' do?', visual: v,
      choices: U.shuffle([cap(p.yes), cap(p.no)]).map(function (o) { return txt(o, o === ans ? null : 'conditional'); }), answer: ans,
      hints: ['Ask: is the IF part true right now?', yes ? 'Yes, ' + p.cond + '. So do the THEN part.' : 'No, it is not true that ' + p.cond + '. So do the ELSE part.', ans + '.'], explain: (yes ? 'The IF part is true, so the THEN part runs: ' : 'The IF part is false, so the ELSE part runs: ') + p[yes ? 'yes' : 'no'] + '.',
      why: yes ? ['The IF part is true, so do THEN.', 'The IF part is false, so do ELSE.', 'Programs always do the last line.'] : ['The IF part is false, so do ELSE.', 'The IF part is true, so do THEN.', 'Programs always do the first line.'] },
      'A program with IF checks something first. Is the IF part true right now?', 'If it is true, do the THEN line. If it is not true, do the ELSE line.');
  };

  function codeHtml(p, swap) { return '<div class="codebox"><div><b class="kw">IF</b> ' + p.cond + '</div><div class="ind"><b class="kw">THEN</b> ' + (swap ? p.no : p.yes) + '</div><div><b class="kw">ELSE</b> ' + (swap ? p.yes : p.no) + '</div></div>'; }
  var GOALS = { 'it is raining': 'stay dry in the rain', 'it is colder than 10°C': 'stay warm on a cold day', 'the light is green': 'cross the street safely', 'the soil is dry': 'take good care of the plant', 'a boat is near the rocks': 'keep the boats safe' };
  G.debugCode = function (level) {
    var p = P(PROGS), kind = level === 1 ? 'pick' : P(['pick', 'bug']);
    if (kind === 'pick') {
      var opts = U.shuffle([{ html: codeHtml(p, false), value: 'right', err: null, say: 'IF ' + p.cond + ', THEN ' + p.yes + ', ELSE ' + p.no }, { html: codeHtml(p, true), value: 'buggy', err: 'conditional', say: 'IF ' + p.cond + ', THEN ' + p.no + ', ELSE ' + p.yes }]);
      return done({ skill: 'debugCode', type: 'choice', big: true, data: { p: p.cond, kind: kind }, prompt: 'Which program helps ' + p.who + ' ' + GOALS[p.cond] + '?', say: 'Which program helps ' + p.who + ' ' + GOALS[p.cond] + '?', visual: '',
        choices: opts, answer: 'right', hints: ['Read each program. Pretend the IF part is true.', 'IF ' + p.cond + ', what should happen?', 'The right program says THEN ' + p.yes + '.'], explain: 'IF ' + p.cond + ', THEN ' + p.yes + '. That is the program that works.',
        why: ['Its THEN line does the right thing.', 'It is the longer of the two programs.', 'Both of the programs do the same thing.'] },
        'Pretend the IF part is true. Which program does the right thing?', 'IF ' + p.cond + ', we should ' + p.yes + '.');
    }
    var fix = 'Switch the THEN and ELSE lines', opts2 = [fix, 'Take away the IF line', 'Nothing is wrong'];
    return done({ skill: 'debugCode', type: 'choice', data: { p: p.cond, kind: kind }, prompt: 'This program has a BUG (a mistake). How do we fix it so ' + p.who + ' can ' + GOALS[p.cond] + '?', say: 'This program has a bug, a mistake. How do we fix it so ' + p.who + ' can ' + GOALS[p.cond] + '?',
      visual: codeHtml(p, true), choices: U.shuffle(opts2).map(function (o) { return txt(o, o === fix ? null : 'conditional'); }), answer: fix,
      hints: ['Pretend the IF part is true. Does the THEN line make sense?', 'IF ' + p.cond + ', we should ' + p.yes + ', not ' + p.no + '.', 'The THEN and ELSE lines are switched.'], explain: 'The THEN and ELSE lines were switched. Switch them back: IF ' + p.cond + ', THEN ' + p.yes + '.',
      why: ['The THEN and ELSE lines are mixed up.', 'Programs never need an IF line.', 'Bugs fix themselves after a while.'] },
      'Read the program. Pretend the IF part is true. Does the THEN line make sense?', 'IF ' + p.cond + ', we should ' + p.yes + '. The lines are switched!');
  };

  /* spiral review from Kite Cove, Slice Isle and earlier chapters (reuse those generators) */
  var S = CONTENT.islands.P15.generators;
  ['perimeter', 'planeName', 'solidName', 'lineKind', 'symmetry', 'patternNext', 'mulFact', 'add2', 'sub2', 'clockTime', 'shadedFraction'].forEach(function (k) { G[k] = S[k]; });

  /* "Show me how" guides for Weather Rock (videos only from the family's approved channels) */
  var MEAS = { label: 'Measuring! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=2wUsdsae0ro' };
  var GU = {
    metTemp: { title: 'Celsius temperature', steps: [
      ['A thermometer measures temperature. Read the number where the red line stops.', function () { return Models.thermometer(25, 200); }],
      ['Long lines count by tens. A short line in the middle is 5 more. This one shows 25°C.', function () { return '<span class="g1num">25°C</span>'; }],
      ['0°C is freezing. 20°C is warm. 30°C is hot!', function () { return '⛄ 0° &nbsp; 🧥 10° &nbsp; 🧺 20° &nbsp; 🏖️ 30°'; }]] },
    metMass: { title: 'Grams and kilograms', video: MEAS, steps: [
      ['MASS is how heavy something is. A paper clip is about 1 gram.', function () { return Models.thing('paperclip', 70); }],
      ['A big book or a pineapple is about 1 kilogram. Heavy things use kilograms.', function () { return Models.thing('book', 70) + Models.thing('watermelon', 70); }],
      ['On a balance scale, the heavier side goes DOWN.', function () { return Models.balance('🍉', '🪶', -1, 220); }]] },
    metLiter: { title: 'Liters', video: MEAS, steps: [
      ['CAPACITY is how much something holds. A big bottle of juice is about 1 liter.', function () { return '<span class="mthing" style="font-size:70px">🧃</span>'; }],
      ['A bucket holds MORE than 1 liter. A cup holds LESS than 1 liter.', function () { return Models.thing('bucket', 70) + Models.thing('cup', 60); }]] },
    metLength: { title: 'Centimeters and meters', video: MEAS, steps: [
      ['A centimeter is about as wide as your little finger. Small things use centimeters.', function () { return Models.cmRuler([[4, '#e5533d']], { max: 8, width: 260 }); }],
      ['A meter is about one big step. Long things use meters.', function () { return Models.thing('door', 70) + Models.thing('bus', 70); }],
      ['To measure, start at 0. To find how much longer, measure both and subtract.', function () { return Models.cmRuler([[9, '#e5533d'], [6, '#3b8fd9']], { dash: true, max: 10, width: 300 }); }]] },
    metTools: { title: 'Measuring tools', video: MEAS, steps: [
      ['Temperature: thermometer. Mass: balance scale.', function () { return '🌡️ &nbsp; ⚖️'; }],
      ['Short lengths: ruler. Long lengths: meter tape. Capacity: liter jar.', function () { return '📏 &nbsp; 🧃'; }]] },
    metPerimeter: { title: 'Perimeter', video: { label: 'Area and Perimeter Song (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=Tpy09HOkHyI' }, steps: [
      ['Perimeter is the distance all the way around a shape.', function () { return Models.perimeter('rectangle', [6, 4, 6, 4], 'm', 200); }],
      ['Add every side: 6 + 4 + 6 + 4 = 20 meters.', function () { return '<span class="g1num">20 m</span>'; }]] },
    metCoord: { title: 'Coordinate graphs', steps: [
      ['An ordered pair like (3, 2) tells where a point is. Start at 0.', function () { return Models.coordGrid([{ x: 3, y: 2, html: '☀️' }], { path: [3, 2], width: 240 }); }],
      ['Go ACROSS first (3), then UP (2). Across, then up!', function () { return '<span class="g1num">(3, 2)</span>'; }]] },
    metCode: { title: 'IF… THEN… ELSE', steps: [
      ['A program can check something first. IF it is true, it does the THEN part.', function () { return '<div class="codebox"><div><b class="kw">IF</b> it is raining</div><div class="ind"><b class="kw">THEN</b> take an umbrella</div><div><b class="kw">ELSE</b> wear sunglasses</div></div>'; }],
      ['If it is NOT true, it does the ELSE part. It is sunny, so: wear sunglasses!', function () { return '<span style="font-size:3rem">☀️😎</span>'; }]] }
  };
  Help.extend(GU, { thermoRead: 'metTemp', thermoActivity: 'metTemp', tempChange: 'metTemp', massUnit: 'metMass', kgCompare: 'metMass', balanceRead: 'metMass', literCompare: 'metLiter',
    lengthUnit: 'metLength', measureCm: 'metLength', estimateCm: 'metLength', longerBy: 'metLength', toolChoose: 'metTools', perimeterCm: 'metPerimeter', coordRead: 'metCoord', ifThen: 'metCode', debugCode: 'metCode' });

  CONTENT.islands.P16 = {
    id: 'P16', name: 'Weather Rock', sea: 'home',
    bju: 'BJU Press Math 2 (5th ed.), Chapter 16: Metric Measurement — lessons 146–155',
    keeper: { name: 'Doña Luz', art: 'luz', voice: 'keeperF',
      greet: [{ t: '¡Hola, capitán!', lang: 'es' }, { t: '¿Qué tiempo hace hoy?', lang: 'es' }, 'Hello, captain! What is the weather like today? I am Doña Luz, the weather watcher. I measure the wind, the rain, and the heat that God sends!'],
      greetText: '<b>¡Hola, capitán! ¿Qué tiempo hace hoy?</b><br><i>Hello, captain! What is the weather like today?</i> I am Doña Luz, the weather watcher. ("Luz" means light!) I measure the wind, the rain, and the heat that God sends!' },
    factSets: ['add', 'sub', 'mul'],
    missions: [
      { id: 'P16-m1', icon: 'clock', title: 'Weather Watcher', shells: 25, text: 'With a parent, read a real thermometer (or a weather app in Celsius) at the same time every day for 5 days. Write the temperatures down. Which day was warmest? Which was coldest?' },
      { id: 'P16-m2', icon: 'apple', title: 'Kitchen Scale', shells: 20, text: 'Use a kitchen scale (with a parent) to weigh 5 things in grams: an apple, a spoon, a book, a shoe, and a toy. Put them in order from lightest to heaviest.' },
      { id: 'P16-m3', icon: 'star', title: 'Liter Pour', shells: 20, text: 'Find a 1-liter bottle. Fill it with water and pour it into a pot, a cup, and a bowl. Which ones hold more than 1 liter? Which hold less?' },
      { id: 'P16-m4', icon: 'ruler', title: 'Centimeter Hunt', shells: 20, text: 'Use a centimeter ruler to measure your pencil, your hand, a fork, and a book. First estimate, then measure. How close were your guesses?' },
      { id: 'P16-m5', icon: 'chart', title: 'Treasure Map', shells: 25, text: 'Draw a grid 5 squares across and 5 squares up, and number the lines. Hide a treasure at a point like (3, 4). Can someone in your family find it from your ordered pair?' },
      { id: 'P16-m6', icon: 'heart', title: 'IF-THEN Helper', shells: 20, text: 'Write 3 IF-THEN-ELSE rules for helping at home, like "IF the dishes are dirty, THEN wash them, ELSE dry them." Act them out with your family!' }
    ],
    generators: G,
    skillNames: { thermoRead: 'Reading a thermometer', thermoActivity: 'Temperature and weather', tempChange: 'Warmer and colder', massUnit: 'Grams or kilograms', kgCompare: 'More or less than 1 kg',
      literCompare: 'More or less than 1 liter', balanceRead: 'Balance scales', lengthUnit: 'Centimeters or meters', measureCm: 'Measuring in centimeters', toolChoose: 'Measuring tools', estimateCm: 'Estimating length',
      longerBy: 'How much longer', perimeterCm: 'Perimeter (metric)', coordRead: 'Coordinate graphs', ifThen: 'IF-THEN-ELSE coding', debugCode: 'Fixing programs', perimeter: 'Perimeter', planeName: 'Naming plane figures',
      solidName: 'Naming solid figures', lineKind: 'Kinds of lines', symmetry: 'Symmetry', patternNext: 'Patterns', mulFact: 'Multiplication facts', add2: '2-digit adding', sub2: '2-digit subtracting',
      clockTime: 'Telling time', shadedFraction: 'Writing fractions' },
    verse: { ref: 'Isaiah 40:12', version: 'ESV', text: 'Who has measured the waters in the hollow of his hand and marked off the heavens with a span, enclosed the dust of the earth in a measure and weighed the mountains in scales and the hills in a balance?' },
    story: {
      title: 'Elijah and the Little Cloud', ref: '1 Kings 18:44 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. For three years, no rain had fallen in Israel. The ground was dry and dusty, and the people were thirsty.' },
        { say: 'The prophet Elijah prayed to God for rain. He sent his servant to look out at the sea. Seven times the servant looked. The seventh time, he said this.', quote: '"Behold, a little cloud like a man\'s hand is rising from the sea."' },
        { say: 'Soon the sky grew dark, and a great rain came! God rules the wind, the clouds, and the rain. When we measure the weather, we are studying the world He made and cares for.' }
      ],
      question: { prompt: 'How big was the little cloud?', choices: ['Like a man\'s hand', 'Like a mountain', 'Like a ship'], answer: 'Like a man\'s hand', right: 'Yes! A cloud like a man\'s hand, and then God sent a great rain.', after: 'Now let\'s go help Doña Luz measure!', wrong: 'Listen again: "a little cloud like a man\'s hand."' }
    },
    quests: [
      { id: 'P16-1', num: 1, lesson: 146, title: 'Celsius Temperature', kind: 'lesson', mastered: ['Read a Celsius thermometer', 'Match the temperature to the weather', 'Find 10 degrees warmer or colder'], pre: ['thermoRead', 'thermoActivity', 'tempChange'],
        objectives: ['Identify a metric unit for temperature', 'Match weather activities to Celsius temperatures', 'Read a Celsius thermometer to the 5° interval', 'Show 10° more or less than a temperature', 'Explain how measuring temperature points to a Creator'],
        slides: [
          { say: 'Welcome to Weather Rock! Every morning I climb up here to measure the weather. My first tool is a thermometer.', visual: function () { return Art.keeper('luz', 120) + Models.thermometer(20, 220); } },
          { say: 'A thermometer measures temperature: how hot or cold it is. We measure in degrees Celsius. The red line goes up when it is warm and down when it is cold.', visual: function () { return Models.thermometer(10, 200) + '<span class="g1op">→</span>' + Models.thermometer(30, 200); } },
          { say: 'Long lines count by tens: zero, ten, twenty, thirty, forty. A short line in the middle means five more. This thermometer shows twenty-five degrees.', visual: function () { return Models.thermometer(25, 240) + '<span class="g1num">25°C</span>'; } },
          { say: 'Zero degrees is freezing. Water turns to ice. Ten is cool. Twenty is warm. Thirty is hot, beach weather!', visual: function () { return '<div class="g1row" style="font-size:2.2rem">⛄ 0° &nbsp; 🧥 10° &nbsp; 🧺 20° &nbsp; 🏖️ 30°</div>'; } },
          { say: 'When it gets ten degrees warmer, the red line goes up ten. Fifteen degrees and ten warmer is twenty-five degrees.', visual: function () { return Models.thermometer(15, 200) + '<span class="g1op">+10 →</span>' + Models.thermometer(25, 200); } },
          { say: 'God made the sun to warm the earth just right. Not too hot, and not too cold. Measuring temperature shows us how carefully He planned our world!', visual: function () { return '<span style="font-size:4rem">☀️🌍</span>'; } }
        ],
        practice: ['thermoRead', 'thermoActivity', 'tempChange'],
        today: ['thermoRead', 'thermoActivity', 'tempChange', 'thermoRead'], review: ['perimeter', 'mulFact'],
        explain: { q: 'How does measuring temperature point to a Creator?', options: ['God made the earth warm just right for life.', 'The weather just happens with no plan.', 'Thermometers made the sun hot and bright.'], answer: 0 },
        worldview: 'God set the sun in the sky to warm the earth just right. His design is wise.' },
      { id: 'P16-2', num: 2, lesson: 147, title: 'Grams, Kilograms & Liters', kind: 'lesson', mastered: ['Choose grams or kilograms', 'Tell more or less than 1 kilogram', 'Tell more or less than 1 liter', 'Read a balance scale'], pre: ['massUnit', 'kgCompare', 'literCompare'],
        objectives: ['Identify metric units for capacity and mass', 'Tell if a container holds more or less than 1 liter', 'Tell if mass is more or less than 1 kilogram', 'Tell if mass is about 1 gram or more', 'Model a balance scale', 'Explain how measuring capacity points to a Creator'],
        slides: [
          { say: 'I measure the rain in my rain jar. Capacity is how much something holds. We measure it in liters. A big bottle of juice is about one liter.', visual: function () { return '<span class="mthing" style="font-size:90px">🧃</span><span class="g1num">1 liter</span>'; } },
          { say: 'A bucket holds more than one liter. A cup holds less than one liter.', visual: function () { return thingCard('bucket', 90) + thingCard('cup', 80); } },
          { say: 'Mass is how heavy something is. A paper clip is about one gram. Light things are measured in grams.', visual: function () { return thingCard('paperclip', 90) + '<span class="g1num">about 1 gram</span>'; } },
          { say: 'A big book or a pineapple is about one kilogram. Heavy things, like a watermelon or a dog, are measured in kilograms.', visual: function () { return thingCard('watermelon', 80) + thingCard('dog', 80); } },
          { say: 'A balance scale is like a seesaw. The heavier side goes down. The pumpkin is heavier than the feather.', visual: function () { return Models.balance('🎃', '🪶', -1, 280); } },
          { say: 'God holds the oceans in His hand! He knows exactly how much water the whole world holds. Measuring reminds us how great He is.', visual: function () { return '<span style="font-size:4rem">🌊🤲</span>'; } }
        ],
        practice: ['massUnit', 'kgCompare', 'literCompare', 'balanceRead'],
        today: ['massUnit', 'kgCompare', 'literCompare', 'balanceRead'], review: ['thermoRead', 'planeName', 'add2'],
        explain: { q: 'Which side of a balance scale goes down?', options: ['The side with the heavier thing.', 'The side with the lighter thing.', 'Both sides always stay the same.'], answer: 0 },
        worldview: 'God measured the waters in the hollow of His hand. He is great and He is near.' },
      { id: 'P16-3', num: 3, lesson: 148, title: 'Centimeters & Meters', kind: 'lesson', mastered: ['Choose centimeters or meters', 'Measure to the nearest centimeter', 'Choose the right measuring tool'], pre: ['lengthUnit', 'measureCm', 'toolChoose'],
        objectives: ['Identify metric units for length, height, and distance', 'Measure to the nearest centimeter or meter', 'Choose the better unit', 'Measure the distance between 2 objects', 'Choose the correct measuring tool', 'Explain how measuring length points to a Creator'],
        slides: [
          { say: 'I measure how deep the snow is with a centimeter ruler. A centimeter is tiny, about as wide as your little finger.', visual: function () { return Models.cmRuler([[5, '#e5533d']], { max: 10, width: 320 }); } },
          { say: 'A meter is one hundred centimeters. That is about one big step, or from the floor to a doorknob.', visual: function () { return thingCard('door', 100) + '<span class="g1num">about 2 meters tall</span>'; } },
          { say: 'Small things, like a crayon or a key, are measured in centimeters. Long things, like a bus or a tree, are measured in meters.', visual: function () { return thingCard('crayon', 70) + thingCard('key', 70) + '<span class="g1op">|</span>' + thingCard('bus', 80) + thingCard('tree', 80); } },
          { say: 'To measure, line up the end of the thing with zero. Read the number where it stops. This line is seven centimeters.', visual: function () { return Models.cmRuler([[7, '#e5533d']], { dash: true, max: 10, width: 340 }); } },
          { say: 'Pick the right tool! A ruler for short things, a meter tape for long things, a thermometer for temperature, and a balance scale for mass.', visual: function () { return '<span style="font-size:3rem">📏 🌡️ ⚖️</span>'; } }
        ],
        practice: ['lengthUnit', 'measureCm', 'toolChoose'],
        today: ['lengthUnit', 'measureCm', 'toolChoose', 'measureCm'], review: ['kgCompare', 'solidName', 'sub2'],
        explain: { q: 'Why would you measure a bus in meters, not centimeters?', options: ['A bus is long, and meters are for long things.', 'A bus is small, and meters are for small things.', 'Buses can only be measured in liters.'], answer: 0 },
        worldview: 'God made everything with its own size, from the tiny ant to the giant whale.' },
      { id: 'P16-4', num: 4, lesson: 149, title: 'Estimating & Measuring', kind: 'lesson', mastered: ['Estimate length in centimeters', 'Find how much longer one thing is'], pre: ['estimateCm', 'longerBy', 'measureCm'],
        objectives: ['Identify a centimeter and a meter', 'Estimate length to the nearest centimeter or meter', 'Measure to the nearest centimeter or meter', 'Choose the closer estimate', 'Draw a line of a given length (paper)', 'Find how much longer one object is', 'Choose the correct measuring tool'],
        slides: [
          { say: 'An estimate is a smart guess. This yellow square is one centimeter. About how many squares would fit along the blue line?', visual: function () { return Models.cmEstimate(6); } },
          { say: 'About six squares fit, so the line is about six centimeters. Then we can measure to check!', visual: function () { return Models.cmRuler([[6, '#3b8fd9']], { dash: true, max: 10, width: 340 }); } },
          { say: 'To find how much longer one line is, measure both lines. The red line is nine centimeters. The blue line is six centimeters.', visual: function () { return Models.cmRuler([[9, '#e5533d'], [6, '#3b8fd9']], { dash: true, max: 10, width: 340 }); } },
          { say: 'Subtract: nine minus six is three. The red line is three centimeters longer.', visual: function () { return '<span class="g1num">9 − 6 = 3 cm</span>'; } }
        ],
        practice: ['estimateCm', 'longerBy', 'measureCm'],
        today: ['estimateCm', 'longerBy', 'estimateCm', 'toolChoose'], review: ['lengthUnit', 'lineKind', 'mulFact'],
        explain: { q: 'How do you find how much longer the red line is?', options: ['Measure both lines, then subtract.', 'Add the two lengths together.', 'Count only the shorter line.'], answer: 0 },
        worldview: 'Estimating carefully and then checking helps us be honest and wise.' },
      { id: 'P16-5', num: 5, lesson: 150, title: 'Perimeter', kind: 'lesson', mastered: ['Find perimeter in centimeters and meters', 'Solve perimeter word problems'], pre: ['perimeterCm', 'perimeterCm', 'measureCm'],
        objectives: ['Find perimeter using centimeters or meters', 'Measure in centimeters to find side lengths', 'Write an addition equation for perimeter', 'Solve perimeter word problems', 'Formulate how measuring points to God\'s wisdom and power'],
        slides: [
          { say: 'My garden needs a fence all the way around. The distance all the way around is the perimeter.', visual: function () { return Models.perimeter('rectangle', [6, 4, 6, 4], 'm', 240); } },
          { say: 'Write an addition equation. Six plus four plus six plus four equals twenty. The garden needs twenty meters of fence.', visual: function () { return '<span class="g1num">6 + 4 + 6 + 4 = 20 m</span>'; } },
          { say: 'Small shapes use centimeters. Add every side: three plus four plus five is twelve centimeters.', visual: function () { return Models.perimeter('triangle', [3, 4, 5], 'cm', 200) + '<span class="g1num">12 cm</span>'; } },
          { say: 'God measured the whole earth and set its edges. Measuring shows us His wisdom and His power.', visual: function () { return '<span style="font-size:4rem">🌍📏</span>'; } }
        ],
        practice: ['perimeterCm', 'perimeterCm', 'perimeterCm'],
        today: ['perimeterCm', 'perimeterCm', 'perimeterCm', 'longerBy'], review: ['estimateCm', 'symmetry', 'clockTime'],
        explain: { q: 'How do you find the perimeter of a sheep pen?', options: ['Add the lengths of all the sides.', 'Count how many sheep are inside.', 'Measure only the longest side.'], answer: 0 },
        worldview: 'Building a good fence keeps animals safe. Caring for creation is serving God.' },
      { id: 'P16-6', num: 6, lesson: 151, title: 'Coordinate Graph', kind: 'lesson', mastered: ['Find a point on a coordinate graph', 'Write an ordered pair'], pre: ['coordRead', 'coordRead', 'coordRead'],
        objectives: ['Locate x and y coordinates on a coordinate graph', 'Write ordered pairs to name points on a coordinate graph'],
        slides: [
          { say: 'This is my weather map. It is a coordinate graph. Every place on it has two numbers, called an ordered pair.', visual: function () { return Models.coordGrid([{ x: 2, y: 4, html: '🌧️' }, { x: 4, y: 1, html: '☀️' }, { x: 1, y: 2, html: '🌈' }]); } },
          { say: 'Start at zero, in the corner. The first number tells how far to go across. The second number tells how far to go up.', visual: function () { return Models.coordGrid([{ x: 4, y: 1, html: '☀️' }], { path: [4, 1] }); } },
          { say: 'The sun is across four and up one. Its ordered pair is four, one.', visual: function () { return '<span class="g1num">☀️ (4, 1)</span>'; } },
          { say: 'The rain cloud is across two and up four. Two, four. Across first, then up!', visual: function () { return Models.coordGrid([{ x: 2, y: 4, html: '🌧️' }], { path: [2, 4] }) + '<span class="g1num">(2, 4)</span>'; } },
          { say: 'My God is so big! He sees every place on the whole earth at once, and He knows exactly where you are.', visual: function () { return '<span style="font-size:4rem">🌍❤️</span>'; } }
        ],
        practice: ['coordRead', 'coordRead', 'coordRead'],
        today: ['coordRead', 'coordRead', 'coordRead', 'coordRead'], review: ['perimeterCm', 'massUnit', 'add2'],
        explain: { q: 'In the ordered pair (4, 1), what does the 4 tell you?', options: ['How far to go across.', 'How far to go up.', 'How many suns there are.'], answer: 0 },
        worldview: 'God knows exactly where you are. You are never lost to Him.' },
      { id: 'P16-7', num: 7, lesson: 153, title: 'Coding: IF, THEN, ELSE', kind: 'lesson', mastered: ['Read a program with IF, THEN, ELSE', 'Choose what a program will do'], pre: ['ifThen', 'ifThen', 'ifThen'],
        objectives: ['Follow the Engineering Design Process', 'Complete a conditional statement', 'Read a program that contains conditionals', 'Write a program with conditionals (mission)'],
        slides: [
          { say: 'A computer follows a program, step by step. Some programs make a choice. They use the words IF, THEN, and ELSE.', visual: function () { return '<div class="codebox"><div><b class="kw">IF</b> it is raining</div><div class="ind"><b class="kw">THEN</b> take an umbrella</div><div><b class="kw">ELSE</b> wear sunglasses</div></div>'; } },
          { say: 'First the program checks the IF part. Is it raining? Yes! So it does the THEN part: take an umbrella.', visual: function () { return '<span style="font-size:3rem">🌧️ → ☂️</span>'; } },
          { say: 'If it is not raining, the program skips THEN and does the ELSE part: wear sunglasses.', visual: function () { return '<span style="font-size:3rem">☀️ → 😎</span>'; } },
          { say: 'The lighthouse uses a rule too. IF a boat is near the rocks, THEN shine the light. Rules like this help keep people safe!', visual: function () { return '<div class="codebox"><div><b class="kw">IF</b> a boat is near the rocks</div><div class="ind"><b class="kw">THEN</b> shine the light</div><div><b class="kw">ELSE</b> keep watching</div></div>'; } }
        ],
        practice: ['ifThen', 'ifThen', 'ifThen'],
        today: ['ifThen', 'ifThen', 'ifThen', 'ifThen'], review: ['coordRead', 'toolChoose', 'sub2'],
        explain: { q: 'IF it is raining THEN take an umbrella ELSE wear sunglasses. It is sunny. What happens?', options: ['Wear sunglasses, because the IF is false.', 'Take an umbrella, because THEN is first.', 'Nothing, because it is not raining.'], answer: 0 },
        worldview: 'Good rules help us love and protect others, like a lighthouse guiding ships.' },
      { id: 'P16-8', num: 8, lesson: 154, title: 'Coding: Fix the Program', kind: 'lesson', mastered: ['Choose the program that works', 'Find and fix a bug in a program'], pre: ['debugCode', 'debugCode', 'ifThen'],
        objectives: ['Debug code that contains conditionals', 'Choose the best program to complete a task', 'Write a conditional statement that helps someone solve a problem (mission)'],
        slides: [
          { say: 'Oh no! My weather robot got wet. Look at its program. IF it is raining, THEN wear sunglasses? That is a bug, a mistake in a program!', visual: function () { return codeHtml(PROGS[0], true); } },
          { say: 'To find a bug, pretend the IF part is true. It is raining. Should the robot wear sunglasses? No! It should take an umbrella.', visual: function () { return '<span style="font-size:3rem">🌧️ → 😎 ❌</span>'; } },
          { say: 'The THEN and ELSE lines got switched. Switch them back, and the program works!', visual: function () { return codeHtml(PROGS[0], false); } },
          { say: 'Fixing mistakes is part of learning. God is patient with us, and we can be patient as we fix our mistakes too.', visual: function () { return '<span style="font-size:4rem">🛠️❤️</span>'; } }
        ],
        practice: ['debugCode', 'debugCode', 'ifThen'],
        today: ['debugCode', 'ifThen', 'debugCode', 'debugCode'], review: ['coordRead', 'perimeterCm', 'mulFact'],
        explain: { q: 'How can you find a bug in an IF-THEN program?', options: ['Pretend the IF is true and check the THEN line.', 'Read only the very last line of it.', 'Delete the whole program and stop.'], answer: 0 },
        worldview: 'God is patient with our mistakes. We can learn from them and try again.' },
      { id: 'P16-9', num: 9, lesson: 152, title: 'Harbor Review', kind: 'review', mastered: ['Remember everything from Weather Rock', 'Build the memory verse, Isaiah 40:12'],
        objectives: ['Recall concepts and terms from Chapter 16'],
        mix: ['thermoRead', 'thermoActivity', 'tempChange', 'massUnit', 'kgCompare', 'literCompare', 'balanceRead', 'lengthUnit', 'measureCm', 'estimateCm', 'longerBy', 'perimeterCm', 'coordRead', 'ifThen', 'debugCode'],
        worldview: 'God measured the waters in His hand and weighed the mountains. Nothing is too big for Him.' },
      { id: 'P16-10', num: 10, lesson: 155, title: 'Lighthouse Challenge', kind: 'boss', mastered: ['Show what you know about metric measurement', 'Relight the Weather Rock lighthouse!'],
        objectives: ['Demonstrate knowledge of Chapter 16 (chapter test)'],
        mix: ['thermoRead', 'thermoActivity', 'tempChange', 'massUnit', 'kgCompare', 'literCompare', 'balanceRead', 'lengthUnit', 'measureCm', 'toolChoose', 'estimateCm', 'longerBy', 'perimeterCm', 'coordRead', 'ifThen', 'debugCode'],
        worldview: 'The light shines again over Weather Rock! God rules the wind and the waves.' }
    ]
  };
})();
