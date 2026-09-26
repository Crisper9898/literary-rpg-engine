import type { Point } from "./MovementController";

export interface MovementBindings {
  readonly up: readonly string[];
  readonly down: readonly string[];
  readonly left: readonly string[];
  readonly right: readonly string[];
}

const defaultBindings: MovementBindings = {
  up: ["KeyW", "ArrowUp"], down: ["KeyS", "ArrowDown"],
  left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"],
};

/** Keyboard ownership is limited to the focused game surface, never dialogue inputs. */
export function keyboardMovement(surface: HTMLElement, bindings: MovementBindings = defaultBindings) {
  const movementKeys = new Set(Object.values(bindings).flat());
  const held = new Set<string>();
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const clear = () => held.clear();

  surface.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) { clear(); return; }
    if (event.target !== surface || !movementKeys.has(event.code)) return;
    event.preventDefault();
    held.add(event.code);
  }, options);
  window.addEventListener("keyup", (event) => held.delete(event.code), options);
  surface.addEventListener("blur", clear, options);
  window.addEventListener("blur", clear, options);
  document.addEventListener("visibilitychange", clear, options);
  surface.addEventListener("pointerdown", () => surface.focus({ preventScroll: true }), options);

  return {
    read(): Point {
      if (document.hidden || document.activeElement !== surface) clear();
      const pressed = (keys: readonly string[]) => keys.some((key) => held.has(key));
      return {
        x: Number(pressed(bindings.right)) - Number(pressed(bindings.left)),
        y: Number(pressed(bindings.down)) - Number(pressed(bindings.up)),
      };
    },
    dispose(): void { clear(); listeners.abort(); },
  };
}
