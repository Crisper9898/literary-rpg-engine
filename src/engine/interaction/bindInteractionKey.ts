/** Routes one focused game-surface key to the scene's current world action. */
export function bindInteractionKey(surface: HTMLElement, invoke: () => void | Promise<unknown>, code = "KeyE") {
  const listeners = new AbortController();
  surface.addEventListener("keydown", (event) => {
    if (event.target !== surface || document.activeElement !== surface || event.code !== code || event.repeat ||
      event.ctrlKey || event.altKey || event.metaKey) return;
    event.preventDefault();
    void invoke();
  }, { signal: listeners.signal });
  return () => listeners.abort();
}
