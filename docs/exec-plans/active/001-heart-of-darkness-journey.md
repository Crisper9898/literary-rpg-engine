# Active plan — Heart of Darkness: The Journey

## Objective
Build the first polished playable vertical slice of the Literary RPG Engine using Pixi'VN + PixiJS.

## Scope
A continuous atmospheric ship journey with Marlow, active NPCs, movement, dialogue, camera direction and environmental storytelling.

## Non-goals
- multiple novels
- combat systems
- procedural generation
- large inventory systems
- generic engine features that the current slice does not need

## Current status
Pixi'VN foundation, deck composition, keyboard movement and camera direction are
working. The camera follows Marlow smoothly within the world bounds. Scripted
focus, zoom, lock and return to follow are available. One registered deckhand
independently works a three-stop route while Marlow moves. The NPC can pause,
face a target and resume, and the camera can focus it. Marlow can now approach the
deckhand and hold a branching Pixi'VN conversation while both continue moving.
Reading and choices leave the world running; distance gates conversation input.
Five scenery layers now travel continuously past the fixed vessel at distinct
speeds and camera depths, including while Marlow stands still or reads dialogue.
Voyage distance now drives smooth clear, humid and deep atmosphere profiles.
Three fog depths and world shading preserve movement, camera follow, NPC routines
and readable dialogue/HUD at both supported test resolutions.
An optional cargo tally on the port side now records its inspection in Pixi'VN
storage. If Marlow reads its erased destination before asking about the cargo,
the deckhand answers differently; the original line remains when it is ignored.
Pixi'VN export/restore coverage now proves both versions of that consequence
survive a serialized save. Marlow's bounded world coordinates, unwrapped voyage
distance and the smoothed atmospheric progress now also round-trip through
Pixi'VN storage; restored movement and traveling scenery remain live.
An architecture audit has separated reusable spatial-action selection and
Pixi'VN checkpoint binding from Journey content. A neutral browser fixture and
an engine-import guard now protect portability without adding another story.
Reusable position-aware ambience now mixes independent layers and priority
zones through Pixi'VN sound. Journey demonstrates the system with three
distinct, audible provisional loops; authored audio can replace them in story
configuration.

## Ordered tasks

- [x] Establish Pixi'VN + PixiJS foundation.
- [x] Add automated unit/build/browser validation.
- [x] Define repository boundaries and Codex instructions.
- [x] Create the first playable deck scene using simple placeholder geometry/assets.
- [x] Add Marlow player movement constrained to the deck.
- [x] Add a reusable camera director with player follow and scripted focus.
- [x] Add one independently animated/routined NPC.
- [x] Add a walk-and-talk dialogue sequence using Pixi'VN.
- [x] Add layered scrolling river/background parallax.
- [x] Add a simple fog/weather progression.
- [x] Add one meaningful environmental interaction that changes a later dialogue line.
- [x] Add basic zone-aware ambience/audio transition.
- [x] Add save/restore smoke coverage for relevant world state.
- [x] Rescue the Marlow/deckhand/cargo encounter as one visually directed, inked scene.
- [x] QA and polish the current inked slice at both target resolutions.
- [x] Replace placeholders with first-pass art direction assets.
- [x] Run complete vertical-slice browser QA and polish pass.

## Next task
The Inner Station and Russian trader episode is implemented and validated.
The approved Journey Deck remains frozen.
**Presentation of Kurtz**, **Revelations of the Station** and **Kurtz's night
escape** are implemented and validated. The user approved the next bounded
episode: Kurtz's decline and preparation for evacuation, now implemented and
validated. The steamer's departure under pressure from the bank is now
implemented and validated. The next bounded milestone is the downstream
breakdown and Kurtz entrusting his papers; it is not started. Death, final
speech and the European epilogue remain later milestones. Stop after publishing
the validated departure; a subsequent continuation can begin the next task below.
The separate human listening review of environmental audio remains independent.

## Kurtz — deterioration and evacuation preparation — 2026-10-09

Base: published `99b4012ccd07bed334f3c8c224187c1ebf58b40b`.
Entry is optional at the landing after the night return exchange has closed.
Reuse the station, existing Kurtz/bearer art and engine attachments. Keep the
approved Deck, engine, Metamorphosis, Phaser stash and original untracked files
intact. The patient/cargo priority and short preparation route are adaptations
of the next day's departure and the company's pressure over ivory in Part III.

- [x] Inspect current state, existing resources and the novel; obtain the user's episode scope.
- [x] Add a saved morning transition and spatial examination of Kurtz's condition.
- [x] Add patient/cargo priority, actual preparation points and a supported cot transfer to the landing.
- [x] Preserve prior night response, new decision, preparations, exact positions and active dialogue through Pixi'VN saves.
- [x] Add state-flow and browser tests for both priorities, prerequisites, restore, movement and cleanup.
- [x] Inspect captures at 1366×768 and 800×600; pass `agent:check` and complete `agent:e2e`.
- [x] Document the playable route and limitations.

Release step: publish only this validated episode as one commit on
`journey-vertical-slice`; report the resulting hash and remote confirmation,
then stop. Do not begin the subsequent milestone in this release.

Implemented: optional dawn after the completed night exchange, spatial body
observation, patient/cargo priority, cot bindings, landing clearance and a short
two-bearer transfer that stops when Marlow is too far away or behind. The cargo
priority adds the first bundle as a prerequisite; the patient priority leaves it
behind. Both final responses remember that order and the preceding night choice.
Pixi'VN stores exact Marlow/cot points, preparations, priority, pose, phase,
smoothed dawn and active labels. There is no new UI or parallel save format.

Route, canonical-state contract and literary adaptation:
`docs/heart-of-darkness/KURTZ-EVACUATION.md`.
26 reviewed captures (13 beats × 2 resolutions):
`docs/heart-of-darkness/kurtz-evacuation-qa/README.md`.
The small cargo remainder stays opaque and grounded; an earlier transparent
representation was rejected during QA and caught by a regression assertion.
No engine, approved Deck, runtime image/audio asset or Metamorphosis source was
changed. Existing bearer poses with restrained sway are a deliberate limitation.
Departure/crowd confrontation, the downstream decline, death and epilogue remain
pending; reaching this landing does not mark any of them complete.

Final `agent:check`: exit 0; TypeScript, 147/147 unit tests in 35 files and
build passed (2.50s). Largest shared chunk remains 463.99 kB; no >500 kB warning.
Final full `agent:e2e`: exit 0; 89/89 browser tests in 31 files passed in
28.7 minutes. All 85 preexisting E2E cases remain unchanged and pass, including
Metamorphosis, all four approved Deck stages, movement, audio, camera, station,
Kurtz introduction, revelations, night escape, saved coordinates/progress and fog.
New coverage: 7 unit cases and 4 E2E cases; updated total: 236 tests.
The focused four-case run also passed in 3.8 minutes after the cargo correction.
The sandbox's initial Vitest temporary-file rename failure was environmental;
the same command passed with normal temporary-directory access, without changing
the application or validation configuration. Existing browser audio-unlock and
unconfigured navigation warnings remain nonfatal; no new application errors.

## Steamer departure — 2026-10-09 — validated

Base: published `0e4ff98bcb8f37946dc98b12f94b7c3b0a6228ba`.
Represent only Part III's departure: optional boarding after the evacuation
exchange, spatial mooring/whistle/crew/helm interactions, people on the bank,
Kurtz looking out, and a short controlled manoeuvre. The intervention-before-
whistle branch is an adaptation, not a claim that Conrad offered a choice.
Reuse existing illustrated plates and figures; do not alter the approved Deck,
engine, Metamorphosis, Phaser stash or original untracked files. Do not depict
downstream decline, final words, death, papers or the European epilogue here.

- [x] Inspect the published state, existing composition/assets and canonical departure passage.
- [x] Implement saved spatial preparations, two responses to armed pressure and a controlled departure.
- [x] Compose the departure with existing assets, movement, camera, audio and world attachments.
- [x] Validate prerequisites, both routes, remembered evacuation priority, exact progress/position restore and cleanup.
- [x] Inspect 1366×768 and 800×600 captures and pass `agent:check` plus full `agent:e2e`.
- [x] Document the route, adaptation and limits; prepare one validated release.

Implemented entry after the closed evacuation exchange, optional Kurtz/bank
observations, spatial mooring release, whistle-first/intervene-first response,
mandatory crew/whistle steps for the latter, physical helm signal and a saved
short manoeuvre. The closing dialogue remembers the response; patient lines
reuse the canonical earlier evacuation priority. Existing Deck/cast resources,
parallax, audio, NPC, movement, camera and Pixi'VN lifecycle are composed without
engine changes. A first rectangular scenic inset was rejected during visual QA;
the corrected station plane uses a small static feather mask and existing
bearer silhouettes at distant scale. The woman/rifles remain offscreen narration.
Six unit cases and four E2E cases added; focused E2E: 4/4 in 3.7 minutes.
22 corrected captures (11 beats × 2 sizes) visually reviewed:
`docs/heart-of-darkness/kurtz-departure-qa/README.md`.
Route, state contract, literary adaptation and limitations:
`docs/heart-of-darkness/KURTZ-DEPARTURE.md`.
Farewell figure brief: `docs/art-briefs/kurtz-departure-bank.md`; it is a
presentation limitation, not a blocker for the completed playable route.

Final `agent:check`: exit 0; TypeScript, 153/153 unit tests in 36 files and
build passed (2.95s). Largest shared chunk: 463.99 kB; no >500 kB warning.
Final full `agent:e2e`: exit 0; 93/93 tests passed in 31.4 minutes. All 89
preexisting browser tests remain unchanged and pass, including Metamorphosis,
the four approved Deck stages, walking, camera, NPC, audio, parallax, fog,
station, revelations, night return, evacuation and canonical saves.
New coverage: 6 unit cases and 4 E2E cases; updated total: 246 tests.
All 22 retained screenshots have verified dimensions and were visually inspected.
Existing audio-unlock, navigation and approach rendering warnings
remain nonfatal; no new application error or test failure was detected.
No engine, approved Deck, runtime art/audio asset or Metamorphosis source changed.

Release step: publish only this validated departure as one commit and stop.
Do not begin the subsequent episode in this release.

## Subsequent bounded milestone — not started

- [ ] Represent the downstream breakdown and Kurtz entrusting his papers; defer his final words, death and the European epilogue.

## Abandoned wood station — 2026-10-03

Base: `cf89772102e8c7c184c84442543eb8b918d5f3a3`. The approved visual tag is
retained unchanged; this task builds on the technical-polish commit, without
resetting the branch to an older renderer.

- [x] Inspect existing Heart of Darkness content and establish the next missing episode from Conrad's part II.
- [x] Compose a separate riverside landing using existing movement, camera, NPC, interaction, weather and audio systems.
- [x] Unlock spatial disembarkation after completing the existing deckhand exchange; preserve all four Deck stages and assets.
- [x] Add spatial fuel loading, optional warning and seamanship-book observations, and two approach decisions using Pixi'VN.
- [x] Preserve scene, independent shore coordinates, evidence, decision and atmospheric progress through canonical Pixi'VN saves.
- [x] Test both branches, ignored/examined evidence, choices during movement, saves before/after choice, return and clean restart.
- [x] Review final 1366×768 and 800×600 captures and complete `agent:check` plus full `agent:e2e`.
- [x] Commit and push this narrative milestone; preserve engine, Phaser stash and preexisting untracked files.

