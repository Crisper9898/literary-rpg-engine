import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, kurtz, journeyDeckhand as deckhand } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { departureState } from "../state/kurtzDepartureState";
import { discoveries } from "../state/stationRevelationsState";
import { beginBreakdown, hearBreakdown, examineEngine, startForge, fitRod, choosePapersResponse,
  finishPapersExchange, resumeDownstream, finishBreakdownExchange, breakdownState } from "../state/kurtzBreakdownState";
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const breakdownEntry = newLabel("journey-station-breakdown-entry", [async () => {
  if (beginBreakdown()) await showJourneySpace();
  say(marlow, departureState().crewWarned ?
    "Río abajo. Los hombres aún me miran con rencor; mi orden no borró los disparos. La corriente nos lleva deprisa, pero la máquina golpea mal." :
    "Río abajo. Los disparos quedaron detrás, no fuera de mi memoria. La corriente nos lleva deprisa; bajo mis pies, la máquina golpea mal.");
}, close]);
export const breakdownFailure = newLabel("journey-station-breakdown-failure", [() => {
  hearBreakdown(); say(deckhand, "Se acabó el golpe de la máquina. Nos amarramos a la cabeza de esta isla. Venga al registro: algo pierde vapor.");
}, () => say(kurtz, "Otra demora… No podemos quedarnos aquí."), close]);
export const breakdownEngine = newLabel("journey-station-breakdown-engine", [() => {
  examineEngine(); say(marlow, "Los cilindros pierden; la biela está torcida. Ayudo a desmontarla. La pequeña fragua, a la derecha, puede devolverle su forma.");
}, () => say(deckhand, "Yo limpio los cilindros. Avive el carbón y mantenga la pieza al calor; después tráigala de vuelta al registro."), close]);
export const breakdownForge = newLabel("journey-station-breakdown-forge", [() => {
  startForge(); say(marlow, "Avivo la fragua. Me quedo cerca para girar la pieza y sostener el calor. Si me aparto, la reparación espera; Kurtz está junto a la caseta.");
}, close]);
export const breakdownFit = newLabel("journey-station-breakdown-fit", [() => {
  fitRod(); say(deckhand, "La biela vuelve a su sitio. Hemos cerrado la pérdida del cilindro. La máquina está lista; aún no he dado vapor.");
}, close]);
const sealed = newLabel("journey-station-breakdown-papers-sealed", [() => {
  choosePapersResponse("sealed"); say(marlow, "Lo guardaré tal como me lo entrega. No abriré el cordón ni lo dejaré entre las cajas que revisa el gerente.");
}, () => say(kurtz, "Que no meta las manos ahí. Guárdelo usted.")]);
const ask = newLabel("journey-station-breakdown-papers-ask", [() => {
  choosePapersResponse("ask"); say(marlow, "Guardaré el paquete. Antes de apartarlo: ¿de quién es la fotografía que ha puesto entre las hojas?");
}, () => say(kurtz, "De mi prometida. Ella cree en mis ideas. No permita que ese hombre revuelva estas cosas.")]);
export const breakdownPapers = newLabel("journey-station-breakdown-papers", [() => {
  say(kurtz, "Tome estos papeles y la fotografía. El gerente sería capaz de hurgar en mis cajas mientras no miro. Guárdelos por mí.");
}, () => {
  say(marlow, discoveries().includes("report") ?
    "Ya leí su informe en la estación. Ahora el cordón ata esas ideas a una fotografía privada. Me pide proteger algo que no comprendo del todo." :
    "Un cordón de zapato ata las hojas y una fotografía. La voz todavía exige confianza; el cuerpo apenas puede sostener el paquete.");
  if (!breakdownState().papersResponse) narration.choices = [
    newChoiceOption("Guardar el paquete sin abrirlo", sealed, {}),
    newChoiceOption("Preguntar por la fotografía antes de guardarlo", ask, {}),
  ];
}, () => { finishPapersExchange(); close(); }]);
export const breakdownPatientAfter = newLabel("journey-station-breakdown-patient-after", [() => say(kurtz,
  breakdownState().papersResponse === "ask" ? "Ella espera mi regreso. Usted conserva la fotografía; no se la deje al gerente." :
    "El cordón sigue atado, ¿verdad? Que mis papeles no queden con la carga."), close]);
export const breakdownResume = newLabel("journey-station-breakdown-resume", [() => {
  resumeDownstream(); say(deckhand, "Probamos la máquina. La amarra está dentro; volvemos a tomar la corriente.");
}, () => say(marlow, breakdownState().papersResponse === "ask" ?
  "La isla empieza a alejarse. Llevo las hojas y el rostro de alguien que espera en Europa. Kurtz sigue vivo; la reparación no le devuelve fuerzas." :
  "La isla empieza a alejarse. El cordón sigue intacto bajo mi chaqueta. Kurtz sigue vivo; arreglar la máquina no ha detenido su deterioro."),
() => { finishBreakdownExchange(); close(); }]);
export const breakdownAfter = newLabel("journey-station-breakdown-after", [() => say(marlow,
  "Sostengo el rumbo río abajo. La máquina vuelve a golpear; los papeles siguen conmigo y Kurtz continúa en la caseta."), close]);
