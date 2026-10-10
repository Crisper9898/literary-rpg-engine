import { Container, Graphics } from "pixi.js";
import { createKurtzBreakdown } from "./createKurtzBreakdown";
import { finalNightPoints } from "./kurtzFinalNight";

/** New episode only. Reuse the boat/cot staging without changing the approved Deck or earlier repair. */
export function createKurtzFinalNight() {
  const scene = createKurtzBreakdown();
  scene.player.label = "final-night-player"; scene.patient.label = "final-night-kurtz";
  for (const prop of [scene.engine, scene.forge, scene.papers]) prop.destroy({ children: true });
  const candle = new Container({ label: "final-night-candle", ...finalNightPoints.candle });
  const light = new Graphics({ label: "final-night-candle-light" });
  for (let i = 7; i > 0; i--) light.ellipse(0, -28, i * 13, i * 8).fill({ color: 0xe6b066, alpha: .014 });
  candle.addChild(light, new Graphics().ellipse(0, 1, 12, 3).fill({ color: 0x061215, alpha: .7 })
    .ellipse(0, -2, 9, 3).fill(0x706149).stroke({ color: 0x18201b, width: 2 })
    .poly([-3, -26, 4, -26, 3, -2, -3, -2]).fill(0xd2c09a).stroke({ color: 0x504733, width: 1 })
    .moveTo(0, -27).lineTo(0, -31).stroke({ color: 0x342b21, width: 1 }));
  const flame = new Graphics({ label: "final-night-candle-flame" })
    .poly([0, -43, -5, -32, 0, -28, 4, -32]).fill(0xd69446)
    .poly([0, -38, -2, -32, 0, -30, 2, -32]).fill(0xffe4a0);
  candle.addChild(flame); scene.layers.actors.addChild(candle);
  const candleStand = new Graphics({ label: "final-night-candle-stand", x: 705, y: 730 })
    .ellipse(0, 3, 14, 4).fill({ color: 0x031015, alpha: .7 })
    .ellipse(0, -1, 10, 3).fill(0x4e4937).stroke({ color: 0x19221e, width: 2 })
    .moveTo(0, -3).lineTo(0, -70).stroke({ color: 0x15211e, width: 5 })
    .moveTo(1, -3).lineTo(1, -70).stroke({ color: 0x92805d, width: 1.5 })
    .ellipse(0, -70, 11, 3).fill(0x655940).stroke({ color: 0x15211e, width: 2 });
  scene.layers.actors.addChild(candleStand);
  return { ...scene, candle, candleStand, light, flame };
}
