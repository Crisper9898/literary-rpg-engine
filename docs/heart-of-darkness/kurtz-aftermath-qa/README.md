# Aftermath — visual QA

24 final captures, individually inspected: twelve moments at 1366×768 and
800×600. PNG headers match their filenames. Kept before the full Playwright
run so the test-results cleanup cannot remove the reviewed evidence.

| Moment | Desktop | Compact |
| --- | --- | --- |
| morning | [1366×768](aftermath-morning-1366x768.png) | [800×600](aftermath-morning-800x600.png) |
| burial | [1366×768](aftermath-burial-1366x768.png) | [800×600](aftermath-burial-800x600.png) |
| papers | [1366×768](aftermath-papers-1366x768.png) | [800×600](aftermath-papers-800x600.png) |
| fever | [1366×768](aftermath-fever-1366x768.png) | [800×600](aftermath-fever-800x600.png) |
| choice | [1366×768](aftermath-choice-1366x768.png) | [800×600](aftermath-choice-800x600.png) |
| help | [1366×768](aftermath-help-1366x768.png) | [800×600](aftermath-help-800x600.png) |
| water-help | [1366×768](aftermath-water-help-1366x768.png) | [800×600](aftermath-water-help-800x600.png) |
| rest | [1366×768](aftermath-rest-1366x768.png) | [800×600](aftermath-rest-800x600.png) |
| recovery | [1366×768](aftermath-recovery-1366x768.png) | [800×600](aftermath-recovery-800x600.png) |
| alone | [1366×768](aftermath-alone-1366x768.png) | [800×600](aftermath-alone-800x600.png) |
| water-alone | [1366×768](aftermath-water-alone-1366x768.png) | [800×600](aftermath-water-alone-800x600.png) |
| restored-rest | [1366×768](aftermath-restored-rest-1366x768.png) | [800×600](aftermath-restored-rest-800x600.png) |

## Review

- Both sizes keep the complete boat, caseta, cargo, player, working sailor and
  river depth visible. The patient is absent, not reused as a corpse.
- Existing character art, scale, contact shadows and walking remain unchanged.
  The packet stays by the caseta until the actual securing interaction.
- Text, two care options and controls fit within the viewport without scroll
  overflow or clipping. The 800×600 contain letterboxing preserves framing.
- Illness adds a subtle grey world veil and pale actor lighting. Dialogue/UI
  remain outside it; the river and sailor remain legible and animated.
- Both care routes are visible and the restored rest label keeps its text,
  guarded papers, position and illness presentation.
- No new background, patient/corpse, water prop or reclining character artwork
  is claimed. Burial and water are narrated; days of illness are compressed.
  The original approved Deck assets and source are preserved.

The first focused run passed; the final focused run also passed after adding
movement-during-options and remembered-choice assertions, correcting the
care line to avoid promising a simulated escort, and initializing the restored
illness veil from canonical phase. No earlier test was weakened.

Final focused browser gate: **4/4 in 3.3 minutes**, exit 0.
Deterministic gate: TypeScript, **176/176 units in 39 files**, build **4.28s**,
exit 0. Full E2E: **105/105 in 39 spec files, 42.6 minutes**, exit 0. All 101
preexisting cases remain unchanged and pass. Total automated coverage: 281 tests.

Gameplay, saved state and literary adaptation:
[Episode guide](../KURTZ-AFTERMATH.md).
