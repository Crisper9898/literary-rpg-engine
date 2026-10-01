import { describe, expect, it } from "vitest";
import { Container, Ticker } from "pixi.js";
import { attachActorDepth } from "../src/ui/attachActorDepth";

describe("actor depth presentation", () => {
  it("sorts by foot Y as actors cross and detaches with the scene", () => {
    const ticker = new Ticker();
    const layer = new Container();
    const near = new Container({ label: "near", y: 800 });
    const far = new Container({ label: "far", y: 700 });
    layer.addChild(near, far);
    attachActorDepth(layer, ticker, [near, far]);
    ticker.update(16);
    expect(layer.children.map(({ label }) => label)).toEqual(["far", "near"]);
    far.y = 900;
    ticker.update(32);
    expect(layer.children.map(({ label }) => label)).toEqual(["near", "far"]);
    layer.destroy({ children: true });
    expect(ticker.count).toBe(0);
    ticker.destroy();
  });
});
