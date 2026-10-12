import { europeRoom, europeAudio, registerEuropeAudio } from "./europeReturn";

// Episode-local staging over the existing neutral European room and room tone.
export const companyRoom = europeRoom;
export const companyPoints = { entry: { x: 960, y: 825 }, recommendation: { x: 1140, y: 745 },
  map: { x: 1240, y: 770 }, threshold: { x: 1510, y: 790 }, contract: { x: 860, y: 745 },
  doctor: { x: 470, y: 745 }, far: { x: 380, y: 860 } };
export const companyAudio = europeAudio;
export const registerCompanyAudio = registerEuropeAudio;