Implementation and literary coverage: `docs/heart-of-darkness/WOOD-STATION.md`.
The optional proceed branch is an adaptation; waiting for daylight corresponds
to the novel's cautious approach. Neither fog-bound navigation nor the attack
is marked implemented by this stop. No inventory or new save UI was added.

Final `agent:check`: TypeScript, 104/104 unit tests in 25 files and build passed.
Final complete `agent:e2e`: 65/65 tests in 19 files passed in 14.4 minutes,
including all existing Metamorphosis, Deck, movement, camera, cargo, audio,
parallax, weather and save/restore coverage. Total: 169 automated tests.
Four new shore captures are retained in `docs/heart-of-darkness/wood-station-qa/`.
Both sizes were visually inspected, as were the existing Deck's four stages and
fire dialogue. No engine, original Deck art/animation source, renderer setting,
Phaser stash or preexisting untracked file was modified.

## Fog-bound approach and shore attack — 2026-10-03

Base: `7fc7cab6ebee07fddbae2f350d21a2dd59fd86bb`. The approved tag, four Deck
stages, all Deck art/animation assets and `src/engine/` are retained unchanged.

- [x] Implement the fog-bound approach and attack as a separately scoped playable episode, using the saved approach decision and existing evidence.
- [x] Gate spatial helm entry after the hut return; preserve the existing landing/deck interactions.
- [x] Add slow steering, channel bounds, three kinds of hazards, swept contact slowdowns and a player-operated whistle.
- [x] Compose layered mist, water cues, briefly occluded bank figures, arrows, impact traces, smoke and crew reactions.
- [x] Stage the helmsman's loss with matched standing/fallen art, a brief saved interruption and Marlow's reaction; no gore or shooting controls.
- [x] Queue Pixi narration once and preserve navigation, position, decision, seen lines, loss, helm mode and atmosphere in canonical saves.
- [x] Test both hut decisions, pre/during/post attack and active-line restoration, independent walking, contact, cleanup and both resolutions.
- [x] Complete final full regression gate, retain and inspect all eight captures, and prepare the milestone delivery.

Implementation, canonical/ adapted literary coverage, controls, source provenance,
save contract and limitations: `docs/heart-of-darkness/FOG-APPROACH.md`.
Final `agent:check`: TypeScript, 112/112 unit tests in 28 files and build passed.
Final complete `agent:e2e`: 69/69 tests in 21 files passed in 16.1 minutes, exit 0.
Total: 181 automated tests. All eight final captures are retained and visually
inspected in `docs/heart-of-darkness/fog-approach-qa/`; the existing Deck fire
dialogue and Metamorphosis room/hallway captures were inspected for regression.
Both viewport sizes retain complete text/buttons, crew, wheel and water view.
No engine, original Deck assets/animation, renderer, Metamorphosis source,
approved checkpoint, Phaser stash or preexisting untracked file was modified.
No Inner Station arrival is implemented by this episode.

### Following narrative milestone
- [x] Implement arrival at the Inner Station and the Russian trader as a separately scoped playable episode.

## Inner Station and Russian trader — 2026-10-03

Base: `a43b536f2738cefd6102f08d476a76b0fb8396f3`. This episode composes existing
systems outside `src/engine/`; the approved Deck, other works and saved hut
decisions remain intact.

- [x] Add a spatial exit from completed attack, saved gradual docking, reduced engine gain and bow disembarkation.
- [x] Compose a cold layered shore, independent mist, bounded walking, compatible Marlow art and four short remembered observations.
- [x] Add a recognizable Russian with three expressive poses, a small independent routine and conversation camera framing.
- [x] Register canonical Pixi labels with topic-order choices, prior hut/book evidence, persistent listen/question stance and different follow-up responses.
- [x] Add a one-time wood-strain/silence event and a spatial endpoint preparing Kurtz without showing him.
- [x] Preserve docking, separate spatial coordinates, smoothed atmosphere, observations, knowledge order, choices, active labels and event remaining time in Pixi saves.
- [x] Complete full browser regression, inspect and retain all fourteen captures at both sizes, and document final validation results.
- [x] Prepare the single authorized milestone commit/push scope; verify engine, approved tag, Phaser stash and two preexisting untracked files unchanged.

Implementation, source/adaptation, play route, flag/save contract, production
provenance, captures and limits: `docs/heart-of-darkness/INNER-STATION.md`.
Final deterministic gate: TypeScript, 120/120 unit tests in 31 files and build
passed (exit 0; largest shared chunk 463.99 kB, no >500 kB warning).
Final complete `agent:e2e`: 73/73 tests in 23 files passed in 17.1 minutes,
exit 0, including all existing Deck, attack, hut, Metamorphosis, movement,
camera, NPC, parallax, weather, audio, production and save/restore coverage.
Total: 193 automated tests (eight new unit tests and four new E2E).
Closed validation on 2026-10-04: fourteen final captures retained and visually
inspected at 1366×768 and 800×600. The visual test now waits for completed
post-resize Pixi frames and rejects a black art sample; no renderer change.
The inspected approved Deck fire dialogue/dusk/night captures remain intact.
No engine, original Deck art/animation, renderer, Metamorphosis source, approved
tag, Phaser stash or preexisting untracked file was changed.
Readiness estimates: Heart of Darkness ~40%; bounded project ~53%, using the
existing coarse rubric documented in the milestone; not completion of all novels.

### Following milestone
- [x] Present Kurtz as a separately scoped narrative and visual milestone.

## Presentation of Kurtz — 2026-10-04

Base: published `16b149a25b614d7a0e3a9abf3e92aaf1eb0f8735`.

- [x] Research Conrad Part III and stage an invalid carried on a stretcher.
- [x] Gate preparation on the completed Russian investigation and spatial path interaction.
- [x] Add 32 seconds of playable anticipation and staged silhouette/detail/authority/coughing up to 52 seconds.
- [x] Integrate four new illustrated poses and two bearers; preserve existing station, Deck and other-work art.
- [x] Compose moving local mist, deepening shade, arrested bearers, Russian reaction, eased camera and deliberate spatial-audio silence/return.
- [x] Add two canonical first responses, accumulated memory variations, three nearby observations and Russian follow-up.
- [x] Verify canonical saves before/during/after appearance and active choices; no duplicate introduction or dialogue parent.
- [x] Inspect both target resolutions; revise oversized first art pass and retain twenty-two QA captures after the final suite.
- [x] Complete full agent:e2e regression and prepare the single authorized milestone commit/push with protected state checked.

Documentation: `docs/heart-of-darkness/KURTZ-INTRODUCTION.md`.
Deterministic gate passed: TypeScript, 126/126 unit tests in 32 files and build
(exit 0; largest shared chunk 463.99 kB). Four focused E2E passed in 1.2 minutes.
Final complete `agent:e2e`: 77/77 tests in 25 files passed in 18.1 minutes,
exit 0. Total: 203 automated tests (six new unit tests and four new E2E).
Twenty-two final captures are retained in `docs/heart-of-darkness/kurtz-introduction-qa/`.
All eleven moments were visually inspected at both sizes; choice UI remains
complete, the silhouette has deliberate occlusion, and the revised invalid's
scale, cool lighting, contact shadows and bearer overlap belong to the station.
No engine, renderer, approved Deck, Metamorphosis, stash or protected untracked
file was modified.
Only the first meeting is implemented: full station revelations and all later
Kurtz/return episodes remain pending. Human audio listening remains separate.

### Revelations of the Station — 2026-10-05

Base: published `b502cfbfac6b1d83a4d0b652cb3995b91e14ae67`.

- [x] Research the report, ivory, stakes and personal obedience in Conrad Parts II–III.
- [x] Continue the same station after the first exchange, preserving coordinates and previous choices; bind a slightly wider walkable strip through the existing lifecycle.
- [x] Integrate illustrated ivory, two readings of the palisade, meeting traces and a report; preserve all existing background/character assets.
- [x] Allow four independent ordered discoveries; any two unlock a reactive Russian exchange and persistent interpretation.
- [x] Add optional three/four-clue reactions, both interpretations and subsequent Kurtz responses through canonical Pixi labels.
- [x] Compose smoothed discovery-driven cold shade, subtle reduced ambience, localized silence and restrained camera focus with existing systems.
- [x] Verify saves before/after discoveries, active conversation/choices and immediately after selection; test different orders and continued movement.
- [x] Pass deterministic gate: TypeScript, 132/132 unit tests in 33 files and build; largest shared chunk remains 463.99 kB.
- [x] Retain and visually inspect all 28 final captures: 14 moments at 1366×768 and 800×600, including all clues, recognition, choices and both subsequent Kurtz responses.
- [x] Finish full E2E regression: 81/81 tests in 27 files, 20.4 minutes, exit 0; preserve all previous tests and assertions.

Documentation: `docs/heart-of-darkness/STATION-REVELATIONS.md`.
No engine, original Deck/station art, renderer or Metamorphosis source is changed.
No evacuation, final decline/death or European return is implemented.

Final `agent:check`: TypeScript, 132/132 unit tests in 33 files and build,
exit 0. Final full `agent:e2e`: 81/81 passed in 20.4 minutes, exit 0.
Total: 213 automated tests (10 added: six unit, three functional E2E and one
visual E2E). Two existing parallax tests now await the visible gameplay HUD
before reading Pixi's initialized canvas; no assertions or timing thresholds
are weakened. All new save/restore paths and prior Deck/Metamorphosis coverage
pass. Captures remain in `docs/heart-of-darkness/station-revelations-qa/`.
Text and both options fit at both sizes; evidence uses contact shadows and
foot-depth ordering. The preexisting Marlow sprite remains softer than the
station art. Props do not add obstacle navigation; human audio listening
remains separate. No later narrative milestone is marked complete.
Protected-state verification: Phaser stash remains
`2017ff54dc07535fce1ca9c09dc49a912cf78d06`; the approved Deck tag and both
preexisting untracked-file hashes match the initial checkpoint. Only owned
milestone files are included in its commit; the untracked files are preserved.

### Kurtz's night escape — 2026-10-05

Explicit scope supersedes the former evacuation proposal. Base: published
`2dcbf62d6ab11c22f3da15275efed203e27068fc`. No engine/Deck/Metamorphosis change.

- [x] Inspect existing station lifecycle, saves, spatial actions, art, atmosphere/audio and Conrad's night episode.
- [x] Implement canonical dusk, absence, three physical clues, clearing encounter, both confrontation responses and supported return.
- [x] Integrate matched night plates, four gaunt poses, empty bed, traces and discreet followers; preserve original assets.
- [x] Test entry gates, both choices, prior decisions, movement, escort, active-label and tracking saves, cleanup and reset.
- [x] Run `agent:check`, full `agent:e2e` (baseline 213 tests) and inspect all required captures at both sizes.
- [x] Document final results and prepare the single authorized milestone commit/push scope with stash/untracked hashes verified; stop before later episodes.

