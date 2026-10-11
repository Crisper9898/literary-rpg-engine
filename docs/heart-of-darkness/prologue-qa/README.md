# Nellie opening — retained visual QA

Source: focused `prologueVisual.spec.ts` browser run, 2026-10-11, on the
working tree based on `e9022224ba02a8158e119ecbab9dd9c0b2b347be`.
All 18 PNG dimensions were checked and every image was individually inspected.

| Moment | 1366×768 | 800×600 |
|---|---|---|
| Entry narration | [PNG](prologue-arrival-1366x768.png) | [PNG](prologue-arrival-800x600.png) |
| Free exploration | [PNG](prologue-exploration-1366x768.png) | [PNG](prologue-exploration-800x600.png) |
| Optional anchorage | [PNG](prologue-anchorage-1366x768.png) | [PNG](prologue-anchorage-800x600.png) |
| Marlow's opening | [PNG](prologue-opening-1366x768.png) | [PNG](prologue-opening-800x600.png) |
| Roman comparison | [PNG](prologue-roman-comparison-1366x768.png) | [PNG](prologue-roman-comparison-800x600.png) |
| Conditional memory | [PNG](prologue-memory-1366x768.png) | [PNG](prologue-memory-800x600.png) |
| Ready to continue | [PNG](prologue-ready-1366x768.png) | [PNG](prologue-ready-800x600.png) |
| Explicit ellipsis | [PNG](prologue-ellipsis-1366x768.png) | [PNG](prologue-ellipsis-800x600.png) |
| Restored ellipsis | [PNG](prologue-restored-ellipsis-1366x768.png) | [PNG](prologue-restored-ellipsis-800x600.png) |

## Findings

The existing Nellie deck, mast, rigging, river and mooring remain visible;
Marlow's feet and contact shadow stay on deck. The player is smaller at
800×600, with the same contained composition and vertical letterboxing,
but remains distinguishable. Dialogue, E button, idle hint, controls and
work links are accessible without overlap or text truncation. The Roman
comparison is the longest tested tale line and remains readable at 800×600.
The narrative veil darkens without hiding the actor or amarra. Restored
ellipsis composition/UI matches the earlier moment. No changes to the
approved Journey Deck or its four stages were made.

This is the reused graphic-theatre Nellie staging, with angular flat planes,
not a new finished illustration matching the approved Deck or Metamorphosis
artwork. The existing specific illustration brief remains applicable;
listeners and Marlow's seated novel pose are still not illustrated.
No human listening quality or physical-GPU performance claim is made here.

## Gates

- `agent:check`: exit 0; TypeScript, 208/208 units in 44 files; build 2.65s.
- Initial focused browser run: 4/4 passed in 1.7m, including the visual spec.
- After adding exact restored dialogue-text assertions, the three focused
  gameplay cases passed again in 1.2m.
- Full `agent:e2e`: exit 0; 125/125 tests in 49 spec files, 49.0m, including
  both works, approved Deck stages, movement, camera, audio, river, atmosphere,
  all existing restoration paths and the independent Thames conclusion.
- Total: 333 tests (208 units + 125 E2E). Code/test hashes were unchanged
  during the final full regression run.
