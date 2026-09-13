---
name: pixi-vn-literary-rpg
description: Use when implementing or modifying the Literary RPG Engine, especially narration, dialogue, saves, characters, audio, canvas scenes, RPG world systems, puzzles, UI, or Heart of Darkness content. Reuse Pixi'VN before creating custom engine code and keep context/search bounded.
---

# Pixi'VN Literary RPG workflow

The user's explicit instructions take precedence over this skill.

## Start here
1. Read the root `AGENTS.md`.
2. Read only the relevant part of `docs/PIXIVN_GUIDE.md`.
3. Read the smallest set of project files involved in the task.
4. Do not scan `node_modules`, generated output, or the whole repository.

## Classify the requested feature

### Use Pixi'VN directly
Do not create a parallel implementation for:
- labels and narrative progression
- dialogue state and choices
- character registration
- storage/flags
- history/backtracking
- save/export/restore
- canvas element lifecycle
- sound/music state
- agent/browser testing bridge

### Custom project code is appropriate for
- player movement
- collision/navigation
- camera direction
- NPC routines/world simulation
- environmental interaction
- weather/parallax/lighting orchestration
- spatial or zone behavior layered on Pixi'VN
- bespoke puzzles/minigames
- project-specific UI

## Where code belongs
- Pixi'VN registrations: `src/content/`
- literary/chapter data: `src/story/`
- puzzles/minigames: `src/puzzles/`
- UI: `src/ui/`
- reusable RPG-only extensions: `src/engine/`
- runtime assets: `public/assets/`

## Efficient implementation loop
1. Search for an existing project abstraction first.
2. If the feature belongs to Pixi'VN, use its public API.
3. If the API is uncertain, consult the local guide, then only the relevant official Pixi'VN public documentation.
4. Add the smallest reusable code needed.
5. Keep chapter-specific decisions out of `src/engine/`.
6. Run the narrowest useful test first.
7. Before finishing, run:
   - `npm test`
   - `npm run build`
   - `npm run test:e2e` when browser/gameplay behavior changed

## Heart of Darkness constraint
The first vertical slice is *Heart of Darkness — The Journey*. Do not expand to multiple novels or chapters until that slice proves the architecture and passes its quality gate.
