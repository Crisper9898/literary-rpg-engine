# Literary RPG Engine V2 — Design Specification

## Purpose
Create a reusable browser-based 2D engine for literary narrative games that feel like real indie games rather than interactive worksheets.

The engine will first prove itself through a polished vertical slice of *Heart of Darkness* focused on "The Journey".

## Product principles
- Narrative and world simulation coexist.
- Dialogue does not automatically freeze gameplay.
- Interactions must serve story, atmosphere, characterization or player agency.
- The engine is reusable across different literary genres and visual themes.
- Final visual presentation must support illustrated characters, expressive portraits and atmospheric environments.
- Game-specific data should not require editing core engine code.

## Architecture

### Engine layer
Reusable systems:
- scene lifecycle
- player controller
- collision/navigation
- camera director
- dialogue runtime
- portrait/expression runtime
- interaction system
- event/trigger system
- inventory and evidence
- world-state flags
- NPC state/routine system
- cinematic timeline
- lighting/fog/weather
- audio mixer
- save/checkpoint
- input rebinding
- accessibility hooks

### Content layer
Game-specific:
- chapters
- maps
- dialogue JSON
- NPC definitions
- event graphs
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

## Dialogue model
Dialogue entries must support:
- speaker
- portrait id
- expression
- text
- movement allowed boolean
- optional camera instruction
- optional audio cue
- optional world-state requirement
- optional choice list
- optional trigger on completion

The runtime must permit walk-and-talk sequences.

## Camera model
Support:
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

Assets must pass a consistency review before integration.

## Environmental rendering
Use layered scene composition:
1. distant background
2. background architecture/nature
3. gameplay plane
4. foreground occluders
5. atmosphere/post effects
6. UI

Support:
- parallax
- light masks
- fog
- smoke
- rain
- water motion
- particles
- color grading approximation

## Interaction vocabulary
The engine should support these without assuming every game uses all of them:
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

Avoid arbitrary "collect three objects" structures unless narratively justified.

## Audio
Use an audio bus model:
- music
- ambience
- SFX
- dialogue/voice-ready
- UI

Support crossfade and ducking.

## Save model
At minimum:
- current chapter/scene
- checkpoint
- player position when safe
- world-state flags
- dialogue choices
- discovered evidence/interactions
- settings

## First vertical slice: The Journey
The first slice must demonstrate a continuous voyage sequence where:
- the ship moves through a layered environment
- Marlow can move on deck
- NPCs animate independently
- conversations can happen while walking
- portraits change expression
- weather and lighting evolve
- camera occasionally leaves player-follow mode
- environmental interactions add narrative context
- audio mix changes by zone
- at least one interaction changes a later dialogue/state
- the sequence ends in a cinematic transition

## Quality gate
Do not expand into multiple chapters until the slice passes:
- functional tests
- browser smoke tests
- no progression blockers
- no text clipping at 1366x768
- stable camera handoffs
- stable dialogue state
- acceptable frame pacing on a typical school laptop
- visual review for character/style consistency
- audio review for abrupt loops/cuts

## Tech stack
- Phaser 3
- TypeScript
- Vite
- Vitest
- Playwright
- Web Audio API
- JSON content data

## Out of scope for foundation
- full RPG battle system
- multiplayer
- server backend
- account system
- procedural world generation
- custom visual level editor

These may be added only when a concrete game requires them.
