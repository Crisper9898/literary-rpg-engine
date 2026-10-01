# Art Asset Brief — Journey deck encounter plates and cast

## Story
Heart of Darkness — The Journey.

## Scene and narrative beat
Marlow approaches a working sailor beside the cargo while the steamer continues upriver. The river first suggests distance and uncertainty; a question about the cargo turns attention toward an erased destination. These are complementary plates for **this encounter**, not a general replacement for every scene.

## Production role
Coordinated background, middle-distance bank, foreground ship fittings, and two character animation sheets. Deliver separate layers so existing parallax, weather, camera and actor movement remain live. The current code-drawn ink composition defines the blocking until these pieces are approved.

## Blocking references
These captures document the current staging and UI safe areas, **not** a finished
illustration style to imitate pixel for pixel:

- [Deck at 800×600](reference/journey-deck-800.png): initial actor scale, cabin,
  rope, cargo and the fitted 16:9 frame.
- [Conversation at 1366×768](reference/journey-dialogue-1366.png): left dialogue
  panel, two actors, cargo and the broad water passage.
- [Deep fog at 800×600](reference/journey-deep-fog-800.png): silhouettes and UI
  must remain distinguishable through the deepest atmosphere.

## Coherent first-pass delivery
Supply one coordinated set, with the same palette, light direction and ink
treatment. The names below are delivery identifiers, not existing runtime paths;
no file should be wired into the game before the set passes visual review.

| Piece | Delivery file | Separation and registration |
| --- | --- | --- |
| Sky and dark water base | `journey-sky-water.webp` | Opaque 1920×1080 plate; leave moving currents to their own layer. |
| Distant ridge | `journey-distant-ridge.webp` | Transparent 1920-pixel-wide, horizontally seamless strip. |
| Far vegetation | `journey-far-vegetation.webp` | Transparent 1920-pixel-wide, horizontally seamless strip. |
| Near bank | `journey-near-bank.webp` | Transparent 1920-pixel-wide, horizontally seamless strip. |
| Current marks | `journey-river-current.webp` | Transparent 1920-pixel-wide, horizontally seamless water detail. |
| Foreground reeds | `journey-foreground-reeds.webp` | Transparent 1920-pixel-wide, horizontally seamless near-water silhouettes. |
| Deck plane and cabin | `journey-deck-base.webp` | Separate deck/cabin art on a transparent 1920×1080 plate; no actors or UI. |
| Fittings and foreground rail | `journey-deck-fittings.webp` | Transparent plate with rail/lines able to overlap actor feet. |
| Cargo and tally | `journey-cargo.webp` | Transparent prop; leave the tally's lettering blank for runtime text. |
| Marlow | `marlow-sheet.webp` | Transparent aligned idle/walk frames with a documented common foot pivot. |
| Sailor | `deckhand-sheet.webp` | Transparent aligned idle/walk/work/turn frames with a documented common foot pivot. |

For each moving strip, the left and right edges must meet without a visible
seam. Keep each parallax depth separate: the current scene moves ridge, far
vegetation, near bank, current and reeds at different rates. The deck and cargo
stay fixed in the world while the river travels. Character sheets must keep
their feet at the same registration point in every frame, so movement and NPC
routine poses do not jump. Include a small frame map with frame bounds, foot
pivot and intended facing for each sheet. Runtime typography, dialogue,
interaction prompts, fog and light changes remain in code; do not bake them
into any image.

The current geometry provides reference coordinates, not a demand for exact
tracing: world 1920×1080; walkable deck x=400–1520, y=660–860; Marlow starts
at (650, 760); the sailor's work station is around (1080, 740); the cargo sits
around x=1390–1515 and y=552–675. Preserve the same readable relationships
through camera follow, not just in a single still frame.

Acceptance requires checking the assembled set at 1366×768 and 800×600 in
idle, dialogue-choice and deep-fog beats. Reject a partial replacement that
leaves illustrated actors on code-drawn or stylistically incompatible plates.
Final files may use a different format after approval; that changes only this
story's asset paths and composition, never `src/engine/`.

## Runtime handoff and provisional status

All eleven pieces now have distinct replaceable slots in
`src/story/heart-of-darkness/journeyArtAssets.ts`. Until coordinated art is
approved, each slot draws an ink-and-wash vector composition in the same scene.
No unapproved image is silently substituted. Add a `url` to a manifest entry
only after its plate passes the assembled-scene review. The reusable
`createVisualAssetSlot()` helper in `src/ui/` loads it asynchronously, keeps the
vector art on failure, and removes late loads when the scene is destroyed.

