import { Container, Graphics, Text } from "pixi.js";
import type { NpcRoutineState } from "../../engine/npc/NpcRoutineController";
import { deckhandIdentity } from "./deckhand";

/** Provisional sailor artwork. Task gestures stay here, outside the routine engine. */
export function createDeckhand() {
  const actor = new Container({ label: deckhandIdentity.id });
  const body = new Container({ label: "deckhand-body" });
  actor.addChild(new Graphics().ellipse(0, 7, 22, 7).fill({ color: 0x101e21, alpha: 0.5 }), body);
  const leg = (x: number) => {
    const part = new Graphics({ x, y: -14 }).roundRect(-4, 0, 8, 20, 3).fill(0x283734)
      .roundRect(-5, 15, 11, 7, 2).fill(0x192725);
    body.addChild(part);
    return part;
  };
  const leftLeg = leg(-7), rightLeg = leg(7);
  const arm = (x: number) => {
    const part = new Graphics({ x, y: -38 }).roundRect(-4, 0, 8, 16, 3).fill(0x829c92)
      .roundRect(-3, 13, 6, 10, 3).fill(0xc3ab85);
    body.addChild(part);
    return part;
  };
  const leftArm = arm(-15), rightArm = arm(15);
  body.addChild(new Graphics().roundRect(-13, -42, 26, 31, 5).fill(0x829c92)
    .poly([-10, -41, 0, -32, 10, -41]).fill(0xcdd2ba)
    .rect(-13, -16, 26, 5).fill(0x4c4333));
  body.addChild(leftArm, rightArm);
  const head = new Container({ label: "deckhand-head", y: -53 });
  head.addChild(new Graphics().circle(0, 0, 10).fill(0xc3ab85)
    .roundRect(-12, -12, 24, 7, 2).fill(0x303f3b));
  const nose = new Graphics({ label: "deckhand-nose" }).circle(0, 0, 3).fill(0xe0c59e);
  const eyes = new Graphics().circle(-3, -1, 1.2).circle(3, -1, 1.2).fill(0x25312c);
  head.addChild(eyes, nose);
  body.addChild(head);
  const name = new Text({ text: deckhandIdentity.name, y: 42,
    style: { fontFamily: "Arial", fontSize: 17, fill: 0xc0d1bd } });
  name.anchor.set(0.5, 0);
  actor.addChild(name);

  return { actor, pose(state: NpcRoutineState, elapsedMS: number) {
    const walking = state.isMoving;
    const stride = walking ? Math.sin(state.elapsedMS * 0.013) : 0;
    const working = state.mode === "idle";
    const coiling = working && state.activity === "coil-rope";
    const checking = working && state.activity === "check-cargo";
    const lookout = working && state.activity === "lookout";
    const gesture = Math.sin(state.elapsedMS * 0.006);
    const blend = elapsedMS === 0 ? 1 : -Math.expm1(-12 * elapsedMS / 1000);
    const ease = (from: number, to: number) => from + (to - from) * blend;
    leftLeg.rotation = ease(leftLeg.rotation, stride * 0.26);
    rightLeg.rotation = ease(rightLeg.rotation, -stride * 0.26);
    leftArm.rotation = ease(leftArm.rotation, coiling ? -0.55 + gesture * 0.3 : checking ? -2.3 : -stride * 0.25);
    rightArm.rotation = ease(rightArm.rotation, coiling ? 0.55 - gesture * 0.3 : checking ? 2.3 + gesture * 0.15 : lookout ? 2.8 : stride * 0.25);
    body.y = ease(body.y, walking ? -Math.abs(stride) * 2 : coiling ? 2 + gesture : 0);
    body.rotation = ease(body.rotation, coiling ? gesture * 0.035 : 0);
    head.x = ease(head.x, state.facing.x * 2);
    nose.position.set(state.facing.x * 9, state.facing.y * 4);
    eyes.visible = state.facing.y > -0.5;
    eyes.x = state.facing.x * 4;
  } };
}
