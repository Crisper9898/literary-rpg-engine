# Evacuation preparation — visual QA

Captured with `tests/e2e/evacuationVisual.spec.ts` on 2026-10-09, using Chromium's
software rendering at both supported resolutions. Runtime illustrations are
unchanged; these are documentation captures of the new playable episode.

| Beat | 1366×768 | 800×600 |
| --- | --- | --- |
| Dawn dialogue and saved blend | [Capture](evacuation-morning-1366x768.png) | [Capture](evacuation-morning-800x600.png) |
| Station and available path | [Capture](evacuation-station-1366x768.png) | [Capture](evacuation-station-800x600.png) |
| Kurtz's coughing body | [Capture](evacuation-cough-1366x768.png) | [Capture](evacuation-cough-800x600.png) |
| His voice and the remembered night response | [Capture](evacuation-voice-1366x768.png) | [Capture](evacuation-voice-800x600.png) |
| Both priority options | [Capture](evacuation-choice-1366x768.png) | [Capture](evacuation-choice-800x600.png) |
| Patient first | [Capture](evacuation-patient-first-1366x768.png) | [Capture](evacuation-patient-first-800x600.png) |
| Secured cot, signal to lift | [Capture](evacuation-lift-1366x768.png) | [Capture](evacuation-lift-800x600.png) |
| Supported transport | [Capture](evacuation-carrying-1366x768.png) | [Capture](evacuation-carrying-800x600.png) |
| Patient arrives before cargo | [Capture](evacuation-patient-landing-1366x768.png) | [Capture](evacuation-patient-landing-800x600.png) |
| Cargo first | [Capture](evacuation-cargo-first-1366x768.png) | [Capture](evacuation-cargo-first-800x600.png) |
| First bundle removed from the path | [Capture](evacuation-cargo-cleared-1366x768.png) | [Capture](evacuation-cargo-cleared-800x600.png) |
| Cot follows the cargo | [Capture](evacuation-cargo-landing-1366x768.png) | [Capture](evacuation-cargo-landing-800x600.png) |
| Restored ready response | [Capture](evacuation-restored-1366x768.png) | [Capture](evacuation-restored-800x600.png) |

26 full frames are retained. Browser assertions verify canvas backing resolution,
visible UI bounds and text overflow at every beat, including both choice buttons.
Manual inspection checks figure grounding, cot/bearer overlap, unobstructed
movement corridor, perspective at the landing and readability over the scene.
The 800×600 view retains its existing letterbox rather than cropping the world.
The cargo branch retains an opaque smaller pile with the same foot anchor and
scaled contact shadow. A transparent ghost-pile revision was rejected before
these final captures; browser assertions now check opacity, reduced occupied
area and unchanged ground position.

The existing Marlow sprite is softer than the station/cast; this task deliberately
preserves it and the approved Deck art. Bearers retain their original poses with
restrained procedural sway. No departure crowd or new illustrations are claimed.
