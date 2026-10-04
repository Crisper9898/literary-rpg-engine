import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import type { Container, Ticker } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { createJourneyConversationView } from "../../ui/journeyConversationView";
import "../../ui/innerStation.css";

/** Content binding only: all labels/choices remain canonical Pixi'VN objects. */
export function attachStationInteractions(owner: Container, actor: Container, ticker: Ticker,
  surface: HTMLCanvasElement, actions: readonly SpatialAction[], chapter: string, idlePrompt: () => string) {
  const interactions = new SpatialInteractions(() => actor.position, actions);
  let busy = false, disposed = false, error = "";
  const listeners = new AbortController();
  const active = () => narration.labels.opened.some(({ label }) => label.startsWith("journey-station-"));
  const run = async (action: () => unknown) => {
    if (busy || disposed) return;
    busy = true; error = "";
    try { await action(); } catch (cause) { error = "No se pudo continuar. E para reintentar."; console.error(cause); }
    finally { busy = false; if (!disposed) render(); }
  };
  const interact = () => {
    if (active()) {
      if (!narration.choices.list?.length && narration.canContinue) void run(() => narration.continue({}));
    } else if (!busy && !disposed) { const action = interactions.available(); if (action) void run(action.execute); }
  };
  const choose = (index: number) => {
    const choice = narration.choices.list?.[index]; if (active() && choice) void run(() => narration.choices.select(choice, {}));
  };
  const view = createJourneyConversationView(surface.parentElement!, surface, { interact, advance: interact, choose },
    { chapter, ariaLabel: "Estación Interior: explorar y conversar" });
  const nodes = surface.parentElement!.querySelectorAll(".journey-conversation");
  nodes[nodes.length - 1].classList.add("station-conversation");
  const render = () => {
    const isActive = active(), available = isActive ? undefined : interactions.available();
    const line = isActive ? narration.dialogue : undefined, character = line?.character;
    const model = typeof character === "string" ? RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, inRange: isActive || !!available, busy, error, beat: "river",
      prompt: available?.prompt ?? idlePrompt(), speaker: model instanceof CharacterBaseModel ? model.name ?? "" : "Marlow",
      text: isActive ? [line?.text ?? ""].flat().join(" ") : "",
      choices: isActive ? (narration.choices.list ?? []).map(item => [item.text].flat().join(" ")) : [] });
  };
  const unbind = bindInteractionKey(surface, interact);
  surface.addEventListener("keydown", event => {
    if (event.target !== surface || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (active() && ["Digit1", "Digit2"].includes(event.code)) { event.preventDefault(); choose(event.code === "Digit1" ? 0 : 1); }
  }, { signal: listeners.signal });
  ticker.add(render, undefined, -6); render();
  owner.once("destroyed", () => { disposed = true; ticker.remove(render); unbind(); listeners.abort(); view.dispose(); });
  return { active, call: (label: Parameters<typeof narration.call>[0]) => run(() => narration.call(label, {})) };
}
