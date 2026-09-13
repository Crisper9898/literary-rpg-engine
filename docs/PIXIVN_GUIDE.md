# Pixi'VN local guide

This is the first Pixi'VN reference Codex should read before external documentation.

## Foundation
Target: `@drincs/pixi-vn` 1.9.x with PixiJS 8.17+.

## Use Pixi'VN for
- `Game.init` and game lifecycle
- labels, narration and choices
- registered characters
- storage and flags
- history/backtracking
- save/export/restore state
- canvas element lifecycle
- sound/music state
- browser/agent testing

Do not implement parallel replacements.

## Initialization
```ts
import { Game } from "@drincs/pixi-vn";

await Game.init(element, {
  width: 1920,
  height: 1080,
  backgroundColor: "#151a1c",
  resizeMode: "contain",
});

await Game.start("start", {});
```

## Labels
```ts
import { narration, newLabel } from "@drincs/pixi-vn";

export const startLabel = newLabel("start", [
  () => {
    narration.dialogue = "Opening line";
  },
]);
```

## Vite integration
Use `vitePluginPixivn` from `@drincs/pixi-vn/vite` to register content and generate typed ids. Keep its development testing bridge enabled so Codex can inspect and drive the running game.

## Saves
Canonical flow:
```ts
const state = Game.exportGameState();
await Game.restoreGameState(state);
```

Store project world/checkpoint data through Pixi'VN storage so it travels with the canonical save state. Do not create a parallel save engine.

## Custom project layer
Build custom code only where Pixi'VN does not provide the capability:
- movement
- collision/navigation
- camera
- NPC routines
- spatial/zone orchestration
- environmental simulation
- bespoke puzzles

## Context rule
When uncertain:
1. search this repository;
2. read this guide;
3. inspect only the relevant Pixi'VN public API/documentation;
4. inspect dependency internals only as a last resort.

This order is intentional: it reduces context usage and avoids rebuilding solved systems.
