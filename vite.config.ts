import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vitePluginPixivn({
      content: "./src/content/index.ts",
      characters: "./src/content/characters.ts",
      labels: "./src/content/labels/*.label.ts",
      typeFilePath: "./src/pixi-vn.keys.gen.ts",
      testing: true,
    }),
  ],
});
