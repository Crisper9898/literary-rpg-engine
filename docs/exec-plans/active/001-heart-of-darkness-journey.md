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
Pixi'VN foundation, deck composition and keyboard movement are working. Marlow
moves within the visible playable corridor; the NPC and camera markers remain
static placeholders. Camera direction is the next task and is not implemented.

## Ordered tasks

- [x] Establish Pixi'VN + PixiJS foundation.
- [x] Add automated unit/build/browser validation.
- [x] Define repository boundaries and Codex instructions.
- [x] Create the first playable deck scene using simple placeholder geometry/assets.
- [x] Add Marlow player movement constrained to the deck.
- [ ] Add a reusable camera director with player follow and scripted focus.
- [ ] Add one independently animated/routined NPC.
- [ ] Add a walk-and-talk dialogue sequence using Pixi'VN.
- [ ] Add layered scrolling river/background parallax.
- [ ] Add a simple fog/weather progression.
- [ ] Add one meaningful environmental interaction that changes a later dialogue line.
- [ ] Add basic zone-aware ambience/audio transition.
- [ ] Add save/restore smoke coverage for relevant world state.
- [ ] Replace placeholders with first-pass art direction assets.
- [ ] Run complete vertical-slice browser QA and polish pass.

## Next task
Add a reusable camera director with player follow and scripted focus.

Use the existing world container and moving player in its actors layer. Keep
camera behavior in `src/engine/` and Journey-specific framing in `src/story/`.
The movement controller exposes position, velocity, facing and isMoving, plus an
explicit setEnabled gate. Dialogue must not automatically disable movement.
Do not advance to NPC routines until the camera task has passed its validation.

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
For code changes:

```bash
npm test
npm run build
npm run test:e2e
```

## Decisions
- Pixi'VN remains the narrative/state foundation.
- PixiJS is used for custom RPG/world behavior.
- Do not build a second dialogue/save/audio-state system.
- The first vertical slice must be completed before expanding to other books.
