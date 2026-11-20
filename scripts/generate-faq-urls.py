"""Allocate readable FAQ URLs once; preserve existing slugs on later copy edits."""
import json
import re
import unicodedata
from pathlib import Path

root = Path(__file__).resolve().parents[1]
library = json.loads((root / 'src/content/faqs/library.json').read_text())
path = root / 'src/content/faqs/urls.json'
existing = json.loads(path.read_text()) if path.exists() else {}

def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')

def question_slug(question):
    text = question.rstrip('?')
    text = re.sub(r' in an auction property transaction$', '', text, flags=re.I)
    text = re.sub(r'^What should I know about (.+)$', r'what is \1', text, flags=re.I)
    text = re.sub(r'^Why does (.+) matter to an auction buyer$', r'why \1 matters', text, flags=re.I)
    text = re.sub(r'^What should I verify about (.+) before bidding$', r'checking \1 before bidding', text, flags=re.I)
    text = re.sub(r'^Can (.+) change the risk or value of an auction property$', r'\1 risks and value', text, flags=re.I)
    text = re.sub(r'^Could (.+) create a problem after I become the successful bidder$', r'\1 risks after winning', text, flags=re.I)
    text = re.sub(r'^Which authority or stakeholder should I approach about (.+)$', r'who to contact about \1', text, flags=re.I)
    text = re.sub(r'^How would you investigate (.+) before placing an auction bid$', r'checking \1 before bidding', text, flags=re.I)
    return slugify(text)

result = {}
for kind, rows, field in [('questions', library['items'], 'question'), ('topics', library['topics'], 'title')]:
    allocated = dict(existing.get(kind, {}))
    used = set(allocated.values()) | {'topics', 'categories'}
    assert len(allocated.values()) == len(set(allocated.values())), 'Duplicate existing URL'
    for row in rows:
        if row['id'] in allocated:
            continue
        slug = question_slug(row[field]) if kind == 'questions' else slugify(row[field])
        if len(slug) > 100:
            slug = slug[:100].rsplit('-', 1)[0]
        candidate = slug
        if candidate in used:
            candidate = f'{slug}-{row["number"]}'
        assert candidate not in used and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', candidate), row['id']
        allocated[row['id']] = candidate
        used.add(candidate)
    result[kind] = allocated
path.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({kind: len(values) for kind, values in result.items()}))
