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

Each work owns its characters, scene geometry, text, labels, visual recipes,
interactable definitions, storage keys and authored parameters. The current
*Heart of Darkness* story data lives in `src/story/heart-of-darkness/`; its
Pixi'VN labels and scene composition live in `src/content/`. The conversation
view in `src/ui/journeyConversationView.ts` and fog texture recipe in
`src/story/heart-of-darkness/createFogTexture.ts` are specific to this slice.

## Starting another work

For a conceptual *Metamorphosis* prototype, add Gregor, a room layout and
dialogue as new story/content modules. Register its characters and labels with
Pixi'VN. Compose a room with `createWorldLayers()` and an authored
`WorldLayout`; attach a player with `attachPlayerMovement()` (including room
bounds, collider radius, speed, controls and a checkpoint), and use
`attachWorldCamera()` if that room needs a moving camera. Use
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

## Current limits

Movement supports an axis-aligned rectangular area and circular footprint,
not arbitrary collision geometry. NPC routines are deterministic authored
stops; they have no generic checkpoint yet. Camera framing, individual
decorative parallax phases and NPC routine state are transient. The dialogue
and HUD input adapter is still Journey-specific, while Pixi'VN itself is
reusable for any work. Scene setup is explicit TypeScript composition and the
app entry currently boots one game at a fixed logical resolution; a second
shipping title would need its own entry/registration selection. Zone audio is
not implemented yet.

Before adding infrastructure, check whether Pixi'VN or an existing engine
module already provides the capability. Keep authored decisions in content;
add engine code only for a reusable capability actually needed by a game.
