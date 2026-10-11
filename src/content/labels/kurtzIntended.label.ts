import { CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { showJourneySpace } from "../scenes/journeyDeck";
import { legacyState } from "../state/kurtzLegacyState";
import { intendedState, beginIntended, observeIntendedRoom, deliverIntendedLetters, chooseIntendedApproach,
  finishIntendedExchange, hearLastWordsRequest, finishLastWords, leaveIntended } from "../state/kurtzIntendedState";

const intended = new CharacterBaseModel("kurtz-intended", { name: "La Prometida", color: "#d0c9af" });
RegisteredCharacters.add(intended);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const intendedEntry = newLabel("journey-station-intended-entry", [async () => {
  if (beginIntended()) await showJourneySpace();
  say(marlow, "Ha pasado más de un año desde su muerte. Traigo las cartas y la fotografía a su prometida. En este salón, las ventanas parecen guardar la última luz; ella espera a la derecha, de negro.");
}, () => say(intended, "Sabía que vendría. Deje sus cartas en la mesa pequeña, por favor."), close]);
export const intendedWindow = newLabel("journey-station-intended-window", [() => {
  observeIntendedRoom("window"); say(marlow, "Tres ventanas altas. La tarde se apaga sin ruido; por un instante, detrás del cristal vuelve el río que no he conseguido dejar atrás.");
}, close]);
export const intendedPiano = newLabel("journey-station-intended-piano", [() => {
  observeIntendedRoom("piano"); say(marlow, legacyState().cousinResponse === "music" ?
    "Reconocí sus talentos ante el primo. Este piano cerrado parece un sarcófago: nada toca aquí el músico que él recordaba." :
    "El primo recordaba a un músico; yo intenté hablarle del final. Este piano cerrado no puede reconciliar esas dos vidas.");
}, close]);
export const intendedDelivery = newLabel("journey-station-intended-delivery", [() => say(marlow,
  "Dejo suavemente el paquete sobre la mesa. Ella lo cubre con la mano. Ya no tengo sus papeles; conservo lo que vi."),
() => { deliverIntendedLetters(); close(); }]);
const witness = newLabel("journey-station-intended-witness", [() => {
  chooseIntendedApproach("witness"); say(marlow, "Lo conocí en circunstancias que acercan muy deprisa a dos hombres. Estuve con él hasta el final.");
}, () => say(intended, "Entonces también lo admiró. Nadie podía conocerlo sin quererlo. Yo lo conocía mejor que nadie.")]);
const listen = newLabel("journey-station-intended-listen", [() => {
  chooseIntendedApproach("listen"); say(marlow, "Dígame cómo lo recuerda. Cada persona que he recibido parecía guardar un hombre distinto.");
}, () => say(intended, "Su bondad, sus proyectos, su voz. Yo creía en él. Desde que murió su madre, no me queda nadie con quien compartirlo.")]);
export const intendedConversation = newLabel("journey-station-intended-conversation", [() => say(intended,
  "Usted lo conoció bien. Qué pérdida para todos... y para mí. Aún me parece imposible que no vuelva."), () => {
  say(marlow, "Su certeza llena el salón. ¿Cómo hablar desde el lugar al que ella no fue?");
  if (!intendedState().approach) narration.choices = [
    newChoiceOption("Hablar como testigo de sus últimos días", witness, {}),
    newChoiceOption("Escuchar el Kurtz que ella recuerda", listen, {}),
  ];
}, () => { finishIntendedExchange(); close(); }]);
export const intendedLastWords = newLabel("journey-station-intended-last-words", [() => {
  hearLastWordsRequest(); say(intended, intendedState().approach === "witness" ?
    "Estuvo con él hasta el final. Repita sus últimas palabras. Necesito algo suyo con lo que vivir." :
    "Conservo su voz, pero no pude estar allí. Usted sí. Dígame sus últimas palabras: necesito algo con lo que vivir.");
}, () => say(marlow, intendedState().windowObserved ?
  "En la oscuridad del cristal oigo otra vez: «El horror. El horror». Su espera no deja espacio para ese juicio." :
  "Todavía oigo el juicio de Kurtz: «El horror. El horror». Ella espera una última palabra, y no consigo repetirla."),
() => say(marlow, "La última palabra que pronunció fue... su nombre."),
() => say(intended, "Lo sabía. Estaba segura."), () => { finishLastWords(); close(); }]);
export const intendedDeparture = newLabel("journey-station-intended-departure", [() => say(marlow,
  intendedState().approach === "witness" ?
    "Quise hablar como testigo y acabé callando el juicio que había oído. Ella llora; la casa no se derrumba. Salgo sin haberle hecho esa justicia a Kurtz." :
    "Escuché al hombre que ella necesitaba recordar y le dejé una palabra que no fue la suya. Ella llora; nada se derrumba. Salgo con lo que no pude decir."),
() => { leaveIntended(); close(); }]);
export const intendedMemory = newLabel("journey-station-intended-memory", [() => say(marlow,
  "Las cartas han llegado a sus manos. La palabra que le entregué fue una mentira. Aún no he vuelto al relato en el Támesis."), close]);
