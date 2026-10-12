# The appointment and Company visit — Part I

## Access and boundary

Open `/?story=journey&episode=commission`. The default `/` still starts on the
approved Deck; `/?story=journey&episode=prologue` still opens on the Nellie.
No new menu, engine API, save format or coastal scene is introduced.

Source: [Joseph Conrad, Heart of Darkness, Part I](https://www.gutenberg.org/files/219/219-h/219-h.htm),
from Marlow's search for employment and his aunt's recommendation through the
Company contract, black-wool knitters, medical examination and farewell tea.
Concise Spanish adaptation. Fresleven's violence and the village's flight are
explicitly **later knowledge** recalled by Marlow, not information he had when
appointed. The predecessor's death is not turned into a heroic combat episode.
The map's colours represent colonial partition; the aunt's civilising rhetoric
is contrasted with Marlow's reminder of the Company's commercial purpose.

The room is a spatial attention stage: the recommendation, admission, contract
and examination have separate positions. The aunt's farewell is recalled at
the threshold, not a claim that she visited this office. The aunt, two knitters,
secretary, chief and doctor remain offscreen. The chief's brief handshake and
French check are compressed into the admission. The drinking clerk is omitted.
The final E action explicitly skips the coastal voyage and Outer/Central
Stations, returning to the existing Deck; those episodes are not implemented.

## Manual route

1. Dismiss the introductory line with E. WASD/arrows move Marlow throughout
   narration and choices; E continues, and 1/2 or the existing buttons choose.
2. Read the recommendation on the right of the central table. E advances to
   Marlow's retrospective account of Fresleven; E closes that account.
3. Optional: approach the map to the right of the window and press E. It can
   be inspected before the examination. Ignoring it does not block the contract.
4. Walk to the right doorway and E passes the black-wool knitters. The second
   line remembers the inspected map only on the observed path.
5. At the left side of the central table, E signs the contract and commercial
   confidentiality pledge. The medical desk now becomes available.
6. Walk to the small desk at the left. E begins the examination; E again shows
   two questions. Choose 1 to ask about returning, or 2 to question the science.
7. E continues the doctor's different answer and warning, then closes.
8. At the right threshold, E recalls the aunt's farewell. Her first response
   depends on the medical question; Marlow's final line also remembers the map.
9. E at the same threshold confirms the explicit ellipsis and enters the Deck.

## Ownership, composition and audio

`companyCommission.ts` defines this episode's points and reuses the existing
neutral European room dimensions and room tone. `createCompanyCommission()`
composes `createEuropeReturn()` without editing it: existing room, floor,
approved Marlow atlas/contact shadow and cropped illustrated paper. Office-only
map, caliper desk and black wool are immutable vector props, not new generic
raster substitutes. Report and private-letter captions become contract and
recommendation captions; the later Kurtz postscript is hidden.

The existing movement, camera, spatial interactions, dialogue UI, display
resolution and audio mixer are composed in `showCompanyCommission.ts`.
The map brightens after inspection. The threshold shadow becomes visible on
admission; a restrained .13 veil after examination increases institutional
pressure, compared with .03 at entry. No per-frame textures, geometry or filters
are created. This is a reused graphic-theatre presentation, **not** a newly
illustrated premium office. Final illustration guidance is in
`docs/art-briefs/company-office.md`; it does not block the playable episode.

Room tone uses the existing authored `room.wav` via a separate
`journey-commission` channel owner. Destruction removes tickers, interaction
listeners, UI and audio through existing systems. Restore rebuilds that owner
from the canonical position, never from a serialized playback timestamp.
Human listening remains a separate review; automated tests check real channels.

## Canonical state and restore

- `journey.companyCommission`: phase (`inactive`, `recommended`, `waiting`,
  `admitted`, `contracted`, `examining`, `cleared`, `ready`, `complete`),
  `mapObserved`, and `medicalResponse` (`null`, `return`, `question`).
- `journey.commissionPosition`: exact bounded coordinates, including fractions.
- `journey.currentSpace`: existing dispatch; active Company phases reconstruct
  this episode in `inner-station`. `complete` never captures a later scene.
- Pixi'VN narration owns current line, choices and label stack. No custom
  dialogue cursor, history or persistence subsystem is added.

The examination cannot finish before a choice; appointment/signature remain
canonical on both paths. Repeated input cannot change an already recorded
question. Loading an earlier save restores its earlier phase and available
actions. Game.start stops old checkpoint writers before awaiting new scenes.

Tests compare actual actor coordinates, phase/flags, exact active text, choices
and opened labels before/after export/restore, then continue the restored
dialogue. They cover entry, waiting, signed contract, pending question, selected
answer, doctor reply, aunt reply, ready phase and active ellipsis; movement with
choices visible, double reconstruction, channels/overlay ownership, restart and
default/prologue/Metamorphosis route preservation are included.

Release results and retained captures are recorded in `commission-qa/README.md`
after browser and full-regression validation. This episode fills only N02.
