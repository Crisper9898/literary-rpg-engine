# Active plan — Heart of Darkness: The Journey

## Objective
Build the first polished playable vertical slice of the Literary RPG Engine using Pixi'VN + PixiJS.

## Scope
A continuous atmospheric ship journey with Marlow, active NPCs, movement, dialogue, camera direction and environmental storytelling.

## Non-goals
- multiple novels
- combat systems
- procedural generation
- large inventory systems
- generic engine features that the current slice does not need

## Current status
Pixi'VN foundation, deck composition, keyboard movement and camera direction are
working. The camera follows Marlow smoothly within the world bounds. Scripted
focus, zoom, lock and return to follow are available. One registered deckhand
independently works a three-stop route while Marlow moves. The NPC can pause,
face a target and resume, and the camera can focus it. Marlow can now approach the
deckhand and hold a branching Pixi'VN conversation while both continue moving.
Reading and choices leave the world running; distance gates conversation input.
Five scenery layers now travel continuously past the fixed vessel at distinct
speeds and camera depths, including while Marlow stands still or reads dialogue.
Voyage distance now drives smooth clear, humid and deep atmosphere profiles.
Three fog depths and world shading preserve movement, camera follow, NPC routines
and readable dialogue/HUD at both supported test resolutions.
An optional cargo tally on the port side now records its inspection in Pixi'VN
storage. If Marlow reads its erased destination before asking about the cargo,
the deckhand answers differently; the original line remains when it is ignored.
Pixi'VN export/restore coverage now proves both versions of that consequence
survive a serialized save. Marlow's bounded world coordinates, unwrapped voyage
distance and the smoothed atmospheric progress now also round-trip through
Pixi'VN storage; restored movement and traveling scenery remain live.
An architecture audit has separated reusable spatial-action selection and
Pixi'VN checkpoint binding from Journey content. A neutral browser fixture and
an engine-import guard now protect portability without adding another story.
Reusable position-aware ambience now mixes independent layers and priority
zones through Pixi'VN sound. Journey demonstrates the system with three
distinct, audible provisional loops; authored audio can replace them in story
configuration.

## Ordered tasks

- [x] Establish Pixi'VN + PixiJS foundation.
- [x] Add automated unit/build/browser validation.
- [x] Define repository boundaries and Codex instructions.
- [x] Create the first playable deck scene using simple placeholder geometry/assets.
- [x] Add Marlow player movement constrained to the deck.
- [x] Add a reusable camera director with player follow and scripted focus.
- [x] Add one independently animated/routined NPC.
- [x] Add a walk-and-talk dialogue sequence using Pixi'VN.
- [x] Add layered scrolling river/background parallax.
- [x] Add a simple fog/weather progression.
- [x] Add one meaningful environmental interaction that changes a later dialogue line.
- [x] Add basic zone-aware ambience/audio transition.
- [x] Add save/restore smoke coverage for relevant world state.
- [ ] Replace placeholders with first-pass art direction assets.
- [ ] Run complete vertical-slice browser QA and polish pass.

## Next task
Replace placeholders with first-pass art direction assets. The zone-aware audio
infrastructure is complete and its provisional loops are audible; final sound
design remains separate from this art task.

## La metamorfosis portability scene — 2026-09-26

User-directed extension from `f3fd9e0` to prove a second work can use the
approved architecture. The unfinished first-pass Heart of Darkness art task
remains next on this plan; its pending human audio listening is not a gate.

- [x] Add a selectable `/?story=metamorphosis` entry while `/` keeps Journey as
  the default. The visible work selector reloads into the chosen Pixi'VN label.
- [x] Keep Gregor, room geometry, interactions, dialogue, checkpoints, audio
  sources and authored parameters in Metamorphosis story/content modules.
  Reuse engine movement, camera, spatial interactions and audio adapter, plus
  Pixi'VN labels, storage, sound and export/restore. No `src/engine/` changes.
- [x] Demonstrate an optional window observation that changes a later door
  line, and three audible provisional layers: room, exterior near the window,
  and abstract voices near the door. Their generator and CC0 attribution are
  documented with the assets; final sound design remains future content work.
- [x] Browser-test both entry paths, movement/camera, both dialogue paths,
  live zoned audio, decoded assets and Pixi'VN save/restore. Review the room
  at 800×600; keep the Phaser stash and local-only Git history intact.

Validation: `npm run agent:check` passed TypeScript, 89 unit tests in 19 files
and the production build. `npm run agent:e2e` passed the complete 34-test
browser suite in 11.8 minutes, including all existing Journey tests. Gregor's
room was visually reviewed at 800×600. The pre-existing >500 kB bundle warning
and slow software fog rendering (7–9 fps in the diagnostic) remain. No human
listening was performed or required for this task. The Metamorphosis loops are
provisional, and the Heart of Darkness listening review remains separate.

## Grete at the door — 2026-09-26

User-directed follow-up from `bc25924`. This extends only the existing room
interaction; the pending Journey art task remains unchanged.

- [x] Register Grete as an offscreen character behind the existing door. Show
  her presence with provisional doorway light and a label, without adding a
  house scene or autonomous NPC routine.
- [x] Extend the `E` interaction through Pixi'VN dialogue and two native
  choices. `1`/`2` or the choice buttons let Gregor ask Grete to stay or leave.
  The selected response is stored once in namespaced Pixi'VN storage; Grete's
  immediate and later lines differ. The existing window flag changes her first
  line before a choice, with no duplicate state.
- [x] Browser-test door availability, both choices and later replies, both
  serialized save/restore paths, the original window consequence, and the
  default Heart of Darkness entry. Keep all work-specific code outside
  `src/engine/` and make one local commit after validation.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests across
19 files, and the production build. `npm run agent:e2e` passed 36/36 tests,
including both Metamorphosis choice/save paths and Heart of Darkness regressions.
The 800×600 choice view was inspected visually and remained readable. Grete is
intentionally offscreen with provisional doorway art; this slice does not add
the rest of the house or an autonomous routine. The first unchecked Journey
task below remains the next planned work.

## Family activity at Gregor's door — 2026-09-27

User-directed Metamorphosis follow-up from `ee047df`. The pending Journey art
task remains unchanged.

- [x] Trigger one brief Pixi'VN narrative cue when Gregor enters a small zone
  near the existing door. Record that cue once in namespaced Pixi'VN storage.
  Returning to the zone, including after restore, does not replay it.
- [x] On the next door interaction, let Gregor try to answer his family or stay
  silent through Pixi'VN choices. Store `answered`/`silent` in the same
  narrative storage; Grete's immediate and later lines reflect that choice.
  Her previous stay/leave choice and the window-conditioned line still work.
