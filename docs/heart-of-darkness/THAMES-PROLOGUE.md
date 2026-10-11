# Opening frame — the Nellie on the Thames

## Access and bounded adaptation

Open `/?story=journey&episode=prologue`. `/` and `/?story=journey` still
start on the approved Journey Deck; the existing work selector is unchanged.
`/?story=metamorphosis` still enters Gregor's room. An episode parameter alone,
an unknown episode or a prologue parameter attached to another work does not
select this opening.

Source: [Joseph Conrad, Heart of Darkness, Part I](https://www.gutenberg.org/files/219/219-h/219-h.htm),
the opening anchorage, shared silence, Thames remark, Roman comparison and
Marlow beginning his freshwater account. Concise Spanish adaptation, not a
full translation. The Director, lawyer, accountant and frame narrator remain
offscreen. Moving Marlow around the yacht is a spatial attention adaptation;
the novel presents him seated. No new listener sprites or Roman scene.

The player can inspect the amarra at the left before starting the tale near
the centre of the rear rail. That optional observation changes the narrator's
later line. After the opening account, walk to the right and press E to
continue. An explicit ellipsis explains that the appointment, Company and
early stations are still missing. The following scene is the existing Deck,
not a newly implemented chronological connection.

## Manual route

1. Dismiss the opening narration with E. Walk with WASD or arrows.
2. At the left bollard, E hears the anchorage water. Alternatively ignore it.
3. At the centre rear rail, E begins Marlow's tale; E advances each line.
   Movement and the river continue while dialogue is visible.
4. The third line recalls the amarra only on the observed path.
5. After the tale, the right-hand end offers E to continue to the vapor.
   E again confirms the ellipsis and enters the Deck.

## Composition and ownership

`showThamesPrologue.ts` composes the existing `createThamesConclusion()`
yacht geometry, approved Marlow atlas, movement, camera, spatial interaction,
pooled current, audio and dialogue view. The geometry and closing-frame
behavior are untouched. Opening-only veil levels are .05 while anchored,
.14 during the tale and .18 after it. These are narrative presentation
levels, not a new atmosphere system. Existing water plays in the independent
`journey-prologue` namespace, without tropical shore or steamer layers.

Only `storyEntries.ts` optional selection and `showInnerStation.ts` content
dispatch integrate the opening. `src/engine/`, approved Deck, assets and
Metamorphosis remain unchanged. No new dependency, save system or menu.

## Pixi'VN checkpoint and restoration

- `journey.thamesPrologue`: `phase` (`inactive`, `anchored`, `telling`,
  `ready`, `complete`) and `anchorageObserved`.
- `journey.prologuePosition`: finite, bounded real world coordinates,
  including fractional coordinates; independent of `journey.thamesPosition`.
- Existing `journey.currentSpace`: `inner-station` dispatches the opening
  only in active opening phases; continuation sets `deck`.
- Pixi'VN serializes these checkpoints and the active label/step through
  `Game.exportGameState()` and `Game.restoreGameState()`.
- The existing scene dispatcher reconstructs the matching composition,
  interaction availability and mix after restoration. Completed opening
  state never unlocks `journey.thamesConclusion` or the Intended's ending.
- Restart destroys previous checkpoint writers before awaiting scene imports.
  Owner destruction removes ticker/keys/view/audio. Repeated restore leaves
  one player, one overlay and at most one media instance per channel.

## Validation and limits

Five unit cases cover order, optional observation, observation cutoff,
earlier checkpoints/fractional positions and malformed data. Browser cases
cover observe/ignore, real E and proximity, movement during dialogue, active
label and earlier-state restoration, transition to/from the Deck, both
restart paths, pooled river movement, audio reconciliation and default entry
selection including Metamorphosis. The visual spec captures nine moments at
both resolutions. Release results and retained captures are recorded in
[prologue-qa/README.md](prologue-qa/README.md) after validation.

This reuses the established graphic-theatre Nellie, not a new illustrated
scene at the Deck's art level. The specific illustration debt remains in
`docs/art-briefs/thames-nellie-frame.md`; no random replacement art was added.
The water loop remains provisional and still needs human listening review.
No commission, coast, early station, complete chronological entry, save menu
or general art/engine refinement is claimed here.
