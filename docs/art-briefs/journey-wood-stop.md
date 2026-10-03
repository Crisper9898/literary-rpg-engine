# Art Asset Brief — Abandoned wood station

## Story
Heart of Darkness, part II, wood stop before the fog-bound approach to the Inner Station.

## Scene and narrative beat
Marlow disembarks at an apparently empty reed hut. Prepared firewood promises
help; an unsigned warning and a worn seamanship book suggest an absent person.
The next reach feels less certain. This is a new scene, not a replacement of the
approved Journey Deck. Reference style: approved Journey illustrations.

## Production role
One static environment plate, without characters, UI or legible lettering.
Actors, contact shadows, moving fog and interaction cues remain separate.

## Composition
- Camera/framing: wide illustrated theatre, 16:9, grounded side-on perspective.
- Character position: foot corridor x320–1620, y650–870 in a 1920×1080 canvas.
- Negative space reserved for UI: upper-left x80–740,y80–420, low-contrast foliage.
- Foreground: muddy bank, roots, sparse reeds framing the bottom edges.
- Midground: open earth path; reed hut left-center, entrance/book at (590,700);
  carefully stacked cut logs right-center at (1270,690), weathered blank board at
  (1360,660); short landing at lower-right (1560,850), tied steamer off-frame.
- Background: oppressive swamp-green jungle, a narrow cold river visible on the
  right, layered far silhouettes and mist. A leaning pole with a torn flag.

## Art direction
- Shared style: dark cartoon literary graphic novel, bold ink edges, authored
  brush textures matching Marlow's approved sprites, no photorealism.
- Palette: soot black, swamp green, muddy ochre, fog gray, aged-paper highlights.
- Lighting: cold dusk through canopy, small muted amber accents; no new fire.
- Mood: absence, recent human work, uneasy silence; keep props distinguishable.

## Character continuity
No characters in the plate. Reuse the approved Marlow and deckhand motion sheets.

## Technical output
- Resolution/aspect ratio: 1920×1080 logical canvas, 16:9 image.
- Transparent background: no; opaque environment plate.
- Safe crop zones: keep hut, logs, board, book and landing within central 90%.
- Runtime source: `/assets/art/journey-wood-stop/wood-station.png`.
- Generation: built-in image tool; the final prompt is this composition and style
  brief, with the approved dusk capture supplied only as a style reference.

## Forbidden
Photorealism, glossy 3D, generic fantasy, new characters, embedded UI, fake text,
burning forest, pasted character art or a redesigned Journey Deck.

## Integrated registration
The generated PNG is 1672×941 pixels, mapped to the 1920×1080 logical plate
without destructive image editing. Integration follows the resulting prop
locations: book (510,710), firewood (1150,720), board (1380,710), sailor
(1460,780), landing/boarding (1610,850). The bounded foot corridor is
x320–1620, y700–875; the movement footprint keeps feet inside it. Actor sources,
scale and foot pivots come from the existing approved motion manifest. These
integration values refine the initial brief after visual inspection; the
generation prompt above is retained as production provenance.