Documentation, literary adaptation, route, flags/save contract, asset provenance
and limits: `docs/heart-of-darkness/KURTZ-NIGHT-ESCAPE.md`.
Final deterministic gate: TypeScript, **140/140 unit tests in 34 files** and
build, exit 0; largest shared chunk remains 463.99 kB without a >500 kB warning.
Final full `agent:e2e`: **85/85 tests in 29 files**, **22.7 minutes**, exit 0.
Total: **225 automated tests**, preserving all 213 baseline cases. New coverage
is eight unit cases, three functional browser routes and one visual browser
case. No previous tests/assertions were removed, weakened or modified.
The added silence check uses the actual Pixi channel alias ending in `:channel`;
it confirms zero canopy gain on both routes without an engine change.

All 24 required captures (twelve moments at 1366×768 and 800×600) were reviewed;
final suite captures are retained in `docs/heart-of-darkness/kurtz-night-escape-qa/`.
Text/choices and full figures fit; feet are grounded, traces remain visible,
followers stay behind the path and the night persists after returning. QA moved
the middle trace to the near side of the report prop and removed the new atlas's
transparent background halo. Original station/Deck art is unchanged.
The only earlier production edit is station dispatch plus its gated vigil action.
`src/engine/`, the approved Deck checkpoint and Metamorphosis remain intact.
Limits: compact staged trail, bounded ground without global obstacle collision,
supported pose/sway instead of paired skeletal animation, and the unchanged soft
Marlow sprite. Final human audio listening and physical-GPU evaluation are not
claimed. No death, final speech, final journey or European epilogue is implemented.

## Technical polish of the approved Journey Deck — 2026-10-02

- [x] Preserve the approved visual commit with a Git tag and checkpoint document.
- [x] Profile software rendering by component, resolution and render work.
- [x] Apply measured optimizations without visibly degrading approved art.
- [x] Improve the short cartoon walk cycle without a complex animation system.
- [x] Assess and reduce the initial bundle through bounded scene loading changes.
- [x] Inspect four stages and dialogue at 1366×768 and 800×600.
- [x] Run `agent:check` and full `agent:e2e`, document before/after results, commit and push.

Checkpoint: `docs/art-handoff/journey-deck/APPROVED-CHECKPOINT.md`.

Closed on 2026-10-03. The controlled SwiftShader night sample improved from
4.3 to 13.2 FPS by disabling Journey MSAA and matching output pixels to display
size. No effects were removed. Four-stage samples are 12.3–14.5 FPS at 1366×768
and 33.4–39.5 at 800×600; hardware GPU performance is not inferred from these.
Six distance-driven walking cells extend each actor's original sheet. Lazy
scene entry and one shared dependency chunk reduce the largest bundle from
602.12 to 463.99 kB without raising the warning limit. Restart cleanup prevents
old checkpoint writers racing the asynchronous scene load; saved label indices
remain unchanged. `src/engine/` is intact.

`agent:check`: TypeScript, 102/102 unit tests in 24 files and build passed.
Full `agent:e2e`: 61/61 tests in 18 files passed, about 12.9 minutes. All four
stages and dialogue were inspected at both resolutions. Total coverage: 163
tests. Measurements, ten retained captures, asset provenance and remaining
software-renderer limits: `docs/art-handoff/journey-deck/TECHNICAL-POLISH.md`.
SwiftShader still falls below 20 FPS at desktop size; the unchanged 50 ms
simulation cap can slow travel there. No global timing/engine refactor was made.

## Authoritative illustrated Journey Deck — 2026-10-01

- [x] Replace the eleven runtime SVG slots with modular, coordinated illustrated WebP art using the three user references.
- [x] Preserve movement, camera follow, interaction areas, dialogue, state, audio and the story selector; keep `src/engine/` intact.
- [x] Add distance-driven dusk, jungle, deep-night and fire presentation on the existing atmosphere progress, with separate night/fire sky-water, burning shore and floor-reflection variants.
- [x] Second visual pass: correct cabin registration, rear-rail occlusion, actor scale, contact/cast shadows and floor-only firelight; add concern/alarm poses and pooled embers.
- [x] Inspect final stage and dialogue captures at 1366×768 and 800×600 against the authoritative references and La metamorfosis.
- [x] Complete `agent:check` and the full `agent:e2e`; prepare one coherent milestone change set for commit.

Current asset map, progression thresholds, production provenance and technical
limits: `docs/art-handoff/journey-deck/ILLUSTRATED-ASSETS.md`. The earlier SVG
art and handoff are retained as historical references, not the runtime style.

Ten inspected captures are retained in the handoff's `illustrated-qa/` folder:
four voyage stages plus active dialogue at both resolutions. Cabin windows are
not crossed by the rear rail, the figures have contact and projected shadows,
water remains visible, and dialogue/choices fit the 800×600 presentation. At
that resolution the small full-body figures convey emotion primarily through
pose and silhouette rather than portrait-level facial detail. Walking remains
two-frame animation. Flames/smoke are illustrated planes, with live embers.

`agent:check` passed TypeScript, 98 tests in 22 files and build (the existing
602.12 kB main-chunk warning remains). The first complete browser pass had
55/57 passes: the two parallax tests exhausted global time budgets during their
final samples. Budgets were corrected without weakening assertions; both
passed in the isolated rerun (2.0 minutes). The final complete `agent:e2e` passed
57/57 in 23.2 minutes, including both works, dialogue/choices, independent NPCs,
parallax, atmosphere, optional cargo interaction, audio and Pixi'VN save/restore.
Total automated coverage is 155 tests (98 unit + 57 browser). Validation closed
on 2026-10-02. The final software-renderer weather diagnostic measured 4.4–5.8 fps; general renderer
optimization is outside this art milestone. `src/engine/` remains unchanged.

## Journey Deck visual handoff — 2026-10-01

The current eleven-piece SVG composition is frozen as a technical reference for
external final-art production. `docs/art-handoff/journey-deck/` contains clean
1366×768 and 800×600 master captures, live dialogue and deep-atmosphere captures,
an eleven-piece contact sheet and `ART-HANDOFF.md` with exact manifest placement,
frame pivots, parallax depths, layer order and a replacement contract. This
documentation task made no runtime, SVG, manifest or engine changes. The prior
"finished SVG" milestone means the code-authored set was completed and tested;
it does **not** mean the external final-art replacement has been produced.

## Code-authored deck art — 2026-09-30

The eleven slots in `journeyArtAssets.ts` now load eleven finished, coordinated
SVG plates from `public/assets/art/journey-deck/`. The deterministic art source
is `scripts/generate-journey-art.mjs`; there is no external-art dependency or
new runtime system. Marlow has aligned idle/walk frames; the sailor has aligned
idle/walk/rope-work/cargo/lookout frames. Shared ink edges, muted directional
light, clothing folds and the existing contact shadows attach them to the
wooden deck. The rope is drawn through the sailor's hands while coiling. The
deck/cabin, cargo, fittings, sky/water, ridge, two banks, moving current and
reeds share one palette and layered value hierarchy. The existing beat lights,
parallax, fog, camera, NPC, dialogue and save/restore implementations were
unchanged. `src/engine/` was not edited.

Transparent SVGs have cropped view boxes and world offsets in the story
manifest, preserving the exact 1920×1080 composition while reducing rasterized
pixels. An initial full-canvas SVG pass fell to about 3.8 fps with fog in the
software renderer and caused movement waits to fail. The cropped version
measured 7.0–7.3 fps with fog and 9.0–9.2 without in targeted runs, close to
the previous vector-set diagnostic; the full suite measured 6.2/8.4/6.8 fps.
No movement, dialogue or camera assertion was relaxed. The camera test's
overall deadline alone was extended from 60 to 90 seconds for its six
full-resolution screenshots on SwiftShader.

The final `npm run agent:check` passed TypeScript, 97/97 unit tests in 22 files
and the production build. `npm run agent:e2e` passed 56/56 in 19.4 minutes.
Deck, dialogue-choice and deep-fog captures at 1366×768 and 800×600 were
inspected against La metamorfosis: both figures, hands/rope, cargo, river,
choices and controls remain legible and uncropped. The existing >500 kB main
bundle warning and slow software fog rendering remain. At 800×600, actor
figures display at roughly 50 CSS pixels of painted height; this limits fine
facial acting, so silhouette, clothing and body pose carry expression. The
SVG set is the shipped art for this slice, while the manifest still allows a
future replacement without gameplay or engine edits.

## Programmatic art integration — prior checkpoint, 2026-09-30

Historical status below is superseded by the completed SVG pass above.

The eleven coordinated pieces in `docs/art-briefs/journey-deck-dialogue.md`
now have story-owned manifest entries and distinct vector fallbacks. Sky/water,
ridge, far vegetation, near bank, current, reeds, deck/cabin, fittings, cargo,
Marlow and the sailor remain playable without external illustration. The
fallbacks share the ink, swamp, ochre and ember palette; additional broken
water values, plank wear, cabin glazing, warm spill and rope-work gestures give
the ship and cast more common light and material. Feet-based actor painter
order, contact/cast shadows and foreground rail overlap anchor the characters
on the deck. The sailor's coiling rope is visible at his hands during that
routine. The existing camera, parallax, fog, conversation, NPC and interaction
controllers remain unchanged; no `src/engine/` file was edited.

`journeyArtAssets.ts` records plate sizes, the current water mask and sheet
frames/pivots. `src/ui/visualAssetSlot.ts` is a neutral image/fallback loader:
approved art can replace a slot by configuring its URL and, if needed, frame
metadata in story content. Static light and contact cues stay in the scene.
The eleven authored illustrations are still needed to achieve final material
texture and expressive character poses; therefore the first-pass art task and
complete vertical-slice polish task remain **unchecked**. The brief is still
the art handoff. Browser captures at 1366×768 and 800×600 and the full E2E
suite are the QA gate for this provisional integration.

The initial unmasked vector pass slowed the software renderer and exposed
movement/camera timeouts. Caching only immutable fallback plates and applying
the water clip only to loaded images restored the prior performance range;
no movement or camera thresholds were relaxed. The isolated diagnostic measured
7.3–7.5 fps with fog and 9.5 fps without. During the full suite it measured
6.3/8.2 fps, in line with the existing slow software-rendering limitation.
Final `npm run agent:check` passed TypeScript, 96/96 unit tests in 22 files and
the production build (the existing >500 kB chunk warning remains). Final
`npm run agent:e2e` passed 56/56 in 19.2 minutes, including both works,
dialogue, NPC, parallax, save/restore and weather. Fresh deck, choice and
deep-fog captures at 1366×768 and 800×600 were inspected: no actor, cargo,
choice or control is cut off; dialogue and the sailor's work remain readable.
The coherent limited palette and depth now work as a provisional set, but
the cast and materials still read as simplified vector theatre compared with
fully authored illustration. This visual difference is the remaining art task.

## First-pass art handoff — prior checkpoint, 2026-09-30

Historical status below is superseded by the completed SVG pass above.

