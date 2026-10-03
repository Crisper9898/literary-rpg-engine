import type { NavigationOptions } from "../../puzzles/riverApproach/NavigationController";
import type { VisualSource } from "../../ui/visualAssetSlot";

export const approachRoute = { length: 1200, speed: 24, steerSpeed: .34, radius: .1,
  whistleGate: .86,
  obstacles: [
    { id: "driftwood", kind: "log", progress: .19, lateral: -.24, radius: .18 },
    { id: "reed-bank", kind: "reeds", progress: .32, lateral: .45, radius: .22 },
    { id: "shoal", kind: "shoal", progress: .53, lateral: -.45, radius: .27 },
    { id: "snag", kind: "log", progress: .76, lateral: .18, radius: .17 },
  ],
} as const satisfies Omit<NavigationOptions, "obstacles"> & {
  obstacles: readonly (NavigationOptions["obstacles"][number] & { kind: string })[] };
export const approachHelm = { x: 900, y: 748 };
export const helmsmanArt: VisualSource = {
  url: "/assets/art/journey-approach/helmsman.png", width: 150, height: 210,
  pivot: { x: 75, y: 202 },
};
export const fallenHelmsmanArt: VisualSource = {
  url: "/assets/art/journey-approach/helmsman-fallen.png", width: 230, height: 145,
  pivot: { x: 115, y: 138 },
};
export type ApproachBeat = "arrival" | "left" | "right" | "attack" | "helmsman" | "after";
export const approachBeats: readonly { id: ApproachBeat; progress: number }[] = [
  { id: "arrival", progress: 0 }, { id: "left", progress: .1 }, { id: "right", progress: .28 },
  { id: "attack", progress: .48 }, { id: "helmsman", progress: .65 }, { id: "after", progress: 1 },
];
export const approachLines = {
  arrivalWait: "Esperamos la luz. Al levantar el ancla, el río vuelve a cerrarse en una niebla húmeda. Hay algo de claridad: no hay certezas.",
  arrivalProceed: "Seguimos hasta el fondeadero con la sonda preparada. Retomamos el canal entre sombras: la proa oye lo que todavía no vemos.",
  left: "Un clamor llega de babor, detrás de las hojas. Parece dolor, no una orden de ataque. Mantengo la vista en la corriente.",
  right: "Una rama cruje a estribor. El sonido cruza el agua. No puedo contar a nadie entre esos árboles.",
  attack: "La niebla se abre un instante. Un banco de arena estrecha el paso. Flechas golpean la caseta; el humo de los disparos de a bordo nos ciega. ¡Mantén el vapor en marcha!",
  helmsman: "El timonel se vuelve hacia la orilla. Algo atraviesa la abertura; retrocede, me mira y cae junto a la rueda. Tomo el timón. No responde.",
  helmsmanAfter: "El timonel ha muerto. Habíamos gobernado este barco juntos. Su mano ya no vuelve a la rueda. El río no se detiene por nosotros.",
  after: "La sirena corta el clamor. Las flechas cesan; sólo queda la rueda golpeando el agua. La niebla empieza a abrirse. La Estación Interior debe de estar cerca. Todavía no hemos llegado.",
} as const;
