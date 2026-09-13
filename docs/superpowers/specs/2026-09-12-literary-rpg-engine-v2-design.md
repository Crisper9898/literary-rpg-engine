# Literary RPG Engine V2 — Pixi'VN Foundation Specification

## Purpose
Create a reusable browser-based 2D engine for literary narrative games that feel like real indie games rather than interactive worksheets.

The engine first proves itself through a polished vertical slice of *Heart of Darkness* focused on **The Journey**.

## Architecture decision
Pixi'VN is the foundation for narrative flow and serializable game state. PixiJS is the rendering layer beneath it and the extension point for RPG-specific world systems.

The project must not reproduce systems Pixi'VN already provides. Custom code should concentrate on the parts that make this project distinctive: movement, world simulation, camera, environmental interaction, atmospheric rendering and meaningful puzzles.

## Product principles
- Narrative and world simulation coexist.
- Dialogue does not automatically freeze gameplay.
- Interactions serve story, atmosphere, characterization or player agency.
- The engine is reusable across literary genres and visual themes.
- Game-specific data should not require edits to reusable engine code.
- Prefer framework composition to custom engine reinvention.

## Responsibility map

### Pixi'VN foundation
Use Pixi'VN for:
- game initialization/lifecycle
- labels and narrative progression
- dialogue state and choices
- registered characters
- storage and world-state flags
- history/backtracking
- save/export/restore state
- sound/music state
- canvas element lifecycle
- browser/agent testing bridge
- typed content registration through the Vite plugin

### Custom RPG/world layer
Build thin reusable systems for:
- player movement
- collision/navigation
- camera director
- NPC routines and world activity
- environmental interactions
- cinematic timelines when Pixi'VN animation primitives are insufficient
- layered parallax orchestration
- fog, weather, lighting and particles
- spatial/zone audio orchestration on top of Pixi'VN sound
- puzzles/minigames

### Content layer
Game-specific:
- chapters and scene data
- literary adaptation text
- maps/layout data
- NPC definitions
- event/trigger data
- art assets
- music/SFX
- theme configuration
- localization-ready text

### Presentation layer
- Figma-defined UI system
- responsive HUD
- dialogue panels
- portraits
- chapter cards
- inspection overlays
- pause/settings
- accessibility options

## Repository layout
```text
src/
  content/        Pixi'VN registration: labels and characters
  story/          chapter/story data
  puzzles/        puzzle/minigame modules
  ui/             HTML/PixiJS UI layers
  engine/         RPG-specific reusable systems only
public/
  assets/
```

## Dialogue model
Pixi'VN owns narrative progression and dialogue/choice state.

Project-level dialogue metadata may additionally describe:
- portrait/expression
- whether player movement is allowed
- camera direction
- audio cue
- world-state requirement
- completion trigger

Walk-and-talk is a project behavior layered around Pixi'VN narration; it must not require a second dialogue runtime.

## Camera model
Custom camera director should support:
- follow target
- dead zone
- pan
- slow push/zoom
- focus target
- temporary lock
- cinematic rails/timelines
- handoff back to player

Camera behavior should be data-driven where practical.

## Character pipeline
Important characters are integrated from a canonical character sheet:
- design reference
- map sprite
- animation set
- portrait set
- expression ids

Pixi'VN character registration is the canonical identity layer. World sprites/portraits should reference the same character ids.

## Environmental rendering
Use layered scene composition:
1. distant background
2. background architecture/nature
3. gameplay plane
4. foreground occluders
5. atmosphere/post effects
6. UI

Support parallax, light masks, fog, smoke, rain, water motion, particles and restrained color grading.

## Interaction vocabulary
The engine may support:
- observation
- walk-and-talk
- eavesdropping
- contextual actions
- navigation
- following
- environmental manipulation
- inventory/evidence use
- dialogue choices
- timed reactions
- chase
- stealth-like visibility states
- reconstruction/sequencing
- optional exploration discoveries

Avoid arbitrary “collect three objects” structures unless narratively justified.

## Audio
Pixi'VN/Tone provides the sound-state foundation. The project adds a higher-level zone mixer for:
- music
- ambience
- SFX
- dialogue/voice-ready
- UI
- crossfade
- ducking
- interior/exterior transitions
- weather layers

## Save model
Use `Game.exportGameState()` / `Game.restoreGameState()` as the canonical game-state mechanism.

Project state stored through Pixi'VN should include:
- current narrative position
- world-state flags
- dialogue choices
- discovered evidence/interactions
- RPG-world checkpoint data
- settings needed by the game

Do not create a parallel save engine.

## First vertical slice: The Journey
The slice must demonstrate a continuous voyage where:
- the ship moves through a layered environment
- Marlow can move on deck
- NPCs animate independently
- conversations can happen while walking
- portraits change expression
- weather and lighting evolve
- camera occasionally leaves player-follow mode
- environmental interactions add narrative context
- audio mix changes by zone
- at least one interaction changes later dialogue/state
- the sequence ends in a cinematic transition

## Quality gate
Do not expand into multiple chapters until the slice passes:
- unit tests
- browser smoke tests
- no progression blockers
- no text clipping at 1366x768
- stable camera handoffs
- stable dialogue state
- save/restore smoke test
- acceptable frame pacing on a typical school laptop
- visual review for character/style consistency
- audio review for abrupt loops/cuts

## Tech stack
- `@drincs/pixi-vn` 1.9.x
- PixiJS 8.17+
- TypeScript
- Vite + `@drincs/pixi-vn/vite`
- Vitest
- Playwright
- Tone/Pixi'VN sound
- data-driven content

## Out of scope for foundation
- full RPG battle system
- multiplayer
- server backend
- account system
- procedural world generation
- custom visual level editor

These may be added only when a concrete game requires them.
