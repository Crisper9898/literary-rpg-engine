# Art Asset Brief — Inner Station clearing and Russian visitor

## Story
Heart of Darkness, conclusion of part II.

## Scene and narrative beat
The steamer reaches a clear bank beneath a decaying hilltop house. The Russian's
brightly patched clothing and shifting expression contrast with oppressive
stillness. Kurtz is nearby but neither visible nor speaking in this milestone.

## Production role
One illustrated environment plate plus transparent three-pose character sheet.
Runtime fog, foreground foliage, moving water, contact shadows and character
depth remain separate layers. No dialogue or text baked into either image.

## Composition
- Camera/framing: elevated three-quarter wide theatrical shore, 16:9.
- Character position: inspected walking band y=690..820 in logical 1920×1080;
  Russian around x=1200,y=780, Marlow arrives near x=420,y=745.
- Negative space reserved for UI: upper-left x=80..650,y=60..410, subtle trees.
- Foreground elements: bank/water at bottom, cropped roots at corners, no wall.
- Midground elements: worn bank path, old planks near x=500,y=735, disused fence
  rails near x=750,y=760, trampled grass x=1030,y=820, hill path x=1480,y=735.
- Background elements: sparse-tree clearing, high grass, long mud-walled house
  at upper right with peaked broken roof and three unequal dark window holes;
  dense forest beyond. No complete fence, crowds, ghosts or character on roof.

## Art direction
- Shared style: approved Deck's inked cartoon graphic novel, restrained texture.
- Story-specific palette: cold swamp teal, soot, damp ochre, faded gray/ivory.
- Lighting source: dim cold sky fill, narrow pale rim on wet wood and figures.
- Mood: unsettling stillness, readable shadows, not generic fantasy or all black.

## Character continuity
- Character: Russian trader, 25, beardless youthful pale face, little blue eyes,
  weathered nose, large cart-wheel straw hat. Not a clown or military uniform.
- Clothing: brown holland jacket/trousers, neatly stitched faded blue/red/yellow
  patches at knees/elbows/body, scarlet lower-trouser edging, worn boots.
- Face/hair identifiers: same face and hat in all frames; no random accessories.
- Pose: equal-size full-body triptych: eager open-palmed greeting; nervous hand
  near chest looking toward house; fervent wide-armed explanation.
- Expression: enthusiasm mixed with strain, worry, intense admiration; no fixed
  broad smile. Feet share baseline, full limbs separated by transparent gutters.

## Technical output
- Resolution/aspect ratio: landscape 16:9 plate, full-frame 1920×1080 display;
  transparent horizontal character sheet, three equal columns, crop frames and
  feet pivots recorded after inspecting the generated native image.
- Transparent background: no for environment, yes for character sheet.
- Safe crop zones: preserve house/shore walk band; preserve entire hats/hands/feet.

## Inspected integration
Environment: native 1672×941, displayed at 1920×1080, opaque. Russian: native
2172×724 RGBA, three 724×724 columns, each displayed at 230×230, foot pivot
(410,704). Eager/nervous/fervent use columns 0/1/2; frame names and paths live in
`src/story/heart-of-darkness/innerStation.ts`. Contact shadows, cold fill tint,
actor depth, foreground reeds and two localized moving fog layers remain runtime
composition. Assets were generated from this coordinated brief and approved
Deck/shore references, then visually inspected; neither is a random placeholder.

## Forbidden
Photorealism, glossy 3D, fantasy ruins, monsters, gore, exposed heads on poles,
fake text, random props, cheerful clown styling, detailed fabric noise, mixed
line weights, baked characters/shadows/fog over the walking band.
