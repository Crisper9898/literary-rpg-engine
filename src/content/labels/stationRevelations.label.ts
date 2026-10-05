import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow, russianTrader, kurtz } from "../characters";
import { discoveries, discover, interpretation, chooseInterpretation } from "../state/stationRevelationsState";
import { kurtzFirstResponse, setKurtzPose } from "../state/kurtzIntroductionState";
import { markStation, setRussianMood } from "../state/innerStationState";
const say = (character: typeof marlow, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const revelationIvory = newLabel("journey-station-revelation-ivory", [
  () => { discover("ivory"); say(marlow, "Colmillos sobre colmillos. No es una reserva: es una acumulación que excede a toda la estación."); },
  () => say(marlow, discoveries().includes("palisade") ? "El marfil cuenta su éxito. Los postes cuentan el precio que esa palabra oculta." :
    "Todo termina bajo su ventana. La compañía cuenta piezas; aquí las personas esperan la voluntad de un solo hombre."), close,
]);
export const revelationPalisade = newLabel("journey-station-revelation-palisade", [
  () => { markStation("palisadeExamining"); say(marlow, "De lejos parecían remates de madera. Me acerco: casi todos están vueltos hacia la casa."); },
  () => { discover("palisade"); setRussianMood("nervous"); say(marlow, "No son adornos. Son cabezas humanas, secas, inmóviles. Aparto la mirada; la casa ya no significa lo mismo."); },
  () => say(marlow, "No explican el comercio. Expresan un poder al que nadie aquí parece haber puesto límite."), close,
]);
export const revelationInfluence = newLabel("journey-station-revelation-influence", [
  () => { discover("influence"); say(marlow, "Las esteras miran hacia un asiento vacío. Las huellas se detienen antes de él, como si incluso ausente alguien debiera autorizar el paso."); },
  () => say(marlow, "Recuerdo la mano que detuvo a los porteadores. No esperan al jefe de un almacén: esperan a Kurtz."), close,
]);
export const revelationReport = newLabel("journey-station-revelation-report", [
  () => { markStation("kurtzReportOpened"); say(marlow, "Su informe promete emplear una influencia sin límites para hacer el bien. Habla de progreso, de una responsabilidad elevada."); },
  () => say(marlow, "Hago una pausa. Las frases parecen limpias; la última página no. Una nota, añadida después, rompe su propia promesa."),
  () => { discover("report"); say(marlow, "«¡Exterminad a todos los brutos!» La misma mano escribió ambas cosas. La elocuencia no borra esa orden."); }, close,
]);
export const revelationLabels = { ivory: revelationIvory, palisade: revelationPalisade, influence: revelationInfluence, report: revelationReport };
const understand = newLabel("journey-station-revelation-understand", [() => {
  chooseInterpretation("understand"); setRussianMood("nervous"); say(marlow, "Quiero comprender cómo llegó hasta aquí. Comprenderlo no vuelve aceptable lo que veo.");
}]);
const brutality = newLabel("journey-station-revelation-brutality", [() => {
  chooseInterpretation("brutality"); setRussianMood("nervous"); say(marlow, "No dejaré que su voz le cambie el nombre a esto. Su poder descansa también sobre la brutalidad.");
}]);
export const revelationRussian = newLabel("journey-station-revelation-russian", [
  () => { setRussianMood("nervous"); say(russianTrader, discoveries().includes("palisade") ?
    "Vi adónde miraba. Él decía que eran rebeldes. No… no me atreví a quitar aquello. No necesitaba levantar la voz para que obedecieran." :
    discoveries().includes("report") ? "¿Ha leído sus papeles? Hablaba de hacer el bien. Yo… yo todavía recuerdo lo que me hizo ver cuando hablaba." :
      "Ha estado mirando alrededor. Nadie reunía tanto marfil. Nadie conseguía que todos esperaran así. Yo lo admiraba; también sabía cuándo callar."); },
  () => say(russianTrader, kurtzFirstResponse() === "challenge" ? "Antes se atrevió a preguntarle qué ocurría aquí. Ahora entiendo por qué conservó esa pregunta." :
    "Antes lo dejó hablar. Así empezó conmigo: escuchándolo. Pero escuchar no obliga a cerrar los ojos."),
  () => { say(marlow, discoveries().length >= 3 ? "Cada cosa que encuentro desmiente y explica la siguiente. ¿Comprender al hombre, o nombrar la violencia que lo sostiene?" :
    "Ya he visto suficiente para no confundir su voz con toda la verdad. ¿Cómo voy a mirar ahora a Kurtz?");
    if (!interpretation()) narration.choices = [newChoiceOption("Intentar comprender a Kurtz", understand, {}),
      newChoiceOption("Reconocer la brutalidad de su poder", brutality, {})]; },
  () => { say(russianTrader, interpretation() === "understand" ? "Ojalá yo hubiera separado entenderlo de seguirlo. No sé cuándo dejé de hacerlo." :
    "Usted lo nombra sin bajar la mirada. Yo lo defendía… hasta cuando tenía miedo."); },
  () => { if (discoveries().includes("report") && discoveries().includes("palisade")) say(marlow,
    "Las palabras del informe y los remates de la cerca ya no se pueden separar. Aquí los ideales encontraron una excusa para el dominio.");
    else say(marlow, "No he visto toda la estación. Puedo seguir mirando, pero ya no volveré a verla como al llegar."); },
  () => { markStation("revelationsRussianSeen"); markStation("stationRevelationsComplete"); close(); },
]);
export const revelationKurtz = newLabel("journey-station-revelation-kurtz", [
  () => { setKurtzPose(interpretation() === "brutality" ? "commanding" : "intense"); say(kurtz,
    interpretation() === "brutality" ? "Ha estado mirando mi estación. Ahora quiere un nombre que la explique. No espere que yo se lo dé." :
    interpretation() === "understand" ? "Quiere comprenderme. No encontrará al hombre entero en mis palabras." :
    discoveries().includes("report") ? "Mis papeles… consérvelos. Lo que escribí merece llegar más lejos que este lugar." :
    "Mira alrededor. Los otros contaban el marfil. Usted parece estar contando algo más."); },
  () => { setKurtzPose("coughing"); say(marlow, "La tos interrumpe su voz. Las cosas que he visto permanecen en silencio."); },
  () => { setKurtzPose("weak"); close(); },
]);