No approved visual asset files are present in the repository. The existing
`docs/art-briefs/journey-deck-dialogue.md` now specifies eleven coordinated
delivery pieces for the current encounter, including the five independent
river depths, deck/foreground separation, cargo and aligned character sheets.
Three checked-in browser captures show the current blocking at 800×600,
dialogue at 1366×768 and deep fog at 800×600. They are layout references,
not candidate final art. The brief includes scene coordinates, seam/pivot
requirements and acceptance checks. No runtime art was replaced, no new
image was invented, and this task remains open until the coordinated assets
are produced and approved. Once supplied, integrate them only in Journey
story/content composition, then rerun the full visual/browser gate.
`npm run agent:check` passed TypeScript, 89/89 unit tests and build for this
documentation-only handoff. The unchanged runtime was last validated by the
full 56/56 E2E suite in the preceding inked-slice QA commit; no browser code
changed in this handoff.

## Current inked-slice QA — 2026-09-30

The full browser suite passed before and after the polish change (56/56 each
time). Fresh deck, conversation-choice and deep-fog captures at 1366×768 and
800×600 were inspected. The river, cargo, both characters and dialogue choices
remain visible; the UI is inside the frame and the fog does not obscure input.
Small actor name tags on the deck were removed: at 800×600 they were too small
to read and the sailor's tag crossed the working rope. Character identity
continues through Pixi'VN dialogue and the approach prompt; no engine or
gameplay code changed. Browser staging coverage now checks that those tags are
absent. The encounter art brief was corrected to reserve space for the actual
upper-left dialogue panel and to describe 800×600's fitted 16:9 canvas, not a
4:3 crop. `npm run agent:check` passed TypeScript, 89/89 unit tests and build.
The software-renderer diagnostic remains about 6.9–7 fps with fog versus 8.5
fps without it; the existing bundle-size warning also remains. This QA covers
the current inked slice. Repeat visual QA after approved illustration assets
replace the placeholders; neither remaining plan task is complete yet.

## Vertical-slice QA: control-legibility pass — 2026-09-30

The first-pass illustrated assets still await separate production and approval.
As a bounded part of the pending browser QA, Journey's control legend was moved
from a 17-unit Pixi canvas label (about 7 px at 800×600) to a story-owned DOM
overlay. The legend now stays at least 12 CSS px at both target resolutions,
within the canvas frame, and is recreated only once on scene re-entry. This
does not complete the full vertical-slice QA or the pending art task. The
weather diagnostic remains about 7 fps with fog and 8.6 fps with fog hidden
under the software renderer; fog textures and sprites are already reused, so
no speculative engine or weather refactor was made.
Final validation: `npm run agent:check` passed typecheck, 89/89 unit tests
in 19 files and build. The relevant conversation and deck E2E suite passed
4/4; after the final spacing adjustment, the deck E2E passed again (1/1).
Fresh 1366×768 and 800×600 captures confirm the grouped controls remain
inside the canvas and clear of the actor silhouettes and interaction prompt.

## Deck encounter visual rescue — 2026-09-28

The selected vertical slice is the walk-and-talk encounter beside the cargo
with the moving river in view. Its previous uncommitted painted backdrop,
photoreal-grain planks and two cutout people were rejected for incompatible
style and removed from runtime. A story-owned palette/manifest now directs
inked sky, wider river passage, separate moving banks, ship planes, shadowed
full-body silhouettes, foreground rail/line and editorial dialogue treatment.
The existing movement, NPC routine, parallax, fog, camera and Pixi'VN dialogue
remain unchanged in ownership. During the river answer the water gains a pale
glimmer; during the cargo answer the crate takes a warm edge. The large chapter
title and actor labels recede while dialogue is active, and the panel moves to
the left so Marlow, the sailor and cargo remain visible at 800×600. The
coordinated future illustration requirements are in
`docs/art-briefs/journey-deck-dialogue.md`; no unapproved generated image was
substituted. This does not mark final illustrated assets or general art polish
complete. The 1366×768 and 800×600 deck, dialogue-choice and deep-fog captures
were reviewed: no clipped controls or actor silhouettes, dialogue stays above
the moving sailor at 800×600, and the river remains the broad background.
Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and the Vite build. The relevant joint `npm run agent:e2e --` suite
(deck, conversation, NPC, parallax, weather) passed 11/11 in 7.3 minutes
after the unused image-preload test helper was removed.
The wider suite had passed 54/56 before two test assumptions were corrected:
the NPC idle transition needs a larger wall-clock window under the already
known slow software fog renderer, and the title now deliberately fades during
dialogue. Both failed tests passed again, including within the joint suite.
The existing >500 kB bundle notice and software fog diagnostic (about 7 fps
with weather) remain outside this visual-slice scope.

## La metamorfosis portability scene — 2026-09-26

User-directed extension from `f3fd9e0` to prove a second work can use the
approved architecture. The unfinished first-pass Heart of Darkness art task
remains next on this plan; its pending human audio listening is not a gate.

- [x] Add a selectable `/?story=metamorphosis` entry while `/` keeps Journey as
  the default. The visible work selector reloads into the chosen Pixi'VN label.
- [x] Keep Gregor, room geometry, interactions, dialogue, checkpoints, audio
  sources and authored parameters in Metamorphosis story/content modules.
  Reuse engine movement, camera, spatial interactions and audio adapter, plus
  Pixi'VN labels, storage, sound and export/restore. No `src/engine/` changes.
- [x] Demonstrate an optional window observation that changes a later door
  line, and three audible provisional layers: room, exterior near the window,
  and abstract voices near the door. Their generator and CC0 attribution are
  documented with the assets; final sound design remains future content work.
- [x] Browser-test both entry paths, movement/camera, both dialogue paths,
  live zoned audio, decoded assets and Pixi'VN save/restore. Review the room
  at 800×600; keep the Phaser stash and local-only Git history intact.

Validation: `npm run agent:check` passed TypeScript, 89 unit tests in 19 files
and the production build. `npm run agent:e2e` passed the complete 34-test
browser suite in 11.8 minutes, including all existing Journey tests. Gregor's
room was visually reviewed at 800×600. The pre-existing >500 kB bundle warning
and slow software fog rendering (7–9 fps in the diagnostic) remain. No human
listening was performed or required for this task. The Metamorphosis loops are
provisional, and the Heart of Darkness listening review remains separate.

## Grete at the door — 2026-09-26

User-directed follow-up from `bc25924`. This extends only the existing room
interaction; the pending Journey art task remains unchanged.

- [x] Register Grete as an offscreen character behind the existing door. Show
  her presence with provisional doorway light and a label, without adding a
  house scene or autonomous NPC routine.
- [x] Extend the `E` interaction through Pixi'VN dialogue and two native
  choices. `1`/`2` or the choice buttons let Gregor ask Grete to stay or leave.
  The selected response is stored once in namespaced Pixi'VN storage; Grete's
  immediate and later lines differ. The existing window flag changes her first
  line before a choice, with no duplicate state.
- [x] Browser-test door availability, both choices and later replies, both
  serialized save/restore paths, the original window consequence, and the
  default Heart of Darkness entry. Keep all work-specific code outside
  `src/engine/` and make one local commit after validation.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests across
19 files, and the production build. `npm run agent:e2e` passed 36/36 tests,
including both Metamorphosis choice/save paths and Heart of Darkness regressions.
The 800×600 choice view was inspected visually and remained readable. Grete is
intentionally offscreen with provisional doorway art; this slice does not add
the rest of the house or an autonomous routine. The first unchecked Journey
task below remains the next planned work.

## Family activity at Gregor's door — 2026-09-27

User-directed Metamorphosis follow-up from `ee047df`. The pending Journey art
task remains unchanged.

- [x] Trigger one brief Pixi'VN narrative cue when Gregor enters a small zone
  near the existing door. Record that cue once in namespaced Pixi'VN storage.
  Returning to the zone, including after restore, does not replay it.
- [x] On the next door interaction, let Gregor try to answer his family or stay
  silent through Pixi'VN choices. Store `answered`/`silent` in the same
  narrative storage; Grete's immediate and later lines reflect that choice.
  Her previous stay/leave choice and the window-conditioned line still work.
- [x] Keep the room, Grete and family scene composition in Metamorphosis
  content/story modules. No new scene, audio asset, dependency or `src/engine/`
  change. Browser-test both outcomes, one-time activation, serialized
  save/restore, previous interactions and Journey regressions.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files, and the production build. `npm run agent:e2e` passed 39/39 tests in
11.9 minutes. The family question and both buttons were visually inspected at
800×600 and were readable without clipping. The existing >500 kB bundle
warning and slow software fog diagnostic (7.1 fps with weather, 9.3 without)
remain unrelated to this content change.

## Office representative arrives — 2026-09-27

User-directed Metamorphosis follow-up from `875feb4`. The pending Journey art
task remains unchanged; Gregor stays inside the existing room.

- [x] After the family exchange, a one-time proximity cue at the door announces
  that an office representative has arrived because Gregor missed work. The
  cue waits for `familyResponse`, so it cannot interrupt the earlier choice.
- [x] The next `E` interaction has a short Grete and representative exchange.
  Grete's first reaction reflects whether Gregor answered his family. Gregor
  can explain his absence or remain silent; the representative's immediate
  response differs. The earlier window, family and Grete conversations remain
  available afterward.
- [x] Store `metamorphosis.clerkArrivalHeard` and
  `metamorphosis.clerkResponse` (`explain`/`silent`) in Pixi'VN storage. Browser
  tests cover saves before arrival, after arrival, and after each choice;
  restoring beside the door does not duplicate the cue or dialogue.
- [x] Keep the representative offscreen, add no new scene or audio asset, and
  leave `src/engine/` untouched. Review both choice paths at 800×600 and run
  the complete project validation before one local commit.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 44/44 browser tests in
12.7 minutes, including all Journey regressions. Both 800×600 screenshots
show the representative's question and two fully visible, usable buttons with
no overlap. The existing >500 kB bundle warning and software fog diagnostic
(7.2–7.3 fps with weather, 9.5 without) remain outside this task.

## First Metamorphosis spatial transition — 2026-09-27

User-directed follow-up to the office representative scene. The pending Journey
art task remains unchanged; the rest of the Samsa apartment and visible family
characters remain for later work.

- [x] Unlock the room door only after the family proximity event, family
  response, office arrival and clerk response. Keep the earlier window, family,
  clerk and optional Grete dialogue; Grete has a separate nearby hotspot once
  opening the door becomes available.
- [x] Add one provisional hallway with bounded movement, camera follow, a
  picture observation through a Pixi'VN label, and an E interaction to return.
  Compose both spaces from existing movement, camera, interaction and audio
  helpers; no `src/engine/` changes or new dependencies.
- [x] Store `metamorphosis.currentSpace` in Pixi'VN storage alongside the
  existing Gregor position checkpoint. On transition, write the destination
  and its valid arrival position, dispose the old presentation/listeners/sound,
  then rebuild the destination. On restore, rebuild the saved space and position
  from Pixi'VN without serializing transient renderer or audio objects.
- [x] Browser-test the locked door, unlocked exit, hallway movement and picture,
  return path, narrative state, and saves in the room before unlock, after
  unlock, in the hallway, and after returning. Check room, hallway, observation
  dialogue and return at 800×600; keep Journey regressions in the full suite.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 47/47 browser tests in
