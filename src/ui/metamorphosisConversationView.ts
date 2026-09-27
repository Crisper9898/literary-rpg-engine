import "./metamorphosisConversation.css";

export function createMetamorphosisConversationView(root: HTMLElement, surface: HTMLCanvasElement,
  actions: { interact(): void; advance(): void; choose(index: number): void },
  ariaLabel = "Interacciones de la habitación") {
  const listeners = new AbortController();
  let choiceListeners = new AbortController();
  const hud = document.createElement("aside");
  hud.className = "metamorphosis-conversation";
  hud.setAttribute("aria-label", ariaLabel);
  const prompt = document.createElement("button");
  prompt.type = "button";
  prompt.dataset.testid = "metamorphosis-prompt";
  const panel = document.createElement("section");
  panel.dataset.testid = "metamorphosis-dialogue";
  const speaker = document.createElement("h2");
  speaker.dataset.testid = "metamorphosis-speaker";
  const text = document.createElement("p");
  text.dataset.testid = "metamorphosis-line";
  text.setAttribute("aria-live", "polite");
  const advance = document.createElement("button");
  advance.type = "button";
  advance.textContent = "Continuar · E";
  const choices = document.createElement("div");
  choices.className = "metamorphosis-choices";
  panel.append(speaker, text, advance, choices);
  hud.append(prompt, panel);
  root.append(hud);
  const bind = (button: HTMLButtonElement, action: () => void, signal = listeners.signal) => {
    button.addEventListener("pointerdown", (event) => event.preventDefault(), { signal });
    button.addEventListener("click", () => { action(); surface.focus({ preventScroll: true }); },
      { signal });
  };
  bind(prompt, actions.interact);
  bind(advance, actions.advance);
  let choiceKey = "";
  let choiceButtons: HTMLButtonElement[] = [];
  return {
    render(state: { active: boolean; prompt: string; available: boolean; speaker: string;
      text: string; busy: boolean; choices: readonly string[] }) {
      prompt.hidden = state.active;
      prompt.textContent = state.prompt;
      prompt.disabled = !state.available || state.busy;
      panel.hidden = !state.active;
      speaker.textContent = state.speaker;
      text.textContent = state.text;
      advance.hidden = state.choices.length > 0;
      advance.disabled = state.busy;
      const key = JSON.stringify(state.choices);
      if (key !== choiceKey) {
        choiceKey = key;
        choiceListeners.abort();
        choiceListeners = new AbortController();
        choices.replaceChildren();
        choiceButtons = state.choices.map((label, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.testid = "metamorphosis-choice";
          button.textContent = `${index + 1} · ${label}`;
          bind(button, () => actions.choose(index), choiceListeners.signal);
          choices.append(button);
          return button;
        });
      }
      for (const button of choiceButtons) button.disabled = state.busy;
    },
    dispose() { listeners.abort(); choiceListeners.abort(); hud.remove(); },
  };
}
