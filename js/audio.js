/* Speech (the browser's built-in text-to-speech) and little synthesised sound effects. */

const Speech = (() => {
  let voices = [];

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Prefer a British voice so words sound the way they do in class.
  function pickVoice(preferredURI) {
    if (preferredURI) {
      const chosen = voices.find(v => v.voiceURI === preferredURI);
      if (chosen) return chosen;
    }
    const gb = voices.filter(v => v.lang.replace('_', '-').toLowerCase() === 'en-gb');
    const nice = /(female|martha|serena|kate|stephanie|libby|sonia|google uk english female)/i;
    return gb.find(v => nice.test(v.name)) || gb[0] || voices[0] || null;
  }

  function speak(text, { rate = 0.85, voiceURI = null } = {}) {
    return new Promise(resolve => {
      if (!('speechSynthesis' in window)) return resolve();
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(voiceURI);
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
      u.rate = rate;
      u.pitch = 1.05;
      u.onend = resolve;
      u.onerror = resolve;
      window.speechSynthesis.speak(u);
    });
  }

  return {
    speak,
    available: () => 'speechSynthesis' in window,
    voices: () => voices,
  };
})();

const Sfx = (() => {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type = 'sine', vol = 0.18) {
    const c = ac();
    if (!c || !enabled) return;
    const t = c.currentTime + start;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  return {
    setEnabled(on) { enabled = on; },
    unlock() { ac(); },
    tap() { tone(660, 0, 0.08, 'triangle', 0.12); },
    pop() { tone(520, 0, 0.06, 'sine', 0.1); tone(780, 0.04, 0.08, 'sine', 0.1); },
    correct() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle')); },
    wrong() { tone(330, 0, 0.18, 'sine', 0.12); tone(262, 0.16, 0.25, 'sine', 0.12); },
    fanfare() {
      [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) =>
        tone(f, i * 0.12, i === 7 ? 0.6 : 0.16, 'triangle', 0.16));
    },
    star(i) { tone(880 + i * 220, 0, 0.3, 'triangle', 0.15); },
  };
})();
