# Journey Deck — authoritative illustrated pass

This document records the approved visual pass at `1761bf2`. The subsequent
[technical polish](TECHNICAL-POLISH.md) preserves these plates and poses but
extends both actor sheets with six walk cells: runtime now uses
`marlow-motion-sheet.webp` (1760×160) and `deckhand-motion-sheet.webp` (2400×160).
Its measurements, current buffer policy and QA captures are documented separately.

The user-provided dusk, night and burning-river images supersede the SVG drawing
style for this scene. The earlier handoff and the eleven SVGs remain historical
composition references. Runtime now uses independently replaceable WebP plates
in `public/assets/art/journey-deck/illustrated/`; the engine is unchanged.

Authoritative references: [dusk](authoritative-dusk.png),
[night](authoritative-night.png), [fire](authoritative-fire.png).

## Current asset contract

All dimensions are source pixels. Positions are logical world coordinates before
camera transforms. Non-actor plates display at 1×. Actor cells are 160×160 with
the same foot pivot (80,142), displayed at 1.32×; collision and actor positions
are unchanged. The canvas remains 1920×1080, contained at 800×450 inside an
800×600 browser viewport.

| Manifest ID | WebP file | Size | Registration / role |
| --- | --- | --- | --- |
| skyWater | journey-sky-water.webp | 1920×1080 opaque | (0,0), dusk sky and water below every independent river plane |
| distantRidge | journey-distant-ridge.webp | 1920×245 alpha | (0,280), rear vegetation; depth .08, 5 units/s |
| farVegetation | journey-far-vegetation.webp | 1920×320 alpha | (0,215), layered jungle; depth .25, 14 units/s |
| nearBank | journey-near-bank.webp | 1920×165 alpha | (0,395), irregular shoreline; depth .5, 30 units/s; existing voyage checkpoint |
| riverCurrent | journey-river-current.webp | 1920×500 alpha | (0,520), independent ripples/reflections; depth .8, 58 units/s |
| foregroundReeds | journey-foreground-reeds.webp | 1920×190 alpha | (0,890), passing foreground vegetation; depth 1.15, 90 units/s |
| deckBase | journey-deck-base.webp | 1550×580 alpha | (205,410), fixed wet deck and cabin; cabin registered around x330–580 / y475–640 |
| deckFittings | journey-deck-fittings.webp | 1400×410 alpha | (255,540), shared image split by masks: rear rail behind the cabin, front rail above actors |
| cargo | journey-cargo.webp | 1110×170 alpha | (420,540), blank tally and crate; `DEST.` remains live text at (430,606) |
| marlowSheet | marlow-sheet.webp | 800×160 alpha | idle, walkA, walkB, concern, alarm; frame x=0/160/320/480/640 |
| deckhandSheet | deckhand-sheet.webp | 1440×160 alpha | idle, walkA, walkB, coilA, coilB, cargo, lookout, concern, alarm; frames every 160px |

Four story-owned variants supplement those eleven keys:

| Variant | Size / position | Purpose |
| --- | --- | --- |
| journey-sky-water-night.webp | 1920×1080, (0,0), opaque | Cold moonlight and dark water replace natural sunset light |
| journey-sky-water-fire.webp | 1920×1080, (0,0), opaque | Burning sky and orange/red broken reflections |
| journey-burning-bank.webp | 1920×320 alpha, (0,215) | Separate traveling silhouettes, flames, smoke and structures; depth .5, 30 units/s |
| journey-deck-fire-reflection.webp | 1550×580 alpha, (205,410) | Restrained red/orange light on wet floor only; no reflection painted onto the cabin facade |

## Progression and composition

`journeyArtStage()` consumes the existing smoothed `AtmosphereController.progress`.
Progress 0 is dusk; between .28 and .78 the sky/water crossfade into night and
the independently moving vegetation loses warm highlights. From .84 to 1 the
burning landscape replaces the shore, the cold current subsides, and fire-water
and deck reflections crossfade in. This is scene content, with no new narrative
state, save format or progression controller.

The existing fog remains layered and animated. During fire, surface fog recedes
to expose the violent water reflections; distant smoke and shore fog remain.
Eighteen preallocated ember shapes drift upward on the existing ticker. The
scene destroys their listener with its container. No texture is created per
frame. Long cast shadows appear with firelight; normal contact shadows remain
at the feet. Masks let the cabin occlude the rear railing while the foreground
rail continues to overlap the floor. The tally, cargo, interaction areas, NPC
route and camera follow have their original gameplay ownership.

Marlow's idle face is introspective, not cheerful. Stationary concern and alarm
poses appear as the journey darkens and burns. The sailor retains working,
walking, cargo and lookout poses; alarm changes his resting presentation while
his existing routine/controller continues. Walking uses the existing two gait
frames. No conversation text or choice was added for the fire stage.

## Production provenance and prompt set

Artwork was produced with the built-in image-generation tool using the user's
three authoritative images as visual references; it was not downloaded from an
asset marketplace. Raw selected outputs stay in Codex's generated-images folder;
all runtime files are included in the repository. Alpha, cropped registration,
frame extraction, edge blending and WebP compression were handled offline.

