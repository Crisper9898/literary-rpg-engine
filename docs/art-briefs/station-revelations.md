# Art Asset Brief — Station evidence atlas

## Story
Heart of Darkness, Revelations of the Station, after the first Kurtz exchange.

## Scene and narrative beat
The same station becomes legible as a place of accumulation, personal domination
and violence. Evidence is spatial, not a checklist. No gore or supernatural signs.

## Production role
Five transparent illustrated prop cells: ivory, distant palisade, revealed
palisade, gathering traces, report. Existing background and characters are protected.

## Composition
- Camera/framing: match the station's low, three-quarter illustrated ground plane.
- Character position: no new characters; preserve Marlow, Russian and stretcher.
- Negative space reserved for UI: top-left; props occupy mid/lower world.
- Foreground elements: scuffed cloth and report resting on a low wooden box.
- Midground elements: excessive tusks and meeting traces facing the house.
- Background elements: three sparse leaning stakes, inconspicuous from afar.

## Art direction
- Shared style: inked literary graphic novel, controlled textured paint.
- Story-specific palette: soot, gray-green, dirty ivory, tobacco; no vivid red.
- Lighting source: cool overcast upper-left rim, grounded soft contact shadows.
- Mood: quiet, oppressive; recognizable objects without photorealism.

## Character continuity
No character replacements. Palisade reveal uses tiny dry human head silhouettes,
mostly turned away, dark hair/profile and closed eyes; no blood, wounds or exposed
bone. The distant version is the exact same stakes in uninformative shadow.

## Technical output
- Resolution/aspect ratio: 1536×1024, three columns/two rows of 512×512.
- Transparent background: yes, including cell gutters. No checkerboard baked in.
- Safe crop zones: 30px gutters; foot/contact pivot (256,470) in each cell.
- Row 1: abundant tusks / distant stakes / identical revealed stakes.
- Row 2: worn mats, sandals and a stool arranged toward an absent authority /
  blank worn report pages on a low box / empty transparent cell.
- Runtime target widths: 340/300/300/240/190 logical pixels. The report's words
  are rendered by Pixi'VN, never generated lettering.

## Forbidden
Photorealism, glossy 3D, magic, invented tribal symbols, ethnic caricatures,
explicit gore, fake text, background rectangles, mismatched linework.

## Integrated production result
Built-in imagegen, 2026-10-04/05, referenced only the existing
`public/assets/art/journey-inner-station/station.png` for style/ground plane.
Selected result: `exec-b38ac041-0933-4ae4-941a-3ac7bd363f39.png`, copied as
`public/assets/art/station-revelations/evidence.png` (1536×1024 RGBA).
The generated forms exceed nominal gutters slightly: the runtime manifest uses
the actual 585/455/496px top regions and 560/500px lower regions instead of
cutting objects at guessed equal cell edges. No background/character asset was
edited and no generated text was integrated. These five regions are four props
plus the second visual reading of the palisade, not five independent clues.
