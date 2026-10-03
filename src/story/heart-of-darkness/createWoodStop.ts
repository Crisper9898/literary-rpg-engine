import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets } from "./journeyArtAssets";
import { createDeckhand } from "./createDeckhand";
import { woodStop, woodStopArt } from "./woodStop";

export function createWoodStop() {
  validateWorldLayout(woodStop);
  const presentation = new Container({ label: "journey-wood-stop" });
  const layers = createWorldLayers();
  presentation.addChild(layers.root);
  const background = createVisualAssetSlot({ label: "wood-station-art", source: woodStopArt,
    fallback: () => new Container() });
  layers.environment.addChild(background.container);
  const actor = new Container({ label: "marlow-shore", ...woodStop.anchors.arrival });
  const art = createVisualAssetSlot({ label: "marlow-art", source: journeyArtAssets.marlowSheet,
    fallback: () => new Container() });
  art.container.scale.set(1.32);
  actor.addChild(new Graphics().ellipse(0, 3, 32, 8).fill({ color: 0x050c0c, alpha: .65 })
    .poly([-14, 0, 14, 0, -60, 28, -100, 28]).fill({ color: 0x050c0c, alpha: .25 }), art.container);
  layers.actors.addChild(actor);
  const sailor = createDeckhand();
  sailor.actor.position.set(1460, 780);
  sailor.setMood("concern");
  layers.actors.addChild(sailor.actor);
  for (const [id, anchor, caption] of [
    ["book", woodStop.anchors.book, "LIBRO"], ["wood", woodStop.anchors.wood, "LEÑA"],
    ["warning", woodStop.anchors.warning, "ADVERTENCIA"],
  ] as const) {
    const tag = new Text({ label: `shore-${id}-hint`, text: caption,
      x: anchor.x - 45, y: anchor.y + 8,
      style: { fontFamily: "Georgia", fontSize: 17, fill: 0xc9bea0, stroke: { color: 0x101b1a, width: 3 } } });
    layers.ground.addChild(tag);
  }
  presentation.addChild(new Text({ label: "wood-stop-title", text: "II  /  LA CABAÑA ABANDONADA", x: 90, y: 90,
    style: { fontFamily: "Georgia", fontSize: 26, fill: 0xd3c8ab, stroke: { color: 0x101b1a, width: 4 } } }));
  return { presentation, layers, actor, sailor, art, background };
}
