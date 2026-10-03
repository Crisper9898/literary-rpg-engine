import type { WorldLayout } from "../../engine/world/worldLayout";
import type { VisualSource } from "../../ui/visualAssetSlot";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";

export const woodStop = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 320, y: 700, width: 1300, height: 175 },
  anchors: {
    arrival: { x: 1540, y: 805 }, book: { x: 510, y: 710 },
    wood: { x: 1150, y: 720 }, warning: { x: 1380, y: 710 },
    sailor: { x: 1570, y: 805 },
  },
} as const satisfies WorldLayout;
export const woodStopArt = { url: "/assets/art/journey-wood-stop/wood-station.png",
  width: 1920, height: 1080 } satisfies VisualSource;
export const woodStopAudio: readonly AudioLayer[] = [
  { id: "river", source: "journey-audio-river", volume: .18, fadeInMS: 1200, fadeOutMS: 1200 },
  { id: "forest", source: "journey-audio-shore", volume: .22, fadeInMS: 1400, fadeOutMS: 1400,
    zone: { center: () => woodStop.anchors.book, innerRadius: 100, outerRadius: 1000 } },
  { id: "moored-engine", source: "journey-audio-engine", volume: .1, fadeInMS: 1200, fadeOutMS: 1200,
    zone: { center: () => woodStop.anchors.arrival, innerRadius: 100, outerRadius: 650 } },
];
export const woodStopLines = {
  wood: "Leña cortada, apilada para nosotros. Cargo lo necesario con el marinero. Quien la dejó esperaba este vapor.",
  warning: "«Leña para ustedes. Apresúrense. Acérquense con cautela». La firma no se puede leer. La advertencia parece referirse a lo que hay río arriba.",
  book: "Un tratado de navegación, de Towson —o un nombre parecido—. Cuerdas, esfuerzos, trabajo preciso. Las notas al margen me parecen una clave. Aquí alguien vivió de verdad.",
  question: "Tenemos combustible. Más arriba el cauce se estrecha; pronto no distinguiremos los bancos. ¿Esperamos luz o continuamos?",
  questionWarned: "Esa tabla pide prisa y cautela a la vez. Tenemos combustible, pero más arriba el cauce se estrecha. ¿Esperamos luz o continuamos?",
  wait: "Esperaremos luz diurna antes de acercarnos. Una noche más no vale un casco roto. Dejaremos el vapor fondeado en el centro del río.",
  proceed: "Seguiremos despacio hasta un fondeadero seguro; si perdemos la orilla, paramos. La prisa no hará visible un banco sumergido.",
  bookAfter: "Y ese libro… No eran solo cuentas de carga. Alguien intentaba conservar aquí un oficio y un orden.",
  ordinaryAfter: "La leña bastará para el próximo tramo. De la persona que la preparó solo quedan el trabajo y la cabaña vacía.",
} as const;