- [x] Keep the room, Grete and family scene composition in Metamorphosis
  content/story modules. No new scene, audio asset, dependency or `src/engine/`
  change. Browser-test both outcomes, one-time activation, serialized
  save/restore, previous interactions and Journey regressions.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files, and the production build. `npm run agent:e2e` passed 39/39 tests in
11.9 minutes. The family question and both buttons were visually inspected at
800×600 and were readable without clipping. The existing >500 kB bundle
warning and slow software fog diagnostic (7.1 fps with weather, 9.3 without)
remain unrelated to this content change.

## Office representative arrives — 2026-09-27

User-directed Metamorphosis follow-up from `875feb4`. The pending Journey art
task remains unchanged; Gregor stays inside the existing room.

- [x] After the family exchange, a one-time proximity cue at the door announces
  that an office representative has arrived because Gregor missed work. The
  cue waits for `familyResponse`, so it cannot interrupt the earlier choice.
- [x] The next `E` interaction has a short Grete and representative exchange.
  Grete's first reaction reflects whether Gregor answered his family. Gregor
  can explain his absence or remain silent; the representative's immediate
  response differs. The earlier window, family and Grete conversations remain
  available afterward.
- [x] Store `metamorphosis.clerkArrivalHeard` and
  `metamorphosis.clerkResponse` (`explain`/`silent`) in Pixi'VN storage. Browser
  tests cover saves before arrival, after arrival, and after each choice;
  restoring beside the door does not duplicate the cue or dialogue.
- [x] Keep the representative offscreen, add no new scene or audio asset, and
  leave `src/engine/` untouched. Review both choice paths at 800×600 and run
  the complete project validation before one local commit.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 44/44 browser tests in
12.7 minutes, including all Journey regressions. Both 800×600 screenshots
show the representative's question and two fully visible, usable buttons with
no overlap. The existing >500 kB bundle warning and software fog diagnostic
(7.2–7.3 fps with weather, 9.5 without) remain outside this task.

## First Metamorphosis spatial transition — 2026-09-27

User-directed follow-up to the office representative scene. The pending Journey
art task remains unchanged; the rest of the Samsa apartment and visible family
characters remain for later work.

- [x] Unlock the room door only after the family proximity event, family
  response, office arrival and clerk response. Keep the earlier window, family,
  clerk and optional Grete dialogue; Grete has a separate nearby hotspot once
  opening the door becomes available.
- [x] Add one provisional hallway with bounded movement, camera follow, a
  picture observation through a Pixi'VN label, and an E interaction to return.
  Compose both spaces from existing movement, camera, interaction and audio
  helpers; no `src/engine/` changes or new dependencies.
- [x] Store `metamorphosis.currentSpace` in Pixi'VN storage alongside the
  existing Gregor position checkpoint. On transition, write the destination
  and its valid arrival position, dispose the old presentation/listeners/sound,
  then rebuild the destination. On restore, rebuild the saved space and position
  from Pixi'VN without serializing transient renderer or audio objects.
- [x] Browser-test the locked door, unlocked exit, hallway movement and picture,
  return path, narrative state, and saves in the room before unlock, after
  unlock, in the hallway, and after returning. Check room, hallway, observation
  dialogue and return at 800×600; keep Journey regressions in the full suite.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 47/47 browser tests in
13.5 minutes, including all Journey regressions. The 800×600 room, hallway,
hallway dialogue and return captures show Gregor in bounds with readable
prompts and no clipped dialogue. The pre-existing >500 kB bundle warning and
slow software weather diagnostic (6.8–7.4 fps with weather, 9.6 without) are
unchanged in scope.

## Visible Metamorphosis hallway NPCs — 2026-09-27

User-directed continuation of the first room-to-hallway transition. The
pending Heart of Darkness art task remains the first unchecked Journey task;
no other rooms or family characters were added.

- [x] Place provisional, distinct Grete and office representative figures in
  the existing hallway. Both stay at authored positions, have separate
  proximity prompts and can be spoken to with `E`. The existing hallway
  picture and room return remain available.
- [x] On first approach, each NPC steps aside once. Pixi'VN storage records
  `metamorphosis.greteSawGregor` and `metamorphosis.clerkSawGregor`; scene
  reconstruction reapplies their poses, so save/restore neither loses nor
  repeats the reaction. Generic `SpatialInteractions` provides proximity;
  the autonomous routine controller is unnecessary for fixed actors.
- [x] Pixi'VN labels give Grete a brief response conditioned on
  `familyResponse` and her earlier stay/leave choice, and the representative
  a two-line response conditioned on `clerkResponse`. No new choices or
  parallel dialogue state were introduced.
- [x] Browser-test both figures, distinct prompts, both reaction flags before
  and after restore, both contextual dialogue paths and their restored
  versions, and return to the room. Inspect the hallway, nearby prompts and
  both dialogues at 800×600. Keep `src/engine/` untouched and run all Journey
  regressions.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 50/50 browser tests in
14.5 minutes. At 800×600, both NPCs and their prompts are visible, Gregor
does not overlap them at interaction distance, and the contextual dialogue
fits the panel. The existing >500 kB bundle warning and software-weather
diagnostic (7.3–7.7 fps with weather, 9.6 without) remain outside this task.

## Office representative leaves the hallway — 2026-09-27

User-directed Metamorphosis follow-up to the visible hallway NPCs. The
pending Heart of Darkness art task remains the first unchecked Journey task.

- [x] After the existing two-line contextual conversation closes, mark
  `metamorphosis.clerkLeaving` in Pixi'VN storage. Compose the already-general
  `attachNpcRoutine()` with one authored exit stop, so the representative
  visibly walks past the picture toward the hallway exit while Gregor remains
  controllable. His interaction is disabled as soon as the withdrawal starts.
- [x] At the exit, remove the actor and record `metamorphosis.clerkLeft` in
  Pixi'VN storage. Rebuilding from a save before the conversation keeps him
  present; rebuilding a save made during the walk settles the withdrawal as
  complete; a save after departure keeps him absent. No trajectory snapshots,
  engine changes, new dialogue choices or new room were needed.
- [x] Browser-test initial presence, dialogue, live movement and disappearance,
  no repeated encounter, Gregor's continued movement, Grete's availability,
  the return door and all three save phases. Inspect the start, route and
  empty exit at 800×600; run every Journey regression.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 51/51 browser tests in
14.9 minutes. At 800×600, the representative moves below the wall picture
toward the marked exit without crossing the door or Gregor; dialogue and
prompts remain legible. The existing >500 kB bundle warning and software
weather diagnostic (7.0–7.1 fps with weather, 9.2 without) are unrelated.

## Grete's physical hallway response — 2026-09-27

