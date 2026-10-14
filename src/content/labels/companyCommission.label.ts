import { canvas, CharacterBaseModel, RegisteredCharacters, narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { marlow } from "../characters";
import { setJourneySpace } from "../state/woodStopState";
import { beginCommission, observeCompanyMap, receiveAppointment, enterCompany, signContract, beginExamination,
  chooseMedicalResponse, finishExamination, recallFarewell, leaveCompany, commissionState } from "../state/companyCommissionState";

const doctor = new CharacterBaseModel("company-appointment-doctor", { name: "Médico de la Compañía", color: "#b6b8a6" });
const aunt = new CharacterBaseModel("marlow-appointment-aunt", { name: "La tía de Marlow", color: "#d1bf91" });
RegisteredCharacters.add(doctor, aunt);
const say = (character: CharacterBaseModel, text: string) => { narration.dialogue = { character, text }; };
const close = () => { narration.dialogue = undefined; narration.choices = undefined; narration.labels.closeCurrent(); };
export const commissionStart = newLabel("journey-station-commission-start", [async () => {
  for (const id of ["journey-deck", "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
    const previous = canvas.layers.get(id);
    if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
  }
  beginCommission(); setJourneySpace("inner-station");
  const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
  say(marlow, "Antes del vapor hubo una carta. Yo buscaba un barco; mi tía consiguió una recomendación para la Compañía. En esta antesala puedo leerla, examinar el mapa y dar los pasos que me enviaron al río.");
}, close]);
export const commissionMap = newLabel("journey-station-commission-map", [() => {
  observeCompanyMap(); say(marlow, "Los colores reparten el mapa entre potencias. En el centro, una mancha amarilla. El río se enrosca como una serpiente: me atrae el trazo, antes de conocer a quienes viven allí.");
}, close]);
export const commissionAppointment = newLabel("journey-station-commission-appointment", [() => {
  receiveAppointment(); say(aunt, "Una amiga conoce a alguien de la administración. Necesitan un capitán para un vapor pequeño. Tu nombramiento ya está dispuesto.");
}, () => say(marlow, "La vacante tenía un nombre: Fresleven. Sólo después supe que había golpeado a un jefe de aldea por unas gallinas; el hijo lo hirió con una lanza. Los habitantes huyeron por miedo. Mi contrato empezaba donde había terminado aquella violencia."), close]);
export const commissionAdmission = newLabel("journey-station-commission-admission", [() => {
  enterCompany(); say(marlow, "Dos mujeres tejen lana negra junto al umbral. Una me hace pasar; la otra sigue trabajando y me observa. El jefe apenas me da la mano, comprueba mi francés y me devuelve a la secretaria.");
}, () => say(marlow, commissionState().mapObserved ?
  "El mapa sigue detrás de mí. Aquella serpiente de tinta ya tiene una firma pendiente. La secretaria deja el contrato sobre la mesa." :
  "En la antesala hay un gran mapa de colores. La secretaria deja el contrato sobre la mesa. Todo parece resuelto antes de que yo llegue."), close]);
export const commissionContract = newLabel("journey-station-commission-contract", [() => {
  signContract(); say(marlow, "Firmo. También me comprometo a no revelar los secretos comerciales. La secretaria señala la mesa del médico, a la izquierda: falta una simple formalidad antes de partir.");
}, close]);
const returnReply = newLabel("journey-station-commission-medical-return", [() => {
  chooseMedicalResponse("return"); say(marlow, "¿También mide la cabeza de quienes regresan?");
}, () => say(doctor, "No vuelvo a verlos. Los cambios ocurren por dentro. Me interesaría observarlos allí, en el lugar.")]);
const questionReply = newLabel("journey-station-commission-medical-question", [() => {
  chooseMedicalResponse("question"); say(marlow, "¿Qué tiene que ver esta medición con mi trabajo? ¿Es esto ciencia?");
}, () => say(doctor, "No le pido dinero. Quiero contrastar una teoría sobre los cambios mentales de quienes van allí. Su viaje también puede servir a mis observaciones.")]);
export const commissionExamination = newLabel("journey-station-commission-examination", [() => {
  beginExamination(); say(doctor, "El pulso está bien. ¿Me permite medirle la cabeza? ¿Hay antecedentes de locura en su familia?");
}, () => {
  say(marlow, "El compás pasa sobre mi cabeza; el médico anota cifras. No pregunta cómo dirigiré el vapor. Tengo una pregunta para él.");
  if (!commissionState().medicalResponse) narration.choices = [
    newChoiceOption("Preguntar por quienes regresan", returnReply, {}),
    newChoiceOption("Cuestionar el propósito de la medición", questionReply, {}),
  ];
}, () => say(doctor, "Evite la irritación. Mantenga la calma. Eso, más que el sol, será importante allí."),
() => { finishExamination(); close(); }]);
export const commissionFarewell = newLabel("journey-station-commission-farewell", [() => {
  say(marlow, "Antes de partir vuelvo a pensar en la última taza de té con mi tía. El médico ha terminado conmigo; el contrato ya está firmado.");
}, () => say(aunt, commissionState().medicalResponse === "return" ?
  "Cuando vuelvas tendrás tanto que contar. Vas a ayudar a llevar el progreso a quienes lo necesitan." :
  "No seas tan desconfiado. Eres justo el hombre que necesitan para llevar el progreso a quienes viven allí."),
() => say(marlow, commissionState().mapObserved ?
  "Pienso en aquellos colores y en quién se beneficia del reparto. Le recuerdo que la Compañía existe para obtener ganancias. Ella sonríe: el trabajador merece su paga." :
  "Le recuerdo que la Compañía existe para obtener ganancias. Ella sonríe: el trabajador merece su paga. Su entusiasmo no disipa mi inquietud."),
() => { recallFarewell(); close(); }]);
export const commissionContinue = newLabel("journey-station-commission-continue", [() => say(marlow,
  "El encargo está firmado. El viaje costero y la Estación Exterior están disponibles en su entrada opcional. Esta ruta hace una elipsis hasta el vapor río arriba; la caravana y la Estación Central todavía no son jugables."),
async () => {
  close(); if (!leaveCompany()) return;
  setJourneySpace("deck"); const { showJourneySpace } = await import("../scenes/journeyDeck"); await showJourneySpace();
}]);
