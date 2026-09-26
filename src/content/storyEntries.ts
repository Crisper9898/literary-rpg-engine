import { startLabel } from "./labels/start.label";
import { metamorphosisStart } from "./labels/metamorphosis.label";

/** Application entry selection; each work still owns its scene and content. */
export const storyEntries = [
  { key: "journey", title: "Heart of Darkness", label: startLabel, href: "/" },
  { key: "metamorphosis", title: "La metamorfosis", label: metamorphosisStart,
    href: "/?story=metamorphosis" },
] as const;

export function selectedStory(search: string) {
  const requested = new URLSearchParams(search).get("story");
  return storyEntries.find((entry) => entry.key === requested) ?? storyEntries[0];
}
