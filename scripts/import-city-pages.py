#!/usr/bin/env python3
"""Convert the approved CityAuction city landing pages (static HTML) into typed
content modules under src/content/cities/.

Usage: python3 scripts/import-city-pages.py "<folder with CityAuction_*_Final dirs>"

Every page in a batch shares one template, so the extractor reads elements by
class name and writes one TypeScript module per city plus an index.
"""
import html
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlparse

VOID = {"meta", "link", "img", "br", "input", "hr", "source"}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    @property
    def classes(self):
        return (self.attrs.get("class") or "").split()

    def iter(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.iter()

    def find_all(self, tag=None, cls=None, **attrs):
        out = []
        for n in self.iter():
            if tag and n.tag != tag:
                continue
            if cls and cls not in n.classes:
                continue
            if any(n.attrs.get(k) != v for k, v in attrs.items()):
                continue
            out.append(n)
        return out

    def find(self, tag=None, cls=None, **attrs):
        r = self.find_all(tag, cls, **attrs)
        return r[0] if r else None

    def kids(self, tag=None, cls=None):
        return [c for c in self.children if isinstance(c, Node) and (not tag or c.tag == tag) and (not cls or cls in c.classes)]

    def text(self):
        parts = []
        for c in self.children:
            parts.append(c.text() if isinstance(c, Node) else c)
        return "".join(parts)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root", {})
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def t(node):
    if node is None:
        return ""
    s = re.sub(r"\s+", " ", node.text()).strip()
    return re.sub(r"\s*[↗→]$", "", s).strip()


def mail_subject(href):
    if not href or not href.startswith("mailto:"):
        return ""
    return parse_qs(urlparse(href).query).get("subject", [""])[0]


def site_path(href):
    """https://cityauction.in/customs-auction -> /customs-auction"""
    if href and href.startswith("https://cityauction.in"):
        p = urlparse(href)
        return (p.path or "/") + (f"#{p.fragment}" if p.fragment else "")
    return href


def ad_slot(box):
    a = box.find("a")
    return {
        "tag": t(box.find(cls="adtag")),
        "headline": t(box.find("strong") or box.find(cls="adbig")),
        "body": t(box.find("p")),
        "linkLabel": t(a),
        "mailSubject": mail_subject(a.attrs.get("href") if a else ""),
    }


def section_head(sec):
    head = sec.find(cls="section-head") or sec
    return {"eyebrow": t(head.find(cls="eyebrow")), "title": t(head.find("h2")), "description": t(head.find("p"))}


def extract(path):
    b = Builder()
    b.feed(path.read_text(encoding="utf-8"))
    doc = b.root
    meta = lambda **kw: (doc.find("meta", **kw) or Node("x", {})).attrs.get("content", "")

    canonical = doc.find("link", rel="canonical").attrs["href"]
    slug = urlparse(canonical).path.strip("/")
    ld = json.loads(doc.find("script", type="application/ld+json").text())
    crumbs = ld["@graph"][1]["itemListElement"]

    hero = doc.find("section", cls="hero")
    h1 = hero.find("h1")
    em = h1.find("em")
    exp = doc.find("section", cls="experience-band")
    quick = doc.find("section", cls="quick-strip")
    ads_top = doc.find_all(cls="adheader")
    discover = doc.find("section", id="discover")
    finder = discover.find("form")
    intro = discover.find(cls="introline")
    results = discover.find("section", id="property-results")
    side = discover.find("aside", cls="side")
    sections = doc.find_all("section", cls="section")
    loc_sec = next(s for s in sections if s.find(cls="localities"))
    services = doc.find("section", cls="services-shell")
    guidance = next(s for s in sections if s.find(cls="info-grid"))
    banks = doc.find("section", id="banks")
    guide = next(s for s in sections if s.find(cls="seo-copy"))
    whatsapp = doc.find("a", cls="float-contact")

    guide_blocks = []
    for n in guide.find(cls="seo-copy").kids():
        if n.tag == "h3":
            guide_blocks.append({"heading": t(n), "paragraphs": [], "bullets": []})
        elif guide_blocks and n.tag == "p":
            guide_blocks[-1]["paragraphs"].append(t(n))
        elif guide_blocks and n.tag == "ul":
            guide_blocks[-1]["bullets"].extend(t(li) for li in n.find_all("li"))

    panels = []
    for art in services.find_all("article", cls="service-panel"):
        art_side, body = art.find(cls="service-art"), art.find(cls="service-body")
        btn = body.find("a", cls="service-btn")
        panels.append({
            "index": t(art_side.find(cls="service-index")),
            "title": t(art_side.find("h3")),
            "summary": t(art_side.find("p")),
            "mark": t(art_side.find(cls="service-mark")),
            "audience": t(body.find("h4")),
            "paragraphs": [t(p) for p in body.kids("p")],
            "tags": [t(s) for s in body.find(cls="service-tags").kids("span")],
            "actionLabel": t(btn),
            "mailSubject": mail_subject(btn.attrs.get("href")),
            "actionNote": t(body.find(cls="service-action").find("small")),
        })

    loc_note = loc_sec.find("p", cls="muted")
    selects = finder.find_all("select")

    return slug, {
        "slug": slug,
        "city": crumbs[1]["name"],
        "seo": {
            "title": t(doc.find("title")),
            "description": meta(name="description"),
            "ogTitle": meta(property="og:title"),
            "ogDescription": meta(property="og:description"),
            "schemaName": ld["@graph"][0]["name"],
            "schemaDescription": ld["@graph"][0]["description"],
        },
        "breadcrumb": t(hero.find(cls="crumb")).split("/")[-1].strip(),
        "hero": {
            "eyebrow": t(hero.find(cls="eyebrow")),
            "titleLead": re.sub(r"\s+", " ", "".join(c for c in h1.children if isinstance(c, str))).strip(),
            "titleEmphasis": t(em),
            "description": t(hero.find("p")),
            "experienceLine": t(hero.find(cls="experience-line")),
            "ctas": [{"label": t(a), "href": site_path(a.attrs["href"])} for a in hero.find(cls="herocta").kids("a")],
            "highlights": [t(d) for d in hero.find(cls="metrics").kids("div")],
        },
        "experience": {
            "eyebrow": t(exp.find(cls="eyebrow")),
            "title": t(exp.find(cls="experience-title")),
            "description": t(exp.find(cls="experience-description")),
            "steps": [{"label": t(s.find("b")), "text": re.sub(r"\s+", " ", "".join(c for c in s.children if isinstance(c, str))).strip()} for s in exp.find(cls="experience-proof").kids("span")],
        },
        "quickLinks": {
            "label": t(quick.find(cls="quick-label")),
            "links": [{"label": t(a), "href": site_path(a.attrs["href"])} for a in quick.find_all("a", cls="quick-pill")],
        },
        "ads": {
            "header": ad_slot(ads_top[0]),
            "prefooter": ad_slot(ads_top[-1]),
            "rail": {
                "eyebrow": t(side.find(cls="rail-head").find(cls="eyebrow")),
                "title": t(side.find(cls="rail-head").find("h3")),
                "description": t(side.find(cls="rail-head").find("p")),
                "slots": [ad_slot(box) for box in side.find_all(cls="adbox")],
                "note": t(side.find(cls="railnote")),
            },
        },
        "finder": {
            **section_head(discover),
            "localityLabel": t(finder.find("label")),
            "localityAll": t(selects[0].find("option")),
            "propertyTypes": [{"label": t(o), "value": o.attrs.get("value", "")} for o in selects[1].find_all("option") if o.attrs.get("value")],
            "lenderPlaceholder": finder.find("input").attrs.get("placeholder", ""),
            "footnote": t(finder.find(cls="search-foot").find("span")),
        },
        "categories": {
            "eyebrow": t(intro.find(cls="eyebrow")),
            "title": t(intro.find("h2")),
            "description": t(intro.find("p")),
            "items": [{"label": t(c.find(cls="num")), "title": t(c.find("h3")), "description": t(c.find("p")), "linkLabel": t(c.find(cls="arrow"))} for c in intro.parent.find(cls="cat-grid").kids("a")],
        },
        "listings": {
            "eyebrow": t(results.find(cls="eyebrow")),
            "title": t(results.find("h2")),
            "description": t(results.find(cls="listinghead").find("p")),
            "disclaimer": t(results.find(cls="source-disclaimer")),
            "marketTitle": t(results.find(cls="marketcall").find("strong")),
            "marketDescription": t(results.find(cls="marketcall").find("p")),
            "marketLabel": t(results.find(cls="marketcall").find("a")),
        },
        "localities": {
            **section_head(loc_sec),
            "items": [t(a) for a in loc_sec.find(cls="localities").kids("a")],
            "note": t(loc_note),
        },
        "services": {
            "kicker": t(services.find(cls="service-kicker")),
            "title": t(services.find("h2")),
            "description": t(services.find(cls="service-lead")),
            "panels": panels,
            "footnote": t(services.find(cls="service-footnote")),
        },
        "guidance": {
            **section_head(guidance),
            "items": [{"label": t(i.find("b")), "title": t(i.find("h3")), "description": t(i.find("p"))} for i in guidance.find(cls="info-grid").kids("div")],
        },
        "institutions": {
            "eyebrow": t(banks.find(cls="eyebrow")),
            "title": t(banks.find("h2")),
            "description": t(banks.find("p")),
            "actionLabel": t(banks.find("a", cls="btn")),
            "mailSubject": mail_subject(banks.find("a", cls="btn").attrs["href"]),
            "points": [re.sub(r"^\d+\.\s*", "", t(d)) for d in banks.find(cls="bankpoints").kids("div")],
        },
        "guide": {**section_head(guide), "id": guide.attrs.get("id", ""), "blocks": guide_blocks},
        "whatsappText": parse_qs(urlparse(whatsapp.attrs["href"]).query).get("text", [""])[0],
    }


def main():
    src = Path(sys.argv[1]).expanduser()
    out = Path(__file__).resolve().parent.parent / "src" / "content" / "cities"
    out.mkdir(parents=True, exist_ok=True)
    slugs = []
    for page in sorted(src.glob("CityAuction_*/index.html")):
        slug, data = extract(page)
        ident = re.sub(r"\W", "", slug.title())
        body = json.dumps(data, ensure_ascii=False, indent=2)
        (out / f"{slug}.ts").write_text(
            f'import type {{ CityPage }} from "./types";\n\n'
            f"// Generated by scripts/import-city-pages.py from {page.parent.name}. Edit the source page and re-run.\n"
            f"export const {ident}: CityPage = {body};\n",
            encoding="utf-8",
        )
        slugs.append((slug, ident))
        print(f"{slug:12} {data['hero']['titleLead']} {data['hero']['titleEmphasis']}  ({len(data['localities']['items'])} localities)")
    imports = "\n".join(f'import {{ {i} }} from "./{s}";' for s, i in slugs)
    entries = "\n".join(f"  {i}," for _, i in slugs)
    (out / "index.ts").write_text(
        f'import type {{ CityPage }} from "./types";\n{imports}\n\n'
        f"// Generated by scripts/import-city-pages.py.\nexport const CITY_PAGES: CityPage[] = [\n{entries}\n];\n\n"
        "export function getCityPage(slug: string): CityPage | undefined {\n"
        "  return CITY_PAGES.find((page) => page.slug === slug);\n}\n\n"
        'export type { CityPage } from "./types";\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
