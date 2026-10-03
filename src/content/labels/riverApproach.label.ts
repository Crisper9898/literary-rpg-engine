import { narration, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { approachDecision } from "../state/woodStopState";
import { markApproachBeat } from "../state/approachState";
import { approachLines as lines, type ApproachBeat } from "../../story/heart-of-darkness/riverApproach";

const close = () => { narration.dialogue = undefined; narration.labels.closeCurrent(); };
const beat = (id: ApproachBeat, text: () => string) => newLabel(`journey-approach-${id}`, [
  () => { markApproachBeat(id); narration.dialogue = { character: marlow, text: text() }; }, close,
]);
export const approachArrival = beat("arrival", () => approachDecision() === "wait" ? lines.arrivalWait : lines.arrivalProceed);
export const approachLeft = beat("left", () => lines.left);
export const approachRight = beat("right", () => lines.right);
export const approachAttack = beat("attack", () => lines.attack);
export const approachHelmsman = newLabel("journey-approach-helmsman", [
  () => { markApproachBeat("helmsman"); narration.dialogue = { character: marlow, text: lines.helmsman }; },
  () => { narration.dialogue = { character: marlow, text: lines.helmsmanAfter }; }, close,
]);
export const approachAfter = beat("after", () => lines.after);
export const approachLabels = { arrival: approachArrival, left: approachLeft, right: approachRight,
  attack: approachAttack, helmsman: approachHelmsman, after: approachAfter };
