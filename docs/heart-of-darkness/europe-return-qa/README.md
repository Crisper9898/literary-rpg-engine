# European return — visual QA, 2026-10-10

28 final PNGs (fourteen moments × two sizes), captured by
`tests/e2e/europeVisual.spec.ts`. All dimensions were checked and every image
was inspected. The retained files are copied before the full suite clears its
temporary output; they belong to the final validated episode composition.

| Moment | 1366×768 | 800×600 |
| --- | --- | --- |
| return | [PNG](europe-return-1366x768.png) | [PNG](europe-return-800x600.png) |
| window | [PNG](europe-window-1366x768.png) | [PNG](europe-window-800x600.png) |
| packet | [PNG](europe-packet-1366x768.png) | [PNG](europe-packet-800x600.png) |
| report | [PNG](europe-report-1366x768.png) | [PNG](europe-report-800x600.png) |
| letters | [PNG](europe-letters-1366x768.png) | [PNG](europe-letters-800x600.png) |
| prepared | [PNG](europe-prepared-1366x768.png) | [PNG](europe-prepared-800x600.png) |
| claim | [PNG](europe-claim-1366x768.png) | [PNG](europe-claim-800x600.png) |
| choice | [PNG](europe-choice-1366x768.png) | [PNG](europe-choice-800x600.png) |
| private | [PNG](europe-private-1366x768.png) | [PNG](europe-private-800x600.png) |
| carrying | [PNG](europe-carrying-1366x768.png) | [PNG](europe-carrying-800x600.png) |
| refusal | [PNG](europe-refusal-1366x768.png) | [PNG](europe-refusal-800x600.png) |
| resolved | [PNG](europe-resolved-1366x768.png) | [PNG](europe-resolved-800x600.png) |
| commerce | [PNG](europe-commerce-1366x768.png) | [PNG](europe-commerce-800x600.png) |
| restored-carrying | [PNG](europe-restored-carrying-1366x768.png) | [PNG](europe-restored-carrying-800x600.png) |

The full room remains in contain framing at both sizes; 800×600 uses the
existing letterboxing. Marlow's feet/contact shade remain on the floor. Desk
papers and door are separate focal stations. The dialogue never hides the
actor/desk/door and both options are readable, inside the viewport without
overlap or vertical overflow. The small on-scene document headings are secondary;
the existing E prompt carries the readable action at the smaller size.

The first review rejected the station report's crate/grass on this domestic
desk. The episode now crops/masks only the approved paper, without modifying
the source image or any previous scene. Preparation removes the loose postscript;
collecting hides only the report; private letters stay visible. Visitor shade
appears during the claim and disappears after closing its final exchange.
Restored carrying retains the missing report and the active exchange correctly.

This is graphic theatrical staging with existing actor/document art, not a
finished European city/room illustration or a new aunt/official portrait.
There is no assertion that its sparse geometry equals the illustrated Journey
Deck's detail. The future room-art brief preserves the current spatial contract.
No generic generated PNG, copied Metamorphosis scenery, engine or approved Deck
edit is part of this episode. The Company caller stays offscreen; the letters
are an abstract envelope, not a newly fabricated photograph.

Automated capture checks assert renderer/display sizing, loaded actor/report,
dialogue/prompt/control/options bounds and absence of text overflow. Focused
browser gate: 4/4 passed in 2.3 minutes. Full regression: 109/109 passed in
43.4 minutes, exit 0. TypeScript, 184/184 units and build passed as well.
Details are recorded in [EUROPE-RETURN.md](../EUROPE-RETURN.md).
