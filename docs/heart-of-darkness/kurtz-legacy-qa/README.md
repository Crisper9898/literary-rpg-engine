# Kurtz's legacy — visual evidence

The focused Playwright visual case captures fourteen moments at each supported
size, using the production room, actual labels/choices and restored saves.
PNG dimensions and UI bounds/overflow are checked; screenshots are inspected
individually before release. No approved Deck image or engine file is changed.

| Moment | Desktop | Compact |
| --- | --- | --- |
| Arrival after the Company | [1366×768](legacy-entry-1366x768.png) | [800×600](legacy-entry-800x600.png) |
| Cousin's two responses | [1366×768](legacy-cousin-choice-1366x768.png) | [800×600](legacy-cousin-choice-800x600.png) |
| Talents response | [1366×768](legacy-music-1366x768.png) | [800×600](legacy-music-800x600.png) |
| Witness response | [1366×768](legacy-witness-1366x768.png) | [800×600](legacy-witness-800x600.png) |
| Family papers collected; private packet retained | [1366×768](legacy-family-carry-1366x768.png) | [800×600](legacy-family-carry-800x600.png) |
| Family handoff at the door | [1366×768](legacy-family-give-1366x768.png) | [800×600](legacy-family-give-800x600.png) |
| Journalist's two responses | [1366×768](legacy-journalist-choice-1366x768.png) | [800×600](legacy-journalist-choice-800x600.png) |
| Any-party reply | [1366×768](legacy-party-1366x768.png) | [800×600](legacy-party-800x600.png) |
| Motive response | [1366×768](legacy-motive-1366x768.png) | [800×600](legacy-motive-800x600.png) |
| Report collected for publication | [1366×768](legacy-report-carry-1366x768.png) | [800×600](legacy-report-carry-800x600.png) |
| Journalist handoff | [1366×768](legacy-report-give-1366x768.png) | [800×600](legacy-report-give-800x600.png) |
| Both visitors gone; private packet retained | [1366×768](legacy-remaining-1366x768.png) | [800×600](legacy-remaining-800x600.png) |
| Reflection on both decisions | [1366×768](legacy-complete-1366x768.png) | [800×600](legacy-complete-800x600.png) |
| Restored report custody and active label | [1366×768](legacy-restored-report-1366x768.png) | [800×600](legacy-restored-report-800x600.png) |

## Review criteria

- Dialogue, both options and controls stay inside the viewport without overflow.
- The existing paper-only report crop and grounded Marlow remain unchanged.
- The family paper group is distinct from the private packet and disappears
  during custody/after handoff; the private packet stays at the table's right.
- The report disappears when carried and remains absent after publication handoff.
- Door pressure changes between visitors and leaves with the journalist.
- Restoring a held report keeps the prop absent and resumes the open exchange.
- At 800×600, contain scaling retains the whole room with intentional letterboxing.

This is the existing restrained graphic theatrical room, not a new finished
European illustration. Neither visitor has a sprite; there is no fabricated
portrait detail or new backdrop. The original room-art brief remains applicable.
All 28 retained PNGs were dimension-checked and individually inspected. Both
choices fit in one line at compact size; no clipped text, offscreen control,
overlap with the desk/actor or unintended character crop was found. The long
final reflection remains readable at both sizes. Contact shade remains at the
feet, the family group and report leave their correct stations, and the private
packet stays visible. Restored report custody preserves the open dialogue and
missing report. The room's existing detail and visitor-sprite limits remain.

Final code agent:check: exit 0; TypeScript, 192/192 units in 41 files and build
(2.69s). Focused gate: 4/4 in 2.3m. The first proximity case was corrected to
wait for actual actor coordinates after the helper writes its checkpoint;
no production range or guard changed. Final full agent:e2e: exit 0;
113/113 in 43 spec files passed in 44.4m, including all 109 unchanged
preexisting browser cases. Total coverage: 305 tests. Final validation completed
on 2026-10-11 (America/Guayaquil). The existing audio-unlock/navigation warnings
remain nonfatal; no new Pixi'VN error was detected.