User-directed Metamorphosis follow-up. The pending Journey art task remains
unchanged; this work adds no room, character or engine behavior.

- [x] After her existing hallway conversation, record
  `metamorphosis.greteReacted` in Pixi'VN storage and reuse `attachNpcRoutine()`
  for an authored retreat. Her earlier `stay`/`leave` choice decides whether she
  remains available at a new position or leaves through the far exit. The
  family `answered`/`silent` response changes the distance she keeps when she
  stays and her first retreat stop when she leaves. No new choice was added.
- [x] Grete pauses at (920,760) after `stay`/`answered` or (970,800) after
  `stay`/`silent`, then offers only a brief follow-up line. After `leave`, she
  steps back, moves below the representative along the lower edge of the
  walkable floor and exits at (1560,760). On arrival, record
  `metamorphosis.greteLeft` and remove her actor. Gregor keeps moving and the
  representative's independent withdrawal remains unchanged.
- [x] Reconstruct pre-conversation saves at Grete's initial pose. A save during
  the walk settles at the authored final pose or absence; after completion,
  save/restore and room-to-hallway re-entry preserve that result. This follows
  the existing representative pattern without serializing a path.
- [x] Browser-test both outcomes, the two `stay` distances, initial presence,
  dialogue, visible movement, no repeated main dialogue, save phases, room
  return, re-entry and Journey regressions. Review start, route, final poses,
  prompts and dialogue at 800×600.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 54/54 browser tests in
16.6 minutes, including all Journey regressions. At 800×600 the start,
retreat, lower-floor route, two waiting positions and absent-after-exit view
remain readable; Grete no longer overlaps the representative while leaving.
The provisional art, existing >500 kB bundle warning and software weather
diagnostic (7.1–7.4 fps with weather, 9.4 without) remain outside this task.

## Journey audio listening diagnostics — 2026-09-26

Baseline: `98656f2` on `journey-vertical-slice`. This focused listening aid does
not start the pending first-pass art task.

- [x] Add a Journey-only panel, hidden during normal play and toggled with `P`.
  It shows Marlow's deck location and coordinates, plus live mixer volume,
  target, Pixi'VN channel volume and playback state for river, shore and engine.
  It reads the existing controller without changing sound or gameplay state.
- [x] Keep the overlay and route outside `src/engine/`; dispose its key listener,
  ticker callback and DOM when the scene is rebuilt. Browser-test that `P` works
  during movement and Pixi'VN dialogue without capturing input, and that scene
  restart leaves one hidden panel.
- [x] Document river → shore → engine listening stops, save/restore instructions
  and a short way to note levels, timbre and transition/loop artifacts in
  `public/assets/audio/README.md`.
- [x] Run `agent:check` and pertinent browser regressions. `agent:check` passed
  TypeScript, 89 unit tests in 19 files and production build. Targeted
  `agent:e2e` passed 14/14 tests covering audio, diagnostics, conversation,
  movement and save/restore in 3.5 minutes. The existing >500 kB bundle warning
  remains. No human auditory judgment is claimed; the route is ready for it.

## Audible provisional ambience — 2026-09-26

Baseline: `0cd5876` on `journey-vertical-slice`. This is a focused audio-asset
follow-up, not the broader first-pass art or vertical-slice polish task.

- [x] Replace the shared silent WAV with distinct reproducible river, shore and
  machinery sketches. The generator uses only original oscillators and seeded
  noise, with no third-party recordings or samples. Record source, creator and
  CC0 asset terms in `public/assets/audio/README.md`.
- [x] Keep aliases and cue parameters in Heart of Darkness story configuration.
  Retune zone radius, volume and fades without editing the generic audio engine.
- [x] Add PCM asset checks for distinct non-silent files, duration, peak and
  loop seam. Browser-check decode, running context after gesture, live Pixi'VN
  media/channel counts, movement and save/restore.
- [x] Run complete `agent:check` and `agent:e2e`, then create one local commit.
  Leave the Phaser stash untouched; no push or next-task work.

Automated tests cannot judge the perceived timbre or balance of these synthetic
drafts. The asset README gives a short headphone-based listening route for the
project owner. The separate sound-production phase may replace the three paths
in story configuration without modifying `src/engine/`.

Validation: `npm run agent:check` passed TypeScript, 89 unit tests in 19 files
and the production build. `npm run agent:e2e` passed 29 browser tests in 9.7
minutes, including browser decoding of all three non-silent loops, channel
uniqueness, movement, scene restoration, neutral portability and all existing
gameplay regressions. The browser confirmed a running audio context after a
canvas gesture; no direct human listening took place. The previous >500 kB
bundle warning remains. Software-rendered fog diagnostic was 7.8 fps with fog
and 10.1 fps without it, consistent with prior runs. No audio engine module,
save format or other-story content changed.

## Completed zone ambience implementation — 2026-09-26

Baseline: `2b03ddf` on `journey-vertical-slice`. The user selected the first
unchecked task and specified a reusable layered zone system before final assets.

- [x] Build a story-neutral audio mixer: independent layers, optional proximity
  zones, priority groups, smooth fade/crossfade, enable/volume control, generic
  listener target and lifecycle cleanup.
- [x] Adapt it to Pixi'VN's public `sound.play`/channels/stop/pause/resume API.
  Pixi'VN owns playback and save state; the scene owns zone definitions. Reconcile
  aliases after `Game.restoreGameState()` rather than serializing playback time.
- [x] Compose a minimal temporary-silence ambience and one zone in Journey, with
  no authored music or final sound design. Exercise neutral and Journey browser
  flows, including scene re-entry and restored position.
- [x] Document how a second work supplies its own sources and zones. Run
  `agent:check`, then `agent:e2e`; create one commit, keep Git clean and the
  Phaser stash intact, with no push or next-task work.

Implementation: `SpatialAudioController` accepts any position provider and
authored base or circular-zone layers. Distance determines continuous gain;
groups divide gain by priority while unrelated layers mix simultaneously.
Per-layer fade durations smooth entries, exits and content-driven changes.
`PixiVnAudioOutput` uses Pixi'VN tracked sounds and background channels, waits
for a canvas gesture, reconciles restored/missing media and cleans late loads.
`attachSpatialAudio` uses the existing Pixi ticker and scene destruction event.
Journey defines river, shore and engine placeholder layers outside the engine;
the three aliases currently point at the same short silent WAV. There is no
music design, user audio menu, alternate persistence format or other-story code.

