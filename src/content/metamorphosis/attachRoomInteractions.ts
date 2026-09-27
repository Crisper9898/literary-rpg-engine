import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { familyActivityRange, metamorphosisRoom as room, roomExitRange,
  roomInteractionRange } from "../../story/metamorphosis/room";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { metamorphosisClerkArrival, metamorphosisClerkDoor, metamorphosisClerkExplain,
  metamorphosisClerkSilence, metamorphosisDoor, metamorphosisFamilyAnswer, metamorphosisFamilyApproach,
  metamorphosisFamilyDoor, metamorphosisFamilySilence, metamorphosisLeave,
  metamorphosisStay, metamorphosisWindow } from "../labels/metamorphosis.label";
import { clerkResponse, familyResponse, hasHeardClerkArrival, hasHeardFamilyActivity,
  markDoorHeard, markWindowSeen } from "./state";

export function attachRoomInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement, exitRoom: () => void) {
  let busy = false;
  let disposed = false;
  const listeners = new AbortController();
  const roomLabels = new Set([metamorphosisWindow.id, metamorphosisDoor.id,
    metamorphosisStay.id, metamorphosisLeave.id, metamorphosisFamilyApproach.id,
    metamorphosisFamilyDoor.id, metamorphosisFamilyAnswer.id, metamorphosisFamilySilence.id,
    metamorphosisClerkArrival.id, metamorphosisClerkDoor.id, metamorphosisClerkExplain.id,
    metamorphosisClerkSilence.id]);
  const active = () => narration.labels.opened.some(({ label }) => roomLabels.has(label));
  const canExit = () => hasHeardFamilyActivity() && !!familyResponse() &&
    hasHeardClerkArrival() && !!clerkResponse();
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
      range: roomInteractionRange, enabled: () => !clerkResponse(), execute: () => {
        markDoorHeard();
        const label = !familyResponse() ? metamorphosisFamilyDoor :
          metamorphosisClerkDoor;
        void run(() => narration.call(label, {}));
      } },
    { id: "exit", prompt: copy.exitPrompt, target: () => room.anchors.door,
      range: roomExitRange, priority: 1, enabled: canExit,
      execute: exitRoom },
    { id: "grete", prompt: copy.gretePrompt, target: () => room.anchors.grete,
      range: roomExitRange, enabled: () => !!clerkResponse(), execute: () => {
        void run(() => narration.call(metamorphosisDoor, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const hearDoorEvent = () => {
    if (busy || disposed || active() ||
      !interactions.inRange(() => room.anchors.door, familyActivityRange)) return false;
    const event = !hasHeardFamilyActivity() ? metamorphosisFamilyApproach :
      familyResponse() && !hasHeardClerkArrival() ? metamorphosisClerkArrival : undefined;
    if (!event) return false;
    void run(() => narration.call(event, {}));
    return true;
  };
  const interact = () => {
    if (active()) {
      if (!narration.choices.list?.length && narration.canContinue) void run(() => narration.continue({}));
      return;
    }
    if (busy || disposed) return;
    if (hearDoorEvent()) return;
    void interactions.available()?.execute();
  };
  const choose = (index: number) => {
    const choice = narration.choices.list?.[index];
    if (active() && choice) void run(() => narration.choices.select(choice, {}));
  };
  const view = createMetamorphosisConversationView(surface.parentElement!, surface,
    { interact, advance: interact, choose });
  const render = () => {
    hearDoorEvent();
    const isActive = active();
    const available = isActive ? undefined : interactions.available();
    const dialogue = isActive ? narration.dialogue : undefined;
    const character = dialogue?.character;
    const model = typeof character === "string" ?
      RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, available: !!available, busy,
      prompt: available?.prompt ?? "Acércate a la ventana, a Grete o a la puerta · E",
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
