# Kurtz — deterioration and preparation for evacuation

Base: published `99b4012ccd07bed334f3c8c224187c1ebf58b40b`.
This bounded continuation starts after the night return exchange closes and
ends with Kurtz's cot ready at the landing. Departure, the downstream voyage,
his papers, final speech, death and the European epilogue are not implemented.

## Playable route

Finish `KURTZ-NIGHT-ESCAPE.md`. Return to the left landing and press E at
“Preparar la salida al amanecer”. Nothing starts while Marlow remains elsewhere.
Night fades into the existing overcast station; dawn restores the same geometry,
not an unrelated new location. Walking remains available during the transition.

1. Approach Kurtz's cot on the right and press E. Coughing, his brief resistance
   and Marlow's observation expose the gap between his body and his voice.
   The response recalls reasoning with him or challenging him during the night.
2. Walk to the ivory near the fence. E opens the two canonical Pixi'VN choices:
   prioritize Kurtz, or move the first ivory bundle ahead of him.
3. Secure the cot's bindings near its right end and clear/check the landing's
   loose rope and planks. These are physical spatial actions, not inventory.
4. With cargo priority, return to the ivory and E sends its first bundle down
   toward the waiting steamer. The remaining pile becomes smaller while retaining
   its opacity, foot anchor and contact shadow. Kurtz
   coughs again and the cot cannot move until this action is completed.
   Patient priority leaves the cargo behind and skips that prerequisite.
5. Return to the cot, E signals the two bearers to lift. Walk to their left,
   within 200 world units, and guide the cot down toward the landing. They
   advance along the short existing path only while Marlow is nearby and ahead;
   sprinting away stops them. Approach again to resume. They never require Kurtz
   to walk independently. Movement and conversation continue together.
6. Receive the cot with E at the landing when it actually arrives. The final
   response remembers both priorities and the previous night's response. Kurtz
   is alive and ready to embark; the game deliberately stops before departure.

WASD/arrows walk, E interacts/advances, 1/2 or the existing buttons choose.
There is no new menu, quest counter, inventory, combat or save interface.

## Literary basis and adaptation

Conrad, [Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm),
describes leaving the next day at noon, carrying Kurtz into the pilot-house for
air, his continued voice as his strength fails, and the company's fixation on
ivory. The short preparation path and choice about patient/cargo order are
playable adaptations, not a claim that Conrad wrote that exact exchange. All
Spanish lines are adaptation. The Russian has already left and does not appear
as a witness to this morning. The novella's crowd/departure confrontation is a
later milestone; no new crowd or invented ritual imagery is added here.

## Architecture and save contract

Pixi'VN remains the only dialogue, choice, character, storage and save authority.
`journey.currentSpace` remains `inner-station`; its content dispatch selects this
episode once active. The existing `journey-inner-station` owner is destroyed
before every reconstruction, stopping old checkpoint writers and sound sources.

- `journey.kurtzEvacuation`: validated checkpoint with `phase`, `morningMS`,
  `patientSeen`, optional `priority` (`patient`/`cargo`), `cotSecured`,
  `landingClear`, `cargoFirst`, exact `cot` coordinates, `pose` and `readySeen`.
- Phases: `inactive → morning → preparing → transfer → ready`.
- `journey.kurtzEvacuationMorning`: the smoothed night/morning blend.
- Existing `journey.stationPosition`: exact Marlow coordinates.
- Existing `journey.kurtzNightEscape.choice`: remembered reason/challenge;
  neither it nor earlier revelation, Russian or station flags are overwritten.
- Active labels, choices, child labels and cursors are canonical Pixi objects.

`Game.exportGameState()` serializes these fields through existing storage.
`Game.restoreGameState()` followed by existing `showJourneySpace()` rebuilds the
phase, props, pose, both world positions, dialogue and blend. A live transition
or supported transfer resumes on rendered frames; a stopped cot stays exact.
No audio playhead, parallel save schema, custom scheduler or restore manager.

All new narrative/state code is in `src/content/`; concrete anchors, art
composition and audio configuration are in `src/story/heart-of-darkness/`.
Existing movement, camera, atmosphere, parallax, spatial audio, interaction and
checkpoint attachments are reused without changing `src/engine/`. The approved
Journey Deck and Metamorphosis sources and resources are untouched.

## Presentation and lifecycle

Only existing station, midnight plate, evidence, Marlow, Kurtz and bearer assets
are used. No images are generated or retouched. Feet/contact shadows and painter
order are retained; the existing cot/bearers move as a composed group with mild
opposed bearer sway, weak/coughing/intense poses and a restrained observation
focus. Two existing low fog planes preserve distance and the damp morning.
The short loose rope is a small scene-owned vector prop on the painted planks,
removed by its interaction, not a replacement background.

Water, canopy and the existing wood-creak source use the spatial mixer and
Pixi'VN adapter in the stable `journey-kurtz-evacuation` namespace. Entering and
restoring stop old night instances; sources are reconciled from scene and player
position. The creak is enabled only during the plank check. Destroying the
owner removes ticker/input/UI bindings, fog texture and audio sources, including
late loads. No frame creates new textures, sprites, filters or particles.

## Validation

Seven state tests cover prerequisites, finite/smoothed morning, both action
orders, one-time choices, nearby/ahead transfer, actual arrival, exact checkpoint
coordinates and rejection of invalid saves. Browser cases verify both priority
branches, remembered night responses, moving while reading, exact position and
phase restoration before/after choices and during transfer, spatial entry,
preparation gates, repeated restore, sound/actor duplication and restart.
The visual case captures dawn, idle station, coughing, defiance, choice, both
priorities, lift, transport, both landings and restored dialogue at both sizes.

Final `npm run agent:check`: exit 0; TypeScript, 147/147 unit cases in 35 files
and build passed. Largest shared bundle is unchanged at 463.99 kB, without the
>500 kB warning. Final `npm run agent:e2e`: exit 0; 89/89 cases in 31 files passed
in 28.7 minutes. This preserves all 85 prior E2E cases unchanged; 7 unit and
4 browser cases are new (236 total). The focused browser run passed in 3.8
minutes. The retained 26-frame index is `kurtz-evacuation-qa/README.md`.

## Deliberate limits

The carry uses existing bearer poses with restrained procedural sway, not new
walk-cycle art. The short path is horizontal and compressed into the station's
existing traversable strip. Moving one ivory bundle is represented by the
spatial action, response and diminished pile; no inventory or new cargo-carry
simulation is introduced. Audio is tested deterministically; final subjective
listening and physical-GPU performance remain separate reviews.
