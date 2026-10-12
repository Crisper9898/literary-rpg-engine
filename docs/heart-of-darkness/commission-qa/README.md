# Company appointment — browser and visual QA

Baseline: `88ad892895c608ed57d33b65b0877155950ef7df`.
Route: `/?story=journey&episode=commission`.
Adaptation, manual route and persistence: [COMPANY-COMMISSION.md](../COMPANY-COMMISSION.md).

## Validation

- State tests were written first; the initial run failed because the module
  did not yet exist. All six state cases subsequently passed.
- Final `agent:check`: exit 0; TypeScript, 214/214 units in 45 files; build 3.89s.
- Focused `agent:e2e -- tests/e2e/commission.spec.ts tests/e2e/commissionVisual.spec.ts tests/e2e/prologue.spec.ts`:
  exit 0, 7/7 passed in 3.7m. An initial run found incorrect *new test selectors*;
  the real existing buttons and exact numbered text are now asserted. No UI or
  existing test was weakened to resolve that failure.
- Full `agent:e2e -- --retries=1`: exit 0, 129/129 passed in 51 spec files,
  55.7m. No reattempt was needed. Total: 343 tests (214 units + 129 E2E).
  The initial full run was interrupted after Chromium reported
  `page.goto: net::ERR_NO_BUFFER_SPACE` before loading the Intended scene.
  That unchanged case passed in a fresh browser (1/1, 42.1s, exit 0). The repeat
  allows one browser retry via CLI; no test assertion/config or game code changed.
- The 13 runtime/test files retained their validated hashes throughout the
  final full run. Engine, frozen Deck, assets and Metamorphosis are unchanged.
- Independent read-only review found no blocking code issue.

The gameplay paths cover map observed/ignored, both medical questions and
their later aunt replies; out-of-range/premature E; contract prerequisites;
movement while a choice is open; exact real coordinates, line, choices, label
stack and phase after export/restore; earlier saves, repeated reconstruction,
single audio/UI ownership and restart. Default Deck, Nellie and Metamorphosis
entries are checked independently of the new optional route.

## Captures

26 original browser PNGs, 13 moments at both resolutions. PNG headers were
verified against the filenames. Each image was visually inspected; the visual
test also verifies panel, prompt, control and both choice bounds, scroll height
and renderer resolution. No clipping or inaccessible choice was found.

| Moment | 1366×768 | 800×600 |
|---|---|---|
| Entry | [PNG](commission-arrival-1366x768.png) | [PNG](commission-arrival-800x600.png) |
| Exploration | [PNG](commission-exploration-1366x768.png) | [PNG](commission-exploration-800x600.png) |
| Colonial map | [PNG](commission-map-1366x768.png) | [PNG](commission-map-800x600.png) |
| Fresleven recalled | [PNG](commission-fresleven-1366x768.png) | [PNG](commission-fresleven-800x600.png) |
| Black-wool threshold | [PNG](commission-knitters-1366x768.png) | [PNG](commission-knitters-800x600.png) |
| Contract | [PNG](commission-contract-1366x768.png) | [PNG](commission-contract-800x600.png) |
| Medical question / both options | [PNG](commission-medical-choice-1366x768.png) | [PNG](commission-medical-choice-800x600.png) |
| Doctor / returning | [PNG](commission-doctor-return-1366x768.png) | [PNG](commission-doctor-return-800x600.png) |
| Aunt / returning | [PNG](commission-farewell-return-1366x768.png) | [PNG](commission-farewell-return-800x600.png) |
| Doctor / science | [PNG](commission-doctor-question-1366x768.png) | [PNG](commission-doctor-question-800x600.png) |
| Aunt / science | [PNG](commission-farewell-question-1366x768.png) | [PNG](commission-farewell-question-800x600.png) |
| Explicit ellipsis | [PNG](commission-ellipsis-1366x768.png) | [PNG](commission-ellipsis-800x600.png) |
| Restored ellipsis | [PNG](commission-restored-ellipsis-1366x768.png) | [PNG](commission-restored-ellipsis-800x600.png) |

## Visual observations and limits

At 1366×768 the contract, recommendation, map and wool threshold remain distinct;
Marlow's approved atlas retains floor contact/shadow and stays below the dialogue
column. At 800×600 contain framing preserves the floor and both desks. The longer
Fresleven line and both medical options fit completely; doctor/aunt replies and
the restored ellipsis remain readable. The darker examination veil preserves
paper contrast, actor silhouette and doorway; it does not obscure the UI.

This is **reused graphic theatre**, not a finished newly illustrated office.
The map and wool are symbolic vector props; all visitors are offscreen. The
current neutral room is less detailed than the strongest Metamorphosis art.
[Company-office brief](../../art-briefs/company-office.md) records that specific
illustration debt without changing or delaying the approved Deck. Physical-GPU
performance and human listening are not claims of this QA. No approved art,
engine system, final-frame scene or Metamorphosis asset was modified.
