# Literary RPG Engine — Codex Instructions

## Mission
Build a reusable browser-based 2D literary game framework with indie-game production quality. The first production target remains *Heart of Darkness — The Journey*.

## Core stack
- Pixi'VN (`@drincs/pixi-vn`) as the narrative/game-state foundation
- PixiJS for custom world rendering and RPG-specific systems
- TypeScript
- Vite + `@drincs/pixi-vn/vite`
- Vitest
- Playwright
- Tone/Pixi'VN sound
- Data-driven story/content

## Rule zero: reuse Pixi'VN first
Before implementing a system, check whether Pixi'VN already owns it.

DO NOT rebuild these from scratch:
- narration labels, dialogue flow and choices
- character registration
- save/load game state
- history/backtracking
- persistent storage/flags
- canvas lifecycle and asset registration
- sound/music state management
- AI/browser testing bridge

Use the APIs already provided by Pixi'VN. Custom engine code is justified only for capabilities the project genuinely needs beyond Pixi'VN, especially:
- player movement
- collision/navigation
- camera direction
- NPC routines/world simulation
- weather/lighting/parallax orchestration
- environmental interaction
- bespoke puzzles/minigames

Do not fork or edit Pixi'VN internals to solve game-specific problems.

## Project boundaries
- `src/content/`: Pixi'VN registration layer (labels, characters).
- `src/story/`: reusable literary story data and chapter-specific content.
- `src/puzzles/`: puzzle/minigame implementations.
- `src/ui/`: game UI and overlays.
- `src/engine/`: thin reusable adapters and RPG-only systems not supplied by Pixi'VN.
- `public/assets/`: art, audio and other game assets.
- `docs/`: local architecture and production guidance.

Keep game-specific data out of reusable engine systems.

## Context/token discipline
1. Read this file first.
2. Read `docs/PIXIVN_GUIDE.md` before searching external docs.
3. Read only the relevant section of the design spec for the task.
4. Never scan `node_modules`, build output, or Pixi'VN source unless the local guide and public API are insufficient.
5. Prefer targeted repository search over reading many files.
6. Reuse existing abstractions instead of generating parallel systems.
7. Keep files focused; avoid monoliths.
8. When a Pixi'VN API is uncertain, verify the current public API rather than guessing.

## Product principles
1. Do not build educational worksheets disguised as games.
2. Reading must coexist with a living world: movement, animation, camera, weather, audio and NPC activity continue when appropriate.
3. Prefer meaningful interaction over arbitrary puzzles.
4. Visual quality must support stylized illustrated characters, expressive portraits, organic UI, lighting, parallax and atmospheric effects.
5. Dialogue does not automatically freeze gameplay; walk-and-talk remains a target capability.
6. Build one polished vertical slice before expanding scope.

## First vertical slice
*Heart of Darkness — The Journey* must prove:
- moving ship/environment
- player movement on deck
- independent NPC animation
- portrait and walk-and-talk dialogue
- cinematic camera
- layered parallax
- dynamic fog/weather
- environmental interaction
- dynamic audio zones
- narrative flags/triggers
- save/checkpoint foundation
- browser QA

## Workflow
For each feature:
1. Identify what Pixi'VN already provides.
2. Read the smallest relevant local documentation.
3. Write/adjust tests where practical.
4. Implement the smallest reusable version.
5. Run unit tests.
6. Run browser smoke tests for gameplay/visual changes.
7. Capture screenshots when visual regression review matters.
8. Keep commits focused.

The architecture is approved for implementation with Pixi'VN as the foundation.
