import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { createGregorActor } from "./createGregorActor";
import { metamorphosisHallway as hall } from "./hallway";

/** A small provisional landing outside Gregor's room. */
export function createMetamorphosisHallway() {
  validateWorldLayout(hall);
  const presentation = new Container({ label: "metamorphosis-hallway" });
  const layers = createWorldLayers();
  presentation.addChild(layers.root);
  layers.environment.addChild(new Graphics().rect(0, 0, 1920, 1080).fill(0x15191e));
  layers.environment.addChild(new Graphics().roundRect(210, 260, 1500, 660, 16)
    .fill(0x39383b).stroke({ color: 0x65594d, width: 8 }));
  layers.ground.addChild(new Graphics().rect(260, 420, 1400, 460).fill(0x625449));
  for (let x = 280; x < 1660; x += 120) {
    layers.ground.addChild(new Graphics().moveTo(x, 420).lineTo(x, 880)
      .stroke({ color: 0x796758, width: 3, alpha: .35 }));
  }
  const door = hall.anchors.roomDoor;
  layers.ground.addChild(new Graphics().roundRect(door.x - 90, 325, 180, 405, 7)
    .fill(0x342b2c).stroke({ color: 0x8a6d56, width: 13 })
    .circle(door.x + 56, 570, 8).fill(0xc1a37b));
  const picture = hall.anchors.picture;
  layers.ground.addChild(new Graphics().roundRect(picture.x - 105, 335, 210, 185, 5)
    .fill(0x6f7270).stroke({ color: 0x332b2a, width: 18 })
    .moveTo(picture.x - 70, 480).lineTo(picture.x + 65, 372)
    .stroke({ color: 0x495857, width: 10 }));
  const actor = createGregorActor(hall.anchors.arrival.x, hall.anchors.arrival.y);
  layers.actors.addChild(actor);
  presentation.addChild(new Text({ text: "EL PASILLO\nLa metamorfosis",
    x: 155, y: 90, style: { fontFamily: "Georgia", fontSize: 47, fill: 0xe4d6c5 } }));
  presentation.addChild(new Text({ text: "WASD / FLECHAS · Camina     E · Interactúa y regresa",
    x: 210, y: 1000, style: { fontFamily: "Arial", fontSize: 19, fill: 0xc4baaa } }));
  return { presentation, world: layers.root, actor };
}
