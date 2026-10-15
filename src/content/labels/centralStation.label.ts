import { canvas, CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { setJourneySpace } from "../state/woodStopState";
import { beginCaravan, observeVillage, crossRavine, reachCamp, meetCompanion, chooseCompanionResponse,
  resumeCaravan, arriveCentralStation, hearWreckNews, inspectSunkenSteamer, finishCentralArrival, centralState } from "../state/centralStationState";

const agent = new CharacterBaseModel("central-arrival-agent", { name: "Agente de la Estación Central", color: "#c2b18c" });
RegisteredCharacters.add(agent);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };

export const centralStart = newLabel("journey-station-central-start", [async () => {
  // Stop old checkpoint writers synchronously after Game.start resets storage.
  for (const id of ["journey-deck", "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
    const previous = canvas.layers.get(id);
    if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
  }
  beginCaravan(); setJourneySpace("inner-station");
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  say(marlow, "Dejé la Estación Exterior con sesenta porteadores para una marcha de doscientas millas. Caminos de hierba y piedra cruzan el país. Puedo observar la aldea vacía a la izquierda antes de seguir hacia el barranco del centro.");
}, close]);

export const centralVillage = newLabel("journey-station-central-village", [() => {
  observeVillage(); say(marlow, "Quedan paredes de hierba y viviendas abandonadas. No es un país sin habitantes: quienes vivían aquí se apartaron de una ruta donde se obliga a otros a llevar cargas. Las ruinas no me dicen sus nombres.");
}, close]);

export const centralRavine = newLabel("journey-station-central-ravine", [() => {
  crossRavine(); say(marlow, "Bajamos por un barranco frío y volvemos a subir a una ladera abrasada. Detrás de mí, sesenta pares de pies cargan el peso de la Compañía. La ruta continúa hacia el campamento de la izquierda.");
}, close]);

export const centralCamp = newLabel("journey-station-central-camp", [() => {
  reachCamp(); say(marlow, centralState().villageObserved ?
    "Las paredes de hierba de la aldea vuelven a mi memoria. Acampamos, cocinamos, dormimos y levantamos el campamento. Cada jornada repite el esfuerzo; los lugares que atravesamos no están vacíos de historia." :
    "Campamento, comida, sueño; levantar el campamento y marchar otra vez. El ruido de los pasos llena el camino, pero no explica los lugares que atravesamos.");
}, () => say(marlow, "A veces queda un porteador muerto en la hierba, junto a una calabaza vacía y su bastón. No tomo esos objetos. En las laderas, mi compañero empieza a desmayarse por el calor."), close]);

const shade = newLabel("journey-station-central-shade", [() => {
  chooseCompanionResponse("shade"); say(marlow, "Sostengo la chaqueta sobre su cabeza hasta que vuelve en sí. Esa pequeña sombra no detiene la fiebre ni aligera las cargas que siguen camino.");
}]);
const load = newLabel("journey-station-central-load", [() => {
  chooseCompanionResponse("load"); say(marlow, "Miro la distribución de la carga: el peso no desaparece al ordenar que lo lleven. La marcha descansa sobre cuerpos cansados; mi compañero tampoco puede seguir por sus propios pies.");
}]);
export const centralCompanion = newLabel("journey-station-central-companion", [() => {
  meetCompanion(); say(marlow, "Mi compañero vuelve a caer bajo el sol. Le pregunté por qué había venido: a ganar dinero. Ahora su respiración ocupa todo el descanso junto al camino.");
}, () => {
  say(marlow, "Puedo darle sombra o detenerme a observar el trabajo de quienes soportan esta marcha. Ninguna atención promete curarlo.");
  if (!centralState().companionResponse) narration.choices = [
    newChoiceOption("Resguardarlo del sol", shade, {}), newChoiceOption("Observar cómo reparten la carga", load, {}),
  ];
}, () => say(marlow, "Después la fiebre obliga a llevarlo en una hamaca. La encuentro caída en un matorral; él exige castigo, pero los porteadores ya no están. Recuerdo al médico y su interés por nuestros cambios mentales. Seguimos hasta el río."),
() => { resumeCaravan(); close(); }]);

export const centralArrival = newLabel("journey-station-central-arrival", [async () => {
  if (!arriveCentralStation()) return;
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  say(marlow, "Al decimoquinto día vuelvo a ver el gran río. Entro cojeando en la Estación Central: un remanso, barro y una cerca vencida de juncos. Un agente sale de entre los edificios al reconocerme.");
}, close]);
export const centralNews = newLabel("journey-station-central-news", [() => {
  hearWreckNews(); say(agent, "¿Usted es el capitán? Su vapor está en el fondo del río. Todo está en orden; todos se comportaron magníficamente. Debe ver al gerente: le está esperando.");
}, () => say(marlow, "Un hombre de bigotes negros me transmite la noticia con muchas explicaciones. He caminado hasta aquí para mandar ese barco. Antes de aceptar que todo está en orden, me acerco al casco hundido, a la izquierda."), close]);
export const centralWreck = newLabel("journey-station-central-wreck", [() => say(marlow,
  "Habían salido dos días antes, con el gerente a bordo y un capitán voluntario. En menos de tres horas golpearon unas piedras y abrieron el fondo. Ahora asoma el casco junto a la orilla; todavía no sé qué significa aquel apresuramiento."),
() => say(marlow, centralState().companionResponse === "shade" ?
  "Recuerdo la sombra de mi chaqueta: una atención breve no detuvo la fiebre. La noticia del naufragio tampoco se arregla con palabras tranquilizadoras. Debo mirar el daño antes de prometer nada." :
  "Recuerdo el peso de la hamaca y los hombres que tuvieron que cargarla. Al mirar este hierro hundido, pienso en quién hará el trabajo que otros llaman un simple contratiempo."),
() => { inspectSunkenSteamer(); close(); }]);
export const centralContinue = newLabel("journey-station-central-continue", [() => say(marlow,
  "Termina la llegada y la inspección del vapor hundido. La entrevista con el gerente, el rescate y las reparaciones todavía no son jugables. Esta entrada hace una elipsis hasta el viaje río arriba; no afirma que esos meses de trabajo hayan sido representados."),
async () => {
  close(); if (!finishCentralArrival()) return;
  setJourneySpace("deck"); const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
}]);