The first nine entries use 1920×1080 logical plates at world origin. Moving
strips must keep both horizontal edges seamless. `riverCurrent` is clipped to
the water band (x 0–1920, y 500–1080). The current ridge, vegetation, near-bank
and current tiles are compressed vertically to 82% by the story composition;
deliver art for that assembled height or adjust only that composition when
reviewing a coordinated set. Deck and cargo remain in world coordinates. The
foreground fittings overlap actor feet, while contact shadows and warm cabin
light are independent runtime cues that remain after an art swap.

Both sheets have 160×160 source frames in one horizontal row. Marlow uses
idle/walkA/walkB (sheet width 480); the sailor uses idle/walkA/walkB/coilA/
coilB/cargo/lookout (sheet width 1120). Every frame pivots at source pixel
(80, 142), centered on the floor contact point; the visible figure should
occupy roughly the upper 110 pixels above that point, matching the current
character scale. Do not paint a cast shadow into a frame. The engine receives
only the active frame state and a generic feet-based draw order; character
positions, task poses and Pixi'VN dialogue are unchanged.

## Composition
- Camera/framing: 1920×1080 logical world in a 16:9 canvas. At an 800×600 browser viewport, the canvas is fitted at 800×450 with letterbox space above and below; compose for that smaller displayed size without relying on a 4:3 crop. View Marlow and the sailor at human scale on the same deck plane, cargo to their right, open water and shore behind.
- Character position: feet near world y=760; sprites may move independently across the walkable deck. Do not bake characters into background art.
- Negative space reserved for UI: upper-left 34% of the canvas for the active dialogue panel, upper-right 35% for the approach prompt, and a narrow margin near the bottom for controls. Keep faces, hands, cargo markings and key river details clear of those regions. The river must remain readable around the translucent dialogue, not hide its entire surface.
- Foreground elements: inked rail, hanging line and occasional dark vegetation silhouette, on transparent layers with deliberate occlusion of lower legs.
- Midground elements: angular deck planks, cabin, coiled rope and marked cargo in the same perspective and line weight.
- Background elements: broad current with broken reflections, a near bank and a distant compressed ridge, each separate and horizontally tileable where movement requires it.

## Art direction
- Shared style: literary gothic graphic novel, hand-illustrated feel, strong silhouette, controlled texture.
- Story-specific palette: soot black, aged paper, swamp green, muddy ochre, fog gray; ember orange only where the cargo question or distant light needs attention.
- Lighting source: low obscured sky and a faint warm cabin light. The same direction and value range must light people, cargo and deck.
- Mood: oppressive heat, damp air, uncertainty; suggest depth through large contrasting masses rather than photographic detail.
- Style anchor: the existing code-drawn slice and the palette discipline of La metamorfosis, not the rejected painted cutouts or photoreal wood.

## Character continuity
- Character: Marlow and the working sailor as separate transparent sheets.
- Clothing: worn nineteenth-century travel coat for Marlow; practical rolled-sleeve ship clothing for sailor, distinct silhouette and muted value.
- Face/hair identifiers: simplified expressive faces legible at about 110 logical pixels tall; consistent ink edges.
- Pose: each needs idle and walk states; sailor additionally coils rope, inspects cargo, looks toward the bank and turns to Marlow. Feet registration must be identical across frames.
- Expression: alert restraint for Marlow; work-worn caution for sailor. No portrait-like frontal pose.

## Technical output
- Resolution/aspect ratio: background plates 1920×1080 minimum, with tileable river/bank segments 1920 logical pixels wide; layered transparent PNG/WebP for foreground and actors.
- Transparent background: yes for bank/foreground/actor sheets; no for distant sky plate.
- Safe crop zones: keep essential faces, cargo and interaction props legible when the entire 16:9 canvas is displayed at 800×450 CSS pixels. Leave low-detail space behind the upper-left dialogue panel and the upper-right approach prompt.

## Forbidden
Photorealism, glossy 3D look, fashion portrait pose, generic fantasy concept art, plastic skin, random accessories, fake text, mixed visual styles, over-detailed noise. Do not paint foreground plants into the sky plate or bake a dialogue panel into any image.
