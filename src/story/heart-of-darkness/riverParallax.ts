import { Graphics } from "pixi.js";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets, type JourneyArtAsset } from "./journeyArtAssets";

// Authored placeholder tiles: all filled shorelines meet at equal heights on
// both ends. Only scenery travels; the vessel and its fittings stay in the world.
const period = 1920;
// Compress the upper landscape into an inked horizon, leaving a broad passage
// of visible water behind the ship rather than a thin decorative stripe.
const riverFraming = (asset: JourneyArtAsset, draw: () => Graphics) => () => {
  const tile = createVisualAssetSlot({ label: `${asset}-art`,
    source: journeyArtAssets[asset], fallback: draw, cacheFallback: true }).container;
  tile.scale.y = 0.82;
  return tile;
};

function distantRidge(): Graphics {
  return new Graphics({ label: "distant-ridge-art" })
    .poly([0, 403, 115, 390, 265, 399, 400, 365, 515, 350, 675, 375,
      785, 398, 935, 385, 1080, 358, 1205, 371, 1365, 399, 1510, 377,
      1625, 361, 1770, 386, 1920, 403, 1920, 465, 0, 465])
    .fill(0x354c49)
    .poly([0, 422, 140, 412, 300, 427, 445, 399, 650, 414, 805, 427,
      975, 416, 1110, 399, 1310, 417, 1480, 411, 1690, 434,
      1820, 415, 1920, 422, 1920, 474, 0, 474])
    .fill(0x2c4643)
    .poly([0, 438, 330, 424, 720, 440, 1040, 430, 1450, 442, 1920, 434,
      1920, 463, 0, 463]).fill({ color: 0x142f2d, alpha: 0.22 })
    .moveTo(120, 410).lineTo(270, 408)
    .moveTo(990, 399).lineTo(1135, 398)
    .moveTo(1560, 405).lineTo(1700, 404)
      .stroke({ color: 0x879280, width: 2, alpha: 0.11 });
}

function farVegetation(): Graphics {
  const art = new Graphics({ label: "far-vegetation-art" })
    .poly([0, 447, 145, 443, 275, 452, 460, 446, 615, 451, 830, 441,
      1010, 451, 1215, 445, 1410, 453, 1600, 443, 1770, 450,
      1920, 447, 1920, 490, 0, 490]).fill(0x203b36);
  for (const [x, y, size] of [
    [90, 433, 25], [250, 440, 16], [355, 418, 30], [485, 430, 18],
    [655, 441, 20], [790, 414, 31], [970, 433, 18], [1080, 427, 25],
    [1280, 417, 31], [1450, 439, 19], [1580, 420, 29], [1760, 436, 22],
    [1850, 427, 25],
  ]) {
    art.poly([x - 4, 473, x - 3, y - 10, x + 3, y - 8, x + 6, 473])
      .fill(0x172e2a)
      .poly([x - size * 1.5, y + 4, x - size * 1.2, y - size * 0.25,
        x - size * 0.9, y - size * 0.48, x - size * 0.6, y - size * 0.42,
        x - size * 0.35, y - size * 0.8, x, y - size * 0.74,
        x + size * 0.25, y - size * 0.95, x + size * 0.55, y - size * 0.5,
        x + size * 0.9, y - size * 0.45, x + size * 1.4, y + 6])
      .fill(0x233f38);
    art.moveTo(x - size * 0.45, y + 11).lineTo(x + size * 0.4, y + 12)
      .stroke({ color: 0x7c8b77, width: 1.5, alpha: 0.11 });
  }
  return art;
}