Common production brief: **adult 2D illustrated graphic novel, restrained
cel shading, clean fine ink contours, moderate painterly texture, petrol blue /
deep green / brown / muted amber, cinematic light, deep shadows; no realism,
pixel art, flat vector placeholders, smiles, labels or baked UI.** Individual
plates exclude actors and other depth planes. Transparent strips preserve real
alpha; sky/water fills the full frame. Actors share clothing, rim light, scale
and the same view angle. These were the requested plate subjects:

- Dusk sky/water: cloudy sunset over broad tropical river, muted golden reflection.
- Night sky/water: almost dark blue river, cloud break with cold light, no shore.
- Fire sky/water: red/orange inferno sky, black smoke and violent broken water reflections.
- Distant ridge: soft layered tropical treeline with irregular silhouettes.
- Far vegetation: mature palms, canopy, vines and varied mid-distance foliage.
- Near bank: irregular muddy shoreline, roots, low foliage and reflected edge.
- Current: several scales of transparent ripples and broken warm reflections.
- Reeds: dark near-water plants and drifting branches, sparse transparent strip.
- Deck/cabin: worn wet planks, amber windows, strong directional shadow, open floor.
- Fittings: aged dark metal rails and mooring rope, separate transparent plate.
- Cargo: rope-bound wooden crate and blank wooden tally, no generated lettering.
- Marlow: same hat/coat/tie in serious idle and two walking poses.
- Sailor: same cap/rolled sleeves in idle, walk, rope work, cargo and lookout poses.
- Burning bank: varied flame sizes, black palms, burning structures and smoke.
- Expression supplement: four separated full-body poses preserving the actors'
  identities: concerned Marlow, horrified Marlow, worried sailor, alarmed sailor;
  same boots baseline, mature expressions, tense body language, genuine alpha.

Selected output IDs (prefixes): sky `370f235e`, deck `5a1efef3`, Marlow
`e066eee5`, sailor `27f1065b`, ridge `8323ebba`, far jungle `fb854e49`, bank
`b4470c92`, current `0d0eefd7`, reeds `dfa21e97`, fittings `d454e1e7`, cargo
`0831da5d`, fire sky/water `badb35a0`, burning bank `b187e73f`, night sky/water
`73e581d7`, expressions `ebe5f572`. Deck firelight is an offline, alpha-limited
derivative of the selected fire reflections, not another flattened scene.

## QA references and limitations

The stage browser test captures progress 0 / .5 / .78 / 1 at 1366×768 and
800×600, plus active fire-stage dialogue. Capture camera focus is (960,650),
zoom 1.5, to inspect cabin, cargo and both actors simultaneously. Normal gameplay
still follows Marlow; movement can put parts of the ship outside that viewport.
The first visual pass was rejected for a rail over the windows, weak actor scale
and reflections on the cabin. The second pass corrects those issues.

At 800×600, the two-dimensional full-body figures cannot provide portrait-level
facial acting: brows, mouth and larger silhouettes/gestures carry the emotion.
Walking remains two-frame animation. Flames/smoke are illustrated plates with
travel, crossfade and moving embers, not a fluid simulation. Ember phase and
decorative fire-bank offset are transient; restored voyage/atmosphere state
reconstructs the correct lighting and stage through existing Pixi'VN checkpoints.
The fifteen runtime WebPs total 2.20 MiB. Software-rendered fog remains a known performance constraint; this milestone
does not alter movement timing or the general renderer.

An isolated SwiftShader measurement found 3.5–3.8 fps while alpha-zero variants
were still submitted and about 5 fps when unused variants were hidden. The
scene now sets visibility explicitly and keeps at most two active sky plates
during crossfades. Mask removal and swapping WebP for SVG did not materially
improve the same measured geometry. Camera tests now wait for all illustrations
to load; Playwright's default expectation window is 10 seconds and the long
camera/movement checks allow 90 seconds. The two long parallax tests allow
90/120 seconds for their complete sequences; both originally reached their
final live-frame samples before exhausting the previous 45/65-second budgets.
The isolated rerun passed both in 2.0 minutes, without reducing frame counts
or changing speed/coverage tolerances. Exact coordinates, edges, camera
tolerances and the frame-based movement-speed assertions remain unchanged.

Final validation (2026-10-02): `agent:check` passed TypeScript, 98 unit tests in
22 files and build; `agent:e2e` passed all 57 browser tests in 23.2 minutes.
Coverage includes both works, conversation/choices, movement/camera, NPC
routines, parallax, fog, audio and Pixi'VN save/restore. Total: 155 tests. The
602.12 kB main-bundle warning remains. The final weather diagnostic measured
4.4 / 5.4 / 5.8 fps with fog on / off / on in SwiftShader; this is a software
rendering measurement, not a promise of hardware-rendered performance.

## Final browser captures

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| Dusk | [capture](illustrated-qa/journey-dusk-1366x768.png) | [capture](illustrated-qa/journey-dusk-800x600.png) |
| Jungle | [capture](illustrated-qa/journey-jungle-1366x768.png) | [capture](illustrated-qa/journey-jungle-800x600.png) |
| Deep darkness | [capture](illustrated-qa/journey-darkness-1366x768.png) | [capture](illustrated-qa/journey-darkness-800x600.png) |
| Fire | [capture](illustrated-qa/journey-fire-1366x768.png) | [capture](illustrated-qa/journey-fire-800x600.png) |
| Fire with dialogue | [capture](illustrated-qa/journey-fire-dialogue-1366x768.png) | [capture](illustrated-qa/journey-fire-dialogue-800x600.png) |
