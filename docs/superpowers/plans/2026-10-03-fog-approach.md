# Fog approach and shore attack

Base: `7fc7cab6ebee07fddbae2f350d21a2dd59fd86bb`, journey-vertical-slice.
User has authorized implementation, visual production, validation and push of
this bounded episode. Execute in this workspace without touching engine or the
approved Deck. Pixi'VN owns all narrative and save state.

## Implementation
1. Test a slow navigation controller: partial steering, channel bounds, swept
   obstacle crossings, contact slowdown, pause, whistle gate and finite restore.
   Keep mechanics in `src/puzzles/riverApproach/`; route in Heart story data.
2. Bind its serializable checkpoint, position, atmosphere and seen-beat flags to
   existing Pixi storage checkpoints in content. Add a third composed journey
   space, reached from a spatial helm action after returning from the hut.
3. Compose the existing approved illustrated ship/river assets in a separate
   scene, with multilayer mist, obstacles, brief occluded figures, impacts,
   smoke, water motion, motivated light and a distinct non-gory helmsman.
   Record a precise brief before generating any required character asset.
4. Use Pixi labels for arrival, two spatial audio warnings, attack, helmsman's
   death and aftermath. Queue beats until the reader finishes; never replay seen
   beats after restore. Interrupt steering briefly at the helmsman, then make
   taking the wheel and sounding the whistle the player's actions.
5. Add stereo procedural cues through existing Pixi audio layers. No new audio
   transport; source/configuration belongs to this work. Preserve alias cleanup.
6. Test both hut decisions, boarding/entry, actual key steering and obstacle
   contacts, all beats and whistle, pre/during/post attack canonical restore,
   active dialogue restore and restart. Keep all existing tests unchanged.
7. Capture fog/attack/helmsman/aftermath at 1366×768 and 800×600; inspect before
   completion. Run agent:check and full agent:e2e, document evidence/limitations,
   update active plan, commit one coherent milestone and push this branch.

## Review focus
- No scene auto-entry while a hut/deck dialogue is still open.
- Restore interrupts and seen-beat queue without duplicated dialogue/audio.
- Contact must depend on position at an obstacle, not simply voyage time.
- Reading must not hide navigable water or block controls outside the brief beat.
- Hut wait has clearer initial view; proceed has earlier sounding information.
- Stop before the Inner Station; no shooter, health economy or new save menu.
