import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { metamorphosisText as lines } from "../../story/metamorphosis/text";
import { gregor, grete } from "../metamorphosis/character";
import { familyResponse, greteResponse, hasSeenWindow, markFamilyActivityHeard,
  setFamilyResponse, setGreteResponse } from "../metamorphosis/state";
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

export const metamorphosisFamilyApproach = newLabel("metamorphosis-family-approach", [
  () => { markFamilyActivityHeard();
    narration.dialogue = { character: gregor, text: lines.familyApproach }; },
  close,
]);

export const metamorphosisFamilyAnswer = newLabel("metamorphosis-family-answer", [
  () => { setFamilyResponse("answered"); narration.choices = undefined;
    narration.dialogue = { character: gregor, text: lines.familyAnswered }; },
]);

export const metamorphosisFamilySilence = newLabel("metamorphosis-family-silence", [
  () => { setFamilyResponse("silent"); narration.choices = undefined;
    narration.dialogue = { character: gregor, text: lines.familySilent }; },
]);

export const metamorphosisFamilyDoor = newLabel("metamorphosis-family-door", [
  () => {
    narration.dialogue = { character: grete, text: lines.familyQuestion };
    narration.choices = [
      newChoiceOption(lines.familyChoices[0], metamorphosisFamilyAnswer, {}),
      newChoiceOption(lines.familyChoices[1], metamorphosisFamilySilence, {}),
    ];
  },
  () => { narration.choices = undefined;
    narration.dialogue = { character: grete, text: familyResponse() === "answered" ?
      lines.familyAfterAnswer : lines.familyAfterSilence }; },
  close,
]);

const greteOpening = () => {
  const family = familyResponse() === "answered" ? lines.familyReturnAnswer :
    familyResponse() === "silent" ? lines.familyReturnSilence : "";
  const greteLine = greteResponse() === "stay" ? lines.greteReturnStay :
    greteResponse() === "leave" ? lines.greteReturnLeave :
      hasSeenWindow() ? lines.doorAfterWindow : lines.doorBeforeWindow;
  return family ? `${family} ${greteLine}` : greteLine;
};

export const metamorphosisDoor = newLabel("metamorphosis-door", [
  () => { narration.dialogue = { character: grete, text: greteOpening() }; },
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
