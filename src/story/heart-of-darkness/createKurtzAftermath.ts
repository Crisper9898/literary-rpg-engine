import { createKurtzBreakdown } from "./createKurtzBreakdown";

/** The absent patient is the focal change; preserve existing boat, papers and actor art. */
export function createKurtzAftermath() {
  const scene = createKurtzBreakdown();
  scene.player.label = "aftermath-player";
  for (const prop of [scene.patient, scene.engine, scene.forge]) prop.destroy({ children: true });
  scene.papers.label = "aftermath-papers"; scene.papers.position.set(820, 720);
  return scene;
}
