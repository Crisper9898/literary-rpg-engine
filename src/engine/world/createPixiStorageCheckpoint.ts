import { storage } from "@drincs/pixi-vn";
import type { CheckpointChannel } from "./CheckpointChannel";

/** Bind an engine checkpoint to Pixi'VN's canonical save state. Callers own keys and validation. */
export function createPixiStorageCheckpoint<T>(
  key: string, isValue: (value: unknown) => value is T,
): CheckpointChannel<T> {
  if (!key.trim()) throw new RangeError("Checkpoint key must not be empty.");
  return {
    read: () => {
      const value = storage.get<unknown>(key);
      return isValue(value) ? value : undefined;
    },
    // Callers define serializable values; Pixi'VN's storage type excludes typed interfaces
    // such as Point even when their fields are all serializable primitives.
    write: (value) => {
      if (!isValue(value)) throw new RangeError(`Invalid checkpoint value for ${key}.`);
      storage.set(key, value as Parameters<typeof storage.set>[1]);
    },
  };
}
