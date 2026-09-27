# Reusing the Literary RPG Engine

The dependency direction is `content/story/UI → src/engine → PixiJS/Pixi'VN`.
`src/engine` must not import a novel's story, labels, scene composer or UI. The
`engineBoundary` unit test checks relative engine imports on every
`npm run agent:check`.

## Ownership

Pixi'VN owns labels, dialogue, choices, character registration, storage,
save/export/restore, canvas lifecycle and sound state. Use those public APIs
directly. The engine adds spatial/game-world capabilities that Pixi'VN does not
provide: bounded movement and configurable keyboard bindings, smooth camera
direction, cyclic NPC routines, proximity-based action selection, world layers,
periodic parallax, atmosphere interpolation and optional checkpoint channels.
`SpatialAudioController` adds position-driven mixing; `PixiVnAudioOutput`
delegates playback, channels and sound state to Pixi'VN.

Each work owns its characters, scene geometry, text, labels, visual recipes,
interactable definitions, storage keys and authored parameters. The current
*Heart of Darkness* story data lives in `src/story/heart-of-darkness/`; its
Pixi'VN labels and scene composition live in `src/content/`. The conversation
view in `src/ui/journeyConversationView.ts` and fog texture recipe in
`src/story/heart-of-darkness/createFogTexture.ts` are specific to this slice.

## Starting another work

*La metamorfosis* now supplies Gregor and Grete (heard behind the door), a room
layout, window/door dialogue,
provisional art and three audio cues in `src/story/metamorphosis/` and
`src/content/metamorphosis/`. Its labels and character are registered with
Pixi'VN. `createWorldLayers()`, `attachPlayerMovement()` and
`attachWorldCamera()` compose the same movement and camera systems used by
Journey, with room-specific bounds and a Pixi'VN checkpoint. Grete's two
responses are Pixi'VN choices; the selected response is a namespaced storage
value that changes later dialogue and survives Pixi'VN export/restore. Use
`attachNpcRoutine()`, `attachParallaxLayer()` or `attachAtmosphere()` only if the
scene calls for them. The existing `journeyDeck.ts` demonstrates composition;
there is no generic scene schema to copy or extend.

Define actions such as “examine the door” or “talk to the family” as
`SpatialAction`s: provide an id, prompt, target provider, range, optional
priority/enabled predicate and an `execute` callback. `SpatialInteractions`
selects the available action for the current player position;
`bindInteractionKey()` routes a focused surface key to that action. The new
work's UI adapter decides how to display it. *Heart of Darkness*
currently does this in `attachJourneyConversation.ts`; its text and Pixi'VN
label remain game-specific. Narrative consequences go directly to Pixi'VN
storage and labels.

For persistence, define namespaced keys in that work's content/state module.
`createPixiStorageCheckpoint(key, validator)` adapts a serializable value to
the engine's `CheckpointChannel<T>` contract. Pass that channel to systems
that need a checkpoint. Pixi'VN's `Game.exportGameState()` and
`Game.restoreGameState()` remain the only save/restore API; do not build another
save file format. The Journey uses this for player coordinates, unwrapped
travel distance and smoothed atmosphere progress. The engine knows none of
those keys or what they mean.

## Environmental audio

`src/engine/audio/SpatialAudioController.ts` is a scene-neutral mixer. Supply a
`listener: () => Point` for whichever actor or camera hears the scene and an
array of `AudioLayer` definitions. A layer has a unique `id`, Pixi asset alias
`source`, and `volume` in 0–1. Without a zone it is a base layer; with a zone,
give `center: () => Point`, `innerRadius` (full gain) and `outerRadius` (zero
gain). Between the radii, gain declines linearly with distance. `enabled` and
`setEnabled()`/`setLayerVolume()` let content alter layers without putting
narrative decisions in the engine. Unrelated layers play together.

To crossfade mutually competing ambience, give those layers the same `group`
and a numeric `priority`. Highest priority takes its proximity share first;
lower layers receive the remaining share. At an overlapping edge, this blends
instead of abruptly replacing a base layer. `fadeInMS` and `fadeOutMS` limit
volume changes over ticker time. A story can change a layer's enablement or
volume at any time; the controller has no knowledge of the reason. Zones are
circles in world coordinates; polygonal occlusion and directional acoustics
are not implemented.

Compose it through `attachSpatialAudio(sceneContainer, app.ticker, canvas,
{ namespace, listener, layers })`. Register file aliases with Pixi `Assets`
in story/content first. The adapter creates one Pixi'VN background channel
per layer and uses Pixi'VN `sound.play/find/stop/pause/resume`; it waits for a
canvas pointer/key gesture to start browser playback. The namespace separates
scene aliases. The returned controller exposes `getLayerState()` for inspection
and `pause()`/`resume()` for scene direction. Destroying the scene container
removes the ticker callback, gesture listeners and its tracked media, including
late asset loads. Re-entering a scene reuses the canvas's unlocked state.
Pixi'VN exposes no channel-removal API; the adapter stops scene media and
reuses stable namespaced channel aliases on re-entry, so channel definitions
do not multiply.

The mix and playback position are transient. Save narrative flags, scene and
listener coordinates through Pixi'VN as usual. After
`Game.restoreGameState()`, compose the scene again with the restored listener;
the next update recalculates zones. The output checks Pixi'VN's tracked media
and resumes a missing source; it never creates a second save format or tries to
serialize an exact sample time.

*La metamorfosis* defines its own aliases and layers in
`src/story/metamorphosis/audio.ts`: an unzoned room loop, a window zone with
exterior sound, and a door zone with abstract family-voice texture. Its scene
passes `listener: () => actor.position` to the same adapter and destroys the
container on re-entry. No `src/engine/` edits were needed. The temporary WAVs
and generator are documented under `public/assets/audio/metamorphosis/`.
Journey's authored zone values remain in
`src/story/heart-of-darkness/journeyAudio.ts`.

## Selecting a work

The default `/` entry still starts Heart of Darkness. The visible selector
links to `/?story=metamorphosis` for Gregor's room. `src/content/storyEntries.ts`
maps the query to Pixi'VN start labels; changing works reloads the page and
starts a fresh game. Character, label, spatial, sound and checkpoint data remain
in each work's modules. There is no cross-work save slot.

## Current limits

Movement supports an axis-aligned rectangular area and circular footprint,
not arbitrary collision geometry. NPC routines are deterministic authored
stops; they have no generic checkpoint yet. Camera framing, individual
decorative parallax phases and NPC routine state are transient. Each work has
its own dialogue HUD/input adapter; Pixi'VN dialogue and the engine's spatial
interactions are shared. Scene setup is explicit TypeScript composition at a
fixed logical resolution. The works share an entry selector, but do not yet
have separate production builds. Both soundscapes use audible provisional
loops pending human sound review.

Before adding infrastructure, check whether Pixi'VN or an existing engine
module already provides the capability. Keep authored decisions in content;
add engine code only for a reusable capability actually needed by a game.
