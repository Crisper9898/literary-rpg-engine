import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import type { Container, Ticker } from "pixi.js";
import { SpatialInteractions, type SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { bindInteractionKey } from "../../engine/interaction/bindInteractionKey";
import { createJourneyConversationView } from "../../ui/journeyConversationView";
import { woodStop } from "../../story/heart-of-darkness/woodStop";
import { approachDecision, woodLoaded } from "../state/woodStopState";
import { woodStopAfter, woodStopBook, woodStopDecision, woodStopWarning, woodStopWood } from "../labels/woodStop.label";

export function attachWoodStopInteractions(owner: Container, actor: Container, ticker: Ticker,
  surface: HTMLCanvasElement, board: () => Promise<unknown>) {
  let busy = false, disposed = false, error = "";
  const listeners = new AbortController();
  const active = () => narration.labels.opened.some(({ label }) => label.startsWith("journey-stop-"));
  const run = async (action: () => Promise<unknown>) => {
    if (busy || disposed) return;
    busy = true; error = "";
    try { await action(); } catch (cause) { error = "No se pudo continuar. Inténtalo de nuevo."; console.error(cause); }
    finally { busy = false; if (!disposed) render(); }
  };
  const inspect = (id: "wood" | "book" | "warning", prompt: string, label: typeof woodStopWood): SpatialAction => ({
    id, prompt, target: () => woodStop.anchors[id], range: id === "warning" ? 90 : 125,
    execute: () => run(() => narration.call(label, {})),
  });
  const actions: SpatialAction[] = [
    inspect("wood", "E · Cargar la leña preparada", woodStopWood),
    inspect("warning", "E · Leer la advertencia", woodStopWarning),
    inspect("book", "E · Examinar el libro de navegación", woodStopBook),
    { id: "sailor", prompt: approachDecision() ? "E · Confirmar el rumbo con el marinero" : "E · Decidir cómo continuar",
      target: () => ({ x: 1460, y: 780 }), range: 100, enabled: woodLoaded,
      execute: () => run(() => narration.call(approachDecision() ? woodStopAfter : woodStopDecision, {})) },
    { id: "board", prompt: "E · Volver al vapor", target: () => ({ x: 1610, y: 850 }),
      range: 95, enabled: () => !!approachDecision() && woodLoaded(), execute: () => run(board) },
  ];
  const interactions = new SpatialInteractions(() => actor.position, actions);
  const interact = () => {
    if (active()) {
      if (!narration.choices.list?.length && narration.canContinue) void run(() => narration.continue({}));
    } else if (!busy && !disposed) void interactions.available()?.execute();
  };
  const choose = (index: number) => {
    const choice = narration.choices.list?.[index];
    if (active() && choice) void run(() => narration.choices.select(choice, {}));
  };
  const view = createJourneyConversationView(surface.parentElement!, surface,
    { interact, advance: interact, choose }, { chapter: "II / LA CABAÑA", ariaLabel: "Exploración de la cabaña" });
  const render = () => {
    const isActive = active(), available = isActive ? undefined : interactions.available();
    owner.getChildByLabel("wood-stop-title")!.visible = !isActive;
    const line = isActive ? narration.dialogue : undefined;
    const character = line?.character;
    const model = typeof character === "string" ? RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    view.render({ active: isActive, inRange: isActive || !!available, busy, error, beat: "voyage",
      prompt: available?.id === "sailor" ? (approachDecision() ? "E · Confirmar el rumbo con el marinero" : "E · Decidir cómo continuar") :
        available?.prompt ?? (woodLoaded() ? "Explora la cabaña o vuelve al marinero · E" : "Busca la leña preparada junto a la cabaña · E"),
      speaker: model instanceof CharacterBaseModel ? model.name ?? "" : "Marlow",
      text: isActive ? [line?.text ?? ""].flat().join(" ") : "",
      choices: isActive ? (narration.choices.list ?? []).map(item => [item.text].flat().join(" ")) : [] });
  };
  const unbind = bindInteractionKey(surface, interact);
  surface.addEventListener("keydown", event => {
    if (event.target !== surface || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (active() && ["Digit1", "Digit2"].includes(event.code)) {
      event.preventDefault(); choose(event.code === "Digit1" ? 0 : 1);
    }
  }, { signal: listeners.signal });
  ticker.add(render, undefined, -2); render();
  owner.once("destroyed", () => { disposed = true; ticker.remove(render); unbind(); listeners.abort(); view.dispose(); });
}
