# Kurtz's last evening — playable episode

## Route

Finish the repair episode's resumed-voyage exchange. At the helm beside the
caseta, **E · Continuar hasta la última noche** opens this optional episode.
WASD/arrows remain available throughout; waiting never selects a response or
announces a death.

1. Near the caseta, **E · Tomar una vela** lights a small carried candle.
2. Approach the right-hand end of Kurtz's cot. **E · Acercar la vela a Kurtz**
   sets it on a narrow bedside stand. He says he is waiting for death despite
   the light. The next line remembers the earlier papers/photograph response.
3. **1** tries to reassure him; **2** stays and listens without promising.
   Each produces its own exchange and stores an immutable response.
4. Close that exchange, then **E · Quedarte a escuchar**. His existing intense
   expression and the warm bedside light accompany the same final words on
   both paths: **¡El horror! ¡El horror!** Neither choice prevents his death.
5. Close the final-words exchange, then **E · Apagar la vela y salir a cubierta**.
   Kurtz is now offscreen inside the caseta; the patient illustration is hidden
   rather than pretending an existing living pose is a new death illustration.
6. Walk to the crew area on the right. **E · Acercarte a la tripulación** begins
   Marlow's reaction; the following line reports a boy's announcement of the
   death. That announcement is the saved confirmation, not a ticker timer.
7. The closing response remembers custody of the sealed packet or the photograph.
   A later crew interaction offers a brief reflection. The episode stops here.

Optional **E · Mirar las orillas que se alejan** remains at the railing on the
right, with a changed observation after the announcement. The river, bank,
walking and the independently routined deckhand stay live during reading.

World anchors: entry (780,750), candle (870,730), bedside interaction (780,800),
crew (1190,800), river observation (1440,700). The cot retains its existing
staging at (650,730). The bedside candle's foot sits at (705,660) on a stand
grounded at (705,730); a carried candle follows Marlow with an offset (45,-88).

## Literary basis and adaptation

[Conrad, Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm)
describes Marlow bringing a candle, Kurtz speaking about waiting in darkness,
his final whispered judgment, Marlow extinguishing the light and leaving, and
a boy announcing the death while the company eats. The text remains original
Spanish adaptation, except the familiar final exclamation translated here.

The reassurance/listening choice, candle collection/stand, crew approach on the
existing deck and optional bank observation are game staging. The novel does
not offer that choice, and neither response claims to redeem Kurtz or explain
conclusively what his judgment means. Entry after the completed playable repair
is pacing/composition compression; the novel narrates the evening within the
same downstream breakdown sequence. No new pilot-house or mess-room interior
is represented. The dinner and messenger are heard in narration, not newly
illustrated actors. Burial, Marlow's illness and Europe remain unimplemented.

## State and save/restore

Pixi'VN storage owns **`journey.kurtzFinalNight`**:

- `phase`: inactive / evening / vigil / words / left / confirmed.
- `distance`: canonical unwrapped downstream travel, seeded from the repair
  episode on entry. Scenic bank layers read a projection of this value.
- `progress`: gradual night-art progression, bounded from .48 to .78. It never
  triggers the fire variant or narrative events.
- `candle`: rack / held / bedside / out.
- `response`: reassure / listen, immutable after selection.
- `vigilSeen`: the full response exchange closed.
- `wordsHeard`: the actual final-word line executed.
- `wordsSeen`: that exchange closed, enabling extinguishing/departure.
- `finalSeen`: the full announcement exchange closed.

Death confirmation is the `confirmed` phase, not a duplicated independent flag.
**`journey.finalNightPosition`** contains Marlow's real bounded world coordinates.
Existing `createPixiStorageCheckpoint` validates the sequence. No inventory,
parallel state/save format, menu or external playback manager was added.

Use `Game.exportGameState()` and `Game.restoreGameState()`, followed by the
existing `showJourneySpace()` composition. Saves restore held light, bedside
choice, actual spoken words, extinguished light, announcement and completed
episode. Construction reconstructs visual state without reissuing labels.
The existing dispatch selects this episode only when its canonical phase is
active; restoring before entry returns to the repair episode.

The ticker owns only travel and smooth darkness, caps elapsed updates at 50ms
and skips story updates when the document is hidden. Bank layout is seeded at
creation through existing parallax checkpoints. Water/fog are transient visual
motion; their precise animation instant is not a saved playback timeline.

## Composition, boundaries and lifecycle

`createKurtzFinalNight` composes the existing boat/cot factory, removes the old
repair/papers props from this instance and adds a small procedural candle and
stand. Existing atlas poses supply weakness, cough and the final intense gaze.
The candle draws ahead of its bearer while held; the stand and cot use grounded
depth. The patient remains separate from Marlow's interaction anchor.

New state/labels/scene hooks are in content; configuration/staging are in story.
`src/engine/`, approved Deck sources/assets, Metamorphosis, existing audio files,
the Phaser stash and original untracked files remain unchanged. The approved
four-stage Deck presentation is not modified by this new nighttime instance.

Existing attachments own keys, ticker listeners, overlay and audio cleanup.
The scene removes its update callback and releases its one fog texture on
destruction. Stable `journey-kurtz-final-night` audio channels reconcile after
restore; no duplicate sources or per-frame textures/timers are created.

The cot is staged at the caseta threshold, not in a new room. There is no new
death pose, messenger figure, recorded final voice or eating animation. The
small candle/stand are technical prop art; specific future requirements are
documented in `docs/art-briefs/kurtz-final-night-candle.md`. These limitations
do not block the current spatial route. Human audio listening remains separate.

## Validation

Eight unit cases cover prerequisites, action sequence, both responses, no replay,
partial state restoration, invalid saves and bounded progress without automatic
events. Browser cases cover real E/1/2 and walking, saved coordinates/progress,
held-light movement, active choice/final-word restoration, prior papers memory,
death confirmation, source/entity cleanup and return to the earlier episode.

Final `agent:check`: exit 0; TypeScript, 168/168 unit tests in 38 files and build
in 3.58s. Final full `agent:e2e`: exit 0; 101/101 tests in 37 files passed in
35.8 minutes, including all 97 unchanged preexisting cases. Focused final E2E:
4/4 in 2.8 minutes. Total automated coverage: 269 tests.

24 corrected captures (twelve moments × two sizes) were individually reviewed
and retained in `docs/heart-of-darkness/kurtz-final-night-qa/README.md`.
The first approach/candle placement was rejected and revised before the final
gate. No earlier test was weakened or replaced. The active plan records the
completed scope, remaining limits and the subsequent aftermath milestone.
