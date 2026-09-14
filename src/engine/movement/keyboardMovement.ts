import type { Point } from "./MovementController";

const movementKeys = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]);

/** Keyboard ownership is limited to the focused game surface, never dialogue inputs. */
export function keyboardMovement(surface: HTMLElement) {
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
      return {
        x: Number(held.has("KeyD") || held.has("ArrowRight")) - Number(held.has("KeyA") || held.has("ArrowLeft")),
        y: Number(held.has("KeyS") || held.has("ArrowDown")) - Number(held.has("KeyW") || held.has("ArrowUp")),
      };
    },
    dispose(): void { clear(); listeners.abort(); },
  };
}
