/** Original connective scene for the Journey slice, not quotations from the novel. */
export const deckConversation = {
  greeting: "Venga conmigo. Tengo que revisar las amarras; podemos hablar mientras camino.",
  marlow: "Desde aquí el río parece quieto. El barco cuenta otra cosa.",
  question: "No se fíe de la superficie. ¿Es su primer viaje por estas aguas?",
  choices: ["¿Qué esconde el río?", "¿Para quién es la carga?"],
  riverQuestion: "¿Qué esconde el río cuando parece tan tranquilo?",
  riverAnswer: "Una corriente puede torcer el rumbo sin levantar una ola. Mire la orilla: ella le dirá si avanzamos.",
  cargoQuestion: "¿Para quién es la carga que llevamos?",
  cargoAnswer: "Las cajas tienen destino escrito. Los hombres que las esperan, no. Yo procuro que lleguen secas.",
  cargoAnswerInspected: "Vio la marca raspada en la tablilla, ¿verdad? Alguien borró el destino antes de embarcar la carga. Yo solo procuro que llegue seca.",
  farewell: "Siga junto a la barandilla, Marlow. Desde ahí se ve mejor lo que dejamos atrás. Yo aún tengo trabajo.",
  startDistance: 180,
  hearingDistance: 440,
} as const;
