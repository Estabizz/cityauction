# CityAuction FAQ library

Source: the owner's `CityAuction_FAQs.docx`, supplied 3 November 2026.
All 2,505 numbered questions are retained across the original 78 topics.
The first 33 topics contain 35 questions each; topics 34–78 contain 30 each.
Question numbers are stable IDs (`faq-1` through `faq-2505`) for sharing and
source comparison. Only rendered page headers/footers, extraction artifacts
and layout whitespace were removed. Similar search-intent questions were not
silently merged or omitted. This is an import of owner-supplied guidance,
not an independent review of every legal or tax assertion.

`scripts/import-faq-library.py` reproduces the JSON from a complete text export
of the source. It validates numbering, topic boundaries, answer completeness
and page-artifact removal before writing. `extractedTextSha256` identifies
that complete text export, rather than the original Word file bytes.

The eight visitor-facing browsing categories are defined by the importer;
their labels/descriptions are in `src/lib/faq-library.ts`. Original topic names
remain in the topic selector and question cards. The data lives in the repo
and does not require a database migration or admin seed.

## Presentation and search

- `/resources/faqs` searches and paginates on the server, 20 entries per page.
  The 1.6 MB library is never imported by the client accordion.
- GET search works without JavaScript. Category links, topic selection and
  pagination preserve the relevant filters; empty states offer recovery.
- Multi-keyword search requires each meaningful token in a question/answer.
  A single keyword can also match its topic. Common abbreviations such as
  EMD, KYC and DSC have equivalent search terms. Title matches rank first.
- Individual answer URLs, e.g. `?question=faq-2505#faq-2505`, locate the right
  topic/page and open the requested answer, overriding stale filters.
- Accordion state uses stable source IDs; each results change resets state.
  Buttons expose expanded/controlled-region relationships and visible focus.
- Desktop category navigation is sticky with its own bounded overflow.
  Mobile categories scroll horizontally; search and content stack vertically.
- Search-result URLs are marked noindex/follow. Topic/page canonical URLs
  exclude the answer-link parameter. No rich-result or ranking promise is made.

Verification: 13 FAQ content/search/pagination/SSR/accessibility checks pass,
targeted ESLint and TypeScript pass, and the production build passes. The first
build encountered a transient Google Fonts fetch/parse error; the unchanged
font setup built successfully on retry. Six HTTP checks against the local
production server pass (default, search, answer link, empty results, category
and final page); the full JSON library is absent from browser JavaScript chunks.
No real browser visual or interaction test was available. No unrelated working-tree changes,
production data, hosting settings or deployment were modified for this task.
