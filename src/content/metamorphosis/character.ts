import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";
import { gregorIdentity, greteIdentity } from "../../story/metamorphosis/room";

export const gregor = new CharacterBaseModel(gregorIdentity.id, {
  name: gregorIdentity.name, color: gregorIdentity.color,
});
RegisteredCharacters.add(gregor);

export const grete = new CharacterBaseModel(greteIdentity.id, {
  name: greteIdentity.name, color: greteIdentity.color,
});
RegisteredCharacters.add(grete);
