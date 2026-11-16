/* Saves everything in this browser on this PC (localStorage), plus voice recordings in IndexedDB.
   Export/import writes plain JSON files so progress can be backed up and restored for years. */
var Store = (function () {
  var KEY = 'lanternVoyage.save.v1';
  var data = null;

  function blankSettings() {
    return { voiceOn: true, voiceName: '', voiceNameEs: '', rate: 0.95, voiceMode: 'recorded', music: 0.25, sfx: 0.7, dailyLimit: 0, sessionGoal: 3, maxMinutes: 40, answerWait: 2.5, schoolYearStart: 8, harbor: { sessionGoal: 2, maxMinutes: 20 } };
  }
  function blank() { return { version: 1, created: U.today(), pin: null, lastBackup: null, settings: blankSettings(), profiles: [], activeId: null }; }

  function newProfile(opts) {
    return {
      id: opts.id || ('p' + Date.now().toString(36) + Math.floor(Math.random() * 1000)),
      name: opts.name || 'Captain',
      preview: !!opts.preview,
      archived: false,
      created: U.today(),
      captain: opts.captain || { gender: 'boy', skin: 2, hair: 0, hairColor: 1, outfit: 0, hat: 1 },
      parrotName: opts.parrotName || 'Pip',
      introSeen: false,
      shells: opts.preview ? 999 : 0,
      owned: ['sail:white', 'pattern:none', 'flag:wave', 'figure:none', 'glow:gold'],
      ship: { sail: 'white', pattern: 'none', flag: 'wave', figure: 'none', glow: 'gold' },
      progress: {},          // islandId -> { quests: {questId: {...}}, lit: false, storySeen: false }
      facts: {},             // fact key -> { box, last, quick: [dates] }
      errors: {},            // error tag -> count
      arcadeTokens: 0,
      passedSinceToken: 0,
      verses: [],
      log: [],               // {date, quest, score, stars}
      daily: { date: '', count: 0 },
      time: {},              // 'YYYY-MM-DD' -> seconds of active play
      manualTime: [],        // {date, minutes, note} added by a parent (workbook time, etc.)
      missions: {},          // missionId -> {done: date}
      skills: {},            // skill -> {n, right, days:{date:right}, recent:[1/0]} for honest mastery tracking
      parrot: { body: 0, wing: 0, beak: 0, wear: 'none' },
      course: opts.course || 'voyage', // 'voyage' = Lantern Voyage (2nd–3rd), 'harbor' = Lantern Harbor (K5 review + 1st)
      egg: { found: false, hatched: false },
      finishDate: '',        // parent's target date to finish the course (pace tracker)
      showAnswers: !!opts.preview
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      data = raw ? JSON.parse(raw) : blank();
    } catch (e) { data = blank(); }
    if (!data.settings) data.settings = blankSettings();
    var s = blankSettings();
    Object.keys(s).forEach(function (k) { if (data.settings[k] === undefined) data.settings[k] = s[k]; });
    if (!data.settings.harbor) data.settings.harbor = { sessionGoal: 2, maxMinutes: 20 };
    if (!data.profiles) data.profiles = [];
    if (!data.profiles.some(function (p) { return p.preview; })) {
      data.profiles.push(newProfile({ id: 'preview', name: 'Parent Preview', preview: true, parrotName: 'Pip',
        captain: { gender: 'girl', skin: 3, hair: 2, hairColor: 0, outfit: 4, hat: 1 } }));
    }
    data.profiles.forEach(function (p) {
      var b = newProfile({});
      Object.keys(b).forEach(function (k) { if (p[k] === undefined) p[k] = b[k]; });
    });
    if (data.lastBackup === undefined) data.lastBackup = null;
    save();
    return data;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { U.toast('Could not save progress on this computer.'); return false; }
  }
  function get() { return data; }
  /* A few settings have their own values for the 1st-grade harbor course (shorter days). */
  function setting(p, key) {
    var s = data.settings;
    if (p && p.course === 'harbor' && s.harbor && s.harbor[key] !== undefined) return s.harbor[key];
    return s[key];
  }
  function active() { return data.profiles.filter(function (p) { return p.id === data.activeId; })[0] || null; }
  function setActive(id) { data.activeId = id; save(); }
  function children(includeArchived) {
    return data.profiles.filter(function (p) { return !p.preview && (includeArchived || !p.archived); });
  }
  function addChild(opts) {
    var p = newProfile(opts); data.profiles.push(p); save(); return p;
  }
  function islandState(p, islandId) {
    if (!p.progress[islandId]) p.progress[islandId] = { quests: {}, lit: false, storySeen: false };
    return p.progress[islandId];
  }
  function questState(p, islandId, questId) {
    var isl = islandState(p, islandId);
    if (!isl.quests[questId]) isl.quests[questId] = { stars: 0, best: 0, attempts: 0, fails: 0, done: false, flagged: false, last: null };
    return isl.quests[questId];
  }
  function addError(p, tag) { if (!tag) return; p.errors[tag] = (p.errors[tag] || 0) + 1; }
  function countToday(p) {
    if (p.daily.date !== U.today()) p.daily = { date: U.today(), count: 0 };
    return p.daily.count;
  }
  /* Mastery is separate from finishing a quest: a skill is mastered after at least 4 independent right answers,
     on at least 2 different days, with 4 of the last 5 right. */
  function recordSkill(p, skill, ok) {
    var s = p.skills[skill] || (p.skills[skill] = { n: 0, right: 0, days: {}, recent: [] });
    s.n++; if (ok) { s.right++; s.days[U.today()] = (s.days[U.today()] || 0) + 1; }
    s.recent.push(ok ? 1 : 0); if (s.recent.length > 5) s.recent.shift();
  }
  function skillState(p, skill) {
    var s = p.skills && p.skills[skill]; if (!s) return 'new';
    var acc = s.recent.reduce(function (a, b) { return a + b; }, 0);
    if (s.right >= 4 && Object.keys(s.days).length >= 2 && acc >= 4) return 'mastered';
    return s.right >= 2 ? 'growing' : 'practicing';
  }
  function countQuest(p) { countToday(p); p.daily.count++; }
  function addTime(p, secs) { var d = U.today(); p.time[d] = (p.time[d] || 0) + secs; }
  function minutesOn(p, date) {
    var m = (p.time[date] || 0) / 60;
    (p.manualTime || []).forEach(function (t) { if (t.date === date) m += t.minutes; });
    return m;
  }
  function todayStats(p) { return { quests: countToday(p), minutes: Math.round((p.time[U.today()] || 0) / 60) }; }
  function goalDots(n, goal) {
    var h = '<span class="goaldots">';
    for (var i = 0; i < Math.max(goal, n); i++) h += '<i class="' + (i < n ? 'on' : '') + '"></i>';
    return h + '</span>';
  }
  /* total minutes between two dates (inclusive, 'YYYY-MM-DD' strings) */
  function minutesBetween(p, from, to) {
    var days = {};
    Object.keys(p.time).forEach(function (d) { if (d >= from && d <= to) days[d] = 1; });
    (p.manualTime || []).forEach(function (t) { if (t.date >= from && t.date <= to) days[t.date] = 1; });
    var total = 0, active = 0;
    Object.keys(days).forEach(function (d) { var m = minutesOn(p, d); total += m; if (m >= 5) active++; });
    return { minutes: Math.round(total), days: active };
  }

  function exportAll() {
    data.lastBackup = U.today(); save();
    return JSON.stringify({ kind: 'lantern-voyage-backup', exported: new Date().toISOString(), data: data }, null, 1);
  }
  function exportProfile(p) {
    return JSON.stringify({ kind: 'lantern-voyage-profile', exported: new Date().toISOString(), profile: p }, null, 1);
  }
  function importText(text) {
    var obj = JSON.parse(text);
    if (obj.kind === 'lantern-voyage-backup' && obj.data && obj.data.profiles) {
      data = obj.data; save(); load(); return 'Full backup restored.';
    }
    if (obj.kind === 'lantern-voyage-profile' && obj.profile) {
      var prof = obj.profile; prof.archived = false;
      var existing = data.profiles.filter(function (p) { return p.id === prof.id; })[0];
      if (existing) data.profiles[data.profiles.indexOf(existing)] = prof; else data.profiles.push(prof);
      save(); return prof.name + "'s profile restored.";
    }
    throw new Error('This file is not a Lantern Voyage backup.');
  }

  /* Voice recordings ("Tell the parrot") in IndexedDB. Optional: fails quietly if the browser blocks it. */
  var dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      try {
        var r = indexedDB.open('lanternVoyageAudio', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('rec', { keyPath: 'id' }); };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { rej(r.error); };
      } catch (e) { rej(e); }
    });
    return dbp;
  }
  function saveRecording(rec) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction('rec', 'readwrite'); tx.objectStore('rec').put(rec);
        tx.oncomplete = function () { res(); }; tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function listRecordings(profileId) {
    return db().then(function (d) {
      return new Promise(function (res) {
        var out = []; var tx = d.transaction('rec', 'readonly');
        var req = tx.objectStore('rec').openCursor();
        req.onsuccess = function () {
          var c = req.result;
          if (c) { if (c.value.profileId === profileId) out.push(c.value); c.continue(); } else res(out);
        };
        req.onerror = function () { res([]); };
      });
    }).catch(function () { return []; });
  }

  return { load: load, save: save, get: get, setting: setting, active: active, setActive: setActive, children: children, addChild: addChild,
    islandState: islandState, questState: questState, addError: addError, countToday: countToday, countQuest: countQuest, recordSkill: recordSkill, skillState: skillState,
    addTime: addTime, minutesOn: minutesOn, todayStats: todayStats, goalDots: goalDots, minutesBetween: minutesBetween,
    exportAll: exportAll, exportProfile: exportProfile, importText: importText,
    saveRecording: saveRecording, listRecordings: listRecordings };
})();
