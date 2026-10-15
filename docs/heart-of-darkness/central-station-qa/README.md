# Caravan and Central Station — browser/visual QA

Checked 2026-10-13 on `journey-vertical-slice`, base
`4dc3667628b071c68635bafe0832eb239cbc7cf1`.
Route/source/ownership: [CENTRAL-STATION.md](../CENTRAL-STATION.md).

## Gates and provenance

- Latest `agent:check`: exit 0; TypeScript, 227/227 units in 47 files,
  build 2.91s.
- State red/green: seven cases; absent module first, then five behavior failures
  against transition stubs, then 7/7 green.
- Browser red: optional entry initially opened the Deck; expected caravan line
  was absent. The first focused run passed 11/13; two new cases saved during
  asynchronous arrival before the line/world were ready. The new driver waits
  for actual nonempty dialogue; all original progression/restore assertions stay.
- Second focused run: both new paths, optional entries and visual case passed,
  but copying QA PNGs while Vite watched the directory caused Windows EBUSY,
  killed the server and produced five connection-refused failures (8/13 passed).
  This is not counted as a green regression gate. No game/assertion/config change
  masks that failure: repeat with repository files frozen while servers run.
- Fresh focused gate: exit 0; 13/13 passed in 7.4m with repository files frozen.
  Command: `npm run agent:e2e -- tests/e2e/centralStation.spec.ts tests/e2e/centralStationVisual.spec.ts tests/e2e/outerStation.spec.ts tests/e2e/commission.spec.ts tests/e2e/prologue.spec.ts`.
- Full `npm run agent:e2e -- --retries=1`: 137/137 passed in 55 files, 1.0h;
  no failures or retry attempts recorded. All 16 runtime/test hashes still match.
  Total with units: 364 automated tests. The retry allowance did not mask failures.
- Independent read-only review found no Critical/Important/Minor issue. Root
  validation owns test results and visual review; static review did not certify
  final art or human sound balance.

## Retained visual evidence

28 PNGs: fourteen moments at both target sizes, from the passing visual case.
All headers/dimensions were checked and all 28 images individually inspected.
The water-filled inland stage was rejected during the first review; these
captures show the corrected terrestrial march and the separate station backwater.
The 16 runtime/test hashes are frozen for subsequent regression validation.
Copy capture files only after test servers stop; never introduce new watched
PNG files while Vite is active on Windows.

Dialogue/options, both memories, feet, ruin/camp/hammock cues, wreck and fence
remain in frame. UI bounding/scroll fit, actor bounds and render/display pixel
agreement are tested. At 800×600 contain framing preserves the scene with
letterboxing. Gate/wreck layer order is checked. The UI reserves the upper-left
space; scene cues and the figure remain below it.

| Moment | 1366×768 | 800×600 |
|---|---|---|
| trail-intro | [PNG](central-trail-intro-1366x768.png) | [PNG](central-trail-intro-800x600.png) |
| trail-exploration | [PNG](central-trail-exploration-1366x768.png) | [PNG](central-trail-exploration-800x600.png) |
| village | [PNG](central-village-1366x768.png) | [PNG](central-village-800x600.png) |
| ravine | [PNG](central-ravine-1366x768.png) | [PNG](central-ravine-800x600.png) |
| camp | [PNG](central-camp-1366x768.png) | [PNG](central-camp-800x600.png) |
| companion-choice | [PNG](central-companion-choice-1366x768.png) | [PNG](central-companion-choice-800x600.png) |
| companion-shade | [PNG](central-companion-shade-1366x768.png) | [PNG](central-companion-shade-800x600.png) |
| companion-load | [PNG](central-companion-load-1366x768.png) | [PNG](central-companion-load-800x600.png) |
| central-arrival | [PNG](central-central-arrival-1366x768.png) | [PNG](central-central-arrival-800x600.png) |
| wreck-news | [PNG](central-wreck-news-1366x768.png) | [PNG](central-wreck-news-800x600.png) |
| wreck-memory-shade | [PNG](central-wreck-memory-shade-1366x768.png) | [PNG](central-wreck-memory-shade-800x600.png) |
| wreck-memory-load | [PNG](central-wreck-memory-load-1366x768.png) | [PNG](central-wreck-memory-load-800x600.png) |
| ellipsis | [PNG](central-ellipsis-1366x768.png) | [PNG](central-ellipsis-800x600.png) |
| restored-ellipsis | [PNG](central-restored-ellipsis-1366x768.png) | [PNG](central-restored-ellipsis-800x600.png) |

## Limits and adaptation decisions

The scene is a bounded graphic-theatre episode, not final illustrated caravan
or Central Station art. Existing atlas/vegetation, contact shadows, controlled
palette and editorial UI are protected; props/hills remain geometric and the
companion/carriers/agent offscreen. This does not claim the finished art quality
of the approved Deck. [Scoped brief](../../art-briefs/central-station.md).

Shore observation is deliberately placed before the later manager episode;
Conrad's first interview precedes close examination. The bank view cannot
diagnose underwater damage or raise the boat; N05 must respect the player's
observation rather than claim the wreck has never been seen. The alternate
load attention and spatial/daily compression are declared adaptations.

Audio gates inspect canonical sources, gains and duplicate cleanup, not final
recording quality. Human listening and physical-GPU evaluation remain pending;
there is no new footsteps/carrier/impact recording or FPS improvement claim.
Cosmetic drift does not serialize a playback clock. No save menu, salvage,
manager politics, repairs/rivets, Eldorado, engine or approved Deck change.
