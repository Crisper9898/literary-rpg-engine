import { Game } from "@drincs/pixi-vn";
import "./content";
import { selectedStory, storyEntries } from "./content/storyEntries";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#root");

if (!root) {
  throw new Error("Missing #root mount element");
}

const selected = selectedStory(window.location.search);

await Game.init(root, {
  width: 1920,
  height: 1080,
  backgroundColor: "#151a1c",
  antialias: true,
  resizeMode: "contain",
});

Game.addOnError((error) => {
  console.error("[Literary RPG Engine]", error);
});

Game.onEnd(async () => {
  // The vertical slice will replace this with its end-screen transition.
});

const selector = document.createElement("nav");
selector.className = "story-selector";
selector.setAttribute("aria-label", "Elegir obra");
for (const entry of storyEntries) {
  const link = document.createElement("a");
  link.href = entry.href;
  link.textContent = entry.title;
  if (entry.key === selected.key) link.setAttribute("aria-current", "page");
  selector.append(link);
}
document.body.append(selector);
await Game.start(selected.label, {});
