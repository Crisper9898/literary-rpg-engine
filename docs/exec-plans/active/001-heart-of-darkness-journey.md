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
- [ ] Add one meaningful environmental interaction that changes a later dialogue line.
- [ ] Add basic zone-aware ambience/audio transition.
- [ ] Add save/restore smoke coverage for relevant world state.
- [ ] Replace placeholders with first-pass art direction assets.
- [ ] Run complete vertical-slice browser QA and polish pass.

## Next task
Add one meaningful environmental interaction that changes a later dialogue line.
Keep the working movement, NPC routine, camera, walk-and-talk, parallax and weather
intact. This weather task ends here; the environmental interaction has not started.

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
