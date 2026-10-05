# Kurtz's night escape

Base: published `2dcbf62d6ab11c22f3da15275efed203e27068fc`.
This episode begins after the station interpretation exchange closes. It ends
with Kurtz back at his resting place; no death, final speech, voyage or epilogue.

## Route and controls
From a new game, follow the route in `STATION-REVELATIONS.md`. Examine any two
station evidence points, speak to the Russian, choose an interpretation and
finish that exchange. Go to the left landing and press E to keep watch until
night. This is an optional spatial continuation, never a timer forcing progress.

WASD/arrows walk throughout; E examines/continues, 1/2 or the existing buttons
choose. The station fades into midnight over a finite saved transition, softened
by the existing atmosphere controller. Walking/reading never freezes the world.
At the former rest position, Kurtz's body is gone and the blanket remains.
Examine it, then follow crushed grass, palm/knee marks and bent branches toward
the right. Three consecutive physical observations lead through the trees.
No inventory, collectible counters, arrows, navigation markers or combat.

In the clearing approach the gaunt figure; distant people wait behind him.
Kurtz struggles upright, then makes a commanding gesture. Marlow can reason
with him about returning or challenge his authority without raising his voice.
Both branches return. They change Kurtz's answer and posture, Marlow's thought
and a brief subsequent response at the station. Prior interpretation, first
Kurtz response and the Russian stance contribute small remembered variations.

On the return, stay within 180 world units and keep moving toward the right
exit. Kurtz approaches at 75 units/second, maintaining roughly 35 units of
separation; he stops if left behind. Short movements and pauses are more useful
than sprinting away. E at the exit works only when he is actually near it.
The clearing then fades back to the night station, with partial ambient relief.
Speak to Kurtz again near the rest position for the remembered after-response.

## Literary basis and adaptation
Conrad, [Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm):
the empty berth, a low trail through damp grass, nearby watchfires, Kurtz rising
unsteadily, the danger of his voice, and Marlow supporting him back.
The playable rest remains at the station instead of the steamer cabin in the
novella; the short horizontal clearing and two responses compress this episode.
All Spanish dialogue is adaptation. The original threatened violence is not a
combat mechanic. Distant people are ordinary partly hidden figures, without
invented supernatural, ethnic or ritual iconography. The Russian's remembered
stance is recollection, not a claim that he witnesses the return.

## Canonical state and save contract
Pixi'VN owns the only narrative/save format. `journey.currentSpace` stays
`inner-station`; the same scene dispatch selects this episode once active.

- `journey.kurtzNightEscape`: one validated object with `phase`, `duskMS`,
  `absence`, ordered `traces`, `found`, optional `choice`, `pose`, exact `escort`
  coordinates and `returnedSeen`.
- Phases: `inactive → dusk → search → trail → clearing → return → returned`.
- Choice: `reason` or `challenge`, retained once chosen.
- Poses: `collapsed`, `bracing`, `dominant`, `exhausted`.
- `journey.kurtzNightAtmosphere`: current smoothed station/night blend.
- `journey.kurtzNightForestBlend`: current smoothed clearing/station blend.
- Existing `journey.stationPosition`: actual Marlow coordinates, reused during
  this bounded stage. All prior flags/choices/poses remain in their old fields.
- Active labels, child choice branches and cursors remain canonical Pixi objects.

`Game.exportGameState()` includes these storage fields. After
`Game.restoreGameState()`, the existing `showJourneySpace()` reconstructs the
same episode at the saved phase, position, blend and pose. No source time is
serialized. A live transition continues on the next frame after its exact
restored value; it does not pretend to remain frozen during later observations.
New-game cleanup uses the existing `journey-inner-station` layer ID, stopping
old checkpoint writers before loading scene code. No new restore manager.

## Presentation and assets
New assets only in `public/assets/art/kurtz-night/`:
- `station.png`, 1672×941 opaque: geometrically aligned midnight variant.
- `forest.png`, 1672×941 opaque: related short clearing, unoccupied ground strip.
- `figures.png`, 1536×1024 RGBA: four consistent gaunt Kurtz poses, empty
  stretcher, three clues and restrained background figures. Transparency checked.

