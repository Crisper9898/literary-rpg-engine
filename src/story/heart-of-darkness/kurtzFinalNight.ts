import { breakdownAudio } from "./kurtzBreakdown";

export const finalNightPoints = {
  entry: { x: 780, y: 750 },
  candle: { x: 870, y: 730 },
  patient: { x: 780, y: 800 },
  crew: { x: 1190, y: 800 },
  river: { x: 1440, y: 700 },
};
export const finalNightAudio = breakdownAudio.map(layer => ({ ...layer,
  volume: layer.id === "engine" ? .07 : layer.id === "bank" ? .026 : .085 }));
