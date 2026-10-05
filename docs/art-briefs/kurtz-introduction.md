# Art Asset Brief — Kurtz, first appearance

## Story
Heart of Darkness.

## Scene and narrative beat
The invalid arrives on an improvised stretcher. Physical exhaustion contrasts
with an unnerving ability to arrest everybody's movement with one gesture.
Source: Conrad, Part III, the stretcher emerging beside the house, followed by
the raised arm and collapse. No gore, later revelations or death.

## Production role
Transparent character sheets, composed in the existing Inner Station.

## Composition
- Fixed three-quarter view matching the station's inked illustration.
- Four equal cells in a 2×2 atlas: weak / commanding / intense / coughing. Identical stretcher,
  baseline, body proportions and registration. Nothing crosses a cell boundary.
- A second two-cell sheet contains the two stretcher bearers, hands held at
  waist level, seen from the same angle. They are individuals, not monsters or
  exotic caricatures. Practical muted work clothes; no weapons.
- The upper left remains reserved for existing dialogue UI.
- Background: the protected station plate; foreground: existing moving mist.

## Art direction
- Shared style: dark cartoon literary graphic novel, bold ink silhouette,
  restrained crosshatching, painterly texture consistent with russian.png.
- Palette: soot, dirty ivory, muddy ochre, muted swamp green.
- Lighting: cool forest light, restrained warm edge on cloth and gaunt face.
- Mood: exhaustion, concentration, authority without triumphant spectacle.

## Character continuity
- Kurtz: bald, hollow cheeks, long bony hands, painfully slender shoulders.
- Worn dark coat, open dirty ivory collar, blanket covering his legs; no gore.
- Weak: reclined, lowered hand. Commanding: supported upright, hand raised.
- Intense: inclined towards Marlow, penetrating gaze. Coughing: head lowered,
  cloth held over mouth. No smiles or comic grimace.

## Technical output
- Kurtz: 1536×1024; four 768×512 cells in a 2×2 layout; transparent PNG.
- Bearers: 2172×724; two isolated full-body drawings; transparent PNG.
- Runtime manifest records native dimensions after generation. Preserve alpha;
  feet and stretcher bottom must share one authored ground baseline.
- Replacements preserve cell ordering/pivots and displayed size; do not modify
  movement or narrative logic to compensate for an incompatible drawing.

Final registration, crops and provenance are documented in
`docs/heart-of-darkness/KURTZ-INTRODUCTION.md`. The first scale pass was revised
after browser inspection to avoid making the invalid larger than his bearers.

## Forbidden
Photorealism, glossy 3D, fashion pose, caricature of ethnicity, gore, fake text,
halo, heroic accessories, inconsistent bodies between poses, baked scenery.
