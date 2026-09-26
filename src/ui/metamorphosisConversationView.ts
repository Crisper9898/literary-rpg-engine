import "./metamorphosisConversation.css";

export function createMetamorphosisConversationView(root: HTMLElement, surface: HTMLCanvasElement,
  actions: { interact(): void; advance(): void }) {
  const listeners = new AbortController();
  const hud = document.createElement("aside");
  hud.className = "metamorphosis-conversation";
  hud.setAttribute("aria-label", "Interacciones de la habitación");
  const prompt = document.createElement("button");
  prompt.type = "button";
  prompt.dataset.testid = "metamorphosis-prompt";
  const panel = document.createElement("section");
  panel.dataset.testid = "metamorphosis-dialogue";
  const speaker = document.createElement("h2");
  const text = document.createElement("p");
  text.dataset.testid = "metamorphosis-line";
  text.setAttribute("aria-live", "polite");
  const advance = document.createElement("button");
  advance.type = "button";
  advance.textContent = "Continuar · E";
  panel.append(speaker, text, advance);
  hud.append(prompt, panel);
  root.append(hud);
  const bind = (button: HTMLButtonElement, action: () => void) => {
    button.addEventListener("pointerdown", (event) => event.preventDefault(), { signal: listeners.signal });
    button.addEventListener("click", () => { action(); surface.focus({ preventScroll: true }); },
      { signal: listeners.signal });
  };
  bind(prompt, actions.interact);
  bind(advance, actions.advance);
  return {
    render(state: { active: boolean; prompt: string; available: boolean; speaker: string;
      text: string; busy: boolean }) {
      prompt.hidden = state.active;
      prompt.textContent = state.prompt;
      prompt.disabled = !state.available || state.busy;
      panel.hidden = !state.active;
      speaker.textContent = state.speaker;
      text.textContent = state.text;
      advance.disabled = state.busy;
    },
    dispose() { listeners.abort(); hud.remove(); },
  };
}
