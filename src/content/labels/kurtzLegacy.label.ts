import { CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { europeState } from "../state/europeReturnState";
import { legacyState, beginLegacy, chooseCousinResponse, finishCousinExchange, collectFamilyLetters,
  deliverFamilyLetters, chooseJournalistResponse, finishJournalistExchange, collectLegacyReport,
  deliverLegacyReport, finishLegacy } from "../state/kurtzLegacyState";

const cousin = new CharacterBaseModel("kurtz-cousin", { name: "Primo de Kurtz", color: "#c2b799" });
const journalist = new CharacterBaseModel("kurtz-journalist", { name: "Periodista", color: "#b8bfae" });
RegisteredCharacters.add(cousin); RegisteredCharacters.add(journalist);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };

export const legacyEntry = newLabel("journey-station-legacy-entry", [async () => {
  if (beginLegacy()) await showJourneySpace();
  say(marlow, "Dos días después, un primo de Kurtz llama a mi puerta. Tras la reclamación de la Compañía, llegan otros dueños de su recuerdo. Los papeles siguen sobre la mesa.");
}, close]);
const musicReply = newLabel("journey-station-legacy-music", [() => {
  chooseCousinResponse("music"); say(marlow, "Era un hombre de muchos talentos. Usted conoció su música; yo conocí otra parte de su vida.");
}, () => say(cousin, "Un genio universal, sí. Pudo haber alcanzado un éxito inmenso. Quisiera conservar algunas cartas de la familia.")]);
const witnessReply = newLabel("journey-station-legacy-witness", [() => {
  chooseCousinResponse("witness"); say(marlow, "Estuve con él al final. Hablar de sus talentos no alcanza para contar lo que vi; tampoco puedo decirle qué oficio lo definía.");
}, () => say(cousin, "Me cuesta imaginar ese final. Yo lo recuerdo por su música. Déjeme, al menos, algunas cartas familiares.")]);
export const legacyCousin = newLabel("journey-station-legacy-cousin", [() => say(cousin,
  "Vengo por mi primo y por sus últimos momentos. Era, ante todo, un gran músico. ¿No le parece?"), () => {
  say(marlow, "Yo lo había creído pintor, o periodista. Cada visitante parece haber conocido a un Kurtz distinto.");
  if (!legacyState().cousinResponse) narration.choices = [
    newChoiceOption("Reconocer sus talentos", musicReply, {}),
    newChoiceOption("Hablar de sus últimos días", witnessReply, {}),
  ];
}, () => { finishCousinExchange(); close(); }]);
export const legacyCollectFamily = newLabel("journey-station-legacy-collect-family", [() => {
  collectFamilyLetters(); say(marlow, "Separo unas cartas familiares y notas sin importancia, en el centro de la mesa. La correspondencia de su prometida y la fotografía quedan a la derecha. Llevo sólo este primer grupo al primo.");
}, close]);
export const legacyGiveFamily = newLabel("journey-station-legacy-give-family", [() => say(cousin,
  "Gracias. Estas cartas irán con la familia. Aún me cuesta creer que una voz así se haya apagado."), () => say(marlow,
  legacyState().cousinResponse === "music" ?
    "Se marcha aferrado a la imagen del músico. Las cartas familiares salen de mis manos; no sale con ellas lo que vi. Más tarde, otro golpe en la puerta anuncia a un periodista." :
    "Escuchó mi dificultad para contar el final, pero se marcha con el músico que recuerda. Entrego sólo las cartas familiares. Más tarde llega un periodista."),
() => { deliverFamilyLetters(); close(); }]);
const partyReply = newLabel("journey-station-legacy-party", [() => {
  chooseJournalistResponse("party"); say(marlow, "¿De qué partido habría sido ese gran dirigente?");
}, () => say(journalist, "De cualquiera. Era un extremista; podía creerse cualquier cosa y hacer que una multitud la creyera. No escribía bien, pero cómo hablaba.")]);
const motiveReply = newLabel("journey-station-legacy-motive", [() => {
  chooseJournalistResponse("motive"); say(marlow, "Me pregunta qué lo llevó allí. Vi su impaciencia por poseer más, y algo peor que no cabe en una carrera prometedora.");
}, () => say(journalist, "Una lástima para la política. No escribía bien, pero electrizaba a las multitudes. Habría dirigido cualquier partido extremo. ¿Conserva algo suyo que podamos publicar?")]);
export const legacyJournalist = newLabel("journey-station-legacy-journalist", [() => say(journalist,
  "Busco noticias de mi querido colega. Su lugar era la política popular: cómo hablaba ese hombre. ¿Sabe qué lo hizo marcharse?"), () => {
  say(marlow, europeState().response === "private" ?
    "Defendí estas cartas como privadas. El primo buscaba al músico; éste reclama al orador. No entregaré el mismo recuerdo a todos." :
    "Discutí el valor comercial de los papeles. Ahora, después del músico que recordaba el primo, aparece el dirigente que recuerda el periodista.");
  if (!legacyState().journalistResponse) narration.choices = [
    newChoiceOption("Preguntar a qué partido habría pertenecido", partyReply, {}),
    newChoiceOption("Responder sobre lo que lo llevó allí", motiveReply, {}),
  ];
}, () => { finishJournalistExchange(); close(); }]);
export const legacyCollectReport = newLabel("journey-station-legacy-collect-report", [() => {
  collectLegacyReport(); say(marlow, "Recojo el informe que la Compañía rechazó, ya sin la posdata. Retirarla no vuelve inocente lo que permanece. Lo ofreceré para publicación, si el periodista lo considera oportuno.");
}, close]);
export const legacyGiveReport = newLabel("journey-station-legacy-give-report", [() => say(journalist,
  "Esto servirá. Lo examinaré para publicación."), () => say(marlow,
  legacyState().journalistResponse === "party" ?
    "Se lleva el informe. «Cualquier partido»: la frase sigue aquí, mientras cada uno se lleva la parte de Kurtz que le sirve. Queda un pequeño paquete de cartas y la fotografía." :
    "Se lleva el informe, no una explicación de todo lo sucedido. Mi respuesta sobre la ambición no detuvo su entusiasmo. Quedan las cartas y la fotografía de su prometida."),
() => { deliverLegacyReport(); close(); }]);
const remainingLine = () => {
  const s = legacyState();
  return `${s.cousinResponse === "music" ? "Al primo le reconocí sus talentos." : "Al primo le hablé como testigo del final."} ` +
    `${s.journalistResponse === "party" ? "Al periodista le pregunté por su partido: cualquiera." : "Al periodista le hablé de su deseo de poseer más."} ` +
    "Sólo quedan estas cartas y la fotografía. Deberé devolverlas personalmente a su prometida; todavía no salgo a buscarla.";
};
export const legacyRemaining = newLabel("journey-station-legacy-remaining", [() => say(marlow, remainingLine()),
  () => { finishLegacy(); close(); }]);
export const legacyMemory = newLabel("journey-station-legacy-memory", [() => say(marlow, remainingLine()), close]);
