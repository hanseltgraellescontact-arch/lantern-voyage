/* The "Watch & learn" videos for Lantern Harbor. Each is about 30–60 seconds and made in the game (works offline).
   YouTube links: only from the family's chosen channels (The Singing Walrus, Super Simple Songs, NUMBEROCK, Preschool Prep Company, Scratch Garden); each link checked. */
(function () {
  var V = Video.add, B = function (t) { return '<span class="g1num">' + t + '</span>'; }, W = G1.W;
  function icons(n, kind, col, crossed) { return Models.row(n, kind, col, crossed, 460); }
  function dot(c) { return '<span class="g1dot" style="background:' + c + '"></span>'; }
  function numCard(n) { return '<div class="center vcard">' + B(n) + Models.dots(n, 90) + '<span class="g1word">' + W[n] + '</span></div>'; }

  V('count10', { title: 'How to count', tube: [{ id: 'DR-cfDsHCGA', label: 'Counting 1–10 Song (The Singing Walrus)' }, { id: '-GK6ISA2U1A', label: 'Meet the Numbers: Counting Activity (Preschool Prep Company)' }], scenes: [
    { say: 'Here is how to count. Touch each duck, one at a time, and say one number for each duck.', show: function () { return icons(5, 'duck', '#ffd23f'); } },
    { count: 5, kind: 'duck', color: '#ffd23f', say: 'Watch me count!' },
    { beat: ['One', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten!'], kind: 'star', color: '#ffd23f', say: 'Now let\'s count to ten together!', end: 'Remember: touch each one just once. The last number you say tells how many!' }
  ] });
  V('count20', { title: 'Counting big groups', tube: [{ id: 'wiGEEJLLKd8', label: 'Number Song 10–20 (The Singing Walrus)' }], scenes: [
    { say: 'Big groups need careful counting. Touch each one and say the next number. Don\'t skip any. Don\'t count any twice!', show: function () { return icons(12, 'crate', '#c98a3a'); } },
    { count: 12, kind: 'crate', color: '#c98a3a' },
    { beat: ['Eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty!'], kind: 'fish', color: '#3b8fd9', from: 11, say: 'After ten, keep counting with me!' }
  ] });
  V('numbers', { title: 'Numbers, dots, and words', tube: [{ id: '-GK6ISA2U1A', label: 'Meet the Numbers: Counting Activity (Preschool Prep Company)' }, { id: 'HG361wJyDY0', label: 'The Spelling the Numbers Song (Scratch Garden)' }], scenes: [
    { say: 'Every number has three friends: the number, a dot picture, and a word.', show: function () { return numCard(3); } },
    { song: [
      { t: 'Zero means none, not one at all.', show: function () { return numCard(0); } },
      { t: 'One is one, standing tall.', show: function () { return numCard(1); } },
      { t: 'Two is a pair, like two shoes.', show: function () { return numCard(2); } },
      { t: 'Three is three dots, corner to corner.', show: function () { return numCard(3); } },
      { t: 'Four makes a square, five has one in the middle.', show: function () { return numCard(4) + numCard(5); } },
      { t: 'Six, seven, eight, nine, ten. Count again!', show: function () { return numCard(6) + numCard(10); } }
    ] },
    { say: 'When you see a dot picture, try to know the number without counting every dot. That is called seeing it fast!', show: function () { return Models.dots(4, 110) + Models.dots(5, 110) + Models.dots(6, 110); } }
  ] });
  V('tally', { title: 'Tally marks', tube: [{ id: 'twqFHfIjPP4', label: 'I Can Show Numbers in Different Ways (NUMBEROCK)' }], scenes: [
    { say: 'Tally marks are little lines for counting. Each line is one.', show: function () { return Models.tally(1) + Models.tally(2) + Models.tally(3); } },
    { say: 'One, two, three, four. For five, we draw one line across the four. That makes a group of five!', show: function () { return Models.tally(4) + Models.tally(5); } },
    { say: 'To read tally marks, touch each line and count.', show: function () { return Models.tally(5); } }
  ] });
  V('compare', { title: 'More and fewer', tube: [], scenes: [
    { say: 'Which group has more fish? Let\'s count both groups.', show: function () { return icons(5, 'fish', '#3b8fd9') + icons(3, 'fish', '#e5533d'); } },
    { say: 'The blue group has five. The red group has three.', show: function () { return '<div class="center">' + icons(5, 'fish', '#3b8fd9') + B(5) + '</div><div class="center">' + icons(3, 'fish', '#e5533d') + B(3) + '</div>'; } },
    { say: 'Five is more than three. So the blue group has more. The red group has fewer.', show: function () { return B('5 is more than 3'); } }
  ] });
  V('order', { title: 'Counting up and counting back', tube: [{ id: 'ohbPbP67UKU', label: '10 in the Bed: counting down (Scratch Garden)' }], scenes: [
    { say: 'Numbers go in order. Counting up, each number is one more.', show: function () { return B('0 1 2 3 4 5'); } },
    { beat: ['Five', 'four', 'three', 'two', 'one', 'zero', 'Blast off!'], kind: 'boat', color: '#e5533d', labels: [5, 4, 3, 2, 1, 0, '🚀'], say: 'Counting back, each number is one less. Count down with me!' },
    { say: 'The number after six is seven. The number before six is five.', show: function () { return B('5 ← 6 → 7'); } }
  ] });
  V('ordinal', { title: 'First, second, third', tube: [], scenes: [
    { say: 'The ducks are in a line. Start at the front of the line.', show: function () { return '<div class="g1row">' + [0, 1, 2, 3, 4].map(function () { return Art.icon('duck', 64); }).join('') + '<span class="g1op">➜</span></div>'; } },
    { song: ['first', 'second', 'third', 'fourth', 'fifth'].map(function (w, i) {
      return { t: 'This one is ' + w + '!', show: function () { return '<div class="g1row">' + [0, 1, 2, 3, 4].map(function (j) { return '<div class="center' + (j === i ? ' vhl' : '') + '">' + Art.icon('duck', 64) + '<b>' + (j <= i ? ['first', 'second', 'third', 'fourth', 'fifth'][j] : '&nbsp;') + '</b></div>'; }).join('') + '</div>'; } };
    }) }
  ] });
  V('evenOdd', { title: 'Even and odd', tube: [], scenes: [
    { say: 'Let\'s make pairs. A pair is two friends together.', show: function () { return '<div class="g1pairs"><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span></div>'; } },
    { say: 'Four fish: every fish has a partner. So four is even!', show: function () { return '<div class="g1pairs"><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span></div>' + B('4 even'); } },
    { say: 'Five fish: one fish has no partner. So five is odd!', show: function () { return '<div class="g1pairs"><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span><span>' + Art.icon('fish', 50) + Art.icon('fish', 50) + '</span><span>' + Art.icon('fish', 50) + '<i class="g1alone"></i></span></div>' + B('5 odd'); } },
    { song: [{ t: 'Two, four, six, eight, ten. Even numbers, pairs of friends!', show: function () { return B('2 4 6 8 10'); } }, { t: 'One, three, five, seven, nine. One left over, every time!', show: function () { return B('1 3 5 7 9'); } }] }
  ] });
  V('make10', { title: 'Ways to make ten', tube: [], scenes: [
    { say: 'This is a ten-frame. It has ten boxes.', show: function () { return Models.tenFrame(0, 'duck', 300); } },
    { say: 'Seven ducks are in the boxes. How many boxes are empty? Three! Seven and three make ten.', show: function () { return Models.tenFrame(7, 'duck', 300) + B('7 + 3 = 10'); } },
    { song: [
      { t: 'Nine and one make ten!', show: function () { return Models.tenFrame(9, 'duck', 260) + B('9 + 1'); } },
      { t: 'Eight and two make ten!', show: function () { return Models.tenFrame(8, 'duck', 260) + B('8 + 2'); } },
      { t: 'Seven and three make ten!', show: function () { return Models.tenFrame(7, 'duck', 260) + B('7 + 3'); } },
      { t: 'Six and four make ten!', show: function () { return Models.tenFrame(6, 'duck', 260) + B('6 + 4'); } },
      { t: 'Five and five make ten!', show: function () { return Models.tenFrame(5, 'duck', 260) + B('5 + 5'); } }
    ] }
  ] });
  V('makeSet', { title: 'Making a set', scenes: [
    { say: 'To make a set of four, tap one and say one. Tap the next and say two. Then three, then four. Stop at four!', show: function () { return icons(4, 'crate', '#c98a3a') + icons(3, 'crate', '#d9d4c6'); } },
    { count: 4, kind: 'crate', color: '#c98a3a', end: 'Four! We stop at four. That is a set of four.' }
  ] });
  V('shapes', { title: 'The shape song', tube: [{ id: 'TJhfl5vdxp4', label: 'The Shape Song #1 (Super Simple Songs)' }, { id: 'kAE0gp_4qMA', label: 'Meet the Shapes (Preschool Prep Company)' }, { id: 'Ux_kLd7qAcY', label: 'Shapes! (Scratch Garden)' }], scenes: [
    { song: [
      { t: 'A circle is round, round, round!', show: function () { return Models.figure('circle', 170, '#ffd23f'); } },
      { t: 'A triangle has three sides. One, two, three!', show: function () { return Models.figure('triangle', 170, '#7fc8a9'); } },
      { t: 'A square has four sides, all the same!', show: function () { return Models.figure('square', 170, '#9fd0ff'); } },
      { t: 'A rectangle has four sides, two long and two short!', show: function () { return Models.figure('rectangle', 220, '#ffb3a7'); } },
      { t: 'Circle, triangle, square, rectangle!', show: function () { return ['circle', 'triangle', 'square', 'rectangle'].map(function (k, i) { return Models.figure(k, 100, ['#ffd23f', '#7fc8a9', '#9fd0ff', '#ffb3a7'][i]); }).join(''); } }
    ] },
    { say: 'Look around the harbor. A life ring is a circle. A sail is a triangle. A window is a square. A door is a rectangle!', show: function () { return Art.icon('boat', 120) + Art.house(0, 0, '#e5533d', 1).replace(/^/, '<svg viewBox="-60 -100 120 120" width="120">') + '</svg>'; } }
  ] });
  V('sort', { title: 'Which one does not belong?', scenes: [
    { say: 'Things that are alike go together. A fish, a duck, and a seagull are all animals.', show: function () { return Art.icon('fish', 80) + Art.icon('duck', 80) + Art.icon('gull', 80); } },
    { say: 'Now look: a fish, a duck, a seagull, and a loaf of bread. Which one does not belong?', show: function () { return Art.icon('fish', 80) + Art.icon('duck', 80) + Art.icon('gull', 80) + Art.icon('loaf', 80); } },
    { say: 'The bread! It is a food, not an animal. It does not belong.', show: function () { return Art.icon('fish', 80) + Art.icon('duck', 80) + Art.icon('gull', 80) + '<span class="vno">' + Art.icon('loaf', 80) + '</span>'; } }
  ] });
  V('pattern', { title: 'Patterns', tube: [{ id: 'Js45cR_7wFE', label: 'Patterns! (Scratch Garden)' }], scenes: [
    { say: 'A pattern repeats, again and again. Clap it with me!', show: function () { return '<div class="g1row">' + dot('#e5533d') + dot('#3b8fd9') + dot('#e5533d') + dot('#3b8fd9') + '</div>'; } },
    { beat: ['Red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'], kind: 'star', colors: ['#e5533d', '#3b8fd9'], labels: ['red', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue'], say: 'Red, blue, red, blue!' },
    { say: 'What comes next after red, blue, red, blue, red? Blue! Find the part that repeats.', show: function () { return '<div class="g1row">' + dot('#e5533d') + dot('#3b8fd9') + dot('#e5533d') + dot('#3b8fd9') + dot('#e5533d') + '<span class="g1blank">?</span></div>'; } }
  ] });
  V('measure', { title: 'Longer and shorter', tube: [{ id: '2wUsdsae0ro', label: 'Measuring! (Scratch Garden)' }], scenes: [
    { say: 'Here are two ropes. To compare them, line up the ends on one side.', show: function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + '<br>' + Models.lengthBar(4, '#3b8fd9', 8) + '</div>'; } },
    { say: 'The red rope sticks out farther. The red rope is longer. The blue rope is shorter.', show: function () { return '<div>' + Models.lengthBar(7, '#e5533d', 8) + ' <b>longer</b><br>' + Models.lengthBar(4, '#3b8fd9', 8) + ' <b>shorter</b></div>'; } }
  ] });
  V('graph', { title: 'Picture graphs', tube: [{ id: 'zF_dBk8EPDk', label: 'Data! (Scratch Garden)' }], scenes: [
    { say: 'Grandpa Eli counted the animals on the dock and made a picture graph. Each picture means one animal.', show: function () { return graph([4, 2, 3]); } },
    { say: 'Count each row. Four fish, two ducks, three gulls.', show: function () { return graph([4, 2, 3]); } },
    { say: 'The fish row has the most pictures, so there are the most fish. The duck row has the fewest.', show: function () { return graph([4, 2, 3]); } }
  ] });
  function graph(c) { var k = [['fish', 'Fish'], ['duck', 'Ducks'], ['gull', 'Gulls']]; return '<div class="g1graph">' + k.map(function (x, i) { return '<div class="g1grow"><b>' + x[1] + '</b>' + Array.from({ length: c[i] }, function () { return Art.icon(x[0], 36); }).join('') + '</div>'; }).join('') + '</div>'; }
  V('add', { title: 'Adding: put them together', tube: [{ id: '7J1OkxuyLD0', label: 'Adding & Subtracting! (Scratch Garden)' }], scenes: [
    { say: 'Two ducks are swimming. Three more ducks come to join them.', show: function () { return '<div class="g1row">' + icons(2, 'duck', '#ffd23f') + '<span class="g1op">+</span>' + icons(3, 'duck', '#ffd23f') + '</div>'; } },
    { count: 5, kind: 'duck', color: '#ffd23f', say: 'Put them together and count them all.', end: 'Five! Two and three more make five.' },
    { say: 'We write it like this: two plus three equals five.', show: function () { return B('2 + 3 = 5'); } }
  ] });
  V('sub', { title: 'Taking away', tube: [{ id: '7J1OkxuyLD0', label: 'Adding & Subtracting! (Scratch Garden)' }, { id: 'ohbPbP67UKU', label: '10 in the Bed (Scratch Garden)' }], scenes: [
    { say: 'Five apples are in the basket.', show: function () { return icons(5, 'apple', '#e5533d'); } },
    { say: 'Mrs. Lee takes two apples away. We cross out the two that are gone.', show: function () { return icons(5, 'apple', '#e5533d', 2); } },
    { say: 'Now count only the apples that are left: one, two, three. Three are left! Five take away two is three.', show: function () { return icons(5, 'apple', '#e5533d', 2) + B('5 − 2 = 3'); } }
  ] });
  V('equal', { title: 'Equal parts', tube: [{ id: '362JVVvgYPE', label: 'Fractions! (Scratch Garden)' }], scenes: [
    { say: 'To share fairly, every part must be the same size. Same size parts are called equal parts.', show: function () { return Models.shape({ kind: 'circle', n: 2, shaded: 0, size: 170 }); } },
    { say: 'Two equal parts are called halves. Four equal parts are called fourths.', show: function () { return Models.shape({ kind: 'circle', n: 2, shaded: 0, size: 150 }) + Models.shape({ kind: 'circle', n: 4, shaded: 0, size: 150 }); } },
    { say: 'Look at this one. One part is big and one is small. These are NOT equal. That would not be fair!', show: function () { return Models.shape({ kind: 'rect', n: 2, shaded: 0, unequal: true, size: 170 }); } }
  ] });
  V('coins', { title: 'The coin song', tube: [{ id: '7QW5Qw81yIY', label: 'The Money Song (Scratch Garden)' }], scenes: [
    { song: [
      { t: 'A penny is brown. It is one cent.', show: function () { return Models.coin('penny', 140); } },
      { t: 'A nickel is big. It is five cents.', show: function () { return Models.coin('nickel', 140); } },
      { t: 'A dime is the smallest. It is ten cents.', show: function () { return Models.coin('dime', 140); } },
      { t: 'A quarter is biggest. Twenty-five cents!', show: function () { return Models.coin('quarter', 140); } }
    ] },
    { say: 'To count pennies, count by ones. One, two, three, four pennies make four cents.', show: function () { return '<div class="g1row">' + [1, 2, 3, 4].map(function () { return Models.coin('penny', 70); }).join('') + '</div>' + B('4¢'); } }
  ] });
  V('clock', { title: 'Telling time', tube: [{ id: 'w9QK_4vrnJ0', label: 'The Telling Time Song (Scratch Garden)' }], scenes: [
    { say: 'A clock has two hands. The short hand tells the hour. The long hand tells the minutes.', show: function () { return Models.clock(3, 0, 200); } },
    { say: 'When the long hand points straight up to the twelve, it is an o\'clock time.', show: function () { return Models.clock(3, 0, 200); } },
    { song: [
      { t: 'Short hand on three: three o\'clock!', show: function () { return Models.clock(3, 0, 180) + B('3:00'); } },
      { t: 'Short hand on seven: seven o\'clock!', show: function () { return Models.clock(7, 0, 180) + B('7:00'); } },
      { t: 'Short hand on twelve: twelve o\'clock!', show: function () { return Models.clock(12, 0, 180) + B('12:00'); } }
    ] }
  ] });
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function week(i) { return '<div class="g1days">' + DAYS.map(function (d, j) { return '<span' + (j === i ? ' class="vhl"' : '') + '>' + (j <= i ? d : '&nbsp;&nbsp;&nbsp;') + '</span>'; }).join('') + '</div>'; }
  V('days', { title: 'Days of the week', tube: [{ id: 'lPgTdgvj_jc', label: 'Seven Days a Week (The Singing Walrus)' }], scenes: [
    { say: 'There are seven days in a week. Sing them with me!', show: function () { return week(-1); } },
    { song: [
      { t: 'Sunday, Monday,', show: function () { return week(1); } },
      { t: 'Tuesday, Wednesday,', show: function () { return week(3); } },
      { t: 'Thursday, Friday,', show: function () { return week(5); } },
      { t: 'Saturday! Seven days!', show: function () { return week(6); } }
    ] },
    { say: 'The day after Monday is Tuesday. The day before Monday is Sunday.', show: function () { return week(6); } }
  ] });

  /* ---- Seagull Pier (Math 1, chapter 2: numbers to 20) ---- */
  function teen(n) { return '<div class="center vcard">' + B(n) + Models.dots(n, 70) + '<span class="g1word">' + W[n] + '</span></div>'; }
  V('teens', { title: 'Numbers 11 to 20', tube: [{ id: 'D0Ajq682yrA', label: 'Number Song 1–20 (The Singing Walrus)' }, { id: 'wiGEEJLLKd8', label: 'Number Song 10–20 (The Singing Walrus)' }], scenes: [
    { say: 'Here is ten. The ten-frame is full.', show: function () { return Models.tenFrame(10, 'dot', 220) + B(10); } },
    { say: 'Add one more. Ten and one more is eleven. Look: a one for the ten, and a one for the extra one.', show: function () { return teen(11); } },
    { say: 'Ten and two more is twelve.', show: function () { return teen(12); } },
    { song: [
      { t: 'Ten and three make thirteen.', show: function () { return teen(13); } },
      { t: 'Ten and four make fourteen.', show: function () { return teen(14); } },
      { t: 'Ten and five make fifteen.', show: function () { return teen(15); } },
      { t: 'Ten and six make sixteen.', show: function () { return teen(16); } },
      { t: 'Ten and seven make seventeen.', show: function () { return teen(17); } },
      { t: 'Ten and eight make eighteen.', show: function () { return teen(18); } },
      { t: 'Ten and nine make nineteen.', show: function () { return teen(19); } },
      { t: 'Two full tens make twenty!', show: function () { return teen(20); } }
    ] },
    { say: 'Every teen number is one full ten and some more.', show: function () { return teen(15); } }
  ] });
  V('dozen', { title: 'A dozen', tube: [], scenes: [
    { say: 'Fisherman Pete buys eggs in a carton. A full carton is called a dozen.', show: function () { return Models.carton(12); } },
    { count: 12, kind: 'egg', say: 'Let\'s count the eggs in a dozen.', end: 'Twelve! A dozen means twelve.' },
    { say: 'Jesus chose twelve disciples. That is a dozen helpers!', show: function () { return B('a dozen = 12'); } }
  ] });
  V('ordinal10', { title: 'First to tenth', tube: [], scenes: [
    { say: 'Ten boats are in line at the pier. The front of the line is by the flag.', show: function () { return '<div class="g1row"><span style="font-size:2.4rem">🚩</span>' + Models.row(10, 'boat', '#e5533d', 0, 460) + '</div>'; } },
    { beat: ['First', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth!'], kind: 'boat', colors: ['#e5533d', '#3b8fd9', '#36b37e', '#ffd23f', '#b48ef0', '#ff9f1c', '#ff6fa8', '#1fb5ad', '#8d5730', '#ffffff'], labels: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'], say: 'Count the places with me!', end: 'Always start counting at the front of the line.' }
  ] });
  V('match', { title: 'Matching one to one', tube: [], scenes: [
    { say: 'Does every boat get a basket? Let\'s match them one to one.', show: function () { return Models.row(4, 'boat', '#e5533d', 0, 300) + '<br>' + Models.row(3, 'basket', '#c98a3a', 0, 240); } },
    { say: 'Put one basket under each boat. One boat has no basket! There are more boats than baskets.', show: function () { return '<div class="g1match">' + [0, 1, 2, 3].map(function (i) { return '<div class="g1mcol">' + Art.icon('boat', 46, '#e5533d') + (i < 3 ? Art.icon('basket', 40) : '<span class="g1ghost"></span>') + '</div>'; }).join('') + '</div>'; } },
    { say: 'When every one has a partner and none are left over, the groups are the same.', show: function () { return '<div class="g1match">' + [0, 1, 2].map(function () { return '<div class="g1mcol">' + Art.icon('boat', 46, '#e5533d') + Art.icon('basket', 40) + '</div>'; }).join('') + '</div>'; } }
  ] });
  V('bargraph', { title: 'Bar graphs', tube: [{ id: 'zF_dBk8EPDk', label: 'Data! (Scratch Garden)' }], scenes: [
    { say: 'Pete counted the animals on the pier. He made a bar graph. Each box in a bar is one animal.', show: function () { return G1.barSvg([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad']], [5, 2, 4], 6); } },
    { say: 'The tallest bar shows the most. Fish has the tallest bar.', show: function () { return G1.barSvg([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad']], [5, 2, 4], 6); } },
    { say: 'To find how many, put your finger at the top of the bar and slide across to the number. The gull bar stops at four. There are four gulls.', show: function () { return G1.barSvg([['fish', 'Fish', '#3b8fd9'], ['duck', 'Ducks', '#ffd23f'], ['gull', 'Gulls', '#9aa1ad']], [5, 2, 4], 6); } },
    { say: 'Bar graphs help workers see their numbers fast, like how many fish were caught each day.', show: function () { return Art.icon('fish', 70, '#3b8fd9') + Art.icon('basket', 70); } }
  ] });

  /* ---------- Fish Market: addition facts to 6 ---------- */
  var SG = [{ id: '7J1OkxuyLD0', label: 'Adding & Subtracting! (Scratch Garden)' }];
  function dk(n, col) { return Array.from({ length: n }, function () { return Art.icon('duck', 60, col); }).join(''); }
  V('signs', { title: 'Plus and equals', tube: SG, scenes: [
    { say: 'Two white ducks are swimming. Three brown ducks swim over to join them.', show: function () { return '<div class="g1row">' + dk(2, '#ffffff') + '<span class="g1op">+</span>' + dk(3, '#b07a4a') + '</div>'; } },
    { count: 5, kind: 'duck', color: '#ffd23f', say: 'Put them together and count them all.', end: 'Five ducks in all!' },
    { say: 'This is the plus sign. Plus means put together.', show: function () { return '<span class="g1num" style="font-size:5rem">+</span>'; } },
    { say: 'This is the equals sign. Equals means is the same as.', show: function () { return '<span class="g1num" style="font-size:5rem">=</span>'; } },
    { say: 'Now we can write an addition sentence: two plus three equals five.', show: function () { return B('2 + 3 = 5'); } }
  ] });
  V('addZero', { title: 'Adding zero', tube: SG, scenes: [
    { say: 'Four ducks are in the pond. Zero ducks come to join them. No ducks at all!', show: function () { return '<div class="g1row">' + dk(4, '#ffffff') + '<span class="g1op">+ 0</span></div>'; } },
    { say: 'How many ducks now? Still four! Four plus zero equals four. Adding zero does not change the number.', show: function () { return B('4 + 0 = 4'); } }
  ] });
  V('addStory', { title: 'Addition stories', tube: SG, scenes: [
    { say: 'Listen to the story. Pete caught three fish in the morning. He caught two more fish in the afternoon.', show: function () { return icons(3, 'fish', '#3b8fd9'); } },
    { say: 'Draw a picture to help. Three fish, and two more.', show: function () { return '<div class="g1row">' + Models.row(3, 'fish', '#3b8fd9', 0, 200) + '<span class="g1op">+</span>' + Models.row(2, 'fish', '#3b8fd9', 0, 140) + '</div>'; } },
    { count: 5, kind: 'fish', color: '#3b8fd9', say: 'Now count them all.', end: 'Five fish! Three plus two equals five.' }
  ] });
  V('addVert', { title: 'Adding up and down', tube: SG, scenes: [
    { say: 'We can write addition across: two plus three equals five.', show: function () { return B('2 + 3 = 5'); } },
    { say: 'We can also write it up and down. Two on top, plus three under it. The answer goes under the line.', show: function () { return Models.vertical(2, 3); } },
    { say: 'A domino can help. Count the dots on top and the dots on the bottom. Five dots in all!', show: function () { return Models.vertical(2, 3, 5) + Models.domino(2, 3, 140); } }
  ] });
  V('addNames', { title: 'Many names for a number', tube: SG, scenes: [
    { say: 'Five has many names! Here are five fish. Four in one group and one in the other. Four plus one is five.', show: function () { return '<div class="g1row">' + Models.row(4, 'fish', '#3b8fd9', 0, 200) + '<span class="g1op">+</span>' + Models.row(1, 'fish', '#36b37e', 0, 60) + '</div>' + B('4 + 1 = 5'); } },
    { say: 'Move one fish over. Three plus two is five too!', show: function () { return '<div class="g1row">' + Models.row(3, 'fish', '#3b8fd9', 0, 150) + '<span class="g1op">+</span>' + Models.row(2, 'fish', '#36b37e', 0, 110) + '</div>' + B('3 + 2 = 5'); } },
    { say: 'Four plus one, three plus two, five plus zero. They are all names for five.', show: function () { return B('4 + 1 · 3 + 2 · 5 + 0'); } }
  ] });
  V('turnAround', { title: 'Turn-around facts', tube: SG, scenes: [
    { say: 'This domino has two dots and three dots. Two plus three is five.', show: function () { return Models.domino(2, 3, 120, true) + B('2 + 3 = 5'); } },
    { say: 'Now turn the domino around. Three dots and two dots. Three plus two is still five!', show: function () { return Models.domino(3, 2, 120, true) + B('3 + 2 = 5'); } },
    { say: 'Changing the order does not change the answer. These are turn-around facts.', show: function () { return B('2 + 3 = 3 + 2'); } }
  ] });
})();
