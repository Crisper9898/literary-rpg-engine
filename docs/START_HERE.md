# START HERE — Codex session bootstrap

This file defines the default startup path for Codex when working in this repository.

## Session startup
At the beginning of a new coding session:

1. Read the root `AGENTS.md`.
2. Read `ARCHITECTURE.md`.
3. Read `docs/PIXIVN_GUIDE.md` only if the task touches Pixi'VN APIs.
4. Read the active execution plan in `docs/exec-plans/active/`.
5. Inspect only the files needed for the next task.
6. Do not scan the whole repository unless the task genuinely requires it.

## If the user says only "continúa"
Treat that as:

> Continue the current active execution plan. Pick the next unchecked task, inspect only the necessary files, implement it, validate it, update the execution plan, and summarize what changed.

Do not ask the user to restate the project unless the active plan is missing or contradictory.

## If there is no active execution plan
Create one in `docs/exec-plans/active/` before substantial implementation.

The plan should contain:
- objective
- scope
- non-goals
- affected systems
- ordered tasks
- validation commands
- decisions made
- current status

## Default implementation order
When several tasks are possible, prefer:

1. unblock the vertical slice;
2. complete the smallest playable end-to-end path;
3. add reusable engine capability only when the slice needs it;
4. polish visuals/audio after core interaction works;
5. expand content only after the current slice is stable.

## Current product focus
The current product target is:

**Heart of Darkness — The Journey**

The first slice should feel like a real atmospheric indie game, not a worksheet with dialogue boxes.

## Validation
Before considering a coding task complete, use the narrowest useful checks and then the repository quality gate:

```bash
npm test
npm run build
```

For gameplay, rendering or browser behavior:

```bash
npm run test:e2e
```

Keep the active execution plan updated so another Codex session can resume without reconstructing context.
