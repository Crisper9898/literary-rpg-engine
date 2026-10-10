# After Kurtz — burial news and Marlow's illness

## Playable route

Close the final night's death-announcement exchange. Near the crew on the
right, **E · Esperar el amanecer** enters the aftermath. This is an optional
continuation of the existing route, not a new start menu entry.

1. At the right-hand railing, **E · Escuchar la noticia del entierro** reports
   the next morning's burial. It is heard from the boat; no grave or body is
   illustrated. The following line remembers reassurance or silent listening.
2. Walk left to **E · Resguardar los papeles**. The existing document artwork
   disappears from the deck once secured. The text remembers a sealed packet
   or the photograph, using the existing papers response rather than copying it.
3. Return to the crew area, **E · Buscar apoyo en la barandilla**. Marlow feels
   unsteady; the deckhand offers help. **1** accepts water, **2** attempts to
   manage alone. Movement remains enabled while either option is open.
4. Help supplies water on the deckhand's actual reply line. Self-care requires
   closing the reply and walking left to **E · Buscar agua junto a la caseta**.
   Both choices retain custody of the documents and lead to the same survival.
5. **E · Resguardarte junto a la caseta** compresses the illness into a short
   exchange, with a gradual grey foreground haze and pale actor lighting.
6. Closing the rest exchange enables **E · Volver a mirar la corriente** at the
   right railing. The first line remembers the care route; the next remembers
   the vigil response. Closing confirms survival and ends this episode.
7. **E · Escuchar la corriente** remains available as an optional observation.
   No European return, Company confrontation or Intended encounter starts.

WASD/arrows, real bounded position, the routined sailor, moving water/banks and
position-aware ambience remain live throughout. Neither waiting nor walking
alone supplies care, chooses a reply, closes an exchange or completes recovery.
The episode introduces no health meter, inventory, quest, combat or save menu.

## Literary basis and staging

[Conrad, Heart of Darkness, Part III](https://www.gutenberg.org/files/219/219-h/219-h.htm)
places the muddy burial the next day after Kurtz's last evening, then recounts
Marlow's near-fatal illness, grey recollection and continued loyalty. The
European city, documents dispute and Intended follow later.

The report from the railing, securing the packet, crew help/self-care choice,
water route and sheltered interaction are playable adaptations. Conrad does
not identify an illness diagnosis or specify these care actions. No claim is
made that accepting help changes his canonical survival, redeems Kurtz or
settles the meaning of the final words. The Spanish dialogue is newly written.

The existing boat illustrates a compressed memory of the downstream passage;
the background is not a new accurate dawn/day/night timeline. Illness spans
days in narration, not a survival countdown. Marlow retains existing standing
and walking artwork; there is no new reclining/sick atlas or literal depiction
of prolonged rest. The burial and delivery of water are narrated, not new
actors/props. The sailor continues his routine rather than simulating an escort.
No new illustrations or unrelated placeholders were added.

## Pixi'VN state and restore

`journey.kurtzAftermath`, through the existing validated checkpoint:

- `phase`: inactive / morning / bereaved / fever / resting / recovering / survived.
- `distance`: unwrapped downstream movement, seeded from the final night.
- `progress`: smooth atmospheric darkening in .48–.78; never enters fire.
- `papersSecured`: removes the deck packet and gates the care sequence.
- `response`: help / alone, immutable once selected.
- `careSeen`: full care exchange closed; cannot precede a selected response.
- `waterReceived`: help delivered on its reply, or water collected after the
  closed self-care reply. Required with `careSeen` before sheltered rest.

Burial news and completed recovery are canonical phases, not duplicate flags.
`journey.aftermathPosition` is Marlow's actual bounded x/y (420–1500, 680–840).
The existing vigil and papers choices are read directly from their checkpoints.
Pixi'VN owns open labels/options and every serialized field. Use only
`Game.exportGameState()` / `Game.restoreGameState()` and the existing
`showJourneySpace()` reconstruction. No parallel persistence or scene clock.

Restoring before entry dispatches to the final night. Restoring an active
aftermath rebuilds only its boat instance, position, props, illness lighting and
audio mix. Construction never repeats burial news or starts dialogue. Restoring
the choice, a selected reply before water, the rest label or completed recovery
retains the corresponding interaction availability and Pixi'VN dialogue.
Transient mist/water animation instants and exact audio playback time are not
saved. Story tick caps at 50ms and ignores hidden documents; narrative phases
are action/label driven. Restore reconstructs the illness haze without waiting
for a fresh fade-in; normal entry/exit transitions ease over about a second.

## Composition and lifecycle

New files are limited to content state/labels/scene and story configuration/
factory. Existing scenes gain only the entry and dispatch hooks. The factory
reuses `createKurtzBreakdown`, removes the patient and repair props from this
instance and retains the existing papers, grounded actors and boat plates.
This does not alter any earlier scene or the approved Journey Deck.

World anchors: entry/care (1190,800), burial/recovery (1440,700), papers
(850,750), water (870,730), shelter (760,800). The packet is staged at (820,720).
Existing camera and contain scaling preserve the whole boat at both sizes.
The grey haze belongs to the world foreground; DOM dialogue and choices remain
outside it. No texture is generated per frame: both mist planes share one owned
texture, destroyed once with the scene.

Existing attachments dispose key listeners, overlays, movement/NPC/parallax
tickers and Pixi'VN audio sources on scene destruction. This scene also removes
its own update and releases its texture. Stable `journey-kurtz-aftermath` channels
reconcile on reconstruction; earlier final-night channels stop. No new dependency,
engine API, audio file, global visual change or Metamorphosis edit is needed.

## Validation ledger

Eight unit cases cover the entry gate, ordered actions, both distinct care
routes, response immutability, incomplete exchanges, partial-state restore,
invalid saves and capped atmospheric progress without timed story events.
Browser cases cover real E/1/2, spatial gates, movement during options, prior
vigil/papers memory, exact serialized position/progress, open-choice/partial
reply/rest restore, scene/audio deduplication, earlier restore and restart.
No previous test is modified or weakened.

Final `agent:check`: exit 0; TypeScript, 176/176 units in 39 files and build
in 4.28s passed. Final full `agent:e2e`: exit 0; 105/105 cases in 39 spec files
passed in 42.6 minutes. All 101 preexisting browser cases remain unchanged and
pass. Final focused E2E: 4/4 in 3.3 minutes. Total automated coverage: 281 tests.

24 final PNGs (twelve moments × both sizes) were dimension-checked and
individually reviewed; text/options/controls fit, including restored rest.
The capture review is retained in `kurtz-aftermath-qa/README.md`. Human listening
remains independent; no new recorded dialogue or final audio is claimed.
