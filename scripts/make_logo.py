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
G = 0.70                                 # middle wreath radius, as a fraction of R
THETA = 0.0                              # symmetry axis for the glint: 0 = up
LINE = 0.045                             # outer wreath line width, as a fraction of R
# Line widths (in R = 100 units): outer, middle, inner. The inner two are
# heavier than strict proportion so they hold their own beside the outer.
WIDTHS = (LINE * R, 4.0, 3.6)

DROP_OUT = 0.38 * R                      # dew drop's outer edge (rim included)
T = 0.06 * R                             # dew drop rim width
RHO = DROP_OUT - T                       # clear water inside the rim

# The inner wreath is fitted around the drop: the inner edge of its lines
# (flat sides at S*r, less half the line width) just touches the rim.
R_INNER = (DROP_OUT + WIDTHS[2] / 2) / S
WREATHS = tuple(zip((R, G * R, R_INNER), WIDTHS))

# Keep the wreaths from crossing: the inner wreath's points (with their
# mitred tips) must stay inside the middle wreath's flat sides.
_tip = R_INNER + 0.62 * WIDTHS[2]
_mid_side = S * G * R - WIDTHS[1] / 2
_mid_tip = G * R + 0.62 * WIDTHS[1]
_outer_side = S * R - WIDTHS[0] / 2
assert _mid_tip < _outer_side, f"middle wreath points {_mid_tip:.1f} reach outer wreath {_outer_side:.1f}"
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
BANNER_BOTTOM = BANNER_TOP + BANNER_L

OUTLINE = RING_W * 0.9                   # the disk's red outline
# The banner runs up behind the ring and peeps out above it by three times
# the width of the dew drop's outline.
BANNER_UP = -(RING_R + RING_W / 2 + OUTLINE / 2 + 3 * T)
SEAM_CORNER = 0.09                        # cut-out corner radius, as a fraction of banner width

INK, FIELD, RING = "#1c1a2e", "#fbf6ea", "#ffffff"
GOLD, GOLD_DARK, ROSE = "#e8cf98", "#b8893a", "#8a4b55"
PURPLE = "#4b3f7a"                      # banner edge on light backgrounds


def pt(r, deg):
    a = math.radians(deg)
    return r * math.sin(a), -r * math.cos(a)


def pentagon(r, alpha, width):
    pts = " ".join(f"{x:.3f},{y:.3f}" for x, y in (pt(r, alpha + 72 * k) for k in range(5)))
    return f'<polygon points="{pts}" fill="none" stroke="{INK}" stroke-width="{width:.3f}" stroke-linejoin="miter"/>'


def wreath(r, width):
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
STREAK_OPACITY = 0.12                     # barely discernible over the ombre
FILL_OPACITY = 0.30                       # ombre between streaks: almost as strong
FILL_STEP = 2                             # degrees per blended slice


