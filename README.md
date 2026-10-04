# Spelling Stars ⭐

A friendly, level-based spelling game for Reception and Year 1, following the order sounds are taught in
**Essential Letters and Sounds (ELS)**.

## Playing

Open `index.html` in Chrome, Edge or Safari. There's nothing to install and it runs offline. Progress is
saved in that browser on that device.

- **Ollie the owl** says each word, and a short sentence too when it sounds like another word (*sail / sale*).
  Tap the picture or **Hear it again** to hear it again.
- **Build the word** from sound tiles (`ai`, `sh`, `igh`…). Dots and dashes under the gaps are ELS-style
  *sound buttons*: a dot is one letter, a dash is a digraph or trigraph.
- **Phase 5** levels also ask *"which spelling is right?"*, e.g. `r _ n` → **ai** / ay / a‑e.
- If she's wrong, the right letters stay and the wrong ones come back to the tray. After two tries the
  answer is shown.
- Each level has 6 words. **4 right first time** earns a star and unlocks the next level. 5 = ★★, 6 = ★★★.
- Every level slips in one word from an earlier level, and the review levels favour sounds she's finding hard.

## Grown-ups' corner

Tap **👪 Grown-ups** and answer a times-table question. You'll see:

- Every ELS sound, grouped by phase, coloured as a traffic light:
  - 🟢 **Confident**: at least 4 goes, 80%+ right first time in the last 8
  - 🟡 **Getting there**: learning, or not enough goes yet
  - 🔴 **Needs practice**: under half right recently
  - ⚪ **Not tried yet**
- The tricky (*harder to read and spell*) words for each phase.
- Tap any sound to see her recent mix-ups, e.g. `rain → rayn`.
- Settings: her name, start from a later level (e.g. jump straight to Phase 5), speaking speed, voice,
  sound buttons on/off, unlock all levels, and reset progress.

Sounds are scored **inside every word she spells**, not only in their own level. So if she spells *rain* as
*rayn*, that counts against `ai` and the `r` and `n` still count as right.

## Changing the words or the order

Everything is in [`js/curriculum.js`](js/curriculum.js). The sequence here is based on the published ELS
overview. Schools sometimes shuffle weeks slightly, so compare it with your school's planning sheet and
reorder the levels if you need to. Words are written grapheme by grapheme:

```
'r.ai.n'      r + ai + n
'c.a-e.k'     split digraph a-e  (spelled c-a-k-e)
's.n.ow:oa'   "ow" making the /oa/ sound (tracked separately from "ow" in cow)
```

## Files

```
index.html          screens and the owl
css/style.css       look and animations
js/curriculum.js    ELS phases, levels, words, pictures, sentences
js/model.js         word parsing, saving progress, traffic-light rules
js/audio.js         speech (browser text-to-speech) and sound effects
js/app.js           the game and the grown-ups' corner
```
