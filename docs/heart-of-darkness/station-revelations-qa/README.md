# Station revelations visual QA

The browser captures actual Pixi frames after display resizing, with no diagnostic
panel. Each moment has `revelations-<moment>-1366x768.png` and
`revelations-<moment>-800x600.png`.

| Moment | Review purpose |
| --- | --- |
| general | Four physical evidence points in the unchanged station |
| ivory | Excessive accumulation, grounded scale and dialogue |
| palisade-before | Ambiguous ornaments before recognition |
| palisade-after | Dry silhouettes, no gore, slight focus/light change |
| influence | Gathering traces aimed at personal authority |
| report-ideal | Brief idealistic fragment; blank illustrated paper |
| report-annotation | Contradiction rendered as readable actual text |
| russian | Devotion, fear and palisade-dependent reaction |
| choices | Both keyboard/mouse options completely accessible |
| understand | First interpretation and its Marlow reaction |
| kurtz-understand | Subsequent intense existing pose and response |
| brutality | Second interpretation and its Marlow reaction |
| kurtz-brutality | Subsequent commanding existing pose and response |
| final | Colder composition, optional exploration remains available |

Captures are retained from the final full regression run. Browser assertions
check loaded art, display pixel sizing, UI containment and absence of internal
overflow. Human visual inspection checks style, contact, silhouette, palette,
occlusion and narrative focus; passing DOM checks alone is not visual approval.
The probe writes a canonical spatial checkpoint; the test then waits for the
real prompt before pressing E, so it cannot accidentally inspect the previous
object before a movement frame applies the new position.
Evidence approaches use the near side of each object's footprint (10–25 world
units from its pivot); Marlow is not teleported into the box or stool. This makes
feet/contact and the existing painter ordering meaningfully inspectable.

On Windows, retain PNGs only after Playwright's local servers shut down. Copying
large captures into the watched docs tree during a run caused Vite's filesystem
watcher to exit with `EBUSY`; subsequent connection errors were infrastructure,
not passing regression evidence. The full suite is rerun without concurrent
artifact writes; no application or engine workaround is introduced.
The older parallax tests also now wait for the actual conversation HUD after
navigation before reading Pixi's canvas. Their initial `expect.poll` previously
could throw before `Game.init` finished; a rejected getter is not retried by that
assertion. All travel speeds, frame samples, layers, coverage, cleanup and error
checks remain unchanged. No retries or looser thresholds are added.

No source SVG/PNG from the approved Deck, original station or characters is
modified. The new prop atlas uses actual transparency, existing foot-based
depth and cool illumination. No generated document lettering is presented.
Final observations and suite counts: `../STATION-REVELATIONS.md`.
