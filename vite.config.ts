import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Keep the shared animation dependency independently cacheable instead of
    // folding it into the narrative/render bootstrap. Scene code loads on entry.
    rolldownOptions: { output: { codeSplitting: { groups: [
      { name: "motion-runtime", test: /node_modules[\\/](?:motion(?:-dom|-utils)?|framer-motion)[\\/]/ },
    ] } } },
  },
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
