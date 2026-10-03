import { canvas } from "@drincs/pixi-vn";
import { Container } from "pixi.js";
import { sampleWeather } from "./weatherProbe";

export async function profileJourneyRendering() {
  const renderer = canvas.app.renderer;
  const surface = canvas.app.canvas as HTMLCanvasElement;
  const presentation = canvas.layers.get("journey-deck")!;
  const world = presentation.getChildByLabel("world") as Container;
  const environment = world.getChildByLabel("environment") as Container;
  const foreground = world.getChildByLabel("foreground") as Container;
  const hide = (names: string[], parent: Container) => names.map((name) => parent.getChildByLabel(name)!);
  const fog = [...hide(["parallax-weather-distantFog", "parallax-weather-riverFog"], environment),
    ...hide(["parallax-weather-deckFog"], foreground)];
  const land = hide(["parallax-distant-ridge", "parallax-far-vegetation", "parallax-near-bank"], environment);
  const results: { mode: string; fps: number; pixels: number }[] = [];
  const sample = async (mode: string, output = surface) => {
    await sampleWeather(3);
    const result = await sampleWeather(18);
    results.push({ mode, fps: Math.round(result.fps * 10) / 10, pixels: output.width * output.height });
  };
  const withHidden = async (mode: string, objects: Container[]) => {
    const original = objects.map((object) => object.visible);
    objects.forEach((object) => { object.visible = false; });
    try { await sample(mode); } finally { objects.forEach((object, index) => { object.visible = original[index]; }); }
  };
  const resolution = renderer.resolution;
  const render = renderer.render;
  const cssWidth = surface.style.width, cssHeight = surface.style.height;
  const resize = (value: number) => {
    renderer.resize(1920, 1080, value);
    surface.style.width = cssWidth; surface.style.height = cssHeight;
  };
  try {
    await sample("approved");
    await withHidden("without-fog", fog);
    // Art updates normally restore visibility; renderability is stable for profiling.
    const items = [...land, foreground.getChildByLabel("journey-fire-embers")!];
    items.forEach((item) => { item.renderable = false; });
    await sample("without-land-and-embers");
    items.forEach((item) => { item.renderable = true; });
    renderer.render = (() => {}) as typeof render;
    await sample("simulation-only");
    renderer.render = render;
    const bounds = surface.getBoundingClientRect();
    resize(Math.min(1, bounds.width / 1920));
    await sample("display-pixels");
    await withHidden("display-pixels-without-fog", fog);
    resize(resolution);
    await sample("approved-repeat");
  } finally {
    renderer.render = render;
    resize(resolution);
  }
  const gl = surface.getContext("webgl2") ?? surface.getContext("webgl");
  return { results, logical: { width: renderer.screen.width, height: renderer.screen.height },
    display: { width: surface.getBoundingClientRect().width, height: surface.getBoundingClientRect().height },
    antialias: gl?.getContextAttributes()?.antialias, samples: gl?.getParameter(gl.SAMPLES) };
}
