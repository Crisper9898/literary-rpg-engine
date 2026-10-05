# Revelations of the Station

Base: published `b502cfbfac6b1d83a4d0b652cb3995b91e14ae67`.
This episode begins when the first Kurtz exchange closes. It does not open the
later evacuation, escape, final deterioration, death or European return.

## Experience and controls
WASD/arrows walk; E examines nearby objects, speaks and advances a line; 1/2
or existing buttons choose. Movement remains available during reading.
The same station offers a slightly broader ground strip. No quest list,
inventory, document menu, new save UI or compulsory four-clue collection.

From a new game: speak to the deckhand and finish his exchange; disembark at the
hut, load fuel and choose the approach; return to the helm, navigate the fog and
attack, sound the whistle and finish the aftermath. Dock and disembark at the
Inner Station; examine two original points and speak to the Russian, complete
his topics/stance, approach the path and prepare for Kurtz. Wait through his
playable entrance, speak to him and finish the first exchange. Investigation
becomes available immediately, preserving Marlow's last coordinates.

Four discoveries, in any order:
- Ivory, left of the Russian: abundant stock under the house's authority.
- Palisade, above the broken fence: apparent wooden ornaments resolve into dry
  human remains, mostly turned toward the house. No explicit gore.
- Meeting traces, below/right of the Russian: ordinary mats, sandals and a stool
  arranged toward an absent authority. No invented ethnic symbols or magic.
- Report, low box at the right: an idealistic fragment, a player-paced pause and
  the violent postscript contradicting it.

Any two unlock the reactive Russian exchange. Three/four supply additional
reflection; report plus palisade add a specific connection. The player can
continue examining optional evidence after the conversation completes.
Understanding Kurtz versus naming the brutality changes Marlow, the Russian
and the next short Kurtz exchange. Neither interpretation excuses his violence.