Validation: `npm run agent:check` passed TypeScript, 88 unit tests across 18
files and Vite production build. `npm run agent:e2e` passed all 28 Playwright
tests in 9.7 minutes. New browser cases cover real Pixi'VN media and channel
state, priority/proximity, keyboard movement, scene restoration and a neutral
room/window/door soundscape. Existing camera, movement, NPC, dialogue, cargo,
parallax, save/restore and weather regressions passed. The existing >500 kB
main-chunk warning remains. Software-rendered fog diagnostics were 7.6/7.9 fps
with fog and 10.1 fps without; no general rendering optimization was in scope.
No physical listening claim is made: the integration asset is intentionally
silent, and browser tests inspect media, gains and transitions deterministically.
Pixi'VN retains named channel definitions (it exposes no channel removal);
scene media and event listeners are cleaned, and stable aliases are reused.

## Architecture portability audit — 2026-09-24 (before refactor)

The user selected this audit before the pending audio task. Baseline: `1ed2331`.

- Already reusable: bounded `MovementController`, configurable `CameraDirector`,
  `NpcRoutineController`, periodic parallax, scalar atmosphere, world layers and
  their ticker adapters. No `src/engine/` module imports Journey story/content.
  Pixi'VN already provides labels, choices, conditions, storage and save/restore;
  wrapping those in a second narrative engine would add coupling, not remove it.
- Correctly game-specific: Marlow/deckhand art and routine, river layer data,
  weather keyframes, cargo flag, labels, dialogue text, scene composition and
  conversation HUD. These belong outside `src/engine/`.
- Reuse gaps: `attachJourneyConversation` owns proximity selection and `E`
  arbitration for both talk and cargo; `createJourneyCargoInspection` repeats its
  own reach check. A neutral spatial-action resolver can serve both while leaving
  Pixi'VN dialogue in content. `journeyState` holds a generic number checkpoint
  helper; make the storage adapter reusable while Journey still defines keys.
  The fixed procedural fog artwork currently lives in `engine/weather`, although
  its visual recipe is content art. Camera's private `player` label means any
  follow target, so clarify that name. Keyboard controls have fixed defaults;
  expose optional bindings without changing existing input.
- Deliberate limits: one rectangular walkable area/circular footprint, manually
  composed Journey scene, Journey-specific HUD, no NPC routine checkpoint and no
  audio implementation. A declarative scene DSL, generalized collider, custom
  dialogue/save systems or speculative NPC persistence are not justified now.

Audit follow-up: extract only the shared spatial-action and Pixi'VN checkpoint
adapters, keep fixed fog artwork with Heart of Darkness, add a neutral portability
fixture and an engine-import boundary check, document the composition recipe,
then run the complete validation gates before one commit.

Implementation:

- [x] Add a pure `SpatialInteractions` resolver for targets, ranges, priorities,
  enabled predicates and callbacks, plus a focused-key binder. Both the sailor
  and cargo tally now use it; Pixi'VN still owns dialogue/choices and Journey
  still owns prompts, labels and narrative outcomes.
- [x] Extract `createPixiStorageCheckpoint` from Journey-specific state code.
  A caller supplies its storage key and validator; Journey's own keys and cargo
  decision remain in content. Pixi'VN remains the only save/restore authority.
- [x] Allow authored keyboard bindings while preserving WASD/arrows by default.
  Clarify the camera's generic follow-target name and move the fixed fog texture
  recipe into Heart of Darkness story art. Leave world/NPC/parallax/atmosphere
  algorithms in `src/engine` without novel imports.
- [x] Add a story-neutral browser fixture proving movement, interaction and
  Pixi'VN export/restore with `test-player`/`test-interactable` keys; check
  custom controls and focused `E` input. Add a TypeScript-AST unit guard that
  rejects relative imports from `src/engine` to outside that directory.
- [x] Document current boundaries, the composition path for another work and
  known limitations in `docs/ENGINE_ARCHITECTURE.md`; add an agent rule to reuse
  systems and keep engine dependencies pointed inward.
- [x] Run complete `agent:check` and `agent:e2e`, record results, create one
  commit, verify clean Git and untouched Phaser stash. No push.

Validation: `npm run agent:check` passed TypeScript, 77 unit tests in 15 files
and Vite production build. `npm run agent:e2e` passed all 26 browser tests in
9.6 minutes, including the three neutral portability cases and the existing
Journey movement, camera, NPC, interaction, conversation, parallax, save/restore
and weather regressions. The existing >500 kB chunk warning remains. The
software-rendered weather diagnostic was 7.6/7.7 fps with fog and 9.8 fps
without; no rendering optimization was attempted in this architecture task.

Remaining design limits are intentional: no generic scene schema or multi-game
bootstrap, Journey-specific HUD/dialogue adapter, rectangular navigation, no
NPC-routine checkpoint, and no zone audio yet. A future *Metamorphosis* scene
can reuse movement, camera, action selection/input, NPC routine, parallax,
atmosphere and Pixi'VN checkpoint adapters, but must author its own scene,
visuals, labels and UI adapter.

## Completed spatial and voyage save/restore validation — 2026-09-24

Baseline: `a16ef94` on `journey-vertical-slice`. The user selected this validation
before the pending audio task.

- [x] Checkpoint Marlow's exact world coordinates, unwrapped near-bank voyage
  distance and smoothed atmosphere progress in Pixi'VN `storage`, which
  `Game.exportGameState()` and `Game.restoreGameState()` already serialize.
  Generic movement, parallax and atmosphere adapters accept an optional
  checkpoint channel; Journey owns the story-specific keys.
- [x] Rehydrate live controllers when Pixi'VN replaces storage on restore.
  Constrain restored player coordinates to deck bounds, reset stale velocity,
  reconstruct the river tile phase from saved distance, and immediately rebuild
  fog and world shading from saved atmospheric progress. Gameplay then continues
  on the existing ticker without a second save manager or save/load UI.
- [x] Browser-test move -> export -> move elsewhere -> restore using the real
  actor's exact coordinates. Browser-test early voyage -> export -> deep voyage
  -> restore using exact serialized distance/progress plus visibly lighter fog
  and world tint. The existing inspected/ignored cargo dialogue save tests and
  the complete gameplay regression suite still exercise restored interaction,
  river motion and weather.
- [x] Add focused controller tests for exact/bounded position restore, wrapped
  river phase restore and immediate atmosphere reversal. Run `agent:check` and
  complete `agent:e2e`; commit separately without push or touching the Phaser
  stash.

Validation: `npm run agent:check` passed TypeScript, 73 unit tests across 12
files and the production Vite build. `npm run agent:e2e` passed all 23 browser
tests in 10.3 minutes, including both new restore paths and the existing cargo,
movement, dialogue, parallax and weather cases. The pre-existing >500 kB bundle
warning remains. The weather diagnostic reported about 7–7.3 fps with fog and
9.4 fps without it in software rendering; no new rendering optimization was in
scope.

