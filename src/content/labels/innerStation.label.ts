import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, russianTrader } from "../characters";
import { markStation, observeStation, rememberTopic, russianTopics, russianStance, setRussianStance,
  setRussianMood, completeRussianConversation, type RussianTopic } from "../state/innerStationState";
import { seamanshipBookRead, warningRead } from "../state/woodStopState";
import { stationObservationText, russianTopicLines } from "../../story/heart-of-darkness/innerStation";
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const topicStep = (topic: RussianTopic, index: number) => () => {
  rememberTopic(topic); setRussianMood(topic === "attack" ? "nervous" : topic === "kurtz" ? "fervent" : "eager");
  say(russianTrader, russianTopicLines[topic][index]);
};
const topicLabels = Object.fromEntries((["kurtz", "station", "attack", "relation"] as const).map(topic =>
  [topic, newLabel(`journey-station-topic-${topic}`, [topicStep(topic, 0), topicStep(topic, 1), topicStep(topic, 2)])]));
export const stationInspectLabels = Object.fromEntries((Object.keys(stationObservationText) as (keyof typeof stationObservationText)[])
  .map(id => [id, newLabel(`journey-station-observe-${id}`, [
    () => { observeStation(id); say(marlow, stationObservationText[id]); }, close,
  ])]));
const listen = newLabel("journey-station-listen", [() => {
  setRussianStance("listen"); setRussianMood("fervent"); say(russianTrader, "Gracias por escuchar. Pero mi admiración no basta para cuidarlo. La casa está ahí; usted tendrá que verlo con sus propios ojos.");
}]);
const question = newLabel("journey-station-question", [() => {
  setRussianStance("question"); setRussianMood("nervous"); say(russianTrader, "¿Que si confío demasiado?… No sabría vivir aquí sin creer en él. Eso no borra el peligro. Al mirarme así, me obliga a oír mis propias palabras.");
}]);
// Stable Pixi label indices: order choices change information, never the save format.
export const russianConversation = newLabel("journey-station-russian", [
  () => { markStation("russianMet"); setRussianMood("eager"); say(russianTrader, "¡Un vapor! Me alegra verlos. Ruso, marinero… perdone, llevo tanto tiempo sin conversar. La casa está arriba. Kurtz está cerca."); },
  () => { say(marlow, "Su ropa está llena de remiendos cuidadosamente cosidos. Sonríe y mira hacia la casa; la preocupación le cambia el rostro. ¿Por dónde empiezo?");
    narration.choices = [newChoiceOption("Preguntar por Kurtz", topicLabels.kurtz, {}), newChoiceOption("Preguntar por la estación", topicLabels.station, {})]; },
  ...[0, 1, 2].map(index => () => {
    const first = russianTopics().find(topic => topic === "kurtz" || topic === "station");
    topicStep(first === "kurtz" ? "station" : "kurtz", index)();
  }),
  () => { say(marlow, seamanshipBookRead() ? "En la cabaña vi un tratado de navegación lleno de notas. ¿También era suyo?" : "Su advertencia estaba junto a la leña. ¿Cómo llegó a vivir aquí?"); },
  () => { setRussianMood("eager"); say(russianTrader, seamanshipBookRead() ?
    "¡Mi libro de Towson! Creía haberlo perdido. Las notas son ruso, no una clave. Ese libro me acompañaba cuando todo lo demás se deshacía." :
    warningRead() ? "Sí, dejé la advertencia. Tenía que pedirles prisa y cautela a la vez. Aquí se aprende a temer ambas cosas." :
      "Sí, la leña y la advertencia eran mías. Lo sencillo —un libro, un oficio— ayuda a seguir cuando todo lo demás se vuelve extraño."); },
  () => { say(marlow, "Quiero entender lo que acaba de ocurrir, no aceptar una tranquilidad prestada.");
    narration.choices = [newChoiceOption("Preguntar por el ataque", topicLabels.attack, {}), newChoiceOption("Preguntar por su relación con Kurtz", topicLabels.relation, {})]; },
  ...[0, 1, 2].map(index => () => {
    const first = russianTopics().find(topic => topic === "attack" || topic === "relation");
    topicStep(first === "attack" ? "relation" : "attack", index)();
  }),
  () => { say(marlow, "Su admiración ocupa todos los huecos de esta estación. ¿Qué hago con lo que me cuenta?");
    narration.choices = [newChoiceOption("Escucharlo sin dar todavía un juicio", listen, {}), newChoiceOption("Cuestionar su confianza en Kurtz", question, {})]; },
  () => { say(marlow, russianStance() === "question" ? "Su respuesta ya no suena segura. No confundiré esa fascinación con una explicación." : "Lo dejo terminar. Escuchar no significa creerlo todo; necesito ver a ese hombre."); },
  () => { completeRussianConversation(); setRussianMood("nervous"); say(russianTrader, "Vaya hasta el comienzo del sendero. Puedo señalarle la casa, pero no explicarle a Kurtz. Tendrá que acercarse usted."); }, close,
]);
export const russianFollowup = newLabel("journey-station-followup", [
  () => { setRussianMood(russianStance() === "question" ? "nervous" : "fervent"); say(russianTrader,
    russianStance() === "question" ? "Sigue mirándome como si no confiara en lo que digo. Entiendo por qué. No tome mi fe por una garantía." :
      "Usted me dejó hablar. Eso me alivió… pero no convierte esta casa en un lugar seguro. Mire antes de decidir."); }, close,
]);
export const stationClosing = newLabel("journey-station-closing", [
  () => { markStation("kurtzEncounterPrepared"); setRussianMood("nervous"); say(marlow,
    "El sendero sube hasta las ventanas oscuras. Kurtz está detrás de esa fachada. Ya conozco la voz de quien lo admira; ahora falta conocer al hombre."); },
  () => say(russianTrader, "Ahí arriba. Antes de dar otro paso, mire bien. No sé qué encontrará cuando él salga."), close,
]);
export const stationArrivalLine = newLabel("journey-station-arrival", [
  () => { markStation("stationArrivalSeen"); say(marlow, "Una abertura en la orilla. La estación. Aminoro, paro el motor y dejo que la corriente nos acerque. Después del ruido, ese silencio pesa más."); }, close,
]);
export const stationCreakLine = newLabel("journey-station-creak", [
  () => { markStation("stationCreakSeen"); say(marlow, "Un travesaño cruje y la hierba se mueve junto al sendero. Luego nada. No sé si alguien pasó o si fue el viento. Hay una figura con sombrero al otro lado."); }, close,
]);
