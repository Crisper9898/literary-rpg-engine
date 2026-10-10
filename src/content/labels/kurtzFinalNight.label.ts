import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, kurtz } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { breakdownState } from "../state/kurtzBreakdownState";
import { beginFinalNight, takeCandle, placeCandle, chooseVigilResponse, finishVigil,
  hearFinalWords, finishFinalWords, leavePatient, confirmKurtzDeath, finishFinalNight,
  finalNightState } from "../state/kurtzFinalNightState";

const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const finalNightEntry = newLabel("journey-station-final-night-entry", [async () => {
  if (beginFinalNight()) await showJourneySpace();
  say(marlow, "Cae la tarde sobre otro recodo idéntico. La máquina funciona; Kurtz ya casi no habla. Hay una vela junto a la caseta.");
}, close]);
export const finalNightCandle = newLabel("journey-station-final-night-candle", [() => {
  takeCandle(); say(marlow, "Enciendo la vela y protejo la llama con la mano. Puedo llevarla hasta Kurtz, a la izquierda, sin detener el viaje.");
}, close]);
const reassure = newLabel("journey-station-final-night-reassure", [() => {
  chooseVigilResponse("reassure"); say(marlow, "Está a bordo. Yo sigo aquí. Me obligo a decirlo como si mi voz pudiera darle una certeza.");
}, () => say(kurtz, "Mis planes… No he terminado. Todavía no.")]);
const listen = newLabel("journey-station-final-night-listen", [() => {
  chooseVigilResponse("listen"); say(marlow, "No lleno el silencio con una promesa. Acerco la luz y me quedo a su lado para escuchar.");
}, () => say(kurtz, "Mi estación… mis ideas… todo debía llegar más lejos.")]);
export const finalNightVigil = newLabel("journey-station-final-night-vigil", [() => {
  placeCandle(); say(kurtz, "Estoy aquí, en la oscuridad, esperando la muerte.");
}, () => {
  say(marlow, breakdownState().papersResponse === "ask" ?
    "La llama está muy cerca de sus ojos. Recuerdo el rostro de su prometida; él parece mirar algo que la luz no alcanza." :
    "La llama está muy cerca de sus ojos. El paquete sigue cerrado. Él parece mirar algo que esta luz no alcanza.");
  if (!finalNightState().response) narration.choices = [
    newChoiceOption("Intentar tranquilizarlo", reassure, {}),
    newChoiceOption("Quedarte y escuchar sin prometer", listen, {}),
  ];
}, () => { finishVigil(); close(); }]);
export const finalNightWords = newLabel("journey-station-final-night-words", [() => {
  say(marlow, "Su rostro cambia. Orgullo, miedo, desesperación: no alcanzo a separar una cosa de otra. La voz se reduce a un soplo.");
}, () => {
  hearFinalWords(); say(kurtz, "¡El horror! ¡El horror!");
}, () => say(marlow, "No sé qué ha visto. Las palabras quedan entre nosotros; el río no deja de llevarnos.") ,
() => { finishFinalWords(); close(); }]);
export const finalNightLeave = newLabel("journey-station-final-night-leave", [() => {
  leavePatient(); say(marlow, "Apago la vela y dejo a Kurtz en la caseta. En cubierta, los hombres se reúnen a comer. Camino hacia ellos.");
}, close]);
export const finalNightAnnouncement = newLabel("journey-station-final-night-announcement", [() => {
  say(marlow, finalNightState().response === "reassure" ?
    "Me siento aparte de la tripulación. Hace un momento intenté tranquilizarlo; ahora evito la mirada del gerente." :
    "Me siento aparte de la tripulación. No le prometí volver; todavía oigo su voz mientras evito la mirada del gerente.");
}, () => {
  confirmKurtzDeath(); narration.dialogue = { text: "Desde la caseta, un muchacho anuncia: «Kurtz ha muerto».", character: undefined };
}, () => say(marlow, breakdownState().papersResponse === "ask" ?
  "Los demás se levantan. Yo permanezco. Llevo sus papeles y la fotografía de quien lo espera; la voz se ha ido." :
  "Los demás se levantan. Yo permanezco. El cordón sigue cerrado bajo mi chaqueta; la voz se ha ido."),
() => { finishFinalNight(); close(); }]);
export const finalNightRiver = newLabel("journey-station-final-night-river", [() => say(marlow,
  finalNightState().phase === "confirmed" ? "Otro recodo se aleja. El vapor sigue; ya no hay una voz que lo llene todo." :
    "Las orillas se repiten en la oscuridad. La corriente nos lleva hacia el mar, aunque el paisaje parezca no terminar."), close]);
export const finalNightAfter = newLabel("journey-station-final-night-after", [() => say(marlow,
  "Sigo en cubierta con los papeles. La noticia no cambia la corriente. El regreso aún no ha terminado."), close]);
