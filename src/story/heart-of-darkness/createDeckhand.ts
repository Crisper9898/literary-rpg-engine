import { Container, Graphics } from "pixi.js";
import type { NpcRoutineState } from "../../engine/npc/NpcRoutineController";
import { deckhandIdentity } from "./deckhand";
import { journeyVisual as art } from "./journeyVisual";
import { journeyArtAssets } from "./journeyArtAssets";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import type { JourneyActorMood } from "./journeyArtStages";

/** Inked deck worker: individual limbs keep the existing rope/cargo/lookout tasks legible. */
export function createDeckhand() {
  const actor = new Container({ label: deckhandIdentity.id });
  actor.addChild(new Graphics({ label: "fire-cast-shadow", alpha: 0 })
    .poly([-18, 0, 18, 0, 165, 110, 105, 110]).fill(0x030809));
  actor.addChild(new Graphics({ label: "deckhand-contact-shadow" })
    .poly([-21, 1, 20, 1, 88, 16, 24, 18]).fill({ color: art.ink, alpha: 0.15 })
    .ellipse(7, 6, 38, 9).fill({ color: art.ink, alpha: 0.58 })
    .ellipse(-3, 3, 23, 3).fill({ color: art.ember, alpha: 0.12 }));
  const bodyFallback = new Container();
  const visual = createVisualAssetSlot({ label: "deckhand-body",
    source: journeyArtAssets.deckhandSheet, fallback: () => bodyFallback });
  const body = visual.container;
  body.scale.set(1.32);
  let mood: JourneyActorMood = "neutral";
  actor.addChild(body);
  const leg = (x: number) => {
    const part = new Graphics({ x, y: -20 })
      .poly([-8, -6, 7, -6, 8, 24, 5, 38, -9, 38]).fill(art.ink)
      .poly([-8, 8, 5, 8, 6, 29, -8, 29]).fill(0x6d7161)
      .poly([-9, 35, 8, 34, 14, 40, -12, 42]).fill(0x1e2825);
    bodyFallback.addChild(part);
    return part;
  };
  const leftLeg = leg(-12), rightLeg = leg(12);
  const arm = (x: number) => {
    const part = new Graphics({ x, y: -72 })
      .poly([-9, -5, 8, -5, 10, 25, 4, 42, -7, 39, -12, 18]).fill(0x667165)
      .moveTo(-8, 2).lineTo(4, 25).stroke({ color: art.paper, width: 2, alpha: 0.34 })
      .ellipse(0, 43, 7, 6).fill(0x9d8867);
    bodyFallback.addChild(part);
    return part;
  };
  const leftArm = arm(-24), rightArm = arm(24);
  bodyFallback.addChild(new Graphics({ label: "deckhand-coat" })
    .poly([-21, -79, 20, -79, 23, -28, 13, -13, -16, -13, -25, -31])
    .fill(0x526058).stroke({ color: art.ink, width: 4 })
    .poly([-5, -77, 0, -59, 9, -78]).fill(art.paper)
    .poly([-20, -74, -16, -79, -11, -41, -21, -35])
      .fill({ color: art.paper, alpha: 0.1 })
    .poly([16, -78, 22, -71, 23, -30, 17, -31])
      .fill({ color: art.ember, alpha: 0.14 })
    .poly([-3, -78, 0, -60, 6, -77]).fill({ color: art.paper, alpha: 0.33 })
    .moveTo(-16, -62).lineTo(-12, -28).stroke({ color: art.paper, width: 2, alpha: 0.26 })
    .rect(-23, -23, 46, 7).fill(art.ink));
  const workRope = new Graphics({ label: "deckhand-work-rope" })
    .moveTo(-23, -33).bezierCurveTo(-35, -14, -32, 5, -13, 7)
    .bezierCurveTo(11, 12, 19, -2, 23, -31)
    .stroke({ color: art.brass, width: 3, alpha: 0.85 })
    .moveTo(-16, 5).bezierCurveTo(-6, -4, 7, -4, 12, 4)
    .stroke({ color: art.ink, width: 1, alpha: 0.55 });
  workRope.alpha = 0;
  bodyFallback.addChild(workRope);
  bodyFallback.addChild(leftArm, rightArm);
  const head = new Container({ label: "deckhand-head", y: -96 });
  head.addChild(new Graphics()
    .ellipse(0, 0, 14, 16).fill(0x9c8a70).stroke({ color: art.ink, width: 3 })
    .poly([-14, -10, 13, -10, 17, -16, -15, -18]).fill(art.ink)
    .moveTo(-4, 7).lineTo(8, 7).stroke({ color: art.ink, width: 2 }));
  const nose = new Graphics({ label: "deckhand-nose" }).poly([7, -1, 17, 3, 6, 6]).fill(0x9c8a70);
  head.addChild(nose);
  bodyFallback.addChild(head);

  return { actor, setMood(next: JourneyActorMood) { mood = next; }, pose(state: NpcRoutineState, elapsedMS: number) {
    const walking = state.isMoving;
    const stride = walking ? Math.sin(state.elapsedMS * 0.013) : 0;
    const working = state.mode === "idle";
    const coiling = working && state.activity === "coil-rope";
    const checking = working && state.activity === "check-cargo";
    const lookout = working && state.activity === "lookout";
    const gesture = Math.sin(state.elapsedMS * 0.006);
    workRope.alpha = coiling ? 0.9 : 0;
    workRope.y = coiling ? gesture * 2 : 0;
    visual.setState(walking ? (stride >= 0 ? "walkA" : "walkB") : mood === "alarm" ? "alarm" :
      coiling ? (gesture >= 0 ? "coilA" : "coilB") : checking ? "cargo" :
        lookout ? "lookout" : mood === "concern" ? "concern" : "idle");
    if (Math.abs(state.facing.x) > .2) body.scale.x = Math.sign(state.facing.x) * body.scale.y;
    const blend = elapsedMS === 0 ? 1 : -Math.expm1(-12 * elapsedMS / 1000);
    const ease = (from: number, to: number) => from + (to - from) * blend;
    leftLeg.rotation = ease(leftLeg.rotation, stride * 0.25);
    rightLeg.rotation = ease(rightLeg.rotation, -stride * 0.25);
    leftArm.rotation = ease(leftArm.rotation, coiling ? -0.55 + gesture * 0.3 : checking ? -1.5 : -stride * 0.2);
    rightArm.rotation = ease(rightArm.rotation, coiling ? 0.55 - gesture * 0.3 : checking ? 1.6 : lookout ? 2.4 : stride * 0.2);
    body.y = ease(body.y, walking ? -Math.abs(stride) * 2 : coiling ? gesture : 0);
    body.rotation = ease(body.rotation, coiling ? gesture * 0.025 : 0);
    head.x = ease(head.x, state.facing.x * 2);
    nose.scale.x = state.facing.x < -0.2 ? -1 : 1;
  } };
}
