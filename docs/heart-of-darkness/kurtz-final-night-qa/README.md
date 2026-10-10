# Kurtz's final evening — visual QA

24 individually reviewed browser captures: twelve moments at **1366×768** and
**800×600**, from the corrected four-case focused run. PNG header dimensions were
verified. No runtime image or approved Deck source was changed to make them.

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| Evening / existing night transition | [PNG](final-night-evening-1366x768.png) | [PNG](final-night-evening-800x600.png) |
| Candle carried by Marlow | [PNG](final-night-held-1366x768.png) | [PNG](final-night-held-800x600.png) |
| Kurtz with the bedside light | [PNG](final-night-bedside-1366x768.png) | [PNG](final-night-bedside-800x600.png) |
| Both responses and prior papers memory | [PNG](final-night-choice-1366x768.png) | [PNG](final-night-choice-800x600.png) |
| Trying to reassure him | [PNG](final-night-reassure-1366x768.png) | [PNG](final-night-reassure-800x600.png) |
| The final whispered words | [PNG](final-night-last-words-1366x768.png) | [PNG](final-night-last-words-800x600.png) |
| Extinguished candle, patient offscreen | [PNG](final-night-out-1366x768.png) | [PNG](final-night-out-800x600.png) |
| News of the death | [PNG](final-night-announcement-1366x768.png) | [PNG](final-night-announcement-800x600.png) |
| Custody remembered after the news | [PNG](final-night-papers-1366x768.png) | [PNG](final-night-papers-800x600.png) |
| Restored carried candle | [PNG](final-night-restored-held-1366x768.png) | [PNG](final-night-restored-held-800x600.png) |
| Listening after restoring the choice | [PNG](final-night-listen-1366x768.png) | [PNG](final-night-listen-800x600.png) |
| Restored actual final-word line | [PNG](final-night-restored-words-1366x768.png) | [PNG](final-night-restored-words-800x600.png) |

The existing contain layout preserves the boat and cast at 800×600. Dialogue,
both options and controls fit with no overflow or accidental cropping. The cot,
contact shadows and patient atlas remain intact. Warm local candle tint differs
from the surrounding night; existing sky/river/vegetation depth remains live.
The candle and narrow stand are technical prop art, with limits documented in
the dedicated brief. No new interior, corpse, messenger or dinner illustration
is claimed; narration identifies the offscreen announcement.

QA rejected the first bedside staging: Marlow obscured the patient and the
candle sat too low. The revised approach point is beside the cot, and the light
stands closer to Kurtz's face on a grounded brass support. A carried candle
draws ahead of its bearer and follows him correctly after restore. The patient
is hidden once Marlow leaves rather than using a living pose as a dead body.

Browser assertions inspect the actual 768×512 atlas crop and 315×210 sprite
dimensions, renderer pixels after resizing, all panel/choice bounds, loaded art
and the Pixi'VN error bridge. Functional tests also verify real movement,
canonical state, both choices, active-line restore and lifecycle/source cleanup.

agent:check passed (exit 0): TypeScript, 168/168 unit tests in 38 files and build
in 3.58s. Focused E2E passed 4/4 in 2.8 minutes. Full agent:e2e passed (exit 0):
101/101 cases in 37 files, 35.8 minutes, including all 97 unchanged existing
cases. Captures were retained before that gate so clearing Playwright's output
did not discard the review. Production code was unchanged between this corrected
focused run and the final complete regression gate.
