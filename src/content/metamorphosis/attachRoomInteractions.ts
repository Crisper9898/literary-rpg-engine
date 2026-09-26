import { narration } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { metamorphosisRoom as room, roomInteractionRange } from "../../story/metamorphosis/room";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { metamorphosisDoor, metamorphosisWindow } from "../labels/metamorphosis.label";
import { markDoorHeard, markWindowSeen } from "./state";

export function attachRoomInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement) {
  let busy = false;
  let disposed = false;
  const active = () => narration.labels.opened.some(({ label }) =>
    label === metamorphosisWindow.id || label === metamorphosisDoor.id);
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
        markDoorHeard(); void run(() => narration.call(metamorphosisDoor, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const interact = () => {
    if (active()) { if (narration.canContinue) void run(() => narration.continue({})); return; }
    if (busy || disposed) return;
    void interactions.available()?.execute();
  };
  const view = createMetamorphosisConversationView(surface.parentElement!, surface,
    { interact, advance: interact });
  const render = () => {
    const isActive = active();
    const available = isActive ? undefined : interactions.available();
    view.render({ active: isActive, available: !!available, busy,
      prompt: available?.prompt ?? "Acércate a la ventana o a la puerta · E",
      speaker: isActive ? copy.gregorName : "",
      text: isActive ? [narration.dialogue?.text ?? ""].flat().join(" ") : "" });
  };
  const disposeKey = bindInteractionKey(surface, interact);
  ticker.add(render, undefined, UPDATE_PRIORITY.NORMAL - 2);
  render();
  presentation.once("destroyed", () => {
    disposed = true; ticker.remove(render); disposeKey(); view.dispose();
  });
}
