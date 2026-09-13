import { Container } from "pixi.js";

/** Composition only; Pixi'VN owns mounting and canvas lifecycle. */
export function createWorldLayers() {
  const root = new Container({ label: "world" });
  const environment = new Container({ label: "environment" });
  const ground = new Container({ label: "ground" });
  const actors = new Container({ label: "actors" });
  const foreground = new Container({ label: "foreground" });
  root.addChild(environment, ground, actors, foreground);
  return { root, environment, ground, actors, foreground };
}
