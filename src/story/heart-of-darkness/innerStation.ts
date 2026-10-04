import type { WorldLayout } from "../../engine/world/worldLayout";
import type { VisualSource } from "../../ui/visualAssetSlot";
export const innerStation = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 380, y: 690, width: 1230, height: 130 },
  anchors: { arrival: { x: 420, y: 745 }, planks: { x: 570, y: 775 },
    fence: { x: 850, y: 715 }, grass: { x: 1070, y: 785 }, house: { x: 1450, y: 735 },
    russian: { x: 1200, y: 780 } },
} as const satisfies WorldLayout;
export const stationArt: VisualSource = { url: "/assets/art/journey-inner-station/station.png", width: 1920, height: 1080 };
export const russianArt: VisualSource = { url: "/assets/art/journey-inner-station/russian.png", width: 230, height: 230,
  frames: Object.fromEntries(["idle", "eager", "nervous", "fervent"].map((id, index) => [id,
    { x: Math.max(0, index - 1) * 724, y: 0, width: 724, height: 724, pivot: { x: 410, y: 704 } }])) };
export const stationObservationText = {
  planks: "Los tablones del desembarcadero ceden bajo mi peso. Quedan reparaciones viejas y madera partida. La estación recibe barcos, pero nadie cuida ya la llegada.",
  fence: "De una cerca apenas quedan postes y travesaños caídos. Sus remates parecen adornos desde aquí. No me acerco aún a la casa: el abandono no explica este silencio.",
  grass: "Un paso estrecho aplasta la hierba entre el embarcadero y la colina. Aquí todavía se camina. La estación no está tan vacía como parece.",
  house: "Una casa larga, ventanas desiguales, agujeros negros en el techo. Es la estación de Kurtz. Está arriba, oculta a medias por la hierba; aún no veo a nadie.",
} as const;
export const russianTopicLines = {
  kurtz: ["Está arriba. Kurtz… ahora está enfermo. Mi alegría no significa que todo esté bien. Me alegra que hayan llegado.",
    "Cuando habla, no se conversa con él: se le escucha. No he conocido a otro hombre así.",
    "Me ha hecho ver cosas. Hablo demasiado, ya lo sé. Aquí uno acumula mucho silencio."],
  station: ["Llevo cerca de dos años en este río, solo durante largas temporadas. Las cosas se rompen; a veces hay que marcharse deprisa.",
    "Yo apilé aquella leña río abajo. La cabaña era mi casa. Esperaba que la advertencia les ayudara a acercarse.",
    "Esa casa en la colina parece quieta. Pero no confunda la falta de voces con la falta de gente."],
  attack: ["Intenté mantenerlos lejos del vapor. No querían que él se marchara… No; no puedo llamarlo inofensivo después de lo que ocurrió.",
    "Deje presión en la caldera. Una sola sirena hizo más que los disparos. Y junto a este embarcadero hay un tronco: no acerque el casco sin mirar.",
    "Siento lo del timonel. Mi entusiasmo no lo trae de vuelta. Miro al bosque antes de hablar; hay gente detrás de esas hojas."],
  relation: ["Soy ruso, hijo de un arcipreste. Me fui al mar; quería conocer cosas y ensanchar la mente. Aquí encontré a Kurtz.",
    "Hay temporadas en que no está. Aun así lo espero. Mi vida aquí no es cómoda; no sé explicar por qué me cuesta tanto alejarme.",
    "No soy tan joven como parezco: tengo veinticinco años. Pero al hablar de él vuelvo a sentir que todo está por descubrir."],
} as const;
