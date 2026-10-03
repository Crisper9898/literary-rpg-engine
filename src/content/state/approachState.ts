import { storage } from "@drincs/pixi-vn";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import { validNavigationState } from "../../puzzles/riverApproach/NavigationController";
import type { ApproachDecision } from "./woodStopState";
import type { ApproachBeat } from "../../story/heart-of-darkness/riverApproach";
import type { Point } from "../../engine/movement/MovementController";

export const approachCheckpoint = createPixiStorageCheckpoint("journey.approachNavigation", validNavigationState);
export const approachPosition = createPixiStorageCheckpoint<Point>("journey.approachPosition",
  (v): v is Point => !!v && typeof v === "object" && "x" in v && "y" in v &&
    typeof v.x === "number" && Number.isFinite(v.x) && typeof v.y === "number" && Number.isFinite(v.y));
export const approachAtmosphere = createPixiStorageCheckpoint<number>("journey.approachAtmosphere",
  (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1);
export const seenApproachBeat = (id: ApproachBeat) => (storage.get<string[]>("journey.approachSeen") ?? []).includes(id);
export function markApproachBeat(id: ApproachBeat) {
  if (!seenApproachBeat(id)) storage.set("journey.approachSeen", [...(storage.get<string[]>("journey.approachSeen") ?? []), id]);
}
export const helmsmanFate = () => storage.get<boolean>("journey.helmsmanLost") || seenApproachBeat("helmsman") ? "lost" : "alive";
export const loseHelmsman = () => storage.set("journey.helmsmanLost", true);
export const atApproachHelm = () => storage.get<boolean>("journey.approachAtHelm") === true;
export const setApproachHelm = (value: boolean) => storage.set("journey.approachAtHelm", value);
export const attackStarted = () => (approachCheckpoint.read()?.progress ?? 0) >= .48;
export const attackFinished = () => (approachCheckpoint.read()?.progress ?? 0) === 1;
export const approachProfile = (decision: ApproachDecision | undefined) => ({
  initialMist: decision === "wait" ? .22 : .43,
  lookAhead: decision === "proceed" ? .14 : .1,
  speed: 24,
});
