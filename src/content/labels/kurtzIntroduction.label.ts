import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, russianTrader, kurtz } from "../characters";
import { beginKurtzIntroduction, chooseKurtzResponse, kurtzFirstResponse, observeKurtz, setKurtzPose } from "../state/kurtzIntroductionState";
import { russianStance, russianTopics, stationObservations, setRussianMood, markStation } from "../state/innerStationState";
import { seamanshipBookRead, approachDecision } from "../state/woodStopState";
import { approachCheckpoint } from "../state/approachState";
import { kurtzNearby } from "../../story/heart-of-darkness/kurtzIntroduction";
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
export const kurtzPreparation = newLabel("journey-station-kurtz-preparation", [
  () => { setRussianMood("nervous"); say(russianTrader, russianStance() === "question" ?
    "No le pido que me crea. Kurtz está aquí. Mire el sendero: vienen a traerlo. No es el hombre que usted imagina." :
    "Me escuchó hablar de él; ahora escúcheme un momento más. Kurtz está aquí. Lo están trayendo. Apenas puede sostenerse."); },
  () => say(russianTrader, seamanshipBookRead() ?
    "Usted reconoció mi libro. Aquellas páginas me daban algo firme. Ante él… hasta lo firme parece moverse." :
    russianTopics()[0] === "station" ? "Primero quiso entender la estación. Ahora verá por qué todos los senderos terminan en el mismo hombre." :
      "Preguntó primero por su nombre. No deje que el nombre le impida ver al hombre."),
  () => { say(marlow, stationObservations().includes("grass") ?
    "Las huellas vuelven hacia la casa. Ahora oigo pasos lentos dentro de aquella quietud. Espero, sin apartar la vista del sendero." :
    "El río sigue detrás de mí. Frente a la casa, nadie se mueve. Espero; quiero ver qué rompe esa quietud."); },
  () => { beginKurtzIntroduction(); close(); },
]);
const listen = newLabel("journey-station-kurtz-listen", [() => {
  chooseKurtzResponse("listen"); say(kurtz, "Usted sabe escuchar. Los otros sólo oyen lo que esperan. Acérquese; no necesito que hable por mí.");
}]);
const challenge = newLabel("journey-station-kurtz-challenge", [() => {
  chooseKurtzResponse("challenge"); say(kurtz, "¿Lo que ocurre aquí? No ha llegado al final de una explicación, capitán. Apenas ha llegado hasta mí.");
}]);
export const kurtzFirstExchange = newLabel("journey-station-kurtz-first", [
  () => { setKurtzPose("weak"); say(kurtz, "Así que usted es Marlow. Ha venido hasta aquí. Estoy… satisfecho."); },
  () => { setKurtzPose("intense"); say(marlow, "Su cuerpo apenas sostiene esa voz. Me mira como si mi llegada formara parte de algo decidido mucho antes.");
    narration.choices = [newChoiceOption("Dejarlo hablar: «Lo escucho»", listen, {}),
      newChoiceOption("Preguntar: «¿Qué ocurre en esta estación?»", challenge, {})]; },
  () => { setRussianMood(kurtzFirstResponse() === "challenge" ? "nervous" : "fervent"); say(russianTrader,
    kurtzFirstResponse() === "challenge" ? "Por favor… no ahora. Ha reunido sus fuerzas para salir. Pero sé que usted no olvidará esa pregunta." :
      "¿Lo oye? Aun así… aun así consigue que uno se quede. Yo no sabía cómo decírselo."); },
  () => { setKurtzPose("coughing"); say(marlow, approachCheckpoint.read()?.whistle ?
    "Nuestro silbato rompió el ataque. Su mano acaba de detener a todos. Pero la tos corta su voz; comprender esta estación exigirá mirar más allá de él." : approachDecision() === "proceed" ?
    "En la niebla insistí en avanzar. Ahora lo tengo delante y no encuentro prisa en mí. Su tos atraviesa el silencio que él mismo impuso." :
    "Esperé para entrar en la niebla. Vuelvo a esperar: una tos interrumpe aquella voz. Nadie parece saber qué hacer con su debilidad."); },
  () => { setKurtzPose("weak"); markStation("kurtzIntroductionComplete"); close(); },
]);
export const kurtzFollowup = newLabel("journey-station-kurtz-again", [
  () => { setKurtzPose(kurtzFirstResponse() === "challenge" ? "commanding" : "intense"); say(kurtz,
    kurtzFirstResponse() === "challenge" ? "Conserva su pregunta. Bien. No la cambie por la respuesta de otro." : "Sigue ahí, escuchando. Hay cosas que todavía no he dicho."); },
  () => { setKurtzPose("weak"); close(); },
]);
export const kurtzRussianAfter = newLabel("journey-station-kurtz-russian-after", [
  () => { setRussianMood(russianStance() === "question" ? "nervous" : "fervent"); say(russianTrader,
    russianStance() === "question" ? "Antes dudaba de mi fe. Ahora ha visto lo que yo veo: un hombre que apenas respira… y una mano que detiene a todos." :
      "Antes me dejó hablar de él. Ahora ha oído su voz. ¿Cómo iba yo a explicarle ese contraste?"); },
  () => say(russianTrader, kurtzFirstResponse() === "challenge" ? "Su pregunta lo hizo incorporarse. Yo habría bajado la mirada. Usted no lo hizo." :
    "No lo interrumpió. Él lo notó. Aquí la atención pesa más que las palabras."), close,
]);
export const kurtzInspectLabels = Object.fromEntries(Object.entries(kurtzNearby).map(([id, item]) =>
  [id, newLabel(`journey-station-kurtz-observe-${id}`, [() => { observeKurtz(id); say(marlow, item.text); }, close])]));