13.5 minutes, including all Journey regressions. The 800×600 room, hallway,
hallway dialogue and return captures show Gregor in bounds with readable
prompts and no clipped dialogue. The pre-existing >500 kB bundle warning and
slow software weather diagnostic (6.8–7.4 fps with weather, 9.6 without) are
unchanged in scope.

## Visible Metamorphosis hallway NPCs — 2026-09-27

User-directed continuation of the first room-to-hallway transition. The
pending Heart of Darkness art task remains the first unchecked Journey task;
no other rooms or family characters were added.

- [x] Place provisional, distinct Grete and office representative figures in
  the existing hallway. Both stay at authored positions, have separate
  proximity prompts and can be spoken to with `E`. The existing hallway
  picture and room return remain available.
- [x] On first approach, each NPC steps aside once. Pixi'VN storage records
  `metamorphosis.greteSawGregor` and `metamorphosis.clerkSawGregor`; scene
  reconstruction reapplies their poses, so save/restore neither loses nor
  repeats the reaction. Generic `SpatialInteractions` provides proximity;
  the autonomous routine controller is unnecessary for fixed actors.
- [x] Pixi'VN labels give Grete a brief response conditioned on
  `familyResponse` and her earlier stay/leave choice, and the representative
  a two-line response conditioned on `clerkResponse`. No new choices or
  parallel dialogue state were introduced.
- [x] Browser-test both figures, distinct prompts, both reaction flags before
  and after restore, both contextual dialogue paths and their restored
  versions, and return to the room. Inspect the hallway, nearby prompts and
  both dialogues at 800×600. Keep `src/engine/` untouched and run all Journey
  regressions.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 50/50 browser tests in
14.5 minutes. At 800×600, both NPCs and their prompts are visible, Gregor
does not overlap them at interaction distance, and the contextual dialogue
fits the panel. The existing >500 kB bundle warning and software-weather
diagnostic (7.3–7.7 fps with weather, 9.6 without) remain outside this task.

## Office representative leaves the hallway — 2026-09-27

User-directed Metamorphosis follow-up to the visible hallway NPCs. The
pending Heart of Darkness art task remains the first unchecked Journey task.

- [x] After the existing two-line contextual conversation closes, mark
  `metamorphosis.clerkLeaving` in Pixi'VN storage. Compose the already-general
  `attachNpcRoutine()` with one authored exit stop, so the representative
  visibly walks past the picture toward the hallway exit while Gregor remains
  controllable. His interaction is disabled as soon as the withdrawal starts.
- [x] At the exit, remove the actor and record `metamorphosis.clerkLeft` in
  Pixi'VN storage. Rebuilding from a save before the conversation keeps him
  present; rebuilding a save made during the walk settles the withdrawal as
  complete; a save after departure keeps him absent. No trajectory snapshots,
  engine changes, new dialogue choices or new room were needed.
- [x] Browser-test initial presence, dialogue, live movement and disappearance,
  no repeated encounter, Gregor's continued movement, Grete's availability,
  the return door and all three save phases. Inspect the start, route and
  empty exit at 800×600; run every Journey regression.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 51/51 browser tests in
14.9 minutes. At 800×600, the representative moves below the wall picture
toward the marked exit without crossing the door or Gregor; dialogue and
prompts remain legible. The existing >500 kB bundle warning and software
weather diagnostic (7.0–7.1 fps with weather, 9.2 without) are unrelated.

## Grete's physical hallway response — 2026-09-27

User-directed Metamorphosis follow-up. The pending Journey art task remains
unchanged; this work adds no room, character or engine behavior.

- [x] After her existing hallway conversation, record
  `metamorphosis.greteReacted` in Pixi'VN storage and reuse `attachNpcRoutine()`
  for an authored retreat. Her earlier `stay`/`leave` choice decides whether she
  remains available at a new position or leaves through the far exit. The
  family `answered`/`silent` response changes the distance she keeps when she
  stays and her first retreat stop when she leaves. No new choice was added.
- [x] Grete pauses at (920,760) after `stay`/`answered` or (970,800) after
  `stay`/`silent`, then offers only a brief follow-up line. After `leave`, she
  steps back, moves below the representative along the lower edge of the
  walkable floor and exits at (1560,760). On arrival, record
  `metamorphosis.greteLeft` and remove her actor. Gregor keeps moving and the
  representative's independent withdrawal remains unchanged.
- [x] Reconstruct pre-conversation saves at Grete's initial pose. A save during
  the walk settles at the authored final pose or absence; after completion,
  save/restore and room-to-hallway re-entry preserve that result. This follows
  the existing representative pattern without serializing a path.
- [x] Browser-test both outcomes, the two `stay` distances, initial presence,
  dialogue, visible movement, no repeated main dialogue, save phases, room
  return, re-entry and Journey regressions. Review start, route, final poses,
  prompts and dialogue at 800×600.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 54/54 browser tests in
16.6 minutes, including all Journey regressions. At 800×600 the start,
retreat, lower-floor route, two waiting positions and absent-after-exit view
remain readable; Grete no longer overlaps the representative while leaving.
The provisional art, existing >500 kB bundle warning and software weather
diagnostic (7.1–7.4 fps with weather, 9.4 without) remain outside this task.

## Gregor's father enters the hallway — 2026-09-27

User-directed brief Metamorphosis transition. The pending Journey art task
remains unchanged. This does not start the confrontation or apple episode.

- [x] Keep the father hidden on initial hallway entry. After the representative
  has left and Grete has finished her physical reaction, a fresh entry into a
  small zone near the picture marks `metamorphosis.fatherArrived` in Pixi'VN
  storage. Entering that zone before either condition does nothing. Gregor
  remains controllable as the father walks in from the far doorway using the
  existing NPC routine.
- [x] At (1380,760), the father waits away from the room door, faces Gregor,
  and offers a short three-line Pixi'VN exchange through `E`. Completing it
  marks `metamorphosis.fatherSpoken`; later interactions have one short line.
  No new choice, scene, engine mechanism or collision system was added.
- [x] A pre-arrival save keeps the father hidden. A save during entry settles
  him at the final position on restore, with the first dialogue still
  available. Saves before and after talking preserve the appropriate dialogue
  and prevent a second entrance. Room-to-hallway re-entry retains the actor.
- [x] Browser-test prerequisite order, both Grete outcomes, one-time arrival,
  continued movement, dialogue, all save phases, room return and Journey
  regressions. Inspect entry, waiting positions and dialogue at 800×600.

Validation: `npm run agent:check` passed TypeScript, 89/89 unit tests in 19
files and production build. `npm run agent:e2e` passed 56/56 browser tests in
17.9 minutes, including all Journey regressions. At 800×600, the hidden,
entering and waiting states and the three-line dialogue are visible and
legible. The father does not block the room door or overlap Grete; the two
speakers remain distinguishable at the interaction point. Provisional art,
the existing >500 kB bundle warning and slow software weather diagnostic
(6.9–7.0 fps with weather, 9.3 without) remain outside this task.

## Journey audio listening diagnostics — 2026-09-26

Baseline: `98656f2` on `journey-vertical-slice`. This focused listening aid does
not start the pending first-pass art task.

- [x] Add a Journey-only panel, hidden during normal play and toggled with `P`.
  It shows Marlow's deck location and coordinates, plus live mixer volume,
  target, Pixi'VN channel volume and playback state for river, shore and engine.
  It reads the existing controller without changing sound or gameplay state.
- [x] Keep the overlay and route outside `src/engine/`; dispose its key listener,
  ticker callback and DOM when the scene is rebuilt. Browser-test that `P` works
  during movement and Pixi'VN dialogue without capturing input, and that scene
  restart leaves one hidden panel.
- [x] Document river → shore → engine listening stops, save/restore instructions
  and a short way to note levels, timbre and transition/loop artifacts in
  `public/assets/audio/README.md`.
- [x] Run `agent:check` and pertinent browser regressions. `agent:check` passed
  TypeScript, 89 unit tests in 19 files and production build. Targeted
  `agent:e2e` passed 14/14 tests covering audio, diagnostics, conversation,
  movement and save/restore in 3.5 minutes. The existing >500 kB bundle warning
  remains. No human auditory judgment is claimed; the route is ready for it.

## Audible provisional ambience — 2026-09-26

Baseline: `0cd5876` on `journey-vertical-slice`. This is a focused audio-asset
follow-up, not the broader first-pass art or vertical-slice polish task.

- [x] Replace the shared silent WAV with distinct reproducible river, shore and
  machinery sketches. The generator uses only original oscillators and seeded
  noise, with no third-party recordings or samples. Record source, creator and
  CC0 asset terms in `public/assets/audio/README.md`.
- [x] Keep aliases and cue parameters in Heart of Darkness story configuration.
  Retune zone radius, volume and fades without editing the generic audio engine.
- [x] Add PCM asset checks for distinct non-silent files, duration, peak and
  loop seam. Browser-check decode, running context after gesture, live Pixi'VN
  media/channel counts, movement and save/restore.
- [x] Run complete `agent:check` and `agent:e2e`, then create one local commit.
  Leave the Phaser stash untouched; no push or next-task work.

Automated tests cannot judge the perceived timbre or balance of these synthetic
drafts. The asset README gives a short headphone-based listening route for the
project owner. The separate sound-production phase may replace the three paths
in story configuration without modifying `src/engine/`.

Validation: `npm run agent:check` passed TypeScript, 89 unit tests in 19 files
and the production build. `npm run agent:e2e` passed 29 browser tests in 9.7
minutes, including browser decoding of all three non-silent loops, channel
uniqueness, movement, scene restoration, neutral portability and all existing
gameplay regressions. The browser confirmed a running audio context after a
canvas gesture; no direct human listening took place. The previous >500 kB
bundle warning remains. Software-rendered fog diagnostic was 7.8 fps with fog
and 10.1 fps without it, consistent with prior runs. No audio engine module,
save format or other-story content changed.

## Completed zone ambience implementation — 2026-09-26

Baseline: `2b03ddf` on `journey-vertical-slice`. The user selected the first
unchecked task and specified a reusable layered zone system before final assets.

- [x] Build a story-neutral audio mixer: independent layers, optional proximity
  zones, priority groups, smooth fade/crossfade, enable/volume control, generic
  listener target and lifecycle cleanup.
- [x] Adapt it to Pixi'VN's public `sound.play`/channels/stop/pause/resume API.
  Pixi'VN owns playback and save state; the scene owns zone definitions. Reconcile
  aliases after `Game.restoreGameState()` rather than serializing playback time.
- [x] Compose a minimal temporary-silence ambience and one zone in Journey, with
  no authored music or final sound design. Exercise neutral and Journey browser
  flows, including scene re-entry and restored position.
- [x] Document how a second work supplies its own sources and zones. Run
  `agent:check`, then `agent:e2e`; create one commit, keep Git clean and the
  Phaser stash intact, with no push or next-task work.

Implementation: `SpatialAudioController` accepts any position provider and
authored base or circular-zone layers. Distance determines continuous gain;
groups divide gain by priority while unrelated layers mix simultaneously.
Per-layer fade durations smooth entries, exits and content-driven changes.
`PixiVnAudioOutput` uses Pixi'VN tracked sounds and background channels, waits
for a canvas gesture, reconciles restored/missing media and cleans late loads.
`attachSpatialAudio` uses the existing Pixi ticker and scene destruction event.
Journey defines river, shore and engine placeholder layers outside the engine;
the three aliases currently point at the same short silent WAV. There is no
music design, user audio menu, alternate persistence format or other-story code.

