import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, journeyDeckhand } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { breakdownState } from "../state/kurtzBreakdownState";
import { finalNightState } from "../state/kurtzFinalNightState";
import { beginAftermath, hearBurial, securePapers, chooseCareResponse, receiveHelp,
  finishCareExchange, collectWater, beginRest, finishRest, finishAftermath, aftermathState } from "../state/kurtzAftermathState";

const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const aftermathEntry = newLabel("journey-station-aftermath-entry", [async () => {
  if (beginAftermath()) await showJourneySpace();
  say(marlow, "La mañana apenas distingue la orilla. Kurtz ya no está. Los hombres vuelven al vapor; me acerco a la barandilla para escucharlos.");
}, close]);
export const aftermathBurial = newLabel("journey-station-aftermath-burial", [() => {
  hearBurial(); say(marlow, "Han enterrado a Kurtz en un hoyo de barro. No veo la tumba desde aquí. El vapor se aleja y no queda ninguna voz en la caseta.");
}, () => say(marlow, finalNightState().response === "reassure" ?
  "Anoche le dije que yo seguía allí. Esta mañana no consigo apartarme de aquellas palabras." :
  "Anoche me quedé en silencio a su lado. Ahora ese silencio ocupa toda la caseta."), close]);
export const aftermathPapers = newLabel("journey-station-aftermath-papers", [() => {
  securePapers(); say(marlow, breakdownState().papersResponse === "ask" ?
    "Resguardo los papeles y la fotografía. Su rostro sigue mirando desde un mundo que parece muy lejos. La cubierta se vuelve inestable bajo mis pies." :
    "Resguardo el paquete sin desatar su cordón. Sigue bajo mi cuidado. La cubierta se vuelve inestable bajo mis pies.");
}, close]);
const help = newLabel("journey-station-aftermath-help", [() => {
  chooseCareResponse("help"); say(marlow, "Necesito ayuda. Me cuesta admitirlo, pero llamo al marinero sin soltar los papeles.");
}, () => {
  receiveHelp(); say(journeyDeckhand, "Tome agua. La caseta queda a resguardo. Yo me encargo de la cubierta; conserve sus papeles.");
}]);
const alone = newLabel("journey-station-aftermath-alone", [() => {
  chooseCareResponse("alone"); say(marlow, "No suelto el paquete. Intentaré llegar a la caseta por mi cuenta. El agua está allí, a la izquierda.");
}, () => say(journeyDeckhand, "No se quede junto al borde. Si cambia de idea, estoy aquí.")]);
export const aftermathCare = newLabel("journey-station-aftermath-care", [() => {
  say(marlow, "Me agarro a la barandilla. El ruido de la máquina llega desde muy lejos, aunque está debajo de mí. El marinero advierte que algo va mal.");
}, () => {
  say(journeyDeckhand, "Está pálido. ¿Le acerco agua y le ayudo a resguardarse?");
  if (!aftermathState().response) narration.choices = [
    newChoiceOption("Aceptar la ayuda del marinero", help, {}),
    newChoiceOption("Llegar a la caseta por tu cuenta", alone, {}),
  ];
}, () => { finishCareExchange(); close(); }]);
export const aftermathWater = newLabel("journey-station-aftermath-water", [() => {
  collectWater(); say(marlow, "Llego al agua junto a la caseta. Bebo despacio. Los papeles siguen resguardados, pero necesito dejar de exigirle al cuerpo otro paso.");
}, close]);
export const aftermathRest = newLabel("journey-station-aftermath-rest", [() => {
  beginRest(); say(marlow, "Me resguardo junto a la caseta. Los días se deshacen en un gris sin contornos. No hay victoria ni espectadores: apenas recuerdo el ruido del río.");
}, () => say(marlow, "También yo estuve cerca de no volver. No encuentro una frase que juzgue mi vida. Lo que vuelve es el soplo de Kurtz, no una respuesta mía."),
() => { finishRest(); close(); }]);
export const aftermathRecovery = newLabel("journey-station-aftermath-recovery", [() => {
  say(marlow, aftermathState().response === "help" ?
    "Puedo mirar de nuevo la corriente. Recuerdo la mano del marinero y el agua; haber aceptado ayuda no deshizo lo que escuché." :
    "Puedo mirar de nuevo la corriente. Alcancé la caseta sin ayuda, pero no escapé por eso de aquella noche.");
}, () => say(marlow, finalNightState().response === "reassure" ?
  "Le prometí seguir aquí. Ahora sigo, con sus papeles y unas palabras que no sé dónde guardar." :
  "Elegí acompañarlo en silencio. Su grito vuelve precisamente cuando ya no queda nadie a quien responder."),
() => { finishAftermath(); close(); }]);
export const aftermathRiver = newLabel("journey-station-aftermath-river", [() => say(marlow,
  "Las orillas se desplazan. El río conserva su profundidad mientras mis recuerdos pierden la suya."), close]);
