import "./journeyAudioDiagnostics.css";

export interface JourneyAudioDiagnosticState {
  location: string;
  x: number;
  y: number;
  layers: readonly {
    id: string;
    name: string;
    volume: number;
    target: number;
    channelVolume: number;
    playing: boolean;
  }[];
}

/** Journey-only listening aid. It never changes audio or gameplay state. */
export function createJourneyAudioDiagnosticsView(root: HTMLElement) {
  const listeners = new AbortController();
  const overlay = document.createElement("div");
  overlay.className = "journey-audio-overlay";
  const panel = document.createElement("aside");
  panel.className = "journey-audio-diagnostics";
  panel.dataset.testid = "journey-audio-diagnostics";
  panel.setAttribute("aria-label", "Diagnóstico de audio de la travesía");
  panel.hidden = true;
  const heading = document.createElement("h2");
  heading.textContent = "Audio de la travesía · P para ocultar";
  const position = document.createElement("p");
  position.className = "journey-audio-position";
  const route = document.createElement("p");
  route.className = "journey-audio-route";
  route.textContent = "Ruta: río x≈850 → orilla x≈420 → motor x≈1280";
  const list = document.createElement("div");
  list.className = "journey-audio-layers";
  panel.append(heading, position, route, list);
  overlay.append(panel);
  root.append(overlay);

  const rows = new Map<string, { element: HTMLElement; meter: HTMLMeterElement;
    level: HTMLOutputElement; detail: HTMLElement }>();
  window.addEventListener("keydown", (event) => {
    if (event.code !== "KeyP" || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
    event.preventDefault();
    panel.hidden = !panel.hidden;
  }, { signal: listeners.signal });

  return {
    get visible() { return !panel.hidden; },
    render(state: JourneyAudioDiagnosticState) {
      if (panel.hidden) return;
      const place = `Marlow · ${state.location} · x ${Math.round(state.x)}, y ${Math.round(state.y)}`;
      if (position.textContent !== place) position.textContent = place;
      for (const layer of state.layers) {
        let row = rows.get(layer.id);
        if (!row) {
          const element = document.createElement("div");
          element.className = "journey-audio-layer";
          element.dataset.testid = `audio-layer-${layer.id}`;
          const name = document.createElement("strong");
          name.textContent = layer.name;
          const meter = document.createElement("meter");
          meter.min = 0;
          meter.max = 1;
          const level = document.createElement("output");
          const detail = document.createElement("small");
          element.append(name, meter, level, detail);
          list.append(element);
          row = { element, meter, level, detail };
          rows.set(layer.id, row);
        }
        const volume = layer.volume.toFixed(3);
        row.element.dataset.volume = volume;
        row.meter.value = layer.volume;
        if (row.level.textContent !== volume) row.level.textContent = volume;
        const status = layer.playing ? "suena" : layer.volume > 0 ? "esperando audio" : "apagada";
        const detail = `${status} · canal ${layer.channelVolume.toFixed(3)} · destino ${layer.target.toFixed(3)}`;
        if (row.detail.textContent !== detail) row.detail.textContent = detail;
      }
    },
    dispose() { listeners.abort(); overlay.remove(); },
  };
}
