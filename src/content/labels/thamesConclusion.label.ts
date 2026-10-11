import { CharacterBaseModel, RegisteredCharacters, narration, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { intendedState } from "../state/kurtzIntendedState";
import { beginThames, observeMooring, hearEbb, finishThames, thamesState } from "../state/thamesConclusionState";

const narrator = new CharacterBaseModel("thames-narrator", { name: "El narrador", color: "#b1c0bc" });
const director = new CharacterBaseModel("thames-director", { name: "El Director", color: "#a3ada4" });
RegisteredCharacters.add(narrator, director);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const thamesEntry = newLabel("journey-station-thames-entry", [async () => {
  if (beginThames()) await showJourneySpace();
  say(narrator, "El salón queda dentro del relato. Estamos otra vez a bordo de la Nellie, fondeada en el Támesis. El Director, el abogado y el contable escuchan a Marlow. La costa de enfrente apenas se distingue.");
}, () => say(marlow, intendedState().approach === "witness" ?
  "Quise ser testigo. Ante ella no pude repetir el juicio que había oído. Todo habría sido demasiado oscuro." :
  "Escuché su certeza y no pude decirle la verdad. Todo habría sido demasiado oscuro."), close]);
export const thamesMooring = newLabel("journey-station-thames-mooring", [() => {
  observeMooring(); say(narrator, "La amarra nos mantiene fondeados. El agua corre bajo nosotros hacia el mar: este río también ha llevado hombres a los extremos de la tierra. Seguimos escuchando sin mirar la marea.");
}, close]);
export const thamesEbb = newLabel("journey-station-thames-ebb", [() => say(narrator,
  "Marlow acaba de hablar y queda apartado, indistinto y silencioso. Durante un momento nadie se mueve. Desde el otro extremo de la cubierta, el Director rompe el silencio."),
() => say(director, "Hemos perdido el comienzo del reflujo."), () => { hearEbb(); close(); }]);
export const thamesHorizon = newLabel("journey-station-thames-horizon", [() => say(narrator, thamesState().mooringObserved ?
  "Levanto la cabeza. El agua que vi pasar junto a la amarra se extiende ahora hasta el horizonte, cerrado por un banco negro de nubes." :
  "Levanto la cabeza. El horizonte está cerrado por un banco negro de nubes. Bajo el cielo cubierto, el agua continúa pasando."),
() => say(narrator, "La tranquila vía de agua que conduce hasta los extremos de la tierra fluye sombría bajo el cielo cubierto. Parece adentrarse en el corazón de una inmensa oscuridad."),
() => { finishThames(); close(); }]);
export const thamesMemory = newLabel("journey-station-thames-memory", [() => say(narrator,
  "El relato ha terminado. La Nellie sigue fondeada; el río continúa hacia el mar. La oscuridad ya no pertenece solamente al viaje de Marlow."), close]);
