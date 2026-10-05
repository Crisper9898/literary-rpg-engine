# Presentation of Kurtz

## Literary coverage and adaptation

Primary source: Joseph Conrad, *Heart of Darkness*, Part III, the group emerging
beside the house with an improvised stretcher, Kurtz sitting up and raising his
arm, the arrested bearers and his collapse; then the first meeting with Marlow.
[Project Gutenberg, original text](https://www.gutenberg.org/files/219/219-h/219-h.htm).
The brief Spanish exchange is an original adaptation, not a translated quotation.
The meeting remains on the shore rather than moving to a cabin on the steamer.
Two bearers stand for the larger procession; they are depicted as people carrying
an ill man, without weapons, ethnic caricature, a combat mechanic or gore.
The authority is disturbing, not an endorsement of colonial domination.

This milestone stops at the first posture towards Kurtz and the Russian's
reaction. Station revelations, the nocturnal escape, Kurtz's death, his last
words, Europe and the Intended remain unimplemented.

## Normal gameplay route

1. Complete the river attack, stop at the station, move to the bow and E to land.
2. Observe at least two different locations; speak to the Russian with E.
3. Investigate both topic pairs and choose whether to listen or question him.
4. At the path on the right, E prepares the meeting; finish those lines.
5. E again: **Esperar la llegada de Kurtz**. The Russian prepares the entrance.
6. Continue with E. For the next 52 seconds Marlow remains free to walk with
   WASD/arrows and inspect the shore. Watch the right-hand path.
7. After arrival approach the stretcher and E to speak. Choose 1/2 or click.
8. Inspect the bindings, waiting figures and empty threshold with E. The Russian
   has a new exchange after the first response. Kurtz can be approached again.

There is no new menu, camera engine, dialogue system or save interface.

## Saved progression and composition

| Saved elapsed time | Presentation |
| --- | --- |
| 0–32 s | Russian turns towards the house and moves aside; localized mist drifts; ambience fades over 12 s; isolated wood at 18–22 s |
| 32–38 s | Dark silhouette of the supported man and bearers emerges |
| 38–44 s | Partial color/details; the procession moves slowly down the path |
| 44–48 s | Raised arm; both bearers stop, Russian becomes fervent |
| 48–52 s | Coughing, lowered head, movement remains arrested |
| 52 s onward | Weak resting pose, approach interactions and normal framing return |

The 32-second anticipation is playable, not a text queue. Progress uses the
existing ticker's elapsed time, capped at one second per tick to avoid skipping
the entrance after a stall. Hidden tabs do not advance. Low frame rates can add
delay; this is not a promise of frame-exact cinematic timing. CameraDirector
supplies eased focus and modest zoom, returning to the existing wide frame.
No filter, particle system or per-frame texture allocation was added.

## Canonical narrative state

| Pixi storage key | Meaning |
| --- | --- |
| `journey.kurtzIntroduction` | Validated checkpoint `{ activated, elapsedMS }`, capped at 52000 |
| `journey.kurtzPose` | Weak / commanding / intense / coughing after appearance |
| `journey.kurtzFirstResponse` | `listen` or `challenge`; first decision cannot be silently replaced |
| `journey.kurtzObserved` | Unique inspected nearby elements |
| `journey.kurtzIntroductionComplete` | First exchange has reached its closing step |

Prerequisites reuse `russianComplete`, `russianStance` and
`kurtzEncounterPrepared`. No existing labels have been reordered or extended.
Russian stance changes preparation and subsequent reaction. Investigation order,
the seamanship book and observed grass modify the preparation. The cautious or
insistent hut decision, and the actual whistle used against the attack, can
alter Marlow's reaction. No previous choice is overwritten or duplicated.

Listening produces an intense, attentive Kurtz and a devoted Russian response;
questioning produces the commanding pose and a nervous Russian response. Later
short exchanges remember the choice; larger consequences await the next milestone.

`Game.exportGameState()` / `Game.restoreGameState()` own all saved data. The existing
journey reconstruction adapter remounts the current scene after restore. Actual
Marlow coordinates use the existing `journey.stationPosition` checkpoint. Kurtz's
position, the Russian's displacement, mist, lighting, halted bearers and camera
are deterministically reconstructed from the saved progression. Pixi saves open
labels, choices and history; a completed entrance does not replay. A save during
anticipation resumes the remaining time, rather than restarting or skipping it.
Audio is reconstructed through the existing spatial mixer and Pixi transport,
not by serializing playback timestamps. Destruction removes scene-owned ticker,
input and audio bindings through the existing lifecycle.

## Art and replacement contract

Assets generated with the built-in image generation tool, using the protected
Russian sheet and Inner Station screenshot as style/lighting references.
Production specification: `docs/art-briefs/kurtz-introduction.md`.
No Deck or Metamorphosis asset was altered. Discarded intermediate atlases are
not runtime assets. Native PNG background pixels have alpha zero; retain alpha.

| Asset | Native | Frames | Display / registration |
| --- | --- | --- | --- |
| `public/assets/art/journey-kurtz/kurtz.png` | 1536×1024 RGBA | 2×2 cells of 768×512: weak, commanding, intense, coughing | 315×210; pivot (384,490) in each source frame; elevated 65 units above ground |
| `public/assets/art/journey-kurtz/bearers.png` | 2172×724 RGBA | first crop (380,0,706,724); second (1180,0,750,724) | 225×230; pivots (420,710)/(440,710); ground contacts at ±135 units |

Manifest: `src/story/heart-of-darkness/kurtzIntroduction.ts`. Replacements retain
frame bounds, pivots, compatible ink weight, cool light and complete silhouettes.
Four poses must remain distinguishable; registration must not jump. The
stretcher is carried, so its elevated position is intentional. Only the bearers
contact the ground; their shadows and front torso occlusion ground the group.
The first art pass was reduced after screenshot review to avoid an oversized
Kurtz. The scene uses the protected station plate and existing foreground fog.

Generation prompts: four full-body stretcher poses with the same bald, emaciated
man, dark coat, dirty ivory collar and blanket; serious dark cartoon ink/hatching;
weak / supported raised-arm / intense / cloth-over-mouth coughing. The final
layout is two columns and two rows with transparent margins. A separate two-cell
sheet depicts two clothed, tired bearers, their hands held at carrying height,
same palette and angle, without scenery or weapons. Alpha removal was requested
through the built-in image tool, never through a scripted image edit.

## Sound and limits

Existing water/forest/wood sources are reused. Original ambience fades to zero
before the silhouette; a single restrained wooden creak interrupts the wait.
After arrival a different low-volume mix enters over five seconds. There is no
heroic music, voice recording or newly synthesized cough. Coughing is visual.
Automated tests validate actual Pixi channel volumes and instance counts; they
do not constitute human listening approval.

The transport uses a restrained two-body sway rather than full new walk-cycle
sheets. Contact and silhouette are illustrated, not physics simulation. Marlow
retains his existing concern pose and walk animation. Neither the approved Deck
nor the reusable engine receives visual or performance changes.

## Validation

Unit coverage: prerequisite gating, one-shot progression, timed stages, arrested
position, canonical storage reconstruction, both responses/poses and invalid
deltas. E2E covers the actual route from the completed attack, prerequisite
failure, both Russian stances, both first choices, movement during anticipation,
partial and completed arrival saves, active choices/child labels, no replay,
three nearby observations, Russian follow-up, rendered coordinates and sources.
The full suite also covers Metamorphosis and the approved Deck.

Visual captures: `docs/heart-of-darkness/kurtz-introduction-qa/`, both 1366×768
and 800×600, the ten required moments plus coughing. Tests check UI bounds,
loaded artwork and a nonblack scene sample, after completed Pixi render frames.
Manual review additionally checks scale, shadows, expression, contrast and
occlusion. Final validation counts/results are recorded in the active plan.
