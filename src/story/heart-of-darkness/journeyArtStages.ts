import type { VisualSource } from "../../ui/visualAssetSlot";

const base = "/assets/art/journey-deck/illustrated/";
export type JourneyActorMood = "neutral" | "concern" | "alarm";

/** Story-owned alternatives; the eleven independently replaceable base slots stay intact. */
export const journeyArtVariants = {
  nightSkyWater: { url: `${base}journey-sky-water-night.webp`, width: 1920, height: 1080 },
  fireSkyWater: { url: `${base}journey-sky-water-fire.webp`, width: 1920, height: 1080 },
  burningBank: { url: `${base}journey-burning-bank.webp`, width: 1920, height: 320, y: 215 },
  deckFireReflection: { url: `${base}journey-deck-fire-reflection.webp`,
    width: 1550, height: 580, x: 205, y: 410 },
} satisfies Record<string, VisualSource>;

const smooth = (a: number, b: number, p: number) => {
  const x = Math.max(0, Math.min(1, (p - a) / (b - a)));
  return x * x * (3 - 2 * x);
};
const color = (from: number, to: number, t: number) => {
  const channel = (shift: number) => Math.round(((from >> shift) & 255) * (1 - t) +
    ((to >> shift) & 255) * t);
  return (channel(16) << 16) | (channel(8) << 8) | channel(0);
};

/** Distance-driven art progression, using the existing atmosphere's progress. */
export function journeyArtStage(progress: number) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const night = smooth(.28, .78, p);
  const fire = smooth(.84, 1, p);
  const darkGround = color(0xffffff, 0x8b9aaa, night);
  const darkActor = color(0xffffff, 0x8e9aa7, night);
  return {
    night: night * (1 - fire), fire,
    groundTint: color(darkGround, 0xffba83, fire),
    actorTint: color(darkActor, 0xffbd8b, fire),
    landTint: color(color(0xffffff, 0x45576b, night), 0x352623, fire),
    mood: (fire > .45 ? "alarm" : p > .42 ? "concern" : "neutral") as JourneyActorMood,
  };
}
