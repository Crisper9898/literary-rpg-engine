# Literary RPG Engine

Motor reutilizable para videojuegos literarios educativos en navegador.

## Foundation
The project uses **Pixi'VN** as the narrative/game-state foundation and **PixiJS** for the RPG-specific world layer. We do not rebuild dialogue, save/load, history, storage, character registration or sound-state systems that Pixi'VN already provides.

The first vertical slice is **Heart of Darkness — “The Journey”**.

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
  PIXIVN_GUIDE.md
  ART_DIRECTION.md
  AUDIO_DESIGN.md
```

Start with `AGENTS.md` and `docs/PIXIVN_GUIDE.md` before implementing features.
