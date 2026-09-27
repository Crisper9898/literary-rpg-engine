import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { familyActivityRange, metamorphosisRoom as room, roomInteractionRange } from "../../story/metamorphosis/room";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { metamorphosisDoor, metamorphosisFamilyAnswer, metamorphosisFamilyApproach,
  metamorphosisFamilyDoor, metamorphosisFamilySilence, metamorphosisLeave,
  metamorphosisStay, metamorphosisWindow } from "../labels/metamorphosis.label";
import { familyResponse, hasHeardFamilyActivity, markDoorHeard, markWindowSeen } from "./state";

export function attachRoomInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement) {
  let busy = false;
  let disposed = false;
  const listeners = new AbortController();
  const roomLabels = new Set([metamorphosisWindow.id, metamorphosisDoor.id,
    metamorphosisStay.id, metamorphosisLeave.id, metamorphosisFamilyApproach.id,
    metamorphosisFamilyDoor.id, metamorphosisFamilyAnswer.id, metamorphosisFamilySilence.id]);
  const active = () => narration.labels.opened.some(({ label }) => roomLabels.has(label));
  const run = async (action: () => Promise<unknown>) => {
    if (busy || disposed) return;
    busy = true;
    try { await action(); }
    catch (error) { console.error("Metamorphosis dialogue failed", error); }
    finally { busy = false; if (!disposed) render(); }
  };
  const actions: SpatialAction[] = [
    { id: "window", prompt: copy.windowPrompt, target: () => room.anchors.window,
      range: roomInteractionRange, execute: () => {
        markWindowSeen(); void run(() => narration.call(metamorphosisWindow, {}));
      } },
    { id: "door", prompt: copy.doorPrompt, target: () => room.anchors.door,
      range: roomInteractionRange, execute: () => {
        markDoorHeard();
        const label = familyResponse() ? metamorphosisDoor : metamorphosisFamilyDoor;
        void run(() => narration.call(label, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const familyInRange = () => interactions.inRange(() => room.anchors.door, familyActivityRange);
  const hearFamily = () => {
    if (busy || disposed || active() || hasHeardFamilyActivity() || !familyInRange()) return false;
    void run(() => narration.call(metamorphosisFamilyApproach, {}));
    return true;
  };
  const interact = () => {
    if (active()) {
      if (!narration.choices.list?.length && narration.canContinue) void run(() => narration.continue({}));
      return;
    }
    if (busy || disposed) return;
    if (hearFamily()) return;
    void interactions.available()?.execute();
  };
  const choose = (index: number) => {
    const choice = narration.choices.list?.[index];
    if (active() && choice) void run(() => narration.choices.select(choice, {}));
  };
  const view = createMetamorphosisConversationView(surface.parentElement!, surface,
    { interact, advance: interact, choose });
  const render = () => {
    hearFamily();
    const isActive = active();
    const available = isActive ? undefined : interactions.available();
    const dialogue = isActive ? narration.dialogue : undefined;
    const character = dialogue?.character;
    const model = typeof character === "string" ?
      RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, available: !!available, busy,
      prompt: available?.prompt ?? "Acércate a la ventana o a la puerta · E",
      speaker: model instanceof CharacterBaseModel ? model.name ?? "" : "",
      text: isActive ? [dialogue?.text ?? ""].flat().join(" ") : "",
      choices: isActive ? (narration.choices.list ?? []).map(item => [item.text].flat().join(" ")) : [] });
  };
  const disposeKey = bindInteractionKey(surface, interact);
  surface.addEventListener("keydown", (event) => {
    if (event.target !== surface || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (active() && (event.code === "Digit1" || event.code === "Digit2")) {
      event.preventDefault(); choose(event.code === "Digit1" ? 0 : 1);
    }
  }, { signal: listeners.signal });
  ticker.add(render, undefined, UPDATE_PRIORITY.NORMAL - 2);
  render();
  presentation.once("destroyed", () => {
    disposed = true; ticker.remove(render); listeners.abort(); disposeKey(); view.dispose();
  });
}
