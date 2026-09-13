import { Game } from "@drincs/pixi-vn";
import "./content";
import "./styles.css";

const root = document.querySelector<HTMLElement>("#root");

if (!root) {
  throw new Error("Missing #root mount element");
}

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

await Game.start("start", {});
