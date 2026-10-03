import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import type { JourneyActorMood } from "./journeyArtStages";
import { JourneyWalkCycle } from "./JourneyWalkCycle";

/** Small presentation-only gait layered over the existing movement controller. */
export function attachMarlowArt(actor: Container, ticker: Ticker,
  setArtState: (state: string) => void = () => {},
  mood: () => JourneyActorMood = () => "neutral"): void {
  const sprite = actor.getChildByLabel("marlow-art") as Container;
  const scale = sprite.scale.y;
  let previousX = actor.x, previousY = actor.y;
  const walk = new JourneyWalkCycle();
  let facing = 1;
  const update = () => {
    const dx = actor.x - previousX;
    const dy = actor.y - previousY;
    const distance = Math.hypot(dx, dy);
    if (Math.abs(dx) > 0.05) facing = Math.sign(dx);
    const gait = walk.advance(distance > 100 ? 0 : distance);
    const emotion = mood();
    setArtState(gait.moving ? `walk${gait.frame}` : emotion === "neutral" ? "idle" : emotion);
    sprite.scale.x = scale * facing;
    sprite.y = gait.lift;
    sprite.rotation = gait.sway;
    previousX = actor.x; previousY = actor.y;
  };
  ticker.add(update, undefined, UPDATE_PRIORITY.NORMAL - 1);
  actor.once("destroyed", () => ticker.remove(update));
}
