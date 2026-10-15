# Caravan and Central Station arrival — bounded Part I episode

Entry: `/?story=journey&episode=central-station`.
Default Deck, optional Nellie/Company/Outer Station and La metamorfosis remain
separate entries. This episode ends before the manager interview, salvage and
repairs, fire, rivets or Eldorado. Continuing to the Deck is an explicit ellipsis,
not a claim that those events or months of work have been implemented.

## Playable route

Walk with WASD/arrows; `E` explores and advances dialogue, `1`/`2` choose.
Reading/choosing leaves movement available. Approach the indicated places:

1. Village (430,770), optional: observe abandoned dwellings. Its memory changes
   the later camp line. Observation is neither loot nor an arbitrary checklist.
2. Ravine (930,800): advance the march through shade and heated hillsides.
3. Camp (510,850): hear about repeated labour and a carrier dead beside the path.
4. Companion (1330,785): give shade or attend to the distribution of the load.
   Fever, the hammock accident and the canonical march are not undone.
5. Arrival (1490,855): reach the Central Station on the fifteenth day. The stage
   changes from inland terrain to a backwater and neglected rush fence.
6. Agent (1190,780): hear that Marlow's steamer is at the bottom of the river.
7. Wreck (490,845): inspect the damage and hear a reflection remembering the
   shade/load choice. The boat remains sunk; no salvage minigame or repairs.
8. End (1490,865): return to the approved Deck through the explicit ellipsis.

## Primary text and adaptation

Source: [Conrad, Part I](https://www.gutenberg.org/files/219/219-h/219-h.htm),
checked 2026-10-13: departure with sixty carriers for two hundred miles, abandoned
villages, cold ravines/heated hills, camp labour, sick companion and hammock,
arrival after fifteen days, excitable agent, steamer sunk two days earlier by
damage on stones within three hours. Stop before the first manager interview.
These are concise new Spanish adaptations, not a modern translation edition.

The shade action draws on Marlow holding his coat over the fainting companion.
Attending to the load is a restrained alternative observation, not an assertion
that Conrad offers that choice. Neither option cures fever, punishes carriers,
changes the wreck or grants a reward. Ruins are not presented as proof of a land
without inhabitants. No speech or invented identity is given to the carriers.
The arrival agent's reassurance is contradicted by the wreck, not endorsed.
Later suspicion about the wreck is kept uncertain; no sabotage is proved here.

The playable shoreline observation deliberately condenses the retrospective
wreck account before the later manager episode. In the novel the first manager
interview precedes Marlow's close examination. This is an adaptation of order,
not a claim that he visited the hull first in Conrad's text. The player remains
on the bank, cannot inspect underwater damage and cannot raise the vessel. A
future manager scene must respect this observation instead of saying Marlow
has never seen the wreck; repair estimates and diagnosis remain unperformed.

## Ownership and staging

`centralStation.ts` owns anchors, art references and audio configuration.
`createCentralStation.ts` owns two layered graphic-theatre stages. Content
registers Pixi'VN labels/choice/agent and composes existing movement, six-frame
walking, camera, spatial actions, dialogue view and audio. Engine and approved
Deck art/configuration remain unchanged. The earlier Outer Station and Kurtz's
much later Inner Station are not used as this Central Station.

Atlas frames: 160×160, feet pivot (80,142), scale 1.3. Vegetation: 1920×320 at
y235; files/manifests are reused without editing. Ochre inland light becomes
cooler station pressure; contact shadows, ground grain and foreground grass
support the figure. Illness is narrated; an approved injured gait is not invented.
Companion, carriers and agent remain offscreen pending compatible illustration.
[The scoped brief](../art-briefs/central-station.md) records this debt; graphic
theatre does not claim finished station/encounter artwork.

The first visual review rejected open river water behind the inland path and
corrected the stage distinction. Dialogue uses the existing upper-left panel;
important props/feet are kept below it. Both target sizes require capture review.

## Canonical checkpoints and lifecycle

Pixi'VN `journey.centralStation` stores:

- `phase`: inactive → trail → ravine → camp → companion → approach → arrived →
  wreck → ready → complete;
- `villageObserved`: optional one-shot observation;
- `companionResponse`: null, `shade` or `load`.

`journey.centralPosition` stores exact finite x380–1540/y730–890 coordinates.
Validation rejects unknown values, premature choices and later phases without
the required decision. Checkpoint state selects scene, available actions and
conditioned lines. It does not use elapsed time to advance the narrative.
Completed/inactive phases do not intercept another episode in the dispatcher.

`Game.exportGameState()` / `Game.restoreGameState()` and existing scene
reconstruction retain authority over phase, position, active dialogue/options
and labels. No new save format or menu. Tests save after a meaningful line is
available, including choices and scene transitions; a merely visible panel is
not evidence that an asynchronous transition has finished.

Audio owner `journey-central` reuses project-authored vegetation and water loops
with positional gains and fades. The ravine uses provisional water ambience;
the station water grows near the wreck. No running engine sound is assigned to
the sunken steamer. No claim of footsteps, carrier voices or bespoke hammock
recordings. Gesture unlock and real Pixi'VN source/gain/cleanup are browser tested;
final sound production and human balance review remain separate.
Destroyed scenes remove ticker, interactions, overlay, asset slots and owned
sources; cosmetic water motion does not serialize a waveform/animation clock.

## Validation evidence

`tests/centralStation.test.ts`: seven state cases; confirmed behavior failures
before transitions were implemented, then 7/7 green. Browser route tests cover
both decisions, optional village memory, real actor coordinates, ordered E
actions, fourteen save points per route, restored alternate choices, restart,
scene changes and no duplicate sources/UI. Visual tests capture both target
sizes and both memories. The initial browser red run proved the optional entry
absent. A first focused run exposed premature transition snapshots; the new
driver must wait for actual narrative text, without weakening existing gates.

Final gates: TypeScript, 227/227 units in 47 files, build 2.91s; focused browser
13/13 in 7.4m; full browser 137/137 in 55 files, 1.0h, no failed attempts.
All 28 retained captures were inspected at both target sizes. Evidence and
remaining illustration limits: [QA record](central-station-qa/README.md).
