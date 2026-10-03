"""Register six generated walk poses without changing approved resting/work cells.

Usage: python scripts/prepare-journey-motion.py <marlow.png> <deckhand.png>
Requires Pillow only for offline art preparation; not a runtime dependency.
"""
from pathlib import Path
import sys
from PIL import Image

directory = Path(__file__).resolve().parent.parent / "public/assets/art/journey-deck/illustrated"
for name, filename, height in zip(("marlow", "deckhand"), sys.argv[1:], (130, 125)):
    original = Image.open(directory / f"{name}-sheet.webp").convert("RGBA")
    source = Image.open(filename).convert("RGBA")
    output = Image.new("RGBA", (original.width + 960, 160))
    output.paste(original, (0, 0))
    for index in range(6):
        cell = source.crop((round(index * source.width / 6), 0,
                            round((index + 1) * source.width / 6), source.height))
        # Ignore near-transparent generation padding when registering the figure.
        bounds = cell.getchannel("A").point(lambda alpha: 255 if alpha > 24 else 0).getbbox()
        if not bounds:
            raise ValueError(f"Missing {name} walk pose {index}")
        cell = cell.crop(bounds)
        cell = cell.resize((round(cell.width * height / cell.height), height), Image.Resampling.LANCZOS)
        output.paste(cell, (original.width + index * 160 + 80 - cell.width // 2, 142 - height))
    # Preserve decoded approved cells exactly; do not recompress them lossily.
    assert output.crop((0, 0, original.width, 160)).tobytes() == original.tobytes()
    output.save(directory / f"{name}-motion-sheet.webp", lossless=True, method=6)
    print(name, output.size)
