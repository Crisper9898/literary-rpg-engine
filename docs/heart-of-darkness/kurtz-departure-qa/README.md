# Departure — visual QA

22 browser captures: eleven beats at **1366×768** and **800×600**. These are
the corrected composition, after rejecting the rectangular station inset and
European-costumed night followers. All 22 were visually inspected.

| Beat | 1366×768 | 800×600 |
| --- | --- | --- |
| Aboard / mooring intact | [PNG](departure-aboard-1366x768.png) | [PNG](departure-aboard-800x600.png) |
| Patient / remembered priority | [PNG](departure-patient-1366x768.png) | [PNG](departure-patient-800x600.png) |
| Mooring released / bank gathering | [PNG](departure-bank-1366x768.png) | [PNG](departure-bank-800x600.png) |
| Listening to the woman, narrated offscreen | [PNG](departure-woman-1366x768.png) | [PNG](departure-woman-800x600.png) |
| Both choices | [PNG](departure-choice-1366x768.png) | [PNG](departure-choice-800x600.png) |
| Immediate whistle / retreat | [PNG](departure-whistle-1366x768.png) | [PNG](departure-whistle-800x600.png) |
| Manoeuvre while reading | [PNG](departure-manoeuvre-1366x768.png) | [PNG](departure-manoeuvre-800x600.png) |
| Receded station / closing line | [PNG](departure-departed-1366x768.png) | [PNG](departure-departed-800x600.png) |
| Intervention choice | [PNG](departure-intervene-1366x768.png) | [PNG](departure-intervene-800x600.png) |
| Physical warning to the crew | [PNG](departure-crew-1366x768.png) | [PNG](departure-crew-800x600.png) |
| Restored state / helm still available | [PNG](departure-restored-1366x768.png) | [PNG](departure-restored-800x600.png) |

The test checks real renderer backing dimensions against its CSS display after
resize, UI bounds and overflow, choice visibility, art loading and application
errors. Manual inspection checks grounded feet/cot, shade, layer overlap,
receding bank, absence of rectangular scenic edges and readable text/options.
800×600 uses the existing contain letterboxing; nothing important is cropped.

The existing illustrated Deck plates are reused without retouching or changing
their approved scene. The new departure has a distinct station plane, cot,
ivory and a mooring cue. One immutable low-resolution mask feathers this scenic
plane; no textures are allocated per frame.

Presentation limits: the woman's gesture and rifles remain offscreen narration;
the small bank groups reuse bearer silhouettes. No claim is made that these are
definitive farewell character art. See the dedicated art brief and the episode
document. This QA is not a physical-GPU performance or human listening review.

Focused browser validation: **4/4 passed in 3.7 minutes**. Final complete-suite
results are recorded in the episode document and active execution plan.
