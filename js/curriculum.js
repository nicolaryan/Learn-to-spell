/*
 * Curriculum data — based on the Essential Letters and Sounds (ELS) teaching sequence.
 *
 * Edit this file to match your school's exact ELS planning sheet.
 *
 * WORD FORMAT
 *   Words are written as their graphemes (sounds) separated by dots:
 *     "r.ai.n"      -> r + ai + n
 *     "c.a-e.k"     -> split digraph a-e: spelled c-a-k-e
 *     "s.n.ow:oa"   -> "ow" making the /oa/ sound. The part after ":" just tells
 *                      the parent view which grapheme-sound pair to track.
 *     "i-e.c:s"     -> "ice": i-e split digraph, c making the /s/ sound
 *
 * LEVEL TYPES
 *   (default)  practise the level's focus graphemes
 *   review     mixed practice from the whole phase, biased towards weak sounds
 *   tricky     ELS "Harder to Read and Spell" words, spelled letter by letter
 */

const PHASES = [
  { id: 'p2', name: 'Phase 2', subtitle: 'First sounds', when: 'Reception · Autumn 1', colour: '#ff8a7a' },
  { id: 'p3', name: 'Phase 3', subtitle: 'Digraphs & trigraphs', when: 'Reception · Autumn 2 – Spring', colour: '#ffc94a' },
  { id: 'p4', name: 'Phase 4', subtitle: 'Blending consonants', when: 'Reception · Summer', colour: '#5fd3a5' },
  { id: 'p5', name: 'Phase 5', subtitle: 'New spellings & alternatives', when: 'Year 1', colour: '#6ab8ff' },
];

