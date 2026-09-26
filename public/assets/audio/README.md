# Provisional Journey ambience

These three audible loops were synthesized for this repository by Codex under
the project owner's direction. Their source is
[`scripts/generate-journey-ambience.mjs`](../../../scripts/generate-journey-ambience.mjs),
using deterministic oscillators and seeded noise. No third-party recordings,
samples, melodies or sound libraries were incorporated. Run
`node scripts/generate-journey-ambience.mjs` to reproduce the 8-second,
22,050 Hz mono PCM WAVs.

| File | Intended cue | Source / author | Asset license |
| --- | --- | --- | --- |
| `journey-river.wav` | Flowing water wash and ripples | Project-authored procedural synthesis, Codex-assisted | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `journey-shore.wav` | Breeze, foliage and insect-like chirps | Project-authored procedural synthesis, Codex-assisted | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |
| `journey-engine.wav` | Low repeating machinery thrum | Project-authored procedural synthesis, Codex-assisted | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

The CC0 dedication above applies to these three generated WAV files only.
The loops are provisional sound sketches, not location recordings or the final
audio direction. Future replacements can change the paths in
`src/story/heart-of-darkness/journeyAudio.ts` without changing `src/engine/`.

## Listening check

Run `npm run dev`, open the local page, click the game canvas and use headphones
at a comfortable volume. Near Marlow's starting position, listen for water with
some shore texture. Hold `A` toward the port edge: the shore/insect texture should
grow while the river recedes smoothly. Hold `D` across the deck: the shore fades,
the river returns and a low machinery thrum grows near the opposite end. Pause
at each point for a few seconds and listen for an obvious pop at the 8-second
loop seam. Browser tests can verify decoded non-silent samples and live channel
state; they cannot judge timbre, comfort or the perceived balance on your device.
