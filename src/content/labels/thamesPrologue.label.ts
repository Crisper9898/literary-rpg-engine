import { canvas, narration, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { setJourneySpace } from "../state/woodStopState";
import { beginPrologue, observeAnchorage, beginOpeningTale, finishOpeningTale, leavePrologue,
  prologueState } from "../state/thamesPrologueState";

// Reuse the frame narrator registered by thamesConclusion.label.ts; no second narrator identity.
const narrate = (text: string) => { narration.dialogue = { character: "thames-narrator", text }; };
const say = (text: string) => { narration.dialogue = { character: marlow, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const prologueStart = newLabel("journey-station-prologue-start", [async () => {
  // Stop old checkpoint writers synchronously, before awaiting scene modules after Game.start.
  for (const id of ["journey-deck", "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
    const previous = canvas.layers.get(id);
    if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
  }
  beginPrologue(); setJourneySpace("inner-station");
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  narrate("La Nellie está fondeada en el Támesis. Esperamos que cambie la marea. El Director, el abogado, el contable y yo compartimos el silencio con Marlow mientras cae la tarde.");
}, close]);
export const prologueAnchorage = newLabel("journey-station-prologue-anchorage", [() => {
  observeAnchorage(); narrate("La amarra sujeta el yate, pero el agua sigue pasando. Este río lleva barcos hacia el mar y devuelve otros a casa. Sobre Londres se acumula una sombra, río arriba.");
}, close]);
export const prologueTale = newLabel("journey-station-prologue-tale", [() => {
  beginOpeningTale(); say("También este lugar fue uno de los lugares oscuros de la tierra.");
}, () => say("Pienso en quienes llegaron aquí desde Roma: para ellos, este río era el fin del mundo. La conquista se sostiene con fuerza; no hay nada admirable en arrebatar una tierra a quienes la habitan."),
() => narrate(prologueState().anchorageObserved ?
  "El agua que escuchamos junto a la amarra continúa bajo el yate. La sombra ya no parece estar solamente sobre Londres. Nadie interrumpe a Marlow." :
  "El Támesis se oscurece frente a nosotros. La frase de Marlow cambia el silencio de la cubierta. Nadie lo interrumpe."),
() => say("Recordaréis que fui marinero de agua dulce durante un tiempo. Para entender lo que aquel viaje hizo conmigo, tendré que contaros cómo remonté ese otro río."),
() => { finishOpeningTale(); close(); }]);
export const prologueContinue = newLabel("journey-station-prologue-continue", [() => narrate(
  "El relato continúa en el vapor, río arriba. El encargo de la Compañía, el viaje costero y la Estación Exterior tienen entradas opcionales. Esta ruta aún salta la caravana y la Estación Central: esos episodios todavía no son jugables."),
async () => {
  close(); if (!leavePrologue()) return;
  setJourneySpace("deck"); const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
}]);
