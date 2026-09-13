# Execution plans

Execution plans let Codex resume substantial work across sessions without rediscovering the entire repository.

## Folders

- `active/`: work currently in progress
- `completed/`: finished plans kept as project history

## Rules
For substantial tasks, Codex should:

1. create or open one active plan;
2. mark completed items as work progresses;
3. record important architectural decisions;
4. record blockers or intentionally deferred work;
5. run validation;
6. move the plan to `completed/` when finished.

Plans should be concise enough to load cheaply but detailed enough for a fresh session to continue without asking the user to repeat context.

## Task syntax

Use checkboxes:

```md
- [x] Finished task
- [ ] Next task
```

The first unchecked item should normally be the next implementation target.
