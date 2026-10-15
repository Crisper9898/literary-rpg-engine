# Playable web release

User-requested public release, 2026-10-14. Site identity:
`appgprj_6ad04bed6b208191beb274fb941b6bab` (Sites).

Public, live: https://literary-rpg-engine.cristiantt.chatgpt.site

Native deployment reports `succeeded`; the public page was opened and its
illustrated Deck canvas and work selector visually verified in the browser.
Version: `appgprj_6ad04bed6b208191beb274fb941b6bab~appgver_c93f75560ea08191ba1c7bdab70aaa18`.
Deployment: `appgdep_6ad04ce534308191a64dfdc1f21cb3fa`.
Static source commit: `b3e00649fc4ad88dbe2c0df77e7e7c1fc87ff808`.
The release packages the already validated Vite `dist/` directory unchanged.
`.openai/hosting.json` records the project and static directory. The isolated,
ignored `.release/literary-rpg-engine/` checkout holds only the build and hosting
manifest; it never includes the main Git repository, stash, backups or tests.
Short-lived publishing credentials are passed through stdin and are not stored.
On Windows, the packaging helper needs Git Bash first on PATH and
`TAR_OPTIONS=--force-local` for drive-letter archive paths. The initial package
attempt failed on that path format; no gameplay or generated build was changed.

## Play

- `/`: approved Journey Deck and the connected later Heart of Darkness route.
- `/?story=metamorphosis`: existing La metamorfosis slice.
- `/?story=journey&episode=central-station`: caravan and station arrival.
- Existing `episode=prologue`, `commission`, `outer-station` entries remain.
- Move with WASD/arrows, interact/advance with E, choose with 1/2 or the buttons.
  Click the game once to unlock browser audio. Desktop keyboard is required;
  no mobile controls or player-facing Save/Load menu is claimed.

## Evidence and scope

Before publication: `agent:check` passed TypeScript, 227/227 units in 47 files
and Vite build (2.91s). Full `agent:e2e -- --retries=1`: 137/137 in 55 files,
1.0h, no failed attempts/retries recorded. Sixteen runtime/test hashes match
the validated sources. Both target sizes have retained episode QA captures.

This publishes the current playable adaptation, not a claim of complete novel
coverage or finished art/audio across all episodes. The approved Deck, reusable
engine, Phaser stash and preexisting untracked files remain untouched.
