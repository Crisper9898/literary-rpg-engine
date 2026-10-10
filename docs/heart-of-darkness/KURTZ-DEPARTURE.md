# Kurtz — departure from the Inner Station

## Playable boundary and source

This episode starts only after the completed evacuation exchange and ends with
the steamer's short turn away from the station. Kurtz is still alive. The return
voyage, breakdown, packet of papers, final words, death and European epilogue are
not represented here.

The departure at noon, Kurtz watching through the pilot-house opening, people
on the bank, the woman holding her arms out, Marlow's whistle, armed company
men and subsequent shots come from Conrad's Part III.
[Primary text: Project Gutenberg](https://www.gutenberg.org/files/219/219-h/219-h.htm).
All Spanish dialogue is an original concise adaptation, not a literal edition.

Conrad does not give a player choice. The optional intervention before the
whistle is our adaptation: it delays the action and requires crossing the deck.
It does not guarantee safety or erase the subsequent violence. There is no
combat, shooting input, score, inventory or morality meter.

## Route

1. After receiving Kurtz and closing the previous exchange, walk farther left
   along the landing (world point 420,745). Press **E** to board.
2. Kurtz is near the caseta on the left (650,760); **E** optionally checks him.
   Marlow remembers whether the patient or the ivory crossed first.
3. At the right-hand end (1440,790), **E** releases the mooring. People appear
   on the bank and the company men prepare their rifles. This spatial action
   happens once; time alone cannot trigger it.
4. Near the rear rail (1120,705), **E** optionally listens to the bank. The
   woman and Kurtz's reaction are described without assigning her an invented
   name, translated speech or supernatural identity.
5. At the whistle beside the caseta (530,740), **E** offers two choices:
   **1** pull it immediately; **2** intervene first before the armed men.
6. Choice 2 requires **E** at 1040,800, then returning to the whistle and **E**.
   The first choice already pulls the whistle. Both then require **E** at the
   helm/engine signal point (780,750) to begin the turn.
7. Walk/read while the bank visibly recedes. The closing exchange remembers
   whether Marlow intervened. It runs once, then leaves the vessel at the end
   of this short manoeuvre without starting the next chapter.

Movement: **WASD/arrows**; conversation: **E**; choices: **1/2** or existing
buttons. No new controls or panels. Existing room/Deck entry remains intact.

## Composition and ownership

`src/story/heart-of-darkness/kurtzDeparture.ts` owns anchors and ambience.
`createKurtzDeparture.ts` composes existing plates/cast; the approved Deck
factory, manifest, four-stage art and walking frames remain unchanged.
`src/content/labels/kurtzDeparture.label.ts` owns Pixi'VN dialogue/choices.
`src/content/state/kurtzDepartureState.ts` binds story checkpoints through
the existing generic `createPixiStorageCheckpoint`, without another save system.
`showKurtzDeparture.ts` composes existing movement, bounded camera, NPC routine,
parallax, spatial audio, depth and responsive resolution attachments. The
existing station owner is reused, avoiding changes to engine or global cleanup.

## Canonical save contract

Pixi'VN storage `journey.kurtzDeparture` stores phase, optional patient/bank
observations, immutable `whistle`/`intervene` response, crew warning, whistle
action, exact manoeuvre progress and closing-exchange completion.
`journey.departurePosition` stores Marlow's actual bounded coordinates.
The previous `journey.kurtzEvacuation.priority` remains the sole authority for
the patient/cargo memory; it is never copied into a second narrative flag.

Mooring state derives from phase. Bank size/position derives directly from
saved progress, so restoring a partial turn reconstructs the same composition.
Pixi'VN retains active labels and choices; the scene resumes those, rather than
calling entry labels again. A completed exchange is not repeated after restore.
No audio playback offset or rendering texture is serialized.

The short manoeuvre advances only after the player's helm action and uses a
capped positive ticker delta; it never advances the previous Deck voyage state.
Distance is normalized 0–1 over eight simulation seconds, not a real-time timer.
Hidden-page updates are suspended. The current bank does not cycle or respawn.

## Audio/lifecycle

Existing water, shore and engine loops use their existing registrations.
The existing approach whistle is reused during the corresponding active label.
The shore level fades as the bank recedes; engine volume rises smoothly through
the existing mixer. Sources use the stable `journey-kurtz-departure` namespace.
Scene teardown disposes input handlers, UI, ticker bindings and active sources;
the scene's own fog texture is destroyed. Restore reconstructs the soundscape
from scene/position/narrative state. No direct Web Audio or playback manager.

## Validation and limits

`npm run agent:check`: **exit 0**, TypeScript, **153/153 unit tests in 36
files**, build **2.95s**, largest shared chunk **463.99 kB**; no >500 kB warning.
`npm run agent:e2e`: **exit 0**, **93/93 tests in 31.4 minutes**, no failures.
Updated total: **246 tests**. All 89 preexisting browser cases are unchanged.

Six new unit cases cover the completed-evacuation prerequisite, one-time entry,
release-gated bank pressure, both physical response routes, capped progress,
checkpoint round-trip and rejection of inconsistent saved states.
Four new E2E cases cover both routes, optional observations, remembered priority,
movement during the turn, traveling river, active audio sources, saves before
boarding/at the choice/after the whistle/during the turn/after the exchange,
exact restored Marlow and scenic-bank coordinates, immutable response,
no repeated closing or duplicate actors/sounds, restart and spatial prerequisites.
The fourth case captures both choices and eleven beats at both resolutions,
checking renderer resolution, art loading, UI bounds and overflow.

**22 corrected captures** visually inspected and dimension-verified:
[Visual QA index](kurtz-departure-qa/README.md).
Text/options remain readable at 800×600, with the existing contain letterboxing;
characters, cot, cargo and interaction cues remain visible at both sizes.
Focused E2E run: **4/4 in 3.7 minutes**. Full regression includes Metamorphosis,
the four approved Deck stages, original walking, night/evacuation, river, fog,
audio and all original save/restore cases. Existing warnings remain nonfatal.

Only the short turn is interactive navigation; the downstream voyage is pending.
Armed men and the woman's gesture use concise offscreen narration; no new hero
sprites are invented. A precise future art brief describes that presentation
limit in `docs/art-briefs/kurtz-departure-bank.md`. Existing bearer silhouettes
represent small groups on the bank; they are not a definitive crowd illustration.
Existing reused Kurtz poses do not animate articulated limbs. The cot is staged
beside the existing caseta opening rather than introducing a new interior view.

Visual QA rejected the first rectangular scenic inset and its reused European
night followers. The local scene now frames the station across the background,
uses one small immutable feather mask to merge its river edge, and places
existing bearer silhouettes on its slope at coherent distant scale. No source
illustration, approved Deck composition or engine code is changed.
