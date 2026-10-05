# Kurtz visual QA — 2026-10-04

Twenty-two production browser screenshots: eleven moments at 1366×768 and
800×600. `kurtzVisual.spec.ts` captures actual Pixi scenes after two completed
render frames and checks pixel dimensions, nonblack art and visible UI bounds.
The test advances the real introduction progression for repeatable captures;
it does not substitute a static mock scene or change production timing.

| Filename stem | Reviewed moment |
| --- | --- |
| `kurtz-before` | Prepared station before entrance |
| `kurtz-anticipation` | Russian moved aside, localized mist and deepening shade |
| `kurtz-silhouette` | Dark procession approaching behind foreground Marlow |
| `kurtz-full` | Raised arm, arrested bearers, authority contrast |
| `kurtz-russian` | Russian and Kurtz in the same composition |
| `kurtz-coughing` | Bent head and cloth at mouth |
| `kurtz-marlow` | Player approaching the weak invalid |
| `kurtz-choices` | Two completely visible responses |
| `kurtz-intense` | Listening branch and concentrated gaze |
| `kurtz-weak` | Resting posture after first exchange |
| `kurtz-control-returned` | Actual player movement and wide framing |

Append `-1366x768.png` or `-800x600.png`. All moments were visually inspected
in both sizes. A dedicated revision reduced Kurtz's display size from 390×260
to 315×210, brought the bearers closer and cooled his lighting. The final head
scale belongs to the supporting figures; the elevated stretcher is carried,
not floating above a ground-standing actor. Shadows lie at the bearers' feet.
The foreground bearer occludes a pole; Marlow can occlude the approaching
silhouette because the player retains movement and normal depth sorting.

The faces/raised hand remain recognizable at 800×600. Dialogue and both choices
fit without clipped buttons or text. The upper-left panel leaves the procession
and house readable. The approved Deck's illustrated ink/palette and the station's
Russian serve as continuity references; no protected scene was redesigned.

These are visual/composition checks, not human audio approval or a physical-GPU
performance certification. The transport uses restrained sway, not a new full
bearer animation sheet. Slight differences in pose between the two resolutions
are possible because the live world keeps advancing between screenshots.
