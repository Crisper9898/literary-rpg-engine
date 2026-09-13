export interface WorldLayout {
  readonly size: { readonly width: number; readonly height: number };
  readonly walkableArea: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
  readonly anchors: Readonly<Record<string, { readonly x: number; readonly y: number }>>;
}

/** Reject invalid authored geometry before a world is attached to the renderer. */
export function validateWorldLayout({ size, walkableArea: area, anchors }: WorldLayout): void {
  if (![size.width, size.height].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError("World dimensions must be finite and positive.");
  }
  if (![area.x, area.y, area.width, area.height].every(Number.isFinite) ||
      area.x < 0 || area.y < 0 || area.width <= 0 || area.height <= 0 ||
      area.x + area.width > size.width || area.y + area.height > size.height) {
    throw new RangeError("The walkable area must fit inside the world.");
  }
  for (const [id, point] of Object.entries(anchors)) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y) ||
        point.x < area.x || point.x > area.x + area.width ||
        point.y < area.y || point.y > area.y + area.height) {
      throw new RangeError(`Anchor ${id} must be inside the walkable area.`);
    }
  }
}
