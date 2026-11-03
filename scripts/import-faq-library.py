"""Import the complete, rendered text of CityAuction_FAQs.docx (no network access).

Usage: python3 scripts/import-faq-library.py /path/to/complete-source.txt
Only extraction artifacts are removed; source questions and answers are retained.
"""
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path

GROUPS = {
    "getting-started": [1, 2, 3, 4, 6, 22, 24, 27, 31, 32, 69, 70, 74, 75, 78],
    "bidding-emd": [5, 7, 8, 9, 28, 33, 48, 49, 50],
    "legal-possession": [10, 11, 12, 13, 14, 15, 16, 17, 52, 53, 54, 55, 56, 76, 77],
    "ownership": [19, 25, 34, 35, 36, 37, 57, 58, 64, 65, 66, 67, 68],
    "finance-tax": [20, 21, 26, 59, 60, 61, 62, 63],
    "asset-types": [23, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    "institutions": [18, 29, 51, 71, 72, 73],
    "cityauction": [30],
}
group_by_number = {n: group for group, numbers in GROUPS.items() for n in numbers}
assert sorted(group_by_number) == list(range(1, 79))
source = Path(sys.argv[1]).read_text()
clean = re.sub(r"<PARSED TEXT FOR PAGE:[^>]+>", "", source)
clean = "\n".join(line for line in clean.splitlines() if not any(marker in line for marker in (
    "CITYAUCTION | GOOGLE + BING", "CityAuction | Search-Intent Knowledge Library")))
headings = list(re.finditer(r"(?m)^(\d{1,2})\. (.+(?:\n[^\n]+){0,2})\n(?:CityAuction focus:|Bing long-tail focus:)", clean))
assert len(headings) == 78, f"Expected 78 topic headings; found {len(headings)}"
topics, items = [], []
for i, heading in enumerate(headings):
    number = int(heading[1])
    topic_id = f"topic-{number}"
    title = re.sub(r"\s+", " ", heading[2]).strip()
    section = clean[heading.end():headings[i + 1].start() if i + 1 < len(headings) else len(clean)]
    section = section.split("Research & Regulatory Source Foundation")[0]
    questions = list(re.finditer(r"(?m)^Q(\d+)\.\s*", section))
    for j, question in enumerate(questions):
        block = section[question.end():questions[j + 1].start() if j + 1 < len(questions) else len(section)]
        block = re.sub(r"\n\s*-specific legal advice\.\s*$", "", block)
        question_text, separator, answer = block.partition("?")
        assert separator, f"Q{question[1]} has no question mark"
        compact = lambda text: re.sub(r"\s+", " ", text).strip()
        items.append({"id": f"faq-{question[1]}", "number": int(question[1]), "topicId": topic_id,
                      "question": compact(question_text) + "?", "answer": compact(answer)})
    topics.append({"id": topic_id, "number": number, "title": title, "groupId": group_by_number[number], "count": len(questions)})
assert [item["number"] for item in items] == list(range(1, 2506)), "Missing or duplicate source question numbers"
assert all(topic["count"] == (35 if topic["number"] <= 33 else 30) for topic in topics), "Incorrect topic boundaries"
assert all(len(item["answer"]) > 40 for item in items), "Empty or truncated answer"
for item in items:
    assert not any(text in item["answer"] for text in ("Research & Regulatory", "Expansion Category Index", "PARSED TEXT", "CityAuction focus:", "Bing long-tail focus:", "CITYAUCTION |")), item["id"]
output = Path(__file__).resolve().parents[1] / "src/content/faqs/library.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({"source": {"name": "CityAuction_FAQs.docx", "questionCount": len(items), "topicCount": len(topics),
                                       "extractedTextSha256": hashlib.sha256(source.encode()).hexdigest()}, "topics": topics, "items": items}, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"questions": len(items), "topics": len(topics), "groups": dict(Counter(group_by_number.values())), "output": str(output)}))
