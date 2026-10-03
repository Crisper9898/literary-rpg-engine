# Journey Deck technical polish — 2026-10-02

Approved reference: `1761bf2e94c8e1ac019403a1977a73b8fa30b0e0`, tagged
`journey-deck-visual-approved-2026-10-02`. This pass preserves the composition,
eleven illustration slots, original resting/work/emotion cells, progressive
darkness, shadows, fire, smoke, river planes and dialogue layout.

## Measurements and cause

Chromium / SwiftShader, one Playwright worker, 1366×768 CSS viewport, DPR 1.
The component probe uses a controlled night stage (.78), warms three actual
ticker frames, then samples eighteen frames per mode. It changes rendering only;
the simulation, camera and existing 50 ms tick cap remain active.

| Controlled experiment | FPS | Output pixels |
| --- | ---: | ---: |
| Approved renderer, MSAA 4 samples, native backbuffer | 4.3 | 2,073,600 |
| Approved renderer without fog | 5.0 | 2,073,600 |
| Approved renderer without vegetation/embers | 4.9 | 2,073,600 |
| Simulation with rendering suppressed | 60.3 | — |
| MSAA disabled, native backbuffer | 6.9 | 2,073,600 |
| MSAA disabled, native backbuffer without fog | 8.1 | 2,073,600 |
| MSAA disabled, native backbuffer without vegetation/embers | 7.8 | 2,073,600 |
| MSAA disabled, display-sized backbuffer, all effects | 13.2 | 1,048,320 |
| MSAA disabled, display-sized backbuffer without fog | 15.4 | 1,048,320 |
| MSAA disabled, native backbuffer repeated | 7.0 | 2,073,600 |

The dominant measured cost is software rasterization/fill and multisampling of
overlapping illustrated/translucent planes, followed by CSS downscaling of a
1920×1080 buffer. Fog has a smaller real blending cost, but removing it would
damage the approved depth. Vegetation/embers removal has a smaller gain too.
The fixed **eighteen** ember objects are retained. No particle
pool or scenery layer was reduced. Atmosphere shading already uses inherited
tint rather than a fullscreen filter. Simulation-only ~60 FPS rules out its
controller math as the principal bottleneck in this experiment.

WebP compression affects loading/decoding, not compression work every frame.
The earlier approved-pass SVG/WebP comparison did not materially improve the
same rendering geometry. This pass therefore keeps the approved WebP images,
texture sizes, transparencies, smoke and reflection plates intact.

## Changes

- Journey alone starts Pixi'VN with MSAA disabled; other works retain their
  original antialias setting. Illustrated edges already contain antialiasing.
- `src/ui/attachDisplayResolution.ts` matches the buffer to visible device
  pixels, capped at native resolution. It observes Pixi'VN's existing canvas
  CSS/parent size, preserves its CSS and original logical dimensions, disconnects
  both observers and restores resolution on scene destruction. Physical pixel
  rounding may leave less than one pixel of fractional `renderer.screen`
  remainder; subsequent resizes use the initial dimensions so it cannot grow.
  World coordinates, camera bounds, interaction radii and saves do not change.
- Journey and Metamorphosis scene modules load on their existing Pixi'VN start
  labels. No alternate scene loader/state system was added.
  Each entry disposes its previous scene/checkpoint writers **before** awaiting
  the module. The existing held-key restart regression caught old coordinates
  being written back into newly reset Pixi'VN storage during that async gap;
  cleanup closes it without changing the engine or the saved label step indices.
- Motion's shared runtime is separately cacheable. The largest shared chunk
  falls from 602.12 to **463.99 kB** minified (115.94 kB gzip); Journey's scene
  chunk is 38.52 kB, Metamorphosis 12.90 kB, Motion 61.08 kB. The 500 kB warning
  disappears without raising its threshold. This is chunk splitting, not a claim
  that all initial JavaScript shrank to the small entry chunk.
- Browser fixtures now wait for the scene's interaction UI before sending
  input or replacing it, rather than treating the earlier empty canvas as
  scene readiness. Existing speed, dialogue, choice and save assertions remain.

## Walking asset extension

Two transparent six-pose walk sequences were generated with the built-in image
tool, using the approved actor sheets as identity/style references. They extend
the sheets; every original resting, rope/cargo/lookout and emotional cell remains
at its original offset. No background or character redesign was performed.

| Runtime asset | Sheet | New cells | Registration |
| --- | --- | --- | --- |
| `marlow-motion-sheet.webp` | 1760×160 | x800…1600, six 160×160 cells | pivot (80,142), figure height 130, same 1.32× display scale |
| `deckhand-motion-sheet.webp` | 2400×160 | x1440…2240, six 160×160 cells | pivot (80,142), figure height 125, same 1.32× display scale |

