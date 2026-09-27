import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { createGregorActor } from "./createGregorActor";
import { metamorphosisHallway as hall } from "./hallway";

function createHallwayPerson(label: string, name: string, x: number, y: number,
  coat: number, accent: number) {
  const person = new Container({ label, x, y });
  const silhouette = new Graphics()
    .circle(0, -94, 20).fill(0xc4ad91)
    .roundRect(-25, -72, 50, 69, 8).fill(coat)
    .moveTo(-17, -5).lineTo(-20, 25).moveTo(17, -5).lineTo(20, 25)
    .stroke({ color: 0x292727, width: 9 })
    .moveTo(-23, -58).lineTo(-36, -22).moveTo(23, -58).lineTo(36, -22)
    .stroke({ color: coat, width: 10 })
    .circle(8, -97, 3).fill(accent);
  if (label === "hallway-clerk") silhouette.roundRect(29, -28, 27, 23, 3)
    .fill(0x292a2d).stroke({ color: 0xb7a485, width: 2 });
  const caption = new Text({ text: name,
    style: { fontFamily: "Georgia", fontSize: 17, fill: 0xe5d9c8 } });
  caption.anchor.set(.5, 0); caption.y = 31;
  person.addChild(silhouette, caption);
  return person;
}

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
  const grete = createHallwayPerson("hallway-grete", "Grete", hall.anchors.grete.x,
    hall.anchors.grete.y, 0x826f58, 0x584336);
  const clerk = createHallwayPerson("hallway-clerk", "Oficina", hall.anchors.clerk.x,
    hall.anchors.clerk.y, 0x4b5561, 0x353b41);
  layers.actors.addChild(actor, grete, clerk);
  presentation.addChild(new Text({ text: "EL PASILLO\nLa metamorfosis",
    x: 155, y: 90, style: { fontFamily: "Georgia", fontSize: 47, fill: 0xe4d6c5 } }));
  presentation.addChild(new Text({ text: "WASD / FLECHAS · Camina     E · Interactúa y regresa",
    x: 210, y: 1000, style: { fontFamily: "Arial", fontSize: 19, fill: 0xc4baaa } }));
  return { presentation, world: layers.root, actor };
}
