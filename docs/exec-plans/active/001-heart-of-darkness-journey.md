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
Pixi'VN foundation, TypeScript/Vite setup, tests and browser smoke test are working.

## Ordered tasks

- [x] Establish Pixi'VN + PixiJS foundation.
- [x] Add automated unit/build/browser validation.
- [x] Define repository boundaries and Codex instructions.
- [ ] Create the first playable deck scene using simple placeholder geometry/assets.
- [ ] Add Marlow player movement constrained to the deck.
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
Create the first playable deck scene using simple placeholder geometry/assets.

The goal is not final art. The goal is to prove:
- scene composition
- world scale
- playable area
- where Marlow will move
- where NPCs and camera behaviors will attach

Prefer a clean reusable scene/world structure over a one-off demo.

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
