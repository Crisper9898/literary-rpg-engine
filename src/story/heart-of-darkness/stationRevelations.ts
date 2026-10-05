import type { VisualSource } from "../../ui/visualAssetSlot";
import type { Discovery } from "../../content/state/stationRevelationsState";
export const revelationsWalkable = { x: 350, y: 660, width: 1320, height: 220 };
const frame = (x: number, y: number, width = 512) => ({ x, y, width, height: 512, pivot: { x: width / 2, y: 475 } });
const source = (width: number, height: number, frames: VisualSource["frames"]): VisualSource => ({
  url: "/assets/art/station-revelations/evidence.png", width, height, frames,
});
export const stationEvidence: Record<Discovery, { position: { x: number; y: number }; range: number; prompt: string; art: VisualSource }> = {
  ivory: { position: { x: 650, y: 690 }, range: 58, prompt: "E · Examinar la acumulación de marfil",
    art: source(340, 265, { idle: frame(0, 0, 585) }) },
  palisade: { position: { x: 850, y: 680 }, range: 58, prompt: "E · Mirar los remates de la empalizada",
    art: source(300, 260, { idle: frame(585, 0, 455), revealed: frame(1040, 0, 496) }) },
  influence: { position: { x: 1120, y: 850 }, range: 58, prompt: "E · Observar el lugar de reunión",
    art: source(240, 170, { idle: frame(0, 512, 560) }) },
  report: { position: { x: 1560, y: 850 }, range: 48, prompt: "E · Leer el informe de Kurtz",
    art: source(190, 155, { idle: frame(560, 512, 500) }) },
};