Validation: `npm run agent:check` passed TypeScript, 88 unit tests across 18
files and Vite production build. `npm run agent:e2e` passed all 28 Playwright
tests in 9.7 minutes. New browser cases cover real Pixi'VN media and channel
state, priority/proximity, keyboard movement, scene restoration and a neutral
room/window/door soundscape. Existing camera, movement, NPC, dialogue, cargo,
parallax, save/restore and weather regressions passed. The existing >500 kB
main-chunk warning remains. Software-rendered fog diagnostics were 7.6/7.9 fps
with fog and 10.1 fps without; no general rendering optimization was in scope.
No physical listening claim is made: the integration asset is intentionally
silent, and browser tests inspect media, gains and transitions deterministically.
Pixi'VN retains named channel definitions (it exposes no channel removal);
scene media and event listeners are cleaned, and stable aliases are reused.

## Architecture portability audit — 2026-09-24 (before refactor)

The user selected this audit before the pending audio task. Baseline: `1ed2331`.

- Already reusable: bounded `MovementController`, configurable `CameraDirector`,
  `NpcRoutineController`, periodic parallax, scalar atmosphere, world layers and
  their ticker adapters. No `src/engine/` module imports Journey story/content.
  Pixi'VN already provides labels, choices, conditions, storage and save/restore;
  wrapping those in a second narrative engine would add coupling, not remove it.
- Correctly game-specific: Marlow/deckhand art and routine, river layer data,
  weather keyframes, cargo flag, labels, dialogue text, scene composition and
  conversation HUD. These belong outside `src/engine/`.
- Reuse gaps: `attachJourneyConversation` owns proximity selection and `E`
  arbitration for both talk and cargo; `createJourneyCargoInspection` repeats its
  own reach check. A neutral spatial-action resolver can serve both while leaving
  Pixi'VN dialogue in content. `journeyState` holds a generic number checkpoint
  helper; make the storage adapter reusable while Journey still defines keys.
  The fixed procedural fog artwork currently lives in `engine/weather`, although
  its visual recipe is content art. Camera's private `player` label means any
  follow target, so clarify that name. Keyboard controls have fixed defaults;
  expose optional bindings without changing existing input.
- Deliberate limits: one rectangular walkable area/circular footprint, manually
  composed Journey scene, Journey-specific HUD, no NPC routine checkpoint and no
  audio implementation. A declarative scene DSL, generalized collider, custom
  dialogue/save systems or speculative NPC persistence are not justified now.

Audit follow-up: extract only the shared spatial-action and Pixi'VN checkpoint
adapters, keep fixed fog artwork with Heart of Darkness, add a neutral portability
fixture and an engine-import boundary check, document the composition recipe,
then run the complete validation gates before one commit.

Implementation:

- [x] Add a pure `SpatialInteractions` resolver for targets, ranges, priorities,
  enabled predicates and callbacks, plus a focused-key binder. Both the sailor
  and cargo tally now use it; Pixi'VN still owns dialogue/choices and Journey
  still owns prompts, labels and narrative outcomes.
- [x] Extract `createPixiStorageCheckpoint` from Journey-specific state code.
  A caller supplies its storage key and validator; Journey's own keys and cargo
  decision remain in content. Pixi'VN remains the only save/restore authority.
- [x] Allow authored keyboard bindings while preserving WASD/arrows by default.
  Clarify the camera's generic follow-target name and move the fixed fog texture
  recipe into Heart of Darkness story art. Leave world/NPC/parallax/atmosphere
  algorithms in `src/engine` without novel imports.
- [x] Add a story-neutral browser fixture proving movement, interaction and
  Pixi'VN export/restore with `test-player`/`test-interactable` keys; check
  custom controls and focused `E` input. Add a TypeScript-AST unit guard that
  rejects relative imports from `src/engine` to outside that directory.
- [x] Document current boundaries, the composition path for another work and
  known limitations in `docs/ENGINE_ARCHITECTURE.md`; add an agent rule to reuse
  systems and keep engine dependencies pointed inward.
- [x] Run complete `agent:check` and `agent:e2e`, record results, create one
  commit, verify clean Git and untouched Phaser stash. No push.

Validation: `npm run agent:check` passed TypeScript, 77 unit tests in 15 files
and Vite production build. `npm run agent:e2e` passed all 26 browser tests in
9.6 minutes, including the three neutral portability cases and the existing
Journey movement, camera, NPC, interaction, conversation, parallax, save/restore
and weather regressions. The existing >500 kB chunk warning remains. The
software-rendered weather diagnostic was 7.6/7.7 fps with fog and 9.8 fps
without; no rendering optimization was attempted in this architecture task.

Remaining design limits are intentional: no generic scene schema or multi-game
bootstrap, Journey-specific HUD/dialogue adapter, rectangular navigation, no
NPC-routine checkpoint, and no zone audio yet. A future *Metamorphosis* scene
can reuse movement, camera, action selection/input, NPC routine, parallax,
atmosphere and Pixi'VN checkpoint adapters, but must author its own scene,
visuals, labels and UI adapter.

## Completed spatial and voyage save/restore validation — 2026-09-24

Baseline: `a16ef94` on `journey-vertical-slice`. The user selected this validation
before the pending audio task.

- [x] Checkpoint Marlow's exact world coordinates, unwrapped near-bank voyage
  distance and smoothed atmosphere progress in Pixi'VN `storage`, which
  `Game.exportGameState()` and `Game.restoreGameState()` already serialize.
  Generic movement, parallax and atmosphere adapters accept an optional
  checkpoint channel; Journey owns the story-specific keys.
- [x] Rehydrate live controllers when Pixi'VN replaces storage on restore.
  Constrain restored player coordinates to deck bounds, reset stale velocity,
  reconstruct the river tile phase from saved distance, and immediately rebuild
  fog and world shading from saved atmospheric progress. Gameplay then continues
  on the existing ticker without a second save manager or save/load UI.
- [x] Browser-test move -> export -> move elsewhere -> restore using the real
  actor's exact coordinates. Browser-test early voyage -> export -> deep voyage
  -> restore using exact serialized distance/progress plus visibly lighter fog
  and world tint. The existing inspected/ignored cargo dialogue save tests and
  the complete gameplay regression suite still exercise restored interaction,
  river motion and weather.
- [x] Add focused controller tests for exact/bounded position restore, wrapped
  river phase restore and immediate atmosphere reversal. Run `agent:check` and
  complete `agent:e2e`; commit separately without push or touching the Phaser
  stash.

Validation: `npm run agent:check` passed TypeScript, 73 unit tests across 12
files and the production Vite build. `npm run agent:e2e` passed all 23 browser
tests in 10.3 minutes, including both new restore paths and the existing cargo,
movement, dialogue, parallax and weather cases. The pre-existing >500 kB bundle
warning remains. The weather diagnostic reported about 7–7.3 fps with fog and
9.4 fps without it in software rendering; no new rendering optimization was in
scope.

Limits: the route currently has continuous travel progress and authored
atmospheric bands, but no phase-gated dialogue or event to replay. The browser
test verifies the visible weather state for the restored phase. NPC routine
position and independent decorative parallax/fog offsets are outside this
checkpoint; the near-bank distance is the canonical journey-progress source.
There is still no player-facing save/load UI. Audio remains the next task.

## Completed narrative save/restore task — 2026-09-24

Baseline: `c1d64c1` on `journey-vertical-slice`. The user explicitly selected
save/restore before the still-pending audio task.

- [x] Use Pixi'VN's `Game.exportGameState()` and `Game.restoreGameState()` directly.
  Keep `journey.cargoMarkInspected` in Pixi'VN storage, which is part of its
  serialized `GameState`; add no project save manager, save UI or gameplay code.
- [x] Exercise inspected -> JSON save -> fresh page -> restore -> modified sailor
  answer. Reach the sailor after restore and verify real parallax/fog ticker updates.
- [x] Exercise ignored -> JSON save -> later inspection -> restore -> original
  sailor answer. This proves restoration replaces the changed narrative flag.
- [x] Run `npm run agent:check` and the full `npm run agent:e2e`; keep the
  existing movement, camera, NPC, conversation, interaction, parallax and weather
  regression suite passing. One commit, no push, Phaser stash untouched.

Verification: TypeScript, 70 unit tests and production build passed in
`agent:check`. Playwright's complete 21-test `agent:e2e` run finished with
`passed` and no failed tests, including both new save/restore paths. A small
test-only probe calls the public Pixi'VN API and samples restored scenery; it
does not add an alternate persistence path. The existing large-chunk build
warning remains. This smoke test covers the narrative flag and live scene after
restore; exact player/NPC positions and voyage phase are not checkpointed by
these smoke tests. Pixi'VN warns that no route-navigation callback is configured
during restore; the current slice has only the start route.

## Completed environmental interaction task — 2026-09-23

Baseline: `bb8d2a1` on `journey-vertical-slice`.

- [x] Place an optional, visibly marked cargo tally on the port-side fittings.
  Reuse the existing conversation prompt and `E` input when Marlow is in reach;
  active conversation still owns `E`, and `1/2` remain Pixi'VN choices.
- [x] Record inspection as `journey.cargoMarkInspected` in Pixi'VN storage.
  Keep the world reach adapter small and story-specific, without inventory,
  quests, a new UI or a parallel narrative state manager.
- [x] Let the existing cargo-answer label choose its later line from stored state:
  an uninspected tally keeps the original answer; inspecting the erased mark
  makes the sailor acknowledge the missing destination.
- [x] Test both paths in browser, recheck conversation regression and review
  the prompt and changed dialogue visually at 1366x768 and 800x600.
- [x] Run `npm run agent:check` and the complete `npm run agent:e2e`; commit only
  after they pass. No push or Phaser stash changes.

Verification: `agent:check` passed TypeScript, 70 unit tests and the production
build. `agent:e2e` passed all 19 tests, including two new cases for inspecting
and ignoring the tally. The existing conversation test now waits for the sailor's
specific prompt, since `E` can also offer inspection elsewhere on the deck.
Visual captures at both resolutions show the tally and reachable prompt; the
later answer is readable with the existing dialogue panel. Existing build chunk
warning remains (main chunk about 552 kB). Pixi'VN storage owns the flag, but
export/restore coverage belongs to the later save/restore task.

## Completed weather task — 2026-09-19

Baseline: `33bcb9f` on `journey-vertical-slice`.

- [x] Add a reusable progress-driven scalar atmosphere profile with continuous
  interpolation and smoothing. No timer advances its target; future effects can
  consume additional channels without changing the progression controller.
- [x] Expose signed travel distance from the existing parallax controller without
  changing its motion. Journey reads near-bank distance / 3600; an external
  navigation progress source can be supplied at scene composition.
- [x] Compose three soft fog depths and a restrained shade channel using the
  existing parallax, camera, world layers and ticker. Share one small generated
  texture per scene, clean up on destruction, and keep HUD/dialogue above weather.
