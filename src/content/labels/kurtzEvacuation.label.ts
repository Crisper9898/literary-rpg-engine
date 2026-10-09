import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, kurtz } from "../characters";
import { beginEvacuation, examinePatient, chooseEvacuationPriority, evacuationState, secureCot,
  clearLanding, loadFirstCargo, beginCotTransfer, setEvacuationPose, finishEvacuationExchange } from "../state/kurtzEvacuationState";
import { nightState } from "../state/kurtzNightEscapeState";
import { showJourneySpace } from "../scenes/journeyDeck";
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const evacuationMorning = newLabel("journey-station-evacuation-morning", [async () => {
  if (beginEvacuation()) await showJourneySpace();
  say(marlow, "La mañana no trae alivio. El vapor espera abajo; hay que sacar a Kurtz de aquí sin pedirle otro paso.");
}, close]);
export const evacuationPatient = newLabel("journey-station-evacuation-patient", [() => {
  examinePatient(); say(marlow, "La tos le dobla los hombros. Bajo la manta apenas queda peso; ayer, su voz llenaba toda la estación.");
}, () => { setEvacuationPose("intense"); say(kurtz, nightState().choice === "reason" ?
  "Me habló de mañana. Ya está aquí. No olvide que todavía tengo planes." :
  "Me impidió volver. No crea que puede llevarse también lo que he hecho aquí."); },
() => { setEvacuationPose("weak"); say(marlow, "Los porteadores aguardan junto a la camilla. Del embarcadero llega una orden: primero, el marfil."); }, close]);
const patientFirst = newLabel("journey-station-evacuation-patient-first", [() => {
  chooseEvacuationPriority("patient"); say(marlow, "El hombre irá primero. Aseguraré la camilla y dejaré libres los tablones; el marfil puede esperar.");
}]);
const cargoFirst = newLabel("journey-station-evacuation-cargo-first", [() => {
  chooseEvacuationPriority("cargo"); say(marlow, "Apartaré primero la carga hacia el embarcadero. Después aseguraré la camilla. Él tendrá que esperar.");
}]);
export const evacuationDecision = newLabel("journey-station-evacuation-decision", [() => {
  say(marlow, "La carga y la camilla deben cruzar los mismos tablones. ¿Qué hago pasar primero?");
  if (!evacuationState().priority) narration.choices = [
    newChoiceOption("Dar prioridad a Kurtz; dejar la carga para después", patientFirst, {}),
    newChoiceOption("Atender la carga primero; hacer esperar a Kurtz", cargoFirst, {}),
  ];
}, () => say(kurtz, evacuationState().priority === "patient" ?
  "¿Dejarla? Es mi marfil. No lo entregue al descuido de esos hombres." :
  "Eso sí lo entienden. Mis palabras pueden esperar; mi marfil, no."), close]);
export const evacuationBindings = newLabel("journey-station-evacuation-bindings", [() => {
  secureCot(); say(marlow, "Tenso las ligaduras del paño entre las varas. Los dos hombres prueban el peso juntos; Kurtz no tendrá que levantarse.");
}, close]);
export const evacuationLanding = newLabel("journey-station-evacuation-landing", [() => {
  clearLanding(); say(marlow, "Aparto una cuerda de los tablones y compruebo dónde ceden. La camilla podrá pasar si mantengo un paso corto delante de ellos.");
}, close]);
export const evacuationCargo = newLabel("journey-station-evacuation-cargo", [() => {
  loadFirstCargo(); say(marlow, "Hago llevar el primer atado hacia el vapor. En la colina, la tos vuelve a interrumpir el silencio. La carga ya no ocupa el paso.");
}, close]);
export const evacuationLift = newLabel("journey-station-evacuation-lift", [() => {
  beginCotTransfer(); say(marlow, "Alzan las varas a la vez. Camino delante hacia los tablones: si me alejo demasiado, tendrán que detenerse.");
}, close]);
export const evacuationReady = newLabel("journey-station-evacuation-ready", [
  () => say(marlow, evacuationState().priority === "patient" ?
    "La camilla alcanza el desembarcadero antes que la carga. Detrás de nosotros siguen esperando los atados de marfil." :
    "La camilla llega detrás del primer atado. El orden se ha cumplido; la respiración de Kurtz no se ha vuelto más fácil."),
  () => say(kurtz, nightState().choice === "reason" ? "Ahora, Marlow… Mis planes. No permita que se queden aquí." :
    "Puede llevarme. No puede hacerme callar."),
  () => say(marlow, "Todo está dispuesto para embarcarlo. La corriente espera. Por ahora, sigo junto a la camilla."),
  () => { finishEvacuationExchange(); close(); },
]);
export const evacuationAfter = newLabel("journey-station-evacuation-after", [() => say(marlow,
  evacuationState().priority === "patient" ? "La carga queda atrás. Él espera junto al agua; no lo dejaré solo." :
  "El primer atado está abajo. Me quedo junto a Kurtz; ya ha esperado bastante."), close]);
