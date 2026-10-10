# Island breakdown and custody of Kurtz's papers

## Playable route

Continue the departure's final exchange, approach the helm beside the caseta
and press **E · Continuar río abajo**. The episode is optional and cannot begin
before that exchange closes. Marlow keeps WASD/arrows throughout all dialogue.

1. The boat travels downstream briefly; the machine fails and the vessel is tied
   at the head of an island. The bank stops traveling, but water and mist remain live.
2. Approach the low service hatch in the center: **E · Examinar la pérdida y la biela**.
3. At the small forge on the right, use **E · Avivar la fragua**. Work advances only
   within 85 world units. Walking away pauses work; returning resumes it. The
   existing interaction prompt reports progress. This is not an inventory or timing minigame.
4. Return to the central hatch: **E · Volver a montar la biela**. Heat alone does
   not finish the repair or start the engine.
5. Before or between repair actions, approach Kurtz by the caseta. **E** opens
   his request to protect papers and a photograph from the manager. **1** keeps
   the packet closed; **2** asks who is in the photograph. Both accept custody.
6. A subsequent patient response and the resumed voyage line remember that
   response. The exchange also reuses `journey.stationDiscoveries` directly if
   Marlow already read the report; there is no duplicate discovery flag.
7. With the repair and papers exchange complete, return to the helm:
   **E · Probar la máquina y retomar el rumbo**. The engine fades back in and the
   bank resumes traveling. Kurtz remains alive. This episode stops here.

Coordinates: helm/entry (780,750), patient (650,760), hatch (950,735), forge
(1250,800). Use the existing prompt to identify each reachable action. The
nearest enabled action stays spatial; choices remain canonical Pixi'VN objects.

## Literary basis and adaptation

Primary source: [Conrad, Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm).
After departure, the steamer breaks down at an island. Marlow helps with leaking
cylinders, a bent connecting rod and the small onboard forge. Kurtz gives him a
packet of papers and a photograph tied with a shoe-string, fearing the manager
will pry into his boxes. These events are represented here in original Spanish
adaptation. The brief repair path, compressed distance and sealed/ask choice are
game adaptations, not choices or a repair recipe stated by Conrad. Prior armed
pressure remains in memory; the episode does not suggest Marlow prevented all violence.

Final words, death, burial, Marlow's illness, European return and the Intended's
interview are deliberately absent. Accepting the papers does not resolve their
later ownership or the moral consequences of protecting them.

## Canonical state and restore

Pixi'VN storage owns `journey.kurtzBreakdown`:

- `phase`: inactive / downstream / stopped / underway.
- `distance`: finite unwrapped vessel travel; stops at 240 at the island.
- `breakdownSeen`: prevents another failure exchange after it begins.
- `engineExamined`, `repairStarted`, `repairProgress` and `rodFitted`.
- `papersResponse`: sealed / ask, immutable once chosen.
- `papersSeen`: the full packet exchange closed, rather than just clicking a choice.
- `finalSeen`: the resumed-voyage exchange closed.

`journey.breakdownPosition` stores Marlow's actual bounded world coordinates.
Existing `createPixiStorageCheckpoint` validates these values; no save format,
inventory, narrative store or replay timer was added. Normal export is
`Game.exportGameState()`; restore is `Game.restoreGameState()` followed by the
existing `showJourneySpace()` composition.

The stopped bank planes use the existing zero-speed parallax checkpoint API
with a read-only projection of the episode distance. Their initial tile pool
and position are reconstructed immediately, not a frame later. The episode
ticker owns distance; display projections never save a second copy. Flowing
water and fog are transient visuals, not exact playback timelines. Saved work
resumes only if the restored player is near the forge. Open labels/choices stay
with Pixi'VN and are not reissued by scene construction.

The stopped engine fades to zero; water and localized bank ambience remain.
Scene restoration reconciles existing Pixi'VN sources, and destruction removes
tickers, keys, overlays and the owned fog texture. Stable audio namespaces
prevent duplicated playback when composing/restoring twice.

## Boundaries and presentation limits

All new novel state/labels/composition live in content/story. `src/engine/`,
approved Deck source/assets, Metamorphosis and existing audio files are unchanged.
This is a new episode using their factories, not a revision of the approved Deck.
The current cot is staged by the caseta, not inside a new pilot-house.
The two small repair props are procedural; existing report art represents the
papers. There is no new photograph portrait, repair animation, forge sound or
engine-room interior. Specific future prop requirements are in
`docs/art-briefs/kurtz-breakdown-tools.md`; those limits do not block the route.
Automated audio checks validate sources/volume/lifecycle, not a human listening review.

## Validation

Seven state-flow unit cases and four browser cases cover both responses,
prerequisites, real movement, work proximity, observed bank/water behavior,
prior report memory, engine fades, exact coordinates/travel/work restore,
active choices and scene/source cleanup. No older tests were weakened.

Final `agent:check` passed: TypeScript, 160/160 unit tests in 37 files and build
(2.46s). Final full `agent:e2e` passed: 97/97 cases in 35 files, 34.5 minutes,
including all 93 unchanged preexisting cases. Both commands exited 0.
The focused four-case run also passed in 3.6 minutes after the atlas correction.

22 captures (eleven moments at both sizes) were visually inspected and retained
in `docs/heart-of-darkness/kurtz-breakdown-qa/README.md`. At 800×600, the existing
contain layout keeps the boat, characters, text and choices in view. Real texture
crop and sprite-dimension assertions protect the restored patient against
accidentally displaying the entire atlas. The active plan records scope and
remaining presentation limits. No next episode is triggered by this route.