Generation briefs: preserve the reference's mature face, hat, clothing, ink
contours, muted palette and motivated warm edge light. Six consecutive phases
of a right-facing cartoon walk, full figure and feet visible, alternating leg
contact/passing and opposite arm swing, one level foot baseline, transparent
background. Marlow keeps his dark long coat/suit and hat; the deckhand keeps his
cap, rolled-sleeve green work shirt and dark trousers. No scenery, text, new
accessories or rope in the walking cells; the approved rope-work cells are retained.

Raw generated inputs are in `motion-sources/`. Offline regeneration of runtime
sheets, using Python with Pillow (no new application dependency):

```powershell
python scripts/prepare-journey-motion.py docs/art-handoff/journey-deck/motion-sources/marlow-walk.png docs/art-handoff/journey-deck/motion-sources/deckhand-walk.png
```

The preparation script ignores near-transparent padding for registration and
appends lossless WebP cells without altering the approved source region. The
story-only `JourneyWalkCycle` selects poses by actual distance travelled, with
subtle lift/sway; stopping, hitting an edge or restoring a position does not run
an idle walk. No animation framework or engine/state modification was added.

## Visual QA and final gates

Stage measurements from the final full-suite run, 24 live frames per viewport,
all effects active (DPR 1). These are diagnostic samples, not machine-independent
FPS assertions. Captures in `technical-qa/` are separate from the approved
`illustrated-qa/`.

| Stage | 1366×768 FPS | 800×600 FPS |
| --- | ---: | ---: |
| Dusk | 13.9 | 37.1 |
| Jungle | 12.3 | 33.4 |
| Deep darkness | 13.8 | 37.4 |
| Fire | 14.5 | 39.5 |

The approved-pass diagnostic was 4.4–5.8 FPS at desktop size. The controlled
night comparison improves from 4.3 to 13.2 FPS (~3.1×), retaining all effects.
No separate pre-change 800×600 sample is claimed.

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| Dusk | [capture](technical-qa/journey-dusk-1366x768.png) | [capture](technical-qa/journey-dusk-800x600.png) |
| Jungle | [capture](technical-qa/journey-jungle-1366x768.png) | [capture](technical-qa/journey-jungle-800x600.png) |
| Deep darkness | [capture](technical-qa/journey-darkness-1366x768.png) | [capture](technical-qa/journey-darkness-800x600.png) |
| Fire | [capture](technical-qa/journey-fire-1366x768.png) | [capture](technical-qa/journey-fire-800x600.png) |
| Fire/dialogue | [capture](technical-qa/journey-fire-dialogue-1366x768.png) | [capture](technical-qa/journey-fire-dialogue-800x600.png) |

Remaining limits: SwiftShader still cannot guarantee 60 FPS at desktop size;
native 1920×1080 and high-DPR views cost more. The unchanged 50 ms simulation
cap still slows travel below 20 rendered FPS. Smoke/flames remain illustrated
planes with live embers. Six small actor cells improve gait/silhouette, not
portrait-level facial detail. These software measurements do not predict a
hardware GPU's FPS; human environmental-audio listening remains separate.

### Closeout — 2026-10-03

All ten retained captures were visually inspected. Both sizes preserve the
approved dusk → jungle → deep darkness → fire composition, river separation,
smoke, contact/projected shadows and readable dialogue. The 800×600 view keeps
its existing contained/letterboxed framing; characters, controls and dialogue
are not accidentally cropped. Disabling MSAA did not visibly degrade the
illustrated contours at these display sizes. Original source art and historical
approved captures are unchanged.

`npm run agent:check` passed TypeScript, **102/102 unit tests in 24 files**, and
the production build without the previous >500 kB chunk warning.
The final complete `npm run agent:e2e` passed **61/61 tests in 18 files**, about
**12.9 minutes**. Its final `.last-run.json` reports `passed` with no failed
tests. Coverage includes both compiled scene entries, six live walking cells,
renderer resizing/cleanup, original movement/restart/diagonal assertions,
independent NPC routines, dialogue/choices, parallax, fog, audio, cargo and
Pixi'VN saves, plus the existing Metamorphosis room/hallway narrative coverage.
Total: **163 tests**. The final gate did not use a subset or disable failures.

The Phaser stash and two preexisting untracked files are excluded from this
milestone. The checkpoint tag and technical-polish commit are published on the
existing branch as requested; no other milestone is started.
