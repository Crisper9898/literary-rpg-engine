import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets } from "./journeyArtAssets";
import { innerStation, russianArt, stationArt } from "./innerStation";

export function createInnerStation() {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  const background = createVisualAssetSlot({ label: "inner-station-art", source: stationArt, fallback: () => new Container() });
  layers.environment.addChild(background.container);
  const actor = new Container({ label: "marlow-station", ...innerStation.anchors.arrival });
  const art = createVisualAssetSlot({ label: "marlow-art", source: journeyArtAssets.marlowSheet, fallback: () => new Container() });
  art.container.scale.set(1.5);
  art.container.tint = 0xc1cecb;
  actor.addChild(new Graphics().poly([-30, 1, -10, -4, 21, -1, 37, 9, 5, 14, -33, 9])
    .fill({ color: 0x091618, alpha: .66 }), art.container);
  layers.actors.addChild(actor);
  const russian = new Container({ label: "russian-station", ...innerStation.anchors.russian });
  const russianVisual = createVisualAssetSlot({ label: "russian-art", source: russianArt, fallback: () => new Container() });
  russianVisual.container.tint = 0xc1cecb;
  russian.addChild(new Graphics().poly([-37, 2, -18, -3, 26, 0, 45, 10, -7, 16, -39, 7])
    .fill({ color: 0x091618, alpha: .6 }), russianVisual.container);
  layers.actors.addChild(russian);
  const reeds = createVisualAssetSlot({ label: "station-foreground-reeds", source: journeyArtAssets.foregroundReeds,
    fallback: () => new Container() }); reeds.container.tint = 0x68837d; layers.foreground.addChild(reeds.container);
  for (const [id, text] of [["planks", "TABLONES"], ["fence", "CERCA"], ["grass", "HUELLAS"], ["house", "COLINA"]] as const) {
    const point = innerStation.anchors[id];
    layers.ground.addChild(new Text({ label: `station-${id}-hint`, text, x: point.x - 45, y: point.y + 14,
      style: { fontFamily: "Georgia", fontSize: 16, fill: 0xb8c4b6, stroke: { color: 0x12221f, width: 3 } } }));
  }
  return { presentation, layers, actor, art, russian, russianVisual, background };
}
