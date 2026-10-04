import { canvas } from "@drincs/pixi-vn";
import { Container, Graphics, type Ticker } from "pixi.js";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { journeyArtStage } from "../../story/heart-of-darkness/journeyArtStages";
import { journeyRiverLayers } from "../../story/heart-of-darkness/riverParallax";
import { stationArt } from "../../story/heart-of-darkness/innerStation";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { registerJourneyAudioAssets } from "../../story/heart-of-darkness/journeyAudio";
import { dockingPosition, dockingProgress, stationFlag } from "../state/innerStationState";
import { setJourneySpace } from "../state/woodStopState";
import { showJourneySpace } from "./journeyDeck";
import { updateStationDocking } from "./updateStationDocking";
import { attachStationInteractions } from "./attachStationInteractions";
import { stationArrivalLine } from "../labels/innerStation.label";

export function showStationArrival() {
  const { presentation, layers, player, visual, marlowVisual } = createJourneyDeck();
  presentation.label = "journey-station-arrival";
  for (const id of ["chapter-kicker", "deck-title", "deck-subtitle"]) presentation.getChildByLabel(id)!.visible = false;
  visual.setProgress(journeyArtStage(.78)); canvas.layers.add("journey-station-arrival", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Llegada a la Estación Interior · E para desembarcar a proa");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: journeyDeck.walkableArea,
    position: { x: 900, y: 760 } }, dockingPosition);
  attachMarlowArt(player, ticker, marlowVisual.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  journeyRiverLayers.filter(layer => layer.id !== "foreground-reeds").forEach(layer =>
    attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.speed * .15,
      reference: { x: 960, y: 540 } }));
  // Keep the approved Deck untouched; only this distant arrival adds a waterline.
  layers.ground.addChildAt(new Graphics({ label: "arrival-water-contact" })
    .poly([180, 976, 1540, 976, 1640, 997, 1550, 1024, 270, 1028, 170, 1001])
    .fill({ color: 0x061619, alpha: .66 })
    .moveTo(180, 1035).lineTo(570, 1039).moveTo(860, 1040).lineTo(1550, 1031)
    .stroke({ color: 0x93a9a2, alpha: .25, width: 3 }), 0);
  layers.ground.addChildAt(new Graphics({ label: "arrival-hull" })
    .poly([235, 932, 1600, 932, 1635, 964, 1530, 1008, 285, 1005, 230, 974])
    .fill(0x102021).stroke({ color: 0x071114, width: 4 })
    .moveTo(288, 993).lineTo(1525, 996).stroke({ color: 0x4b5d56, alpha: .5, width: 2 }), 1);
  const shore = createVisualAssetSlot({ label: "arrival-station-art", source: stationArt, fallback: () => new Container() });
  layers.environment.addChild(shore.container);
  registerJourneyAudioAssets();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-station-arrival", listener: () => player.position,
    layers: [{ id: "engine", source: "journey-audio-engine", volume: .18, fadeInMS: 500, fadeOutMS: 1800 },
      { id: "water", source: "journey-audio-river", volume: .13, fadeInMS: 800, fadeOutMS: 1000 }] });
  const conversation = attachStationInteractions(presentation, player, ticker, surface, [{
    id: "disembark-station", prompt: "E · Desembarcar en la Estación Interior", target: () => ({ x: 1450, y: 780 }), range: 105,
    enabled: () => dockingProgress.read() === 1,
    execute: async () => { setJourneySpace("inner-station"); await showJourneySpace(); },
  }], "II / LA ESTACIÓN INTERIOR", () => dockingProgress.read() === 1 ?
    "Ve a proa y desembarca · WASD / flechas · E" : "Aminoras frente a una abertura en la orilla…");
  const update = (frame: Ticker) => {
    const p = updateStationDocking(frame.deltaMS), ease = 1 - (1 - p) ** 3;
    // Complete the landscape dissolve before docking, avoiding ghost reflections
    // over the house while the vessel continues its slower independent approach.
    shore.container.alpha = Math.min(1, p / .35); shore.container.x = (1 - p) * 70;
    for (const layer of [layers.ground, layers.actors, layers.foreground]) {
      layer.scale.set(1 - ease * .55); layer.position.set(-ease * 60, ease * 450);
    }
    audio.setLayerVolume("engine", .18 * (1 - p) ** 2);
    audio.setLayerVolume("water", .13 - p * .06);
    if (!stationFlag("stationArrivalSeen") && !conversation.active()) void conversation.call(stationArrivalLine);
  };
  ticker.add(update, undefined, -2); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => ticker.remove(update)); surface.focus({ preventScroll: true });
  return { player, camera, audio, presentation };
}
