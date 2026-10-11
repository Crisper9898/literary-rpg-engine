# Return to the Thames

Base: `40f89b37a38f456e713e34604d51b51b4276bbb4`, `journey-vertical-slice`.
Bounded final frame after the completed visit to the Intended. This episode
does not redesign the approved steamer, modify the engine or fill earlier gaps.

## Source and adaptation

[Conrad, Heart of Darkness, final paragraph of Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm):
Marlow stops speaking and sits apart in silence. Nobody moves for a time.
The Director notices the beginning of the ebb has been lost. The unnamed
narrator looks up at a cloud-barred offing and a sombre waterway beneath an
overcast sky. The book ends with the river seeming to lead into immense darkness.

This is the **Nellie on the Thames**, where Marlow tells his story, not another
upstream stop or the Congo steamer. Spanish lines are a concise original
adaptation. Walking between a mooring, the Director's offscreen position and
the rail is interactive staging of attention, not a claim that Conrad wrote
those movements. The optional mooring observation changes the first horizon
line; both paths preserve the same final image. No alternative ending, invented
journey after the frame, educational question or new narrative choice is added.
The previous witness/listen choice changes Marlow's last reflection directly
from the Intended's checkpoint; there is no copied flag.

## Play route

1. Complete the Intended's last-words sequence and farewell. At the salon's
   **three windows**, E now offers **Regresar al relato en el Támesis**. The
   original door memory remains available; entry is explicit and happens once.
2. E advances the framing entry and Marlow's reflection. Move with WASD/arrows.
3. Optionally inspect the **mooring at left** with E. It records an observation,
   not an item or a prerequisite.
4. Go to the **right-hand listening position** and E listens to the Director.
   Advance from the silence to his reflujo line, then close it.
5. Go to the **center of the far rail** and E lifts the narrator's gaze. The
   first line remembers the mooring if inspected; the next preserves the final
   river/darkness image. Closing it completes the frame.
6. The water and movement remain live. E at the rail offers a repeatable closing
   reflection without replaying entry or the Director. No credits/menu is added.

## Pixi'VN state and restoration

| Checkpoint | Serialized data |
|---|---|
| `journey.thamesConclusion` | `phase`: inactive / returned / ebb / complete; `mooringObserved`: boolean |
| `journey.thamesPosition` | Real actor x/y, bounded to x 380–1540 and y 730–870 |
| Existing `journey.kurtzIntended` | Retained previous approach and completed visit; read directly |
| Pixi'VN narration | Current labels, steps and dialogue; no custom dialogue save |

Entry requires the completed Intended. Phase advances only when the respective
Director or final dialogue closes. Saving during entry, silence, the Director's
line, the horizon or the last line therefore resumes that actual Pixi'VN step.
`Game.exportGameState()` and `Game.restoreGameState()` remain authoritative.
The existing `showJourneySpace()` dispatcher reconstructs the frame from storage;
scene creation never calls entry. An earlier save removes the Thames and restores
the salon. Restart clears the frame through the existing Game lifecycle.

Moving water phase is ephemeral, decorative motion; its exact ripple position
does not need to be serialized. Narrative phase, observation, actor coordinates
and active text do. The veil is derived from narrative phase, never elapsed time.

## Composition and lifecycle

All Nellie geometry, palette, positions and water audio configuration are in
`src/story/heart-of-darkness/`. This uses a small separate graphic-theatre stage:
cloud bank/background, moving water, yacht deck/rail, mooring, grounded approved
Marlow sprite, foreground mast/rigging. The Director and other listeners remain
outside the frame; no incompatible actor or randomly generated PNG is inserted.
`docs/art-briefs/thames-nellie-frame.md` records the missing finished illustration.
This stage is playable, **not claimed to equal the approved illustrated Deck**.

Existing movement, six-frame gait, camera, parallax pooling, spatial interaction,
conversation view and Pixi'VN spatial audio adapter are reused. Sources use the
`journey-thames` namespace with only the existing project-authored water loop;
no engine/shore sounds, new audio files or parallel playback manager.
Destruction removes owner-bound tickers/listeners/UI and stops sources, including
late loads. Reconstruction reuses stable aliases without duplicate playback.
Geometry is constructed on scene creation, not every frame. Narrative shading
uses existing Graphics alpha and introduces no filters or frame-created textures.

## Verification

Five unit cases cover entry prerequisite, one-shot entry, ordered mandatory
steps, optional observation, earlier checkpoints, fractional coordinates and
malformed saves. Browser tests cover both observe/ignore paths, both prior
approaches, actual E/proximity, live movement while reading, exact actor position,
partial dialogue restore, earlier restore, restart and media/UI deduplication.
The visual case captures ten moments at 1366×768 and 800×600, checks actual
canvas resize and UI bounds/overflow.

Final agent:check: exit 0; TypeScript, 203/203 unit tests in 43 files, build
2.63s. Focused agent:e2e: 4/4 in 2.0m. Full agent:e2e: exit 0; 121/121 in
47.0m, including all 117 unchanged previous browser cases. Total: 324 tests.
All 20 dimension-checked images were individually inspected at both sizes;
no text overflow or unintended crop. Retained evidence:
`docs/heart-of-darkness/thames-conclusion-qa/README.md`.
All 12 source/test files remained hash-identical during the full gates.
Engine, approved Deck, Metamorphosis, runtime assets, original untracked files
and the Phaser stash remained untouched. Existing suspended-audio and navigation
warnings were nonfatal; no new bridge errors were observed in the new cases.

## Remaining scope

The final framing event is represented; this does **not** mean the whole novel
or project is complete. The opening Thames frame, commission/departure and
earlier station episodes still require a separate coverage review. Existing
later episodes also retain documented illustration/audio evaluation debt.
No arbitrary book/project completion percentage is assigned without that review.
Do not start another episode or general art pass from this task automatically.
