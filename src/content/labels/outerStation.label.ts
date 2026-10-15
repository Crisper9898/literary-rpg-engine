import { canvas, CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { setJourneySpace } from "../state/woodStopState";
import { beginOuterVoyage, observeSurf, witnessWarship, landAtOuterStation, inspectOuterWorks,
  enterOuterGrove, chooseGroveResponse, leaveOuterGrove, hearAccountant, finishOuterStation, outerState } from "../state/outerStationState";

const captain = new CharacterBaseModel("outer-station-captain", { name: "Capitán del pequeño vapor", color: "#adbca9" });
const accountant = new CharacterBaseModel("outer-station-accountant", { name: "Contable de la Compañía", color: "#d3c7a2" });
RegisteredCharacters.add(captain, accountant);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const outerStart = newLabel("journey-station-outer-start", [async () => {
  for (const id of ["journey-deck", "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
    const previous = canvas.layers.get(id);
    if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
  }
  beginOuterVoyage(); setJourneySpace("inner-station");
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  say(marlow, "Partí en un vapor francés. La costa desfilaba tras una rompiente blanca; desembarcábamos soldados y funcionarios. Puedo escuchar el mar a la izquierda y observar el buque fondeado antes de seguir hasta la estación.");
}, close]);
export const outerSurf = newLabel("journey-station-outer-surf", [() => {
  observeSurf(); say(marlow, "La rompiente tiene un ritmo que entiendo. Una canoa pasa con hombres remando y cantando: trabajo y movimiento, algo real frente a nuestra interminable sucesión de puestos y banderas.");
}, close]);
export const outerWarship = newLabel("journey-station-outer-warship", [() => {
  witnessWarship(); say(marlow, "Un buque de guerra francés dispara contra la vegetación. Un fogonazo, un poco de humo; la costa permanece igual. Desde aquí no veo a quién dispara.");
}, () => say(marlow, "Alguien asegura que hay un campamento enemigo escondido. Esa explicación no vuelve sensato el cañón. Seguimos: más de treinta días de escalas antes de la desembocadura, y después otro vapor pequeño hasta la Compañía."), close]);
export const outerLanding = newLabel("journey-station-outer-landing", [() => say(captain,
  "Ahí tiene la estación de su Compañía, en la ladera. Le subiré las cuatro cajas. No esté tan seguro de lo que encontrará tierra adentro. Adiós."),
async () => {
  if (!landAtOuterStation()) return;
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  say(marlow, "El capitán sueco me deja en el embarcadero. Sobre los rápidos suben edificios de tablas y excavaciones. Hay maquinaria abandonada junto al camino; a la izquierda, unos árboles ofrecen sombra.");
}, close]);
export const outerWorks = newLabel("journey-station-outer-works", [() => {
  inspectOuterWorks(); say(marlow, "Una caldera yace en la hierba, junto a raíles oxidados y un vagón volcado. Hacen estallar una roca que no estorba el camino. Mucho estruendo; no encuentro la utilidad.");
}, () => say(marlow, "Detrás de mí pasan seis hombres cargados de tierra, unidos por una cadena al cuello. Un guardia los sigue. Los llaman criminales; no veo enemigos. La detonación me devuelve al cañón de la costa."),
() => say(marlow, outerState().surfObserved ?
  "Recuerdo a los remeros de la rompiente: allí el esfuerzo movía una canoa. Aquí cada paso tiene el sonido del hierro. Me aparto hacia la sombra." :
  "Dejo pasar la fila y me aparto hacia la sombra. Bajo los árboles hay personas que apenas se mueven."), close]);
const give = newLabel("journey-station-outer-give", [() => {
  chooseGroveResponse("give"); say(marlow, "Ofrezco una galleta del barco. Los dedos se cierran lentamente; no hay otro gesto. Un hilo blanco rodea su cuello. No sé qué significa y no puedo hablar por él.");
}]);
const stay = newLabel("journey-station-outer-stay", [() => {
  chooseGroveResponse("stay"); say(marlow, "Me quedo un momento a su lado. No encuentro palabras. El ruido de los rápidos continúa mientras los trabajadores, enfermos y hambrientos, permanecen bajo los árboles.");
}]);
export const outerGrove = newLabel("journey-station-outer-grove", [() => {
  enterOuterGrove(); say(marlow, "No es un lugar de descanso: han traído a estos hombres desde la costa para trabajar; enfermos y sin alimento suficiente, los dejaron retirarse aquí. Uno de ellos levanta los ojos junto al tronco.");
}, () => {
  say(marlow, "Tengo una galleta del vapor en el bolsillo. Ningún gesto mío deshace lo que veo.");
  if (!outerState().groveResponse) narration.choices = [
    newChoiceOption("Ofrecer la galleta", give, {}), newChoiceOption("Quedarme un momento a su lado", stay, {}),
  ];
}, () => say(marlow, "Sigo hacia la oficina. La sombra queda detrás de mí; el trabajo de la estación continúa. No he resuelto nada."),
() => { leaveOuterGrove(); close(); }]);
export const outerAccountant = newLabel("journey-station-outer-accountant", [() => say(marlow,
  "El contable lleva cuello almidonado y puños impecables. Por las juntas de las tablas entra la luz. Un agente enfermo yace en la oficina; el contable dice que sus gemidos le distraen de las cuentas."),
() => say(accountant, "En el interior conocerá al señor Kurtz. Un agente de primera clase; una persona notable. Envía tanto marfil como los demás juntos. Dígale que aquí todo está muy satisfactorio."),
() => say(marlow, outerState().groveResponse === "give" ?
  "Kurtz: oigo su nombre por primera vez. Pienso en los dedos cerrados sobre la galleta. A unos pasos de la arboleda, los libros registran transacciones perfectamente correctas." :
  "Kurtz: oigo su nombre por primera vez. Pienso en aquel momento sin palabras bajo los árboles. A unos pasos de la arboleda, los libros registran transacciones perfectamente correctas."),
() => { hearAccountant(); close(); }]);
export const outerContinue = newLabel("journey-station-outer-continue", [() => say(marlow,
  "Termina mi espera en la Estación Exterior. La caravana y la llegada a la Estación Central están disponibles en su entrada opcional. Esta entrada hace una elipsis hasta el vapor río arriba; no representa aquella marcha ni el naufragio previo."),
async () => {
  close(); if (!finishOuterStation()) return;
  setJourneySpace("deck"); const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
}]);
