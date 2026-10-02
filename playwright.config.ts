import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Canvas tests share the GPU/software renderer. Run one browser at a time so
  // resource contention does not turn movement's stall cap into travel timeouts.
  workers: 1,
  // Illustrated scene crossfades run on SwiftShader in CI. The world caps each
  // tick at 50ms, so wall-clock waits need room for real rendered frames.
  // Velocity/diagonals are still asserted against measured simulation frames.
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://127.0.0.1:5173",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: true,
  },
});
