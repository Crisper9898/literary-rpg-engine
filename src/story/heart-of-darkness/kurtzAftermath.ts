import { breakdownAudio } from "./kurtzBreakdown";
export const aftermathPoints = {
  entry: { x: 1190, y: 800 }, burial: { x: 1440, y: 700 },
  papers: { x: 850, y: 750 }, care: { x: 1190, y: 800 },
  water: { x: 870, y: 730 }, shelter: { x: 760, y: 800 }, recovery: { x: 1440, y: 700 },
};
export const aftermathAudio = breakdownAudio.map(layer => ({ ...layer,
  volume: layer.id === "engine" ? .055 : layer.id === "bank" ? .024 : .085 }));
