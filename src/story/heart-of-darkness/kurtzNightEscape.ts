import type { VisualSource } from "../../ui/visualAssetSlot";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import type { NightTrace } from "../../content/state/kurtzNightEscapeState";
export const nightStationArt: VisualSource = { url: "/assets/art/kurtz-night/station.png", width: 1920, height: 1080 };
export const nightForestArt: VisualSource = { url: "/assets/art/kurtz-night/forest.png", width: 1920, height: 1080 };
const frame = (x: number, y: number, width: number, height: number, footY: number) =>
  ({ x, y, width, height, pivot: { x: width / 2, y: footY } });
const atlas = "/assets/art/kurtz-night/figures.png";
export const nightKurtzArt: VisualSource = { url: atlas, width: 250, height: 240, frames: {
  collapsed: frame(0, 0, 512, 396, 382), bracing: frame(512, 0, 512, 414, 396),
  dominant: frame(1024, 0, 512, 414, 395), exhausted: frame(0, 396, 512, 350, 312),
} };
export const nightBedArt: VisualSource = { url: atlas, width: 330, height: 210,
  frames: { idle: frame(512, 414, 512, 330, 308) } };
export const nightFollowersArt: VisualSource = { url: atlas, width: 285, height: 155,
  frames: { idle: frame(1024, 746, 512, 278, 250) } };
export const nightTracePoints: Record<NightTrace, { position: { x: number; y: number }; prompt: string; text: string; art: VisualSource }> = {
  grass: { position: { x: 1415, y: 835 }, prompt: "E · Seguir la hierba aplastada",
    text: "La hierba está vencida en una franja ancha. No pudo irse andando: ha arrastrado el cuerpo hacia la selva.",
    art: { url: atlas, width: 155, height: 80, frames: { idle: frame(1024, 414, 512, 330, 290) } } },
  prints: { position: { x: 1530, y: 860 }, prompt: "E · Reconocer las marcas en el barro",
    text: "Palmas y rodillas en el barro. Entre dos marcas hay una pausa larga; después, el rastro continúa.",
    art: { url: atlas, width: 140, height: 78, frames: { idle: frame(0, 746, 512, 278, 242) } } },
  branches: { position: { x: 1640, y: 755 }, prompt: "E · Apartar las ramas dobladas",
    text: "Una tira oscura ha quedado prendida aquí. Entre los troncos hay luces bajas; algo se mueve delante de ellas.",
    art: { url: atlas, width: 160, height: 145, frames: { idle: frame(512, 746, 512, 278, 250) } } },
};
export const nightRest = { x: 1315, y: 780 }, nightClearingExit = { x: 1640, y: 800 };
export const nightAudioLayers = (silent: () => boolean): readonly AudioLayer[] => [
  { id: "water", source: "journey-audio-river", volume: .014, fadeInMS: 1800, fadeOutMS: 1600,
    zone: { center: () => ({ x: 430, y: 760 }), innerRadius: 50, outerRadius: 1350 } },
  { id: "canopy", source: "journey-audio-shore", volume: .023, fadeInMS: 2500, fadeOutMS: 1100, enabled: () => !silent(),
    zone: { center: () => ({ x: 1460, y: 760 }), innerRadius: 260, outerRadius: 1250 } },
];
