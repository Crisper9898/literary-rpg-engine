import { narration } from "@drincs/pixi-vn";
import type { Container, Ticker } from "pixi.js";
import { approachBeats } from "../../story/heart-of-darkness/riverApproach";
import { approachCheckpoint, seenApproachBeat } from "../state/approachState";
import { approachLabels } from "../labels/riverApproach.label";
import { createJourneyConversationView } from "../../ui/journeyConversationView";
import "../../ui/riverApproach.css";

export function attachApproachNarration(owner: Container, ticker: Ticker, surface: HTMLCanvasElement,
  steer: () => void, prompt: () => string) {
  let busy = false, disposed = false;
  const active = () => narration.labels.opened.some(({ label }) => label.startsWith("journey-approach-"));
  const view = createJourneyConversationView(surface.parentElement!, surface,
    { interact: steer, advance: () => { void advance(); }, choose: () => {} },
    { chapter: "II / EL CANAL CERRADO", ariaLabel: "Navegación bajo niebla" });
  const hud = surface.parentElement!.querySelectorAll<HTMLElement>(".journey-conversation");
  hud[hud.length - 1].classList.add("approach-conversation");
  hud[hud.length - 1].querySelector(".journey-controls-hint")!.textContent =
    "E · Timón / leer · A/D dirección · W avanzar · S aminorar · Espacio sirena";
  const run = async (action: () => Promise<unknown>) => {
    if (busy || disposed) return;
    busy = true;
    try { await action(); } catch (error) { console.error("Could not advance river narration", error); }
    finally { busy = false; }
  };
  async function advance() {
    if (active() && narration.canContinue) await run(() => narration.continue({}));
  }
  const update = () => {
    if (disposed) return;
    const state = approachCheckpoint.read();
    const due = approachBeats.find(beat => (state?.progress ?? 0) >= beat.progress && !seenApproachBeat(beat.id));
    if (!active() && !busy && due) void run(() => narration.call(approachLabels[due.id], {}));
    const line = active() ? narration.dialogue : undefined;
    view.render({ active: active(), inRange: active() || state?.progress !== 1, busy, prompt: prompt(), speaker: "Marlow",
      text: [line?.text ?? ""].flat().join(" "), choices: [], beat: "river" });
  };
  ticker.add(update, undefined, -6); update();
  owner.once("destroyed", () => { disposed = true; ticker.remove(update); view.dispose(); });
  return { active, advance };
}
