import { describe, expect, it } from "vitest";
import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { createVisualAssetSlot } from "../src/ui/visualAssetSlot";

const fallback = () => new Graphics().rect(0, 0, 40, 20).fill(0x243834);

describe("visual asset slot", () => {
  it("shows a vector fallback immediately, then swaps to a configured image at the same size", async () => {
    const slot = createVisualAssetSlot({ label: "fixture", fallback,
      source: { url: "/fixture.webp", width: 40, height: 20, x: 5, y: 7 },
      load: async () => Texture.WHITE });
    const drawing = slot.container.getChildByLabel("fixture-fallback")!;
    expect(drawing.visible).toBe(true);
    await slot.ready;
    const image = slot.container.getChildByLabel("fixture-image") as Sprite;
    expect(image).toBeInstanceOf(Sprite);
    expect(image.width).toBe(40);
    expect(image.height).toBe(20);
    expect({ x: image.x, y: image.y }).toEqual({ x: 5, y: 7 });
    expect(drawing.visible).toBe(false);
    slot.container.destroy({ children: true });
  });

  it("keeps the fallback on load failure and never inserts a late image after destruction", async () => {
    const failed = createVisualAssetSlot({ label: "failed", fallback,
      source: { url: "/missing.webp", width: 40, height: 20 },
      load: async () => { throw new Error("missing"); } });
    await failed.ready;
    expect(failed.container.getChildByLabel("failed-fallback")?.visible).toBe(true);
    failed.container.destroy({ children: true });

    let resolve!: (texture: Texture) => void;
    const pending = new Promise<Texture>((done) => { resolve = done; });
    const late = createVisualAssetSlot({ label: "late", fallback,
      source: { url: "/late.webp", width: 40, height: 20 }, load: () => pending });
    late.container.destroy({ children: true });
    resolve(Texture.WHITE);
    await late.ready;
    expect(late.container.children).toHaveLength(0);
  });

  it("retains state for a future sheet while a different story uses the same resolver", () => {
    const fixture = new Container();
    const slot = createVisualAssetSlot({ label: "window-scene", fallback: () => fixture,
      source: { width: 40, height: 20 } });
    slot.setState("open");
    expect(slot.state).toBe("open");
    expect(slot.container.getChildByLabel("window-scene-fallback")).toBe(fixture);
    slot.container.destroy({ children: true });
  });

  it("uses configured sheet frames and keeps a clip with either visual source", async () => {
    const slot = createVisualAssetSlot({ label: "actor", fallback,
      source: { url: "/actor.webp", width: 24, height: 32,
        clip: { x: -12, y: -32, width: 24, height: 32 },
        frames: { idle: { x: 0, y: 0, width: 1, height: 1, pivot: { x: 0.5, y: 1 } },
          walkA: { x: 0, y: 0, width: 1, height: 1, pivot: { x: 0.5, y: 1 } } } },
      load: async () => Texture.WHITE });
    expect(slot.container.mask).toBeTruthy();
    slot.setState("walkA");
    await slot.ready;
    const image = slot.container.getChildByLabel("actor-image") as Sprite;
    expect(slot.state).toBe("walkA");
    expect(image).toBeInstanceOf(Sprite);
    expect(image.width).toBe(24);
    expect(image.height).toBe(32);
    expect(image.anchor.y).toBe(1);
    slot.container.destroy({ children: true });
  });
});
