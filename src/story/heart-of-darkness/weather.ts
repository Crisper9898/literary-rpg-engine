import type { AtmosphereKeyframe } from "../../engine/weather/AtmosphereController";

export type JourneyAtmosphereChannel = "distantFog" | "riverFog" | "deckFog" | "shade";

// Distance is measured against the passing near bank, not Marlow's footsteps.
export const journeyWeather = {
  routeDistance: 3600,
  keyframes: [
    { progress: 0, values: { distantFog: .035, riverFog: .02, deckFog: .01, shade: 0 } },
    { progress: .5, values: { distantFog: .46, riverFog: .23, deckFog: .11, shade: .07 } },
    { progress: 1, values: { distantFog: .9, riverFog: .48, deckFog: .22, shade: .18 } },
  ] satisfies readonly AtmosphereKeyframe<JourneyAtmosphereChannel>[],
  fog: [
    { channel: "distantFog", speed: 8, depth: .18, y: 290, height: 300, tint: 0xa4b3a0 },
    { channel: "riverFog", speed: 19, depth: .65, y: 435, height: 230, tint: 0x849e96 },
    { channel: "deckFog", speed: 36, depth: 1.08, y: 600, height: 300, tint: 0x9fb3ae },
  ],
} as const;
