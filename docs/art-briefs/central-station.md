# Art Asset Brief — caravan and Central Station arrival

## Story

Heart of Darkness, Part I. Scope: N04, after the Outer Station and before the
first manager interview, salvage/repairs, fire, rivets or Eldorado episode.

## Scene and narrative beat

Two connected theatrical stages: an exhausting overland march through abandoned
settlements and ravines; then a neglected station beside the steamer sunk before
Marlow's arrival. The player looks at work and consequences, not a hostile jungle
or a heroic rescue. Caravan illness and the wreck remain canonical outcomes.

## Production role

Two layered environments, village/ravine/camp/hammock props, station fence and
partly submerged wreck, and optional encounter illustrations. Current geometry
is a composition reference; the approved Marlow atlas and vegetation are reused.
No unrelated generated portrait may stand for carriers, companion or agent.

## Composition

- Camera/framing: full 1920×1080 logical stage, contain framing at 1366×768 and
  800×600. Keep three depths; do not bake UI or Marlow into background art.
- Character position: movable feet within x380–1540, y730–890. Entry (660,825).
  Atlas frames 160×160, foot pivot (80,142), current uniform scale 1.3.
- Negative space reserved for UI: upper-left dialogue region, approximately
  x0–810/y0–550 across both responsive sizes; footer below y980. Keep major
  props/feet below the dialogue region and above y950.
- Foreground elements: sparse dark grasses at left/right margins; contact
  shadows and dirt texture. Avoid blocking the full walkable strip.
- Midground elements, caravan: village (430,770), ravine (930,800), camp
  (510,850), companion rest (1330,785), onward route (1490,855). Prop silhouettes
  sit behind these feet anchors. Ravine image must not imply a walkable void.
- Midground elements, station: damaged rush fence/gap near right, buildings
  behind agent (1190,780), partly submerged wreck left of (490,845). Wreck is
  not repaired, afloat or the later downstream island breakdown.
- Background elements: stony heated hills/cool shaded ravine for the march;
  forest, backwater and reeds only for the station. The inland march must not
  look like an island floating on the river. Existing forest plate: 1920×320,
  y235, transparent; keep it independent from hills, buildings and sky.

## Art direction

- Shared style: inked literary graphic novel; controlled grain and silhouette,
  depth from motivated light, compatible with the approved Marlow atlas.
- Story-specific palette: soot, swamp green, dusty ochre, fog gray; no postcard
  jungle, vivid fantasy colors or heroic colonial portraiture.
- Lighting source: harsh ochre daylight on path; cooler ravine shade; diffuse
  humid light reflected from station backwater. Preserve contact at feet.
- Mood: accumulated exhaustion, extraction and the absurd contrast between
  official reassurance and an unusable boat. No combat staging or threat HUD.

## Character continuity

- Character: Marlow keeps the approved identity and six-frame walking atlas.
- Clothing: existing dark suit/hat; do not add explorer equipment or medals.
- Face/hair identifiers: preserve the atlas rather than redesign the protagonist.
- Pose: concerned during march, alarm at arrival; no new injured gait is claimed.
- Expression: fatigue/attention, not triumphant command. Companion and arrival
  agent are currently offscreen; illustrate them separately only with a reviewed
  brief. Do not invent ethnicity/costume details or dialogue for the carriers.

## Technical output

- Resolution/aspect ratio: 1920×1080 environments, separate transparent props;
  test both target resolutions without changing logical anchors or interaction
  range (65 units). Use scene-local manifests, not engine modifications.
- Transparent background: yes for foliage/props/figures; sky/soil may be opaque.
- Safe crop zones: only outer decorative margins; keep all action cues and
  figures within the contained frame. Do not bake text into artwork.

## Forbidden

Photorealism, glossy 3D, generic fantasy art, random accessories, fake text,
mixed visual styles, plastic skin, unrelated cutouts, trophies, invented rescue
or violence rewards, full procession simulation, and edits to the approved Deck.
