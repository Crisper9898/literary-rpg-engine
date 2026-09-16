/**
 * Canonical Pixi'VN character registrations belong here.
 *
 * Add important literary characters once and reference the same ids from
 * world sprites, portraits and story data.
 */
import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";
import { deckhandIdentity } from "../story/heart-of-darkness/deckhand";

export const journeyDeckhand = new CharacterBaseModel(deckhandIdentity.id, {
  name: deckhandIdentity.name, color: deckhandIdentity.color,
});
RegisteredCharacters.add(journeyDeckhand);

export const marlow = new CharacterBaseModel("marlow", { name: "Marlow", color: "#dfc495" });
RegisteredCharacters.add(marlow);
