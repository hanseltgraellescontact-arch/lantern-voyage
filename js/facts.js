/* Fact Forge (the Lantern warm-up): spaced repetition of math facts with no visible timer.
   Five boxes: a right answer moves a fact up, a miss sends it back to box 1.
   A fact counts as mastered after three quick, correct answers on three different days. */
var Facts = (function () {
  var INTERVAL = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 }; // days
  var QUICK_MS = 4000;

  function pool(sets) {
    var out = [];
    sets.forEach(function (s) {
      var a, b;
      if (s === 'add') for (a = 0; a <= 9; a++) for (b = 0; b <= 9; b++) out.push({ key: a + '+' + b, q: a + ' + ' + b, ans: a + b, say: a + ' plus ' + b });
      if (s === 'sub') for (a = 0; a <= 9; a++) for (b = 0; b <= 9; b++) out.push({ key: (a + b) + '-' + b, q: (a + b) + ' − ' + b, ans: a, say: (a + b) + ' minus ' + b });
      if (s === 'mul') [0, 1, 2, 3, 4, 5, 10].forEach(function (f) { for (b = 0; b <= 10; b++) out.push({ key: f + 'x' + b, q: f + ' × ' + b, ans: f * b, say: f + ' times ' + b }); });
    });
    return out;
  }
  function daysBetween(a, b) {
    if (!a) return 999;
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }
  function state(p, key) { return p.facts[key] || { box: 1, last: null, quick: [] }; }

  /* choose n facts: due weak ones first, then never-seen ones, then a review mix */
  function choose(p, sets, n) {
    var all = pool(sets), today = U.today();
    var due = [], fresh = [], rest = [];
    all.forEach(function (f) {
      var st = p.facts[f.key];
      if (!st) fresh.push(f);
      else if (st.box < 5 && daysBetween(st.last, today) >= INTERVAL[st.box]) due.push({ f: f, box: st.box });
      else rest.push(f);
    });
    due.sort(function (a, b) { return a.box - b.box; });
    var picked = due.slice(0, Math.ceil(n * 0.6)).map(function (d) { return d.f; });
    picked = picked.concat(U.shuffle(fresh).slice(0, n - picked.length));
    if (picked.length < n) picked = picked.concat(U.shuffle(rest).slice(0, n - picked.length));
    return U.shuffle(picked).slice(0, n);
  }
  function record(p, fact, correct, ms) {
    if (p.preview) return;
    var st = state(p, fact.key), today = U.today();
    if (correct) {
      st.box = Math.min(5, st.box + 1);
      if (ms < QUICK_MS && st.quick.indexOf(today) < 0) st.quick.push(today);
      if (st.quick.length >= 3) st.box = 5;
    } else {
      st.box = 1;
      Store.addError(p, 'fact');
    }
    st.last = today;
    p.facts[fact.key] = st;
  }
  /* Hint strategy chosen by the type of fact (never generic). Leads with the strategy, not the answer. */
  function strategy(fact) {
    var m;
    if ((m = fact.key.match(/^(\d+)\+(\d+)$/))) {
      var a = +m[1], b = +m[2], big = Math.max(a, b), small = Math.min(a, b);
      if (a === 0 || b === 0) return 'Adding zero keeps the number the same.';
      if (small <= 2) return 'Count on ' + small + ' from the bigger number, ' + big + '.';
      if (a === b) return 'Doubles! ' + a + ' and ' + a + ' is a double fact.';
      if (big - small === 1) return 'Near doubles: think ' + small + ' + ' + small + ', then add 1 more.';
      if (a + b === 10) return 'Ten friends: ' + a + ' and ' + b + ' always make 10.';
      if ((big === 8 || big === 9) && a + b > 10) return 'Make 10: move ' + (10 - big) + ' to the ' + big + ' to make 10, then add what is left.';
      return 'Count on ' + small + ' from the bigger number, ' + big + '.';
    }
    if ((m = fact.key.match(/^(\d+)-(\d+)$/))) {
      var t = +m[1], s2 = +m[2];
      if (s2 === 0) return 'Take away zero: nothing changes.';
      if (s2 === t) return 'Take away all of it: zero is left.';
      return 'Think addition: ' + s2 + ' + what = ' + t + '?';
    }
    if ((m = fact.key.match(/^(\d+)x(\d+)$/))) {
      var f = +m[1], g = +m[2];
      if (f === 0 || g === 0) return 'Zero groups, or groups of zero, make zero.';
      if (f === 1) return 'One group of ' + g + ' is just ' + g + '.';
      if (g === 1) return f + ' groups of 1 is just ' + f + '.';
      if (f === 2) return 'Times 2 is a double: ' + g + ' + ' + g + '.';
      if (f === 5) return 'Skip count by 5, ' + g + ' times.';
      if (f === 10) return 'Times 10: put a zero after ' + g + '.';
      return 'Skip count by ' + f + ', ' + g + ' times.';
    }
    return '';
  }

  function summary(p) {
    var boxes = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.keys(p.facts).forEach(function (k) { boxes[p.facts[k].box]++; });
    var weak = Object.keys(p.facts).filter(function (k) { return p.facts[k].box === 1; }).slice(0, 12);
    return { boxes: boxes, seen: Object.keys(p.facts).length, weak: weak };
  }
  return { choose: choose, record: record, strategy: strategy, summary: summary, pool: pool };
})();
