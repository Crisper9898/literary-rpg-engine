# Fog-bound approach and shore attack

Base: `7fc7cab6ebee07fddbae2f350d21a2dd59fd86bb`, branch journey-vertical-slice.
The approved Deck tag and its four illustrated stages are unchanged. This is
a separately composed episode, not a redesign of that scene.

## Literary coverage

Source: [Conrad, Heart of Darkness, part II](https://www.gutenberg.org/files/219/219-h/219-h.htm).
The fog-bound wait, ambiguous cries from the banks, narrowing passage beside a
shoal, submerged snags, arrows, smoke from firing aboard, helmsman's death,
Marlow taking the wheel and the steam whistle all inform this episode. The
attack follows a partial lift of the fog; the figures ashore are fleeting people,
not targets. Marlow recognizes the human loss of his working companion.

The Spanish dialogue is original adaptation. Route scale, obstacle positions,
simultaneous steering/reading, a compressed pause at the wheel, stereo cues and
the hut proceed branch are playable adaptations, not a literal transcript or
navigation simulator. The novel's long wait and later funeral are not fully
staged here. No arrival at the Inner Station, Russian trader or Kurtz is added.

## Play the episode

1. Finish the Deck conversation, disembark by the cabin, load wood and make the
   existing hut decision. Return from the landing with E.
2. On the Deck, approach the wheel position (approximately x900/y748, between
   Marlow's original spawn and the sailor). E **Reanudar el viaje** enters the
   new sequence. Read the arrival line, then E takes the helm.
3. A/D or left/right gradually steer. W/up increases slow forward motion; S/down
   reduces it. With neither held, the steamer creeps forward. E releases the
   helm so Marlow can walk with the existing controls; E at the wheel resumes.
4. Avoid the warning's bank, look for split driftwood, reeds and the shoal in
   the thin strip of navigable water. Both channel edges slow contact and clamp
   the vessel; obstacle crossings cause a short slowdown, not a health loss or
   an arcade game-over. The same obstacle cannot inflict repeated contacts.
5. Listen to babor/estribor cues (also described in the editorial status). Read
   with E while steering continues. No aiming, weapons or enemy elimination.
6. The helmsman's fall interrupts control for 2.4 simulation seconds. Finish
   Marlow's brief reaction, take the wheel with E and sound the siren with Space.
   The whistle releases the final stretch; no branch is judged correct/wrong.
7. After the aftermath line, the episode stops before the station. Marlow can
   walk again; returning to an earlier save remains possible through Pixi'VN.

Wait: less initial mist. Proceed: thicker initial mist but the prepared sounding
pole reveals hazards 40% earlier. Forward speed and outcome are equal. The
profile is reconstructed from the hut's existing approachDecision, not copied
into another narrative system.

## Architecture and save contract

- `src/puzzles/riverApproach/NavigationController.ts`: slow bounded mechanical
  simulation, inertial steering, swept contacts, interruption and whistle gate.
- `src/story/heart-of-darkness/riverApproach.ts`: route, visual source manifest,
  wheel placement, progress thresholds and adapted dialogue.
- `src/story/heart-of-darkness/createApproachEffects.ts`: pooled arrows, briefly
  occluded bank silhouettes, wet hazards/ripples, impact traces, drifting smoke,
  motes and three mist depths. The distant mist sits between vegetation planes.
- `src/content/scenes/showRiverApproach.ts`: composition of existing Deck plates,
  movement, camera, gait, atmosphere and audio; no engine change.
- `src/content/scenes/attachApproachNarration.ts` and the Pixi labels: due lines
  are queued until the current label closes. Reading does not freeze steering.
- `src/content/scenes/updateRiverApproach.ts`: canonical checkpoint update and
  one-time physical loss, independent of when the player finishes reading.

Pixi'VN remains the only save format:

| Key | Saved data |
| --- | --- |
| journey.currentSpace | deck / wood-stop / approach |
| journey.approachDecision | existing wait / proceed choice |
| journey.approachNavigation | progress 0..1, lateral -1..1, heading, contacts, slowdown, interruption remaining, whistle |
| journey.approachPosition | actual Marlow deck coordinates in this episode |
| journey.approachAtHelm | whether controls govern the vessel or Marlow |
| journey.approachSeen | six idempotent line/event markers |
| journey.helmsmanLost | one-time canonical loss; no reset when a line closes |
| journey.approachAtmosphere | existing controller's smoothed voyage progress |

Attack started/finished are derived exactly from the saved navigation progress
(.48 / 1), avoiding contradictory duplicate flags. Pixi'VN also saves its active
label/step/dialogue. `Game.exportGameState()` / `Game.restoreGameState()` are used
unchanged; after restoration `showJourneySpace()` rebuilds transient scene
bindings from currentSpace, exactly like the existing hut/Metamorphosis adapters.

Restoring before the incident restores a living helmsman; restoring during it
restores the remaining interruption and current Pixi line; restoring after it
retains the fallen pose and seen lines. A save during attack does not replay
arrival or re-run the one-time hit. Input holds, individual arrow instants, fog
tile phase and audio playback timestamps are intentionally transient. Position,
route phase, saved mist and narrative consequences are not transient.

## Audio and visual production

`approachAudio.ts` composes existing spatial audio and Pixi channels. Listener
position is the generic vessel coordinate. Two bank cues attenuate by distance;
their original stereo WAVs put babor predominantly left and estribor right.
This uses source-authored direction, not a new engine panner. Water/engine reuse
existing loops. Impacts fade in during the attack; engine/impacts duck sharply
on loss; the siren replaces impact sound for escape. Scene destruction removes
keyboard/ticker/DOM listeners, pooled effects and the shared fog texture, and
the existing audio adapter releases all its owned sources.

Four source-owned stereo drafts are generated deterministically by
`scripts/generate-approach-cues.mjs`: left/right (nonverbal call-like synthesis,
distant knocks and leaf noise), impacts and whistle. They contain no recordings
or third-party samples. Their role is audible mechanical feedback; they are not
claimed to be final human voice acting or a historically authentic soundscape.
Listen manually with headphones to judge timbre, distance and mix. Automatic
tests verify nonzero unclipped PCM, opposite stereo energy, actual active Pixi
channels, source gain, ducking and lifecycle; they cannot supply human judgment.

The precise brief `docs/art-briefs/journey-helmsman.md` preceded generation of two
matching transparent character images with the built-in image tool, using only
the approved sailor for style and the first helmsman image for identity. No
existing asset was edited. Native outputs: standing 1111×1415, fallen 1698×926;
manifest display sizes 150×210 and 230×145. Registration is feet/contact-based.
The fall blends a brief rotation into the companion fallen pose, rather than
leaving a rotated standing cutout as the final art. Fragmented contact shapes
replace elliptical shadows only in this episode. Original Deck cast/plates,
animation sheets, four-stage effects and `src/engine/` remain untouched.

## QA and validation

Captures in `fog-approach-qa/` retain fog, attack, helmsman and recovery at each
size. Wait for atmospheric interpolation before capture, not just the target
variable. Tests check actual panel/button/status bounds at 100% zoom.

| Stage | 1366×768 | 800×600 |
| --- | --- | --- |
| Fog | [capture](fog-approach-qa/approach-fog-1366x768.png) | [capture](fog-approach-qa/approach-fog-800x600.png) |
| Attack | [capture](fog-approach-qa/approach-attack-1366x768.png) | [capture](fog-approach-qa/approach-attack-800x600.png) |
| Helmsman | [capture](fog-approach-qa/approach-helmsman-1366x768.png) | [capture](fog-approach-qa/approach-helmsman-800x600.png) |
| Recovery | [capture](fog-approach-qa/approach-recovery-1366x768.png) | [capture](fog-approach-qa/approach-recovery-800x600.png) |

All eight final captures were visually inspected. Dialogue, continue button,
navigation status and controls remain inside the frame at 100% zoom. At 800×600
the scene retains Pixi'VN's contain framing; small faces read chiefly through
pose and silhouette. The upper-left editorial panel leaves the wheel, crew and
central water sightline visible. Mist separates the vegetation planes without
covering the helm; fallen art has a grounded contact edge rather than an oval
shadow or a sideways standing sprite. The attack remains restrained and non-gory.
During review, approaching hazards were moved onto the water sightline, the fog
was strengthened between planes and the standing-only fall was replaced by the
matched fallen pose. No original Deck plate, animation or effect was changed.

Unit coverage: navigation bounds/steering, contact and avoidance, stall cap,
interruption/restore, whistle gate, invalid checkpoint, both hut profiles,
idempotent seen state, one-time loss, audible stereo PCM, cue activation,
ducking, crossfade and cleanup. Browser coverage: actual boarding/E entry,
both profiles, real steering while Marlow stays at the wheel, off-helm walking,
obstacle contact, directional channels, every narrative beat, whistle, canonical
saves before/during/after attack and an active fall line, real spatial restore,
no replay/duplicate sources and clean restart, plus both visual resolutions.

Final `npm run agent:check`: exit 0; TypeScript, **112/112 unit tests in 28
files**, and Vite build passed (4.04 seconds). The largest shared chunk remains
463.99 kB, without a >500 kB bundle warning. The existing plugin-timing notice
remains.

Final complete `npm run agent:e2e`: exit 0; **69/69 tests in 21 files**, 16.1
minutes. Total: **181 automated tests**, eight new unit cases and four new
browser cases. Coverage includes all existing Deck stages/gait, hut branches,
Metamorphosis encounters, movement, camera, NPC, parallax, weather, audio,
production boot, neutral portability and save/restore tests; no existing test
was weakened. The existing suspended-AudioContext-before-gesture and missing
optional-Pixi-navigation warnings remain; there were no test failures.

Existing Deck fire-dialogue and Metamorphosis room/hallway captures from the same
full run were also visually inspected. Their sources, original Deck artwork,
engine, rendering configuration and approved checkpoint remain unchanged.

## Scope and remaining limitations

The navigation is a deliberately short side-view interpretation: the vessel
drifts within the frame and hazards move across its sightline, rather than a
top-down simulation. There is no damage economy or failure screen. One briefly
interrupted working partnership carries the helmsman's death without gore.
Marlow uses approved concern/alarm faces plus posture changes for concentration,
contained fear, startle and fatigue; these are not five newly illustrated facial
portraits. The two helmsman poses are illustrations, not skeletal animation.
Human listening and physical-GPU performance still need separate evaluation.
No performance/engine refactor or new Save/Load UI was attempted.

Next milestone: arrival at the Inner Station and the Russian trader, separately
scoped. The pre-voyage framing/stations, Kurtz's compound, night recapture,
departure, illness/death downstream, return and the Intended remain unfinished.
This completes 3 of the earlier 10 unequal narrative blocks: **Heart of Darkness
approximately 30%**. For the same bounded project denominator used previously
(framework, complete Heart, Metamorphosis proof slice, release QA), the weighted
planning estimate is **approximately 49%** (weights 40/40/10/10; readiness
80/30/40/10). These are rough scheduling estimates, not a release claim; full
Metamorphosis, Frankenstein and unspecified future works are outside that count.
