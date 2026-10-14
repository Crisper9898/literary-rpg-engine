# Literary RPG Engine

Motor reutilizable para videojuegos literarios educativos en navegador.

## Foundation
The project uses **Pixi'VN** as the narrative/game-state foundation and **PixiJS** for the RPG-specific world layer. We do not rebuild dialogue, save/load, history, storage, character registration or sound-state systems that Pixi'VN already provides.

The first vertical slice is **Heart of Darkness — “The Journey”**.

Current narrative coverage and remaining production work are recorded in
[the Heart of Darkness audit](docs/heart-of-darkness/COVERAGE-AUDIT.md).
Playable later episodes do not yet constitute a complete adaptation of the novel.

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

La página abre **Heart of Darkness** por defecto. El selector visible permite
entrar en **La metamorfosis**; también puedes abrir directamente
`/?story=metamorphosis`. En la habitación de Gregor, camina con WASD/flechas,
pulsa `E` cerca de la ventana o la puerta y responde a Grete con `1`/`2`.
Sus tres ambientes son provisionales.

El prólogo opcional de la Nellie está en `/?story=journey&episode=prologue`.
Explora la amarra, comienza el relato con `E` junto al centro de la baranda y
continúa hacia el vapor desde el extremo derecho. Conserva la entrada habitual
en la cubierta y hace explícita la elipsis de las primeras estaciones todavía
pendientes. Véase [la ruta y sus límites](docs/heart-of-darkness/THAMES-PROLOGUE.md).

El encargo y la visita a la Compañía están en `/?story=journey&episode=commission`.
Explora el mapa, lee la recomendación, firma el contrato y responde al médico
con `1`/`2`. La despedida recuerda esa respuesta y la observación opcional del
mapa. [Ruta y adaptación](docs/heart-of-darkness/COMPANY-COMMISSION.md).

El viaje costero y la Estación Exterior están en
`/?story=journey&episode=outer-station`. Observa el buque, desembarca, explora el
camino y la arboleda, responde con `1`/`2` y escucha al contable. La decisión
deja memoria; el episodio termina antes de la caravana y la Estación Central.
[Ruta y límites](docs/heart-of-darkness/OUTER-STATION.md).

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
