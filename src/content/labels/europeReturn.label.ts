import { CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { aftermathState } from "../state/kurtzAftermathState";
import { breakdownState } from "../state/kurtzBreakdownState";
import { beginEurope, observeStreet, openPacket, readReport, readLetters, prepareReport,
  chooseCompanyResponse, finishCompanyExchange, collectReport, offerReport, finishEurope, europeState } from "../state/europeReturnState";

const official = new CharacterBaseModel("company-papers-official", { name: "Funcionario de la Compañía", color: "#bdb6a4" });
RegisteredCharacters.add(official);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const europeEntry = newLabel("journey-station-europe-entry", [async () => {
  if (beginEurope()) await showJourneySpace();
  say(marlow, "Vuelvo a la ciudad europea. Camino todavía débil; mi tía intenta devolverme las fuerzas. El paquete de Kurtz permanece conmigo, sobre la mesa.");
}, () => say(marlow, aftermathState().response === "help" ?
  "Recuerdo el agua y la mano del marinero. Aquí todos parecen estar a salvo; yo no consigo dejar atrás la caseta." :
  "Llegué al agua por mi cuenta. Aquí mi tía insiste en cuidarme, pero no es sólo el cuerpo lo que necesita reposo."), close]);
export const europeWindow = newLabel("journey-station-europe-window", [() => {
  observeStreet(); say(marlow, "Tras el vidrio, la gente corre tras sus pequeños negocios. Me irrita su seguridad. Estoy convaleciente; mi desprecio tampoco es una verdad sobre ellos.");
}, close]);
export const europePacket = newLabel("journey-station-europe-packet", [() => {
  openPacket(); say(marlow, breakdownState().papersResponse === "sealed" ?
    "Desato por fin el cordón que conservé cerrado. Separaré el informe público de las cartas y la fotografía; no todo pertenece al mismo destinatario." :
    "Abro el paquete que Kurtz me confió. La fotografía sigue entre las cartas. El informe ocupa otro lado de la mesa; debo distinguirlos antes de responder por ellos.");
}, close]);
export const europeReport = newLabel("journey-station-europe-report", [() => {
  readReport(); say(marlow, "El informe promete elevar a otros pueblos. Su posdata exige exterminarlos. Esa contradicción sigue aquí, escrita por la misma mano; no es información comercial.");
}, close]);
export const europeLetters = newLabel("journey-station-europe-letters", [() => {
  readLetters(); say(marlow, "Estas cartas y la fotografía son privadas. Su madre ha muerto; las conservaré mientras averiguo a quién devolverlas. El informe no me autoriza a entregar todo el paquete.");
}, close]);
export const europePrepare = newLabel("journey-station-europe-prepare", [() => {
  prepareReport(); say(marlow, "Separo la posdata del informe. No borro lo que ocurrió: decido qué texto ofrecer. Las cartas y la fotografía quedan bajo mi custodia. Un funcionario aguarda junto a la puerta.");
}, close]);
const privateReply = newLabel("journey-station-europe-private", [() => {
  chooseCompanyResponse("private"); say(marlow, "Las cartas son privadas. Kurtz las dejó a mi cuidado. No entregaré el paquete entero.");
}, () => say(official, "La Compañía tiene derecho a lo que se sepa de sus territorios. No basta con que usted lo llame privado.")]);
const commerceReply = newLabel("journey-station-europe-commerce", [() => {
  chooseCompanyResponse("commerce"); say(marlow, "Lo que Kurtz sabía no resolverá sus cuentas ni la administración de sus territorios. El paquete no es un balance comercial.");
}, () => say(official, "Entonces piense en la ciencia. Sería una pérdida que esos conocimientos quedaran ocultos.")]);
export const europeCompany = newLabel("journey-station-europe-company", [() => say(official,
  europeState().streetObserved ? "Mientras la ciudad continúa sus negocios, tenemos asuntos pendientes. Vengo por los documentos de Kurtz: la Compañía reclama esa información." :
    "Vengo por ciertos documentos de Kurtz. Sus conocimientos de nuestros territorios pertenecen a la Compañía. Entregue el paquete."),
() => {
  say(marlow, "Las gafas doradas no dejan de mirar la mesa. No cedo las cartas. Debo responder antes de recoger el informe que he preparado.");
  if (!europeState().response) narration.choices = [
    newChoiceOption("Defender el carácter privado de las cartas", privateReply, {}),
    newChoiceOption("Cuestionar el valor comercial de los papeles", commerceReply, {}),
  ];
}, () => { finishCompanyExchange(); close(); }]);
export const europeCollect = newLabel("journey-station-europe-collect", [() => {
  collectReport(); say(marlow, "Recojo sólo el informe, sin su posdata. Las cartas y la fotografía permanecen sobre la mesa. Regreso a la puerta con este único texto.");
}, close]);
export const europeOffer = newLabel("journey-station-europe-offer", [() => {
  offerReport(); say(official, "¿Sólo este informe? No es lo que teníamos derecho a esperar.");
}, () => say(marlow, europeState().response === "private" ?
  "No espere nada más. Las cartas siguen siendo privadas. Deja el informe y se retira amenazando con acciones legales." :
  "La invocación de la ciencia termina donde empieza su desprecio por el informe. No entrego nada más. Lo deja y se retira amenazando con acciones legales."),
() => { finishEurope(); close(); }]);
export const europeMemory = newLabel("journey-station-europe-memory", [() => say(marlow,
  "La Compañía ya no está en la puerta. Las cartas, la fotografía y el informe siguen conmigo. La ciudad no ha hecho callar aquella voz."), close]);
