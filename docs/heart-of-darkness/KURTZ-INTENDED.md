# Visit to the Intended

Base: `d1ca74d8a4562510205c3b87d289b603c01d3c41`, `journey-vertical-slice`.
Bounded continuation after the cousin and journalist. The Thames framing
conclusion is deliberately a later episode.

## Source and adaptation

[Conrad, Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm):
Marlow retains a last packet for the Intended, visits more than a year after
Kurtz's death, waits in a dusk drawing room with three tall windows, marble
fireplace and closed grand piano, then puts the packet on a little table.
Her conviction about Kurtz confronts his memory of the final judgment. Asked
for his last word, he says it was her name. She believes him; he cannot tell her.

Spanish dialogue is an original concise adaptation. Exploring the windows and
piano, delivering the packet spatially and choosing how to begin the exchange
are gameplay staging. The player chooses witness or listener, not an alternate
historical ending. Both routes retain Marlow's canonical lie. Neither the
Intended's given name nor an invented portrait is supplied. The previous
cousin response changes the piano observation without copying that flag.

## Play route

1. Finish the legacy episode by examining the last packet. At the right door,
   press **E · Visitar a la Prometida con el último paquete**. The previous
   packet reflection remains available at the old desk.
2. Move with WASD/arrows. Optionally inspect the closed piano on the left or
   the three windows in the center with E. The room remains live while reading.
3. At the small table below the right window, E delivers the packet. Close
   the line before the packet becomes available to her.
4. Approach the right wing by the fireplace and E listens to the Intended.
   Advance E once, then **1** speaks as a witness, **2** listens to her memory.
   Choice buttons also work. Close the exchange; it cannot be overwritten.
5. E again at the same position faces the request for the last words. Her
   opening responds to the earlier choice; the remembered judgment changes
   if the player inspected the windows. E advances through Marlow's lie and
   her answer; the scene grows darker by narrative phase.
6. Move to the far-right door and E says farewell. The final reflection
   remembers the player's approach. Completion leaves a repeatable memory
   interaction, without entering the Thames or automatically starting content.

## Canonical state and restoration

Pixi'VN owns labels, choices, storage, export and restoration. Existing
`createPixiStorageCheckpoint` validates `journey.kurtzIntended`:

| Phase | Meaning / next spatial action |
| --- | --- |
| inactive | Earlier legacy still owns the room; completion gates entry |
| arrived | Packet held; optional room observations / table delivery |
| delivered | Packet on table; approach the Intended |
| speaking | Approach selected; its reply remains open |
| heard | Closed exchange; return for the last-words question |
| lastWords | Question/memory/lie/reaction label is still open |
| departure | Last-words label closed; leave through the door |
| complete | Visit finished; optional reflection only |

`approach` is `witness` or `listen`, required from `speaking` onward.
`windowObserved` and `pianoObserved` are independent optional booleans.
Packet custody and final lie are derived from the phase, not duplicated flags.
`journey.intendedPosition` stores actual bounded x/y (x360–1580,y700–870)
through the unchanged movement checkpoint adapter. Earlier European position
remains separate because this is a different room.

`Game.exportGameState()` includes these keys and the active Pixi'VN stack;
`Game.restoreGameState()` plus the existing scene dispatcher rebuilds the
appropriate room, props, phase lighting, real position and room ambience.
Creation never calls a label or replays entry. Partial choice, delivery and
last-words saves resume their exact labels. Earlier saves remove this room.
No new persistence manager, timer, save menu or narrative state layer exists.

## Composition and lifecycle

Only the story-local factory/configuration defines the room and anchors.
Approved Marlow sheet, six-frame walk and foot-contact shadow are reused.
Three windows, closed piano, small gilt table, cold fireplace, perspective
floor and dark right wing supply spatial landmarks. The Intended speaks from
that wing; her final actor illustration is not claimed as implemented. See
[the precise art brief](../art-briefs/intended-drawing-room.md).

The existing station interaction view preserves responsive UI and live
movement. Camera, display scaling and ambient mixer are unchanged. A small
phase-dependent dusk overlay affects the room, not the HTML dialogue.
All shapes are constructed once, with no per-frame texture creation or filters.
Scene destruction removes its ticker callback; existing attachments release
keys, view, movement, camera and audio. Stable `journey-kurtz-intended` namespace
reconstructs one room source after restoration, stopping earlier legacy sources.
It reuses the existing project-authored room WAV, credited in
`public/assets/audio/metamorphosis/README.md`; no Metamorphosis state is imported.

## Validation

Six state cases cover prerequisite/one-shot entry, both immutable approaches,
ordered delivery/reply/question/departure, optional observations, partial
checkpoint round trips, invalid saves and fractional bounded coordinates.
Browser tests cover real E/1/2, proximity, movement during choices, both routes,
previous cousin memory, optional windows versus ignored windows, packet
visibility, actual coordinates, active/closed saves, no duplicated UI/actor/
packet/audio, restoration to legacy and restart cleanup.
Visual QA captures both resolutions, checks real UI bounds/overflow and renderer
size, and includes both replies, deepest dusk, lie and restored question.

Final validation on 2026-10-11:

- `npm run agent:check`: exit 0, TypeScript passed, **198/198 unit cases in
  42 files**, production build **2.80s**.
- Focused Playwright: **4/4**, **2.7m**.
- `npm run agent:e2e`: exit 0, **117/117 in 45 spec files**, **49.2m**, including
  all 113 unchanged preexisting cases. Total coverage is **315**, not counting
  the focused subset twice. All six new units and four new E2E cases are included.
- **26 PNGs**, all dimension-checked and individually inspected, retained in
  [the visual evidence index](kurtz-intended-qa/README.md). Both options, packet,
  real actor and controls are readable at 1366×768 and 800×600, including the
  darkest phase and restored question. The intended illustration debt remains
  explicit; this is not a claim that the salon equals finished illustrated art.
- The 12 code/test files remained hash-identical throughout the final full gate.
  No old tests were altered, nor any engine, Deck, Metamorphosis or runtime asset.

The preexisting suspended AudioContext and uninitialized navigation warnings
were nonfatal. No new Pixi'VN bridge error was recorded. Scene source counts
remain at most one per namespace; earlier room channels stop on transition.

## Limits

The scene is playable graphic theatre, not a completed Intended portrait or
fully illustrated salon. Physical seating is narrated, not a new sitting
animation. Departure completes at the threshold; no extra house/street scene.
Room ambience is reusable provisional sound; a human listening review remains
separate. No change to engine, approved Deck, Metamorphosis or previous tests.
The final Thames frame remains the next narrative task, not part of this release.
