# Thames conclusion — retained browser QA

Base: `40f89b37a38f456e713e34604d51b51b4276bbb4`.
Source: `tests/e2e/thamesVisual.spec.ts`. All 20 PNG dimensions were checked
against their filename and each image was individually inspected.

| Moment | 1366×768 | 800×600 |
|---|---|---|
| Entry / Nellie frame | [arrival](thames-arrival-1366x768.png) | [arrival](thames-arrival-800x600.png) |
| Quiet exploration | [quiet](thames-quiet-1366x768.png) | [quiet](thames-quiet-800x600.png) |
| Optional mooring | [mooring](thames-mooring-1366x768.png) | [mooring](thames-mooring-800x600.png) |
| Marlow stops speaking | [silence](thames-silence-1366x768.png) | [silence](thames-silence-800x600.png) |
| Director / ebb | [director](thames-director-1366x768.png) | [director](thames-director-800x600.png) |
| Horizon becomes available | [ebb](thames-ebb-1366x768.png) | [ebb](thames-ebb-800x600.png) |
| Optional-state consequence | [horizon](thames-horizon-1366x768.png) | [horizon](thames-horizon-800x600.png) |
| Final river image | [ending](thames-ending-1366x768.png) | [ending](thames-ending-800x600.png) |
| Completed / repeatable reflection | [complete](thames-complete-1366x768.png) | [complete](thames-complete-800x600.png) |
| Restored active last line | [restored-ending](thames-restored-ending-1366x768.png) | [restored-ending](thames-restored-ending-800x600.png) |

Both sizes preserve the complete yacht stage with intentional contain
letterboxing at 800×600. Text, continuation button, prompt and control hint fit
without clipping or scroll overflow. The actor's feet/contact shadow remain on
the deck. The mooring and rigging are visible; the UI does not cover the central
horizon interaction. Optional-state and restored-ending text remain accessible.
The 800×600 sprite is small but identifiable; no portrait close-up is fabricated.

This is restrained **graphic theatre**, not approved finished background art.
Flat cloud/deck silhouettes and offscreen listeners remain illustration debt
described in `docs/art-briefs/thames-nellie-frame.md`. The finished Journey Deck
and Metamorphosis presentation were not modified or visually reapproved here.

Final validation: agent:check exit 0; TypeScript, 203/203 units in 43 files,
build 2.63s. Focused agent:e2e: 4/4, 2.0m. Full agent:e2e: exit 0;
121/121 in 47.0m, including all 117 preexisting cases. Total coverage: 324
tests; these focused cases are not counted twice. All 12 source/test files
remained hash-identical across the final gates.
Audio is checked deterministically through Pixi'VN sources, volume and cleanup;
the independent human listening review remains pending.
