import { startLabel } from "./labels/start.label";
import { metamorphosisStart } from "./labels/metamorphosis.label";
import { prologueStart } from "./labels/thamesPrologue.label";
import { commissionStart } from "./labels/companyCommission.label";
import { outerStart } from "./labels/outerStation.label";
import { centralStart } from "./labels/centralStation.label";

/** Application entry selection; each work still owns its scene and content. */
export const storyEntries = [
  { key: "journey", title: "Heart of Darkness", label: startLabel, href: "/" },
  { key: "metamorphosis", title: "La metamorfosis", label: metamorphosisStart,
    href: "/?story=metamorphosis" },
] as const;

export function selectedStory(search: string) {
  const params = new URLSearchParams(search), requested = params.get("story");
  if (requested === "journey" && params.get("episode") === "central-station") {
    return { ...storyEntries[0], label: centralStart };
  }
  if (requested === "journey" && params.get("episode") === "outer-station") {
    return { ...storyEntries[0], label: outerStart };
  }
  if (requested === "journey" && params.get("episode") === "prologue") {
    return { ...storyEntries[0], label: prologueStart };
  }
  if (requested === "journey" && params.get("episode") === "commission") {
    return { ...storyEntries[0], label: commissionStart };
  }
  return storyEntries.find((entry) => entry.key === requested) ?? storyEntries[0];
}
