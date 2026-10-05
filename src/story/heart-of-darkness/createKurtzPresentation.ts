import { Container, Graphics } from "pixi.js";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { bearerArt, kurtzArt } from "./kurtzIntroduction";
export function createKurtzPresentation(parent: Container) {
  const group = new Container({ label: "kurtz-procession", visible: false }); parent.addChild(group);
  const shadow = new Graphics({ label: "kurtz-contact" }).ellipse(0, 7, 155, 13).fill({ color: 0x091214, alpha: .6 });
  group.addChild(shadow);
  const bearers = [0, 1].map(i => {
    const body = new Container({ label: `kurtz-bearer-${i}`, x: i ? 135 : -135, y: i ? 4 : -10 });
    body.addChild(new Graphics().ellipse(0, 4, 28, 8).fill({ color: 0x091214, alpha: .7 }));
    const visual = createVisualAssetSlot({ label: `bearer-art-${i}`, source: bearerArt, fallback: () => new Container() });
    visual.setState(i ? "second" : "first"); visual.container.tint = 0xb4c2b6;
    body.addChild(visual.container); group.addChild(body); return body;
  });
  const art = createVisualAssetSlot({ label: "kurtz-art", source: kurtzArt, fallback: () => new Container() });
  art.container.y = -65; art.container.tint = 0xadb7a6; group.addChild(art.container);
  // Front bearer's torso occludes the pole, giving the transport physical depth.
  group.addChild(bearers[1]);
  return { group, art, bearers, ready: Promise.all([art.ready]) };
}