Limits: the route currently has continuous travel progress and authored
atmospheric bands, but no phase-gated dialogue or event to replay. The browser
test verifies the visible weather state for the restored phase. NPC routine
position and independent decorative parallax/fog offsets are outside this
checkpoint; the near-bank distance is the canonical journey-progress source.
There is still no player-facing save/load UI. Audio remains the next task.

## Completed narrative save/restore task — 2026-09-24

Baseline: `c1d64c1` on `journey-vertical-slice`. The user explicitly selected
save/restore before the still-pending audio task.

- [x] Use Pixi'VN's `Game.exportGameState()` and `Game.restoreGameState()` directly.
  Keep `journey.cargoMarkInspected` in Pixi'VN storage, which is part of its
  serialized `GameState`; add no project save manager, save UI or gameplay code.
- [x] Exercise inspected -> JSON save -> fresh page -> restore -> modified sailor
  answer. Reach the sailor after restore and verify real parallax/fog ticker updates.
- [x] Exercise ignored -> JSON save -> later inspection -> restore -> original
  sailor answer. This proves restoration replaces the changed narrative flag.
- [x] Run `npm run agent:check` and the full `npm run agent:e2e`; keep the
  existing movement, camera, NPC, conversation, interaction, parallax and weather
  regression suite passing. One commit, no push, Phaser stash untouched.

Verification: TypeScript, 70 unit tests and production build passed in
`agent:check`. Playwright's complete 21-test `agent:e2e` run finished with
`passed` and no failed tests, including both new save/restore paths. A small
test-only probe calls the public Pixi'VN API and samples restored scenery; it
does not add an alternate persistence path. The existing large-chunk build
warning remains. This smoke test covers the narrative flag and live scene after
restore; exact player/NPC positions and voyage phase are not checkpointed by
these smoke tests. Pixi'VN warns that no route-navigation callback is configured
during restore; the current slice has only the start route.

## Completed environmental interaction task — 2026-09-23

Baseline: `bb8d2a1` on `journey-vertical-slice`.

- [x] Place an optional, visibly marked cargo tally on the port-side fittings.
  Reuse the existing conversation prompt and `E` input when Marlow is in reach;
  active conversation still owns `E`, and `1/2` remain Pixi'VN choices.
- [x] Record inspection as `journey.cargoMarkInspected` in Pixi'VN storage.
  Keep the world reach adapter small and story-specific, without inventory,
  quests, a new UI or a parallel narrative state manager.
- [x] Let the existing cargo-answer label choose its later line from stored state:
  an uninspected tally keeps the original answer; inspecting the erased mark
  makes the sailor acknowledge the missing destination.
- [x] Test both paths in browser, recheck conversation regression and review
  the prompt and changed dialogue visually at 1366x768 and 800x600.
- [x] Run `npm run agent:check` and the complete `npm run agent:e2e`; commit only
  after they pass. No push or Phaser stash changes.

Verification: `agent:check` passed TypeScript, 70 unit tests and the production
build. `agent:e2e` passed all 19 tests, including two new cases for inspecting
and ignoring the tally. The existing conversation test now waits for the sailor's
specific prompt, since `E` can also offer inspection elsewhere on the deck.
Visual captures at both resolutions show the tally and reachable prompt; the
later answer is readable with the existing dialogue panel. Existing build chunk
warning remains (main chunk about 552 kB). Pixi'VN storage owns the flag, but
export/restore coverage belongs to the later save/restore task.

## Completed weather task — 2026-09-19

Baseline: `33bcb9f` on `journey-vertical-slice`.

- [x] Add a reusable progress-driven scalar atmosphere profile with continuous
  interpolation and smoothing. No timer advances its target; future effects can
  consume additional channels without changing the progression controller.
- [x] Expose signed travel distance from the existing parallax controller without
  changing its motion. Journey reads near-bank distance / 3600; an external
  navigation progress source can be supplied at scene composition.
- [x] Compose three soft fog depths and a restrained shade channel using the
  existing parallax, camera, world layers and ticker. Share one small generated
  texture per scene, clean up on destruction, and keep HUD/dialogue above weather.
- [x] Validate gradual clear/intermediate/deep states, travel while idle, movement,
  conversation, scene re-entry and UI visibility at 1366x768 and 800x600. Measure
  rendering cost without starting a global optimization task.
- [x] Run `npm run agent:check` and `npm run agent:e2e`, review, update the plan
  and commit only after all validations pass. No push or Phaser stash changes.

Decisions and verification:
- `AtmosphereController` interpolates authored scalar channels at progress 0, 0.5
  and 1, with smooth transitions and frame-rate-independent response. A fixed
  progress input never ages by itself. Additional channels can later drive rain,
  storms or lighting without adding novel-specific logic to the engine.
- Journey supplies near-bank signed travel distance / 3600 as progress. Camera
  motion and repeat seams do not affect that distance; an optional progress getter
  supports a future navigation source. The ship keeps advancing while Marlow is
  idle or reading. Time only smooths changes to the supplied progress.
- Three pooled fog layers reuse `attachParallaxLayer` at different speeds/depths.
  A single 256x128 texture is shared per scene. World tint supplies restrained
  shading without another full-screen layer; HUD and dialogue remain outside it.
  Existing ticker/lifecycle own updates and disposal. No per-frame texture creation
  or changes to movement, camera, NPC or Pixi'VN narration controllers.
- Eleven added unit tests cover interpolation, boundaries, fixed progress,
  30/60/120 fps response, reversal, invalid input, stable state reuse, profile
  validation, ticker order/disposal and signed travel distance.
- Three added browser tests cover real voyage advancement while idle/walking,
  smooth atmospheric stages, usable dialogue choices, scene re-entry cleanup,
  shared texture and stable tile pools. Screenshots of all three stages reviewed
  at 1366x768 and 800x600: distant scenery progressively fades while actors,
  controls and dialogue remain visible. Existing gameplay regressions pass.
- `npm run agent:check`: TypeScript passed, 70 unit tests passed and production
  build passed. Existing bundle warning remains (main chunk 551.54 kB).
  `npm run agent:e2e`: all 17 tests passed in 8.0 minutes. Read-only code review
  found no blocking issues.
- Final software-rendering diagnostic measured 7.6/7.5 fps with fog visible and
  9.7 fps with it hidden. Reducing fog overdraw and using world tint improved the
  initial weather implementation, but a measurable rendering cost remains.
  This is functional validation, not a 60 fps claim; GPU performance remains for
  later QA. Measured slow full-deck crossings and scripted camera/re-entry tests
  required longer waits in three existing E2E tests; exact assertions are retained.
