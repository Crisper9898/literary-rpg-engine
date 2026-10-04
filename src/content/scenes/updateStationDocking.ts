import { dockingProgress, markStation } from "../state/innerStationState";
/** Saved slow manoeuvre, driven by the scene's existing ticker. */
export function updateStationDocking(elapsedMS: number) {
  const before = dockingProgress.read() ?? 0;
  const progress = Number.isFinite(elapsedMS) && elapsedMS > 0 ? Math.min(1, before + Math.min(100, elapsedMS) / 9000) : before;
  if (progress !== before || dockingProgress.read() === undefined) dockingProgress.write(progress);
  if (progress === 1) markStation("innerStationReached");
  return progress;
}
