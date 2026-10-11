# The cousin and journalist — competing memories

## Playable route

Complete the Company's refusal in the European room and close that exchange.
At the door on the right, **E · Recibir al primo de Kurtz** starts this bounded
episode. The previous observation at the private letters remains available
before entry. No visit begins through elapsed time or from across the room.

1. The arrival establishes that two days have passed. At the door, press E to
   ask the cousin about Kurtz. He remembers a great musician and asks about
   his final moments.
2. **1** acknowledges Kurtz's talents without pretending to have heard his
   music. **2** answers as a witness to his final days. The cousin reacts
   differently. Close the exchange before collecting documents.
3. Go to the **centre of the desk** for the family letters/memoranda (E),
   then return to the door to hand them over (E). Their small paper group
   leaves the table; the private letters/portrait remain at its right.
4. After closing that handoff, a later journalist visit becomes available at
   the door. He sees a popular political orator. Marlow's first reflection
   remembers the original private/commercial reply to the Company, read from
   that checkpoint rather than copied into new state.
5. **1** asks which party: any party, the journalist says. **2** discusses
   what brought Kurtz there. Both show the visitor's enthusiasm for his
   rhetoric, with different replies. Movement stays live during choices.
6. Close the exchange, collect the prepared report on the **left of the
   desk** (E), and carry it to the door (E). The journalist takes it for
   possible publication. The report leaves the scene; its postscript never
   returns.
7. Examine the remaining private packet at the **right of the desk** (E).
   The reflection remembers both choices. Marlow intends to return the
   letters/portrait personally, but this release stops before the Intended.
   An optional repeat of the reflection remains available.

The walk between documents and visitors is the mechanic. There is no inventory,
document menu, time simulation, automatic handoff or alternative recipient for
the Intended's packet. A key pressed at the wrong location cannot skip a stage.

## Literary source and adaptation

[Conrad, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm) places the
cousin two days after the Company visitor. He considers Kurtz a great musician
and takes family letters and insignificant memoranda. The journalist recalls
his powerful political speech, declares him suited to any extreme party,
and takes the report for publication if he sees fit. Marlow retains a slim
packet of letters and the girl's portrait.

The Spanish dialogue is newly written. The desk stations, pauses controlled
by E, two pairs of responses and accumulated closing reflection are playable
adaptations. The motive response condenses Marlow's later recollection of
Kurtz's impatience with poverty and acquisitiveness; Conrad does not give this
exact answer in the journalist exchange. Both paths preserve the recipients
and final custody. Neither visitor's admiration is presented as a definitive
truth about Kurtz. The report remains compromised even without its postscript.

No Intended dialogue, house visit, final lie or framing Thames conclusion is
implemented by this episode.

## Composition and architecture

`createKurtzLegacy()` composes the existing `createEuropeReturn()` room. No
background, actor atlas, source crop, engine file or approved Deck art is edited.
One story-local ink paper group distinguishes the family letters from the
remaining packet; real Pixi text labels its station. The same grounded Marlow,
paper crop, window light, floor, closed door and foreground are retained.
The door shade is lighter for the cousin, heavier for the journalist, and gone
after both visitors leave. Family papers/report disappear when carried or given.
Visitors are heard through dialogue, not illustrated with invented cut-outs.

Existing movement, camera, display sizing, spatial interactions, editorial
dialogue UI and audio attachments are reused. `showInnerStation()` dispatches
this episode before the previous European return only when its checkpoint is
active. Entry is a single additional action in that previous scene. No new
general-purpose abstraction, save manager, scene system or UI is introduced.

The room remains restrained graphic theatre. Its future illustration brief
`docs/art-briefs/europe-return-room.md` still applies; there is no new art pass or
claim that its detail equals the approved Deck. Family notes are abstract papers,
not legible historical documents. No new portrait, visitor sprite or voice is
fabricated. The neutral room loop remains provisional and reuses the existing
project-authored CC0 loop under an episode-owned channel namespace.

## Canonical state and restoration

Pixi'VN storage via the existing checkpoint adapter owns `journey.kurtzLegacy`:

- `phase`: inactive / cousin / cousinAnswered / familyReady / familyCarrying /
  journalist / journalistAnswered / reportReady / reportCarrying / remaining /
  complete.
- `cousinResponse`: music / witness, immutable after selection.
- `journalistResponse`: party / motive, immutable after selection.

Phase represents the visit, closed reply, carried documents and final
observation. There are no duplicate arrival, handoff or completion flags.
Impossible combinations are rejected. Previous Europe state remains intact;
positions continue using its exact bounded `journey.europePosition` because
this is the same room. No redundant position checkpoint is introduced.

`Game.exportGameState()` and `Game.restoreGameState()` preserve the checkpoint,
coordinates and Pixi'VN's open parent/child labels and options. Reconstruction
sets paper visibility and door shade immediately, without calling a label,
replaying arrivals or delivering anything. Restoring a selected but unclosed
reply keeps its decision and finishes the same exchange; restoring a handoff
finishes it once. Restoring an earlier Europe save returns to that episode.

The existing attachments remove input listeners, view, movement and sound
sources when the owner is destroyed. The episode removes its presentation
ticker callback. Stable `journey-kurtz-legacy:room` reconciles the room source;
old Europe sources stop. Audio time is not serialized. Restart uses the
existing game lifecycle to clear all story checkpoints.

## Validation

Eight new unit cases cover prerequisites, both immutable response pairs,
required exchange closure and physical collection, single handoffs, exact
partial checkpoints and invalid saved sequences.

New browser cases cover both response routes with real E/1/2, proximity,
movement during options, previous Company memory, changed closing lines,
actual coordinates, pending options, selected replies, both carried/handoff
documents, final custody, repeated restores, entity/view/source deduplication,
earlier European return and restart. Previous browser tests are unchanged.

Final agent:check: exit 0; TypeScript, 192/192 units in 41 files and build
(2.69s). Focused browser gate: 4/4 in 2.3m. Final full agent:e2e: exit 0;
113/113 cases in 43 spec files passed in 44.4m. All 109 preexisting browser
cases remain unchanged and pass. Total coverage: 305 tests.

28 final screenshots (fourteen moments × both sizes) were dimension-checked
and individually inspected. No clipped text/options, offscreen control or
unintended actor crop was found; props and pressure match custody after restore.
Evidence: [kurtz-legacy-qa/README.md](kurtz-legacy-qa/README.md).

The first focused proximity case pressed E before the helper's checkpoint
position reached the actual actor. The helper now waits for actual coordinates;
no production range, guard or old test was weakened. All four focused cases
passed on rerun. Existing audio-unlock/navigation warnings remain nonfatal;
no new Pixi'VN error was detected. Final validation: 2026-10-11,
America/Guayaquil. Engine, approved Deck, Metamorphosis, original assets,
Phaser stash and preexisting untracked files remain untouched.