function nearBank(): Graphics {
  const art = new Graphics({ label: "near-bank-art" })
    .poly([0, 475, 160, 468, 305, 477, 470, 473, 625, 479, 840, 470,
      1010, 478, 1170, 466, 1320, 476, 1510, 481, 1725, 468,
      1920, 475, 1920, 504, 1725, 507, 1510, 506, 1320, 510,
      1170, 507, 1010, 502, 840, 508, 625, 505, 470, 509,
      305, 503, 160, 506, 0, 504]).fill(0x142f2c);
  for (const [x, y, size] of [
    [130, 463, 36], [410, 470, 25], [705, 456, 43],
    [1100, 464, 31], [1400, 466, 35], [1760, 455, 39],
  ]) {
    art.ellipse(x, y, size, size * 0.43).fill(0x1a352e)
      .ellipse(x + size * 0.6, y + 7, size * 0.7, size * 0.4).fill(0x1a352e);
    for (let reed = 0; reed < 5; reed++) {
      const stem = x - 23 + reed * 11;
      const tip = y - 14 - (reed % 3) * 9;
      art.poly([stem - 2, y + 20, stem - 9, tip, stem + 2, y + 8,
        stem + 12, tip + 7, stem + 4, y + 20]).fill(0x1a352e);
    }
    // Broken muddy reflections tie the silhouette to the water surface.
    art.poly([x - size, 513, x + size, 511, x + size * 0.5, 516,
      x - size * 0.6, 517]).fill({ color: 0x71806b, alpha: 0.18 });
    art.moveTo(x - size * 0.65, 524).lineTo(x + size * 0.25, 522)
      .stroke({ color: 0x9dad91, width: 2, alpha: 0.11 });
  }
  return art;
}

function riverSurface(): Graphics {
  const art = new Graphics({ label: "river-current-art" });
  for (let row = 0; row < 10; row++) {
    const y = 520 + row * 59;
    // Unequal lengths and staggered breaks read as passing surface currents,
    // rather than a scrolling grid. Transparent marks leave the base visible.
    for (let column = 0; column < 7; column++) {
      const x = 28 + column * 256 + (row % 3) * 23;
      const length = 60 + ((row * 3 + column * 5) % 7) * 16;
      art.poly([x, y, x + length * 0.65, y - 3, x + length, y,
        x + length * 0.45, y + 2]).fill({ color: 0x8d9c88, alpha: 0.1 + row * 0.009 });
      if ((column + row) % 3 === 0) {
        art.moveTo(x + 18, y + 14).lineTo(x + length * 0.62, y + 17)
          .lineTo(x + length * 0.8, y + 14)
          .stroke({ color: 0x142f33, width: 2, alpha: 0.3 });
      }
    }
  }
  return art;
}

function foregroundReeds(): Graphics {
  const art = new Graphics({ label: "foreground-reeds-art" });
  for (const [x, y] of [[170, 1014], [1390, 1026]]) {
    art.ellipse(x + 6, y + 3, 61, 7).fill({ color: 0x152e2d, alpha: 0.65 });
    for (let reed = 0; reed < 7; reed++) {
      const stem = x - 22 + reed * 8;
      const tip = y - 58 - (reed % 3) * 18;
      art.poly([stem - 3, y, stem - 14, tip, stem + 1, y - 22,
        stem + 16, tip + 24, stem + 4, y]).fill(0x112a27);
    }
    art.poly([x - 54, y + 12, x + 49, y + 9, x + 65, y + 12,
      x - 15, y + 15]).fill({ color: 0xa39c76, alpha: 0.2 });
  }
  // A small branch in the near water gives the eye a passage marker.
  art.moveTo(805, 950).lineTo(854, 946).lineTo(881, 952)
    .moveTo(844, 947).lineTo(831, 939)
    .stroke({ color: 0x746e50, width: 4, alpha: 0.8 })
    .moveTo(794, 959).lineTo(868, 957)
    .stroke({ color: 0x91a08b, width: 2, alpha: 0.25 });
  return art;
}

/** Units/second toward the stern; camera depth is independent of voyage speed. */
export const journeyRiverLayers = [
  { id: "distant-ridge", period, speed: 5, depth: { x: 0.08, y: 1 }, placement: "environment", createTile: riverFraming("distantRidge", distantRidge) },
  { id: "far-vegetation", period, speed: 14, depth: { x: 0.25, y: 1 }, placement: "environment", createTile: riverFraming("farVegetation", farVegetation) },
  { id: "near-bank", period, speed: 30, depth: { x: 0.5, y: 1 }, placement: "environment", createTile: riverFraming("nearBank", nearBank) },
  { id: "river-current", period, speed: 58, depth: { x: 0.8, y: 1 }, placement: "environment", createTile: riverFraming("riverCurrent", riverSurface) },
  { id: "foreground-reeds", period, speed: 90, depth: { x: 1.15, y: 1 }, placement: "foreground", createTile: () =>
    createVisualAssetSlot({ label: "foreground-reeds-art", source: journeyArtAssets.foregroundReeds,
      fallback: foregroundReeds, cacheFallback: true }).container },
] as const;
