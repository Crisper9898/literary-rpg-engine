import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { metamorphosisText as lines } from "../../story/metamorphosis/text";
import { gregor, grete } from "../metamorphosis/character";
import { greteResponse, hasSeenWindow, setGreteResponse } from "../metamorphosis/state";
import { showMetamorphosisRoom } from "../metamorphosis/showRoom";

const close = () => {
  narration.dialogue = undefined;
  narration.choices = undefined;
  narration.labels.closeCurrent();
};

export const metamorphosisWindow = newLabel("metamorphosis-window", [
  () => { narration.dialogue = { character: gregor, text: lines.window[0] }; },
  () => { narration.dialogue = { character: gregor, text: lines.window[1] }; },
  close,
]);

export const metamorphosisStay = newLabel("metamorphosis-stay", [
  () => { setGreteResponse("stay"); narration.choices = undefined;
    narration.dialogue = { character: gregor, text: lines.gregorStay }; },
]);

export const metamorphosisLeave = newLabel("metamorphosis-leave", [
  () => { setGreteResponse("leave"); narration.choices = undefined;
    narration.dialogue = { character: gregor, text: lines.gregorLeave }; },
]);

export const metamorphosisDoor = newLabel("metamorphosis-door", [
  () => { narration.dialogue = { character: grete, text:
    greteResponse() === "stay" ? lines.greteReturnStay :
      greteResponse() === "leave" ? lines.greteReturnLeave :
        hasSeenWindow() ? lines.doorAfterWindow : lines.doorBeforeWindow }; },
  () => {
    narration.dialogue = { character: grete, text: lines.greteQuestion };
    narration.choices = [
      newChoiceOption(lines.choices[0], metamorphosisStay, {}),
      newChoiceOption(lines.choices[1], metamorphosisLeave, {}),
    ];
  },
  () => { narration.choices = undefined;
    narration.dialogue = { character: grete, text:
      greteResponse() === "stay" ? lines.greteAfterStay : lines.greteAfterLeave }; },
  close,
]);

export const metamorphosisStart = newLabel("metamorphosis-start", [
  () => { showMetamorphosisRoom(); narration.dialogue = undefined; },
  () => { narration.dialogue = undefined; },
]);
