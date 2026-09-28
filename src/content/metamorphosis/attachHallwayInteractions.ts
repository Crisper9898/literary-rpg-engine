import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { metamorphosisHallway as hall, hallwayInteractionRange, hallwayReactionRange,
  hallwayReactionStep, hallwayNpcRange, fatherArrivalRange, fatherArrival,
  clerkDeparture, greteRetreat,
  greteRetreatTarget } from "../../story/metamorphosis/hallway";
import { metamorphosisText as copy } from "../../story/metamorphosis/text";
import { createMetamorphosisConversationView } from "../../ui/metamorphosisConversationView";
import { metamorphosisHallwayClerk, metamorphosisHallwayGrete,
  metamorphosisHallwayGreteAfter, metamorphosisHallwayFather,
  metamorphosisHallwayFatherAfter,
  metamorphosisHallwayPicture } from "../labels/metamorphosis.label";
import { familyResponse, greteResponse, hasClerkLeft, hasClerkLeaving, hasClerkSeenGregor,
  hasFatherArrived, hasFatherSpoken, hasGreteLeft, hasGreteReacted, hasGreteSeenGregor,
  markClerkLeft, markClerkSawGregor, markFatherArrived, markGreteLeft,
  markGreteSawGregor } from "./state";

export function attachHallwayInteractions(presentation: Container, actor: Container,
  ticker: Ticker, surface: HTMLCanvasElement, returnToRoom: () => void) {
  let busy = false;
  let disposed = false;
  const grete = presentation.getChildByLabel("hallway-grete", true);
  const clerk = presentation.getChildByLabel("hallway-clerk", true);
  const father = presentation.getChildByLabel("hallway-father", true);
  if (!grete || !clerk || !father) throw new Error("The hallway needs its authored NPC actors.");
  const setGreteReactionPose = () => {
    grete.x = hall.anchors.grete.x + (hasGreteSeenGregor() ? hallwayReactionStep : 0);
  };
  const setClerkReactionPose = () => {
    clerk.x = hall.anchors.clerk.x + (hasClerkSeenGregor() ? hallwayReactionStep : 0);
  };
  setGreteReactionPose();
  setClerkReactionPose();
  const removeGrete = () => {
    if (!grete.parent) return;
    grete.parent.removeChild(grete);
    grete.destroy({ children: true });
  };
  const removeClerk = () => {
    if (!clerk.parent) return;
    clerk.parent.removeChild(clerk);
    clerk.destroy({ children: true });
  };
  // Renderer positions are transient. An in-flight save settles on restore.
  const greteSettledOnRestore = hasGreteReacted();
  const greteLeaves = greteResponse() === "leave";
  const familyAnswered = familyResponse() === "answered";
  if (hasGreteReacted() && greteLeaves && !hasGreteLeft()) markGreteLeft();
  if (hasGreteLeft()) removeGrete();
  else if (hasGreteReacted()) {
    const target = greteRetreatTarget(false, familyAnswered);
    grete.position.set(target.x, target.y);
  }
  if (hasClerkLeaving() && !hasClerkLeft()) markClerkLeft();
  if (hasClerkLeft()) removeClerk();
  let fatherReady = hasFatherArrived();
  const faceFatherTowardGregor = () => {
    // Flip only the silhouette, so the name beneath him stays readable.
    father.getChildAt(0).scale.x = actor.x < father.x ? -1 : 1;
  };
  if (fatherReady) {
    father.visible = true;
    father.position.set(hall.anchors.fatherStop.x, hall.anchors.fatherStop.y);
    faceFatherTowardGregor();
  }
  let fatherEntryStarted = false;
  const beginFatherEntry = () => {
    if (fatherEntryStarted || fatherReady || !hasFatherArrived()) return;
    fatherEntryStarted = true;
    father.visible = true;
    attachNpcRoutine(father, ticker, fatherArrival(), (state) => {
      faceFatherTowardGregor();
      if (state.mode === "idle") fatherReady = true;
    });
  };
  let greteRetreatStarted = false;
  let greteReady = greteSettledOnRestore && !hasGreteLeft();
  const beginGreteRetreat = () => {
    if (greteRetreatStarted || greteSettledOnRestore || !hasGreteReacted() || hasGreteLeft()) return;
    greteRetreatStarted = true;
    attachNpcRoutine(grete, ticker,
      greteRetreat({ x: grete.x, y: grete.y }, greteLeaves, familyAnswered), (state) => {
        if (state.mode !== "idle" || (greteLeaves && state.stopIndex !== 2)) return;
        if (greteLeaves) { markGreteLeft(); removeGrete(); }
        else greteReady = true;
      });
  };
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
    metamorphosisHallwayGrete.id, metamorphosisHallwayGreteAfter.id,
    metamorphosisHallwayClerk.id, metamorphosisHallwayFather.id,
    metamorphosisHallwayFatherAfter.id]);
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
      range: hallwayNpcRange,
      enabled: () => !hasGreteLeft() && (!hasGreteReacted() || greteReady), execute: () => {
        void run(() => narration.call(hasGreteReacted() ?
          metamorphosisHallwayGreteAfter : metamorphosisHallwayGrete, {}));
      } },
    { id: "clerk", prompt: copy.hallwayClerkPrompt, target: () => clerk.position,
      range: hallwayNpcRange, enabled: () => !hasClerkLeaving() && !hasClerkLeft(), execute: () => {
        void run(() => narration.call(metamorphosisHallwayClerk, {}));
      } },
    { id: "father", prompt: copy.hallwayFatherPrompt, target: () => father.position,
      range: hallwayNpcRange, priority: 1,
      enabled: () => hasFatherArrived() && fatherReady, execute: () => {
        void run(() => narration.call(hasFatherSpoken() ?
          metamorphosisHallwayFatherAfter : metamorphosisHallwayFather, {}));
      } },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  let fatherZoneArmed = false;
  const updateFatherArrival = () => {
    if (hasFatherArrived()) return;
    const prerequisites = hasClerkLeft() && hasGreteReacted() &&
      (hasGreteLeft() || (greteResponse() !== "leave" && greteReady));
    if (!prerequisites) { fatherZoneArmed = false; return; }
    const inZone = interactions.inRange(() => hall.anchors.fatherTrigger, fatherArrivalRange);
    if (!inZone) fatherZoneArmed = true;
    else if (fatherZoneArmed && !active()) {
      markFatherArrived();
      beginFatherEntry();
    }
  };
  const reactToGregor = () => {
    if (!hasGreteReacted() && !hasGreteSeenGregor() &&
      interactions.inRange(() => grete.position, hallwayReactionRange)) {
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
    beginGreteRetreat();
    beginRetreat();
    updateFatherArrival();
    beginFatherEntry();
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
