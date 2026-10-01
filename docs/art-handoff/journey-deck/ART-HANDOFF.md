# Journey Deck — visual replacement handoff

This package freezes the **current composition**, not the final drawing style. The eleven SVGs in `public/assets/art/journey-deck/` are technical references for staging, registration, overlap, palette and motion. Produce replacement art outside this pass, then swap one URL at a time in `src/story/heart-of-darkness/journeyArtAssets.ts`. No change to `src/engine/`, gameplay or narrative state is required.

## Frame references

| Image | What to inspect |
| --- | --- |
| [Master, 1366×768](journey-master-reference.png) | Full deck with Marlow, working sailor, cabin, tally, cargo, layered river and near reeds. |
| [Master, 800×600](journey-master-reference-800x600.png) | Same camera composition under the game's 16:9 contain fit: 800×450 game area, vertically centered. |
| [Dialogue](journey-dialogue-reference.png) | Actual sailor dialogue and controls over the scene; faces, rope and cargo remain readable. |
| [Deep atmosphere](journey-atmosphere-reference.png) | Progress 1: distant shore and current soften, while actors, deck, cargo and rail remain legible. |
| [11-piece contact sheet](journey-assets-contact-sheet.png) | Each unmodified SVG viewed separately; checkerboard marks transparent pixels. The current marks are intentionally subtle. |

The two master images and the atmosphere image are direct browser captures at camera focus **(960, 650)** and zoom **1.5**, the scene's normal zoom. The first two use voyage/atmosphere progress about **0.22**, the deep image uses **1.0**. The story selector and ordinary HUD/title were hidden **only during these clean reference captures**; the dialogue reference leaves the real dialogue and gameplay controls visible. Actors and river layers continued to update, so their individual animation frames and parallax offsets can differ between captures. No scene data or source art was edited to make the images.

## Coordinate system and assembly

- World and logical game canvas: **1920×1080**, origin at upper left, +x right, +y down. The browser contains this 16:9 canvas; at 800×600 there are 75 px of letterbox above and below the 800×450 image. Never design essential detail in those bars.
- Default gameplay camera follows Marlow at zoom **1.5** with an upward offset of 160 world units. The reference stills use a temporary camera focus solely to place the cabin and cargo in one frame. Art must also work as the camera follows and Marlow walks x=400…1520, y=660…860.
- The scene orders `environment → ground → actors → foreground`. The sky is opaque. Ridge, two shore bands and current travel independently behind the vessel. The deck, cabin and cargo stay in world coordinates. Fittings and near reeds overlap the front of the deck and feet. Runtime lighting, fog, typography, interaction text and contact shadows are **not** part of the image files.
- Dimensions below are the SVG's intrinsic pixel dimensions and the sizes configured in `journeyArtAssets.ts`. Transparent plates have cropped view boxes: their **manifest x/y restores the original 1920×1080 staging**. The four shore/current bands use additional runtime vertical scale **0.82**. A new raster image should match the listed pixel canvas and registration instead of adding transparent padding or recentring its painted content.

## Exact eleven-piece map

`ID` is the object key in [`journeyArtAssets.ts`](../../../src/story/heart-of-darkness/journeyArtAssets.ts); filenames below are relative to `public/assets/art/journey-deck/`. Positions are world coordinates before camera/parallax transforms. `Top-left` means image anchor (0,0); actor pivots are specified per frame.

