# Inner Station and the Russian — implementation plan

Base: a43b536f2738cefd6102f08d476a76b0fb8396f3, journey-vertical-slice.
User authorizes implementation, art integration, full validation and push.
Preserve engine, previous scenes, approved tag, stash and untracked files.

1. Bind docking progress, separate shore position/atmosphere, four observations,
   knowledge, topic order, stance and a one-time atmospheric event to Pixi storage.
   Test unlock conditions and canonical state semantics before implementation.
2. Brief and generate a coordinated cold illustrated station plate and Russian
   expression sheet. Inspect native dimensions; integrate via existing slots.
3. Add spatial exit from the completed attack, a saved gradual docking scene
   with engine attenuation and disembarkation, then a layered explorable shore.
4. Reuse movement, camera, actor-depth, NPC routine, interactions and weather.
   Four brief observations precede a visible Russian; no invented supernatural
   event, combat, inventory, journal UI or engine infrastructure.
5. Register the Russian and create short Pixi dialogue segments: two topic-order
   choices, a skeptical/listening stance, remembered hut evidence and a later
   response. End at a spatial path preparing Kurtz without depicting him.
6. Reconstruct docking, active labels, choices, knowledge, event remaining time,
   audio and player position through canonical Pixi saves and existing router.
7. Unit tests, targeted browser flows then agent:check and full agent:e2e.
   Inspect arrival/exploration/Russian/dialogue/event/closing at both resolutions,
   retain captures, document adaptation/limits, update plan, one commit + push.

Narrative basis: Gutenberg part II, station arrival through Russian explanation.
Shore exploration and delayed close encounter are an explicitly compressed
adaptation of the encounter originally initiated from the bank and held aboard.
Do not reveal the fence-post heads or stage Kurtz's emergence yet.

## Completed validation — 2026-10-04
All seven implementation/QA steps completed. TypeScript, 120 unit tests in 31
files and build pass; the full 73-test E2E suite in 23 files passes in 17.1m.
Fourteen final captures at both sizes are retained in
`docs/heart-of-darkness/inner-station-qa/` and visually inspected. A transient
black resize capture was rejected; the test now awaits actual Pixi redraw and
checks visible artwork. No production renderer/engine workaround was added.
Delivery scope is prepared as one commit and authorized branch push, excluding
the two preexisting untracked files and preserving the Phaser stash/checkpoint.
The next milestone is Presentation of Kurtz, not implemented here.
