# Engine extensions

This folder is deliberately small.

Pixi'VN already owns narration, dialogue state, choices, history, storage, saves, character registration, canvas lifecycle, sound state and the browser testing bridge.

Only place reusable systems here when Pixi'VN does not provide the capability. Expected examples:
- player movement
- collision/navigation
- camera director
- NPC routines
- world interaction
- weather/parallax orchestration
- zone audio orchestration

Do not create a second narrative, save, storage or audio-state engine.
