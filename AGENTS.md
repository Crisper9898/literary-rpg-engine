# Literary RPG Engine — Codex Instructions

## Mission
Build a reusable browser-based 2D literary game framework with indie-game production quality. The current target is *Heart of Darkness — The Journey*.

## Start every session here
1. Read this file and run `npm run agent:context` before working.
2. Read `docs/START_HERE.md`.
3. Read `ARCHITECTURE.md`.
4. Read the active execution plan in `docs/exec-plans/active/`.
5. Read `docs/PIXIVN_GUIDE.md` only when the task touches Pixi'VN APIs.

If the user says only **"continúa"**, continue the active execution plan from the first unchecked task, validate the work, and update the plan before finishing.

## Rule zero: reuse Pixi'VN first
Pixi'VN owns:
- narration labels, dialogue and choices
- character registration
- save/load game state
- history/backtracking
- persistent storage/flags
- canvas lifecycle
- sound/music state
- browser/agent testing bridge

Do not rebuild or fork those systems.

Custom project code is appropriate for:
- player movement
- collision/navigation
- camera direction
- NPC routines/world simulation
- weather/lighting/parallax orchestration
- environmental interaction
- zone/spatial behavior
- bespoke puzzles/minigames
- project-specific UI

## Boundaries
- `src/content/`: Pixi'VN registrations and labels
- `src/story/`: literary/chapter data
- `src/engine/`: reusable RPG-only systems
- `src/puzzles/`: puzzles/minigames
- `src/ui/`: interface and overlays
- `public/assets/`: runtime art/audio/assets
- `docs/exec-plans/`: resumable implementation plans

Keep novel-specific decisions out of reusable engine code.
For environmental audio, keep sources, aliases, zone locations and narrative
enablement in story/content. Use the generic spatial mixer and Pixi'VN sound
adapter; do not add a parallel playback or sound-save manager.

Before adding a feature, check Pixi'VN and existing engine systems, decide
whether it belongs to engine or content, and prefer configuration/composition
over copying code. Never import a particular work from `src/engine/`; add new
engine infrastructure only for a real reusable capability. For another work,
read `docs/ENGINE_ARCHITECTURE.md` first.

## Context discipline
- Do not scan the whole repository by default.
- Never scan `node_modules`, build output, or Pixi'VN internals unless the local guide and public API are insufficient.
- Prefer targeted search and the smallest relevant file set.
- Reuse existing abstractions instead of creating parallel systems.
- Keep files focused; avoid monoliths.
- When a Pixi'VN API is uncertain, verify the current public API rather than guessing.

## Product principles
- Do not build educational worksheets disguised as games.
- Reading should coexist with a living world.
- Prefer meaningful interaction over arbitrary puzzles.
- Dialogue should not automatically freeze gameplay.
- Build one polished vertical slice before expanding scope.

## Workflow
For each feature:
1. Check the active execution plan.
2. Identify what Pixi'VN already provides.
3. Implement the smallest reusable version.
4. Write/adjust tests where practical.
5. Run `npm run agent:check` after code changes (typecheck, unit tests, build; stops on failure).
6. Run `npm run agent:e2e` for gameplay/rendering/browser changes.
7. Update the active execution plan.
8. Summarize what changed and what comes next.

`agent:context` reports Git state, compact change statistics, active plans and
their first unchecked task. It does not print full diffs or read gameplay files.
Read the relevant instructions and plan after this summary; explicit user scope
takes precedence over the next task printed by the command.

The architecture is approved for implementation with Pixi'VN as the foundation.
