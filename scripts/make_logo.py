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


# One streak per illusory ray (the ten point directions, 0 + 36k), each a
# single colour, clockwise from the top.
STREAKS = [
    ("red", "#e5484d"), ("orange", "#f07a2a"), ("orange yellow", "#f5a524"),
    ("yellow", "#efd23f"), ("green", "#46b97a"), ("teal", "#24a8a0"),
    ("blue", "#3b8fe0"), ("indigo", "#4a4fc2"), ("purple", "#8048bf"),
    ("violet", "#b35ad6"),
]
STREAK_HALF_ANGLE = 4.5                   # degrees either side of the ray
STREAK_OPACITY = 0.45


def streaks():
    out = []
    for k, (_, colour) in enumerate(STREAKS):
        a = 36 * k
        x1, y1 = pt(RHO * 1.05, a - STREAK_HALF_ANGLE)
        x2, y2 = pt(RHO * 1.05, a + STREAK_HALF_ANGLE)
        out.append(f'<path d="M0,0 L{x1:.3f},{y1:.3f} L{x2:.3f},{y2:.3f} Z" fill="{colour}"/>')
    return out


def dew_drop():
    """Clear water. Faint coloured streaks follow where the illusory rays
    cross it, fading toward the centre; a small round glint sits on the
    symmetry axis."""
    gx, gy = pt(RHO * 0.5, THETA)
    return (
        [
            f'<circle r="{RHO:.3f}" fill="url(#water)"/>',
            f'<g clip-path="url(#drop)" mask="url(#streak-fade)" filter="url(#soft)" opacity="{STREAK_OPACITY}">',
        ]
        + streaks()
        + [
            "</g>",
            f'<circle r="{RHO + T / 2:.3f}" fill="none" stroke="{INK}" stroke-width="{T:.3f}"/>',
            f'<circle cx="{gx:.3f}" cy="{gy:.3f}" r="{RHO * 0.1:.3f}" fill="#ffffff"/>',
        ]
    )


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
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="{RHO * 0.035:.3f}"/>
  </filter>
  <!-- streaks fade in from the centre toward the rim -->
  <radialGradient id="streak-ramp" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="{RHO:.3f}">
    <stop offset=".15" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".75" stop-color="#fff" stop-opacity=".9"/>
    <stop offset="1" stop-color="#fff"/>
  </radialGradient>
  <mask id="streak-fade" maskUnits="userSpaceOnUse" x="{-RHO:.3f}" y="{-RHO:.3f}" width="{2 * RHO:.3f}" height="{2 * RHO:.3f}">
    <circle r="{RHO:.3f}" fill="url(#streak-ramp)"/>
  </mask>
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
