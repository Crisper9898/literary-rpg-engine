import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { metamorphosisRoom as room } from "./room";
import { metamorphosisText as copy } from "./text";

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
  layers.environment.addChild(new Graphics().roundRect(door.x - 95, 330, 190, 430, 8)
    .fill(0x352b2b).stroke({ color: 0x775c4a, width: 13 })
    .circle(door.x + 58, 575, 9).fill(0xc2aa78));
  const actor = new Container({ label: "gregor", x: room.anchors.gregorSpawn.x, y: room.anchors.gregorSpawn.y });
  const body = new Graphics().ellipse(0, -21, 33, 46).fill(0x352820)
    .ellipse(0, -25, 14, 33).fill(0x5d4735)
    .circle(-10, -61, 5).fill(0x28201d).circle(10, -61, 5).fill(0x28201d);
  for (const side of [-1, 1]) for (const y of [-45, -26, -8]) {
    body.moveTo(side * 20, y).lineTo(side * 47, y + 14).stroke({ color: 0x201b19, width: 5 });
  }
  const name = new Text({ text: copy.gregorName,
    style: { fontFamily: "Georgia", fontSize: 20, fill: 0xe2d4bb } });
  name.anchor.set(.5, 0); name.y = 24;
  actor.addChild(body, name);
  layers.actors.addChild(actor);
  const title = new Text({ text: "II  /  LA HABITACIÓN\nLa metamorfosis",
    x: 155, y: 90, style: { fontFamily: "Georgia", fontSize: 47, fill: 0xe4d6c5 } });
  const controls = new Text({ text: "WASD / FLECHAS · Camina     E · Interactúa y continúa",
    x: 210, y: 1000, style: { fontFamily: "Arial", fontSize: 19, fill: 0xc4baaa } });
  presentation.addChild(title, controls);
  return { presentation, world: layers.root, actor };
}
