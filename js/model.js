/* Word parsing, progress storage and the traffic-light mastery rules. */

const Model = (() => {
  const STORAGE_KEY = 'spelling-stars-v1';
  const HISTORY = 8;      // how many recent goes count towards a sound's colour
  const PASS_MARK = 4;    // first-try correct answers (out of QUESTIONS) to pass a level
  const QUESTIONS = 6;

  // ---------- parsing ----------

  // "c.a-e.k" -> [{g:'a-e', key:'a-e', split:true}, ...]
  function parseToken(tok) {
    const [g, sound] = tok.split(':');
    return {
      g,
      key: sound ? `${g}:${sound}` : g,
      split: /^[a-z]-e$/.test(g),
    };
  }

  // Turn a word into the tiles she will place, in spelling order.
  // Split digraphs put their "e" after the following grapheme: c a-e k -> c a k e.
  function expand(tokens) {
    const tiles = [];
    let pendingE = null;
    tokens.forEach((t, gi) => {
      if (t.split) {
        tiles.push({ t: t.g[0], gi, key: t.key });
        pendingE = { t: 'e', gi, key: t.key };
        return;
      }
      tiles.push({ t: t.g, gi, key: t.key });
      if (pendingE) { tiles.push(pendingE); pendingE = null; }
    });
    if (pendingE) tiles.push(pendingE);
    return tiles;
  }

  function wordItem(raw, level) {
    if (level.type === 'tricky') {
      const tokens = raw.split('').map(ch => ({ g: ch, key: ch, split: false }));
      return { raw, word: raw, tokens, tiles: expand(tokens), tricky: true, key: `hrs:${raw}`, levelId: level.id };
    }
    const tokens = raw.split('.').map(parseToken);
    const tiles = expand(tokens);
    return { raw, word: tiles.map(t => t.t).join(''), tokens, tiles, tricky: false, levelId: level.id };
  }

  function levelWords(level) {
    return (level.words || []).map(w => wordItem(w, level));
  }

  function levelIndex(id) { return LEVELS.findIndex(l => l.id === id); }

  // Words a review level draws on: every normal level in the phase, up to the review.
  function reviewWords(level) {
    const idx = levelIndex(level.id);
    return LEVELS.slice(0, idx)
      .filter(l => l.phase === level.phase && !l.type)
      .flatMap(levelWords);
  }

  // All graphemes taught up to and including a level (for distractor tiles).
  function taughtKeys(uptoIdx) {
    const keys = new Set();
    LEVELS.slice(0, uptoIdx + 1).forEach(l => {
      if (l.type) return;
      levelWords(l).forEach(w => w.tokens.forEach(t => keys.add(t.key)));
    });
    return keys;
  }

  function groupFor(key) {
    return SOUND_GROUPS.find(g => g.includes(key)) || null;
  }

  function display(key) {
    return key.split(':')[0];
  }

  // ---------- stored state ----------

  const defaults = () => ({
    childName: '',
    levels: {},        // id -> { stars, best, plays }
    keys: {},          // key -> { h: [1,0,...], n, c }
    mistakes: {},      // key -> [{ w, got, t }]
    settings: { rate: 0.85, voiceURI: null, sound: true, soundButtons: true, unlockAll: false, unlockTo: null },
  });

  let state = defaults();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        state = { ...defaults(), ...saved, settings: { ...defaults().settings, ...(saved.settings || {}) } };
      }
    } catch (e) { /* private mode etc: play without saving */ }
    return state;
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function reset() {
    const keep = { childName: state.childName, settings: state.settings };
    state = { ...defaults(), ...keep };
    save();
  }

  function record(key, ok, word, got) {
    const k = state.keys[key] || (state.keys[key] = { h: [], n: 0, c: 0 });
    k.h.push(ok ? 1 : 0);
    if (k.h.length > HISTORY) k.h.shift();
    k.n += 1;
    if (ok) k.c += 1;
    if (!ok) {
      const m = state.mistakes[key] || (state.mistakes[key] = []);
      m.unshift({ w: word, got, t: Date.now() });
      if (m.length > 5) m.pop();
    }
  }

  // Traffic light for one sound/word.
  //   none  – not tried yet
  //   red   – under half right recently
  //   amber – learning (or fewer than 4 goes)
  //   green – 4+ goes and at least 80% right recently
  function status(key) {
    const k = state.keys[key];
    if (!k || !k.h.length) return 'none';
    const acc = accuracy(key);
    if (k.h.length >= 4 && acc >= 0.8) return 'green';
    if (k.h.length >= 2 && acc < 0.5) return 'red';
    return 'amber';
  }

  function accuracy(key) {
    const k = state.keys[key];
    if (!k || !k.h.length) return null;
    return k.h.reduce((a, b) => a + b, 0) / k.h.length;
  }

  // 0 = not seen (practise first), higher = weaker
  function weakness(key) {
    const acc = accuracy(key);
    if (acc === null) return 0.6;
    return 1 - acc;
  }

  function finishLevel(id, correct) {
    const stars = correct >= QUESTIONS ? 3 : correct >= QUESTIONS - 1 ? 2 : correct >= PASS_MARK ? 1 : 0;
    const l = state.levels[id] || (state.levels[id] = { stars: 0, best: 0, plays: 0 });
    l.plays += 1;
    l.stars = Math.max(l.stars, stars);
    l.best = Math.max(l.best, correct);
    save();
    return stars;
  }

  function isUnlocked(idx) {
    if (idx === 0 || state.settings.unlockAll) return true;
    const unlockTo = state.settings.unlockTo ? levelIndex(state.settings.unlockTo) : -1;
    if (idx <= unlockTo) return true;
    const prev = state.levels[LEVELS[idx - 1].id];
    return !!(prev && prev.stars > 0);
  }

  function currentLevelIndex() {
    for (let i = 0; i < LEVELS.length; i++) {
      const l = state.levels[LEVELS[i].id];
      if (isUnlocked(i) && !(l && l.stars > 0)) return i;
    }
    return LEVELS.length - 1;
  }

  return {
    QUESTIONS, PASS_MARK,
    parseToken, expand, wordItem, levelWords, reviewWords, levelIndex, taughtKeys, groupFor, display,
    load, save, reset, record, status, accuracy, weakness, finishLevel, isUnlocked, currentLevelIndex,
    get state() { return state; },
  };
})();
