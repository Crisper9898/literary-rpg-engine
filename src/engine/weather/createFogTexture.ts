import { Texture } from "pixi.js";

/** One small periodic alpha texture per scene, shared by every fog sprite. */
export function createFogTexture(): Texture {
  const surface = document.createElement("canvas");
  surface.width = 256;
  surface.height = 128;
  const context = surface.getContext("2d")!;
  const pixels = context.createImageData(surface.width, surface.height);
  for (let y = 0; y < surface.height; y++) for (let x = 0; x < surface.width; x++) {
    const u = x / (surface.width - 1) * Math.PI * 2;
    const v = y / (surface.height - 1);
    const center = .52 + .09 * Math.sin(u) + .04 * Math.sin(2 * u);
    const envelope = Math.sin(Math.PI * v) ** 2;
    const body = Math.exp(-(((v - center) / .27) ** 2));
    const wisps = .64 + .18 * Math.sin(u + v * 7) + .12 * Math.sin(3 * u - v * 11);
    const index = (y * surface.width + x) * 4;
    pixels.data[index] = pixels.data[index + 1] = pixels.data[index + 2] = 255;
    pixels.data[index + 3] = Math.round(255 * envelope * body * wisps);
  }
  context.putImageData(pixels, 0, 0);
  return Texture.from(surface);
}
