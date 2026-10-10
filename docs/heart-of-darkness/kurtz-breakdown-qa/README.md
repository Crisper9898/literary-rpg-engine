# Island repair and papers — visual QA

22 reviewed browser captures: eleven moments at **1366×768** and **800×600**.
These are from the corrected four-case focused run, with the same production
code used for the final full-suite gate. PNG dimensions were read from their
headers. No runtime artwork was edited to produce these screenshots.

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| Downstream travel / onset of failure | [PNG](breakdown-downstream-1366x768.png) | [PNG](breakdown-downstream-800x600.png) |
| Island stop, patient and service hatch | [PNG](breakdown-island-1366x768.png) | [PNG](breakdown-island-800x600.png) |
| Both papers choices | [PNG](breakdown-choice-1366x768.png) | [PNG](breakdown-choice-800x600.png) |
| Keeping the packet closed | [PNG](breakdown-sealed-1366x768.png) | [PNG](breakdown-sealed-800x600.png) |
| Rod fitted, forge cooling | [PNG](breakdown-repaired-1366x768.png) | [PNG](breakdown-repaired-800x600.png) |
| Engine resumed, remembered custody | [PNG](breakdown-resumed-1366x768.png) | [PNG](breakdown-resumed-800x600.png) |
| Asking about the photograph after restore | [PNG](breakdown-ask-1366x768.png) | [PNG](breakdown-ask-800x600.png) |
| Kurtz identifies his Intended | [PNG](breakdown-photograph-1366x768.png) | [PNG](breakdown-photograph-800x600.png) |
| Inspecting the machine | [PNG](breakdown-engine-1366x768.png) | [PNG](breakdown-engine-800x600.png) |
| Tending the small forge | [PNG](breakdown-forge-1366x768.png) | [PNG](breakdown-forge-800x600.png) |
| Restored scene, worker away from the forge | [PNG](breakdown-restored-1366x768.png) | [PNG](breakdown-restored-800x600.png) |

The world stays live during capture; the failure can begin between the two
downstream shots. At 800×600, existing contain letterboxing preserves the boat
and characters. Text, both options and controls fit without overflow/cropping.
The new hatch lies in the floor plane, and the small forge has a contact shadow
and restrained coal light. Existing cast/river/boat palettes and framing remain.
The props are deliberately simpler than the illustrated boat; the dedicated
brief records that presentation limit rather than calling it definitive art.

QA rejected an initial large machinery block and an atlas-sized Kurtz after
restoring. The machine is now below deck with a low service hatch. The wrong
`cough` pose was replaced with the existing `coughing` frame. Browser assertions
now inspect the real 768×512 texture crop and 315×210 sprite dimensions, including
after restore; checking only that an image exists was insufficient.

The tests also check renderer pixels against CSS display after resize, panel
and choice bounds, scroll overflow, loaded art and the Pixi'VN error bridge.
No approved Deck illustration, engine system or Metamorphosis scene changed.

Final validation on 2026-10-10: `agent:check` exited 0 (TypeScript, 160/160 unit
tests in 37 files, build in 2.46s). Full `agent:e2e` exited 0 (97/97 cases in
35 files, 34.5 minutes); focused episode E2E also passed 4/4 in 3.6 minutes.
The retained captures are from the corrected focused run. Production code was
unchanged between that run and the final complete regression gate.
