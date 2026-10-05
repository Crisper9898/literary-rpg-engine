import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, kurtz } from "../characters";
import { beginNight, nightState, observeAbsence, followTrace, enterNightClearing, meetNightKurtz,
  setNightPose, chooseNightResponse, beginNightReturn, finishNightReturn, finishNightEpilogue } from "../state/kurtzNightEscapeState";
import { interpretation } from "../state/stationRevelationsState";
import { russianStance } from "../state/innerStationState";
import { kurtzFirstResponse } from "../state/kurtzIntroductionState";
import { nightTracePoints } from "../../story/heart-of-darkness/kurtzNightEscape";
import { showJourneySpace } from "../scenes/journeyDeck";
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const nightfall = newLabel("journey-station-night-fall", [async () => {
  if (beginNight()) await showJourneySpace();
  say(marlow, "Me quedo de guardia. Las voces se alejan; la estación pierde su última luz.");
}, close]);
export const nightAbsence = newLabel("journey-station-night-absence", [() => {
  observeAbsence(); say(marlow, "La manta conserva el hueco de su cuerpo. Kurtz no está. No voy a despertar a la estación.");
}, close]);
export const nightTraceLabels = Object.fromEntries(Object.entries(nightTracePoints).map(([id, item]) => [id,
  newLabel(`journey-station-night-trace-${id}`, [() => { followTrace(id as keyof typeof nightTracePoints); say(marlow, item.text); }, close]),
])) as Record<keyof typeof nightTracePoints, ReturnType<typeof newLabel>>;
export const nightEnterClearing = newLabel("journey-station-night-enter", [() => {
  enterNightClearing(); say(marlow, "Cruzo despacio. No estoy solo entre estos árboles.");
}, close]);
const reason = newLabel("journey-station-night-reason", [() => {
  chooseNightResponse("reason"); say(marlow, "Sus planes no pueden continuar si se queda aquí. Vuelva conmigo; mañana podrá hablar de ellos.");
}]);
const challenge = newLabel("journey-station-night-challenge", [() => {
  chooseNightResponse("challenge"); say(marlow, "Que lo escuchen no significa que pueda sostenerse. No llamaré a nadie. Esta noche vuelve conmigo.");
}]);
export const nightConfrontation = newLabel("journey-station-night-confrontation", [
  () => { meetNightKurtz(); setNightPose("bracing"); say(marlow, interpretation() === "brutality" ?
    "La mano que vi mandar apenas logra levantarlo. Detrás de esa debilidad, las figuras siguen esperando una orden." :
    "Lo encuentro al borde de las luces. Apenas puede incorporarse; todos esperan como si su cuerpo no importara."); },
  () => { setNightPose("dominant"); say(kurtz, kurtzFirstResponse() === "challenge" ?
    "Otra vez usted. ¿También aquí viene a preguntarme por qué? Apártese." : "Váyase. Escuche: todavía me esperan. Tenía planes inmensos."); },
  () => { say(marlow, "Si levanta la voz, las figuras saldrán de los árboles. Tengo que traerlo de vuelta sin recurrir a ellas.");
    if (!nightState().choice) narration.choices = [newChoiceOption("Razonar: hacerle pensar en el regreso", reason, {}),
      newChoiceOption("Desafiar: poner un límite a su autoridad", challenge, {})]; },
  () => say(kurtz, nightState().choice === "reason" ? "¿Mañana? Habla de mis planes como si todavía hubiera tiempo… No me quite eso." :
    "¿Usted me pone un límite? Podría hacer que lo apartaran. No confunda este cuerpo con mi voz."),
  () => { setNightPose("exhausted"); say(marlow, nightState().choice === "reason" ?
    "Le ofrezco un brazo. Ha escuchado la promesa del regreso; no sé si ha escuchado algo más." :
    "No retrocedo ni alzo la voz. Su rodilla cede; le ofrezco un brazo antes de que caiga."); },
  () => { beginNightReturn(); close(); },
]);
export const nightReturn = newLabel("journey-station-night-return", [() => {
  finishNightReturn(); say(marlow, "Bajamos juntos. Su peso es mínimo; la mano que se aferra a mi brazo no lo es.");
}, () => say(kurtz, nightState().choice === "reason" ? "Ha sabido hablarme de mañana. Qué prudente es usted, Marlow." :
  "Me ha traído. No crea que con eso ha conseguido mi obediencia."),
() => say(marlow, russianStance() === "question" ? "Ahora entiendo el temor que había detrás de las explicaciones del ruso. La estación vuelve a callarse." :
  "El ruso había llamado admiración a muchas cosas. El silencio de la estación no me devuelve esa palabra."),
() => { finishNightEpilogue(); close(); }]);
export const nightAfterReturn = newLabel("journey-station-night-after", [() => say(kurtz, nightState().choice === "reason" ?
  "Mañana, dice… Guarde esa seguridad para usted." : "Sigue aquí. ¿Teme que vuelva a levantarme?"), close]);
