# Literary RPG Engine V2 — Agent Instructions

## Mission
Build a reusable 2D literary RPG engine for browser-based educational narrative games with indie-game production quality.

## Core stack
- Phaser 3
- TypeScript
- Vite
- Vitest
- Playwright
- Web Audio API
- JSON-driven narrative/content data

## Non-negotiable principles
1. Do not build educational worksheets disguised as games.
2. Reading must coexist with a living world: movement, animation, camera, weather, audio and NPC activity continue when appropriate.
3. Prefer meaningful interaction over arbitrary puzzles.
4. Visual quality must support stylized illustrated characters, expressive portraits, organic UI, lighting, parallax and atmospheric effects.
5. Separate engine systems from game-specific content.
6. Keep files focused and modular; avoid monolithic game files.
7. Use data-driven dialogue, events and scenes whenever practical.
8. Every system must be testable independently.
9. Do not modify core engine behavior to solve one game's content problem unless the feature is reusable.
10. Build one polished vertical slice before expanding scope.

## Initial target
The first production target is:
Heart of Darkness — "The Journey" vertical slice.

It must prove:
- player movement
- illustrated character pipeline
- portrait dialogue
- walk-and-talk dialogue
- cinematic camera
- layered parallax
- dynamic weather/fog
- environmental interaction
- dynamic audio
- narrative triggers
- save/checkpoint foundation
- browser QA

## Documentation
Read before implementation:
- docs/superpowers/specs/2026-09-12-literary-rpg-engine-v2-design.md
- docs/ART_DIRECTION.md
- docs/AUDIO_DESIGN.md
- docs/WINDOWS_SETUP.md

## Workflow
Before implementing a feature:
1. Read the relevant spec.
2. Write/adjust tests first.
3. Implement the smallest working version.
4. Run unit tests.
5. Run browser smoke tests when visual/gameplay behavior changes.
6. Capture screenshots for visual regressions when appropriate.
7. Commit focused changes.

Do not start large-scale implementation until the design spec has been approved.
