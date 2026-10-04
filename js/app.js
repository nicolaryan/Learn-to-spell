/* Screens: home, level map, game, result, parent gate and parent corner. */

(() => {
  const $ = sel => document.querySelector(sel);

  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    });
    [].concat(children).forEach(c => c != null && n.append(c));
    return n;
  }

  // replaceChildren that ignores null/false entries (used for optional bits).
  const fill = (node, ...kids) => node.replaceChildren(...kids.filter(k => k != null && k !== false));

  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Weighted pick without replacement — weaker sounds come up more often.
  function weightedPick(items, n, weightFn) {
    const pool = items.map(it => ({ it, w: weightFn(it) * (0.6 + Math.random() * 0.8) }));
    pool.sort((a, b) => b.w - a.w);
    return pool.slice(0, n).map(p => p.it);
  }

  const S = () => Model.state;
  const phaseOf = id => PHASES.find(p => p.id === id);
  const PRAISE = ['Brilliant!', 'Well done!', 'Super spelling!', 'Amazing!', 'You got it!', 'Fantastic!', 'Wow!', 'Great listening!'];
  const ENCOURAGE = ['Nearly! Try again.', 'So close! Have another go.', 'Good try! Listen again.'];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function levelLabel(level) {
    if (level.type === 'review') return level.title || 'Review';
    if (level.type === 'tricky') return level.title || 'Tricky words';
    if (level.title) return level.title;
    return level.focus.map(Model.display).join(' ');
  }

  function levelIcon(level) {
    if (level.type === 'review') return '⭐';
    if (level.type === 'tricky') return '🧠';
    return null;
  }

  // ---------- screens ----------

  function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
    window.scrollTo(0, 0);
  }

  function mascot(extraClass = '') {
    const n = $('#mascot-template').content.firstElementChild.cloneNode(true);
    if (extraClass) n.classList.add(extraClass);
    return n;
  }

  function speakOpts() {
    return { rate: S().settings.rate, voiceURI: S().settings.voiceURI };
  }

  // ---------- home ----------

  function renderHome() {
    const name = S().childName;
    $('#home-greeting').textContent = name ? `Hi ${name}!` : 'Hi there!';
    const slot = $('#home-mascot');
    slot.replaceChildren(mascot('big'));
  }

  // ---------- map ----------

  function renderMap() {
    const wrap = $('#map-list');
    wrap.replaceChildren();
    const current = Model.currentLevelIndex();
    let totalStars = 0;

    PHASES.forEach(phase => {
      const section = el('section', { class: 'phase-card', style: `--phase:${phase.colour}` });
      section.append(el('header', {}, [
        el('h2', { text: phase.name }),
        el('p', { text: phase.subtitle }),
      ]));
      const grid = el('div', { class: 'level-grid' });
      LEVELS.forEach((level, idx) => {
        if (level.phase !== phase.id) return;
        const unlocked = Model.isUnlocked(idx);
        const rec = S().levels[level.id];
        const stars = rec ? rec.stars : 0;
        totalStars += stars;
        const icon = levelIcon(level);
        const btn = el('button', {
          class: `level ${unlocked ? '' : 'locked'} ${idx === current ? 'current' : ''} ${level.type || ''}`,
          'aria-label': `${levelLabel(level)}${unlocked ? '' : ' (locked)'}`,
          onclick: () => {
            if (!unlocked) { Sfx.wrong(); btn.classList.add('shake'); setTimeout(() => btn.classList.remove('shake'), 500); return; }
            Sfx.tap();
            startLevel(idx);
          },
        }, [
          el('span', { class: 'level-face' }, unlocked
            ? [icon ? el('span', { class: 'level-icon', text: icon }) : null,
               el('span', { class: `level-text ${levelLabel(level).length > 7 ? 'small' : ''}`, text: icon ? (level.type === 'review' ? 'Review' : 'Tricky') : levelLabel(level) })]
            : [el('span', { class: 'level-icon', text: '🔒' })]),
          el('span', { class: 'level-stars' }, [0, 1, 2].map(i => el('span', { class: i < stars ? 'on' : '', text: '★' }))),
        ]);
        grid.append(btn);
      });
      section.append(grid);
      wrap.append(section);
    });

    $('#star-total').textContent = totalStars;
    // Bring the current level into view.
    requestAnimationFrame(() => {
      const cur = wrap.querySelector('.level.current');
      if (cur) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  // ---------- building a level ----------

  const DISTRACTORS = { p2: 2, p3: 3, p4: 3, p5: 4 };

  function focusTokenIndex(word, level) {
    const focus = level.focus || [];
    let best = -1, bestScore = -1;
    word.tokens.forEach((t, i) => {
      const inFocus = focus.includes(t.key);
      const group = Model.groupFor(t.key);
      if (!inFocus && !(level.type === 'review' && group && group.length > 2)) return;
      const score = (inFocus ? 2 : 0) + Model.weakness(t.key) + t.g.length * 0.1;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  }

  function buildQuestions(idx) {
    const level = LEVELS[idx];
    let words;
    if (level.type === 'tricky') {
      words = weightedPick(Model.levelWords(level), Model.QUESTIONS, w => 0.3 + Model.weakness(w.key));
    } else if (level.type === 'review') {
      const pool = Model.reviewWords(level);
      words = weightedPick(pool, Model.QUESTIONS, w => 0.3 + Math.max(...w.tokens.map(t => Model.weakness(t.key))));
    } else {
      const pool = Model.levelWords(level);
      // Make sure every focus sound gets at least one word, then fill.
      const chosen = [];
      shuffle(level.focus).forEach(k => {
        const options = pool.filter(w => !chosen.includes(w) && w.tokens.some(t => t.key === k));
        if (options.length) chosen.push(weightedPick(options, 1, () => 1)[0]);
      });
      const rest = pool.filter(w => !chosen.includes(w));
      const own = Model.QUESTIONS - (idx > 0 ? 1 : 0);
      chosen.push(...weightedPick(rest, Math.max(0, own - chosen.length), w =>
        0.3 + Math.max(...w.tokens.filter(t => level.focus.includes(t.key)).map(t => Model.weakness(t.key)), 0)));
      // One word from an earlier level keeps old sounds fresh.
      if (idx > 0) {
        const earlier = LEVELS.slice(0, idx).filter(l => !l.type).flatMap(Model.levelWords);
        chosen.push(...weightedPick(earlier, 1, w => 0.2 + Math.max(...w.tokens.map(t => Model.weakness(t.key)))));
      }
      words = shuffle(chosen.slice(0, Model.QUESTIONS));
    }

    const phase5 = level.phase === 'p5' && level.type !== 'tricky';
    return words.map((word, qi) => {
      let mode = 'build';
      let focusIdx = -1;
      if (phase5 && qi % 2 === 1) {
        const lvl = level.type === 'review' ? LEVELS[Model.levelIndex(word.levelId)] : level;
        focusIdx = focusTokenIndex(word, level.type === 'review' ? level : lvl);
        if (focusIdx < 0) focusIdx = focusTokenIndex(word, lvl);
        const group = focusIdx >= 0 ? Model.groupFor(word.tokens[focusIdx].key) : null;
        if (group && group.length >= 2) mode = 'choose';
      }
      return { word, mode, focusIdx };
    });
  }

  function distractorTiles(word, idx) {
    const level = LEVELS[idx];
    const n = word.tricky ? 3 : DISTRACTORS[level.phase] || 3;
    const used = new Set(word.tiles.map(t => t.t));
    const out = [];
    const add = txt => { if (!used.has(txt) && !out.includes(txt) && out.length < n) out.push(txt); };

    if (word.tricky) {
      const vowels = shuffle(['a', 'e', 'i', 'o', 'u', 'y']);
      const cons = shuffle(['s', 't', 'r', 'n', 'l', 'h', 'w', 'd', 'm']);
      vowels.slice(0, 2).forEach(add);
      cons.forEach(add);
      return out;
    }
    // Same-sound spellings first — these are the real spelling choices.
    shuffle(word.tokens).forEach(t => {
      const group = Model.groupFor(t.key) || [];
      shuffle(group).forEach(k => {
        if (k === t.key || /-e$/.test(Model.display(k))) return;
        if (level.phase === 'p2' || level.phase === 'p3') {
          if (!Model.taughtKeys(idx).has(k)) return;
        }
        if (out.length < Math.ceil(n / 2)) add(Model.display(k));
      });
    });
    const taught = shuffle([...Model.taughtKeys(idx)].map(Model.display).filter(d => !/-e$/.test(d)));
    taught.forEach(add);
    return out;
  }

  // ---------- game ----------

  let game = null;

  function startLevel(idx) {
    Sfx.unlock();
    game = { idx, level: LEVELS[idx], questions: buildQuestions(idx), qi: 0, firstTry: [] };
    show('screen-game');
    renderQuestion();
  }

  function sayWord(q) {
    const sentence = SENTENCES[q.word.word];
    const text = sentence ? `${q.word.word}. ... ${sentence} ... ${q.word.word}.` : `${q.word.word}.`;
    const pic = $('#game-picture');
    pic.classList.add('talking');
    Speech.speak(text, speakOpts()).then(() => pic.classList.remove('talking'));
  }

  function renderProgress() {
    const dots = $('#game-progress');
    dots.replaceChildren(...game.questions.map((_, i) => el('span', {
      class: i < game.qi ? (game.firstTry[i] ? 'done good' : 'done') : i === game.qi ? 'now' : '',
    })));
  }

  function renderQuestion() {
    const q = game.questions[game.qi];
    q.attempts = 0;
    renderProgress();
    $('#game-level-name').textContent = levelLabel(game.level);
    $('#game-feedback').textContent = '';
    $('#game-feedback').className = 'feedback';

    const emoji = PICTURES[q.word.word];
    const pic = $('#game-picture');
    pic.replaceChildren(emoji ? el('span', { class: 'emoji', text: emoji }) : el('span', { class: 'emoji listen-only', text: '🔊' }));
    pic.classList.remove('pop'); void pic.offsetWidth; pic.classList.add('pop');

    $('#game-instruction').textContent = q.mode === 'choose'
      ? 'Which spelling is right?'
      : q.word.tricky ? 'Spell the tricky word' : 'Spell the word';

    if (q.mode === 'choose') renderChoose(q); else renderBuild(q);
    setTimeout(() => sayWord(q), 350);
  }

  // --- build mode: drag-free tap-to-place tiles ---

  function renderBuild(q) {
    const showButtons = S().settings.soundButtons && !q.word.tricky;
    q.slots = q.word.tiles.map(() => null);
    q.order = [];
    const tray = shuffle([
      ...q.word.tiles.map(t => t.t),
      ...distractorTiles(q.word, game.idx),
    ]).map((t, i) => ({ t, id: i, used: false }));
    q.tray = tray;

    const slotsEl = $('#game-slots');
    slotsEl.className = 'slots';
    slotsEl.replaceChildren(...q.word.tiles.map((tile, si) => {
      const tok = q.word.tokens[tile.gi];
      const marker = showButtons ? el('span', { class: `sound-btn ${tile.t.length > 1 ? 'dash' : 'dot'} ${tok.split ? 'split' : ''}` }) : null;
      return el('button', { class: `slot ${tile.t.length > 1 ? 'wide' : ''}`, 'data-si': si, onclick: () => unplace(q, si) }, [
        el('span', { class: 'slot-text' }), marker,
      ]);
    }));

    const trayEl = $('#game-tray');
    trayEl.className = 'tray';
    trayEl.replaceChildren(...tray.map(tile => el('button', {
      class: 'tile', 'data-id': tile.id, onclick: () => place(q, tile),
    }, [el('span', { text: tile.t })])));

    $('#game-actions').replaceChildren(
      el('button', { class: 'btn ghost', onclick: () => undo(q), 'aria-label': 'Undo' }, '↩︎ Undo'),
      el('button', { class: 'btn primary', id: 'check-btn', disabled: true, onclick: () => checkBuild(q) }, '✓ Check'),
    );
  }

  function refreshBuild(q) {
    document.querySelectorAll('#game-slots .slot').forEach((s, si) => {
      const id = q.slots[si];
      s.querySelector('.slot-text').textContent = id == null ? '' : q.tray[id].t;
      s.classList.toggle('filled', id != null);
    });
    document.querySelectorAll('#game-tray .tile').forEach(t => {
      t.classList.toggle('used', q.tray[+t.dataset.id].used);
    });
    const full = q.slots.every(s => s != null);
    const btn = $('#check-btn');
    if (btn) { btn.disabled = !full; btn.classList.toggle('pulse', full); }
  }

  function place(q, tile) {
    if (q.locked || tile.used) return;
    const si = q.slots.findIndex(s => s == null);
    if (si < 0) return;
    Sfx.pop();
    q.slots[si] = tile.id;
    tile.used = true;
    q.order.push(si);
    refreshBuild(q);
    const slot = document.querySelector(`#game-slots .slot[data-si="${si}"]`);
    slot.classList.remove('bounce'); void slot.offsetWidth; slot.classList.add('bounce');
  }

  function unplace(q, si) {
    if (q.locked || q.slots[si] == null || q.fixed?.has(si)) return;
    Sfx.tap();
    q.tray[q.slots[si]].used = false;
    q.slots[si] = null;
    q.order = q.order.filter(x => x !== si);
    refreshBuild(q);
  }

  function undo(q) {
    const si = q.order[q.order.length - 1];
    if (si != null) unplace(q, si);
  }

  function checkBuild(q) {
    if (q.locked) return;
    q.attempts += 1;
    const got = q.slots.map(id => q.tray[id].t);
    const slotOk = got.map((t, i) => t === q.word.tiles[i].t);
    const allOk = slotOk.every(Boolean);

    if (q.attempts === 1) recordBuild(q, slotOk, got.join(''));

    const slotEls = document.querySelectorAll('#game-slots .slot');
    if (allOk) {
      q.locked = true;
      slotEls.forEach(s => s.classList.add('right'));
      return correct(q);
    }

    Sfx.wrong();
    q.fixed = q.fixed || new Set();
    slotEls.forEach((s, i) => {
      if (slotOk[i]) { s.classList.add('right'); q.fixed.add(i); } else s.classList.add('wrong');
    });

    if (q.attempts >= 2) return reveal(q);

    feedback(pick(ENCOURAGE), 'try');
    q.locked = true;
    setTimeout(() => {
      slotEls.forEach((s, i) => {
        s.classList.remove('wrong');
        if (!slotOk[i]) {
          q.tray[q.slots[i]].used = false;
          q.slots[i] = null;
        }
      });
      q.order = q.order.filter(si => q.slots[si] != null);
      q.locked = false;
      refreshBuild(q);
      sayWord(q);
    }, 900);
  }

  function recordBuild(q, slotOk, gotWord) {
    const word = q.word;
    if (word.tricky) {
      Model.record(word.key, slotOk.every(Boolean), word.word, gotWord);
    } else {
      word.tokens.forEach((tok, gi) => {
        const ok = word.tiles.every((t, i) => t.gi !== gi || slotOk[i]);
        Model.record(tok.key, ok, word.word, gotWord);
      });
      const srcLevel = LEVELS[Model.levelIndex(word.levelId)];
      const pattern = (srcLevel.focus || []).find(k => k.startsWith('p4:'));
      if (pattern) Model.record(pattern, slotOk.every(Boolean), word.word, gotWord);
    }
    game.firstTry[game.qi] = slotOk.every(Boolean);
    Model.save();
  }

  // --- choose mode: pick the right grapheme for the gap ---

  function renderChoose(q) {
    const word = q.word;
    const target = word.tokens[q.focusIdx];
    const blankGi = q.focusIdx;

    // One blank for the target sound, even for a split digraph, so the gap
    // doesn't give away which spelling it is.
    const slotsEl = $('#game-slots');
    slotsEl.className = 'slots choose';
    slotsEl.replaceChildren(...word.tiles
      .filter((tile, i) => tile.gi !== blankGi || word.tiles.findIndex(t => t.gi === blankGi) === i)
      .map(tile => el('span', {
        class: `slot ${tile.gi === blankGi ? 'blank wide' : 'given'} ${tile.t.length > 1 ? 'wide' : ''}`,
      }, [el('span', { class: 'slot-text', text: tile.gi === blankGi ? '' : tile.t })])));

    const group = Model.groupFor(target.key);
    const taught = Model.taughtKeys(game.idx);
    const targetDisplay = Model.display(target.key);
    let alts = shuffle(group.filter(k => k !== target.key && Model.display(k) !== targetDisplay));
    const taughtAlts = alts.filter(k => taught.has(k));
    if (taughtAlts.length >= 2) alts = taughtAlts;
    const seen = new Set([targetDisplay]);
    const options = [targetDisplay];
    alts.forEach(k => {
      const d = Model.display(k);
      if (!seen.has(d) && options.length < 3) { seen.add(d); options.push(d); }
    });

    const trayEl = $('#game-tray');
    trayEl.className = 'tray options';
    trayEl.replaceChildren(...shuffle(options).map(opt => el('button', {
      class: 'tile option', onclick: e => chooseOption(q, opt, targetDisplay, e.currentTarget),
    }, [el('span', { text: opt.replace('-', '‑') })])));

    $('#game-actions').replaceChildren();
  }

  // Show the whole word in the slots (rebuilt, as choose mode hides a split digraph's "e").
  function fillWord(q, cls) {
    $('#game-slots').replaceChildren(...q.word.tiles.map(t => el('span', {
      class: `slot ${cls} ${t.t.length > 1 ? 'wide' : ''}`,
    }, [el('span', { class: 'slot-text', text: t.t })])));
  }

  function chooseOption(q, opt, target, btn) {
    if (q.locked || btn.disabled) return;
    q.attempts += 1;
    const ok = opt === target;
    if (q.attempts === 1) {
      Model.record(q.word.tokens[q.focusIdx].key, ok, q.word.word, opt);
      game.firstTry[game.qi] = ok;
      Model.save();
    }
    if (ok) {
      q.locked = true;
      btn.classList.add('right');
      fillWord(q, 'right');
      return correct(q);
    }
    Sfx.wrong();
    btn.classList.add('wrong', 'shake');
    btn.disabled = true;
    if (q.attempts >= 2) return reveal(q);
    feedback(pick(ENCOURAGE), 'try');
    setTimeout(() => sayWord(q), 500);
  }

  // --- shared outcomes ---

  function feedback(text, kind) {
    const f = $('#game-feedback');
    f.textContent = text;
    f.className = `feedback show ${kind}`;
  }

  function correct(q) {
    Sfx.correct();
    confetti();
    const m = $('#game-mascot');
    m.classList.remove('jump'); void m.offsetWidth; m.classList.add('jump');
    const praise = pick(PRAISE);
    feedback(`${praise} ${q.word.word}`, 'good');
    highlightFocus(q);
    Speech.speak(`${praise} ${q.word.word}!`, speakOpts());
    setTimeout(nextQuestion, 2200);
  }

  function highlightFocus(q) {
    const level = game.level;
    const focus = level.focus || [];
    const slotEls = document.querySelectorAll('#game-slots .slot');
    q.word.tiles.forEach((t, i) => {
      if (focus.includes(t.key) || (q.mode === 'choose' && t.gi === q.focusIdx)) slotEls[i].classList.add('focus');
    });
  }

  function reveal(q) {
    q.locked = true;
    game.firstTry[game.qi] = false;
    setTimeout(() => {
      fillWord(q, 'shown');
      feedback(`This is how we spell ${q.word.word}.`, 'reveal');
      Speech.speak(`This is how we spell ${q.word.word}.`, speakOpts());
      $('#game-actions').replaceChildren(
        el('button', { class: 'btn primary', onclick: nextQuestion }, 'Next ➜'),
      );
    }, 700);
  }

  function nextQuestion() {
    if (!game) return;
    game.qi += 1;
    if (game.qi >= game.questions.length) return finishLevel();
    renderQuestion();
  }

  // ---------- result ----------

  function finishLevel() {
    const correctCount = game.firstTry.filter(Boolean).length;
    const stars = Model.finishLevel(game.level.id, correctCount);
    renderProgress();
    show('screen-result');

    const passed = stars > 0;
    $('#result-title').textContent = passed ? 'Level complete!' : 'Good practice!';
    $('#result-sub').textContent = passed
      ? `You spelled ${correctCount} out of ${game.questions.length} first time.`
      : `You got ${correctCount} out of ${game.questions.length}. Let's try again to win a star!`;
    $('#result-mascot').replaceChildren(mascot(passed ? 'dance' : ''));

    const starsEl = $('#result-stars');
    starsEl.replaceChildren(...[0, 1, 2].map(() => el('span', { class: 'big-star', text: '★' })));
    [...starsEl.children].forEach((s, i) => {
      if (i < stars) setTimeout(() => { s.classList.add('on'); Sfx.star(i); }, 500 + i * 450);
    });

    if (passed) {
      Sfx.fanfare();
      setTimeout(() => confetti(120), 300);
      const name = S().childName;
      Speech.speak(`${stars === 3 ? 'Wow! Three stars!' : 'Well done!'}${name ? ' ' + name + '!' : ''}`, speakOpts());
    } else {
      Speech.speak("Good practice! Let's try again.", speakOpts());
    }

    const hasNext = game.idx + 1 < LEVELS.length;
    fill($('#result-actions'),
      el('button', { class: 'btn ghost', onclick: () => { renderMap(); show('screen-map'); } }, '🗺️ Map'),
      el('button', { class: 'btn ghost', onclick: () => startLevel(game.idx) }, '🔁 Again'),
      passed && hasNext ? el('button', { class: 'btn primary', onclick: () => startLevel(game.idx + 1) }, 'Next ➜') : null,
    );
  }

  // ---------- confetti ----------

  function confetti(count = 45) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = $('#confetti');
    const colours = ['#ff6b6b', '#ffc94a', '#5fd3a5', '#6ab8ff', '#b28dff', '#ff8ad8'];
    for (let i = 0; i < count; i++) {
      const p = el('i', {
        style: [
          `left:${Math.random() * 100}vw`,
          `background:${pick(colours)}`,
          `animation-delay:${Math.random() * 0.25}s`,
          `animation-duration:${1.2 + Math.random() * 1.2}s`,
          `--drift:${(Math.random() - 0.5) * 200}px`,
          `--spin:${(Math.random() - 0.5) * 1080}deg`,
          `width:${6 + Math.random() * 8}px`,
          `height:${8 + Math.random() * 10}px`,
          Math.random() > 0.7 ? 'border-radius:50%' : '',
        ].join(';'),
      });
      layer.append(p);
      setTimeout(() => p.remove(), 2800);
    }
  }

  // ---------- grown-ups gate ----------

  let gateAnswer = 0;
  function openGate() {
    const a = 3 + Math.floor(Math.random() * 7);
    const b = 3 + Math.floor(Math.random() * 7);
    gateAnswer = a * b;
    $('#gate-question').textContent = `What is ${a} × ${b}?`;
    $('#gate-input').value = '';
    $('#gate-error').textContent = '';
    show('screen-gate');
    setTimeout(() => $('#gate-input').focus(), 50);
  }

  function submitGate(e) {
    e.preventDefault();
    if (+$('#gate-input').value === gateAnswer) {
      renderParent();
      show('screen-parent');
    } else {
      $('#gate-error').textContent = 'Not quite — try another one.';
      setTimeout(openGate, 900);
    }
  }

  // ---------- parent corner ----------

  function catalogue() {
    return PHASES.map(phase => {
      const sounds = [];
      const tricky = [];
      LEVELS.filter(l => l.phase === phase.id).forEach(level => {
        if (level.type === 'tricky') {
          level.words.forEach(w => tricky.push({ key: `hrs:${w}`, label: w, level }));
        } else if (!level.type) {
          const words = Model.levelWords(level);
          level.focus.forEach(key => {
            if (sounds.some(s => s.key === key)) return;
            const example = words.find(w => w.tokens.some(t => t.key === key));
            const pattern = PATTERN_LABELS[key];
            sounds.push({
              key,
              label: pattern ? pattern.label : Model.display(key).replace('-', '‑'),
              sound: !pattern && key.includes(':') && key.split(':')[1] !== 'short' ? `/${key.split(':')[1]}/` : '',
              example: pattern ? pattern.hint : example ? example.word : '',
              level,
            });
          });
        }
      });
      return { phase, sounds, tricky };
    });
  }

  const STATUS_TEXT = {
    green: 'Confident', amber: 'Getting there', red: 'Needs practice', none: 'Not tried yet',
  };

  function renderParent() {
    const cat = catalogue();
    const all = cat.flatMap(c => [...c.sounds, ...c.tricky]);
    const counts = { green: 0, amber: 0, red: 0, none: 0 };
    all.forEach(item => counts[Model.status(item.key)]++);

    const current = LEVELS[Model.currentLevelIndex()];
    const name = S().childName || 'Your child';
    const weakest = all.filter(i => Model.status(i.key) === 'red')
      .sort((a, b) => Model.accuracy(a.key) - Model.accuracy(b.key)).slice(0, 6);

    fill($('#parent-summary'),
      el('p', { class: 'lead' }, [
        `${name} is up to `,
        el('strong', { text: `${phaseOf(current.phase).name}: ${levelLabel(current)}` }),
        '.',
      ]),
      el('div', { class: 'tally' }, ['green', 'amber', 'red', 'none'].map(s =>
        el('div', { class: `tally-item ${s}` }, [el('b', { text: counts[s] }), el('span', { text: STATUS_TEXT[s] })]))),
      weakest.length ? el('p', { class: 'focus-next' }, [
        el('strong', { text: 'Worth practising together: ' }),
        weakest.map(w => w.label).join(', '),
      ]) : null,
    );

    const phasesEl = $('#parent-phases');
    phasesEl.replaceChildren(...cat.map(({ phase, sounds, tricky }) =>
      el('section', { class: 'parent-phase', style: `--phase:${phase.colour}` }, [
        el('header', {}, [el('h3', { text: `${phase.name} · ${phase.subtitle}` }), el('span', { text: phase.when })]),
        el('div', { class: 'chips' }, sounds.map(s => chip(s, false))),
        tricky.length ? el('h4', { text: 'Tricky words (harder to read and spell)' }) : null,
        tricky.length ? el('div', { class: 'chips small' }, tricky.map(s => chip(s, true))) : null,
      ])));

    renderSettings();
  }

  function chip(item, small) {
    const st = Model.status(item.key);
    const acc = Model.accuracy(item.key);
    return el('button', {
      class: `chip ${st} ${small ? 'small' : ''}`,
      title: `${item.label}: ${STATUS_TEXT[st]}${acc != null ? ` (${Math.round(acc * 100)}%)` : ''}`,
      onclick: () => openDetail(item),
    }, [
      el('span', { class: 'chip-label', text: item.label }, item.sound ? [el('sup', { text: item.sound })] : []),
      !small && item.example ? el('span', { class: 'chip-example', text: item.example }) : null,
    ]);
  }

  function openDetail(item) {
    const k = S().keys[item.key];
    const st = Model.status(item.key);
    const acc = Model.accuracy(item.key);
    const mistakes = S().mistakes[item.key] || [];
    const body = $('#detail-body');
    fill(body,
      el('div', { class: `detail-head ${st}` }, [
        el('span', { class: 'detail-label', text: item.label }),
        el('div', {}, [
          el('strong', { text: STATUS_TEXT[st] }),
          el('p', { text: item.example ? `e.g. ${item.example}` : '' }),
        ]),
      ]),
      k ? el('p', {}, [
        `Right first time in ${Math.round(acc * 100)}% of the last ${k.h.length} goes `,
        el('span', { class: 'muted', text: `(${k.c} of ${k.n} all-time)` }),
      ]) : el('p', { text: 'Not practised yet.' }),
      k ? el('div', { class: 'history' }, k.h.map(v => el('span', { class: v ? 'ok' : 'no', title: v ? 'right' : 'wrong' }))) : null,
      mistakes.length ? el('h4', { text: 'Recent mix-ups' }) : null,
      mistakes.length ? el('ul', { class: 'mistakes' }, mistakes.map(m =>
        el('li', {}, [el('span', { class: 'target', text: m.w }), ' → ', el('span', { class: 'got', text: m.got })]))) : null,
      el('p', { class: 'muted', text: `Taught in: ${phaseOf(item.level.phase).name}, level “${levelLabel(item.level)}”.` }),
    );
    $('#detail').showModal();
  }

  function renderSettings() {
    const s = S().settings;
    $('#set-name').value = S().childName || '';
    $('#set-rate').value = s.rate;
    $('#set-sound').checked = s.sound;
    $('#set-buttons').checked = s.soundButtons;
    $('#set-unlock').checked = s.unlockAll;

    const startSel = $('#set-start');
    startSel.replaceChildren(el('option', { value: '', text: '— beginning of Phase 2 —' }),
      ...LEVELS.map(l => el('option', { value: l.id, text: `${phaseOf(l.phase).name}: ${levelLabel(l)}` })));
    startSel.value = s.unlockTo || '';

    const voiceSel = $('#set-voice');
    const voices = Speech.voices();
    voiceSel.replaceChildren(el('option', { value: '', text: 'Automatic (British if available)' }),
      ...voices.map(v => el('option', { value: v.voiceURI, text: `${v.name} (${v.lang})` })));
    voiceSel.value = s.voiceURI || '';
  }

  function bindSettings() {
    const s = () => S().settings;
    $('#set-name').addEventListener('input', e => { S().childName = e.target.value.trim(); Model.save(); });
    $('#set-rate').addEventListener('change', e => { s().rate = +e.target.value; Model.save(); Speech.speak('Hello! Let us spell.', speakOpts()); });
    $('#set-voice').addEventListener('change', e => { s().voiceURI = e.target.value || null; Model.save(); Speech.speak('Hello! Let us spell.', speakOpts()); });
    $('#set-sound').addEventListener('change', e => { s().sound = e.target.checked; Sfx.setEnabled(e.target.checked); Model.save(); });
    $('#set-buttons').addEventListener('change', e => { s().soundButtons = e.target.checked; Model.save(); });
    $('#set-unlock').addEventListener('change', e => { s().unlockAll = e.target.checked; Model.save(); });
    $('#set-start').addEventListener('change', e => { s().unlockTo = e.target.value || null; Model.save(); });
    $('#set-reset').addEventListener('click', () => {
      if (confirm('Reset all stars and the traffic-light history? Settings are kept.')) {
        Model.reset();
        renderParent();
      }
    });
  }

  // ---------- wiring ----------

  function init() {
    Model.load();
    Sfx.setEnabled(S().settings.sound);
    $('#game-mascot').replaceChildren(mascot('small'));
    renderHome();

    $('#play-btn').addEventListener('click', () => {
      Sfx.unlock();
      Sfx.tap();
      const name = S().childName;
      Speech.speak(name ? `Let's spell, ${name}!` : "Let's spell!", speakOpts());
      renderMap();
      show('screen-map');
    });
    document.querySelectorAll('[data-go-home]').forEach(b => b.addEventListener('click', () => { renderHome(); show('screen-home'); }));
    document.querySelectorAll('[data-grownups]').forEach(b => b.addEventListener('click', openGate));
    $('#game-home').addEventListener('click', () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      game = null;
      renderMap();
      show('screen-map');
    });
    $('#game-listen').addEventListener('click', () => game && sayWord(game.questions[game.qi]));
    $('#game-picture').addEventListener('click', () => game && sayWord(game.questions[game.qi]));
    $('#gate-form').addEventListener('submit', submitGate);
    $('#gate-cancel').addEventListener('click', () => { renderHome(); show('screen-home'); });
    $('#parent-back').addEventListener('click', () => { renderHome(); show('screen-home'); });
    $('#detail-close').addEventListener('click', () => $('#detail').close());
    $('#detail').addEventListener('click', e => { if (e.target.id === 'detail') $('#detail').close(); });
    bindSettings();

    if (!Speech.available()) {
      $('#no-speech').hidden = false;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
