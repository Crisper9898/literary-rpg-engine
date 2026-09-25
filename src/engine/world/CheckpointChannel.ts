/** An engine-owned value backed by the host game's save state. */
export interface CheckpointChannel<T> {
  read(): T | undefined;
  write(value: T): void;
}
