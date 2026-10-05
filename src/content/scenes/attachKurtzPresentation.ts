import { Graphics, Sprite, type Container } from "pixi.js";
import type { CameraDirector } from "../../engine/camera/CameraDirector";
import type { SpatialAudioController } from "../../engine/audio/SpatialAudioController";
import { createKurtzPresentation } from "../../story/heart-of-darkness/createKurtzPresentation";
import { kurtzIntroduction, updateKurtzIntroduction, kurtzStage, kurtzPosition, kurtzPose } from "../state/kurtzIntroductionState";
import { setRussianMood } from "../state/innerStationState";
import { kurtzAmbientGain } from "../../story/heart-of-darkness/kurtzAudio";
import type { Texture } from "pixi.js";

/** Story composition only: the existing scene owns input, ticker, camera and sound. */
export function attachKurtzPresentation(options: { actors: Container; environment: Container; foreground: Container;
  texture: Texture; camera: CameraDirector; audio: SpatialAudioController; russian: Container }) {
  const { group, art, bearers } = createKurtzPresentation(options.actors);
  art.setState("weak");
  const shadow = new Graphics({ label: "kurtz-environment-shade" }).rect(0, 0, 1920, 1080).fill(0x071216);
  shadow.alpha = 0; options.environment.addChild(shadow);
  const mist = new Sprite({ label: "kurtz-local-mist", texture: options.texture, x: 1350, y: 510, tint: 0x97aca3 });
  mist.width = 630; mist.height = 290; mist.alpha = 0; options.foreground.addChild(mist);
  let lastStage = "";
  const update = (elapsedMS: number, talking: boolean) => {
    if (!document.hidden) updateKurtzIntroduction(elapsedMS);
    const { activated, elapsedMS: t } = kurtzIntroduction(), stage = kurtzStage();
    const progress = activated ? Math.min(1, t / 32000) : 0;
    shadow.alpha = progress * .17;
    mist.alpha = !activated ? 0 : stage === "anticipation" ? .22 * progress : stage === "silhouette" ? .4 : stage === "partial" ? .23 : .1;
    mist.x = 1350 - Math.min(t, 44000) / 300;
    group.visible = t >= 32000; group.position.copyFrom(kurtzPosition());
    group.alpha = stage === "silhouette" ? .65 : 1;
    group.tint = stage === "silhouette" ? 0x182729 : stage === "partial" ? 0x61786f : 0xffffff;
    art.setState(kurtzPose());
    const moving = stage === "silhouette" || stage === "partial";
    // The raised hand arrests both bearers together. No healthy walking Kurtz.
    bearers.forEach((body, index) => { body.y = (index ? 4 : -10) + (moving ? Math.sin(t / 430 + index * Math.PI) * 2 : 0); });
    art.container.y = -65 + (moving ? Math.sin(t / 430) * 1.3 : 0);
    if (activated) {
      const gain = kurtzAmbientGain();
      options.audio.setLayerVolume("distant-water", .08 * gain);
      options.audio.setLayerVolume("forest", .12 * gain);
      options.audio.setLayerVolume("wood", .18 * gain);
      options.camera.setZoom(stage === "anticipation" ? 1.05 : stage === "present" ? talking ? 1.18 : 1 : 1.2);
      options.camera.focus(stage === "present" && !talking ? { x: 960, y: 540 } : { x: 1100, y: 560 });
      options.russian.rotation = stage === "authority" ? -.025 : 0;
      options.russian.position.set(1200 - progress * 180, 780 - progress * 35);
      // Reconstructing a scene must not overwrite a mood saved in active dialogue.
      if (stage !== lastStage && stage !== "present") setRussianMood(stage === "authority" ? "fervent" : "nervous");
    }
    lastStage = stage;
  };
  return { update, group, art };
}
