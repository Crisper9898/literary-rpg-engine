# Coast and Outer Station — bounded Part I episode

Entry: `/?story=journey&episode=outer-station`.
Default `/` still opens the approved Deck. The optional Nellie and Company
entries and La metamorfosis remain available. This episode ends **before** the
overland caravan and Central Station; its final line explicitly skips those
unimplemented events if the player continues to the Deck.

## Playable route

Walk with WASD/arrows; use `E` near the indicated place and to advance dialogue.
Choices use `1`/`2`; walking remains available while reading or choosing.

1. Coast: optionally listen to the surf at the left (450,790). Approach the
   centre (1080,750) to observe the French warship firing into the vegetation.
2. At the right (1420,820), hear the smaller steamer's Swedish captain and land.
   The scenery changes to the station, retaining the actual player position.
3. Explore discarded machinery at (1040,780). The chain-gang and pointless
   blasting connect what Marlow sees here to the earlier warship. Observing the
   surf adds a contrast with purposeful paddling.
4. Enter the shade at (480,815). Offer the ship's biscuit or remain beside the
   worker. Neither option awards points, cures him, or changes the historical
   outcome. The second choice is a restrained adaptation, not Conrad's action.
5. At the office (1310,775), meet the immaculate accountant and hear Kurtz's
   name for the first time. Marlow's reflection remembers the grove decision.
6. Finish at (1510,865). The explicit ellipsis returns to the existing Deck.

## Source and adaptation boundary

Primary text: [Conrad, Heart of Darkness, Part I](https://www.gutenberg.org/files/219/219-h/219-h.htm),
checked 2026-10-12: French coastal steamer and surf; warship; more than thirty
days to the river; Swedish captain; abandoned boiler/rail truck; pointless
blasting and chained workers; dying workers in the grove and biscuit; the
accountant's immaculate clothing, sick agent and first account of Kurtz.
These are concise Spanish adaptations, not quotations or a translation edition.

Spatial observation and the pause beside the worker are player agency within
this bounded representation. We do not invent speech for the workers or make
colonial violence an adversarial encounter. The account of "satisfactory"
business is the accountant's claim, contradicted by the nearby suffering.
No ten-day waiting simulator, guards/combat, rescue quest, inventory, caravan,
Central Station wreck, rivets or political episode is represented here.

## Composition and ownership

Story data/audio/geometry: `outerStation.ts` and `createOuterStation.ts`.
Content composes existing movement, walking atlas, camera, spatial interactions,
scene lifecycle and spatial/Pixi'VN audio. No engine or approved Deck edits.
The new scene is graphic theatre with separate coast and shore staging, not a
reuse of Kurtz's Inner Station as the earlier Outer Station.
Approved vegetation and Marlow are reused without editing their files. Contact
shadow, desaturated light, a shaded grove and an illuminated office threshold
connect the figure to the ground. Captain, workers and accountant stay offscreen;
no unrelated portrait or generated bitmap substitutes for their illustration.
[The scoped art brief](../art-briefs/outer-station.md) records that illustration
debt. These are not claimed as finished character or station illustrations.

## State, lifecycle and restore

Pixi'VN checkpoint `journey.outerStation` stores:

- `phase`: inactive → coast → landfall → landed → works → grove → accounting →
  ready → complete;
- `surfObserved`: one-shot optional coastal observation;
- `groveResponse`: null, `give`, or `stay`.

`journey.outerPosition` stores finite exact coordinates within x380–1540,
y730–890. Validator rejects impossible phase/response combinations and invalid
positions. Phase selects coast/shore, available spatial actions and narrative
memory; it is not elapsed time. The shared canonical scene dispatcher recognizes
only active phases, so complete does not intercept later episodes.

`Game.exportGameState()` / `Game.restoreGameState()` remain authoritative.
The existing scene reconstruction rebuilds the selected stage from checkpoint
and resumes canonical dialogue/choices/label stack. Tests use that existing
reconstruction, not a second persistence format. No new Save/Load menu.

Audio reuses project-authored water, machinery and shore loops via Pixi'VN under
owner `journey-outer`; machinery only on the ship, spatial grove only ashore.
First keyboard gesture unlocks playback. Rebuild/destroy removes ticker,
interaction bindings, overlay and owned sources; repeat restore cannot stack
players or audio instances. Cosmetic water drift has a local clock; save does
not preserve waveform position. No claim of gunshot, chain or rapid-specific
recordings: those details are described in text pending sound production.

## Validation evidence

State tests: `tests/outerStation.test.ts` (6 cases). Browser route/restore:
`tests/e2e/outerStation.spec.ts` (both paths and optional-entry regression).
Visual gate: `tests/e2e/outerStationVisual.spec.ts` captures both sizes, both
choices and their later memories; probes inspect real actor coordinates,
canonical dialogue/choices/label stacks, stage and active Pixi'VN sources.
Final validation results and retained screenshots are recorded in
[outer-station-qa/README.md](outer-station-qa/README.md) after the release gate.
