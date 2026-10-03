"""Draws the Sisters of Sonder symbol from its construction.

Angles are clockwise from the top; the outer wreath radius is R.

  Strand   P(r, a): regular pentagon, vertices at radius r, angles a + 72k.
  Braid    B(r) = P(r, 0) + P(r, 36): the {10/2} star.
  Wreath   W(r) = B(r) + B(s*r), s = cos 36 (inner points touch outer edge midpoints).
  Wreaths  at R, gR, g^2 R (the three aspirations). Line width ~ wreath radius.
  Rays     not drawn. Ink dots on every crossing/touch point along THETA
           suppress one of the ten rays, leaving nine.
  Dew drop disc of radius RHO with rim T; RHO + T/2 < s^2 g^2 R.
           The glint sits on the THETA axis so the mirror symmetry holds.
  Ring and banner: banner width = ring diameter / phi^2 (<= half the ring),
           length = width * phi.

Writes public/logo.svg (ring and banner) and public/emblem.svg (ring only).
"""
import math

R = 100.0
S = math.cos(math.radians(36))           # 0.809
G = 0.66                                 # wreath spacing (clears 0.654 limit)
THETA = 0.0                              # suppressed direction: 0 = up (a touch direction)
LINE = 0.022                             # line width as a fraction of wreath radius
DOT = 1.7                                # ink dot radius as a multiple of line width

RHO, T = 0.20 * R, 0.07 * R              # dew drop radius and rim width
assert RHO + T / 2 < S * S * G * G * R, "dew drop would touch the inner wreath"

RING_R, RING_W = 1.10 * R, 0.07 * R      # ring radius (centre of stroke) and width
PHI = (1 + 5 ** 0.5) / 2
RING_D = 2 * (RING_R + RING_W / 2)
BANNER_W = RING_D / PHI ** 2             # 0.382 of the ring's width
BANNER_L = BANNER_W * PHI                # hangs long: a golden rectangle
assert BANNER_W <= RING_D / 2

INK, FIELD = "#1c1a2e", "#fbf6ea"
GOLD, GOLD_DARK, ROSE = "#e8cf98", "#b8893a", "#8a4b55"


def pt(r, deg):
    a = math.radians(deg)
    return r * math.sin(a), -r * math.cos(a)


def pentagon(r, alpha, width):
    pts = " ".join(f"{x:.3f},{y:.3f}" for x, y in (pt(r, alpha + 72 * k) for k in range(5)))
    return f'<polygon points="{pts}" fill="none" stroke="{INK}" stroke-width="{width:.3f}" stroke-linejoin="miter"/>'


def wreath(r):
    width = LINE * r
    out = [pentagon(rad, a, width) for rad in (r, S * r) for a in (0, 36)]
    return out, width


def suppression_dots(r, width):
    """Ink dots on every crossing or touch point that lies along THETA."""
    rel = THETA % 36
    if abs(rel) < 1e-9:      # touch direction: inner braid point on outer braid edge
        radii = [S * r]
    elif abs(rel - 18) < 1e-9:   # crossing direction: one crossing per braid
        radii = [r * S / math.cos(math.radians(18)), S * r * S / math.cos(math.radians(18))]
    else:
        raise ValueError("THETA must be a touch (0 + 36k) or crossing (18 + 36k) direction")
    out = []
    for rad in radii:
        x, y = pt(rad, THETA)
        out.append(f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{DOT * width:.3f}" fill="{INK}"/>')
    return out


def dew_drop():
    gx, gy = pt(RHO * 0.45, THETA)
    return [
        f'<circle r="{RHO + T / 2:.3f}" fill="none" stroke="{GOLD_DARK}" stroke-width="{T:.3f}"/>',
        f'<circle r="{RHO:.3f}" fill="url(#water)"/>',
        f'<ellipse cx="{gx:.3f}" cy="{gy:.3f}" rx="{RHO * 0.42:.3f}" ry="{RHO * 0.22:.3f}" '
        f'transform="rotate({THETA:.1f} {gx:.3f} {gy:.3f})" fill="#ffffff" fill-opacity=".7"/>',
    ]


def ring():
    return [
        f'<circle r="{RING_R:.3f}" fill="{FIELD}"/>',
        f'<circle r="{RING_R:.3f}" fill="none" stroke="{GOLD_DARK}" stroke-width="{RING_W:.3f}"/>',
        f'<circle r="{RING_R - RING_W / 2:.3f}" fill="none" stroke="{GOLD}" stroke-width="{RING_W * 0.18:.3f}"/>',
    ]


def banner():
    top = RING_R                          # hangs from the ring's outer edge
    x0 = -BANNER_W / 2
    inset = BANNER_W * 0.08
    return [
        f'<rect x="{x0:.3f}" y="{top:.3f}" width="{BANNER_W:.3f}" height="{BANNER_L:.3f}" fill="{ROSE}" stroke="{GOLD_DARK}" stroke-width="{RING_W * 0.5:.3f}"/>',
        f'<rect x="{x0 + inset:.3f}" y="{top + inset + RING_W / 2:.3f}" width="{BANNER_W - 2 * inset:.3f}" '
        f'height="{BANNER_L - 2 * inset - RING_W / 2:.3f}" fill="none" stroke="{GOLD}" stroke-width="{RING_W * 0.18:.3f}"/>',
    ]


DEFS = f"""<defs>
  <radialGradient id="water" cx="50%" cy="38%" r="68%">
    <stop offset="0" stop-color="#c3e4f4"/>
    <stop offset=".55" stop-color="#3f86b5"/>
    <stop offset="1" stop-color="#1f4f78"/>
  </radialGradient>
</defs>"""


def symbol(with_banner):
    body = []
    if with_banner:
        body += banner()
    body += ring()
    for r in (R, G * R, G * G * R):
        lines, width = wreath(r)
        body += lines
        body += suppression_dots(r, width)
    body += dew_drop()
    pad = RING_W
    half = RING_R + RING_W / 2 + pad
    height = (RING_R + BANNER_L + pad if with_banner else half) + half
    view = f"{-half:.2f} {-half:.2f} {2 * half:.2f} {height:.2f}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="Sisters of Sonder">\n'
        + DEFS + "\n" + "\n".join(body) + "\n</svg>\n"
    )


with open("public/logo.svg", "w", encoding="utf8") as f:
    f.write(symbol(with_banner=True))
with open("public/emblem.svg", "w", encoding="utf8") as f:
    f.write(symbol(with_banner=False))
print(f"banner {BANNER_W:.1f} x {BANNER_L:.1f}, ring diameter {RING_D:.1f}")
