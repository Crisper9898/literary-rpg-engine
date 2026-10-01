import { Assets, Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";

export interface VisualFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Foot or registration point within this frame, in source pixels. */
  pivot: { x: number; y: number };
}

export interface VisualSource {
  /** Omit until artwork is approved; the vector fallback remains fully playable. */
  url?: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  pivot?: { x: number; y: number };
  clip?: { x: number; y: number; width: number; height: number };
  frames?: Record<string, VisualFrame>;
}

export interface VisualAssetSlotOptions {
  label: string;
  source: VisualSource;
  fallback: () => Container;
  /** For immutable vector plates; leave false for animated actor fallbacks. */
  cacheFallback?: boolean;
  /** Loader injection keeps the lifecycle testable without a browser or real art. */
  load?: (url: string) => Promise<Texture>;
}

/** Presentation-only swap point. The caller still owns its layer, masks and game state. */
export function createVisualAssetSlot(options: VisualAssetSlotOptions) {
  const { label, source } = options;
  const container = new Container({ label });
  const drawing = options.fallback();
  drawing.label = `${label}-fallback`;
  if (options.cacheFallback) drawing.cacheAsTexture(true);
  container.addChild(drawing);
  // The authored fallback is already confined to its intended region. Avoid
  // a large per-tile mask until an external image actually needs cropping.
  if (source.url && source.clip) {
    const { x, y, width, height } = source.clip;
    const mask = new Graphics({ label: `${label}-clip` }).rect(x, y, width, height).fill(0xffffff);
    container.addChild(mask);
    container.mask = mask;
  }
  let disposed = false;
  let state = "idle";
  let sprite: Sprite | undefined;
  let texture: Texture | undefined;
  const frameTextures = new Map<string, Texture>();
  const applyState = () => {
    if (!sprite || !texture || !source.frames) return;
    const frame = source.frames[state] ?? source.frames.idle;
    if (!frame) return;
    if (frame.x < 0 || frame.y < 0 || frame.width <= 0 || frame.height <= 0 ||
      frame.x + frame.width > texture.source.width ||
      frame.y + frame.height > texture.source.height) {
      throw new Error(`Frame ${state} lies outside the loaded visual asset ${label}.`);
    }
    const key = source.frames[state] ? state : "idle";
    let cropped = frameTextures.get(key);
    if (!cropped) {
      cropped = new Texture({ source: texture.source,
        frame: new Rectangle(frame.x, frame.y, frame.width, frame.height) });
      frameTextures.set(key, cropped);
    }
    sprite.texture = cropped;
    sprite.anchor.set(frame.pivot.x / frame.width, frame.pivot.y / frame.height);
    sprite.width = source.width;
    sprite.height = source.height;
  };
  container.once("destroyed", () => {
    disposed = true;
    for (const cropped of frameTextures.values()) cropped.destroy(false);
    frameTextures.clear();
  });
  const ready = source.url
    ? (options.load ?? ((url: string) => Assets.load<Texture>(url)))(source.url)
      .then((loaded) => {
        if (disposed) return;
        texture = loaded;
        sprite = new Sprite({ label: `${label}-image`, texture: loaded });
        sprite.position.set(source.x ?? 0, source.y ?? 0);
        if (source.frames) applyState();
        else {
          sprite.width = source.width;
          sprite.height = source.height;
          if (source.pivot) sprite.anchor.set(source.pivot.x / source.width,
            source.pivot.y / source.height);
        }
        container.addChild(sprite);
        drawing.visible = false;
        if (options.cacheFallback) drawing.cacheAsTexture(false);
      })
      .catch(() => {
        sprite = undefined;
        texture = undefined;
        // Missing or rejected artwork leaves the authored fallback visible.
      })
    : Promise.resolve();
  return { container, ready, setState(next: string) {
    if (next !== state) { state = next; applyState(); }
  },
    get state() { return state; }, get usingFallback() { return !sprite; } };
}
