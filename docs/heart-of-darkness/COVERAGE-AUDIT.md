# Heart of Darkness — coverage and production audit

Audit date: 2026-10-11. Runtime baseline:
`46e6ec2843947fac6f33bef5dfd5c40ec6e4ff81`, `journey-vertical-slice`.
This is a documentation audit, not a new episode, visual pass or engine change.

## Conclusion

The current route represents the upstream encounter through the final Thames
frame. It does **not** yet provide the novel's beginning or its earlier stations.
Completing the final scene therefore does not complete the adaptation.
Of the 21 deliberately unequal coverage rows below, 15 have bounded playable
episodes, one has partial coverage, and five have no playable episode.
These counts are an index, not a shipping percentage or an effort estimate.

Next bounded milestone: **the opening Nellie frame only**. Keep the current
Deck entry available, reuse the existing Nellie staging, and stop before the
commission, coastal journey or Outer Station. Those require later milestones.

## Evidence and method

Primary source: [Joseph Conrad, Heart of Darkness, Parts I–III](https://www.gutenberg.org/files/219/219-h/219-h.htm).
Part I opens on the anchored Nellie before Marlow recounts his appointment,
Company visit, coastal travel, Outer Station and Central Station. Part II
develops the upstream voyage, the crew, warning/book, fog and attack; Parts
II–III lead to the Russian, Kurtz, withdrawal, illness and European encounters.
The final paragraph returns to the Nellie. The rows follow those major events,
not every paragraph or the order of every retrospective passage.

Checked the application entry, scene dispatcher, story/content label and
checkpoint modules, corresponding episode documents and browser spec inventory.
Absence claims refer to this inspected story/content scope. No dependency,
build-output or general engine scan was needed. No new browser run or visual
inspection is claimed by this audit; existing release evidence is identified
separately below.

Status definitions:

- **Playable**: a bounded interactive representation with an existing route,
  state and test evidence. This does not mean exhaustive text coverage or final art.
- **Partial**: a related playable scene exists, but important content in the row
  remains absent or original connective content stands in for a literary episode.
- **Absent**: no playable episode found; later references do not count as a scene.

## Narrative matrix

Evidence paths in this table are relative to the repository root.

| ID | Novel event / coverage unit | Status | Runtime / validation evidence and boundary |
|---|---|---|---|
| N01 | Opening Nellie frame, Thames memories and Marlow beginning his tale | Absent | `src/content/labels/start.label.ts` starts the Deck; `src/content/storyEntries.ts` selects that label. `thamesConclusion.label.ts` is the ending, not this opening. |
| N02 | Appointment, predecessor Fresleven, aunt, Company office, black-wool knitters and doctor | Absent | No corresponding story episode/labels/checkpoint. The later aunt mention in `europeReturn.label.ts` is convalescence, not recruitment. |
| N03 | Coastal voyage, Outer Station, forced labour/dying workers and accountant's first account of Kurtz | Absent | No Outer Station episode. The existing `innerStation` is Kurtz's station much later. |
| N04 | Overland caravan, arrival at Central Station and sunken steamer | Absent | No Central Station arrival/salvage episode. The island breakdown is downstream and cannot substitute for this wreck. |
| N05 | Central Station manager/brickmaker, fire, missing rivets, repairs, Eldorado expedition and overheard ambitions | Absent | No corresponding episode. The approved Deck's fire stage is atmospheric art, not proof that the Central Station fire or politics are playable. |
| N06 | Upstream river journey and crew experience | Partial | `journeyConversation.label.ts`, `conversation.ts`, `journeyDeck.ts`; `deck.spec.ts`, `conversation.spec.ts`, `cargoInteraction.spec.ts`, `journeyArtProgress.spec.ts`. Original deckhand/tally dialogue is connective adaptation. The hungry African crew's restraint and fuller shipboard relationships are not separate playable scenes. |
| N07 | Abandoned hut, wood fuel, warning and seamanship book | Playable | `woodStop.label.ts` / `woodStopState.ts`; `woodStop.spec.ts`; [WOOD-STATION.md](WOOD-STATION.md). Fuel, book and wait/proceed response are spatial actions. |
| N08 | Fog, cries, difficult approach, attack, helmsman's death and whistle | Playable | `riverApproach.label.ts` / `approachState.ts`; `approach.spec.ts`, `approachVisual.spec.ts`; [FOG-APPROACH.md](FOG-APPROACH.md). Short navigation adaptation, not a general combat/damage system. |
| N09 | Docking at Inner Station and Russian trader's account/book | Playable | `innerStation.label.ts` / `innerStationState.ts`; `innerStation.spec.ts`, `innerStationVisual.spec.ts`; [INNER-STATION.md](INNER-STATION.md). Bounded shore exploration and conversation. |
| N10 | Kurtz's emergence, stretcher procession and first encounter | Playable | `kurtzIntroduction.label.ts` / `kurtzIntroductionState.ts`; `kurtz.spec.ts`, `kurtzVisual.spec.ts`; [KURTZ-INTRODUCTION.md](KURTZ-INTRODUCTION.md). Two bearers stand for a larger procession. |
| N11 | Ivory, stakes, report/postscript and Kurtz's coercive authority | Playable | `stationRevelations.label.ts` / `stationRevelationsState.ts`; `revelations.spec.ts`, `revelationsVisual.spec.ts`; [STATION-REVELATIONS.md](STATION-REVELATIONS.md). Report/stakes are reordered for juxtaposition; meeting traces are adaptation, not reconstructed ethnography. |
| N12 | Kurtz leaves at night; Marlow follows and brings him back | Playable | `kurtzNightEscape.label.ts` / `kurtzNightEscapeState.ts`; `nightEscape.spec.ts`, `nightEscapeVisual.spec.ts`; [KURTZ-NIGHT-ESCAPE.md](KURTZ-NIGHT-ESCAPE.md). Compact trail and supported return, not an open forest. |
| N13 | Deterioration and evacuation preparation | Playable | `kurtzEvacuation.label.ts` / `kurtzEvacuationState.ts`; `evacuation.spec.ts`, `evacuationVisual.spec.ts`; [KURTZ-EVACUATION.md](KURTZ-EVACUATION.md). Cargo/patient priority changes responses, not the canonical departure. |
| N14 | Leaving under pressure from the bank, woman, whistle and shots | Playable | `kurtzDeparture.label.ts` / `kurtzDepartureState.ts`; `departure.spec.ts`, `departureVisual.spec.ts`; [KURTZ-DEPARTURE.md](KURTZ-DEPARTURE.md). Optional warning/intervention does not erase violence or create combat. |
| N15 | Island breakdown, mechanical work and custody of papers/photograph | Playable | `kurtzBreakdown.label.ts` / `kurtzBreakdownState.ts`; `breakdown.spec.ts`, `breakdownVisual.spec.ts`; [KURTZ-BREAKDOWN.md](KURTZ-BREAKDOWN.md). This is the later island repair, distinct from N04/N05. |
| N16 | Kurtz's last evening, judgment and death announcement | Playable | `kurtzFinalNight.label.ts` / `kurtzFinalNightState.ts`; `finalNight.spec.ts`, `finalNightVisual.spec.ts`; [KURTZ-FINAL-NIGHT.md](KURTZ-FINAL-NIGHT.md). Candle/vigil choices retain the canonical final words and death. |
| N17 | Burial news and Marlow's illness / moral reckoning | Playable | `kurtzAftermath.label.ts` / `kurtzAftermathState.ts`; `aftermath.spec.ts`, `aftermathVisual.spec.ts`; [KURTZ-AFTERMATH.md](KURTZ-AFTERMATH.md). Burial is heard; no illustrated grave or playable medical simulation. |
| N18 | Convalescent European return and Company demand for papers | Playable | `europeReturn.label.ts` / `europeReturnState.ts`; `europe.spec.ts`, `europeVisual.spec.ts`; [EUROPE-RETURN.md](EUROPE-RETURN.md). Preparing/handing the report preserves the rejected claim and removed postscript. |
| N19 | Cousin and journalist; divided claims to Kurtz's legacy | Playable | `kurtzLegacy.label.ts` / `kurtzLegacyState.ts`; `legacy.spec.ts`, `legacyVisual.spec.ts`; [KURTZ-LEGACY.md](KURTZ-LEGACY.md). Spatial handoffs and different memories, visitors offscreen. |
| N20 | Intended, last words request and Marlow's lie | Playable | `kurtzIntended.label.ts` / `kurtzIntendedState.ts`; `intended.spec.ts`, `intendedVisual.spec.ts`; [KURTZ-INTENDED.md](KURTZ-INTENDED.md). Witness/listen changes the exchange, not the canonical lie. |
| N21 | Closing Nellie frame, Director's ebb line and dark horizon | Playable | `thamesConclusion.label.ts` / `thamesConclusionState.ts`; `thames.spec.ts`, `thamesVisual.spec.ts`; [THAMES-CONCLUSION.md](THAMES-CONCLUSION.md). Optional mooring observation changes a line; final image is shared. |

## Current playable chain and remaining discontinuity

Normal `/` and `/?story=journey` select `start` and the Deck. The content route is:
Deck conversation → hut/fuel → helm/fog/attack → docking/Russian → Kurtz entrance
→ revelations → night pursuit → evacuation → departure → island repair/papers
→ final night → aftermath → Europe/Company → cousin/journalist → Intended →
closing Nellie frame. Individual continuations are explicit spatial interactions;
there is no newly implemented opening, recruitment or early station hidden in
the dispatcher. `showJourneySpace()` and `showInnerStation()` reconstruct the
current bounded episode from Pixi'VN state after restoration.

The late route is connected, but its initial context is still in medias res.
Canonical narration and original connective material must remain distinguished.
The African crew and people affected by extraction should not be reduced to
background threat: N03/N05/N06 need deliberate content treatment, with no combat
reward, forced rescue quest or invented speech presented as Conrad's text.
This is a content gap, not a reason to retrofit new engine infrastructure.

## Production debt, separate from narrative coverage

| Area | Verified state / remaining work | Boundary |
|---|---|---|
| Approved Journey Deck | Four stages, depth, fog/smoke/embers/reflections/shadows and walking are approved/frozen. | Preserve tag `journey-deck-visual-approved-2026-10-02`; do not open another art/performance pass. |
| European room and legacy | Playable graphic theatre, abstract paper props and offscreen visitors. [europe-return-room brief](../art-briefs/europe-return-room.md). | Finished illustration, official/cousin/journalist representation and convalescent gait are not claimed complete. |
| Intended | Playable salon; Intended speaks from the wing; sitting is narrated. [drawing-room brief](../art-briefs/intended-drawing-room.md). | Needs final compatible room/actor art, not random replacement imagery. |
| Closing Nellie | Graphic theatre; flat cloud/deck shapes, existing Marlow gait and offscreen listeners. [Nellie brief](../art-briefs/thames-nellie-frame.md). | Does not yet equal the illustrated Deck/Metamorphosis benchmark; no approved meditation pose. Reuse staging for the opening, not a second general art pass. |
| Other episode staging | Short shore, trail, ship and navigation adaptations; small figures, bounded strips and existing atlas poses. | Capture readability is evidence, not proof of exhaustive illustration, obstacle navigation or crowd simulation. Consult each linked episode's limits before expansion. |
| Audio | Generic zones/mixing through Pixi'VN, project-authored provisional loops/cues; deterministic source/volume/cleanup tests. | Human listening/balance and definitive authored sound remain pending; neither blocks content work. [AUDIO_DESIGN.md](../AUDIO_DESIGN.md) contains design ambitions, not evidence that every listed audio feature is implemented. |
| Performance | Software-renderer diagnostics exist; physical-GPU evaluation remains pending. Last validated shared chunk was 463.99 kB, with no >500 kB warning. | Do not trade frozen art for SwiftShader FPS or restart engine/bundle optimization. Hardware measurement is separate. |
| Save/restore | Pixi'VN export/restore, real positions, phase/flags, choices, active labels and scene/audio cleanup have browser coverage. | No player-facing Save/Load menu or release-level storage/UX claim. Do not add a parallel persistence manager. |
| Delivery/UX | Browser build and two target resolutions validated; current work selector preserved. | End/credits UX, accessibility/settings and a complete chronological entry require later explicit scope. No unmeasured cross-device/shipping claim. |
| Whole project | Reusable framework plus Heart episodes and a Metamorphosis proof slice. | Full Metamorphosis, Frankenstein and indefinite future works are not completed or a usable project-percentage denominator. |

## Historical estimates

The 20%/45% in `WOOD-STATION.md`, 30%/49% in `FOG-APPROACH.md` and 40%/53%
in `INNER-STATION.md` describe those earlier releases. They are not current
completion numbers. Their ten unequal narrative blocks also merge several
independent early events and several late episodes; multiplying those numbers
by today's test count would be meaningless. Historical "next"/"not implemented
here" text in bounded episode records remains valid for that release.

Use this matrix for current missing content and the active plan for the next task.
Do not publish a whole-book or whole-project percentage until scope, acceptance
criteria and weighting for content/art/audio/delivery have been explicitly fixed.

## Next bounded milestone — opening Nellie frame

Purpose: establish who is telling the story, who listens and why the Thames is
part of its darkness before entering the existing mid-voyage slice.

Acceptance criteria for the **next implementation**, not features of this audit:

1. Explicit optional access to the prologue through content-level entry selection,
   e.g. `/?story=journey&episode=prologue`. Keep `/`, `/?story=journey` and the
   Metamorphosis entry behaving as they do now. Avoid a new menu or default-entry
   migration while N02–N05 are still absent.
2. Reuse the existing Nellie graphic-theatre composition, approved Marlow atlas,
   movement/camera/interaction/audio and dialogue view. No change to engine,
   approved Deck assets/composition or final-frame behavior; no new random art.
3. Offer brief spatial exploration of river/anchorage and an E interaction that
   begins Marlow's tale. Establish the anchored yacht and listeners, and adapt
   the opening remark about the Thames having also been a dark place. Do not
   turn the Roman comparison into combat, a separate historical scene or trivia.
4. One optional observation records a flag and alters one later opening line.
   Pixi'VN owns labels and narrative state; checkpoint position/prologue phase
   remain separate from the closing frame. No invented alternate historical ending.
5. A deliberate continuation returns to the existing playable Deck. Document this
   as an ellipsis past the still-missing commission/early stations, not a claim
   that they have been implemented. The opening must not unlock or replay the ending.
6. Add state and browser coverage for prerequisite/order, observe/ignore,
   real E/proximity, exact position/phase, active-label save/restore, earlier
   restore, restart, no duplicate UI/audio, existing default start and both works.
7. Capture and inspect 1366×768 and 800×600; run `agent:check` and full
   `agent:e2e`, update the active plan, commit/push only after all pass, then stop.

Out of scope: N02–N05, fuller crew episode, general art/audio production,
save menu, accessibility/settings implementation, engine refactor or SwiftShader
optimization. The audit does not implement this prologue or its access URL.

## Validation provenance

Latest runtime release evidence, **not a new run by this documentation audit**:
`46e6ec2` passed TypeScript, 203/203 units in 43 files, build 2.63s and
121/121 E2E in 47 spec files (47.0m). The total 324 tests includes both works
and neutral/generic fixtures; it is not 324 literary events or a coverage score.
The last frame's 20 individually reviewed captures remain at
[thames-conclusion-qa/README.md](thames-conclusion-qa/README.md).

Audit validation passed: all 20 local Markdown links and 88 referenced evidence
filenames exist; matrix counts match 15 playable / 1 partial / 5 absent.
`agent:context` selects the opening-frame implementation as the next unchecked
task. Fresh `agent:check`: exit 0; TypeScript, 203/203 units in 43 files and
build 3.69s. No E2E rerun was necessary for documentation-only changes; the
runtime and tests are unchanged from the release evidence above.
Git scope contains only this audit, active plan, README and three historical
document notices. No gameplay, visual, audio, engine, asset or test file changed.
Preserve the Phaser stash
`2017ff54dc07535fce1ca9c09dc49a912cf78d06` and original untracked files.
