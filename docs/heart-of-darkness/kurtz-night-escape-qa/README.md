# Kurtz's night escape — visual QA

The 24 PNGs in this directory are the final Chromium captures from
`tests/e2e/nightEscapeVisual.spec.ts`, inspected at 1366×768 and 800×600.
Each moment has `night-<moment>-1366x768.png` and
`night-<moment>-800x600.png`.

| Moment | What was inspected |
| --- | --- |
| station | Cold station, distant light, low mist and free walking after dusk |
| empty | Empty blanket/bed visible before the explanatory E line |
| first-clue | Crushed grass and short observation without a navigation marker |
| tracking | Palm/knee marks; Marlow's full legs remain in front of the report box |
| forest-entry | Clear ground strip, collapsed Kurtz and distant ordinary followers |
| encounter | Unsteady upright pose, character scale, feet and contact shadows |
| dominant | Commanding gesture and subtly more visible background people |
| choice | Full question and both accessible options |
| reason | Softer bracing pose and the appeal to returning tomorrow |
| challenge | Commanding pose and Marlow's firm reply |
| return | Kurtz back at rest; night remains, ambient relief is partial |
| restore | Exact selected child dialogue and pose reconstructed through Pixi'VN |

At both sizes the text/buttons and both characters are fully contained.
The scene uses the established contain framing; 800×600 has intentional bars.
The two earlier QA defects were corrected before these captures: the middle
trace approach no longer hides Marlow's legs behind the report prop, and the
atlas background is alpha-zero rather than a rectangular amber halo.
The original Marlow sprite's softness remains unchanged, as requested.

Functional browser tests separately exercise real WASD movement during
dialogue, escort motion/stop, both branches, saved transition/partial traces,
active choices/child labels, exact saved coordinates, return and duplicate-free
reconstruction. Test positioning helpers shorten repeated long traversal; they
are not exposed by the production game. The visual test waits for completed
Pixi frames after resize, checks loaded art and rejects clipped/scrolling UI.

To play: finish the station revelations, return to the left landing and use
E to keep watch; examine the empty rest, follow grass → mud → branches,
enter the clearing, approach Kurtz and choose 1/2. Walk beside him toward the
right exit, pausing when he falls behind, then use E to return and listen.

The route is a compact stage, not a free forest. The escort uses a matching
support pose with mild sway, not a paired skeletal walk. No global art polish,
combat, new save format, final speech or later episode was added.
Audio mixing/silence is validated through real Pixi channels; final human
listening and physical-GPU performance are not claimed by screenshot QA.
