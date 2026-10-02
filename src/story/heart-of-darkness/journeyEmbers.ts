import { Container, Graphics, type Ticker } from "pixi.js";

/** A small fixed pool of embers; no textures, timers or allocations per frame. */
export function attachJourneyEmbers(parent: Container, ticker: Ticker) {
  const field = new Container({ label: "journey-fire-embers", eventMode: "none", alpha: 0 });
  const particles = Array.from({ length: 18 }, (_, index) => {
    const ember = new Graphics().ellipse(0, 0, 2 + index % 3, 1.2)
      .fill(index % 3 === 0 ? 0xffd66b : 0xf27731);
    ember.rotation = -.65;
    field.addChild(ember);
    return ember;
  });
  parent.addChild(field);
  let seconds = 0;
  const update = (frame: Ticker) => {
    seconds += Math.min(frame.deltaMS, 50) / 1000;
    particles.forEach((ember, index) => {
      const phase = (seconds * (.045 + index % 4 * .008) + index / particles.length) % 1;
      ember.position.set((index * 173 + seconds * 19) % 1920, 810 - phase * 720);
      ember.alpha = Math.sin(phase * Math.PI) * .8;
    });
  };
  ticker.add(update, undefined, -5);
  field.once("destroyed", () => ticker.remove(update));
  return { setIntensity(value: number) { field.alpha = value; field.visible = value > .001; } };
}
