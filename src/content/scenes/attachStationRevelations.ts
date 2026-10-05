import { narration } from "@drincs/pixi-vn";
import { Container, Graphics, type Ticker } from "pixi.js";
import type { CameraDirector } from "../../engine/camera/CameraDirector";
import type { SpatialAudioController } from "../../engine/audio/SpatialAudioController";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { stationEvidence } from "../../story/heart-of-darkness/stationRevelations";
import { revelationsAvailable, discoveries, revelationsPressure, revelationAtmosphere, type Discovery } from "../state/stationRevelationsState";
import { stationFlag } from "../state/innerStationState";

/** A story-owned composition; the scene retains its single input/ticker/audio lifecycle. */
export function attachStationRevelations(owner: Container, options: { actors: Container; environment: Container;
  actor: Container; ticker: Ticker; camera: CameraDirector; audio: SpatialAudioController }) {
  const props = Object.fromEntries(Object.entries(stationEvidence).map(([id, item]) => {
    const group = new Container({ label: `revelation-${id}`, ...item.position });
    group.addChild(new Graphics().ellipse(0, 3, item.art.width * .38, 10).fill({ color: 0x071416, alpha: .44 }));
    const art = createVisualAssetSlot({ label: `revelation-${id}-art`, source: item.art, fallback: () => new Container() });
    group.addChild(art.container); options.actors.addChild(group);
    group.visible = revelationsAvailable(); art.setState("idle"); art.container.tint = 0xb3c4be;
    return [id, { group, art }];
  })) as Record<Discovery, { group: Container; art: ReturnType<typeof createVisualAssetSlot> }>;
  const shade = new Graphics({ label: "station-revelation-shade" }).rect(0, 0, 1920, 1080).fill(0x0a1725);
  shade.alpha = 0; options.environment.addChild(shade);
  const atmosphere = attachAtmosphere(owner, options.ticker, { progress: () => revelationsAvailable() ? revelationsPressure() : 0,
    checkpoint: revelationAtmosphere, keyframes: [{ progress: 0, values: { shade: 0 } }, { progress: 1, values: { shade: .15 } }],
    apply: values => { shade.alpha = values.shade; } });
  const update = (talking: boolean) => {
    if (!revelationsAvailable()) return;
    for (const item of Object.values(props)) item.group.visible = true;
    props.palisade.art.setState(discoveries().includes("palisade") ? "revealed" : "idle");
    const opened: string[] = narration.labels.opened.map(item => item.label);
    const examining = opened.includes("journey-station-revelation-palisade");
    const reading = opened.includes("journey-station-revelation-report");
    const p = revelationAtmosphere.read() ?? 0;
    // Overrides only after the prior milestone has completed. Existing transport performs fades.
    options.audio.setLayerVolume("distant-water", .013 * (1 - p * .6));
    options.audio.setLayerVolume("forest", examining ? 0 : .019 * (1 - p * .75));
    options.audio.setLayerVolume("after-voice", examining ? 0 : .035 * (1 - p * .7));
    options.camera.setZoom(examining ? 1.13 : reading ? 1.12 : talking ? 1.1 : 1);
    options.camera.focus(examining ? { x: 865, y: 535 } : reading ? { x: 1110, y: 570 } :
      talking ? { x: Math.max(865, Math.min(1110, options.actor.x)), y: 560 } : { x: 960, y: 540 });
    // Opening/recognition are canonical flags; replay/restore never reveals the heads early.
    props.palisade.art.container.tint = stationFlag("palisadeExamining") ? 0xc1cecb : 0x81938e;
  };
  return { props, atmosphere, update };
}
