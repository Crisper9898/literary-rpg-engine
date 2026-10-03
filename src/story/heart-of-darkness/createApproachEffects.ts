import { Container, Graphics, Sprite } from "pixi.js";
import type { NavigationState } from "../../puzzles/riverApproach/NavigationController";
import { approachRoute } from "./riverApproach";
import { createFogTexture } from "./createFogTexture";

/** Pooled overlays; no textures, filters or display objects allocated per frame. */
export function createApproachEffects(environment: Container, foreground: Container) {
  const texture = createFogTexture();
  const fog = [
    { parent: environment, y: 160, h: 360, alpha: .8, speed: 5 },
    { parent: environment, y: 300, h: 300, alpha: .9, speed: 11 },
    { parent: foreground, y: 520, h: 320, alpha: .24, speed: 18 },
  ].map((layer, index) => {
    const owner = new Container({ label: `approach-fog-${index}` });
    for (let tile = 0; tile < 2; tile++) {
      const sprite = new Sprite({ texture, x: tile * 1920, y: layer.y, tint: 0x819493 });
      sprite.width = 1920; sprite.height = layer.h; owner.addChild(sprite);
    }
    layer.parent.addChild(owner); return { ...layer, owner };
  });
  const nearBank = environment.getChildByLabel("parallax-near-bank");
  if (nearBank) environment.setChildIndex(fog[0].owner, environment.getChildIndex(nearBank));
  const obstacles = approachRoute.obstacles.map(definition => {
    const art = new Graphics({ label: `approach-obstacle-${definition.id}` });
    // Wet split wood, broken bark and ripples, not flat collision rectangles.
    if (definition.kind === "log") {
      art.poly([-75, 0, -65, -12, 40, -8, 73, -23, 66, -1, 43, 10, -55, 13])
        .fill(0x292d24).stroke({ color: 0x0a1416, width: 4 });
      art.moveTo(-62, -6).lineTo(48, -3).lineTo(65, -17).stroke({ color: 0x7d7860, width: 3, alpha: .6 });
      art.moveTo(-50, 4).lineTo(38, 6).stroke({ color: 0x111d1c, width: 3 });
      art.poly([-24, -4, -34, -26, -22, -28, -10, -7]).fill(0x252e26);
    } else {
      art.poly([-105, 12, -80, -4, -40, -15, 12, -7, 54, -16, 110, 8, 76, 24, -35, 27])
        .fill({ color: definition.kind === "shoal" ? 0x58615b : 0x202f26, alpha: .7 });
      if (definition.kind === "reeds") for (let n = 0; n < 16; n++) {
        const x = -75 + n * 10;
        art.moveTo(x, 8).quadraticCurveTo(x - 18, -25 - n % 4 * 5, x - 12, -40 - n % 4 * 7)
          .stroke({ color: n % 2 ? 0x69705b : 0x26392f, width: 3 });
      }
    }
    for (let i = 0; i < 3; i++) art.moveTo(-96 + i * 9, 20 + i * 7)
      .quadraticCurveTo(0, 36 + i * 5, 94 - i * 8, 20 + i * 7)
      .stroke({ color: 0x859a99, width: 2, alpha: .2 });
    environment.addChild(art); return { definition, art };
  });
  // Fleeting forms remain behind leaves and middle mist, never combat targets.
  const figures = [-1, 1].map(side => {
    const g = new Graphics({ label: `bank-silhouette-${side}`, x: side < 0 ? 735 : 1500, y: 415 });
    g.ellipse(0, -32, 6, 8).fill(0x0d1918)
      .poly([-5, -25, 9, -26, 17, -8, 10, 1, 3, -14, -6, -8, -8, 15, -14, 13, -9, -3, -16, -13])
      .fill(0x0d1918);
    const leaves = new Graphics().poly([-38, 16, -36, -20, -12, -6, -8, 6, 15, -9, 29, -16, 39, 16])
      .fill(0x142321);
    g.addChild(leaves); environment.addChild(g); return g;
  });
  const arrows = Array.from({ length: 12 }, (_, index) => {
    const g = new Graphics({ label: `approach-projectile-${index}` })
      .moveTo(-34, 0).lineTo(9, 0).stroke({ color: 0x9d9b82, width: 2 })
      .poly([9, 0, 1, -3, 2, 3]).fill(0xb7b099)
      .moveTo(-31, 0).lineTo(-38, -4).moveTo(-31, 0).lineTo(-38, 4)
      .stroke({ color: 0x686959, width: 2 });
    foreground.addChild(g); return g;
  });
  const splinters = new Graphics({ label: "approach-impact-marks" });
  for (let i = 0; i < 7; i++) {
    const x = 1080 + i * 40, y = 580 + i % 3 * 19;
    splinters.moveTo(x - 8, y - 5).lineTo(x + 8, y + 5).moveTo(x, y).lineTo(x - 5, y + 12)
      .stroke({ color: 0x0a1516, width: 3 });
  }
  foreground.addChild(splinters);
  const smoke = new Sprite({ label: "approach-smoke", texture, x: 790, y: 570, tint: 0x627377, alpha: 0 });
  smoke.width = 940; smoke.height = 220; foreground.addChild(smoke);
  const motes = Array.from({ length: 24 }, (_, i) => {
    const dot = new Graphics().circle(0, 0, i % 3 === 0 ? 2 : 1).fill(0xa6b7b2);
    foreground.addChild(dot); return dot;
  });
  let elapsed = 0;
  return { fog, obstacles, smoke,
    applyMist(mist: number) { for (const f of fog) f.owner.alpha = mist * f.alpha; },
    update(state: Readonly<NavigationState>, elapsedMS: number, lookAhead: number) {
      elapsed += Math.min(elapsedMS, 100) / 1000;
      for (const f of fog) f.owner.x = -(elapsed * f.speed % 1920);
      for (const { definition, art } of obstacles) {
        const distance = definition.progress - state.progress;
        const depth = Math.max(0, Math.min(1, 1 - distance / lookAhead));
        art.visible = distance < lookAhead && distance > -.025;
        // A vessel-relative view: steering shifts the approaching hazard across
        // the sightline, while the actual ship drifts slightly within the frame.
        art.x = 995 + state.lateral * 120 + (definition.lateral - state.lateral) * 325;
        art.y = 560 + depth * 45; art.scale.set(.35 + depth * .75);
        art.alpha = .4 + depth * .6;
      }
      const attacking = state.progress >= .48 && state.progress < .93 && !state.whistle;
      arrows.forEach((arrow, i) => {
        const t = (elapsed * .36 + i / arrows.length) % 1;
        const side = i % 2 ? 1 : -1;
        arrow.visible = attacking && t < .8;
        arrow.x = (side < 0 ? 740 : 1580) + -side * t * 410;
        arrow.y = 425 + t * (230 + i % 3 * 30); arrow.rotation = side < 0 ? .5 : 2.65;
        arrow.alpha = Math.sin(t * Math.PI);
      });
      figures.forEach((g, i) => { g.alpha = attacking ? Math.max(0, Math.sin(elapsed * 1.2 + i * 3.2)) ** 12 * .6 : 0;
        g.x = (i === 0 ? 735 : 1500) + Math.sin(elapsed * .7 + i) * 13; });
      splinters.alpha = state.progress >= .48 ? .85 : 0;
      smoke.alpha = attacking ? .25 + Math.sin(elapsed * .6) * .04 : .02;
      smoke.x = 760 + Math.sin(elapsed * .3) * 70;
      motes.forEach((dot, i) => { dot.x = 740 + ((i * 61 + elapsed * (4 + i % 5)) % 870);
        dot.y = 390 + ((i * 43 + elapsed * 8) % 350); dot.alpha = .12 + Math.sin(elapsed + i) * .08; });
    },
    dispose() { texture.destroy(true); },
  };
}
