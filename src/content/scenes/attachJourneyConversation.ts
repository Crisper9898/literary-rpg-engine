import { CharacterBaseModel, narration, RegisteredCharacters } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import type { NpcRoutineController } from "../../engine/npc/NpcRoutineController";
import { deckConversation } from "../../story/heart-of-darkness/conversation";
import { createJourneyConversationView } from "../../ui/journeyConversationView";
import { journeyConversation } from "../labels/journeyConversation.label";

/** Spatial/input adapter only: no copied dialogue cursor, choices, history or flags. */
export function attachJourneyConversation(presentation: Container, player: Container,
  npc: NpcRoutineController, ticker: Ticker, surface: HTMLCanvasElement) {
  const root = surface.parentElement!;
  const listeners = new AbortController();
  let disposed = false;
  let busy = false;
  let error = "";
  const active = () => narration.labels.opened.some(({ label }) => label === journeyConversation.id);
  const inRange = () => {
    const point = npc.state.position;
    return Math.hypot(player.x - point.x, player.y - point.y) <=
      (active() ? deckConversation.hearingDistance : deckConversation.startDistance);
  };
  const run = async (action: () => Promise<unknown>) => {
    if (busy || disposed || !inRange()) return;
    busy = true;
    error = "";
    try { await action(); }
    catch (cause) { error = "No se pudo continuar. Inténtalo de nuevo."; console.error(cause); }
    finally { busy = false; if (!disposed) render(); }
  };
  const advance = () => {
    if (!active() || !narration.canContinue) return;
    void run(() => narration.continue({}));
  };
  const interact = () => {
    if (active()) { advance(); return; }
    if (!inRange() || disposed || busy) return;
    // Acknowledge Marlow without pausing the work route or stealing camera follow.
    if (npc.state.mode === "idle") npc.face(player.position);
    void run(() => narration.call(journeyConversation, {}));
  };
  const choose = (index: number) => {
    const item = narration.choices.list?.[index];
    if (!active() || !item) return;
    void run(() => narration.choices.select(item, {}));
  };
  const view = createJourneyConversationView(root, surface, { interact, advance, choose });
  const render = () => {
    const isActive = active();
    const dialogue = isActive ? narration.dialogue : undefined;
    const character = dialogue?.character;
    const model = typeof character === "string" ? RegisteredCharacters.get<CharacterBaseModel, string>(character) : character;
    const speaker = model instanceof CharacterBaseModel ? model.name : "";
    view.render({ active: isActive, inRange: inRange(), busy, error,
      prompt: inRange() ? "E · Hablar con el marinero" : "Acércate al marinero · E para hablar",
      speaker: speaker ?? "", text: [dialogue?.text ?? ""].flat().join(" "),
      choices: isActive ? (narration.choices.list ?? []).map((choice) => [choice.text].flat().join(" ")) : [],
    });
  };
  surface.addEventListener("keydown", (event) => {
    if (event.target !== surface || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.code === "KeyE") { event.preventDefault(); interact(); }
    if (active() && (event.code === "Digit1" || event.code === "Digit2")) {
      event.preventDefault(); choose(event.code === "Digit1" ? 0 : 1);
    }
  }, { signal: listeners.signal });
  // Read the live Pixi'VN state after movement; also reflects the public testing bridge.
  ticker.add(render, undefined, UPDATE_PRIORITY.NORMAL - 2);
  render();
  presentation.once("destroyed", () => {
    disposed = true;
    ticker.remove(render);
    listeners.abort();
    view.dispose();
  });
}
