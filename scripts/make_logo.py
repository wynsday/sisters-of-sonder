"""Draws the Sisters of Sonder emblem: a ring of five sets of two braids
(crossings marked with light dots for a scintillating effect), a round
water drop with a thick border filling the inner space, and a heraldic
banner hanging from the outer ring. Writes public/logo.svg (with banner)
and public/emblem.svg (ring and drop only, for small sizes)."""
import math

CX, CY = 120, 120
R_IN, R_OUT = 78, 112          # dark band holding the braids
BRAIDS = (87, 103)             # centre radius of each braid in a set
AMP = 5.5                      # braid strand amplitude
SETS, GAP = 5, 7               # five sets, gap in degrees between sets
TWISTS = 6                     # full twists per braid per set
DROP_R = 44                    # water drop radius; border fills to R_IN

NIGHT, GOLD, GOLD_DARK = "#1c1a2e", "#e8cf98", "#b8893a"
STRAND, DOT = "#8f8aa6", "#ffffff"
ROSE = "#8a4b55"


def pt(r, deg):
    a = math.radians(deg - 90)
    return CX + r * math.cos(a), CY + r * math.sin(a)


def strand(r0, sign, start, span):
    pts = []
    steps = 160
    for i in range(steps + 1):
        t = i / steps
        deg = start + span * t
        r = r0 + sign * AMP * math.sin(2 * math.pi * TWISTS * t)
        pts.append(pt(r, deg))
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts)


def ring():
    out = [
        f'<circle cx="{CX}" cy="{CY}" r="{(R_IN + R_OUT) / 2}" fill="none" stroke="{NIGHT}" stroke-width="{R_OUT - R_IN}"/>'
    ]
    span = 360 / SETS - GAP
    for s in range(SETS):
        start = s * 360 / SETS + GAP / 2
        for r0 in BRAIDS:
            for sign in (1, -1):
                out.append(f'<path d="{strand(r0, sign, start, span)}" fill="none" stroke="{STRAND}" stroke-width="2.6" stroke-linecap="round"/>')
            # light dots where the two strands cross
            for k in range(2 * TWISTS + 1):
                x, y = pt(r0, start + span * k / (2 * TWISTS))
                out.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="2.3" fill="{DOT}"/>')
        # a gold bead marks the gap between sets
        bx, by = pt((R_IN + R_OUT) / 2, s * 360 / SETS)
        out.append(f'<circle cx="{bx:.2f}" cy="{by:.2f}" r="4.5" fill="{GOLD}"/>')
    out.append(f'<circle cx="{CX}" cy="{CY}" r="{R_OUT}" fill="none" stroke="{GOLD_DARK}" stroke-width="3"/>')
    out.append(f'<circle cx="{CX}" cy="{CY}" r="{R_IN}" fill="none" stroke="{GOLD_DARK}" stroke-width="2"/>')
    return out


def drop():
    border = R_IN - 1 - DROP_R
    return [
        f'<circle cx="{CX}" cy="{CY}" r="{DROP_R + border / 2}" fill="none" stroke="{GOLD}" stroke-width="{border}"/>',
        f'<circle cx="{CX}" cy="{CY}" r="{DROP_R}" fill="url(#water)"/>',
        f'<circle cx="{CX}" cy="{CY}" r="{DROP_R}" fill="none" stroke="{GOLD_DARK}" stroke-width="2"/>',
        f'<ellipse cx="{CX - 15}" cy="{CY - 17}" rx="11" ry="7" transform="rotate(-35 {CX - 15} {CY - 17})" fill="#ffffff" fill-opacity=".55"/>',
        f'<circle cx="{CX + 18}" cy="{CY + 20}" r="3" fill="#ffffff" fill-opacity=".35"/>',
    ]


DEFS = """<defs>
  <radialGradient id="water" cx="38%" cy="35%" r="70%">
    <stop offset="0" stop-color="#a9d6ee"/>
    <stop offset=".55" stop-color="#3f86b5"/>
    <stop offset="1" stop-color="#1f4f78"/>
  </radialGradient>
</defs>"""


def banner():
    top, bottom, half = CY + R_OUT - 14, 318, 46
    x0, x1 = CX - half, CX + half
    return [
        # hanging cords from the ring
        f'<path d="M{x0 + 12},{top} V{top + 14} M{x1 - 12},{top} V{top + 14}" stroke="{GOLD_DARK}" stroke-width="3"/>',
        f'<rect x="{x0}" y="{top + 12}" width="{2 * half}" height="{bottom - top - 12}" fill="{ROSE}" stroke="{GOLD_DARK}" stroke-width="3"/>',
        f'<rect x="{x0 + 7}" y="{top + 19}" width="{2 * half - 14}" height="{bottom - top - 26}" fill="none" stroke="{GOLD}" stroke-width="1.2"/>',
        f'<rect x="{x0 - 6}" y="{top + 8}" width="{2 * half + 12}" height="7" rx="3.5" fill="{GOLD_DARK}"/>',
    ]


def svg(width, height, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="Sisters of Sonder">\n'
        + DEFS + "\n" + "\n".join(body) + "\n</svg>\n"
    )


with open("public/logo.svg", "w", encoding="utf8") as f:
    f.write(svg(240, 324, banner() + ring() + drop()))
with open("public/emblem.svg", "w", encoding="utf8") as f:
    f.write(svg(240, 240, ring() + drop()))
print("wrote public/logo.svg and public/emblem.svg")
