import { Container } from "pixi.js";
import { afterEach, expect, it, vi } from "vitest";
import { attachDisplayResolution, displayResolution } from "../src/ui/attachDisplayResolution";

afterEach(() => vi.unstubAllGlobals());

it("renders at visible device pixels without changing world dimensions or supersampling the source", () => {
  expect(displayResolution(1920, 1080, 800, 450, 1)).toBeCloseTo(800 / 1920);
  expect(displayResolution(1920, 1080, 800, 450, 2)).toBeCloseTo(1600 / 1920);
  expect(displayResolution(1920, 1080, 3840, 2160, 2)).toBe(1);
  expect(displayResolution(1920, 1080, 0, 0, 1)).toBeNull();
});

it("preserves PixiVN CSS, follows resize and restores the renderer on scene disposal", () => {
  let callback!: () => void;
  const disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class { constructor(next: () => void) { callback = next; }
    observe() {} disconnect = disconnect; });
  vi.stubGlobal("MutationObserver", class { observe() {} disconnect() {} });
  let width = 800;
  const surface = { parentElement: {}, style: { width: "800px", height: "450px" },
    getBoundingClientRect: () => ({ width, height: width * 9 / 16 }) };
  const renderer = { screen: { width: 1920, height: 1080 }, resolution: 1,
    resize: vi.fn((w: number, h: number, resolution: number) => {
      renderer.resolution = resolution; surface.style.width = `${w}px`; surface.style.height = `${h}px`;
      // Model Pixi's physical-pixel rounding; it must not accumulate on resize.
      renderer.screen.height = h + .2;
    }) };
  const owner = new Container();
  attachDisplayResolution(owner, renderer, surface as unknown as HTMLCanvasElement);
  expect(renderer.resolution).toBeCloseTo(800 / 1920);
  expect(surface.style).toEqual({ width: "800px", height: "450px" });
  width = 1366; callback();
  expect(renderer.resolution).toBeCloseTo(1366 / 1920);
  expect(renderer.resize).toHaveBeenLastCalledWith(1920, 1080, 1366 / 1920);
  owner.destroy();
  expect(renderer.resolution).toBe(1);
  expect(disconnect).toHaveBeenCalledOnce();
});
