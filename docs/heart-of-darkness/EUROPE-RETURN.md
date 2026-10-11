# European return — the Company and Kurtz's papers

## Playable route

After completing **Volver a mirar la corriente** in the aftermath, close that
exchange and walk left to the caseta. **E · Regresar a Europa con los papeles**
enters the new episode. The previous river observation remains available.

1. Marlow returns convalescent; the second line remembers accepting the sailor's
   help or managing alone. Movement remains live throughout dialogue/options.
2. Optionally inspect the window at the left. This records the discomfort of
   returning to ordinary city life and alters the official's first line.
3. Open the packet on the left side of the desk. The text remembers keeping it
   sealed or previously seeing the photograph, directly from the earlier state.
4. Examine the report on the left and distinguish the private letters on the
   right, in either order. Both are required before preparing the report.
5. At the report, separate its violent postscript. Its small paper strip leaves
   the table. A visitor's shadow now falls from the door at the right.
6. At the door, answer the Company official. **1** defends the private letters;
   **2** disputes the papers' commercial relevance. The official answers with
   proprietary entitlement or an appeal to science, respectively.
7. Close the exchange, return to the desk and collect only the report. It leaves
   the desk, while the letters remain. Walk back to the door and offer it.
8. The official rejects the offer and threatens legal action. The remembered
   response changes Marlow's final line. After closing, the shadow leaves and
   the report returns to the table. Letters/photograph remain under his care.
9. A final optional observation remains at the letters. No cousin, journalist
   or Intended encounter begins automatically.

There is no inventory, drag/drop puzzle, new save UI or alternate survival.
The spatial document route is the playable adaptation; standing still never
opens a packet, removes a postscript, chooses a reply or completes the conflict.

## Literary basis and limits

[Conrad, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm) describes
Marlow's return to the sepulchral city, lingering illness, his aunt's care, the
Company visitor's claim, and the offer of the report with its postscript torn
away. Private letters are withheld; the visitor departs threatening proceedings.
The cousin and journalist, then the Intended, follow later.

Spanish dialogue is newly written. The distinct document stations, timed visit
after preparation, two ways to refuse, visitor left offscreen, and report left
on the table are staging/adaptation choices. No claim is made that Conrad
specifies this room arrangement, a literal torn strip on this table or these
player-controlled movements. Removing the postscript is canonical on both
paths, not a redemption or a claim that the report's ideology is harmless.

The room is a graphic theatrical staging using existing approved Marlow/report
art, restrained ink geometry, window light, floor depth and contact shadows.
It does not purport to be an illustration of Brussels. There is no new official
atlas, aunt/crowd, portrait detail, voice recording or convalescent gait. A precise
future background brief is `docs/art-briefs/europe-return-room.md`; this does not
block the working narrative route. No Deck or Metamorphosis art is changed.

## State, save/restore and lifecycle

Existing `createPixiStorageCheckpoint` stores `journey.europeReturn` in Pixi'VN:

- `phase`: inactive / returned / sorted / prepared / challenged / carrying /
  offered / resolved. Phase represents packet opening, preparation, report
  custody and completion; no duplicate postscript/visit/completion flags.
- `streetObserved`: optional window observation and its later line.
- `reportRead`, `lettersRead`: examinations required for preparation.
- `response`: immutable private / commerce, only set by the Pixi'VN choice.
- `exchangeSeen`: selected exchange fully closed, required to collect report.

Actual Marlow coordinates use `journey.europePosition`, x360–1580/y700–870.
Existing care and sealed/ask choices are read from their original checkpoints.
Pixi'VN owns open labels/options and canonical `Game.exportGameState()` and
`Game.restoreGameState()`. `showJourneySpace()` dispatch reconstructs Europe
before earlier episodes. Construction never starts a dialogue or choice.
Restoring earlier aftermath returns to its original route; restarting clears
the checkpoints through the existing game lifecycle.

Phase initializes props and visitor shade immediately after restore. No new
clock, health system, engine infrastructure, alternate save format, generated
PNG, runtime asset or per-frame texture allocation. Existing movement/camera,
interaction binding, display sizing and audio attachments own their cleanup;
the scene removes its own small presentation update. The room uses a new stable
Pixi'VN channel alias for the existing project-authored neutral room tone;
the previous boat sources stop when its scene is destroyed. Source/license:
[project-authored CC0 room tone](../../public/assets/audio/metamorphosis/README.md).
The alias is owned by this episode; no Metamorphosis state/configuration is imported.
No river/engine
ambience is carried into Europe. Exact audio playback time is not serialized.

## Validation

Eight state tests cover prerequisite, ordered examinations, both choices,
partial exchange restore, earlier restore, invalid saves and exact bounds.
Browser cases exercise real E/1/2, movement during choices, prior memories,
spatial gates, optional-window branch, exact coordinates/state, open options,
selected reply, held/offered report, repeated restore, source/entity/overlay
deduplication, earlier aftermath and restart. Previous tests remain unchanged.

Final `agent:check`: exit 0; TypeScript, 184/184 units in 40 files and build
in 2.70s passed. Final full `agent:e2e`: exit 0; 109/109 cases in 41 spec files
passed in 43.4 minutes. All 105 preexisting browser cases remain unchanged and
pass. Final focused gate: 4/4 in 2.3 minutes. Total coverage: 293 tests.

28 final PNGs (fourteen moments × both sizes) were dimension-checked and
individually reviewed, including both choices, conditional responses and held
report restore. Text/options/controls fit without overflow; feet and contact
shade stay on the floor. Source report crate/grass was rejected in the first
review and removed only from this episode's crop. Review and links:
[europe-return-qa/README.md](europe-return-qa/README.md).

The first focused gate exposed a test helper using the new room's far point
on the previous boat. It was corrected to the previous boat's valid point;
no runtime bounds or old tests were changed. Existing audio-unlock/navigation
warnings are nonfatal; no new Pixi'VN error was detected. Human listening and
the future room illustration remain separate. Engine, approved Deck, original
assets, Metamorphosis, Phaser stash and preexisting untracked files are untouched.