- [x] Validate gradual clear/intermediate/deep states, travel while idle, movement,
  conversation, scene re-entry and UI visibility at 1366x768 and 800x600. Measure
  rendering cost without starting a global optimization task.
- [x] Run `npm run agent:check` and `npm run agent:e2e`, review, update the plan
  and commit only after all validations pass. No push or Phaser stash changes.

Decisions and verification:
- `AtmosphereController` interpolates authored scalar channels at progress 0, 0.5
  and 1, with smooth transitions and frame-rate-independent response. A fixed
  progress input never ages by itself. Additional channels can later drive rain,
  storms or lighting without adding novel-specific logic to the engine.
- Journey supplies near-bank signed travel distance / 3600 as progress. Camera
  motion and repeat seams do not affect that distance; an optional progress getter
  supports a future navigation source. The ship keeps advancing while Marlow is
  idle or reading. Time only smooths changes to the supplied progress.
- Three pooled fog layers reuse `attachParallaxLayer` at different speeds/depths.
  A single 256x128 texture is shared per scene. World tint supplies restrained
  shading without another full-screen layer; HUD and dialogue remain outside it.
  Existing ticker/lifecycle own updates and disposal. No per-frame texture creation
  or changes to movement, camera, NPC or Pixi'VN narration controllers.
- Eleven added unit tests cover interpolation, boundaries, fixed progress,
  30/60/120 fps response, reversal, invalid input, stable state reuse, profile
  validation, ticker order/disposal and signed travel distance.
- Three added browser tests cover real voyage advancement while idle/walking,
  smooth atmospheric stages, usable dialogue choices, scene re-entry cleanup,
  shared texture and stable tile pools. Screenshots of all three stages reviewed
  at 1366x768 and 800x600: distant scenery progressively fades while actors,
  controls and dialogue remain visible. Existing gameplay regressions pass.
- `npm run agent:check`: TypeScript passed, 70 unit tests passed and production
  build passed. Existing bundle warning remains (main chunk 551.54 kB).
  `npm run agent:e2e`: all 17 tests passed in 8.0 minutes. Read-only code review
  found no blocking issues.
- Final software-rendering diagnostic measured 7.6/7.5 fps with fog visible and
  9.7 fps with it hidden. Reducing fog overdraw and using world tint improved the
  initial weather implementation, but a measurable rendering cost remains.
  This is functional validation, not a 60 fps claim; GPU performance remains for
  later QA. Measured slow full-deck crossings and scripted camera/re-entry tests
  required longer waits in three existing E2E tests; exact assertions are retained.
- Limitations: provisional fog art; voyage/weather reset on scene re-entry.
  Persistence remains the later save/restore task. No rain, audio, new dependencies
  or general art/performance pass were added.

Manual check: run `npm run dev`, watch the voyage while idle, then use WASD/arrows
and approach the sailor with E. Keep reading or choices open as the fog deepens.
The authored route reaches its deep profile after 3600 units (about 120 simulated
seconds at the current bank speed; slower in the software-rendering environment).
Check dialogue and controls again at 800x600.

## Completed parallax task — 2026-09-17

Baseline: `f120132` on `journey-vertical-slice`. Reuse the existing world layers,
CameraDirector and Pixi'VN ticker/lifecycle; no final art or new dependencies.

- [x] Test and implement reusable periodic layer motion and camera depth offsets
  under `src/engine/`. Maintain bounded phase and pooled seamless horizontal tiles,
  including camera pans/zoom. Detach from the shared ticker on scene destruction.
- [x] Author provisional background, far vegetation, near bank, river surface and
  sparse foreground graphics in Journey data, using the existing palette. Give
  each distinct speed/depth; keep deck, fittings, actors and HUD outside scrolling.
- [x] Integrate continuous travel independently of Marlow's direction and dialogue.
  Observe idle travel, simultaneous movement/conversation and camera coverage at
  1366x768 and 800x600; test repeat seams, frame rates, bounds and cleanup.
- [x] Run `npm run agent:check` and `npm run agent:e2e`, review, update this plan and
  commit. No push or Phaser stash changes. Stop before fog/weather progression.

Decisions and verification:
- `ParallaxLayerController` owns bounded periodic travel and camera compensation;
  `attachParallaxLayer` reuses the existing ticker after camera updates and before
  rendering. Tile instances are pooled, only intersecting tiles are visible, and
  destruction removes the ticker listener. No new render loop or persistence system.
- Journey supplies five provisional tiles: distant ridge (5 units/s), far
  vegetation (14), near bank (30), river currents (58), foreground reeds/debris
  (90). Their horizontal camera depths are 0.08, 0.25, 0.5, 0.8 and 1.15.
  Vertical depth stays at 1 to keep banks aligned with the river. Scenery travels
  toward the stern even while idle; deck, fittings, actors and HUD do not scroll.
- Eight added unit tests cover authored speed at 30/60/120 simulated fps, reverse
  travel, bounded phase, seam continuity, camera compensation, viewport coverage,
  exact tile edges, pool reuse, update order and disposal.
- Two added browser tests measure actual layer transforms during idle, reading
  and choices, check coverage during pans/zoom at 1366x768 and 800x600, and verify
  old layers are destroyed on re-entry. Existing movement, NPC, camera and dialogue
  regression tests also run. Final screenshots reviewed at both resolutions.
- `npm run agent:check`: TypeScript passed, 59 unit tests passed, production build
  passed. `npm run agent:e2e`: the complete 14-test run passed; its persisted
  Playwright result reports `passed` with no failed tests. Read-only review found
  no blocking issues. Existing bundle warning remains (main chunk about 547.7 kB).
- The browser environment measured about 9 fps with the new layers and 11 with
  them hidden. A 12-second full-deck camera-test crossing timed out near the edge
  because movement caps simulation ticks at 50 ms. Only that test's wait increased
  to 20 seconds; exact bounds and frame-based velocity assertions remain intact.
  This validates behavior, not a 60 fps performance target. GPU-accelerated
  performance remains part of the later browser QA/polish task.
- Limitations: provisional geometry repeats every 1920 world units; travel phase
  is transient and resets on scene re-entry. World persistence remains its later
  plan task. No new dependencies or changes to movement, camera, NPC or narration
  controllers were needed.

Manual check: run `npm run dev`, watch the river while standing still, then walk
with WASD/arrows in both directions. Approach the sailor and press E, continue
walking while reading, and leave the choices open to observe uninterrupted travel.
Resize to 800x600 and check the banks, water and sparse foreground at the edges.

## Completed walk-and-talk task — 2026-09-15

Baseline: `6385a50` on `journey-vertical-slice`. Implement only the first pending
task; validate, make a separate commit, no push and no Phaser stash changes.

- [x] Author a short original Spanish exchange about the river and the cargo in
  `src/story/heart-of-darkness/conversation.ts`. Register Marlow alongside the
  existing deckhand; use Pixi'VN labels and choice branches in `src/content/`.
- [x] Attach proximity and input to the existing scene/ticker. E starts within
  180 world units, then advances; 1/2 or mouse chooses a response. Keep Marlow's
  movement, the NPC route and camera follow independent of dialogue.
- [x] Add a nonmodal HTML dialogue panel in `src/ui/`, aligned to the contained
  canvas. Keep speakers, text and choices projected from canonical Pixi'VN state.
  Preserve canvas focus when clicking, allow Tab/Enter and ignore held-key repeats.
- [x] Keep the current line visible beyond 440 world units, with a return prompt;
  block only dialogue progression until within earshot again. End cleanly and
  allow another conversation. Destroy HUD, ticker callback and listeners on re-entry.
- [x] Browser-test both branches, simultaneous real-frame movement, range gates,
  held-key repeats, mouse focus, completion/repeat and restart during choices.
  Review screenshots at 1366x768 and 800x600, run all checks and review the diff.

Decisions and verification:
- Narration, character identity, choice history and branching stay in Pixi'VN.
  No parallel dialogue cursor/state machine, save format, input system or render
  loop. Transient UI busy/error state is local; UI reads narration on the existing
  ticker after movement. Narrative text and ranges stay outside reusable engine code.
- The sailor acknowledges nearby Marlow when idle and continues his authored work
  route. The player sets reading pace; neither reading nor choosing freezes movement.
  The existing CameraDirector remains unchanged and follows Marlow throughout.
- Branches return through Pixi'VN call semantics; closing the conversation clears
  its dialogue/choices and closes that label without rebuilding the deck. Regression
  coverage ensures no empty extra press between a branch answer and the final line.
- Replaced the technical deck subtitle/control legend and removed the visible
  camera target and walkable-area caption. Character and scenery art remain provisional.
- `npm run agent:check`: TypeScript passed, 51 unit tests passed, production build
  passed. `npm run agent:e2e`: all 12 tests passed in 3.5 minutes with a fresh server.
  An earlier run lost its first camera test to a page reload while reusing the dev
  server; rerunning from a clean server passed without changing the camera/test.
- Visually reviewed the opening deck, river response and both responsive choice
  layouts. Read-only code review found no blocking issues. The movement sample's
  precondition observes NPC displacement; a future timing flake should be resolved
  by sampling a walking interval, without weakening movement assertions.
- Limitations: one repeatable authored conversation, no voice/typewriter/portraits
  yet, and no implemented save/restore of transient world positions. Full world
  persistence remains its later plan task. The existing large-bundle warning
  remains (main chunk about 543.5 kB minified).

Manual check: run `npm run dev`, walk right with WASD/arrows toward the sailor,
press E when the prompt enables, keep walking while reading, use E to advance and
1/2 (or the buttons) to choose. Walk out of earshot and back to verify resumption.
Finish the exchange and approach again to replay the other branch.

## Completed agent infrastructure task — 2026-09-15

Baseline: `d2bf60f`. User scope: compact context and standard validation commands,
no gameplay changes; separate commit, no push or changes to the Phaser stash.

- [x] Add `scripts/agent-context.mjs` using only Node built-ins and Git: branch,
  commit, porcelain status, up to 20 changed paths, staged/unstaged short statistics,
  active plans and first unchecked task outside fenced examples. No full diff.
- [x] Add npm aliases for context, deterministic checks and existing Playwright.
  Share typecheck and bundle steps so the quality gate checks TypeScript once;
  stop immediately if a step fails. Preserve typechecking in `npm run build`.
- [x] Update AGENTS and START_HERE with the standard startup/validation workflow.
- [x] Validate all three commands and review the final diff for the independent
  infrastructure commit.

Context reports missing/multiple plans explicitly and never executes the next task.
Integration tests use temporary Git repositories to check clean/dirty state,
status columns, renames, untracked output limits, detached HEAD and plan selection.
No dependencies, game systems or architecture changes are needed.

- `agent:context` verified against the working tree and temporary repositories;
  distinguishes index/worktree columns, caps output and does not print diff bodies.
- `agent:check`: TypeScript passed, 51 tests passed, Vite build passed. The gate
  also stopped correctly on a typecheck failure during development. Node-script
  tests use JavaScript so no Node type dependency or browser tsconfig change is needed.
- `agent:e2e`: all 9 Playwright tests passed in 2.6 minutes via the existing suite.
- Existing bundle-size warning remains (main chunk about 539 kB). No push,
  no stash changes, and no dialogue/walk-and-talk implementation.

