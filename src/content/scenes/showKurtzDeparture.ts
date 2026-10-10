import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzDeparture } from "../../story/heart-of-darkness/createKurtzDeparture";
import { departureAudio, departurePoints } from "../../story/heart-of-darkness/kurtzDeparture";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { deckhandRoutine } from "../../story/heart-of-darkness/deckhand";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { journeyRiverLayers } from "../../story/heart-of-darkness/riverParallax";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { registerApproachAudio } from "../../story/heart-of-darkness/approachAudio";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { departureState, departurePosition, updateDeparture } from "../state/kurtzDepartureState";
import { departurePatient, departureMooring, departureBank, departureDecision, departureCrew, departureWhistle,
  departureHelm, departureClosing, departureAfter } from "../labels/kurtzDeparture.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { canBeginBreakdown } from "../state/kurtzBreakdownState";
import { breakdownEntry } from "../labels/kurtzBreakdown.label";

export function showKurtzDeparture() {
  const scene = createKurtzDeparture(), { presentation, layers, player, marlowVisual, deckhand } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Partida de la estación · WASD o flechas · E interactuar · 1/2 decidir");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: journeyDeck.walkableArea,
    position: { x: 850, y: 800 } }, departurePosition);
  attachMarlowArt(player, ticker, marlowVisual.setState, () => departureState().phase === "pressure" ? "alarm" : "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const river = journeyRiverLayers.filter(l => l.id !== "foreground-reeds").map(layer =>
    attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.speed * .18, reference: { x: 960, y: 540 } }));
  // Keep the arrival's near bank above the traveling planes, and the vessel in front.
  layers.environment.setChildIndex(scene.shore, layers.environment.children.length - 1);
  const texture = createFogTexture();
  const fog = attachParallaxLayer(layers.environment, ticker, camera, { id: "departure-mist", period: 1920, speed: 5,
    depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 }, createTile: () => {
      const tile = new Container(), mist = new Sprite({ texture, y: 295, tint: 0x8da299 });
      mist.width = 1920; mist.height = 205; tile.addChild(mist); return tile;
    } }); fog.layer.alpha = .17;
  const npc = attachNpcRoutine(deckhand.actor, ticker, deckhandRoutine, state => deckhand.pose(state, ticker.deltaMS));
  registerApproachAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-departure", listener: () => player.position,
    layers: [...departureAudio, { id: "whistle", source: "approach-whistle", volume: .18, fadeInMS: 90, fadeOutMS: 450,
      enabled: () => narration.labels.opened.some(({ label }) => ["journey-station-departure-whistle-first", "journey-station-departure-whistle"].includes(String(label))) }] });
  const phase = () => departureState().phase;
  const action = (id: keyof typeof departurePoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0], range = 90): SpatialAction => ({ id: `departure-${id}`, prompt,
    target: () => departurePoints[id], range, enabled, execute: () => narration.call(label, {}) });
  const actions = [
    action("patient", "E · Escuchar a Kurtz junto a la caseta", () => phase() !== "departing", departurePatient, 100),
    action("mooring", "E · Soltar la amarra de popa", () => phase() === "aboard", departureMooring),
    action("bank", "E · Escuchar lo que llega de la orilla", () => phase() === "pressure" && !departureState().bankSeen, departureBank, 70),
    action("whistle", "E · Decidir ante los rifles y el silbato", () => phase() === "pressure" && !departureState().response, departureDecision, 65),
    action("crew", "E · Exigir que bajen los rifles", () => phase() === "pressure" && departureState().response === "intervene" && !departureState().crewWarned, departureCrew),
    action("whistle", "E · Tirar de la cuerda del silbato", () => phase() === "pressure" && departureState().crewWarned && !departureState().whistleUsed, departureWhistle, 65),
    action("helm", "E · Dar la señal y abrir el giro", () => phase() === "pressure" && departureState().whistleUsed, departureHelm, 65),
    action("helm", "E · Mirar la estación que queda atrás", () => phase() === "departed" && departureState().finalSeen, departureAfter, 65),
    { ...action("helm", "E · Continuar río abajo", canBeginBreakdown, breakdownEntry, 65), priority: 2 },
  ];
  const conversation = attachStationInteractions(presentation, player, ticker, surface, actions, "III / LA ORILLA SE ALEJA", () => {
    const s = departureState();
    if (s.phase === "aboard") return "Kurtz está a bordo · Revisa la caseta o suelta la amarra a la derecha";
    if (s.phase === "departing") return "La máquina abre el giro · Puedes caminar mientras la estación se aleja";
    if (s.phase === "departed") return "La estación queda atrás · Kurtz sigue vivo a bordo";
    if (!s.response) return "La multitud llena la ribera · El silbato está junto a la caseta, a la izquierda";
    if (s.response === "intervene" && !s.crewWarned) return "Acércate a los hombres junto al marinero · E exigir que bajen los rifles";
    return !s.whistleUsed ? "Vuelve a la cuerda del silbato, junto a la caseta" : "Da la señal de salida junto a la caseta · E";
  });
  attachActorDepth(layers.actors, ticker, [player, deckhand.actor, scene.patient, scene.ivory]);
  const update = (frame: Ticker) => {
    if (!document.hidden) updateDeparture(frame.elapsedMS ?? frame.deltaMS);
    const s = departureState(), p = s.progress, scale = 1 - p * .28;
    scene.shore.scale.set(scale); scene.shore.position.set(p * 380, -240 + p * 185);
    // Stay opaque: scale and position establish receding depth without ghost figures.
    scene.witnesses.forEach(({ group }, i) => { group.visible = s.phase !== "aboard";
      group.y = 715 + (i % 2) * 20 - (s.whistleUsed ? 70 : 0); });
    scene.mooring.visible = s.phase === "aboard";
    scene.patientArt.setState(conversation.active() ? "intense" : "weak");
    deckhand.setMood(s.phase === "pressure" ? "alarm" : "concern");
    if (conversation.active() || s.phase === "pressure") { npc.pause(); npc.face(player.position); } else npc.resume();
    audio.setLayerVolume("bank", .028 * (1 - p * .85)); audio.setLayerVolume("engine", .12 + p * .07);
    marlowVisual.container.tint = 0xaec0b1;
    if (s.phase === "departed" && !s.finalSeen && !conversation.active()) void conversation.call(departureClosing);
  };
  ticker.add(update, undefined, -4); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio, river, npc, conversation };
}
