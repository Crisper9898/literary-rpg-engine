import { deckConversation } from "./conversation";

/** This scene's visual language lives with its story, never in the RPG engine. */
export const journeyVisual = {
  ink: 0x101d1c,
  deepWater: 0x182e2c,
  river: 0x34504a,
  farBank: 0x314841,
  nearBank: 0x1c342e,
  deck: 0x51493b,
  deckShade: 0x302f29,
  paper: 0xe2d5b7,
  brass: 0xb89b65,
  ember: 0xd18853,
  mist: 0x9ca99a,
  scene: { width: 1920, height: 1080 },
  riverHorizon: 345,
  deckBack: 620,
} as const;

export type JourneyVisualBeat = "voyage" | "listening" | "river" | "cargo";

/** Presentation cue from existing Pixi'VN dialogue, without storing duplicate narrative state. */
export function journeyVisualBeat(active: boolean, text: string): JourneyVisualBeat {
  if (!active) return "voyage";
  if (text === deckConversation.riverQuestion || text === deckConversation.riverAnswer) return "river";
  if (text === deckConversation.cargoQuestion || text === deckConversation.cargoAnswer ||
    text === deckConversation.cargoAnswerInspected) return "cargo";
  return "listening";
}
