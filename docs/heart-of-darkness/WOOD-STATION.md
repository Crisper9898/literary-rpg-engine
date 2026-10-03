# Heart of Darkness — the abandoned wood station

## Literary coverage and adaptation

This milestone implements the part II landing at an empty reed hut roughly fifty
miles below the Inner Station: prepared firewood, a pencilled warning to hurry
and approach cautiously, and a worn seamanship book with marginal notes Marlow
cannot understand. Source: [Conrad's original text, part II](https://www.gutenberg.org/files/219/219-h/219-h.htm).
Spanish dialogue is newly written connective/adapted content, not a borrowed
modern translation. The existing cinematic Deck stages are preserved; they are
not treated as proof that every intervening event in the novel is implemented.

The player must load fuel to discuss departure. Reading the warning and book is
optional, and changes the departure exchange. Choosing to wait for daylight
follows the novel's cautious approach. Choosing to proceed slowly to a safe
anchorage is a bounded interactive variation. No combat, attack, arrival at
Kurtz's station or night-to-day waiting simulation is implied by either choice.
The choice prepares those future events and already changes an immediate and
repeatable response. Reading the book does not create an inventory system.

## How to play

1. Start Heart of Darkness normally. Approach the sailor and finish his original
   branching exchange with E and 1/2.
2. Walk to the port side next to the cabin, at the rear-left part of the walkable
   deck. The contextual action becomes **E · Desembarcar junto a la cabaña**.
   It is not available remotely or while a conversation is open.
3. On shore, use WASD/arrows to explore: the book by the hut on the left, logs
   in the centre-right, warning board beside the logs. Press E within reach.
4. After loading wood, return to the sailor by the landing. Choose **1: wait for
   daylight** or **2: proceed cautiously**. Movement and animated mist continue
   while reading/choosing. The sailor's response changes to anchor/lead-line
   preparations; Marlow's reflection changes if he examined the book.
5. Speak again to hear the saved plan, then move to the right end of the landing
   and use **E · Volver al vapor**. The old Deck position/voyage resume. The hut
   remains revisitable with its existing state.

## Composition and state ownership

No `src/engine/` change. Scene composition uses `createWorldLayers`, bounded
movement, `CameraDirector`, existing NPC rope-work poses, depth sorting,
`SpatialInteractions`/`bindInteractionKey`, `attachAtmosphere`, moving fog strips
and `attachSpatialAudio`. The small landing uses a stable wide camera so the
hut, logs and river remain visible together. The approved six-cell walk sheets
are reused unchanged. The Deck receives only a content transition action;
none of its art, effects, render settings or movement parameters is altered.

`woodStop.ts` owns layout/asset/audio configuration and Spanish text.
`woodStop.label.ts` owns Pixi'VN narration/choices. `woodStopState.ts` owns these
namespaced Pixi'VN storage values:

| Key under `journey.` | Value |
| --- | --- |
| `deckConversationCompleted` | Enables the spatial landing after the original exchange |
| `currentSpace` | `deck` / `wood-stop`; absent means deck for older saves |
| `woodLoaded` | Fuel-loading observation completed |
| `warningRead` | Warning understood |
| `seamanshipBookRead` | Book observed |
| `approachDecision` | `wait` / `proceed` |
| `woodStopDeparted` | Returned to the steamer after deciding |
| `woodStopPosition` | Independent finite x/y checkpoint |
| `woodStopAtmosphere` | Smoothed 0–1 atmospheric checkpoint |

Exploration/decision progress drives fog and shading (.55 → 1), rather than
elapsed time; fog motion itself continues while idle. Independent shore keys
leave saved Deck coordinates, voyage and atmospheric state intact. No second
render loop, narrative cursor or save format exists.

`Game.exportGameState()` / `Game.restoreGameState()` remain canonical. As with
the existing room/hallway composition, invoke `showJourneySpace()` after restore
to reconstruct transient world bindings from restored `currentSpace` and
checkpoints. Open labels, choice list and selected line come from Pixi'VN and
are not replayed by the scene composer. The start label keeps its original
step indices, so old Deck saves still enter the Deck. No player-facing Save/Load
menu is introduced. E2E probes exercise serialized saves across scene boundaries
and mid-choice/mid-response, not a separate test persistence implementation.

Destroying the scene removes movement, NPC/weather/parallax/audio ticks,
observers, keyboard listeners and UI. Audio uses existing three provisional
loops in a shore-specific spatial mix, not new music. Returning to the Deck
stops those media; re-entering reuses stable aliases. A destroyed Deck input
callback no longer tries to render after disembarkation.

## Art production and QA

New environment only: `public/assets/art/journey-wood-stop/wood-station.png`,
generated with the built-in image tool from
`docs/art-briefs/journey-wood-stop.md` and the approved dusk capture as a style
reference. The exact production composition/palette constraints are recorded
there. This is project-generated artwork; no third-party illustration was
downloaded. No human figures or UI were baked into it. All original approved
Deck illustration bytes and walking sheets are untouched.

Representative exploration/decision captures are retained in
`docs/heart-of-darkness/wood-station-qa/` at both required resolutions.
The 800×600 frame keeps the existing contained presentation with letterboxing.
Scene props and both options must remain visible and clickable; the chapter
title hides when the dialogue panel occupies its space.

| View | Exploration | Decision |
| --- | --- | --- |
| 1366×768 | [capture](wood-station-qa/wood-stop-1366x768.png) | [capture](wood-station-qa/wood-stop-decision-1366x768.png) |
| 800×600 | [capture](wood-station-qa/wood-stop-800x600.png) | [capture](wood-station-qa/wood-stop-decision-800x600.png) |

All four final captures were visually inspected. Props, grounded actors, river
depth and both choices remain visible; no clipped text or off-screen buttons.
The original Deck's four stages and fire dialogue were captured and inspected
again at both sizes. Its illustration/motion bytes, rendering settings and
effect implementation were unchanged.

Final `npm run agent:check`: TypeScript passed, **104/104 unit tests in 25
files** passed, production build passed. `engineBoundary` remains green.
Final complete `npm run agent:e2e`: **65/65 in 19 files, 14.4 minutes**, including
both works and all prior regression checks. Total **169 tests**.
Two new unit cases cover idempotent discovery-driven progress and independent
validated shore geometry/checkpoints. Four new browser cases cover the real
original-conversation prerequisite, spatial entry, both decisions, both evidence
paths, movement during choices, serialized saves before entry/on arrival/at
choice/after decision, restored real position and active dialogue, repeatable
consequences, return, media cleanup, restart, live mist and responsive framing.

Limits: fuel loading is one contextual action, not a hauling minigame. The
decision records preparations; waiting until dawn and fog-bound navigation are
not simulated yet. Environment art is one illustrated plate plus separately
composed actors/shadows/moving fog; props do not yet have bespoke animations.
Spatial audio reuses the existing provisional loops. Physical-GPU profiling and
human listening are deferred as requested; no new SwiftShader optimization was
attempted. No user save menu or additional engine infrastructure was added.

## Remaining narrative milestones and approximate progress

Heart of Darkness has a validated voyage encounter and now this playable stop,
but it does not yet cover the complete novella. A planning breakdown of ten
substantial narrative blocks gives **approximately 20%** complete:

1. Thames frame, commission and departure — pending.
2. Outer/Central Stations, colonial exploitation and repairing the steamer — pending.
3. Upstream voyage and deck encounter — implemented as a focused adaptation.
4. Abandoned hut, fuel, warning and seamanship book — this milestone.
5. Fog-bound approach and attack, including the helmsman — next, pending.
6. Inner Station and the Russian trader — pending.
7. Encounter with Kurtz and the compound — pending.
8. Kurtz's night departure/recapture and leaving the station — pending.
9. Downstream illness, death and Marlow's moral reckoning — pending.
10. Return, the Intended and the framing conclusion — pending.

These blocks are unequal in effort; 20% is a narrative planning estimate, not a
percentage of word count, tests or voyage animation. Earlier chronological
material remains necessary even though the current entry starts in medias res.

For the **currently bounded project** (reusable framework, complete Heart of
Darkness, a Metamorphosis proof slice and release QA), estimate **approximately
45%**: indicative weights 40/40/10/10 and readiness 80/20/40/10 respectively.
This is a rough scheduling metric, not a shipping claim. Definitive audio,
player-facing save/accessibility/settings, physical-GPU QA, final content/art
reviews and release hardening remain. Full Metamorphosis, Frankenstein and
unspecified future works are not counted as completed or included in this
denominator; there is no meaningful fixed percentage for unlimited future works.
