/* Small shared helpers. */
var U = (function () {
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function uniq(arr) { var out = []; arr.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); }); return out; }
  function frac(n, d, cls) {
    return '<span class="frac ' + (cls || '') + '"><span class="n">' + n + '</span><span class="d">' + d + '</span></span>';
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function stars(n, max) {
    max = max || 3; var s = '<span class="stars">';
    for (var i = 0; i < max; i++) s += i < n ? '★' : '<span class="off">★</span>';
    return s + '</span>';
  }
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function modal(html, onMount) {
    var o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = '<div class="modal pop">' + html + '</div>';
    document.body.appendChild(o);
    var api = { el: o, close: function () { if (o.parentNode) o.parentNode.removeChild(o); } };
    if (onMount) onMount(o, api);
    return api;
  }
  function confirmBox(msg, yesLabel, onYes) {
    modal('<h2>Are you sure?</h2><p style="font-size:1.1rem">' + msg + '</p><div class="row" style="justify-content:flex-end">' +
      '<button class="btn plain" data-x="no">Cancel</button><button class="btn coral" data-x="yes">' + esc(yesLabel) + '</button></div>',
      function (o, api) {
        o.querySelector('[data-x=no]').onclick = api.close;
        o.querySelector('[data-x=yes]').onclick = function () { api.close(); onYes(); };
      });
  }
  function downloadText(filename, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  return { $: $, $$: $$, esc: esc, rand: rand, pick: pick, shuffle: shuffle, uniq: uniq, frac: frac, today: today,
    stars: stars, toast: toast, modal: modal, confirmBox: confirmBox, downloadText: downloadText, plural: plural };
})();
