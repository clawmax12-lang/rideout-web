#!/usr/bin/env python3
"""Turn the bike line-art webp into a transparent, auto-cropped PNG icon.

White background -> transparent via luminance->alpha (keeps anti-aliased stroke
edges as partial alpha). Strokes recolored to the site icon tone #1A1A1A so it
matches the other concept icons. Portrait whitespace is trimmed to the drawing's
bbox so it fills the 44x44 object-fit:contain slot instead of rendering tiny.
"""
from PIL import Image

SRC = "/Users/maxagent/Downloads/bicycle, icon.webp"
OUT = "assets/img/bike-icon.png"
LINE = (26, 26, 26)      # #1A1A1A — matches existing icons
WHITE_CUT = 244          # lum >= -> fully transparent (clean bg)
BLACK_CUT = 70           # lum <= -> fully opaque (solid stroke)
PAD_FRAC = 0.04          # breathing room around the drawing
MAX_SIDE = 512           # plenty for a 44px (even @3x) slot; keeps file small

def lut(l):
    if l >= WHITE_CUT:
        return 0
    if l <= BLACK_CUT:
        return 255
    return int(255 * (WHITE_CUT - l) / (WHITE_CUT - BLACK_CUT))

img = Image.open(SRC).convert("RGBA")
print(f"source: {img.size[0]}x{img.size[1]}")

alpha = img.convert("L").point([lut(i) for i in range(256)])
solid = Image.new("RGBA", img.size, (*LINE, 255))
solid.putalpha(alpha)

bbox = alpha.getbbox()
print(f"content bbox: {bbox}")
cropped = solid.crop(bbox)

pad = int(max(cropped.size) * PAD_FRAC)
padded = Image.new("RGBA", (cropped.width + 2 * pad, cropped.height + 2 * pad), (0, 0, 0, 0))
padded.paste(cropped, (pad, pad))

if max(padded.size) > MAX_SIDE:
    s = MAX_SIDE / max(padded.size)
    padded = padded.resize((round(padded.width * s), round(padded.height * s)), Image.LANCZOS)

padded.save(OUT)
print(f"saved {OUT}: {padded.size[0]}x{padded.size[1]}  (aspect {padded.size[0]/padded.size[1]:.2f})")
