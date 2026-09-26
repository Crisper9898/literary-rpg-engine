import { narration, newLabel } from "@drincs/pixi-vn";
import { metamorphosisText as lines } from "../../story/metamorphosis/text";
import { gregor } from "../metamorphosis/character";
import { hasSeenWindow } from "../metamorphosis/state";
import { showMetamorphosisRoom } from "../metamorphosis/showRoom";

const close = () => { narration.dialogue = undefined; narration.labels.closeCurrent(); };

export const metamorphosisWindow = newLabel("metamorphosis-window", [
  () => { narration.dialogue = { character: gregor, text: lines.window[0] }; },
  () => { narration.dialogue = { character: gregor, text: lines.window[1] }; },
  close,
]);

export const metamorphosisDoor = newLabel("metamorphosis-door", [
  () => { narration.dialogue = { character: gregor,
    text: hasSeenWindow() ? lines.doorAfterWindow[0] : lines.doorBeforeWindow[0] }; },
  () => { narration.dialogue = { character: gregor,
    text: hasSeenWindow() ? lines.doorAfterWindow[1] : lines.doorBeforeWindow[1] }; },
  close,
]);

export const metamorphosisStart = newLabel("metamorphosis-start", [
  () => { showMetamorphosisRoom(); narration.dialogue = undefined; },
  () => { narration.dialogue = undefined; },
]);
