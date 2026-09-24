import { storage } from "@drincs/pixi-vn";

const CARGO_MARK_KEY = "journey.cargoMarkInspected";

export function hasInspectedCargoMark(): boolean {
  return storage.get<boolean>(CARGO_MARK_KEY) === true;
}

export function inspectCargoMark(): void {
  storage.set(CARGO_MARK_KEY, true);
}