const LEVELS = [
  // ---------------- PHASE 2 ----------------
  { id: 'p2-1', phase: 'p2', focus: ['s', 'a', 't', 'p'],
    words: ['a.t', 's.a.t', 'p.a.t', 't.a.p', 't.a.p.s', 'p.a.t.s'] },
  { id: 'p2-2', phase: 'p2', focus: ['i', 'n', 'm', 'd'],
    words: ['p.i.n', 't.i.n', 's.i.t', 'm.a.p', 'm.a.n', 'd.a.d', 's.a.d', 'd.i.p', 'n.a.p', 't.i.p', 'd.i.d', 'p.a.n'] },
  { id: 'p2-3', phase: 'p2', focus: ['g', 'o', 'c', 'k'],
    words: ['d.o.g', 'c.a.t', 'p.i.g', 'c.a.p', 't.o.p', 'm.o.p', 'p.o.t', 'k.i.d', 'g.o.t', 'd.i.g', 'c.a.n', 'k.i.t'] },
  { id: 'p2-4', phase: 'p2', focus: ['ck', 'e', 'u', 'r'],
    words: ['d.u.ck', 's.o.ck', 'r.o.ck', 'k.i.ck', 'p.e.n', 'r.e.d', 's.u.n', 'n.u.t', 'c.u.p', 'r.a.t', 't.e.n', 'n.e.t', 'r.u.n', 'm.u.d'] },
  { id: 'p2-5', phase: 'p2', focus: ['h', 'b', 'f', 'l'],
    words: ['h.a.t', 'h.e.n', 'b.u.s', 'b.a.t', 'b.e.d', 'f.a.n', 'l.o.g', 'l.e.g', 'l.i.p', 'h.u.t', 'b.a.g', 'h.u.g', 'b.u.g', 'f.u.n'] },
  { id: 'p2-6', phase: 'p2', focus: ['ff', 'll', 'ss'],
    words: ['o.ff', 'p.u.ff', 'c.u.ff', 'b.e.ll', 'd.o.ll', 'h.i.ll', 'f.e.ll', 'k.i.ss', 'm.e.ss', 'h.i.ss', 'b.o.ss', 't.e.ll', 'f.u.ss', 'l.e.ss'] },
  { id: 'p2-r', phase: 'p2', type: 'review' },
  { id: 'p2-t', phase: 'p2', type: 'tricky',
    words: ['is', 'I', 'the', 'put', 'pull', 'full', 'as', 'and', 'has', 'his', 'her', 'go', 'no', 'to', 'into', 'she', 'push', 'he', 'of', 'we', 'me', 'be'] },

  // ---------------- PHASE 3 ----------------
  { id: 'p3-1', phase: 'p3', focus: ['j', 'v', 'w', 'x'],
    words: ['j.e.t', 'j.u.g', 'v.a.n', 'v.e.t', 'w.e.b', 'w.i.g', 'w.e.t', 'b.o.x', 'f.o.x', 's.i.x', 'm.i.x', 'w.i.n', 'j.o.g'] },
  { id: 'p3-2', phase: 'p3', focus: ['y', 'z', 'zz', 'qu'],
    words: ['y.e.s', 'y.e.ll', 'y.u.m', 'z.i.p', 'z.a.p', 'b.u.zz', 'f.i.zz', 'j.a.zz', 'qu.i.z', 'qu.a.ck', 'qu.i.ck', 'qu.i.ll'] },
  { id: 'p3-3', phase: 'p3', focus: ['sh', 'ch', 'th'],
    words: ['sh.i.p', 'f.i.sh', 'sh.o.p', 'd.i.sh', 'sh.e.ll', 'ch.i.p', 'ch.i.n', 'r.i.ch', 'ch.o.p', 'm.u.ch', 'th.i.n', 'b.a.th', 'th.e.n', 'th.a.t', 'w.i.th'] },
  { id: 'p3-4', phase: 'p3', focus: ['ng', 'nk'],
    words: ['r.i.ng', 'k.i.ng', 's.i.ng', 'l.o.ng', 'w.i.ng', 'b.a.ng', 'b.a.nk', 'p.i.nk', 's.i.nk', 'w.i.nk', 'th.a.nk', 'th.i.nk'] },
  { id: 'p3-5', phase: 'p3', focus: ['ai', 'ee', 'igh'],
    words: ['r.ai.n', 't.ai.l', 'w.ai.t', 's.ai.l', 'n.ai.l', 'f.ee.t', 'b.ee', 's.ee', 'w.ee.k', 'ch.ee.k', 'l.igh.t', 'n.igh.t', 'h.igh', 'r.igh.t', 'f.igh.t'] },
  { id: 'p3-6', phase: 'p3', focus: ['oa', 'oo', 'oo:short'],
    words: ['b.oa.t', 'c.oa.t', 'g.oa.t', 'r.oa.d', 's.oa.p', 't.oa.d', 'm.oo.n', 'f.oo.d', 'z.oo', 'r.oo.f', 'b.oo:short.k', 'l.oo:short.k', 'c.oo:short.k', 'h.oo:short.k', 'w.oo:short.d'] },
  { id: 'p3-7', phase: 'p3', focus: ['ar', 'or', 'ur'],
    words: ['c.ar', 'p.ar.k', 'f.ar.m', 'j.ar', 'c.ar.d', 'f.or.k', 'c.or.n', 'h.or.n', 's.or.t', 'f.or', 'f.ur', 't.ur.n', 'b.ur.n', 'h.ur.t', 's.ur.f'] },
  { id: 'p3-8', phase: 'p3', focus: ['ow', 'oi', 'ear'],
    words: ['c.ow', 'ow.l', 't.ow.n', 'd.ow.n', 'c.oi.n', 'oi.l', 's.oi.l', 'b.oi.l', 'j.oi.n', 'ear', 'h.ear', 'n.ear', 'd.ear', 'f.ear', 'b.ear.d'] },
  { id: 'p3-9', phase: 'p3', focus: ['air', 'er', 'ure'],
    words: ['h.air', 'f.air', 'ch.air', 'p.air', 'h.a.mm.er', 'l.e.tt.er', 'l.a.dd.er', 's.u.mm.er', 'b.u.tt.er', 'p.ure', 'c.ure'] },
  { id: 'p3-r', phase: 'p3', type: 'review' },
  { id: 'p3-t', phase: 'p3', type: 'tricky',
    words: ['was', 'you', 'they', 'my', 'by', 'all', 'are', 'sure', 'pure'] },

  // ---------------- PHASE 4 ----------------
  { id: 'p4-1', phase: 'p4', focus: ['p4:cvcc'], title: 'tent',
    words: ['t.e.n.t', 'm.i.l.k', 'h.a.n.d', 'j.u.m.p', 'l.a.m.p', 'b.e.l.t', 'n.e.s.t', 'g.i.f.t', 'p.o.n.d', 'm.a.s.k', 'h.e.l.p', 't.oa.s.t'] },
  { id: 'p4-2', phase: 'p4', focus: ['p4:ccvc'], title: 'frog',
    words: ['f.r.o.g', 'c.r.a.b', 'f.l.a.g', 'd.r.u.m', 's.t.ar', 's.n.ai.l', 't.r.ee', 's.p.oo.n', 'c.l.o.ck', 't.r.ai.n', 's.w.i.m', 'g.r.i.n', 's.l.e.d'] },
  { id: 'p4-3', phase: 'p4', focus: ['p4:cccvc'], title: 'splash',
    words: ['d.r.i.n.k', 'f.r.o.s.t', 'c.r.u.s.t', 's.t.r.a.p', 's.p.l.a.sh', 's.t.r.i.ng', 's.c.r.u.b', 's.p.r.i.ng', 's.t.r.ee.t', 's.p.l.i.t', 's.c.r.ee.n'] },
  { id: 'p4-4', phase: 'p4', focus: ['p4:poly'], title: 'rocket',
    words: ['s.u.n.s.e.t', 'r.o.ck.e.t', 'c.ar.p.e.t', 'p.i.c.n.i.c', 'ch.i.ck.e.n', 's.a.n.d.w.i.ch', 'w.i.n.d.m.i.ll', 'l.a.p.t.o.p', 'p.o.p.c.or.n', 'd.u.s.t.b.i.n', 't.r.u.m.p.e.t', 'h.e.l.m.e.t', 'm.a.g.n.e.t'] },
  { id: 'p4-r', phase: 'p4', type: 'review' },
  { id: 'p4-t', phase: 'p4', type: 'tricky',
    words: ['said', 'so', 'have', 'like', 'some', 'come', 'love', 'do', 'were', 'here', 'little', 'says', 'there', 'when', 'what', 'one', 'out', 'today'] },

  // ---------------- PHASE 5 (Year 1) ----------------
  { id: 'p5-1', phase: 'p5', focus: ['ay', 'ou'],
    words: ['d.ay', 'p.l.ay', 's.ay', 't.r.ay', 'w.ay', 's.p.r.ay', 'c.l.ay', 'c.l.ou.d', 'ou.t', 'sh.ou.t', 'm.ou.th', 'r.ou.n.d', 'f.ou.n.d'] },
  { id: 'p5-2', phase: 'p5', focus: ['ie', 'ea'],
    words: ['p.ie', 't.ie', 'l.ie', 'c.r.ie.d', 'f.r.ie.d', 't.ea', 's.ea.t', 'b.ea.ch', 'l.ea.f', 'd.r.ea.m', 's.ea', 'm.ea.t'] },
  { id: 'p5-3', phase: 'p5', focus: ['oy', 'ir'],
    words: ['b.oy', 't.oy', 'j.oy', 'e.n.j.oy', 'b.ir.d', 'g.ir.l', 'sh.ir.t', 'f.ir.s.t', 'th.ir.d', 's.k.ir.t', 's.t.ir', 'b.ir.th.d.ay'] },
  { id: 'p5-4', phase: 'p5', focus: ['ue', 'aw'],
    words: ['b.l.ue', 'g.l.ue', 'c.l.ue', 't.r.ue', 'r.e.s.c.ue', 's.aw', 'p.aw', 'd.r.aw', 's.t.r.aw', 'y.aw.n', 'c.l.aw', 'l.aw.n'] },
  { id: 'p5-5', phase: 'p5', focus: ['wh', 'ph'],
    words: ['wh.e.n', 'wh.i.ch', 'wh.ee.l', 'wh.i.p', 'wh.i.s.k', 'd.o.l.ph.i.n', 'g.r.a.ph', 'e.l.e.ph.a.n.t', 'a.l.ph.a.b.e.t', 'ph.o.n.i.c.s'] },
  { id: 'p5-6', phase: 'p5', focus: ['ew', 'oe', 'au'],
    words: ['n.ew', 'f.ew', 'ch.ew', 'd.r.ew', 'g.r.ew', 'f.l.ew', 's.c.r.ew', 't.oe', 'g.oe.s', 'h.oe', 'l.au.n.ch', 'h.au.n.t', 'au.th.or', 'f.au.l.t'] },
  { id: 'p5-r1', phase: 'p5', type: 'review', title: 'Review 1' },
  { id: 'p5-7', phase: 'p5', focus: ['ey', 'a-e'],
    words: ['k.ey', 'd.o.n.k.ey', 'm.o.n.k.ey', 'm.o.n.ey', 't.ur.k.ey', 'c.a-e.k', 'g.a-e.m', 's.n.a-e.k', 'g.a-e.t', 'p.l.a-e.n', 's.a-e.f', 'sh.a-e.k'] },
  { id: 'p5-8', phase: 'p5', focus: ['e-e', 'i-e'],
    words: ['th.e-e.s', 'th.e-e.m', 'c.o.m.p.l.e-e.t', 'd.e.l.e-e.t', 'b.i-e.k', 'k.i-e.t', 's.l.i-e.d', 'f.i-e.v', 't.i-e.m', 's.m.i-e.l', 'w.i-e.d', 'p.i-e.n'] },
  { id: 'p5-9', phase: 'p5', focus: ['o-e', 'u-e'],
    words: ['b.o-e.n', 'h.o-e.m', 'r.o-e.p', 'n.o-e.t', 's.t.o-e.n', 'ph.o-e.n', 'c.u-e.b', 't.u-e.b', 'c.u-e.t', 'f.l.u-e.t', 'r.u-e.l', 'm.u-e.l'] },
  { id: 'p5-r2', phase: 'p5', type: 'review', title: 'Review 2' },
  { id: 'p5-10', phase: 'p5', focus: ['c:s', 'g:j'],
    words: ['i-e.c:s', 'f.a-e.c:s', 'm.i-e.c:s', 'p.r.i-e.c:s', 'p.e.n.c:s.i.l', 'g:j.e.m', 'g:j.i.a.n.t', 'm.a.g:j.i.c', 'c.a-e.g:j', 'p.a-e.g:j'] },
  { id: 'p5-11', phase: 'p5', focus: ['y:ee', 'y:igh'],
    words: ['h.a.pp.y:ee', 'f.u.nn.y:ee', 'p.u.pp.y:ee', 's.u.nn.y:ee', 'm.u.dd.y:ee', 'f.l.y:igh', 'c.r.y:igh', 's.k.y:igh', 't.r.y:igh', 's.p.y:igh'] },
  { id: 'p5-12', phase: 'p5', focus: ['ow:oa', 'ie:ee'],
    words: ['s.n.ow:oa', 'sh.ow:oa', 's.l.ow:oa', 'b.ow:oa.l', 'r.ai.n.b.ow:oa', 'g.r.ow:oa', 'f.ie:ee.l.d', 'ch.ie:ee.f', 'th.ie:ee.f', 'sh.ie:ee.l.d'] },
  { id: 'p5-13', phase: 'p5', focus: ['ea:e', 'al'],
    words: ['h.ea:e.d', 'b.r.ea:e.d', 'f.ea:e.th.er', 'r.ea:e.d.y:ee', 's.w.ea:e.t.er', 'w.al.k', 't.al.k', 'ch.al.k', 's.t.al.k'] },
  { id: 'p5-14', phase: 'p5', focus: ['tch', 'dge'],
    words: ['c.a.tch', 'm.a.tch', 'k.i.tch.e.n', 'w.i.tch', 'f.e.tch', 'h.e.dge', 'b.a.dge', 'b.r.i.dge', 'f.u.dge', 'e.dge'] },
  { id: 'p5-15', phase: 'p5', focus: ['kn', 'wr', 'mb'],
    words: ['kn.o.t', 'kn.o.ck', 'kn.i-e.f', 'kn.i.t', 'wr.i-e.t', 'wr.i.s.t', 'wr.o.ng', 'wr.a.p', 'l.a.mb', 'th.u.mb', 'c.l.i:igh.mb', 'c.r.u.mb'] },
  { id: 'p5-16', phase: 'p5', focus: ['ore', 'are', 'ear:air'],
    words: ['m.ore', 's.n.ore', 'sh.ore', 's.t.ore', 'c.are', 'sh.are', 's.qu.are', 's.c.are', 'b.ear:air', 'p.ear:air', 'w.ear:air'] },
  { id: 'p5-r3', phase: 'p5', type: 'review', title: 'Review 3' },
  { id: 'p5-t1', phase: 'p5', type: 'tricky', title: 'Tricky 1',
    words: ['oh', 'their', 'people', 'Mr', 'Mrs', 'your', 'ask', 'could', 'would', 'should', 'our', 'house', 'mouse', 'water', 'want', 'any', 'many'] },
  { id: 'p5-t2', phase: 'p5', type: 'tricky', title: 'Tricky 2',
    words: ['again', 'who', 'whole', 'where', 'two', 'school', 'call', 'different', 'thought', 'through', 'friend', 'work', 'once', 'laugh', 'because', 'eye'] },
];