- Limitations: provisional fog art; voyage/weather reset on scene re-entry.
  Persistence remains the later save/restore task. No rain, audio, new dependencies
  or general art/performance pass were added.

Manual check: run `npm run dev`, watch the voyage while idle, then use WASD/arrows
and approach the sailor with E. Keep reading or choices open as the fog deepens.
The authored route reaches its deep profile after 3600 units (about 120 simulated
seconds at the current bank speed; slower in the software-rendering environment).
Check dialogue and controls again at 800x600.

## Completed parallax task — 2026-09-17

Baseline: `f120132` on `journey-vertical-slice`. Reuse the existing world layers,
CameraDirector and Pixi'VN ticker/lifecycle; no final art or new dependencies.

- [x] Test and implement reusable periodic layer motion and camera depth offsets
  under `src/engine/`. Maintain bounded phase and pooled seamless horizontal tiles,
  including camera pans/zoom. Detach from the shared ticker on scene destruction.
- [x] Author provisional background, far vegetation, near bank, river surface and
  sparse foreground graphics in Journey data, using the existing palette. Give
  each distinct speed/depth; keep deck, fittings, actors and HUD outside scrolling.
- [x] Integrate continuous travel independently of Marlow's direction and dialogue.
  Observe idle travel, simultaneous movement/conversation and camera coverage at
  1366x768 and 800x600; test repeat seams, frame rates, bounds and cleanup.
- [x] Run `npm run agent:check` and `npm run agent:e2e`, review, update this plan and
  commit. No push or Phaser stash changes. Stop before fog/weather progression.

Decisions and verification:
- `ParallaxLayerController` owns bounded periodic travel and camera compensation;
  `attachParallaxLayer` reuses the existing ticker after camera updates and before
  rendering. Tile instances are pooled, only intersecting tiles are visible, and
  destruction removes the ticker listener. No new render loop or persistence system.
- Journey supplies five provisional tiles: distant ridge (5 units/s), far
  vegetation (14), near bank (30), river currents (58), foreground reeds/debris
  (90). Their horizontal camera depths are 0.08, 0.25, 0.5, 0.8 and 1.15.
  Vertical depth stays at 1 to keep banks aligned with the river. Scenery travels
  toward the stern even while idle; deck, fittings, actors and HUD do not scroll.
- Eight added unit tests cover authored speed at 30/60/120 simulated fps, reverse
  travel, bounded phase, seam continuity, camera compensation, viewport coverage,
  exact tile edges, pool reuse, update order and disposal.
- Two added browser tests measure actual layer transforms during idle, reading
  and choices, check coverage during pans/zoom at 1366x768 and 800x600, and verify
  old layers are destroyed on re-entry. Existing movement, NPC, camera and dialogue
  regression tests also run. Final screenshots reviewed at both resolutions.
- `npm run agent:check`: TypeScript passed, 59 unit tests passed, production build
  passed. `npm run agent:e2e`: the complete 14-test run passed; its persisted
  Playwright result reports `passed` with no failed tests. Read-only review found
  no blocking issues. Existing bundle warning remains (main chunk about 547.7 kB).
- The browser environment measured about 9 fps with the new layers and 11 with
  them hidden. A 12-second full-deck camera-test crossing timed out near the edge
  because movement caps simulation ticks at 50 ms. Only that test's wait increased
  to 20 seconds; exact bounds and frame-based velocity assertions remain intact.
  This validates behavior, not a 60 fps performance target. GPU-accelerated
  performance remains part of the later browser QA/polish task.
- Limitations: provisional geometry repeats every 1920 world units; travel phase
  is transient and resets on scene re-entry. World persistence remains its later
  plan task. No new dependencies or changes to movement, camera, NPC or narration
  controllers were needed.

Manual check: run `npm run dev`, watch the river while standing still, then walk
with WASD/arrows in both directions. Approach the sailor and press E, continue
walking while reading, and leave the choices open to observe uninterrupted travel.
Resize to 800x600 and check the banks, water and sparse foreground at the edges.

## Completed walk-and-talk task — 2026-09-15

Baseline: `6385a50` on `journey-vertical-slice`. Implement only the first pending
task; validate, make a separate commit, no push and no Phaser stash changes.

- [x] Author a short original Spanish exchange about the river and the cargo in
  `src/story/heart-of-darkness/conversation.ts`. Register Marlow alongside the
  existing deckhand; use Pixi'VN labels and choice branches in `src/content/`.
- [x] Attach proximity and input to the existing scene/ticker. E starts within
  180 world units, then advances; 1/2 or mouse chooses a response. Keep Marlow's
  movement, the NPC route and camera follow independent of dialogue.
- [x] Add a nonmodal HTML dialogue panel in `src/ui/`, aligned to the contained
  canvas. Keep speakers, text and choices projected from canonical Pixi'VN state.
  Preserve canvas focus when clicking, allow Tab/Enter and ignore held-key repeats.
- [x] Keep the current line visible beyond 440 world units, with a return prompt;
  block only dialogue progression until within earshot again. End cleanly and
  allow another conversation. Destroy HUD, ticker callback and listeners on re-entry.
- [x] Browser-test both branches, simultaneous real-frame movement, range gates,
  held-key repeats, mouse focus, completion/repeat and restart during choices.
  Review screenshots at 1366x768 and 800x600, run all checks and review the diff.

Decisions and verification:
- Narration, character identity, choice history and branching stay in Pixi'VN.
  No parallel dialogue cursor/state machine, save format, input system or render
  loop. Transient UI busy/error state is local; UI reads narration on the existing
  ticker after movement. Narrative text and ranges stay outside reusable engine code.
- The sailor acknowledges nearby Marlow when idle and continues his authored work
  route. The player sets reading pace; neither reading nor choosing freezes movement.
  The existing CameraDirector remains unchanged and follows Marlow throughout.
- Branches return through Pixi'VN call semantics; closing the conversation clears
  its dialogue/choices and closes that label without rebuilding the deck. Regression
  coverage ensures no empty extra press between a branch answer and the final line.
- Replaced the technical deck subtitle/control legend and removed the visible
  camera target and walkable-area caption. Character and scenery art remain provisional.
- `npm run agent:check`: TypeScript passed, 51 unit tests passed, production build
  passed. `npm run agent:e2e`: all 12 tests passed in 3.5 minutes with a fresh server.
  An earlier run lost its first camera test to a page reload while reusing the dev
  server; rerunning from a clean server passed without changing the camera/test.
- Visually reviewed the opening deck, river response and both responsive choice
  layouts. Read-only code review found no blocking issues. The movement sample's
  precondition observes NPC displacement; a future timing flake should be resolved
  by sampling a walking interval, without weakening movement assertions.
