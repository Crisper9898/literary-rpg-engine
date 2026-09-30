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

<!-- ART_DIRECTOR_ADDENDUM_V1 -->
# ART DIRECTION ADDENDUM — Literary RPG Engine

These rules are mandatory for tasks touching visuals, scene composition, UI, character sprites, backgrounds, lighting, transitions, or asset integration.

## North-star benchmark
The existing visual presentation of **La metamorfosis** is the minimum acceptable quality bar. Do not replace its strongest visual ideas with generic AI-looking assets. The target is to equal or exceed it in cohesion, atmosphere, staging, readability, and narrative intent.

The game must feel like a handcrafted literary graphic novel, not a collage of unrelated AI images.

## Core rule
**Codex is the integrator and visual systems engineer, not the illustrator.**

Never solve an art problem by dropping a random generated PNG into a scene. If a required asset does not exist, create a precise art brief in `docs/art-briefs/` using `docs/ASSET_BRIEF_TEMPLATE.md` and do not substitute a random placeholder unless the user explicitly approves one.

## Shared studio language
- 2D graphic-novel / illustrated-theatre presentation.
- Hand-painted or inked backgrounds with deliberate composition.
- Strong silhouette design and controlled limited palettes.
- High contrast, cinematic motivated lighting.
- Slightly exaggerated expressions and poses.
- Characters must feel drawn for the same game as their environments.
- UI must feel editorial, literary and cinematic rather than app-like.
- Every visual element must reinforce the current narrative beat.

Never use photorealistic cut-out people over illustrated backgrounds, glossy 3D aesthetics, inconsistent line weights, floating ungrounded PNGs, arbitrary character scale, fake text inside generated images, mixed art styles, plastic skin, over-detailed fabric, random accessories, or generic AI concept-art assets.

## Story identities
### La metamorfosis
Black, dirty ivory, tobacco brown, muted gray, blood red. Claustrophobic expressionism, domestic horror, doors, shadows, intrusive silhouettes and oppressive geometry. Existing strong art is protected.

### Frankenstein
Charcoal, midnight blue, cold cyan/electric blue, oxidized bronze and candle amber. Romantic Gothic, obsession, sublime nature and scientific sacrilege. The Creature must be tragic and expressive, never a generic zombie.

### Heart of Darkness
Soot black, aged paper, swamp green, muddy ochre, fog gray and ember orange. Oppressive heat, uncertainty and river-as-labyrinth. Fog, reflections, vegetation silhouettes and distant fires.

## Scene composition
For every major scene:
1. Establish foreground, midground and background when appropriate.
2. Place the focal character for the narrative beat, not from a fixed template.
3. Use lighting and contrast to direct attention.
4. Ground characters with contact shadow, occlusion, environmental overlap or compatible lighting.
5. Do not cover important environmental storytelling with UI.
6. Dialogue UI should normally occupy about the lower 20–28% of desktop frames.
7. Avoid repeating `background + character pasted on right + black dialogue box` as a universal layout.
8. When emotion changes, create a visual change: framing, crop, lighting, pose, overlay or background state.

## Technical integration
Before modifying visuals, audit current assets, dimensions, references, layout, layer order and responsive behavior at 1366x768 and 800x600. Do not hardcode story art into `src/engine/`. Prefer story/scene visual manifests or configuration.

## Visual QA gate
A scene is not finished until visually checked at 1366x768 and 800x600. Reject it if the character feels pasted on, styles clash, focal point is unclear, UI competes with the art, scaling creates awkward empty zones, characters crop accidentally, or the scene is less atmospheric than the La metamorfosis benchmark.

## Visual-refactor workflow
1. Audit first.
2. Diagnose the five largest visual problems.
3. Select one representative scene as the vertical slice.
4. Refactor that scene only.
5. Capture and inspect both target resolutions.
6. Compare against the benchmark.
7. Only then propagate the visual system.
8. Run existing unit/build/E2E checks before committing.
9. Create one coherent local commit; do not push unless explicitly requested.

See `docs/ART_BIBLE.md`, `docs/VISUAL_QA_CHECKLIST.md`, and `docs/ASSET_BRIEF_TEMPLATE.md`.
<!-- /ART_DIRECTOR_ADDENDUM_V1 -->