// Friendly names for Phase 4 word-structure skills.
const PATTERN_LABELS = {
  'p4:cvcc': { label: 'CVCC', hint: 'tent, milk' },
  'p4:ccvc': { label: 'CCVC', hint: 'frog, star' },
  'p4:cccvc': { label: 'CCCVC', hint: 'splash, string' },
  'p4:poly': { label: '2 syllables', hint: 'rocket, sunset' },
};

// Graphemes that make the same sound. Used for "which spelling?" questions and to
// pick tempting wrong tiles. Values are tracking keys.
const SOUND_GROUPS = [
  ['ai', 'ay', 'a-e'],
  ['ee', 'ea', 'e-e', 'ie:ee', 'y:ee', 'ey'],
  ['igh', 'ie', 'i-e', 'y:igh'],
  ['oa', 'ow:oa', 'oe', 'o-e'],
  ['oo', 'ue', 'ew', 'u-e'],
  ['or', 'aw', 'au', 'al', 'ore'],
  ['ur', 'ir', 'er'],
  ['ow', 'ou'],
  ['oi', 'oy'],
  ['air', 'are', 'ear:air'],
  ['f', 'ff', 'ph'],
  ['w', 'wh'],
  ['s', 'ss', 'c:s'],
  ['j', 'g:j', 'dge'],
  ['ch', 'tch'],
  ['n', 'kn'],
  ['r', 'wr'],
  ['m', 'mb'],
  ['e', 'ea:e'],
  ['c', 'k', 'ck'],
  ['l', 'll'],
  ['z', 'zz'],
];

