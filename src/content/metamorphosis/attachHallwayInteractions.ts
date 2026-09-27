import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { metamorphosisHallway as hall, hallwayInteractionRange } from "../../story/metamorphosis/hallway";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { metamorphosisHallwayPicture } from "../labels/metamorphosis.label";

export function attachHallwayInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement, returnToRoom: () => void) {
  let busy = false;
  let disposed = false;
  const active = () => narration.labels.opened.some(({ label }) => label === metamorphosisHallwayPicture.id);
  const run = async (action: () => Promise<unknown>) => {
    if (busy || disposed) return;
    busy = true;
    try { await action(); }
    catch (error) { console.error("Metamorphosis hallway dialogue failed", error); }
    finally { busy = false; if (!disposed) render(); }
  };
  const actions: SpatialAction[] = [
    { id: "room-door", prompt: copy.returnPrompt, target: () => hall.anchors.roomDoor,
      range: hallwayInteractionRange, execute: returnToRoom },
    { id: "picture", prompt: copy.picturePrompt, target: () => hall.anchors.picture,
      range: hallwayInteractionRange, execute: () => {
        void run(() => narration.call(metamorphosisHallwayPicture, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const interact = () => {
    if (active()) {
      if (narration.canContinue) void run(() => narration.continue({}));
      return;
    }
    if (busy || disposed) return;
    void interactions.available()?.execute();
  };
  const view = createMetamorphosisConversationView(surface.parentElement!, surface,
    { interact, advance: interact, choose: () => {} }, "Interacciones del pasillo");
  const render = () => {
    const isActive = active();
    const available = isActive ? undefined : interactions.available();
    const dialogue = isActive ? narration.dialogue : undefined;
    const character = dialogue?.character;
    const model = typeof character === "string" ?
      RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, available: !!available, busy,
      prompt: available?.prompt ?? "Acércate a la puerta o al cuadro · E",
      speaker: model instanceof CharacterBaseModel ? model.name ?? "" : "",
      text: isActive ? [dialogue?.text ?? ""].flat().join(" ") : "",
      choices: [] });
  };
  const disposeKey = bindInteractionKey(surface, interact);
  ticker.add(render, undefined, UPDATE_PRIORITY.NORMAL - 2);
  render();
  presentation.once("destroyed", () => {
    disposed = true; ticker.remove(render); disposeKey(); view.dispose();
  });
}
