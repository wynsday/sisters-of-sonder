"""Imports the Glossary of Potentially Harmful Behaviors from its .docx.

Anything in italics is left out (those are notes, not glossary text).
Writes:
  lib/glossary.json          the page content
  supabase/glossary.sql      index entries so stories can be tagged with an entry

Run: python scripts/import_glossary.py [path-to-docx]
"""
import json
import re
import sys
import zipfile
from pathlib import Path

SRC = sys.argv[1] if len(sys.argv) > 1 else str(
    Path.home() / "Downloads" / "Glossary_of_Behaviors_to_Avoid.docx"
)
ROOT = Path(__file__).resolve().parent.parent


def has(tag, xml):
    return bool(re.search(r"<w:%s/>|<w:%s w:val=\"(1|true|on)\"/>" % (tag, tag), xml))


z = zipfile.ZipFile(SRC)
doc = z.read("word/document.xml").decode("utf8")
styles_xml = z.read("word/styles.xml").decode("utf8")
styles = {
    m.group(1): (has("i", m.group(0)), has("b", m.group(0)))
    for m in re.finditer(r'<w:style [^>]*w:styleId="([^"]+)".*?</w:style>', styles_xml, re.S)
}


# Wording changes the Sisters asked for on the site (document text -> site text).
REWORDS = {
    "Knowing these words": "Knowing these items",
    "Knowing these terms": "Knowing these items",
}

def clean(t):
    t = t.replace("�", "'").replace(" ", " ")
    t = re.sub(r"\s+", " ", t).strip()
    for old, new in REWORDS.items():
        t = t.replace(old, new)
    return t


QUOTES = re.compile(r"[“”‘’\"']+")

paras = []  # (style, bold_text, plain_text) with italics removed
for p in re.findall(r"<w:p[ >].*?</w:p>", doc, re.S):
    ps = re.search(r'w:pStyle w:val="([^"]+)"', p)
    ps = ps.group(1) if ps else "Normal"
    p_i, p_b = styles.get(ps, (False, False))
    runs = []  # (text, italic, bold)
    for r in re.findall(r"<w:r[ >].*?</w:r>", p, re.S):
        t = "".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", r))
        if not t:
            continue
        rpr = re.search(r"<w:rPr>.*?</w:rPr>", r, re.S)
        rpr = rpr.group(0) if rpr else ""
        rs = re.search(r'w:rStyle w:val="([^"]+)"', rpr)
        r_i, r_b = styles.get(rs.group(1), (False, False)) if rs else (False, False)
        italic = (has("i", rpr) or r_i or p_i) and not re.search(r'<w:i w:val="(0|false)"/>', rpr)
        runs.append((t, italic, has("b", rpr) or r_b or p_b))

    # A lone italic quotation mark beside regular text is a formatting slip,
    # not a note, so it is kept with the text it encloses.
    def wordy(i):
        return 0 <= i < len(runs) and not runs[i][1] and re.search(r"[A-Za-z0-9]", runs[i][0])

    bold, plain = "", ""
    for i, (t, italic, is_bold) in enumerate(runs):
        if italic and not (QUOTES.fullmatch(t.strip()) and (wordy(i - 1) or wordy(i + 1))):
            continue
        if is_bold and not italic and not plain.strip():
            bold += t
        else:
            plain += t
    bold, plain = clean(bold), clean(plain)
    if bold or plain:
        paras.append((ps, bold, plain))

# Lines left out of the page at the Sisters' request (matched by how they begin).
SKIP_PREFIXES = ("Every entry", "Items", "Identifying")

SECTION = re.compile(r"^Section (One|Two|Three|Four|Five|Six|Seven)\. (.+?)\.?$")
ENTRY = re.compile(r"^(\d+)\.\s*(.+?)\.?$")

title = ""
preface = []          # [{heading, paragraphs, list}]
sections = []         # [{id, title, intro, summary, range, entries}]
closing = []          # [{heading, paragraphs}]
contents = {}         # section word -> (summary text)
block = None
mode = "preface"
pending_contents = None

for style, bold, plain in paras:
    text = (bold + " " + plain).strip()
    if not title:
        title = re.sub(r"^Addendum [A-Z]:\s*", "", text)
        continue
    if style == "Heading1" and not text.startswith("Section"):
        if text == "Contents":
            mode = "contents"
            continue
        block = {"heading": text, "paragraphs": [], "list": []}
        (closing if sections else preface).append(block)
        mode = "closing" if sections else "preface"
        continue
    if mode == "contents" and style not in ("Heading1", "NormalWeb"):
        m = re.match(r"^Section (\w+)\.", bold)
        if m:
            pending_contents = m.group(1)
            contents[pending_contents] = {"summary": "", "range": re.sub(r"^.*Entries\s*", "", text).rstrip(".")}
        elif pending_contents:
            contents[pending_contents]["summary"] += (" " if contents[pending_contents]["summary"] else "") + text
        continue
    m = SECTION.match(text) if style in ("Heading1", "NormalWeb") else None
    if m and not ENTRY.match(bold or "x"):
        word, name = m.group(1), m.group(2)
        info = contents.get(word, {"summary": "", "range": ""})
        sections.append({
            "id": f"section-{word.lower()}",
            "title": f"Section {word}. {name}",
            "summary": info["summary"],
            "range": info["range"],
            "intro": [],
            "entries": [],
        })
        mode = "sections"
        continue
    if mode == "sections":
        em = ENTRY.match(bold) if bold else None
        if em:
            sections[-1]["entries"].append({"n": int(em.group(1)), "term": em.group(2), "text": plain})
        elif not sections[-1]["entries"]:
            sections[-1]["intro"].append(text)
        elif plain:  # a continuation paragraph of the last entry
            sections[-1]["entries"][-1]["text"] += " " + plain
        continue
    if block is not None:
        if text.startswith(SKIP_PREFIXES):
            continue
        (block["list"] if style == "ListParagraph" else block["paragraphs"]).append(text)

# Section intros that only repeat the Contents summary are dropped.
for s in sections:
    s["intro"] = [p for p in s["intro"] if p != s["summary"]]

out = {"title": title, "preface": preface, "sections": sections, "closing": closing}
(ROOT / "lib" / "glossary.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf8")

rows = []
for s in sections:
    for e in s["entries"]:
        label = f"{e['n']}. {e['term']}".replace("'", "''")
        rows.append(f"  ('g-{e['n']}', 'glossary', {e['n']}, '{label}')")
sql = (
    "-- Glossary entries as Hear My Voice index items. Generated by scripts/import_glossary.py.\n"
    "-- Run after schema.sql. Safe to re-run: existing entries are updated.\n"
    "insert into public.index_items (slug, kind, ordinal, label) values\n"
    + ",\n".join(rows)
    + "\non conflict (slug) do update set label = excluded.label, ordinal = excluded.ordinal;\n"
)
(ROOT / "supabase" / "glossary.sql").write_text(sql, encoding="utf8")

n = sum(len(s["entries"]) for s in sections)
print(f"{title}: {len(sections)} sections, {n} entries")
for s in sections:
    print(f"  {s['title']} ({len(s['entries'])}) {s['range']}")
