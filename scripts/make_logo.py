"""Draws the Sisters of Sonder symbol from its construction.

Angles are clockwise from the top; the outer wreath radius is R.

  Strand   P(r, a): regular pentagon, vertices at radius r, angles a + 72k.
  Braid    B(r) = P(r, 0) + P(r, 36): the {10/2} star.
  Wreath   W(r) = B(r): two braided pentagons. There are three wreaths,
           at R, gR, g^2 R (the three aspirations). Line width ~ wreath radius.
  Rays     not drawn; the ten point directions carry the nine tenets and
           the Foundational Understanding.
  Dew drop disc of radius RHO with rim T; RHO + T/2 < s^2 g^2 R.
           The glint sits on the THETA axis so the mirror symmetry holds.
  Banner   hangs from the flat base of the outer upright pentagon, as wide
           as that base; length = width * phi.

Writes public/logo.svg (ring and banner) and public/emblem.svg (ring only).
"""
import math

R = 100.0
S = math.cos(math.radians(36))           # 0.809: a braid's flat sides sit at S*r
G = 0.66                                 # wreath spacing (clears 0.654 limit)
THETA = 0.0                              # symmetry axis for the glint: 0 = up
LINE = 0.045                             # line width as a fraction of wreath radius

DROP_OUT = 0.38 * R                      # dew drop's outer edge (rim included)
T = 0.06 * R                             # dew drop rim width
RHO = DROP_OUT - T                       # clear water inside the rim

# The inner wreath is fitted around the drop: the inner edge of its lines
# (flat sides at S*r, less half the line width) just touches the rim.
R_INNER = DROP_OUT / (S - LINE / 2)
WREATHS = (R, G * R, R_INNER)

# Keep the wreaths from crossing: the inner wreath's points (with their
# mitred tips) must stay inside the middle wreath's flat sides.
_tip = R_INNER + 0.62 * LINE * R_INNER
_mid_side = S * G * R - LINE * G * R / 2
assert _tip < _mid_side, f"inner wreath points {_tip:.1f} reach middle wreath {_mid_side:.1f}"

RING_W = 0.07 * R                        # ring width
RING_R = R - RING_W / 2                  # ring's outer edge lands just under the outer points
PHI = (1 + 5 ** 0.5) / 2
RING_D = 2 * (RING_R + RING_W / 2)
# The banner hangs from the flat base of the outer wreath's upright pentagon
# P(R, 0), whose bottom side runs between its 144 and 216 degree vertices.
BANNER_TOP = S * R                       # that base sits at S*R below centre
BANNER_W = 2 * R * math.sin(math.radians(36))   # as wide as that base
BANNER_L = BANNER_W * PHI                # hangs long: a golden rectangle

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
    out = [pentagon(r, a, width) for a in (0, 36)]
    return out, width


def dew_drop():
    """Clear water holding a soft prism throw of colour, and a small round
    glint on the symmetry axis."""
    gx, gy = pt(RHO * 0.5, THETA)
    band_h = RHO * 0.5
    return [
        f'<circle r="{RHO:.3f}" fill="url(#water)"/>',
        # spectrum band, faded at both ends, low in the drop where light gathers
        f'<g clip-path="url(#drop)"><rect x="{-RHO * 1.1:.3f}" y="{RHO * 0.12:.3f}" width="{2.2 * RHO:.3f}" '
        f'height="{band_h:.3f}" fill="url(#prism)" mask="url(#prism-fade)" filter="url(#soft)" '
        f'transform="rotate(-14)" opacity=".6"/></g>',
        f'<circle r="{RHO + T / 2:.3f}" fill="none" stroke="{INK}" stroke-width="{T:.3f}"/>',
        f'<circle cx="{gx:.3f}" cy="{gy:.3f}" r="{RHO * 0.1:.3f}" fill="#ffffff"/>',
    ]


def ring():
    return [
        f'<circle r="{RING_R:.3f}" fill="{FIELD}"/>',
        f'<circle r="{RING_R:.3f}" fill="none" stroke="{GOLD_DARK}" stroke-width="{RING_W:.3f}"/>',
        f'<circle r="{RING_R - RING_W / 2:.3f}" fill="none" stroke="{GOLD}" stroke-width="{RING_W * 0.18:.3f}"/>',
    ]


def banner():
    top = BANNER_TOP                      # attached to the pentagon's base
    x0 = -BANNER_W / 2
    inset = BANNER_W * 0.07
    edge = LINE * R                       # border matches the outer wreath line
    return [
        f'<rect x="{x0:.3f}" y="{top:.3f}" width="{BANNER_W:.3f}" height="{BANNER_L:.3f}" fill="{ROSE}" stroke="{GOLD_DARK}" stroke-width="{edge:.3f}"/>',
        f'<rect x="{x0 + inset:.3f}" y="{top + inset + edge:.3f}" width="{BANNER_W - 2 * inset:.3f}" '
        f'height="{BANNER_L - 2 * inset - edge:.3f}" fill="none" stroke="{GOLD}" stroke-width="{RING_W * 0.18:.3f}"/>',
    ]


DEFS = f"""<defs>
  <clipPath id="drop"><circle r="{RHO:.3f}"/></clipPath>
  <!-- a prism throw: the spectrum, softly blended -->
  <linearGradient id="prism" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e5484d" stop-opacity="0"/>
    <stop offset=".12" stop-color="#e5484d"/>
    <stop offset=".3" stop-color="#f5a524"/>
    <stop offset=".45" stop-color="#f2dc4a"/>
    <stop offset=".6" stop-color="#46b97a"/>
    <stop offset=".75" stop-color="#3b8fe0"/>
    <stop offset=".9" stop-color="#8a5cd6"/>
    <stop offset="1" stop-color="#8a5cd6" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".3" stop-color="#fff"/>
    <stop offset=".7" stop-color="#fff"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
    <feGaussianBlur stdDeviation="{RHO * 0.05:.3f}"/>
  </filter>
  <mask id="prism-fade" maskContentUnits="objectBoundingBox">
    <rect width="1" height="1" fill="url(#fade)"/>
  </mask>
  <!-- clear water: shaded at the top, light gathered at the bottom -->
  <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cfc8ba"/>
    <stop offset=".55" stop-color="#efebe2"/>
    <stop offset="1" stop-color="#ffffff"/>
  </linearGradient>
</defs>"""


def symbol(with_banner):
    body = []
    body += ring()
    if with_banner:
        body += banner()
    for r in WREATHS:
        lines, width = wreath(r)
        body += lines
    body += dew_drop()
    pad = RING_W
    half = RING_R + RING_W / 2 + pad
    height = (BANNER_TOP + BANNER_L + pad if with_banner else half) + half
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