def mix(c1, c2, t):
    a = [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(c2[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(a, b))


def ombre():
    """Fill the gaps: each 36 degree span blends from one streak's colour
    to the next, so the whole drop is coloured."""
    out = []
    for k, (_, c1) in enumerate(STREAKS):
        c2 = STREAKS[(k + 1) % len(STREAKS)][1]
        for d in range(0, 36, FILL_STEP):
            a0, a1 = 36 * k + d, 36 * k + d + FILL_STEP
            x1, y1 = pt(RHO * 1.05, a0 - 0.3)
            x2, y2 = pt(RHO * 1.05, a1 + 0.3)
            out.append(f'<path d="M0,0 L{x1:.3f},{y1:.3f} L{x2:.3f},{y2:.3f} Z" fill="{mix(c1, c2, (d + FILL_STEP / 2) / 36)}"/>')
    return out


def streaks():
    out = []
    for k, (_, colour) in enumerate(STREAKS):
        a = 36 * k
        x1, y1 = pt(RHO * 1.05, a - STREAK_HALF_ANGLE)
        x2, y2 = pt(RHO * 1.05, a + STREAK_HALF_ANGLE)
        out.append(f'<path d="M0,0 L{x1:.3f},{y1:.3f} L{x2:.3f},{y2:.3f} Z" fill="{colour}"/>')
    return out


def dew_drop():
    """Clear water tinted all over with an ombre between ten coloured streaks.
    The streaks follow where the illusory rays
    cross it, fading toward the centre; a small round glint sits on the
    symmetry axis."""
    gx, gy = pt(RHO * 0.5, THETA)
    return (
        [
            f'<circle r="{RHO:.3f}" fill="url(#water)"/>',
            f'<g clip-path="url(#drop)" mask="url(#streak-fade)" filter="url(#soft)" opacity="{FILL_OPACITY}">',
        ]
        + ombre()
        + [
            "</g>",
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
        f'<circle r="{RING_R:.3f}" fill="none" stroke="{RING}" stroke-width="{RING_W:.3f}"/>',
        # outline of the disk, in the banner's red
        f'<circle r="{RING_R + RING_W / 2:.3f}" fill="none" stroke="{ROSE}" stroke-width="{OUTLINE:.3f}"/>',
    ]


def concave_rect(x0, y0, x1, y1, r):
    """A rectangle whose corners are cut out by quarter circles."""
    return (
        f"M{x0 + r:.3f},{y0:.3f} H{x1 - r:.3f} A{r:.3f},{r:.3f} 0 0 0 {x1:.3f},{y0 + r:.3f} "
        f"V{y1 - r:.3f} A{r:.3f},{r:.3f} 0 0 0 {x1 - r:.3f},{y1:.3f} "
        f"H{x0 + r:.3f} A{r:.3f},{r:.3f} 0 0 0 {x0:.3f},{y1 - r:.3f} "
        f"V{y0 + r:.3f} A{r:.3f},{r:.3f} 0 0 0 {x0 + r:.3f},{y0:.3f} Z"
    )


def banner(edge_colour):
    top, bottom = BANNER_UP, BANNER_BOTTOM
    x0, x1 = -BANNER_W / 2, BANNER_W / 2
    inset = BANNER_W * 0.07
    edge = LINE * R                       # border matches the outer wreath line
    seam = concave_rect(x0 + inset, top + inset, x1 - inset, bottom - inset, BANNER_W * SEAM_CORNER)
    return [
        f'<rect x="{x0:.3f}" y="{top:.3f}" width="{BANNER_W:.3f}" height="{bottom - top:.3f}" fill="{ROSE}" stroke="{edge_colour}" stroke-width="{edge:.3f}"/>',
        # the inside seam, white to match the disk, with cut-out corners
        f'<path d="{seam}" fill="none" stroke="{FIELD}" stroke-width="{RING_W * 0.18:.3f}"/>',
    ]


DEFS = f"""<defs>
  <clipPath id="drop"><circle r="{RHO:.3f}"/></clipPath>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="{RHO * 0.035:.3f}"/>
  </filter>
  <!-- streaks fade in from the centre toward the rim -->
  <radialGradient id="streak-ramp" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="{RHO:.3f}">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
    <stop offset=".7" stop-color="#fff" stop-opacity=".9"/>
    <stop offset="1" stop-color="#fff"/>
  </radialGradient>
  <mask id="streak-fade" maskUnits="userSpaceOnUse" x="{-RHO:.3f}" y="{-RHO:.3f}" width="{2 * RHO:.3f}" height="{2 * RHO:.3f}">
    <circle r="{RHO:.3f}" fill="url(#streak-ramp)"/>
  </mask>
</defs>"""


def symbol(with_banner, light_background=False):
    body = []
    if with_banner:
        # The banner hangs behind everything. Its edge is gold on the dark
        # purple background and purple on light backgrounds.
        body += banner(PURPLE if light_background else GOLD_DARK)
    body += ring()
    for r, w in WREATHS:
        lines, width = wreath(r, w)
        body += lines
    body += dew_drop()
    pad = RING_W
    half = RING_R + RING_W / 2 + OUTLINE / 2 + pad
    top = min(-half, BANNER_UP - LINE * R / 2 - pad) if with_banner else -half
    bottom = BANNER_BOTTOM + LINE * R / 2 + pad if with_banner else half
    view = f"{-half:.2f} {top:.2f} {2 * half:.2f} {bottom - top:.2f}"
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-label="Sisters of Sonder">\n'
        + DEFS + "\n" + "\n".join(body) + "\n</svg>\n"
    )


with open("public/logo.svg", "w", encoding="utf8") as f:
    f.write(symbol(with_banner=True))
with open("public/logo-light.svg", "w", encoding="utf8") as f:
    f.write(symbol(with_banner=True, light_background=True))
with open("public/emblem.svg", "w", encoding="utf8") as f:
    f.write(symbol(with_banner=False))
print(f"banner {BANNER_W:.1f} x {BANNER_L:.1f}, ring diameter {RING_D:.1f}")