// Pictures (emoji). Words without one just show a big "listen" button.
const PICTURES = {
  tap: '🚰', taps: '🚰', pin: '📌', tin: '🥫', map: '🗺️', man: '👨', dad: '👨‍👧', sad: '😢', nap: '😴', pan: '🍳',
  dog: '🐶', cat: '🐱', pig: '🐷', cap: '🧢', kid: '🧒', dig: '⛏️',
  duck: '🦆', sock: '🧦', rock: '🪨', pen: '🖊️', red: '🔴', sun: '☀️', nut: '🥜', cup: '☕', rat: '🐀', ten: '🔟', net: '🥅', run: '🏃',
  hat: '🎩', hen: '🐔', bus: '🚌', bat: '🦇', bed: '🛏️', fan: '🪭', log: '🪵', leg: '🦵', hut: '🛖', bag: '👜', hug: '🤗', bug: '🐛',
  puff: '💨', bell: '🔔', doll: '🪆', hill: '⛰️', kiss: '💋', hiss: '🐍',
  jet: '✈️', van: '🚐', web: '🕸️', wet: '💧', box: '📦', fox: '🦊', six: '6️⃣', win: '🏆',
  yes: '✅', yell: '📢', yum: '😋', zip: '🤐', zap: '⚡', buzz: '🐝', fizz: '🫧', jazz: '🎷', quiz: '❓', quack: '🦆', quill: '🪶',
  ship: '🚢', fish: '🐟', shop: '🛒', dish: '🍽️', shell: '🐚', chip: '🍟', rich: '💰', chop: '🪓', bath: '🛁',
  ring: '💍', king: '🤴', sing: '🎤', wing: '🪽', bang: '💥', bank: '🏦', pink: '🩷', wink: '😉', thank: '🙏', think: '🤔',
  rain: '🌧️', wait: '⏳', sail: '⛵', nail: '💅', feet: '🦶', bee: '🐝', see: '👀', week: '📅', light: '💡', night: '🌃', right: '➡️',
  boat: '🚤', coat: '🧥', goat: '🐐', road: '🛣️', soap: '🧼', toad: '🐸', moon: '🌙', food: '🍲', zoo: '🦁', book: '📖', look: '🔍', cook: '🧑‍🍳', hook: '🪝',
  car: '🚗', park: '🏞️', farm: '🚜', jar: '🫙', card: '🃏', fork: '🍴', corn: '🌽', horn: '📯', turn: '↩️', burn: '🔥', hurt: '🤕', surf: '🏄',
  cow: '🐄', owl: '🦉', town: '🏘️', down: '⬇️', coin: '🪙', oil: '🛢️', soil: '🌱', boil: '♨️', ear: '👂', fear: '😨', beard: '🧔',
  hair: '💇', chair: '🪑', hammer: '🔨', letter: '✉️', ladder: '🪜', summer: '🌞', butter: '🧈',
  tent: '⛺', milk: '🥛', hand: '✋', jump: '🦘', lamp: '🪔', nest: '🪺', gift: '🎁', mask: '🎭', help: '🆘', toast: '🍞',
  frog: '🐸', crab: '🦀', flag: '🚩', drum: '🥁', star: '⭐', snail: '🐌', tree: '🌳', spoon: '🥄', clock: '🕐', train: '🚂', swim: '🏊', grin: '😁', sled: '🛷',
  drink: '🥤', frost: '❄️', splash: '💦', string: '🧵', scrub: '🧽', spring: '🌷', screen: '🖥️',
  sunset: '🌅', rocket: '🚀', picnic: '🧺', chicken: '🐓', sandwich: '🥪', laptop: '💻', popcorn: '🍿', dustbin: '🗑️', trumpet: '🎺', helmet: '⛑️', magnet: '🧲',
  cloud: '☁️', shout: '📢', mouth: '👄', round: '⭕', say: '🗣️',
  pie: '🥧', tie: '👔', cried: '😭', fried: '🍳', tea: '🍵', seat: '💺', beach: '🏖️', leaf: '🍃', dream: '💭', sea: '🌊', meat: '🥩',
  boy: '👦', toy: '🧸', joy: '😄', bird: '🐦', girl: '👧', shirt: '👕', first: '🥇', third: '🥉', skirt: '👗', birthday: '🎈',
  blue: '🔵', clue: '🔎', rescue: '🛟', saw: '🪚', paw: '🐾', draw: '🖍️', straw: '🥤', yawn: '🥱',
  wheel: '🛞', dolphin: '🐬', graph: '📊', elephant: '🐘', alphabet: '🔤',
  new: '🆕', screw: '🔩', haunt: '👻', author: '✍️',
  key: '🔑', donkey: '🫏', monkey: '🐒', money: '💷', turkey: '🦃', cake: '🎂', game: '🎲', snake: '🐍', plane: '🛩️',
  complete: '✅', bike: '🚲', kite: '🪁', slide: '🛝', five: '5️⃣', time: '⏰', smile: '😊', pine: '🌲',
  bone: '🦴', home: '🏡', rope: '🪢', note: '🎵', stone: '🪨', phone: '📱', flute: '🪈', rule: '📏',
  ice: '🧊', face: '🙂', mice: '🐭', price: '🏷️', pencil: '✏️', gem: '💎', magic: '🪄', page: '📄',
  happy: '😀', funny: '😂', puppy: '🐶', sunny: '🌤️', fly: '🪰', cry: '😭', sky: '🌌', spy: '🕵️',
  snow: '☃️', slow: '🐢', bowl: '🥣', rainbow: '🌈', field: '🌾', thief: '🦹', shield: '🛡️',
  bread: '🍞', feather: '🪶', walk: '🚶', talk: '💬',
  witch: '🧙', badge: '📛', bridge: '🌉', match: '🔥', kitchen: '🍳',
  knock: '🚪', knife: '🔪', knit: '🧶', write: '✍️', wrist: '⌚', wrong: '❌', wrap: '🎁', lamb: '🐑', thumb: '👍', climb: '🧗',
  snore: '😴', store: '🏪', shore: '🏝️', square: '🟥', scare: '😱', bear: '🐻', pear: '🍐',
  house: '🏠', mouse: '🐭', water: '💧', school: '🏫', two: '2️⃣', one: '1️⃣', eye: '👁️', laugh: '😆', friend: '🧑‍🤝‍🧑',
};

