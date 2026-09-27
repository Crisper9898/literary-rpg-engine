import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { metamorphosisHallway as hall, hallwayInteractionRange, hallwayReactionRange,
  hallwayReactionStep, hallwayNpcRange, clerkDeparture } from "../../story/metamorphosis/hallway";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { metamorphosisHallwayClerk, metamorphosisHallwayGrete,
  metamorphosisHallwayPicture } from "../labels/metamorphosis.label";
import { hasClerkLeft, hasClerkLeaving, hasClerkSeenGregor, hasGreteSeenGregor,
  markClerkLeft, markClerkSawGregor, markGreteSawGregor } from "./state";

export function attachHallwayInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement, returnToRoom: () => void) {
  let busy = false;
  let disposed = false;
  const grete = presentation.getChildByLabel("hallway-grete", true);
  const clerk = presentation.getChildByLabel("hallway-clerk", true);
  if (!grete || !clerk) throw new Error("The hallway needs both authored NPC actors.");
  const setGreteReactionPose = () => {
    grete.x = hall.anchors.grete.x + (hasGreteSeenGregor() ? hallwayReactionStep : 0);
  };
  const setClerkReactionPose = () => {
    clerk.x = hall.anchors.clerk.x + (hasClerkSeenGregor() ? hallwayReactionStep : 0);
  };
  setGreteReactionPose();
  setClerkReactionPose();
  const removeClerk = () => {
    if (!clerk.parent) return;
    clerk.parent.removeChild(clerk);
    clerk.destroy({ children: true });
  };
  // Sound and renderer positions are transient. An in-flight save settles on restore.
  if (hasClerkLeaving() && !hasClerkLeft()) markClerkLeft();
  if (hasClerkLeft()) removeClerk();
  let retreatStarted = false;
  const beginRetreat = () => {
    if (retreatStarted || hasClerkLeft() || !hasClerkLeaving()) return;
    retreatStarted = true;
    attachNpcRoutine(clerk, ticker, clerkDeparture({ x: clerk.x, y: clerk.y }), (state) => {
      if (state.mode !== "idle" || hasClerkLeft()) return;
      markClerkLeft();
      removeClerk();
    });
  };
  const hallwayLabels = new Set([metamorphosisHallwayPicture.id,
    metamorphosisHallwayGrete.id, metamorphosisHallwayClerk.id]);
  const active = () => narration.labels.opened.some(({ label }) => hallwayLabels.has(label));
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
    { id: "grete", prompt: copy.hallwayGretePrompt, target: () => grete.position,
      range: hallwayNpcRange, execute: () => {
        void run(() => narration.call(metamorphosisHallwayGrete, {}));
      } },
    { id: "clerk", prompt: copy.hallwayClerkPrompt, target: () => clerk.position,
      range: hallwayNpcRange, enabled: () => !hasClerkLeaving() && !hasClerkLeft(), execute: () => {
        void run(() => narration.call(metamorphosisHallwayClerk, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const reactToGregor = () => {
    if (!hasGreteSeenGregor() && interactions.inRange(() => grete.position, hallwayReactionRange)) {
      markGreteSawGregor();
      setGreteReactionPose();
    }
    if (!hasClerkLeaving() && !hasClerkLeft() && !hasClerkSeenGregor() &&
      interactions.inRange(() => clerk.position, hallwayReactionRange)) {
      markClerkSawGregor();
      setClerkReactionPose();
    }
  };
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
    reactToGregor();
    beginRetreat();
    const isActive = active();
    const available = isActive ? undefined : interactions.available();
    const dialogue = isActive ? narration.dialogue : undefined;
    const character = dialogue?.character;
    const model = typeof character === "string" ?
      RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, available: !!available, busy,
      prompt: available?.prompt ?? "Explora el pasillo · E",
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