| ID / file | Source size; alpha | Anchor; position; display scale | Layer and depth | Relationship and protected content |
| --- | --- | --- | --- | --- |
| `skyWater` · `journey-sky-water.svg` | 1920×1080; **opaque** | Top-left (0,0); (0,0); 1×1 | Environment base; no independent parallax | Holds sky and dark water below all moving shore/current layers. Keep a low-detail passage behind dialogue. No plants, deck, text or fog baked in. |
| `distantRidge` · `journey-distant-ridge.svg` | 1920×150; transparent | Top-left; (0,340); 1×0.82 | Environment; parallax x-depth **0.08**, travel **5** world units/s | Rear silhouette above far vegetation; seamless at left/right tile edges. Keep its value distinct under deep fog. |
| `farVegetation` · `journey-far-vegetation.svg` | 1920×155; transparent | Top-left; (0,355); 1×0.82 | Environment; x-depth **0.25**, travel **14**/s | Layered behind near bank and water passage. Preserve the horizon interval and tile seam. |
| `nearBank` · `journey-near-bank.svg` | 1920×105; transparent | Top-left; (0,425); 1×0.82 | Environment; x-depth **0.5**, travel **30**/s | Shoreline and reflection nearest the ship, still behind deck. Tile edge must join cleanly. This layer also supplies voyage distance. |
| `riverCurrent` · `journey-river-current.svg` | 1920×565; transparent | Top-left; (0,510); 1×0.82 | Environment; x-depth **0.8**, travel **58**/s | Sparse moving water marks over `skyWater`, beneath deck and actors. Marks stay in water; do not paint a solid water rectangle. Tile horizontally. |
| `foregroundReeds` · `journey-foreground-reeds.svg` | 1920×190; transparent | Top-left; (0,890); 1×1 | Foreground; x-depth **1.15**, travel **90**/s | Nearest water silhouettes in front of the vessel's low edge. Leave faces, hands, cargo and UI safe areas clear. Tile horizontally. |
| `deckBase` · `journey-deck-base.svg` | 1550×480; transparent | Top-left; **(205,470)**; 1×1 | Ground; fixed in world | Painted deck plane and cabin as one plate. Cabin is at world x≈330–570, y≈480–640; deck extends roughly x≈220–1740, y≈590–935. Match the plank perspective and actor floor plane. |
| `deckFittings` · `journey-deck-fittings.svg` | 1400×410; transparent | Top-left; **(255,540)**; 1×1 | Foreground; fixed in world | Rear rail around y≈555–610 and front rail around y≈900–930; mooring line at the right. Drawn in front of feet/cargo where appropriate; avoid covering faces or the dialogue region. |
| `cargo` · `journey-cargo.svg` | 1110×170; transparent | Top-left; **(420,540)**; 1×1 | Ground; fixed in world | Includes left tally/sign position near x≈420–490 and right crate near x≈1390–1515. They are separated within one canvas. Leave tally lettering blank: `DEST.` is runtime text. Preserve both locations and the crate's floor contact. |
| `marlowSheet` · `marlow-sheet.svg` | **480×160**, 3 horizontal 160×160 frames; transparent | Each frame pivot **(80,142)** at actor feet; frame display 160×160, scale 1×1. Starts at **(650,760)**, then moves. | Actors; draw order follows actor **y/feet** | Frame order: idle x=0, walkA x=160, walkB x=320. Keep all feet aligned, silhouette consistent and facing/lighting coherent with deck. Runtime supplies contact/cast shadow and movement. |
| `deckhandSheet` · `deckhand-sheet.svg` | **1120×160**, 7 horizontal 160×160 frames; transparent | Each frame pivot **(80,142)** at actor feet; frame display 160×160, scale 1×1. Work station ≈**(1080,740)**; NPC follows a route. | Actors; draw order follows actor **y/feet** | Frame order: idle 0, walkA 160, walkB 320, coilA 480, coilB 640, cargo 800, lookout 960. Rope must pass visibly through the hands in both coil frames; task poses must not jump at the feet. |

The two sheets are sliced from one image each; **the source sheet width is not the displayed actor width**. The actor's position is its feet point, not the sheet's upper left. Parallax layer x-position changes at runtime and has a 1920-unit repeat period; the listed x=0 is source registration, not a fixed on-screen x.

## Replacement contract

1. Deliver **eleven independent files**, one per manifest key. PNG or WebP is acceptable if the dimensions and alpha match the table. Replace only the corresponding story manifest `url` after approval. Do not rename keys or change engine/gameplay modules.
2. Preserve each plate's pixel canvas, cropped origin, top-left anchoring and existing `x/y/width/height`; preserve all actor frame rectangles and foot pivots. If an artist needs a different crop or sheet grid, treat that as a deliberate manifest-only integration change and re-run visual QA before accepting it—never silently distort artwork to fit.
3. Opaque `skyWater` must cover the full logical world. Every other plate needs real alpha, with no colored rectangle behind the illustration. Do not pre-composite multiple depths, actors or UI into one file.
4. Ridge, far vegetation, near bank, current and reeds must **tile seamlessly at x=0/1920**. Retain separate planes so their five velocities and camera depths continue to create movement. Keep current marks sparse and avoid a harsh straight water seam.
5. Align Marlow's three frames and the sailor's seven frames to **160×160 cells with pivot (80,142)**. Keep soles at the same y in all frames and enough transparent room for limbs/rope. The sailor's work with the rope should be readable at normal game scale, including 800×600.
6. Match the same ink edge, palette, light direction and material treatment across people, ship and river. Leave runtime contact shadows, cabin/beat lighting, fog, tally text, chapter title, conversation and controls unpainted; these remain dynamic and should not appear twice.
7. Validate each swapped asset in motion, dialogue and deep fog at **1366×768 and 800×600**. Check cabin/cargo visibility, text contrast, actor grounding, foreground overlaps, no clipped poses, no obvious tile seams and no texture-load fallback. The game must retain the existing interaction and save/restore behavior.

The source manifest is the integration authority. This document records its state at handoff; if the manifest later changes, update this table with the approved art rather than inferring placement from a screenshot alone.
