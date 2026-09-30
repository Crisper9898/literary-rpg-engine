# Art Asset Brief — Journey deck encounter plates and cast

## Story
Heart of Darkness — The Journey.

## Scene and narrative beat
Marlow approaches a working sailor beside the cargo while the steamer continues upriver. The river first suggests distance and uncertainty; a question about the cargo turns attention toward an erased destination. These are complementary plates for **this encounter**, not a general replacement for every scene.

## Production role
Coordinated background, middle-distance bank, foreground ship fittings, and two character animation sheets. Deliver separate layers so existing parallax, weather, camera and actor movement remain live. The current code-drawn ink composition defines the blocking until these pieces are approved.

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
