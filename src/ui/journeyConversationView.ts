import "./journeyConversation.css";

export interface ConversationViewState {
  prompt: string;
  speaker: string;
  text: string;
  choices: readonly string[];
  active: boolean;
  inRange: boolean;
  busy: boolean;
  error?: string;
}

/** Presentation only. Canonical dialogue and choices stay in Pixi'VN. */
export function createJourneyConversationView(root: HTMLElement, surface: HTMLCanvasElement, actions: {
  interact(): void; advance(): void; choose(index: number): void;
}) {
  const listeners = new AbortController();
  let controlListeners = new AbortController();
  const hud = document.createElement("aside");
  hud.className = "journey-conversation";
  hud.setAttribute("aria-label", "Conversación en la cubierta");
  const prompt = document.createElement("button");
  prompt.dataset.testid = "talk-prompt";
  prompt.className = "journey-talk-prompt";
  const panel = document.createElement("section");
  panel.className = "journey-dialogue-panel";
  panel.dataset.testid = "dialogue-panel";
  const speaker = document.createElement("h2");
  speaker.dataset.testid = "dialogue-speaker";
  const text = document.createElement("p");
  text.dataset.testid = "dialogue-text";
  text.className = "journey-dialogue-text";
  text.setAttribute("aria-live", "polite");
  const controls = document.createElement("div");
  controls.className = "journey-dialogue-controls";
  const status = document.createElement("p");
  status.className = "journey-dialogue-status";
  status.setAttribute("role", "status");
  panel.append(speaker, text, controls, status);
  hud.append(prompt, panel);
  root.append(hud);

  const bind = (button: HTMLButtonElement, action: () => void, signal = listeners.signal) => {
    button.type = "button";
    // Mouse clicks must not release a held movement key. Tab/Enter still work.
    button.addEventListener("pointerdown", (event) => event.preventDefault(), { signal });
    button.addEventListener("click", () => { action(); surface.focus({ preventScroll: true }); }, { signal });
  };
  bind(prompt, actions.interact);
  let lastChoices = "";
  let buttons: HTMLButtonElement[] = [];
  return {
    render(state: ConversationViewState) {
      prompt.hidden = state.active;
      const promptText = state.error ? `${state.error} · E para reintentar` : state.prompt;
      if (prompt.textContent !== promptText) prompt.textContent = promptText;
      prompt.disabled = !state.inRange || state.busy;
      panel.hidden = !state.active;
      if (speaker.textContent !== state.speaker) speaker.textContent = state.speaker;
      if (text.textContent !== state.text) text.textContent = state.text;
      const key = JSON.stringify(state.choices);
      if (key !== lastChoices) {
        lastChoices = key;
        controlListeners.abort();
        controlListeners = new AbortController();
        controls.replaceChildren();
        const labels = state.choices.length ? state.choices : ["Continuar · E"];
        buttons = labels.map((label, index) => {
          const button = document.createElement("button");
          button.dataset.testid = state.choices.length ? "dialogue-choice" : "dialogue-continue";
          button.textContent = state.choices.length ? `${index + 1} · ${label}` : label;
          bind(button, state.choices.length ? () => actions.choose(index) : actions.advance, controlListeners.signal);
          controls.append(button);
          return button;
        });
      }
      for (const button of buttons) button.disabled = !state.inRange || state.busy;
      const hint = state.error || (!state.inRange ? "Acércate al marinero para continuar." :
        state.choices.length ? "Elige con 1 / 2 o haz clic. Puedes seguir caminando." : "Puedes seguir caminando · WASD / flechas");
      if (status.textContent !== hint) status.textContent = hint;
    },
    dispose() { listeners.abort(); controlListeners.abort(); hud.remove(); },
  };
}
