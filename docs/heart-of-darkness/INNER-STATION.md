# Inner Station and the Russian

Base: `a43b536f2738cefd6102f08d476a76b0fb8396f3`, journey-vertical-slice.
The approved Deck checkpoint, four stages, original art, walking sheets,
Metamorphosis source and reusable engine remain unchanged.

## Episode and literary scope

Source: [Conrad, Heart of Darkness, conclusion of part II](https://www.gutenberg.org/files/219/219-h/219-h.htm).
The slow arrival, clearing, deteriorated long house, high grass, incomplete fence,
young Russian in carefully patched clothing, changing moods, lost seamanship
book and admiration for Kurtz inform this episode. His explanation links the
attack to the desire to prevent Kurtz leaving. The loss of the helmsman is not
erased by the Russian's enthusiasm.

Spanish text is an original adaptation, not a quotation or official translation.
Conrad's Russian first beckons from the bank and converses aboard. Here a short
shore exploration precedes a close conversation, making observation playable.
Four objects, a restrained creak, conversational order and Marlow's stance are
adaptations; their precise positions and dialogue are not claims about the text.
Fence ornaments remain ambiguous. No heads, ghosts, monsters, combat, Kurtz
sprite, Kurtz voice, emergence or ending are implemented. The closing prepares
**Presentation of Kurtz**, rather than pretending that milestone exists.

## Play

1. Complete the existing fog/attack episode, use the whistle and read its aftermath.
   Approach the wheel and press **E · Aproximarse a la Estación Interior**.
2. The landscape dissolves early while the vessel continues a slower independent
   approach. Engine gain falls progressively. Docking lasts nine simulation
   seconds and remains saved while Marlow moves or reads the arrival line.
3. Walk to the bow and use **E · Desembarcar** once mooring finishes.
4. **WASD / arrows** explore the shore; **E** inspects planks, fallen fence,
   trampled grass and hilltop house. Each yields one short remembered observation.
   Two distinct observations reveal the Russian; all four remain available.
5. Wood strains, forest chatter briefly recedes and a figure reacts. This is a
   one-time, 2.4 simulation-second event with no supernatural explanation.
6. Approach the Russian and press **E**. **1/2**, or the existing choice buttons,
   select which subject to investigate first: Kurtz/station, then attack/relationship.
   The other subject follows, so both orders provide all four knowledge entries.
   Prior hut/book evidence changes a segment without copying the old flag.
7. Choose to listen without judging or question his trust. His immediate response
   and later repeat conversation differ. Reading/choices do not freeze Marlow.
8. After the exchange, walk toward the hill path and press **E · Prepararse para
   conocer a Kurtz**. This is the endpoint, not an entrance to another scene.
   The moored vessel can be revisited without restarting arrival.

There is no new save menu. Canonical `Game.exportGameState()` and
`Game.restoreGameState()` remain available to the existing browser/agent bridge.

## Architecture

- `src/story/heart-of-darkness/innerStation.ts`: layout, anchors, native frame
  contract, observations and topic lines. `createInnerStation.ts`: separate
  background, actor/contact shadow, world hints and foreground composition.
- `src/content/scenes/showStationArrival.ts`: content-only docking presentation,
  existing Deck composition at distance, small water-contact/hull graphics,
  slower parallax, engine attenuation and spatial disembarkation.
- `showInnerStation.ts`: composes existing movement, Marlow gait, actor depth,
  camera, NPC routine, atmosphere, spatial audio and interaction APIs.
  Two independently drifting localized mist planes provide depth. Camera gently
  approaches the conversation; it returns afterward. The Russian watches the
  house, pauses/faces Marlow while talking and uses three authored poses.
- `attachStationInteractions.ts`: scoped content binding to existing E/proximity
  and conversation UI. Labels and choices remain real Pixi'VN objects.
- `src/content/labels/innerStation.label.ts`: canonical registered labels, stable
  step indices, short nested segments, choices, consequences and closing.
- `src/content/state/innerStationState.ts`: Pixi storage plus the existing
  `createPixiStorageCheckpoint`; no second state/save engine.
- Existing content router/start lifecycle add two spaces, remove old scene
  bindings before rebuilding and lazy-load the new composition. No engine edit.

## Save contract

All keys below use Pixi'VN storage and travel with its canonical JSON state.

| Key (prefix `journey.`) | Meaning |
| --- | --- |
| currentSpace | Existing key extended with station-arrival / inner-station |
| dockProgress | Exact fractional mooring progress, 0..1 |
| dockPosition | Actual Marlow coordinates aboard during arrival |
| stationPosition | Actual Marlow coordinates on the shore |
| stationAtmosphere | Smoothed existing atmosphere-controller progress |
| stationObserved | Ordered unique planks/fence/grass/house observations |
| russianTopics | Ordered unique kurtz/station/attack/relation knowledge |
| russianStance | listen / question |
| russianMood | eager / nervous / fervent pose |
| stationEvent | occurred and remainingMS; cannot restart after completion |
| innerStationReached | Mooring completed |
| stationArrivalSeen / stationCreakSeen | Prevent automatic narration replay |
| russianMet / russianComplete | Encounter started / exchange completed |
| kurtzPresenceForeshadowed | House inspection or Kurtz information obtained |
| kurtzEncounterPrepared | Closing path observation completed |

Explored/unlocked status is derived from distinct observations; individual topic
knowledge is derived from the ordered set, avoiding duplicate contradictory flags.
Pressure = min(1, .2 + .1 × observations + .07 × topics); it depends on discoveries,
not elapsed wall time. The existing atmosphere controller smooths the transition.
Pixi also serializes current labels, nested topic steps, dialogue and choices.
After restore the existing content router reconstructs movement, weather and
audio from saved space/position/state, including an unfinished docking/event.
Input holds, NPC idle-cycle phase, fog tile phase and sound sample position are
transient. They do not overwrite narrative choices or canonical player position.
Destroying a scene removes its ticker/input/UI/audio bindings and owned fog
texture. Stable Pixi channel aliases do not accumulate playback instances.

## Art and audio provenance

The coordinated production brief is `docs/art-briefs/inner-station.md`; reference
inputs were this project's approved shore plate and Deckhand illustration.
OpenAI image generation produced the two native assets during this milestone.
No downloaded third-party image/sample or external font was introduced; no
CC/public-domain license is claimed for generated output. Existing project
asset provenance still applies to reused Marlow, reeds and ambient loops.

| Asset | Native / display contract | Role |
| --- | --- | --- |
| public/assets/art/journey-inner-station/station.png | 1672×941 opaque; 1920×1080 world | Cold shore, broken wood/fence, high grass, decaying house |
| public/assets/art/journey-inner-station/russian.png | 2172×724 RGBA; three 724×724 frames; 230×230 display; pivot410,704 | Eager, nervous and fervent full-body poses |
| public/assets/audio/journey-inner-station/wood-creak.wav | 3s mono PCM, 22050Hz/16bit | Quiet one-time wood/leaf strain cue |

Generation direction: elevated three-quarter inked cartoon shore, cold swamp
teal/soot/damp ochre, pale wet highlights, left river/right long mud-walled house,
clear walk band and upper-left reading space; no baked people/UI/ghosts/gore.
Russian direction: same young beardless face/cart-wheel straw hat/brown holland
clothes, neat faded red/blue/yellow patches, open-palmed greeting/hand-to-chest
worry/wide-arm devotion, identical baseline and transparent gutters. The manifest
records inspected dimensions and crop pivots; assets are not stretched to invent
new animation frames. Shared cold fill tint and irregular contact shadows ground
the figures. Foreground reeds and mist remain independent of the plate.

The wood cue is original deterministic synthesis in
`scripts/generate-station-cue.mjs`: decaying wood tones and filtered noise, no
sampled recording. It uses Pixi sound through existing spatial audio. Water stays
faint; forest recedes during the cue and fades back. No continuous music added.
Automated tests prove nonzero/unclipped PCM, channel gains and lifecycle; a human
listening/balance review and physical-GPU performance evaluation remain pending.

## Validation and captures

Final gate (2026-10-04): `agent:check` passed TypeScript, 120/120 unit tests in
31 files and build, exit 0. Complete `agent:e2e`: 73/73 tests in 23 files,
17.1 minutes, exit 0. Total: 193 automated tests. All previous Deck, attack,
hut, Metamorphosis, camera, movement, NPC, atmosphere, audio and restore tests
passed. Largest shared bundle: 463.99 kB; no >500 kB warning.
Eight new unit tests cover observation uniqueness/unlock, ordered knowledge,
stance gate, finite checkpoint validation, one-time event resumption, bounded
docking updates, silencing/multiple-layer cleanup and audible unclipped PCM.
Four new E2E tests cover docking prerequisites and fractional restore, both
investigation/stance paths, prior hut evidence, active choice/event restoration,
actual player movement/coordinate restore, follow-up consequence, closing,
duplicate-source protection, restart cleanup and visual bounds at both sizes.
Existing attack regression retains its spatial exit/no-replay check, now with
Marlow away from the wheel before E; it does not disable the new station entry.
The visual test waits for physical canvas size and two completed Pixi frames
after each viewport change, then rejects a black artwork sample. The initial
DOM-only checks missed one capture taken between renderer resize and redraw;
this test synchronization fixes the evidence without changing the renderer.

Final retained captures are in `inner-station-qa/`:

Visual review: all fourteen final images were inspected at 1366×768 and 800×600.
House, shore path and ground contacts remain visible. Reading/choice buttons and
control hints fit without cropping; the dialogue occupies reserved upper-left
space rather than covering the actors. Cold figure fill, irregular shadows,
foreground overlap and localized mist maintain the scene's depth. Arrival no
longer superimposes bright old river reflections over the station house. No
further changes were made to the approved Deck's art or four-stage presentation.

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| Progressive arrival | [arrival](inner-station-qa/station-arrival-1366x768.png) | [arrival](inner-station-qa/station-arrival-800x600.png) |
| Shore exploration | [exploration](inner-station-qa/station-exploration-1366x768.png) | [exploration](inner-station-qa/station-exploration-800x600.png) |
| Restrained atmospheric event | [atmosphere](inner-station-qa/station-atmosphere-1366x768.png) | [atmosphere](inner-station-qa/station-atmosphere-800x600.png) |
| Russian encounter | [meeting](inner-station-qa/station-meeting-1366x768.png) | [meeting](inner-station-qa/station-meeting-800x600.png) |
| Investigation choices | [conversation](inner-station-qa/station-conversation-1366x768.png) | [conversation](inner-station-qa/station-conversation-800x600.png) |
| Fervent explanation | [fervent](inner-station-qa/station-fervent-1366x768.png) | [fervent](inner-station-qa/station-fervent-800x600.png) |
| Preparation for Kurtz | [closing](inner-station-qa/station-closing-1366x768.png) | [closing](inner-station-qa/station-closing-800x600.png) |

## Limits and next milestone

The shore is one bounded path, not an explorable house/interior or combat map.
Environmental plate props are not destructible independent sprites. The Russian
has three expressive frames and small routine sway, not a bespoke full walk
sheet. His bright patches intentionally contrast with the colder environment.
The distant vessel uses existing Deck illustration plus a modest waterline, not
a new full side-view steamship asset. The short initial landscape dissolve is a
theatrical transition rather than physically modeled travel along the bank.
Faces remain small in the wide 800×600 view; short dialogue and mild camera
focus retain readable choices without hiding the house or ground contacts.

Next: **Presentation of Kurtz**. Later coverage still includes Kurtz's emergence,
station revelations, departure, river return/death and the closing frame. Earlier
novel material is also compressed; a finished vertical slice is not a complete
adaptation. Estimates use the existing bounded-project readiness rubric,
not code-line totals: Heart of Darkness ~40%; bounded project ~53%
(engine80/story40/production40/delivery10, weights40/40/10/10). Future complete
Metamorphosis/Frankenstein adaptations and other works are excluded.
