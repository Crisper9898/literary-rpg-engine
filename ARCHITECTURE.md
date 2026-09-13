# Literary RPG Engine — Architecture

This is the architectural map of the project. Keep it concise and stable.

## Foundation

### Pixi'VN owns
- narrative labels and progression
- dialogue and choices
- character registration
- persistent storage/flags
- history/backtracking
- save/export/restore state
- canvas lifecycle
- sound/music state
- browser/agent testing bridge

Do not create parallel implementations for these systems.

### Project-owned RPG layer
The project may implement:
- player movement
- collision/navigation
- camera director
- NPC routines
- environmental interaction
- parallax/weather/lighting orchestration
- zone/spatial audio behavior
- bespoke puzzles/minigames
- project-specific UI

## Source boundaries

```text
src/
  content/     Pixi'VN registrations and labels
  story/       literary/chapter data
  engine/      reusable RPG systems not provided by Pixi'VN
  puzzles/     isolated minigames/puzzles
  ui/          interface and overlays
public/
  assets/      runtime art/audio/assets
docs/
  exec-plans/  resumable implementation plans
```

## Dependency direction
Preferred direction:

```text
story/content
      ↓
project RPG systems
      ↓
Pixi'VN + PixiJS
```

Reusable engine code must not depend on one specific novel unless unavoidable.

## State ownership
Persistent game state should flow through Pixi'VN storage/save mechanisms.

Examples:
- narrative flags
- choices
- discovered evidence
- interaction outcomes
- checkpoint/world data needed after reload

Temporary rendering state may remain local to the relevant system.

## First vertical slice
The architecture is proven only when *Heart of Darkness — The Journey* demonstrates:

- moving voyage environment
- player movement on deck
- independent NPC activity
- walk-and-talk dialogue
- cinematic camera control
- layered parallax
- fog/weather progression
- environmental interaction
- dynamic/zone audio
- stateful consequences
- save/restore
- reliable browser execution

## Design principle
Build the smallest reusable capability required by the vertical slice.

Do not generalize early.
Do not rebuild Pixi'VN.
Do not let educational requirements make the game feel like a worksheet.
