import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { metamorphosisRoom as room } from "./room";
import { metamorphosisText as copy } from "./text";
import { createGregorActor } from "./createGregorActor";

/** Provisional artwork belongs to this work; movement/camera remain generic. */
export function createMetamorphosisRoom() {
  validateWorldLayout(room);
  const presentation = new Container({ label: "metamorphosis-room" });
  const layers = createWorldLayers();
  presentation.addChild(layers.root);
  layers.environment.addChild(new Graphics().rect(0, 0, 1920, 1080).fill(0x171b20));
  layers.environment.addChild(new Graphics().roundRect(210, 260, 1500, 650, 18)
    .fill(0x302e30).stroke({ color: 0x5e5146, width: 8 }));
  layers.ground.addChild(new Graphics().rect(260, 430, 1400, 440).fill(0x50453e));
  for (let x = 280; x < 1660; x += 100) {
    layers.ground.addChild(new Graphics().moveTo(x, 430).lineTo(x, 870)
      .stroke({ color: 0x65564a, width: 3, alpha: .5 }));
  }
  const window = room.anchors.window;
  layers.environment.addChild(new Graphics().roundRect(window.x - 110, 325, 220, 280, 8)
    .fill(0x74848a).stroke({ color: 0x201f21, width: 18 })
    .moveTo(window.x, 325).lineTo(window.x, 605).stroke({ color: 0x28282a, width: 12 }));
  const door = room.anchors.door;
  layers.ground.addChild(new Graphics().roundRect(door.x - 95, 330, 190, 430, 8)
    .fill(0x352b2b).stroke({ color: 0x775c4a, width: 13 })
    .circle(door.x + 58, 575, 9).fill(0xc2aa78));
  layers.ground.addChild(new Graphics().rect(door.x - 78, 755, 156, 6)
    .fill({ color: 0xd1b783, alpha: .7 }));
  const greteHint = new Text({ text: "Grete · tras la puerta", x: room.anchors.grete.x - 90, y: 788,
    style: { fontFamily: "Georgia", fontSize: 17, fill: 0xd8bd9b } });
  layers.ground.addChild(greteHint);
  const actor = createGregorActor(room.anchors.gregorSpawn.x, room.anchors.gregorSpawn.y);
  layers.actors.addChild(actor);
  const title = new Text({ text: "II  /  LA HABITACIÓN\nLa metamorfosis",
    x: 155, y: 90, style: { fontFamily: "Georgia", fontSize: 47, fill: 0xe4d6c5 } });
  const controls = new Text({ text: "WASD / FLECHAS · Camina     E · Interactúa y continúa     1 / 2 · Responde",
    x: 210, y: 1000, style: { fontFamily: "Arial", fontSize: 19, fill: 0xc4baaa } });
  presentation.addChild(title, controls);
  return { presentation, world: layers.root, actor };
}
