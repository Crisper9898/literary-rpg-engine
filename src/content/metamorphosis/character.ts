import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";
import { gregorIdentity } from "../../story/metamorphosis/room";

export const gregor = new CharacterBaseModel(gregorIdentity.id, {
  name: gregorIdentity.name, color: gregorIdentity.color,
});
RegisteredCharacters.add(gregor);
