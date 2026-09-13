# Literary RPG Engine

Motor reutilizable para videojuegos literarios educativos en navegador.

## Foundation
The project uses **Pixi'VN** as the narrative/game-state foundation and **PixiJS** for the RPG-specific world layer. We do not rebuild dialogue, save/load, history, storage, character registration or sound-state systems that Pixi'VN already provides.

The first vertical slice is **Heart of Darkness — “The Journey”**.

## Codex startup
For a fresh Codex session, the repository already contains the context it needs.

Codex should follow:
1. `AGENTS.md`
2. `docs/START_HERE.md`
3. `ARCHITECTURE.md`
4. the active plan in `docs/exec-plans/active/`

A ready-to-paste prompt is available in `docs/CODEX_PROMPTS.md`.

## Local setup
Requirements:
- Node.js 20.19+ recommended
- Git
- npm
- Codex/VS Code

Install and run:

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
npm run test:e2e
```

## Structure
```text
src/
  content/     Pixi'VN labels and character registration
  story/       literary content and chapter data
  puzzles/     reusable puzzles/minigames
  ui/          game UI
  engine/      thin RPG-only systems not supplied by Pixi'VN
public/
  assets/      art, audio and other game assets
docs/
  START_HERE.md
  CODEX_PROMPTS.md
  PIXIVN_GUIDE.md
  exec-plans/
```