// Short sentences read after the word. Essential for words that sound like
// another word (sail/sale, see/sea) and for tricky words.
const SENTENCES = {
  // homophones and near-homophones
  sun: 'The hot sun.', tail: 'The dog wags its tail.', wait: 'Wait for me.', sail: 'The boat has a sail.',
  feet: 'I have two feet.', bee: 'A buzzing bee.', see: 'I can see you.', week: 'Seven days in a week.',
  night: 'The sky is dark at night.', right: 'Turn right.', high: 'Jump up high.', road: 'Cross the road.',
  wood: 'Trees in the wood.', for: 'This gift is for you.', fur: 'The cat has soft fur.', hear: 'I can hear you.',
  dear: 'Oh dear!', hair: 'Brush your hair.', fair: 'That is not fair!', pair: 'A pair of socks.',
  way: 'This way!', tea: 'A cup of tea.', beach: 'A sandy beach.', sea: 'Swim in the sea.', meat: 'Meat and vegetables.',
  boy: 'A boy and a girl.', blue: 'The sky is blue.', paw: "The dog's paw.", draw: 'Draw a picture.',
  which: 'Which one do you want?', new: 'My new shoes.', flew: 'The bird flew away.', toe: 'Wiggle your toe.',
  gate: 'Shut the gate.', plane: 'A plane in the sky.', these: 'I like these.', time: 'What time is it?',
  knot: 'Tie a knot.', wrap: 'Wrap a present.', bear: 'A big brown bear.', pear: 'Eat a juicy pear.', wear: 'Wear a coat.',
  wheel: 'A bike wheel.', grew: 'The plant grew tall.', chew: 'Chew your food.', few: 'Just a few.',
  write: 'Write your name.', ring: 'A gold ring.', hoe: 'Dig with a hoe.', sort: 'Sort the socks.',
  tie: 'Tie your shoes.', lie: 'Lie down on the bed.', pie: 'A yummy apple pie.', clue: 'Find a clue.', true: 'Is it true?',
  so: 'I am so happy.', more: 'Can I have more?', shore: 'Shells on the shore.', core: 'An apple core.',
  fault: "It's not my fault.", lawn: 'Mow the lawn.', claw: 'A crab claw.',
  match: 'Light a match.', fetch: 'Fetch the ball.', edge: 'The edge of the table.', hedge: 'A big green hedge.',
  ten: 'One, two... ten!', red: 'A red apple.', bus: 'Get on the bus.', chin: 'Rub your chin.',
  then: 'First this, then that.', that: 'Look at that!', with: 'Come with me.', much: 'Thank you very much.',
  thin: 'A thin stick.', rich: 'A rich king.', when: 'When is lunch?', whip: 'Whip the cream.', whisk: 'A whisk for eggs.',
  out: 'Let us go out.', found: 'I found it!', say: 'Say hello.', day: 'Have a nice day.', play: 'Let us play.',
  tray: 'Carry the tray.', clay: 'Make a pot from clay.', spray: 'Spray the water.', stir: 'Stir the soup.',
  enjoy: 'Enjoy your food.', glue: 'Stick it with glue.', theme: 'A party theme.', delete: 'Delete the photo.',
  wide: 'A wide river.', cute: 'A cute puppy.', huge: 'A huge whale.', tube: 'A tube of toothpaste.', cube: 'A sugar cube.',
  giant: 'A tall giant.', cage: 'A bird in a cage.', try: 'Try again.', muddy: 'Muddy boots.', show: 'Show me.',
  grow: 'Watch the plants grow.', chief: 'The chief of the tribe.', head: 'Pat your head.', ready: 'Are you ready?',
  sweater: 'A warm sweater.', chalk: 'Draw with chalk.', stalk: 'A long bean stalk.', catch: 'Catch the ball.',
  fudge: 'A piece of fudge.', crumb: 'A tiny crumb.', care: 'Take care.', share: 'Share your toys.',
  launch: 'Launch the rocket.', goes: 'Off she goes!', drew: 'I drew a cat.', phonics: 'Phonics is fun.',
  less: 'Less mess, please.', mess: 'What a mess!', fuss: 'Do not make a fuss.', boss: 'The boss.',
  tell: 'Tell me a story.', fell: 'He fell over.', off: 'Turn the light off.', cuff: 'A shirt cuff.',
  safe: 'Keep it safe.', shake: 'Shake hands.', near: 'Come near.', join: 'Join in.', how: 'How are you?',
  cure: 'A cure for a cold.', pure: 'Pure gold.', fight: 'Do not fight.', cheek: 'A kiss on the cheek.',
  roof: 'A cat on the roof.', jug: 'A jug of water.', vet: 'Take the dog to the vet.', wig: 'A funny wig.',
  mix: 'Mix the cake.', jog: 'Go for a jog.', quick: 'Be quick!', top: 'Spin the top.', mop: 'Mop the floor.',
  pot: 'A pot of soup.', got: 'I got a prize.', can: 'Yes, I can.', kit: 'A football kit.', kick: 'Kick the ball.',
  mud: 'Muddy mud.', pat: 'Pat the dog.', sat: 'The cat sat down.', at: 'Look at me.', pats: 'She pats the cat.',
  sit: 'Sit down.', dip: 'Dip your toe.', tip: 'The tip of my nose.', did: 'I did it!', fun: 'Have fun!',
  lip: 'Bite your lip.', puff: 'Huff and puff.', long: 'A long snake.', sink: 'Wash up in the sink.',
  wet: 'Wet socks.', belt: 'A belt on my jeans.', pond: 'Ducks on the pond.', crust: 'A bread crust.',
  strap: 'A bag strap.', street: 'Walk down the street.', split: 'Split it in two.', blank: 'A blank page.',
  carpet: 'A soft carpet.', windmill: 'A windmill turns in the wind.', plan: 'Make a plan.', star: 'Twinkle twinkle little star.',

  // tricky (harder to read and spell) words
  is: 'The cat is big.', I: 'I can hop.', the: 'Pat the dog.', put: 'Put it in the bag.', pull: 'Pull the rope.',
  full: 'The cup is full.', as: 'As fast as a car.', and: 'Fish and chips.', has: 'She has a pet.', his: 'This is his hat.',
  her: 'It is her book.', go: 'Ready, steady, go!', no: 'No, thank you.', to: 'Go to bed.', into: 'Jump into the pond.',
  she: 'She is my friend.', push: 'Push the door.', he: 'He is tall.', of: 'A cup of tea.', we: 'We can run.',
  me: 'Look at me.', be: 'Be kind.',
  was: 'It was fun.', you: 'I love you.', they: 'They are here.', my: 'This is my bag.', by: 'Sit by me.',
  all: 'We all clap.', are: 'You are kind.', sure: 'Are you sure?',
  said: 'Mum said hello.', have: 'I have a dog.', like: 'I like cake.', some: 'Can I have some?',
  come: 'Come and play.', love: 'I love you.', do: 'What do you want?', were: 'We were happy.', here: 'Come here.',
  little: 'A little mouse.', says: 'Dad says yes.', there: 'Put it over there.', what: 'What is that?',
  one: 'One, two, three.', today: 'It is sunny today.',
  oh: 'Oh no!', their: 'They put on their coats.', people: 'Lots of people.', Mr: 'Mister Smith.', Mrs: 'Missus Jones.',
  your: 'Is this your hat?', ask: 'Ask a question.', could: 'Could you help me?', would: 'Would you like a drink?',
  should: 'You should go to sleep.', our: 'This is our house.', house: 'I live in a house.', mouse: 'The mouse is small.',
  water: 'A glass of water.', want: 'I want to play.', any: 'Is there any cake left?', many: 'How many?',
  again: 'Do it again.', who: 'Who is that?', whole: 'I ate the whole pie.', where: 'Where is my hat?',
  two: 'One, two, three.', school: 'I go to school.', call: 'Call my name.', different: 'We are all different.',
  thought: 'I thought so.', through: 'Go through the door.', friend: 'You are my friend.', work: 'Mum goes to work.',
  once: 'Once upon a time.', laugh: 'You make me laugh.', because: 'I smiled because I was happy.', eye: 'Close one eye.',
};
