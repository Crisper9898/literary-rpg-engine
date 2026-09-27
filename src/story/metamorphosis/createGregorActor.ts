import { Container, Graphics, Text } from "pixi.js";
import { metamorphosisText as copy } from "./text";

/** Gregor's provisional figure is shared by this work's spaces. */
export function createGregorActor(x: number, y: number) {
  const actor = new Container({ label: "gregor", x, y });
  const body = new Graphics().ellipse(0, -21, 33, 46).fill(0x352820)
    .ellipse(0, -25, 14, 33).fill(0x5d4735)
    .circle(-10, -61, 5).fill(0x28201d).circle(10, -61, 5).fill(0x28201d);
  for (const side of [-1, 1]) for (const legY of [-45, -26, -8]) {
    body.moveTo(side * 20, legY).lineTo(side * 47, legY + 14)
      .stroke({ color: 0x201b19, width: 5 });
  }
  const name = new Text({ text: copy.gregorName,
    style: { fontFamily: "Georgia", fontSize: 20, fill: 0xe2d4bb } });
  name.anchor.set(.5, 0); name.y = 24;
  actor.addChild(body, name);
  return actor;
}
