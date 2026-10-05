import { Container, Graphics } from "pixi.js";
import { createInnerStation } from "./createInnerStation";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { stationEvidence } from "./stationRevelations";
import { nightBedArt, nightFollowersArt, nightForestArt, nightKurtzArt, nightRest, nightStationArt, nightTracePoints } from "./kurtzNightEscape";
import { kurtzArt } from "./kurtzIntroduction";
import { discoveries } from "../../content/state/stationRevelationsState";
import type { VisualSource } from "../../ui/visualAssetSlot";

/** New episode only. Original station/character sources and their composition are preserved. */
export function createKurtzNightEscape() {
  const scene = createInnerStation(); const { layers } = scene;
  for (const child of layers.ground.removeChildren()) child.destroy();
  const slot = (label: string, source: VisualSource, parent: Container) => {
    const art = createVisualAssetSlot({ label, source, fallback: () => new Container() }); parent.addChild(art.container); art.setState("idle"); return art;
  };
  const night = slot("night-station-art", nightStationArt, layers.environment);
  const forest = slot("night-forest-art", nightForestArt, layers.environment);
  night.container.alpha = 0; forest.container.alpha = 0;
  const prop = (label: string, position: { x: number; y: number }, source: VisualSource) => {
    const group = new Container({ label, ...position }); layers.actors.addChild(group);
    group.addChild(new Graphics().ellipse(0, 3, source.width * .33, 8).fill({ color: 0x040c13, alpha: .7 }));
    const art = slot(`${label}-art`, source, group); art.container.tint = 0xa4babd; return { group, art };
  };
  const evidence = Object.entries(stationEvidence).map(([id, item]) => {
    const node = prop(`night-evidence-${id}`, item.position, item.art);
    node.art.setState(id === "palisade" && discoveries().includes("palisade") ? "revealed" : "idle"); return node;
  });
  const bed = prop("night-empty-bed", nightRest, nightBedArt);
  const resting = prop("night-resting-kurtz", nightRest, kurtzArt); resting.art.setState("weak");
  resting.art.container.y = -18;
  const traces = Object.fromEntries(Object.entries(nightTracePoints).map(([id, item]) => [id,
    prop(`night-trace-${id}`, item.position, item.art)]));
  const kurtz = prop("night-kurtz", { x: 1100, y: 800 }, nightKurtzArt); kurtz.art.setState("collapsed");
  const followers = slot("night-followers-art", nightFollowersArt, layers.environment);
  followers.container.position.set(1410, 605); followers.container.tint = 0x687779;
  const distantLight = new Graphics({ label: "night-distant-light" }).ellipse(1400, 470, 75, 25).fill({ color: 0xd98039, alpha: .05 });
  layers.environment.addChild(distantLight);
  return { ...scene, night, forest, evidence, bed, resting, traces, kurtz, followers, distantLight };
}
