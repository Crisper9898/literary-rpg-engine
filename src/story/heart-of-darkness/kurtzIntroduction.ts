import type { VisualSource } from "../../ui/visualAssetSlot";
export const kurtzArt: VisualSource = {
  url: "/assets/art/journey-kurtz/kurtz.png", width: 315, height: 210,
  frames: Object.fromEntries(["weak", "commanding", "intense", "coughing"].map((pose, i) => [pose,
    { x: (i % 2) * 768, y: Math.floor(i / 2) * 512, width: 768, height: 512, pivot: { x: 384, y: 490 } }])),
};
export const bearerArt: VisualSource = {
  url: "/assets/art/journey-kurtz/bearers.png", width: 225, height: 230,
  frames: {
    first: { x: 380, y: 0, width: 706, height: 724, pivot: { x: 420, y: 710 } },
    second: { x: 1180, y: 0, width: 750, height: 724, pivot: { x: 440, y: 710 } },
  },
};
export const kurtzNearby = {
  bindings: { position: { x: 1470, y: 780 }, prompt: "E · Observar las ataduras de la camilla",
    text: "Las lianas aprietan unos palos cortados a toda prisa. Sus manos se cierran sobre ellos. Para traer a un hombre tan débil han hecho falta dos hombres enteros." },
  witnesses: { position: { x: 1120, y: 725 }, prompt: "E · Observar a quienes esperan",
    text: "Nadie habló cuando levantó la mano. El ruso dejó de respirar un instante. La obediencia llegó antes que cualquier explicación." },
  threshold: { position: { x: 1520, y: 725 }, prompt: "E · Mirar el umbral vacío",
    text: "La hierba conserva la abertura de la camilla. La casa ya no esconde su nombre; la oscuridad de sus ventanas parece ahora más profunda." },
};
