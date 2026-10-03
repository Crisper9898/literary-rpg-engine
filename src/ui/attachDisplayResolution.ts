import type { Container } from "pixi.js";

interface DisplayRenderer {
  screen: { width: number; height: number };
  resolution: number;
  resize(width: number, height: number, resolution: number): void;
}

/** Match visible device pixels, preserving the existing logical scene and CSS. */
export function displayResolution(width: number, height: number, displayWidth: number,
  displayHeight: number, deviceRatio: number): number | null {
  if (displayWidth <= 0 || displayHeight <= 0) return null;
  return Math.min(1, Math.min(displayWidth / width, displayHeight / height) * deviceRatio);
}

/** Presentation adapter; Pixi'VN still owns the canvas, resizing and lifecycle. */
export function attachDisplayResolution(owner: Container, renderer: DisplayRenderer,
  surface: HTMLCanvasElement): void {
  const original = renderer.resolution;
  const { width: logicalWidth, height: logicalHeight } = renderer.screen;
  const resize = (resolution: number) => {
    const width = surface.style.width, height = surface.style.height;
    // Pixi rounds physical pixels, so renderer.screen may have a fractional
    // remainder. Never feed that remainder back into subsequent resizes.
    renderer.resize(logicalWidth, logicalHeight, resolution);
    surface.style.width = width; surface.style.height = height;
  };
  const update = () => {
    const bounds = surface.getBoundingClientRect();
    const next = displayResolution(logicalWidth, logicalHeight,
      bounds.width, bounds.height, globalThis.devicePixelRatio || 1);
    if (next !== null && Math.abs(next - renderer.resolution) > .0001) resize(next);
  };
  const size = new ResizeObserver(update);
  size.observe(surface.parentElement ?? surface);
  const style = new MutationObserver(update);
  style.observe(surface, { attributes: true, attributeFilter: ["style"] });
  update();
  owner.once("destroyed", () => { size.disconnect(); style.disconnect(); resize(original); });
}
