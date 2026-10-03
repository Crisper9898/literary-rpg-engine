import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { journeyDeckhand, marlow } from "../characters";
import { approachDecision, decideApproach, loadWood, readSeamanshipBook,
  readWarning, seamanshipBookRead, warningRead } from "../state/woodStopState";
import { woodStopLines as lines } from "../../story/heart-of-darkness/woodStop";

const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const woodStopWood = newLabel("journey-stop-wood", [
  () => { loadWood(); narration.dialogue = { character: marlow, text: lines.wood }; }, close,
]);
export const woodStopWarning = newLabel("journey-stop-warning", [
  () => { readWarning(); narration.dialogue = { character: marlow, text: lines.warning }; }, close,
]);
export const woodStopBook = newLabel("journey-stop-book", [
  () => { readSeamanshipBook(); narration.dialogue = { character: marlow, text: lines.book }; }, close,
]);
export const woodStopWait = newLabel("journey-stop-wait", [
  () => { decideApproach("wait"); narration.dialogue = { character: marlow, text: lines.wait }; },
]);
export const woodStopProceed = newLabel("journey-stop-proceed", [
  () => { decideApproach("proceed"); narration.dialogue = { character: marlow, text: lines.proceed }; },
]);
export const woodStopDecision = newLabel("journey-stop-decision", [
  () => {
    narration.dialogue = { character: journeyDeckhand, text: warningRead() ? lines.questionWarned : lines.question };
    narration.choices = [newChoiceOption("Esperar luz diurna", woodStopWait, {}),
      newChoiceOption("Continuar con cautela", woodStopProceed, {})];
  },
  () => { narration.dialogue = { character: journeyDeckhand,
    text: approachDecision() === "wait" ? "Prepararé el ancla. En este silencio prefiero ver adónde vamos." :
      "Llevaré la sonda a proa. Si la niebla nos cierra el paso, fondearemos." }; },
  () => { narration.dialogue = { character: marlow, text: seamanshipBookRead() ? lines.bookAfter : lines.ordinaryAfter }; }, close,
]);
export const woodStopAfter = newLabel("journey-stop-after", [
  () => { narration.dialogue = { character: journeyDeckhand, text: approachDecision() === "wait" ?
    "El ancla está lista. Esperaremos a que podamos leer la corriente con luz." :
    "La sonda está lista. Seguiremos lentamente hasta encontrar un fondeadero seguro." }; }, close,
]);
