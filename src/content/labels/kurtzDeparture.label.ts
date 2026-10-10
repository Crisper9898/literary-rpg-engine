import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, kurtz, journeyDeckhand as deckhand } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { evacuationState } from "../state/kurtzEvacuationState";
import { beginDeparture, departureState, visitDeparturePatient, releaseMooring, observeBank,
  chooseDepartureResponse, warnCrew, useWhistle, startManoeuvre, finishDepartureExchange } from "../state/kurtzDepartureState";
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const departureBoard = newLabel("journey-station-departure-board", [async () => {
  if (beginDeparture()) await showJourneySpace();
  say(marlow, "Subimos a Kurtz a la caseta, donde corre algo de aire. Es mediodía. Falta soltar la amarra antes de darle el vapor a la corriente.");
}, close]);
export const departurePatient = newLabel("journey-station-departure-patient", [() => {
  visitDeparturePatient(); say(marlow, evacuationState().priority === "patient" ?
    "Llegó antes que el marfil. Ahora la carga está a bordo; él mira por la abertura, como si algo suyo siguiera en la orilla." :
    "Hice esperar su cuerpo por el primer atado. Ahora está a bordo, pero su mirada sigue en la orilla.");
}, () => say(kurtz, "Todavía están ahí. No cierre la abertura."), close]);
export const departureMooring = newLabel("journey-station-departure-mooring", [() => {
  releaseMooring(); say(deckhand, "La amarra está dentro. Ya no nos sostiene el embarcadero.");
}, () => say(marlow, "La gente sale de los árboles y llena la ribera. Detrás de mí, los hombres de la compañía empiezan a sacar los rifles."), close]);
export const departureBank = newLabel("journey-station-departure-bank", [() => {
  observeBank(); say(marlow, "Una mujer llega hasta el agua. Alza las manos hacia nosotros. La multitud recoge su grito; no puedo entenderlo.");
}, () => say(kurtz, "¿Que si lo entiendo?"), close]);
const whistleFirst = newLabel("journey-station-departure-whistle-first", [() => {
  chooseDepartureResponse("whistle"); useWhistle();
  say(marlow, "Tiro de la cuerda del silbato. El grito del vapor rompe la ribera: la gente retrocede. La mujer no se aparta.");
}]);
const interveneFirst = newLabel("journey-station-departure-intervene-first", [() => {
  chooseDepartureResponse("intervene"); say(marlow, "Antes del silbato, iré hasta esos hombres. No convertiré la partida en una diversión de tiro.");
}]);
export const departureDecision = newLabel("journey-station-departure-decision", [() => {
  say(marlow, "Los cañones buscan la orilla. Tengo la cuerda del silbato junto a la mano. ¿Cómo gano espacio para salir?");
  if (!departureState().response) narration.choices = [
    newChoiceOption("Tocar el silbato ahora para apartar a la multitud", whistleFirst, {}),
    newChoiceOption("Intervenir primero ante los hombres armados", interveneFirst, {}),
  ];
}, close]);
export const departureCrew = newLabel("journey-station-departure-crew", [() => {
  warnCrew(); say(marlow, "Les ordeno bajar los rifles mientras maniobramos. Obedecen de mala gana. No he ganado su acuerdo, apenas un instante.");
}, () => say(deckhand, "Aproveche ese instante. El silbato está junto a la caseta."), close]);
export const departureWhistle = newLabel("journey-station-departure-whistle", [() => {
  useWhistle(); say(marlow, "Tiro de la cuerda. La multitud se repliega ante el chillido del vapor. La mujer continúa con los brazos extendidos.");
}, close]);
export const departureHelm = newLabel("journey-station-departure-helm", [() => {
  startManoeuvre(); say(deckhand, "Máquina avante. Abrimos el giro, lejos de la orilla.");
}, close]);
export const departureClosing = newLabel("journey-station-departure-closing", [
  () => say(marlow, departureState().crewWarned ?
    "Mi orden les ganó unos segundos. Después oigo disparos detrás de mí; el humo no me deja saber qué ha ocurrido en la ribera." :
    "El silbato apartó a la gente. Después los hombres disparan desde cubierta; el humo me oculta la ribera."),
  () => say(kurtz, "Aún puedo verla…"),
  () => say(marlow, "La estación queda atrás. Kurtz sigue vivo junto a la abertura. Ya no puedo volver a mirar sin dejar de conducir."),
  () => { finishDepartureExchange(); close(); },
]);
export const departureAfter = newLabel("journey-station-departure-after", [() => say(marlow,
  "El giro está hecho. La estación se aleja; por ahora mantengo el vapor en la corriente y a Kurtz a bordo."), close]);