## Completed NPC task — 2026-09-14

Baseline: `c36e6e2`. Scope approved: one autonomous deckhand, no dialogue,
parallax, weather or audio; separate stable commit, no push or stash changes.

- [x] Test and implement `src/engine/npc/NpcRoutineController.ts`, composing the
  existing MovementController for footprint bounds and motion. A cyclic list
  of stops defines positions, dwell times, facing and opaque activity ids.
  Expose idle/walking/paused state, pause/resume, face(point), and cameraTarget.
- [x] Add `attachNpcRoutine.ts` on the existing ticker with destruction cleanup.
  Register one canonical Pixi'VN character in `src/content/characters.ts`.
- [x] Author a triangular rope/cargo/lookout routine and animated sailor
  placeholder in `src/story/heart-of-darkness/`. Show feet, head orientation,
  walking stride and task gestures. Keep UI labels readable and scenery static.
- [x] Integrate the scene handle with the existing camera's focus(provider),
  preserving player follow. No conversation system is added; future scene code
  can pause, face the player, focus, then resume both routine and camera.
- [x] Test multiple cycles, dwell timing, arrival without overshoot, facing,
  interruptions, invalid routes, bounds, real-ticker cleanup and camera targeting.
  Observe at least two full live cycles in Chromium, including simultaneous
  Marlow movement and camera focus/return. Run all project validations, review,
  update this plan and commit. Stop before dialogue.

- `NpcRoutineController` composes `MovementController`; cyclic stops carry opaque
  activity ids, dwell times and optional facing. It exposes `idle`, `walking`
  and `paused` modes with position/velocity/facing, action time and remaining dwell.
  Frame remainder is carried across arrivals and pauses to preserve timing at
  30/60/120 fps. Invalid/unreachable stops are rejected; close/identical stops work.
- `pause()` preserves the current leg or remaining dwell; `face(point)` turns
  toward a target without moving; `resume()` restores the interrupted action.
  `cameraTarget` is a provider directly accepted by `CameraDirector.focus()`.
  There is no new camera, input, narrative, identity or persistence subsystem.
- The scene returns `{ camera, npc, player }`. The existing camera test helper
  now uses `.camera`; CameraDirector itself is unchanged. NPC callbacks detach
  on actor destruction, including Pixi'VN label re-entry.
- Pixi'VN canonically registers `journey-deckhand` (Marinero). Its initial station
  moved to (1080,740) so the working sailor is visible in Marlow's initial frame.
  Route: coil rope (2600 ms), check cargo at (1420,690) (2400 ms), survey the river
  at (1260,815) (1700 ms), return. Speed: 95 units/s; footprint: 20 units.
- Provisional art includes a cap, collar, arms, legs, foot shadow, head direction,
  walking stride and three work gestures. The rope provides task context. Cargo
  is drawn behind the sailor, and hands above the torso, keeping actions visible.
- Validation: `npm test` 47 passed; `npm run build` passed; `npm run test:e2e`
  9 passed. Chromium observed two full live cycles (over 25 seconds of simulation,
  about a minute of browser observation), checking every observed frame for
  footprint escapes and positional jumps, plus simultaneous Marlow/NPC movement.
  Coverage also includes pause/face/resume, camera targeting/return, registration,
  initial visibility, destruction, and all existing movement/camera regressions.
- Visually reviewed initial framing, simultaneous movement, each work station,
  corrected hands/cargo layering, and facing Marlow. Read-only code review found
  no remaining blocking issues; added exact duplicate-stop coverage from review.
- Limitations: deterministic authored route in a rectangular corridor; no path
  finding, obstacle/actor avoidance, interaction trigger or dialogue yet. Routine
  state is transient and resets on label re-entry; persistence remains a later
  Pixi'VN save/restore task. Rendering is provisional geometry, not final sprites.
  The inherited 50 ms stall cap slows simulation below 20 fps. The existing
  bundle-size warning remains (main chunk about 539 kB minified).
- No push and no changes to the preserved Phaser stash.

## Completed camera task — 2026-09-14

The user authorized this task through a separate stable commit, without push,
stash changes, NPC behavior or dialogue. Baseline: `c68401c`.

- [x] Test then implement `src/engine/camera/CameraDirector.ts`: logical viewport,
  world bounds, exponential follow, focus on a point/target, smooth zoom, lock,
  and return to the remembered player. Validate finite input and cover zoom so
  even viewports larger than the world cannot reveal empty space.
- [x] Connect `attachWorldCamera.ts` to the existing ticker after movement and
  before render. Transform only the world; clean up on destruction. Keep framing
  (initial zoom 1.5, follow offset y=-160) in Journey data. Pixi'VN retains its
  1920x1080 logical canvas and contain resize policy. UI stays outside the world.
- [x] Browser-test horizontal/vertical/diagonal movement, world edges, resizing,
  scripted focus/zoom/lock/resume, and scene restart. Inspect screenshots.
- [x] Run `npm test`, `npm run build`, `npm run test:e2e`; review code, update this
  plan and commit the stable camera separately. Stop before NPC implementation.

- Scene setup exposes the mounted camera director for later scene code.
  `follow(provider, offset)` remembers the player; `focus(point | provider)` pans
  toward a fixed or moving target; `setZoom(value)` eases toward a covering zoom;
  `lock()` holds position and zoom without stopping gameplay; `resumeFollow()`
  returns to the player's current position and offset without snapping.
- `resumeFollow()` retains the requested zoom. Scene authors can call `setZoom`
  to restore their chosen framing. No automatic cinematic sequence is installed.
- The world, actor and movement coordinates stay unchanged by camera transforms.
  Only the world container's pivot, position and scale change. Titles/instructions
  stay fixed, while the walkable-area caption now belongs to the moving ground.
- Validation: `npm test` 37 passed; `npm run build` passed; `npm run test:e2e`
  7 passed. Unit tests cover 30/60/120 fps easing, monotonic settling, bounds,
  intermediate zoom coverage, invalid data, modes, update order and disposal.
  Chromium covers direction changes, four edges, focus/zoom/lock/resume, scene
  re-entry, fixed UI, viewport resizing and existing movement regressions.
- Inspected screenshots of start, horizontal/diagonal movement, world edges,
  800x600 viewport, scripted focus/zoom and return to Marlow.
- Playwright runs one browser worker: parallel software-rendered scenes caused
  traversal timeouts under load. The full suite passes serially with the same
  movement assertions and deadlines. No gameplay timing workaround was added.
- Reviewed implementation, integration and tests directly. The requested review
  subagent could not run because of its usage limit; no independent review is claimed.
- Limitations: axis-aligned world starting at (0,0), fixed logical viewport for
  the scene lifetime (browser resizing remains Pixi'VN's contain scaling), and
  exponential eased pans rather than timed cinematic timelines. Camera state is
  transient; save/restore remains a later task through Pixi'VN.
- Frame advances remain capped at 50 ms, matching movement's stall protection;
  very low frame rates slow the response instead of producing jumps.
- Existing main-bundle size warning remains (about 533 kB minified). Geometry,
  occlusion and labels remain provisional art, without new NPC or dialogue logic.
- No push; the previous Phaser stash remains unchanged.

## Completed movement task — 2026-09-13

- Stable deck checkpoint: commit `e9665d5` on `journey-vertical-slice`.
- WASD and arrow keys move Marlow at 240 logical units per second; diagonal
  input is normalized and opposing directions cancel. No physics library added.
- A 20-unit footprint around the feet stays in the authored walkable rectangle:
  player center x=420…1500 and y=680…840. This constrains the ground footprint,
  not the visual height of the placeholder or future illustrated sprite.
- `MovementController` is independent of Pixi, keyboard and novel-specific data.
  It exposes read-only movement state for later camera/animation integration.
  `setEnabled` is an explicit movement gate; narration does not pause the world.
- `keyboardMovement` listens on the focused game canvas, preserves text input,
  clears held keys on blur/visibility changes, and aborts listeners on disposal.
- `attachPlayerMovement` uses the existing Pixi'VN app ticker through its public
  API. App access is limited to this composition adapter; no new ticker/render
  loop, canvas, save, dialogue, or audio system is created.
- Destroying the player detaches its ticker callback and keyboard listeners.
  Re-entering the start label resets the player and does not retain held input.
- Frame advances are capped at 50 ms to avoid jumps after stalls. This deliberately
  slows movement below 20 fps; E2E allows 12 seconds for a full crossing under
  software rendering. Timing correctness is tested separately at 30/60/120 fps.
- Validation: `npm test` 27 passed; `npm run build` passed; `npm run test:e2e`
  5 passed. Browser coverage includes WASD/arrows, all four boundaries, key
  release, focus changes, text inputs and scene re-entry. Before/after movement
  and diagonal screenshots were visually inspected.
- Movement audit on 2026-09-14: live actor displacement confirms equal cardinal
  and diagonal speed for WASD and arrow input. All three movement modules and
  their scene integration are included in the movement checkpoint, together
  with unit/browser tests and this plan. Camera work remains pending.
- The existing bundle-size warning remains (main chunk about 530 kB minified).
- No camera behavior, NPC routines or save/restore behavior were implemented.
- The previous Phaser stash remains unchanged.

## Completed deck task — 2026-09-13

- Logical world: 1920×1080. Traversable rectangle: (400, 660), 1120×200.
- Anchors: player (650, 760), NPC (1300, 710), camera (960, 760).
- Generic `createWorldLayers` composes environment, ground, actors and foreground.
- Journey-specific scenery, labels and placeholder markers live in `src/story/`.
- The start label mounts the scene through `canvas.layers.add`; re-entry removes
  and destroys the previous transient scene. No parallel canvas or narrative runtime.
- Scenery is transient, not persistent world state. The future save/restore task
  must restore persistent gameplay data through Pixi'VN and reconstruct scenery
  as needed. No custom save format was added.
- Validation: 13 unit tests, TypeScript/Vite build, and 2 Chromium E2E tests passed.
  Browser coverage checks composition, anchor positions, repeated label entry,
  a single canvas, Pixi'VN errors, and fitting at 1366×768 and 800×600.
- Both viewport screenshots were visually reviewed. Geometry is explicitly temporary.
- In the Codex Windows sandbox, Playwright's server shutdown required permission
  to terminate its child process tree. The same E2E command completed normally
  outside the sandbox (2 passed, 7.5 seconds); no application workaround was added.
- Added package-lock.json for reproducible installation of the existing dependencies.
- Existing Vite warning remains: the main chunk exceeds 500 kB minified (about
  527 kB). This warning was already present in the foundation build.
- Previous unfinished Phaser work is preserved separately in the local stash
  `Preserve unfinished Phaser foundation before approved PixiVN migration`.

## Validation
Before working:

```bash
npm run agent:context
```

After code changes (typecheck, unit tests, build):

```bash
npm run agent:check
```

For gameplay, rendering or browser changes:

```bash
npm run agent:e2e
```

## Decisions
- Pixi'VN remains the narrative/state foundation.
- PixiJS is used for custom RPG/world behavior.
- Do not build a second dialogue/save/audio-state system.
- The first vertical slice must be completed before expanding to other books.