Built-in image generation/editing follows `docs/art-briefs/kurtz-night-escape.md`,
using the existing station and Kurtz as references. Original files are preserved.
Generated provenance IDs: station `exec-d33d46e0-6a27-4871-ad60-90baa0f8a243`,
forest `exec-e0ee0569-e71e-4657-aa0a-3f705b66955f`, final pose atlas
`exec-5fc70464-2f42-4224-bba6-7e4750e1ab22`. The first atlas was corrected to
standing/support poses, then its background halo was removed with the image
tool; unused generations remain outside runtime assets. Sampled interstitial
alpha is zero, eliminating the visible rectangular glow behind the empty bed.
Actual crops/pivots are in `src/story/heart-of-darkness/kurtzNightEscape.ts`;
generation did not enforce equal cell heights, so the manifest uses observed
396/414/350/330/278-pixel frame heights, not assumed grid boundaries.
Spatial trace positions: grass (1415,835), palm/knee marks (1530,860), branches
(1640,755). The middle clue is on the near side of the report box so its
approach preserves the player's full legs under the existing depth ordering.

Existing visual slots load/cache frame textures. Contact shadows, foot-depth
ordering, mild body sway, distant-light modulation, quiet silhouettes and two
low moving fog planes form separate layers. No per-frame texture construction,
full-screen filters, new render loop or new particles. Protected old art is not
retouched; the old Marlow sprite retains its existing softness.

## Architecture and audio
State and Pixi labels live in `src/content/`; composition and spatial actions
live in its scenes. Art, anchors, clue text and layer configuration live in
`src/story/heart-of-darkness/`. The only earlier production edit is the station
dispatch and gated vigil action. `src/engine/`, Deck and Metamorphosis are intact.

The generic spatial mixer/Pixi output own two low water/canopy layers using
existing assets. Canopy fades into silence during the confrontation, water is
reduced in the clearing and partially returns afterward. No dubbing or constant
music; no new recordings pretending to be footsteps, fire or coughing. The
existing loops and sound-channel ownership are reused. The scene destroys its
tickers, key listeners, UI, frame textures, fog texture and audio sources via
the established owner lifecycle; late image loads cannot create orphan actors.

## Validation and QA
Eight unit cases cover completion gate/idempotence, finite gradual transition,
absence, physical clue order, both immutable choices, escort proximity/arrival,
checkpoint reconstruction and corrupt saves. Three functional browser cases
cover both prior branches, real E/1/2 input, movement during dialogue, tracking,
transitional/active-choice/after-selection/escort/return saves, duplicate-free
entities/audio and restart. One visual browser case captures twelve moments
at 1366×768 and 800×600, checking loaded art, actual resized frames, controls,
choices and text containment.

Final `npm run agent:check`: TypeScript, **140/140 unit tests in 34 files** and
production build passed, exit 0. Largest shared chunk remains 463.99 kB;
no >500 kB bundle warning. Final complete `npm run agent:e2e`: **85/85 tests
in 29 files**, 22.7 minutes, exit 0. Total: **225 automated tests**, including
all 213 baseline tests and twelve new cases (eight unit and four browser).
No existing test or assertion was removed or weakened. The added silence
assertion observes the real `journey-kurtz-night:canopy:channel` gain, not the
source alias; both confrontation paths reach exactly zero canopy volume.

All **24 required captures** were visually inspected at 1366×768 and 800×600.
Both characters, full text, controls and choices remain visible. Empty rest
precedes its explanatory line; traces remain readable without arrows. Kurtz's
collapsed, bracing, commanding and exhausted poses separate the emotional
beats, while ordinary followers stay behind the playable ground. The return
preserves the night rather than resetting to daylight. The two QA corrections
are the near-side middle trace and alpha cleanup described above. Final full
suite captures are retained in `kurtz-night-escape-qa/`, with a moment index.

## Limits
This is a compact staged tracking route, not an open forest or freeform trail
simulation. Ground remains a bounded strip; no general obstacle collision or
new animation controller. The supported return uses a matching pose with mild
sway rather than a paired skeletal animation. Distant followers are a small
illustrated group with restrained movement, not crowd simulation. Final human
audio listening and physical-GPU performance evaluation remain separate.