## Literary basis and adaptation
Conrad, [Heart of Darkness](https://www.gutenberg.org/files/219/219-h/219-h.htm),
Parts II–III: report/postscript, extraordinary ivory, apparently ornamental
stakes, the Russian's devotion and his inability to remove the remains.
The report is encountered here for playable juxtaposition rather than following
the novella's retrospective telling. Recognition of the stakes, preceding the
stretcher entrance in the novella, is delayed until this playable investigation.
Meeting mats/box placement and all Spanish
dialogue are adaptation. They suggest personal obedience, not reconstructed
ethnography. The postscript is quoted briefly in Spanish as evidence of violence,
not endorsed by the narration.

## Canonical state and restoration
All fields live in Pixi'VN storage and travel with `Game.exportGameState()`:
- `journey.kurtzIntroductionComplete`: entry gate; existing first response,
  stance, topics, evidence, poses and station coordinates remain untouched.
- `journey.stationDiscoveries`: unique discovery IDs in encounter order.
- `journey.ivoryObserved`, `palisadeObserved`, `kurtzInfluenceObserved`,
  `kurtzReportObserved`: independent recognition flags.
- `journey.palisadeExamining`, `kurtzReportOpened`: opening beats; recognition
  is only saved at the relevant later label step.
- `journey.kurtzInterpretation`: `understand` or `brutality`, first choice retained.
- `journey.revelationsRussianSeen`, `stationRevelationsComplete`: completed
  interpretation conversation, preparing but not implementing the next milestone.
- `journey.revelationAtmosphere`: existing generic checkpoint for smoothed
  discovery-driven shade. Russian mood/Kurtz pose use their existing fields.

Existing `Game.restoreGameState()` and `showJourneySpace()` reconstruct the
same scene. Pixi'VN owns active labels, child branches, choices and cursors.
No custom save format, dialogue cursor or parallel narrative state manager.
The first completion reuses that same-space mount to bind the expanded movement
rectangle (the existing movement controller has immutable limits); coordinates
are read from its checkpoint. Nothing is reset, and active dialogue is never
remounted mid-exchange. Restoring an already expanded scene mounts it directly.

## Art/composition and sound
`public/assets/art/station-revelations/evidence.png`: generated with the built-in
image tool against the existing station plate, after the brief in
`docs/art-briefs/station-revelations.md`. 1536×1024 RGBA atlas with five used
regions. The manifest records actual crop boundaries, display sizes and pivots;
no generated words. Idealistic/violent text is rendered by existing dialogue UI.
The old station/background, people and Deck art are not replaced.
Props share cool lighting, ground contact shadows and existing actor depth.
The palisade uses two readings of the same arrangement and mild camera focus.
World targets/display boxes: ivory (650,690), 340×265; stakes (850,680),
300×260; meeting traces (1120,850), 240×170; report (1560,850), 190×155.
The walkable footprint expands from x=400…1590/y=710…800 to
x=370…1650/y=680…860, retaining the same 20-unit radius. Existing introductory
observations remain available at their original targets; the new actions have
small ranges and are gated by the completed exchange.
Comprehension drives a smoothed cold shade, subtle diminishing forest/water
and a localized silence during palisade examination. Existing Pixi sound aliases,
mixing, fades and cleanup are reused; no new recording/dependency or voice acting.
Existing cough pose is used without pretending a cough recording exists.

## Architecture
State/labels and the small presentation adapter live in `src/content/`.
Positions, crops and movement rectangle live in `src/story/heart-of-darkness/`.
Existing movement, spatial actions, camera, actor depth, weather and audio are
composed. No changes to `src/engine/`, renderer or other works are required.
One parent scene owns listeners, ticker and disposal; mounted props/frame
textures, shade, atmosphere callback and sources follow its existing lifecycle.

## Validation and limits
Unit coverage: entry gate, independent ordered discovery, two-clue progression,
both immutable interpretations, reconstruction and invalid saved data.
Browser coverage: real preceding exchange, all four props in two orders,
recognition timing, reactive lines, two choices, continuing walking, optional
extra clues, duplicate-free labels/sources and canonical restores before/after
discoveries, active conversation/choice and immediately after selection.
Visual captures: `station-revelations-qa/`, both supported resolutions, general
scene, each prop, before/after palisade, report contradiction, Russian, choices,
both interpretations and Kurtz reactions.

Final `npm run agent:check`: exit 0; TypeScript passed, 132/132 unit tests
in 33 files passed, and build passed. The largest shared chunk is 463.99 kB;
there is no >500 kB warning. Final full `npm run agent:e2e`: exit 0,
81/81 tests in 27 files passed in 20.4 minutes. Total: 213 automated tests,
including six new unit tests, three functional E2E cases and one visual E2E
case. Existing Deck, Metamorphosis, audio, movement, weather, parallax and
save/restore regressions all pass. Two older parallax tests now await the
visible HUD before accessing Pixi's canvas; their checks remain unchanged.

All 28 retained PNGs were visually inspected after the final regression run.
At 1366×768 and 800×600 the dialogue, continuation control and both choices
fit without clipping or overlap. The compact view uses the existing contain
letterboxing; the objects, ground contacts and Kurtz remain visible. Ivory
communicates excess, the palisade changes from ambiguous caps to dry silhouettes
without gore, and the report's contradiction is readable actual UI text.
Meeting traces and the report box use the scene's palette, contact shadows
and foot-based occlusion. Both interpretation reactions and subsequent Kurtz
poses preserve the focal figures while the station becomes subtly colder.
The preexisting Marlow sprite is softer than the illustrated station/props;
it was preserved rather than replaced or redesigned in this episode.
Human auditory evaluation remains separate; deterministic transport checks do
not claim a listening assessment. No downstream Kurtz episode is implemented.
The station still uses a bounded ground strip, not obstacle navigation: props
do not introduce a new collision system. Illustrated evidence is a compositional
adaptation; the room, house and entire surrounding district are not explorable.
