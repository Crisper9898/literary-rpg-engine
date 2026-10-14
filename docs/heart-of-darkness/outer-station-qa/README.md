# Coast and Outer Station — browser/visual QA

Checked 2026-10-12–13 on `journey-vertical-slice`, base
`146cbe5e41bf12c5740ca5a5d897063f59b11065`.
Route and source boundary: [OUTER-STATION.md](../OUTER-STATION.md).

## Deterministic gates

- `agent:check`: exit 0; TypeScript, 220/220 units in 46 files, build 4.49s.
- Focused browser command:
  `npm run agent:e2e -- tests/e2e/outerStation.spec.ts tests/e2e/outerStationVisual.spec.ts tests/e2e/commission.spec.ts tests/e2e/prologue.spec.ts`:
  exit 0, 10/10 passed in 5.6m.
- Full `agent:e2e -- --retries=1`: exit 0; 133/133 passed in 53 spec files,
  56.9m. All passed on the first attempt; no retry was used.
- Total: 353 tests (220 units + 133 E2E), including both works and neutral
  fixtures. The 14 runtime/test files retained their verified hashes throughout
  the full run. This count is not a literary completion percentage.

The first focused run found two test failures caused by a probe-to-actor timing
assumption and a point shared with the valid coastal surf action. The corrected
loop waits for real coordinates and uses genuinely unavailable points. It does
not change interaction ranges or remove progression/proximity assertions.
The first captures also exposed the office being covered by the slope; its layer
order was corrected and is now guarded in gameplay and visual tests. Independent
read-only review confirmed the correction and no remaining important defect.

## Retained visual evidence

32 PNGs, 16 moments at each resolution, copied from the passing focused run.
PNG headers/dimensions match filenames; all 32 were individually inspected.
Both choices, later branch memories and the exact restored dialogue remain
readable. Office, grove, machinery, warship, walking feet and controls are in
frame. Viewport/scroll bounds and render/display pixel agreement are asserted.
At 800×600 contain framing produces letterboxing, preserving the full scene.

| Moment | 1366×768 | 800×600 |
|---|---|---|
| coast-intro | [PNG](outer-coast-intro-1366x768.png) | [PNG](outer-coast-intro-800x600.png) |
| coast-exploration | [PNG](outer-coast-exploration-1366x768.png) | [PNG](outer-coast-exploration-800x600.png) |
| surf | [PNG](outer-surf-1366x768.png) | [PNG](outer-surf-800x600.png) |
| warship | [PNG](outer-warship-1366x768.png) | [PNG](outer-warship-800x600.png) |
| landing | [PNG](outer-landing-1366x768.png) | [PNG](outer-landing-800x600.png) |
| shore-exploration | [PNG](outer-shore-exploration-1366x768.png) | [PNG](outer-shore-exploration-800x600.png) |
| chain-gang | [PNG](outer-chain-gang-1366x768.png) | [PNG](outer-chain-gang-800x600.png) |
| grove-choice | [PNG](outer-grove-choice-1366x768.png) | [PNG](outer-grove-choice-800x600.png) |
| grove-give | [PNG](outer-grove-give-1366x768.png) | [PNG](outer-grove-give-800x600.png) |
| grove-stay | [PNG](outer-grove-stay-1366x768.png) | [PNG](outer-grove-stay-800x600.png) |
| accountant-give | [PNG](outer-accountant-give-1366x768.png) | [PNG](outer-accountant-give-800x600.png) |
| accountant-stay | [PNG](outer-accountant-stay-1366x768.png) | [PNG](outer-accountant-stay-800x600.png) |
| memory-give | [PNG](outer-memory-give-1366x768.png) | [PNG](outer-memory-give-800x600.png) |
| memory-stay | [PNG](outer-memory-stay-1366x768.png) | [PNG](outer-memory-stay-800x600.png) |
| ellipsis | [PNG](outer-ellipsis-1366x768.png) | [PNG](outer-ellipsis-800x600.png) |
| restored-ellipsis | [PNG](outer-restored-ellipsis-1366x768.png) | [PNG](outer-restored-ellipsis-800x600.png) |

## Practical limits

This is a bounded narrative episode with graphic-theatre staging, not finished
Outer Station illustration. The existing atlas/vegetation are preserved; new
worker/accountant/captain images are not invented or replaced with unrelated
portraits. They remain offscreen as described in
[the scoped brief](../../art-briefs/outer-station.md).
Compared with La metamorfosis, narrative framing/limited palette/ground contact
are reused; this station still lacks equally finished environment and encounter
illustration. The functional visual gate does not declare that debt complete.

Audio tests validate active sources, gains, cleanup/reconstruction and no
repeated instances. Human listening and physical-GPU evaluation remain separate;
there are no new gunshot/chain-specific recordings. No FPS or auditory quality
improvement is claimed. Canonical saves restore position, phase, line, choices
and labels; they do not serialize a water-animation or sound waveform clock.
Caravan/Central Station remain out of this episode. Approved Deck, engine,
Metamorphosis, Phaser stash and original untracked files are protected.
