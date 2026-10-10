import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { createJourneyDeck } from "./createJourneyDeck";
import { journeyArtStage } from "./journeyArtStages";
import { stationArt } from "./innerStation";
import { kurtzArt, bearerArt } from "./kurtzIntroduction";
import { stationEvidence } from "./stationRevelations";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";

/** New episode composition; all protected Deck plates/factories remain unchanged. */
export function createKurtzDeparture() {
  const scene = createJourneyDeck(), { layers, presentation, player } = scene;
  presentation.label = "journey-inner-station"; player.label = "departure-player";
  for (const id of ["chapter-kicker", "deck-title", "deck-subtitle"]) presentation.getChildByLabel(id)!.visible = false;
  scene.visual.setProgress(journeyArtStage(.34));
  const shore = new Container({ label: "departure-shore" }); layers.environment.addChild(shore);
  const station = createVisualAssetSlot({ label: "departure-station-art", source: stationArt, fallback: () => new Container() });
  station.container.tint = 0x849c92; shore.addChild(station.container);
  // Feather only this distant scenic plane, rather than displaying a rectangular postcard.
  // One small immutable alpha texture; no per-frame texture/filter allocation.
  const maskCanvas = document.createElement("canvas"); maskCanvas.width = 256; maskCanvas.height = 144;
  const context = maskCanvas.getContext("2d")!;
  const horizontal = context.createLinearGradient(0, 0, 256, 0);
  for (const [stop, alpha] of [[0, 0], [.1, 1], [.9, 1], [1, 0]]) horizontal.addColorStop(stop, `rgba(255,255,255,${alpha})`);
  context.fillStyle = horizontal; context.fillRect(0, 0, 256, 144);
  context.globalCompositeOperation = "destination-in";
  const vertical = context.createLinearGradient(0, 0, 0, 144);
  for (const [stop, alpha] of [[0, 0], [.06, 1], [.75, 1], [1, 0]]) vertical.addColorStop(stop, `rgba(255,255,255,${alpha})`);
  context.fillStyle = vertical; context.fillRect(0, 0, 256, 144);
  const maskTexture = Texture.from(maskCanvas), mask = new Sprite({ label: "departure-shore-mask", texture: maskTexture });
  mask.width = 1920; mask.height = 1080; shore.addChild(mask); shore.mask = mask;
  presentation.once("destroyed", () => maskTexture.destroy(true));
  // Reuse the station's African bearer silhouettes at distant scale; no European hats/costumes.
  const witnesses = [0, 1, 2, 3].map(i => {
    const group = new Container({ label: `departure-witnesses-${i}`, x: 780 + i * 220, y: 715 + (i % 2) * 20 });
    group.addChild(new Graphics().ellipse(20, 3, 82, 6).fill({ color: 0x071716, alpha: .55 }));
    const art = [0, 1].map(j => {
      const slot = createVisualAssetSlot({ label: `departure-witnesses-${i}-${j}-art`, source: bearerArt, fallback: () => new Container() });
      slot.setState(j ? "second" : "first"); slot.container.scale.set(.42); slot.container.x = j * 65;
      slot.container.tint = 0x526e55; group.addChild(slot.container); return slot;
    }); shore.addChild(group); return { group, art };
  });
  const patient = new Container({ label: "departure-kurtz", x: 650, y: 730 });
  patient.addChild(new Graphics().poly([-70, 0, 65, 0, 170, 55, 40, 65]).fill({ color: 0x031010, alpha: .25 })
    .ellipse(0, 5, 125, 11).fill({ color: 0x031010, alpha: .68 }));
  const patientArt = createVisualAssetSlot({ label: "departure-kurtz-art", source: kurtzArt, fallback: () => new Container() });
  patientArt.container.scale.set(.82); patientArt.setState("weak"); patientArt.container.tint = 0xa3b8aa;
  patient.addChild(patientArt.container); layers.actors.addChild(patient);
  const ivory = new Container({ label: "departure-ivory", x: 1360, y: 705 });
  ivory.addChild(new Graphics().ellipse(0, 3, 92, 10).fill({ color: 0x071010, alpha: .62 }));
  const cargo = createVisualAssetSlot({ label: "departure-ivory-art", source: stationEvidence.ivory.art, fallback: () => new Container() });
  cargo.container.scale.set(.62); cargo.container.tint = 0xb0b9a0; ivory.addChild(cargo.container); layers.actors.addChild(ivory);
  const mooring = new Graphics({ label: "departure-mooring" }).moveTo(1460, 770).bezierCurveTo(1640, 690, 1760, 600, 1820, 440)
    .stroke({ color: 0x0b1715, width: 9 }).moveTo(1460, 770).bezierCurveTo(1640, 690, 1760, 600, 1820, 440)
    .stroke({ color: 0x9c8760, width: 4 }); layers.foreground.addChild(mooring);
  return { ...scene, shore, station, witnesses, patient, patientArt, ivory, cargo, mooring };
}
