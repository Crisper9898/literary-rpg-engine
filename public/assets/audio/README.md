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
at a comfortable volume. Press `P` to show the Journey-only diagnostic panel;
press `P` again to hide it. The panel shows Marlow's current deck coordinate,
the river/shore/engine mixer volume, each target and Pixi'VN channel volume,
and whether its source is playing. It is hidden by default and does not capture
mouse or movement keys. Use `A`/`D` or the arrow keys for this short route:

1. Move to **river** around `x 850`; pause. Water should lead, with little
   shore or machinery. Wait at least 8 seconds to hear a complete loop.
2. Move left to **shore** around `x 420`; pause. The foliage/insect texture
   should rise as water recedes, without a sudden jump.
3. Move right to **engine** around `x 1280`; pause. The low machinery thrum
   should grow while the shore recedes. Walk slowly across both transitions.

To check restoration before a Save/Load menu exists, open the browser's
developer console **while running `npm run dev`**. At the shore, enter:

```js
const audioProbe = await import("/tests/e2e/audioProbe.ts");
const savedAudioRoute = await audioProbe.saveAudioPosition();
```

Walk to the engine, then enter `await audioProbe.restoreAudioPosition(savedAudioRoute)`.
The scene is rebuilt at the saved shore position. Press `P` again (the newly
created panel starts hidden) and confirm the shore mix returns, with only one
playing source per active layer. The automated browser test also checks this
save/restore path through Pixi'VN.

For each stop, note the coordinate, which cue feels **too loud**, **too weak**
or **artificial**, and whether a transition or 8-second loop seam is audible.
For example: `x 420 · shore too loud · slight click on loop`. These are
provisional sketches. Browser tests verify decoded non-silent samples and live
channel state; they cannot judge timbre, comfort or perceived balance on your
device.
