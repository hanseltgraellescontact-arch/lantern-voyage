/* Kite Cove — Prelude unit P15: Geometry.
   Matches BJU Press Math 2, 5th edition, Chapter 15, lessons 136–145 (Lesson Plan Overview).
   Keeper: Tío Tomás, the kite maker. Every problem is generated fresh at three levels; each carries its own
   hints, "How do you know?" reasons (why) and a step-by-step walkthrough (walk). */
(function () {
  var R = U.rand, P = U.pick;
  var NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  var COLS = ['#ffd23f', '#7fc8a9', '#9fd0ff', '#ffb3a7', '#b48ef0', '#ff9f1c'];
  function txt(t, err, say) { return { html: '<span style="font-size:1.2rem">' + t + '</span>', value: t, err: err, say: say || t }; }
  function pic(svg, value, err, say) { return { html: svg, value: value, err: err, say: say || value }; }
  function walk(prob, tip, tip2) {
    var s = [{ say: tip, show: prob.visual || '' }];
    if (tip2) s.push({ say: tip2, show: prob.visual || '' });
    s.push({ say: 'Now you try it.', show: prob.visual || '', ask: prob.type === 'number' ? { type: 'number', answer: prob.answer } : { type: 'choice', options: prob.choices, answer: prob.answer }, final: true });
    return s;
  }
  function done(prob, tip, tip2) { prob.walk = walk(prob, tip, tip2); return prob; }
  var PLANE1 = ['triangle', 'rectangle', 'square', 'circle'], PLANE2 = PLANE1.concat(['pentagon', 'hexagon', 'oval']);
  var SIDES = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, rhombus: 4, trapezoid: 4, circle: 0, oval: 0 };
  var SOLIDS = { cube: 'cube', prism: 'rectangular prism', pyramid: 'square pyramid', sphere: 'sphere', cylinder: 'cylinder', cone: 'cone' };
  var FEV = { cube: [6, 12, 8], prism: [6, 12, 8], pyramid: [5, 8, 5] };

  var G = {};
  /* 136 — plane figures */
  G.planeName = function (level) {
    var pool = level === 1 ? PLANE1 : PLANE2, k = P(pool), show = Math.random() < 0.5;
    var others = U.shuffle(pool.filter(function (x) { return x !== k; })).slice(0, 2), opts = U.shuffle([k].concat(others));
    if (show) return done({ skill: 'planeName', type: 'choice', big: true, data: { k: k }, prompt: 'Tap the ' + k.toUpperCase() + '.', say: 'Tap the ' + k + '.', visual: '',
      choices: opts.map(function (x, i) { return pic(Models.figure(x, 100, COLS[i]), x, x === k ? null : 'shape-name', x); }), answer: k,
      hints: ['Count the sides and corners.', HINT[k], 'Find the ' + k + '.'], explain: 'This is a ' + k + '. ' + HINT[k], why: [HINT[k], 'It is the biggest shape on the screen.', 'It is the shape with the brightest color.'] },
      'Look at each shape. Count its sides.', HINT[k]);
    return done({ skill: 'planeName', type: 'choice', data: { k: k }, prompt: 'What is the name of this shape?', say: 'What is the name of this shape?', visual: Models.figure(k, 150, P(COLS)),
      choices: opts.map(function (x) { return txt(x, x === k ? null : 'shape-name'); }), answer: k,
      hints: ['Count the sides.', HINT[k], 'It is a ' + k + '.'], explain: 'It is a ' + k + '. ' + HINT[k], why: [HINT[k], 'All shapes with corners are squares.', 'Its color tells me the name of it.'] },
      'Count the sides and the corners of the shape.', HINT[k]);
  };
  var HINT = { triangle: 'A triangle has 3 sides.', square: 'A square has 4 equal sides.', rectangle: 'A rectangle has 4 sides: 2 long, 2 short.', circle: 'A circle is round with no sides.',
    pentagon: 'A pentagon has 5 sides.', hexagon: 'A hexagon has 6 sides.', oval: 'An oval is round and stretched out.', rhombus: 'A rhombus has 4 equal slanted sides.', trapezoid: 'A trapezoid has 4 sides, 2 of them parallel.' };
  G.sidesVertices = function (level) {
    var pool = level === 1 ? ['triangle', 'square', 'rectangle'] : ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'rhombus', 'trapezoid'], k = P(pool), v = Math.random() < 0.5, n = SIDES[k];
    return done({ skill: 'sidesVertices', type: 'number', answer: n, data: { k: k, v: v }, prompt: 'How many ' + (v ? 'VERTICES (corners)' : 'SIDES') + ' does this ' + k + ' have?', say: 'How many ' + (v ? 'vertices' : 'sides') + ' does this ' + k + ' have?',
      visual: Models.vertices(k, 170, P(COLS)), hints: [v ? 'A vertex is a corner, where two sides meet. The red dots show them.' : 'A side is a straight edge.', 'Touch each one as you count.', 'A ' + k + ' has ' + n + ' ' + (v ? 'vertices' : 'sides') + '.'],
      explain: 'A ' + k + ' has ' + n + ' sides and ' + n + ' vertices.' }, v ? 'Vertices are the corners. Count the red dots.' : 'Sides are the straight edges. Count each one once.', 'A plane figure has the same number of sides and vertices.');
  };
  G.moves = function (level) {
    var pool = level === 1 ? ['slide', 'flip'] : ['slide', 'flip', 'turn'], m = P(pool);
    var desc = { slide: 'A slide moves a shape without turning it.', flip: 'A flip makes a mirror image, like flipping a pancake.', turn: 'A turn spins a shape around a point.' };
    return done({ skill: 'moves', type: 'choice', data: { m: m }, prompt: 'The blue shape moved to the orange shape. Was it a slide, a flip, or a turn?', say: 'The blue shape moved to the orange shape. Was it a slide, a flip, or a turn?',
      visual: Models.moveShape(m, 320), choices: U.shuffle(pool.map(function (x) { return txt(x.charAt(0).toUpperCase() + x.slice(1), x === m ? null : 'slide-flip-turn', x); })), answer: m.charAt(0).toUpperCase() + m.slice(1),
      hints: ['Look at the foot of the L. Which way does it point now?', desc.slide + ' ' + desc.flip + ' ' + desc.turn, 'It was a ' + m + '.'], explain: desc[m],
      why: m === 'slide' ? ['It points the same way, just moved over.', 'The shape is now a mirror image.', 'The shape is now lying on its side.'] : m === 'flip' ? ['It became a mirror image of itself.', 'It points the same way, just moved over.', 'The shape spun around onto its side.'] :
        ['It spun around and lies on its side.', 'It is a mirror image of the first.', 'It points the same way, just moved.'] }, 'Look at the foot of the L shape. Which way does it point in each picture?', desc[m]);
  };
  /* 137 — patterns */
  G.patternNext = function (level) {
    var t = P(level === 1 ? ['letter', 'shape'] : ['letter', 'number', 'shape', 'number']), seq, ans, opts, say;
    if (t === 'letter') { var u = P(level === 1 ? [['A', 'B'], ['A', 'A', 'B']] : [['A', 'B', 'C'], ['A', 'B', 'B'], ['A', 'A', 'B']]); seq = []; for (var i = 0; i < 6; i++) seq.push(u[i % u.length]); ans = u[6 % u.length]; opts = U.uniq([ans, 'A', 'B', 'C']).slice(0, 3); say = 'What letter comes next?'; }
    else if (t === 'number') { var st = P([2, 5, 10, 3]), a = st * R(0, 4); seq = [a, a + st, a + 2 * st, a + 3 * st]; ans = String(a + 4 * st); opts = U.uniq([ans, String(a + 4 * st + 1), String(a + 3 * st + 1), String(a + 5 * st)]).slice(0, 3); seq = seq.map(String); say = 'What number comes next?'; }
    else { var bu = P([['tri', 'sq'], ['hex', 'tri', 'tri'], ['rho', 'tra', 'sq']]); seq = []; for (var j = 0; j < 6; j++) seq.push(bu[j % bu.length]); ans = bu[6 % bu.length];
      var bo = U.uniq([ans, 'tri', 'sq', 'hex', 'rho']).slice(0, 3);
      return done({ skill: 'patternNext', type: 'choice', data: { t: t }, prompt: 'What comes next in the pattern?', say: 'What shape comes next in the pattern?', visual: '<div class="g1row">' + seq.map(function (b) { return Models.block(b, 54); }).join('') + '<span class="g1blank">?</span></div>',
        choices: U.shuffle(bo.map(function (b) { return pic(Models.block(b, 70), b, b === ans ? null : 'pattern', { tri: 'triangle', sq: 'square', hex: 'hexagon', rho: 'rhombus', tra: 'trapezoid' }[b]); })), answer: ans,
        hints: ['Find the part that repeats.', 'Say the pattern out loud.', 'The repeating part starts over.'], explain: 'The pattern repeats, so the next shape starts the core again.',
        why: ['The repeating part starts over again.', 'The next one is always a brand-new shape.', 'The pattern stops after the sixth shape.'] }, 'Find the core: the part that repeats.', 'Say the pattern out loud and keep going.'); }
    return done({ skill: 'patternNext', type: 'choice', data: { t: t }, prompt: 'What comes next? ' + '<span class="g1num">' + seq.join(', ') + ', ?</span>', say: say, visual: '',
      choices: U.shuffle(opts.map(function (o) { return txt(o, o === ans ? null : 'pattern'); })), answer: ans,
      hints: [t === 'number' ? 'How much does it grow each time?' : 'Find the part that repeats.', 'Say it out loud.', 'Next is ' + ans + '.'], explain: 'The next one is ' + ans + '.',
      why: t === 'number' ? ['It grows by the same amount each time.', 'It always grows by one each time.', 'The numbers go in a mixed-up order.'] : ['The letters repeat in the same order.', 'The next letter is always a new one.', 'The letters are in ABC order only.'] },
      t === 'number' ? 'Find how much each number grows by.' : 'Find the core: the part that repeats.', 'Use that rule to find the next one.');
  };
  /* 138 — making shapes */
  G.composeBlocks = function (level) {
    var c = P(level === 1 ? [['tri', 'hex', 6], ['tra', 'hex', 2]] : [['tri', 'hex', 6], ['tra', 'hex', 2], ['rho', 'hex', 3], ['tri', 'rho', 2], ['tri', 'tra', 3]]);
    var nm = { tri: 'green triangles', tra: 'red trapezoids', rho: 'blue rhombuses', hex: 'yellow hexagon' }, whole = c[1] === 'hex' ? 'one yellow hexagon' : c[1] === 'rho' ? 'one blue rhombus' : 'one red trapezoid';
    return done({ skill: 'composeBlocks', type: 'number', answer: c[2], data: { c: c }, prompt: 'How many ' + nm[c[0]] + ' make ' + whole + '?', say: 'How many ' + nm[c[0]] + ' make ' + whole + '?',
      visual: '<div class="g1row">' + Models.blockTrue(c[0], 60) + '<span class="g1op">→</span>' + Models.blockTrue(c[1], 60) + '</div>',
      hints: ['Imagine laying the small pieces on top of the big one.', c[1] === 'hex' ? 'A hexagon has 6 sides. Look at the picture in the guide.' : 'Try it with real pattern blocks if you have them!', c[2] + ' ' + nm[c[0]] + ' make ' + whole + '.'],
      explain: c[2] + ' ' + nm[c[0]] + ' cover ' + whole + '.' }, 'Think of covering the big shape with the small pieces, with no gaps.', c[1] === 'hex' ? 'This picture shows a hexagon covered with pieces.' : 'Count how many pieces fit.');
  };
  G.separateShape = function (level) {
    var c = P([['square', 'diag', 'Two triangles'], ['rectangle', 'mid', 'Two rectangles'], ['square', 'mid', 'Two rectangles'], ['hexagon', 'mid', 'Two trapezoids']]);
    var cut = c[0] === 'hexagon' ? '<path d="M6 50 H94"' : c[1] === 'diag' ? '<path d="M12 12 L88 88"' : c[0] === 'square' ? '<path d="M50 12 V88"' : '<path d="M50 26 V76"';
    var svg = Models.figure(c[0], 160, '#9fd0ff').replace('</svg>', cut + ' stroke="#e5533d" stroke-width="4" stroke-dasharray="8 6"/></svg>');
    var opts = U.uniq([c[2], 'Two triangles', 'Two rectangles', 'Two trapezoids', 'Two circles']).slice(0, 3);
    return done({ skill: 'separateShape', type: 'choice', data: { c: c }, prompt: 'This ' + c[0] + ' is cut on the red dashed line. What two shapes do you get?', say: 'This ' + c[0] + ' is cut on the red dashed line. What two shapes do you get?', visual: svg,
      choices: U.shuffle(opts.map(function (o) { return txt(o, o === c[2] ? null : 'shape-name'); })), answer: c[2], hints: ['Look at one side of the line at a time.', 'Count the sides of each new piece.', 'You get ' + c[2].toLowerCase() + '.'],
      explain: 'Cutting on that line makes ' + c[2].toLowerCase() + '.', why: ['Each new piece has those many sides.', 'Cutting a shape always makes circles.', 'The pieces are the same as the whole.'] }, 'Cover one side of the line with your hand. What shape is left?', 'Count the sides of that piece.');
  };
  G.vennPlace = function (level) {
    var shapes = ['square', 'rectangle', 'triangle', 'hexagon', 'rhombus'], k = P(shapes), red = Math.random() < 0.5, four = SIDES[k] === 4;
    var where = four && red ? 'In the middle (both)' : four ? 'Only "4 sides"' : red ? 'Only "Red"' : 'Outside the circles';
    var col = red ? '#e5533d' : '#3b8fd9';
    var opts = ['Only "4 sides"', 'Only "Red"', 'In the middle (both)', 'Outside the circles'];
    return done({ skill: 'vennPlace', type: 'choice', data: { k: k, red: red }, prompt: 'Where does this ' + (red ? 'red' : 'blue') + ' ' + k + ' go in the Venn diagram?', say: 'Where does this ' + (red ? 'red' : 'blue') + ' ' + k + ' go in the Venn diagram?',
      visual: '<div class="g1row">' + Models.venn('4 sides', 'Red', [], 300) + Models.figure(k, 90, col) + '</div>',
      choices: opts.map(function (o) { return txt(o, o === where ? null : 'venn'); }),
      answer: where, hints: ['Ask two questions: Does it have 4 sides? Is it red?', 'Yes to both? It goes in the middle where the circles overlap.', 'It goes: ' + where + '.'],
      explain: 'It has ' + SIDES[k] + ' sides and it is ' + (red ? 'red' : 'blue') + ', so it goes ' + where.toLowerCase() + '.', why: [four && red ? 'It has 4 sides and it is red too.' : four ? 'It has 4 sides, but it is not red.' : red ? 'It is red, but it does not have 4 sides.' : 'It is not red and has no 4 sides.', 'The biggest shapes always go in the middle.', 'It goes where there is the most room.'] },
      'Ask: does it have 4 sides? Then ask: is it red?', 'Yes and yes goes in the middle. Only one yes goes in that circle only. No and no goes outside.');
  };
  /* 139 — congruent, similar, symmetry */
  G.congruent = function (level) {
    var k = P(['triangle', 'square', 'hexagon', 'pentagon', 'rectangle']), how = P(level === 1 ? ['congruent', 'other'] : ['congruent', 'similar', 'other']);
    var other = P(['circle', 'oval', 'rhombus'].concat(k === 'square' ? ['rectangle'] : ['square'])), ans = how === 'congruent' ? 'Congruent' : how === 'similar' ? 'Similar' : 'Neither';
    var opts = level === 1 ? ['Congruent', 'Neither'] : ['Congruent', 'Similar', 'Neither'];
    return done({ skill: 'congruent', type: 'choice', data: { k: k, how: how }, prompt: 'Look at the two shapes. Are they congruent (same size AND shape), similar (same shape, different size), or neither?', say: 'Are the two shapes congruent, similar, or neither?',
      visual: Models.pair(k, how === 'other' ? other : how, 120), choices: opts.map(function (o) { return txt(o, o === ans ? null : 'congruent'); }), answer: ans,
      hints: ['Congruent means same size AND same shape.', 'Similar means the same shape, but a different size.', 'They are ' + ans.toLowerCase() + '.'],
      explain: ans === 'Congruent' ? 'They are the same size and the same shape.' : ans === 'Similar' ? 'Same shape, but one is smaller.' : 'They are not even the same shape.',
      why: ans === 'Congruent' ? ['Same size and same shape exactly.', 'Same shape but a different size.', 'They are both very nice colors.'] : ans === 'Similar' ? ['Same shape, but one is smaller.', 'Same size and same shape exactly.', 'They are two different shapes.'] : ['They are not the same shape at all.', 'Same shape but different sizes.', 'Same size and same shape exactly.'] },
      'First ask: are they the same shape?', 'Then ask: are they the same size?');
  };
  var SYMS = [['heart', 'v', true], ['heart', 'h', false], ['star', 'v', true], ['rect', 'v', true], ['rect', 'h', true], ['rect', 'd', false], ['tri', 'v', true], ['tri', 'h', false], ['moon', 'h', true], ['moon', 'v', false], ['lshape', 'd', false]];
  G.symmetry = function (level) {
    var s = P(SYMS), ans = s[2] ? 'Yes' : 'No';
    return done({ skill: 'symmetry', type: 'choice', data: { s: s }, prompt: 'Is the red dashed line a LINE OF SYMMETRY?', say: 'Is the red dashed line a line of symmetry?', visual: Models.symmetry(s[0], s[1], 170),
      choices: [txt('Yes', ans === 'Yes' ? null : 'symmetry', 'yes'), txt('No', ans === 'No' ? null : 'symmetry', 'no')], answer: ans,
      hints: ['A line of symmetry cuts a shape into two halves that match exactly.', 'Imagine folding on the line. Would the two halves lie right on top of each other?', s[2] ? 'Yes, the halves match.' : 'No, the halves do not match.'],
      explain: s[2] ? 'If you fold on the line, the two halves match exactly.' : 'If you fold on the line, the two halves do not match.', why: s[2] ? ['Folded on the line, the halves match.', 'Every line through a shape is one.', 'The line goes right through the middle.'] : ['Folded on the line, the halves do not match.', 'No shape has a line of symmetry.', 'The line is red and dashed, so no.'] },
      'Imagine folding the shape on the red line.', 'Do the two halves land right on top of each other?');
  };
  /* 140 — solid figures */
  var SHORT = { cube: 'It has 6 square faces, all the same.', prism: 'It is shaped just like a box.', pyramid: 'Its triangle faces meet at a point.', sphere: 'It is round all over, like a ball.', cylinder: 'It has 2 circle faces, like a can.', cone: 'It has 1 circle face and a point.' };
  G.solidName = function (level) {
    var pool = level === 1 ? ['cube', 'sphere', 'cylinder', 'cone'] : Object.keys(SOLIDS), k = P(pool), opts = U.shuffle([k].concat(U.shuffle(pool.filter(function (x) { return x !== k; })).slice(0, 2)));
    var tip = { cube: 'A cube has 6 square faces.', prism: 'A rectangular prism is shaped like a box.', pyramid: 'A square pyramid has a square bottom and 4 triangles that meet at a point.', sphere: 'A sphere is round like a ball.', cylinder: 'A cylinder is like a can: 2 circle faces and a curve.', cone: 'A cone has 1 circle face and a point, like an ice-cream cone.' };
    return done({ skill: 'solidName', type: 'choice', big: true, data: { k: k }, prompt: 'Tap the ' + SOLIDS[k].toUpperCase() + '.', say: 'Tap the ' + SOLIDS[k] + '.', visual: '',
      choices: opts.map(function (x, i) { return pic(Models.figure(x, 100, COLS[i]), x, x === k ? null : 'solid-name', SOLIDS[x]); }), answer: k,
      hints: [tip[k], 'Think of things around the house with this shape.', 'Find the ' + SOLIDS[k] + '.'], explain: tip[k], why: [SHORT[k], 'It is the biggest shape in the row.', 'It is the brightest shape in the row.'] }, tip[k], 'Look at each shape and find the match.');
  };
  G.solidParts = function (level) {
    var k = P(['cube', 'prism', 'pyramid']), w = level === 1 ? 0 : R(0, 2), nm = ['faces', 'edges', 'vertices'][w], n = FEV[k][w];
    var tip = ['A face is a flat side.', 'An edge is where two faces meet.', 'A vertex is a corner, where edges meet.'][w];
    return done({ skill: 'solidParts', type: 'number', answer: n, data: { k: k, w: w }, prompt: 'How many ' + nm.toUpperCase() + ' does a ' + SOLIDS[k] + ' have?', say: 'How many ' + nm + ' does a ' + SOLIDS[k] + ' have?',
      visual: Models.figure(k, 170, '#ffd23f'), hints: [tip, 'Remember the sides you cannot see!', 'A ' + SOLIDS[k] + ' has ' + n + ' ' + nm + '.'], explain: 'A ' + SOLIDS[k] + ' has ' + n + ' ' + nm + '.' },
      tip + ' Some are hidden on the back.', k === 'pyramid' ? 'A square pyramid has 1 square face on the bottom and 4 triangle faces.' : 'A box has a top, a bottom, a front, a back, and 2 ends.');
  };
  G.planeOrSolid = function (level) {
    var solid = Math.random() < 0.5, k = solid ? P(Object.keys(SOLIDS)) : P(PLANE2), ans = solid ? 'Solid figure' : 'Plane figure';
    return done({ skill: 'planeOrSolid', type: 'choice', data: { k: k, solid: solid }, prompt: 'Is this a PLANE figure (flat) or a SOLID figure?', say: 'Is this a plane figure, which is flat, or a solid figure?', visual: Models.figure(k, 150, P(COLS)),
      choices: [txt('Plane figure', solid ? 'plane-solid' : null), txt('Solid figure', solid ? null : 'plane-solid')], answer: ans,
      hints: ['A plane figure is flat, like a drawing on paper.', 'A solid figure takes up space; you could hold it.', 'It is a ' + ans.toLowerCase() + '.'], explain: solid ? 'You could hold it in your hand, so it is a solid figure.' : 'It is flat, so it is a plane figure.',
      why: solid ? ['It takes up space; I could hold it.', 'It is flat like a drawing on paper.', 'It has a name, so it must be flat.'] : ['It is flat like a drawing on paper.', 'It takes up space; I could hold it.', 'It has corners, so it is solid.'] }, 'Flat shapes are plane figures. Shapes you can hold are solid figures.', 'Look for shading that shows depth.');
  };
  /* 141 — perimeter */
  G.perimeter = function (level) {
    var kind = P(level === 1 ? ['triangle', 'square'] : ['triangle', 'rectangle', 'square', 'pentagon']), sides;
    if (kind === 'square') { var s = R(2, level === 1 ? 5 : 9); sides = [s, s, s, s]; }
    else if (kind === 'rectangle') { var a = R(3, 9), b = R(2, a - 1); sides = [a, b, a, b]; }
    else if (kind === 'triangle') { do { sides = [R(2, 8), R(2, 8), R(2, 8)]; } while (sides[0] + sides[1] <= sides[2] || sides[0] + sides[2] <= sides[1] || sides[1] + sides[2] <= sides[0]); } // a real triangle
    else sides = [R(2, 6), R(2, 6), R(2, 6), R(2, 6), R(2, 6)];
    var sum = sides.reduce(function (x, y) { return x + y; }, 0);
    var word = level === 3 && kind === 'rectangle' && Math.random() < 0.5;
    var prompt = word ? 'Dad is building a fence around a garden. The garden is a rectangle, ' + sides[0] + ' feet long and ' + sides[1] + ' feet wide. How many feet of fence does he need?' : 'Find the PERIMETER (the distance all the way around) in inches.';
    return done({ skill: 'perimeter', type: 'number', answer: sum, data: { sides: sides, kind: kind }, prompt: prompt, say: word ? prompt : 'Find the perimeter, the distance all the way around, in inches.',
      visual: Models.perimeter(kind, sides, word ? 'ft' : 'in', 260),
      hints: ['Perimeter is the distance all the way around.', 'Add every side: ' + sides.join(' + ') + '.', sides.join(' + ') + ' = ' + sum + '.'], explain: sides.join(' + ') + ' = ' + sum + (word ? ' feet.' : ' inches.') },
      'Perimeter means walking all the way around the edge. Add up every side.', 'Add: ' + sides.join(' + ') + '.');
  };
  /* 142–143 — lines */
  G.measureLine = function (level) {
    var n = R(1, 7);
    return done({ skill: 'measureLine', type: 'number', answer: n, data: { n: n }, prompt: 'How long is the red line, in inches?', say: 'How long is the red line, in inches?', visual: Models.lineOnRuler(n),
      hints: ['The line starts at 0 on the ruler.', 'Look where the line ends.', 'It ends at ' + n + '. It is ' + n + ' inches long.'], explain: 'The line goes from 0 to ' + n + ', so it is ' + n + ' inches long.' },
      'The line starts at zero.', 'Read the number on the ruler where the line stops.');
  };
  G.lineKind = function (level) {
    var pairs = level === 1 ? [['horizontal', 'Horizontal'], ['vertical', 'Vertical']] : [['horizontal', 'Horizontal'], ['vertical', 'Vertical'], ['parallel', 'Parallel'], ['parallelV', 'Parallel'], ['intersecting', 'Intersecting'], ['intersectingT', 'Intersecting']];
    var pk = P(pairs), two = /parallel|intersecting/.test(pk[0]), ans = pk[1];
    var opts = two ? ['Parallel', 'Intersecting'] : ['Horizontal', 'Vertical'];
    var tip = { Horizontal: 'Horizontal lines go straight across, like the horizon.', Vertical: 'Vertical lines go straight up and down, like a flagpole.', Parallel: 'Parallel lines never meet, like train tracks.', Intersecting: 'Intersecting lines cross each other.' };
    return done({ skill: 'lineKind', type: 'choice', data: { k: pk[0] }, prompt: two ? 'Are these lines PARALLEL or INTERSECTING?' : 'Is this line HORIZONTAL or VERTICAL?', say: two ? 'Are these lines parallel or intersecting?' : 'Is this line horizontal or vertical?', visual: Models.lines(pk[0], 180),
      choices: opts.map(function (o) { return txt(o, o === ans ? null : 'lines'); }), answer: ans, hints: [tip[opts[0]], tip[opts[1]], 'They are ' + ans.toLowerCase() + '.'], explain: tip[ans],
      why: [tip[ans], tip[opts[0] === ans ? opts[1] : opts[0]], 'All lines on a page are this kind.'] }, tip[opts[0]], tip[opts[1]]);
  };

  /* spiral review from Slice Isle and earlier chapters (reuse those generators) */
  var S = CONTENT.islands.P14.generators;
  ['mulFact', 'add2', 'sub2', 'clockTime', 'shadedFraction', 'compareUnit', 'setFraction', 'circleGraph'].forEach(function (k) { G[k] = S[k]; });

  /* "Show me how" guides for Kite Cove (videos only from the family's approved channels) */
  var GU = {
    geoPlane: { title: 'Plane figures', video: { label: 'Polygons Song (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=zI3rUMrRLF8' }, steps: [
      ['A plane figure is flat. Count its sides and vertices (corners).', function () { return Models.vertices('triangle', 90) + Models.vertices('square', 90) + Models.vertices('pentagon', 90) + Models.vertices('hexagon', 90); }],
      ['3 sides: triangle. 4: square or rectangle. 5: pentagon. 6: hexagon. Round: circle or oval.', function () { return Models.figure('circle', 70) + Models.figure('oval', 70); }]] },
    geoMoves: { title: 'Slide, flip, turn', video: { label: 'Transformations Song (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=gOLO6F7twS0' }, steps: [
      ['SLIDE: the shape moves over but points the same way.', function () { return Models.moveShape('slide', 260); }],
      ['FLIP: the shape becomes a mirror image.', function () { return Models.moveShape('flip', 260); }],
      ['TURN: the shape spins around a point.', function () { return Models.moveShape('turn', 260); }]] },
    geoPattern: { title: 'Patterns', video: { label: 'The Patterns Practice Song (Scratch Garden)', url: 'https://www.youtube.com/watch?v=MBjjxSx45-Q' }, steps: [
      ['Find the core: the part that repeats. A B, A B, A B…', function () { return '<span class="g1num">A B A B A B ?</span>'; }],
      ['Number patterns grow by the same amount each time: 5, 10, 15, 20…', function () { return '<span class="g1num">+5 +5 +5</span>'; }]] },
    geoBlocks: { title: 'Making shapes from pattern blocks', video: { label: 'Shapes! (Scratch Garden)', url: 'https://www.youtube.com/watch?v=Ux_kLd7qAcY' }, steps: [
      ['6 green triangles cover 1 yellow hexagon.', function () { return Models.hexFrom('tri', 110); }],
      ['3 blue rhombuses cover 1 hexagon. 2 red trapezoids cover 1 hexagon.', function () { return Models.hexFrom('rho', 110) + Models.hexFrom('tra', 110); }],
      ['Cutting a shape makes new shapes: a square cut corner to corner makes 2 triangles.', function () { return Models.figure('square', 90).replace('</svg>', '<path d="M12 12 L88 88" stroke="#e5533d" stroke-width="4" stroke-dasharray="8 6"/></svg>'); }]] },
    geoVenn: { title: 'Venn diagrams', steps: [
      ['Each circle holds one kind of thing. Where the circles overlap, things belong to BOTH.', function () { return Models.venn('4 sides', 'Red', [{ where: 'a', svg: Models.figure('square', 40, '#3b8fd9') }, { where: 'both', svg: Models.figure('square', 40, '#e5533d') }, { where: 'b', svg: Models.figure('triangle', 40, '#e5533d') }], 320); }],
      ['If it fits neither circle, it goes outside.', function () { return ''; }]] },
    geoCongruent: { title: 'Congruent, similar, symmetry', video: { label: 'Symmetry Song (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=SJlhywRfvh8' }, steps: [
      ['CONGRUENT: same size and same shape.', function () { return Models.pair('triangle', 'congruent', 80); }],
      ['SIMILAR: same shape, different size.', function () { return Models.pair('triangle', 'similar', 80); }],
      ['A LINE OF SYMMETRY folds a shape into two matching halves.', function () { return Models.symmetry('heart', 'v', 100) + Models.symmetry('heart', 'h', 100); }]] },
    geoSolids: { title: 'Solid figures', video: { label: 'The Form Song (Scratch Garden)', url: 'https://www.youtube.com/watch?v=1ddqO7_gois' }, steps: [
      ['Solid figures take up space: cube, rectangular prism, pyramid, sphere, cylinder, cone.', function () { return ['cube', 'prism', 'pyramid', 'sphere', 'cylinder', 'cone'].map(function (k) { return Models.figure(k, 60); }).join(''); }],
      ['Faces are flat sides. Edges are where faces meet. Vertices are corners. A cube: 6 faces, 12 edges, 8 vertices.', function () { return Models.figure('cube', 100); }]] },
    geoPerimeter: { title: 'Perimeter', video: { label: 'Area and Perimeter Song (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=Tpy09HOkHyI' }, steps: [
      ['Perimeter is the distance all the way around a shape.', function () { return Models.perimeter('rectangle', [5, 3, 5, 3], 'in', 200); }],
      ['Add every side: 5 + 3 + 5 + 3 = 16 inches.', function () { return '<span class="g1num">16 in</span>'; }]] },
    geoLines: { title: 'Lines', video: { label: 'Parallel, Perpendicular & Intersecting Lines (NUMBEROCK)', url: 'https://www.youtube.com/watch?v=P3AOoLbA3us' }, steps: [
      ['Horizontal lines go across. Vertical lines go up and down.', function () { return Models.lines('horizontal', 110) + Models.lines('vertical', 110); }],
      ['Parallel lines never meet. Intersecting lines cross.', function () { return Models.lines('parallel', 110) + Models.lines('intersecting', 110); }],
      ['To measure a line, start at 0 on the ruler and read where it ends.', function () { return Models.lineOnRuler(4); }]] }
  };
  Help.extend(GU, { planeName: 'geoPlane', sidesVertices: 'geoPlane', moves: 'geoMoves', patternNext: 'geoPattern', composeBlocks: 'geoBlocks', separateShape: 'geoBlocks', vennPlace: 'geoVenn',
    congruent: 'geoCongruent', symmetry: 'geoCongruent', solidName: 'geoSolids', solidParts: 'geoSolids', planeOrSolid: 'geoSolids', perimeter: 'geoPerimeter', measureLine: 'geoLines', lineKind: 'geoLines' });

  var F = U.frac;
  CONTENT.islands.P15 = {
    id: 'P15', name: 'Kite Cove', sea: 'home',
    bju: 'BJU Press Math 2 (5th ed.), Chapter 15: Geometry — lessons 136–145',
    keeper: { name: 'Tío Tomás', art: 'tomas', voice: 'keeperM',
      greet: [{ t: '¡Buenos días, capitán!', lang: 'es' }, { t: '¿Listo para volar?', lang: 'es' }, 'Good morning, captain! Ready to fly? I am Tío Tomás, the kite maker. Every kite I build is made of shapes!'],
      greetText: '<b>¡Buenos días, capitán! ¿Listo para volar?</b><br><i>Good morning, captain! Ready to fly?</i> I am Tío Tomás, the kite maker. ("Tío" means uncle.) Every kite I build is made of shapes!' },
    factSets: ['add', 'sub', 'mul'],
    missions: [
      { id: 'P15-m1', icon: 'star', title: 'Shape Hunt', shells: 20, text: 'Find 6 shapes around your house: a circle, a triangle, a square, a rectangle, an oval, and a hexagon (look at nuts and bolts or tiles!). Draw each one and count its sides and vertices.' },
      { id: 'P15-m2', icon: 'ruler', title: 'Rubber-Band Geoboard', shells: 20, text: 'Push pushpins or nails into a piece of cardboard or wood in rows (with a parent). Stretch rubber bands to make a triangle, a rectangle, and a square. Can you make a pentagon?' },
      { id: 'P15-m3', icon: 'apple', title: 'Marshmallow Solids', shells: 25, text: 'Use toothpicks and mini marshmallows (or clay) to build a cube and a pyramid. Count the faces, edges, and vertices of each one.' },
      { id: 'P15-m4', icon: 'heart', title: 'Symmetry Butterfly', shells: 20, text: 'Fold a paper in half. Open it, paint blobs on one side only, and fold it again. Open it up: both halves match! The fold is a line of symmetry.' },
      { id: 'P15-m5', icon: 'ruler', title: 'Perimeter Walk', shells: 20, text: 'Use a ruler to measure each side of a book, a placemat, and a picture frame. Add the sides to find each perimeter. Which one has the longest perimeter?' },
      { id: 'P15-m6', icon: 'star', title: 'Build a Kite', shells: 30, text: 'With a parent, build a simple paper kite from two crossed sticks and paper. What shape is your kite? Is it symmetrical? Fly it and thank God for the wind!' }
    ],
    generators: G,
    skillNames: { planeName: 'Naming plane figures', sidesVertices: 'Sides and vertices', moves: 'Slide, flip, turn', patternNext: 'Patterns', composeBlocks: 'Making shapes', separateShape: 'Cutting shapes apart',
      vennPlace: 'Venn diagrams', congruent: 'Congruent and similar', symmetry: 'Symmetry', solidName: 'Naming solid figures', solidParts: 'Faces, edges, vertices', planeOrSolid: 'Plane or solid',
      perimeter: 'Perimeter', measureLine: 'Measuring lines', lineKind: 'Kinds of lines', mulFact: 'Multiplication facts', add2: '2-digit adding', sub2: '2-digit subtracting', clockTime: 'Telling time',
      shadedFraction: 'Writing fractions', compareUnit: 'Comparing unit fractions', setFraction: 'Part of a set', circleGraph: 'Circle graphs' },
    verse: { ref: 'Colossians 3:23', version: 'ESV', text: 'Whatever you do, work heartily, as for the Lord and not for men,' },
    story: {
      title: 'Bezalel the Master Builder', ref: 'Exodus 31:3 (ESV)',
      panels: [
        { say: 'Here is a true story from the Bible. God told Moses to build the tabernacle, a holy tent where God would meet with His people. It needed boards, curtains, and frames of exact shapes and sizes.' },
        { say: 'God chose a man named Bezalel to lead the work. Listen to what God said about him.', quote: '"and I have filled him with the Spirit of God, with ability and intelligence, with knowledge and all craftsmanship,"' },
        { say: 'Bezalel cut rectangles, measured lengths, and made beautiful designs, and he did his very best, because the work was for the Lord. When we learn about shapes and do our best work, we honor God too!' }
      ],
      question: { prompt: 'Who gave Bezalel his skill to build?', choices: ['God', 'Pharaoh', 'Nobody'], answer: 'God', right: 'Yes! God filled Bezalel with skill and knowledge.', after: 'Now let\'s go build kites with Tío Tomás!', wrong: 'Listen again: "I have filled him with the Spirit of God."' }
    },
    quests: [
      { id: 'P15-1', num: 1, lesson: 136, title: 'Plane Figures', kind: 'lesson', mastered: ['Name plane figures: triangle, rectangle, square, circle, pentagon, hexagon, oval', 'Count sides and vertices', 'Tell a slide from a flip'], pre: ['planeName', 'sidesVertices', 'moves'],
        objectives: ['Identify plane figures', 'Identify sides and vertices', 'Construct shapes on a geoboard (mission)', 'Identify a slide and a flip', 'Explain why Christians should do their best to learn about plane figures'],
        slides: [
          { say: 'Welcome to my kite shop! Look at my kites. Each one is made of flat shapes called plane figures.', visual: function () { return Art.icon('kite', 140); } },
          { say: 'A triangle has three sides. A square and a rectangle have four. A pentagon has five. A hexagon has six.', visual: function () { return ['triangle', 'square', 'pentagon', 'hexagon'].map(function (k) { return '<div class="center">' + Models.figure(k, 90) + '<b>' + k + '</b></div>'; }).join(''); } },
          { say: 'The corners are called vertices. One corner is a vertex. A pentagon has five sides and five vertices.', visual: function () { return Models.vertices('pentagon', 180); } },
          { say: 'Circles and ovals are round. They have no straight sides and no vertices.', visual: function () { return Models.figure('circle', 110) + Models.figure('oval', 140); } },
          { say: 'Shapes can move. A slide moves a shape over. A flip turns it into a mirror image.', visual: function () { return Models.moveShape('slide', 240) + Models.moveShape('flip', 240); } },
          { say: 'Why learn about shapes? God made us to work and build, and He wants us to do our best. Builders, sewers, and kite makers all use shapes to serve others!', visual: function () { return Art.keeper('tomas', 120); } }
        ],
        practice: ['planeName', 'sidesVertices', 'moves'],
        today: ['planeName', 'sidesVertices', 'moves', 'planeName'], review: ['shadedFraction', 'mulFact'],
        explain: { q: 'Why should we do our best when we learn about shapes?', options: ['God made us to work well and serve others.', 'So we can finish quickly and stop thinking.', 'Shapes are only used in math books.'], answer: 0 },
        worldview: 'God made us to work and build. Doing our best honors Him.' },
      { id: 'P15-2', num: 2, lesson: 137, title: 'Patterns', kind: 'lesson', mastered: ['Continue letter, number, and shape patterns', 'Tell a slide, a flip, and a turn'], pre: ['patternNext', 'patternNext', 'moves'],
        objectives: ['Extend letter, number, and shape patterns', 'Identify a slide, a flip, and a turn'],
        slides: [
          { say: 'My kite tails have patterns: red, blue, red, blue. The part that repeats is called the core.', visual: function () { return '<div class="g1row">' + ['#e5533d', '#3b8fd9', '#e5533d', '#3b8fd9', '#e5533d', '#3b8fd9'].map(function (c) { return '<span class="g1dot" style="background:' + c + '"></span>'; }).join('') + '</div>'; } },
          { say: 'Letter patterns work the same way: A, B, B, A, B, B. What comes next? A!', visual: function () { return '<span class="g1num">A B B A B B ?</span>'; } },
          { say: 'Number patterns grow by the same amount: five, ten, fifteen, twenty. Each time we add five.', visual: function () { return '<span class="g1num">5, 10, 15, 20, 25</span>'; } },
          { say: 'One more move: a turn spins a shape around a point, like a kite spinning in the wind.', visual: function () { return Models.moveShape('turn', 260); } }
        ],
        practice: ['patternNext', 'patternNext', 'moves'],
        today: ['patternNext', 'patternNext', 'moves', 'moves'], review: ['planeName', 'sidesVertices', 'add2'],
        explain: { q: 'How do you find what comes next in a pattern?', options: ['Find the part that repeats.', 'Pick the biggest number I can see.', 'Pick a brand-new letter each time.'], answer: 0 },
        worldview: 'God made patterns everywhere: day and night, seasons, and the tides.' },
      { id: 'P15-3', num: 3, lesson: 138, title: 'Making Shapes', kind: 'lesson', mastered: ['Make shapes from pattern blocks', 'Tell what shapes you get when you cut a shape', 'Sort shapes in a Venn diagram'], pre: ['composeBlocks', 'separateShape', 'vennPlace'],
        objectives: ['Compose figures by using pattern blocks', 'Separate figures by using a geoboard', 'Relate shapes by using a Venn diagram'],
        slides: [
          { say: 'I cut kite pieces from smaller pieces. Six green triangles can cover one yellow hexagon.', visual: function () { return Models.block('tri', 60) + '<span class="g1op">× 6 =</span>' + Models.hexFrom('tri', 130); } },
          { say: 'Two red trapezoids also make a hexagon. So do three blue rhombuses.', visual: function () { return Models.hexFrom('tra', 120) + Models.hexFrom('rho', 120); } },
          { say: 'We can cut shapes apart, too. A square cut from corner to corner makes two triangles.', visual: function () { return Models.figure('square', 130).replace('</svg>', '<path d="M12 12 L88 88" stroke="#e5533d" stroke-width="4" stroke-dasharray="8 6"/></svg>'); } },
          { say: 'A Venn diagram sorts things. One circle is for shapes with four sides, the other for red shapes. A red square goes in the middle, because it belongs to both!', visual: function () { return Models.venn('4 sides', 'Red', [{ where: 'a', svg: Models.figure('rectangle', 40, '#3b8fd9') }, { where: 'both', svg: Models.figure('square', 40, '#e5533d') }, { where: 'b', svg: Models.figure('triangle', 40, '#e5533d') }], 340); } }
        ],
        practice: ['composeBlocks', 'separateShape', 'vennPlace'],
        today: ['composeBlocks', 'separateShape', 'vennPlace', 'composeBlocks'], review: ['patternNext', 'compareUnit', 'mulFact'],
        explain: { q: 'Why does a red square go in the middle of the Venn diagram?', options: ['It is red AND it has 4 sides.', 'It is the biggest shape of all.', 'The middle is for shapes that are blue.'], answer: 0 },
        worldview: 'Small pieces fit together to make something beautiful, like the church, where every person has a part.' },
      { id: 'P15-4', num: 4, lesson: 139, title: 'Same Size & Shape; Symmetry', kind: 'lesson', mastered: ['Tell congruent from similar shapes', 'Find a line of symmetry'], pre: ['congruent', 'symmetry', 'symmetry'],
        objectives: ['Identify similar and congruent figures', 'Draw congruent figures (paper)', 'Identify symmetrical figures', 'Draw a line of symmetry (mission)'],
        slides: [
          { say: 'These two kite sails are exactly the same size and the same shape. They are congruent.', visual: function () { return Models.pair('triangle', 'congruent', 110); } },
          { say: 'These two are the same shape, but one is smaller. They are similar.', visual: function () { return Models.pair('triangle', 'similar', 110); } },
          { say: 'A kite looks the same on both sides. If you fold it on a line and the halves match, that line is a line of symmetry.', visual: function () { return Models.symmetry('heart', 'v', 160); } },
          { say: 'But fold this heart the other way, and the halves do not match. That is not a line of symmetry.', visual: function () { return Models.symmetry('heart', 'h', 160); } }
        ],
        practice: ['congruent', 'symmetry', 'congruent'],
        today: ['congruent', 'symmetry', 'congruent', 'symmetry'], review: ['composeBlocks', 'sidesVertices', 'clockTime'],
        explain: { q: 'How can you tell a line is a line of symmetry?', options: ['Folded on it, the two halves match.', 'It goes from one corner to another.', 'Every shape has one going sideways.'], answer: 0 },
        worldview: 'God made butterflies, leaves, and faces with beautiful symmetry. His design shows His care.' },
      { id: 'P15-5', num: 5, lesson: 140, title: 'Solid Figures', kind: 'lesson', mastered: ['Tell plane figures from solid figures', 'Name solid figures', 'Count faces, edges, and vertices'], pre: ['planeOrSolid', 'solidName', 'solidParts'],
        objectives: ['Distinguish plane and solid figures', 'Identify cube, rectangular prism, pyramid, sphere, cylinder, cone', 'Identify faces, edges, vertices, curves', 'Formulate a biblical reason to learn geometry'],
        slides: [
          { say: 'A plane figure is flat, like a drawing. A solid figure takes up space. You can hold it!', visual: function () { return Models.figure('square', 110) + '<span class="g1op">→</span>' + Models.figure('cube', 120); } },
          { say: 'Here are six solid figures: cube, rectangular prism, pyramid, sphere, cylinder, and cone.', visual: function () { return ['cube', 'prism', 'pyramid', 'sphere', 'cylinder', 'cone'].map(function (k) { return '<div class="center">' + Models.figure(k, 76) + '<b style="font-size:.85rem">' + SOLIDS[k] + '</b></div>'; }).join(''); } },
          { say: 'A face is a flat side. An edge is where two faces meet. A vertex is a corner. A cube has six faces, twelve edges, and eight vertices.', visual: function () { return Models.figure('cube', 170); } },
          { say: 'Cylinders, cones, and spheres have curves. They can roll!', visual: function () { return Models.figure('cylinder', 100) + Models.figure('cone', 100) + Models.figure('sphere', 100); } },
          { say: 'God built the whole world with shapes, from round planets to six-sided snowflakes. Learning geometry helps us see His design and build things that help people.', visual: function () { return Art.icon('star', 90); } }
        ],
        practice: ['planeOrSolid', 'solidName', 'solidParts'],
        today: ['planeOrSolid', 'solidName', 'solidParts', 'solidName'], review: ['symmetry', 'congruent', 'sub2'],
        explain: { q: 'Why should a Christian learn geometry?', options: ['To see God\'s design and build things that help.', 'Because shapes are only for playing games.', 'So we never have to think about building.'], answer: 0 },
        worldview: 'God is the master designer. Geometry helps us see His handiwork.' },
      { id: 'P15-6', num: 6, lesson: 141, title: 'Perimeter', kind: 'lesson', mastered: ['Find the perimeter of a shape', 'Solve perimeter word problems'], pre: ['perimeter', 'perimeter', 'perimeter'],
        objectives: ['Find perimeter using inches, feet, or yards', 'Measure to find perimeter in inches', 'Solve perimeter word problems'],
        slides: [
          { say: 'I put ribbon all the way around the edge of a kite. The distance all the way around is called the perimeter.', visual: function () { return Models.perimeter('rectangle', [5, 3, 5, 3], 'in', 240); } },
          { say: 'To find the perimeter, add every side. Five plus three plus five plus three equals sixteen inches.', visual: function () { return '<span class="g1num">5 + 3 + 5 + 3 = 16 in</span>'; } },
          { say: 'Count every side, even the ones that are the same! A triangle has three sides to add. A pentagon has five.', visual: function () { return Models.perimeter('triangle', [4, 5, 6], 'in', 200); } }
        ],
        practice: ['perimeter', 'perimeter', 'perimeter'],
        today: ['perimeter', 'perimeter', 'perimeter', 'perimeter'], review: ['solidParts', 'planeName', 'mulFact'],
        explain: { q: 'How do you find the perimeter of a shape?', options: ['Add the lengths of all the sides.', 'Count the corners of the shape.', 'Measure just the longest side.'], answer: 0 },
        worldview: 'Noah measured the ark carefully, just as God told him. Careful measuring is a way to obey and serve.' },
      { id: 'P15-7', num: 7, lesson: 142, title: 'Lines', kind: 'lesson', mastered: ['Measure a line in inches', 'Tell horizontal from vertical lines', 'Tell parallel from intersecting lines'], pre: ['measureLine', 'lineKind', 'lineKind'],
        objectives: ['Draw a line of a given length (paper)', 'Identify horizontal and vertical lines', 'Identify parallel and intersecting lines'],
        slides: [
          { say: 'My kite string makes lines. A horizontal line goes straight across, like the horizon over the sea.', visual: function () { return Models.lines('horizontal', 200); } },
          { say: 'A vertical line goes straight up and down, like a flagpole.', visual: function () { return Models.lines('vertical', 200); } },
          { say: 'Parallel lines never meet, like train tracks. Intersecting lines cross each other.', visual: function () { return Models.lines('parallel', 150) + Models.lines('intersecting', 150); } },
          { say: 'To measure a line, start at zero on the ruler. Read the number where the line ends. This line is four inches long.', visual: function () { return Models.lineOnRuler(4); } }
        ],
        practice: ['measureLine', 'lineKind', 'lineKind'],
        today: ['measureLine', 'lineKind', 'lineKind', 'measureLine'], review: ['perimeter', 'moves', 'add2'],
        explain: { q: 'How can you tell two lines are parallel?', options: ['They go the same way and never meet.', 'They cross each other in the middle.', 'One goes across and one goes down.'], answer: 0 },
        worldview: 'God\'s ways are straight and true. The Bible is our measuring line.' },
      { id: 'P15-8', num: 8, lesson: 143, title: 'Review of Lines', kind: 'lesson', mastered: ['Measure and name lines', 'Name solid figures'], pre: ['lineKind', 'measureLine', 'solidName'],
        objectives: ['Draw a line of a given length (paper)', 'Identify horizontal, vertical, parallel and intersecting lines', 'Identify solid figures'],
        slides: [
          { say: 'Let\'s practice lines once more. Horizontal goes across. Vertical goes up and down.', visual: function () { return Models.lines('horizontal', 140) + Models.lines('vertical', 140); } },
          { say: 'Parallel lines never meet. Intersecting lines cross.', visual: function () { return Models.lines('parallelV', 140) + Models.lines('intersectingT', 140); } },
          { say: 'And remember the solid figures: cube, rectangular prism, pyramid, sphere, cylinder, and cone. People build homes, boats, and barns from these shapes to serve others.', visual: function () { return ['cube', 'prism', 'pyramid', 'sphere', 'cylinder', 'cone'].map(function (k) { return Models.figure(k, 60); }).join(''); } }
        ],
        practice: ['lineKind', 'measureLine', 'solidName'],
        today: ['lineKind', 'measureLine', 'solidName', 'lineKind'], review: ['perimeter', 'setFraction', 'clockTime'],
        explain: { q: 'Are the lines on a ladder\'s sides parallel or intersecting?', options: ['Parallel: they go side by side and never meet.', 'Intersecting: they cross in the very middle.', 'Neither: ladders do not have any lines.'], answer: 0 },
        worldview: 'Working to serve others with our skills pleases God.' },
      { id: 'P15-9', num: 9, lesson: 144, title: 'Harbor Review', kind: 'review', mastered: ['Remember everything from Kite Cove', 'Build the memory verse, Colossians 3:23'],
        objectives: ['Recall concepts and terms from Chapter 15'],
        mix: ['planeName', 'sidesVertices', 'moves', 'patternNext', 'composeBlocks', 'vennPlace', 'congruent', 'symmetry', 'solidName', 'solidParts', 'perimeter', 'lineKind'],
        worldview: 'Whatever you do, work heartily, as for the Lord.' },
      { id: 'P15-10', num: 10, lesson: 145, title: 'Lighthouse Challenge', kind: 'boss', mastered: ['Show what you know about geometry', 'Relight the Kite Cove lighthouse!'],
        objectives: ['Demonstrate knowledge of Chapter 15 (chapter test)'],
        mix: ['planeName', 'sidesVertices', 'moves', 'patternNext', 'composeBlocks', 'separateShape', 'vennPlace', 'congruent', 'symmetry', 'solidName', 'solidParts', 'planeOrSolid', 'perimeter', 'measureLine', 'lineKind'],
        worldview: 'The light shines again over Kite Cove! Kites dance in the wind God made.' }
    ]
  };
})();