- Limitations: one repeatable authored conversation, no voice/typewriter/portraits
  yet, and no implemented save/restore of transient world positions. Full world
  persistence remains its later plan task. The existing large-bundle warning
  remains (main chunk about 543.5 kB minified).

Manual check: run `npm run dev`, walk right with WASD/arrows toward the sailor,
press E when the prompt enables, keep walking while reading, use E to advance and
1/2 (or the buttons) to choose. Walk out of earshot and back to verify resumption.
Finish the exchange and approach again to replay the other branch.

## Completed agent infrastructure task — 2026-09-15

Baseline: `d2bf60f`. User scope: compact context and standard validation commands,
no gameplay changes; separate commit, no push or changes to the Phaser stash.

- [x] Add `scripts/agent-context.mjs` using only Node built-ins and Git: branch,
  commit, porcelain status, up to 20 changed paths, staged/unstaged short statistics,
  active plans and first unchecked task outside fenced examples. No full diff.
- [x] Add npm aliases for context, deterministic checks and existing Playwright.
  Share typecheck and bundle steps so the quality gate checks TypeScript once;
  stop immediately if a step fails. Preserve typechecking in `npm run build`.
- [x] Update AGENTS and START_HERE with the standard startup/validation workflow.
- [x] Validate all three commands and review the final diff for the independent
  infrastructure commit.

Context reports missing/multiple plans explicitly and never executes the next task.
Integration tests use temporary Git repositories to check clean/dirty state,
status columns, renames, untracked output limits, detached HEAD and plan selection.
No dependencies, game systems or architecture changes are needed.

- `agent:context` verified against the working tree and temporary repositories;
  distinguishes index/worktree columns, caps output and does not print diff bodies.
- `agent:check`: TypeScript passed, 51 tests passed, Vite build passed. The gate
  also stopped correctly on a typecheck failure during development. Node-script
  tests use JavaScript so no Node type dependency or browser tsconfig change is needed.
- `agent:e2e`: all 9 Playwright tests passed in 2.6 minutes via the existing suite.
- Existing bundle-size warning remains (main chunk about 539 kB). No push,
  no stash changes, and no dialogue/walk-and-talk implementation.

## Completed NPC task — 2026-09-14

Baseline: `c36e6e2`. Scope approved: one autonomous deckhand, no dialogue,
parallax, weather or audio; separate stable commit, no push or stash changes.

- [x] Test and implement `src/engine/npc/NpcRoutineController.ts`, composing the
  existing MovementController for footprint bounds and motion. A cyclic list
  of stops defines positions, dwell times, facing and opaque activity ids.
  Expose idle/walking/paused state, pause/resume, face(point), and cameraTarget.
- [x] Add `attachNpcRoutine.ts` on the existing ticker with destruction cleanup.
  Register one canonical Pixi'VN character in `src/content/characters.ts`.
- [x] Author a triangular rope/cargo/lookout routine and animated sailor
  placeholder in `src/story/heart-of-darkness/`. Show feet, head orientation,
  walking stride and task gestures. Keep UI labels readable and scenery static.
- [x] Integrate the scene handle with the existing camera's focus(provider),
  preserving player follow. No conversation system is added; future scene code
  can pause, face the player, focus, then resume both routine and camera.
- [x] Test multiple cycles, dwell timing, arrival without overshoot, facing,
  interruptions, invalid routes, bounds, real-ticker cleanup and camera targeting.
  Observe at least two full live cycles in Chromium, including simultaneous
  Marlow movement and camera focus/return. Run all project validations, review,
  update this plan and commit. Stop before dialogue.

- `NpcRoutineController` composes `MovementController`; cyclic stops carry opaque
  activity ids, dwell times and optional facing. It exposes `idle`, `walking`
  and `paused` modes with position/velocity/facing, action time and remaining dwell.
  Frame remainder is carried across arrivals and pauses to preserve timing at
  30/60/120 fps. Invalid/unreachable stops are rejected; close/identical stops work.
- `pause()` preserves the current leg or remaining dwell; `face(point)` turns
  toward a target without moving; `resume()` restores the interrupted action.
  `cameraTarget` is a provider directly accepted by `CameraDirector.focus()`.
  There is no new camera, input, narrative, identity or persistence subsystem.
- The scene returns `{ camera, npc, player }`. The existing camera test helper
  now uses `.camera`; CameraDirector itself is unchanged. NPC callbacks detach
  on actor destruction, including Pixi'VN label re-entry.
- Pixi'VN canonically registers `journey-deckhand` (Marinero). Its initial station
  moved to (1080,740) so the working sailor is visible in Marlow's initial frame.
  Route: coil rope (2600 ms), check cargo at (1420,690) (2400 ms), survey the river
  at (1260,815) (1700 ms), return. Speed: 95 units/s; footprint: 20 units.
- Provisional art includes a cap, collar, arms, legs, foot shadow, head direction,
  walking stride and three work gestures. The rope provides task context. Cargo
  is drawn behind the sailor, and hands above the torso, keeping actions visible.
- Validation: `npm test` 47 passed; `npm run build` passed; `npm run test:e2e`
  9 passed. Chromium observed two full live cycles (over 25 seconds of simulation,
  about a minute of browser observation), checking every observed frame for
  footprint escapes and positional jumps, plus simultaneous Marlow/NPC movement.
  Coverage also includes pause/face/resume, camera targeting/return, registration,
  initial visibility, destruction, and all existing movement/camera regressions.
- Visually reviewed initial framing, simultaneous movement, each work station,
  corrected hands/cargo layering, and facing Marlow. Read-only code review found
  no remaining blocking issues; added exact duplicate-stop coverage from review.
- Limitations: deterministic authored route in a rectangular corridor; no path
  finding, obstacle/actor avoidance, interaction trigger or dialogue yet. Routine
  state is transient and resets on label re-entry; persistence remains a later
  Pixi'VN save/restore task. Rendering is provisional geometry, not final sprites.
  The inherited 50 ms stall cap slows simulation below 20 fps. The existing
  bundle-size warning remains (main chunk about 539 kB minified).
- No push and no changes to the preserved Phaser stash.

## Completed camera task — 2026-09-14

The user authorized this task through a separate stable commit, without push,
stash changes, NPC behavior or dialogue. Baseline: `c68401c`.

- [x] Test then implement `src/engine/camera/CameraDirector.ts`: logical viewport,
  world bounds, exponential follow, focus on a point/target, smooth zoom, lock,
  and return to the remembered player. Validate finite input and cover zoom so
  even viewports larger than the world cannot reveal empty space.
