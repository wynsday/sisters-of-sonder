"""Checks that no sentence from the source document appears more than once
across the site pages. Run: python scripts/check_duplicates.py [path-to-docx]"""
import sys
import zipfile,re,glob,html
x=zipfile.ZipFile(sys.argv[1] if len(sys.argv) > 1 else r'C:/Users/wynsd/Downloads/Sacred_Aspirations.docx').read('word/document.xml').decode('utf8')
paras=[''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>',p)) for p in re.findall(r'<w:p[ >].*?</w:p>',x,re.S)]
def norm(t):
    t=html.unescape(t)
    t=re.sub(r'\{[^}]*\}','',t)
    t=re.sub(r'<[^>]+>',' ',t)
    t=re.sub(r'[^a-z0-9 ]+',' ',t.lower())
    return re.sub(r'\s+',' ',t).strip()
sents=[]
for p in paras:
    for s in re.split(r'(?<=[.;?!:])\s+',p):
        n=norm(s)
        if len(n)>40: sents.append(n)
files={f:norm(re.sub(r'\s+',' ',open(f,encoding='utf8').read())) for f in glob.glob('app/**/*.tsx',recursive=True)+glob.glob('components/*.tsx')}
dups=0
for s in dict.fromkeys(sents):
    where=[(f,t.count(s)) for f,t in files.items() if s in t]
    total=sum(c for _,c in where)
    if total>1:
        dups+=1; print(total, [f for f,_ in where], s[:80])
print('duplicates:',dups,'of',len(set(sents)))
missing=[s for s in dict.fromkeys(sents) if not any(s in t for t in files.values())]
print('not found verbatim:',len(missing))
for m in missing: print('  -',m[:100])