- [x] Connect `attachWorldCamera.ts` to the existing ticker after movement and
  before render. Transform only the world; clean up on destruction. Keep framing
  (initial zoom 1.5, follow offset y=-160) in Journey data. Pixi'VN retains its
  1920x1080 logical canvas and contain resize policy. UI stays outside the world.
- [x] Browser-test horizontal/vertical/diagonal movement, world edges, resizing,
  scripted focus/zoom/lock/resume, and scene restart. Inspect screenshots.
- [x] Run `npm test`, `npm run build`, `npm run test:e2e`; review code, update this
  plan and commit the stable camera separately. Stop before NPC implementation.

- Scene setup exposes the mounted camera director for later scene code.
  `follow(provider, offset)` remembers the player; `focus(point | provider)` pans
  toward a fixed or moving target; `setZoom(value)` eases toward a covering zoom;
  `lock()` holds position and zoom without stopping gameplay; `resumeFollow()`
  returns to the player's current position and offset without snapping.
- `resumeFollow()` retains the requested zoom. Scene authors can call `setZoom`
  to restore their chosen framing. No automatic cinematic sequence is installed.
- The world, actor and movement coordinates stay unchanged by camera transforms.
  Only the world container's pivot, position and scale change. Titles/instructions
  stay fixed, while the walkable-area caption now belongs to the moving ground.
- Validation: `npm test` 37 passed; `npm run build` passed; `npm run test:e2e`
  7 passed. Unit tests cover 30/60/120 fps easing, monotonic settling, bounds,
  intermediate zoom coverage, invalid data, modes, update order and disposal.
  Chromium covers direction changes, four edges, focus/zoom/lock/resume, scene
  re-entry, fixed UI, viewport resizing and existing movement regressions.
- Inspected screenshots of start, horizontal/diagonal movement, world edges,
  800x600 viewport, scripted focus/zoom and return to Marlow.
- Playwright runs one browser worker: parallel software-rendered scenes caused
  traversal timeouts under load. The full suite passes serially with the same
  movement assertions and deadlines. No gameplay timing workaround was added.
- Reviewed implementation, integration and tests directly. The requested review
  subagent could not run because of its usage limit; no independent review is claimed.
- Limitations: axis-aligned world starting at (0,0), fixed logical viewport for
  the scene lifetime (browser resizing remains Pixi'VN's contain scaling), and
  exponential eased pans rather than timed cinematic timelines. Camera state is
  transient; save/restore remains a later task through Pixi'VN.
- Frame advances remain capped at 50 ms, matching movement's stall protection;
  very low frame rates slow the response instead of producing jumps.
- Existing main-bundle size warning remains (about 533 kB minified). Geometry,
  occlusion and labels remain provisional art, without new NPC or dialogue logic.
- No push; the previous Phaser stash remains unchanged.

## Completed movement task — 2026-09-13

- Stable deck checkpoint: commit `e9665d5` on `journey-vertical-slice`.
- WASD and arrow keys move Marlow at 240 logical units per second; diagonal
  input is normalized and opposing directions cancel. No physics library added.
- A 20-unit footprint around the feet stays in the authored walkable rectangle:
  player center x=420…1500 and y=680…840. This constrains the ground footprint,
  not the visual height of the placeholder or future illustrated sprite.
- `MovementController` is independent of Pixi, keyboard and novel-specific data.
  It exposes read-only movement state for later camera/animation integration.
  `setEnabled` is an explicit movement gate; narration does not pause the world.
- `keyboardMovement` listens on the focused game canvas, preserves text input,
  clears held keys on blur/visibility changes, and aborts listeners on disposal.
- `attachPlayerMovement` uses the existing Pixi'VN app ticker through its public
  API. App access is limited to this composition adapter; no new ticker/render
  loop, canvas, save, dialogue, or audio system is created.
- Destroying the player detaches its ticker callback and keyboard listeners.
  Re-entering the start label resets the player and does not retain held input.
- Frame advances are capped at 50 ms to avoid jumps after stalls. This deliberately
  slows movement below 20 fps; E2E allows 12 seconds for a full crossing under
  software rendering. Timing correctness is tested separately at 30/60/120 fps.
- Validation: `npm test` 27 passed; `npm run build` passed; `npm run test:e2e`
  5 passed. Browser coverage includes WASD/arrows, all four boundaries, key
  release, focus changes, text inputs and scene re-entry. Before/after movement
  and diagonal screenshots were visually inspected.
- Movement audit on 2026-09-14: live actor displacement confirms equal cardinal
  and diagonal speed for WASD and arrow input. All three movement modules and
  their scene integration are included in the movement checkpoint, together
  with unit/browser tests and this plan. Camera work remains pending.
- The existing bundle-size warning remains (main chunk about 530 kB minified).
- No camera behavior, NPC routines or save/restore behavior were implemented.
- The previous Phaser stash remains unchanged.

## Completed deck task — 2026-09-13

- Logical world: 1920×1080. Traversable rectangle: (400, 660), 1120×200.
- Anchors: player (650, 760), NPC (1300, 710), camera (960, 760).
- Generic `createWorldLayers` composes environment, ground, actors and foreground.
- Journey-specific scenery, labels and placeholder markers live in `src/story/`.
- The start label mounts the scene through `canvas.layers.add`; re-entry removes
  and destroys the previous transient scene. No parallel canvas or narrative runtime.
- Scenery is transient, not persistent world state. The future save/restore task
  must restore persistent gameplay data through Pixi'VN and reconstruct scenery
  as needed. No custom save format was added.
- Validation: 13 unit tests, TypeScript/Vite build, and 2 Chromium E2E tests passed.
  Browser coverage checks composition, anchor positions, repeated label entry,
  a single canvas, Pixi'VN errors, and fitting at 1366×768 and 800×600.
- Both viewport screenshots were visually reviewed. Geometry is explicitly temporary.
- In the Codex Windows sandbox, Playwright's server shutdown required permission
  to terminate its child process tree. The same E2E command completed normally
  outside the sandbox (2 passed, 7.5 seconds); no application workaround was added.
- Added package-lock.json for reproducible installation of the existing dependencies.
- Existing Vite warning remains: the main chunk exceeds 500 kB minified (about
  527 kB). This warning was already present in the foundation build.
- Previous unfinished Phaser work is preserved separately in the local stash
  `Preserve unfinished Phaser foundation before approved PixiVN migration`.

## Validation
Before working:

```bash
npm run agent:context
```

After code changes (typecheck, unit tests, build):

```bash
npm run agent:check
```

For gameplay, rendering or browser changes:

```bash
npm run agent:e2e
```

## Decisions
- Pixi'VN remains the narrative/state foundation.
- PixiJS is used for custom RPG/world behavior.
- Do not build a second dialogue/save/audio-state system.
- The first vertical slice must be completed before expanding to other books.
