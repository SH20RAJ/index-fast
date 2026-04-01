#!/usr/bin/env python3
"""Build a large outreach master list from docs/outreach-list.md and enrich agencies with public contacts."""

from __future__ import annotations

import csv
import html
import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
URL_RE = re.compile(r"(?:https?://)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:/[\w\-./?%&=+#]*)?", re.I)
CONTACT_PATH_RE = re.compile(r"/(contact|contact-us|get-in-touch|talk-to-us|book-demo|book-call)(/|\?|$)", re.I)


@dataclass
class Row:
    category: str
    name: str
    website: str
    contact_method: str
    public_email: str
    contact_page: str
    notes: str


def fetch_text(url: str, timeout: int = 15) -> tuple[str, str, str]:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="ignore")
            return body, resp.geturl(), resp.headers.get("Content-Type", "")
    except (HTTPError, URLError, TimeoutError, ValueError):
        return "", url, ""


def clean_host(url: str) -> str:
    h = urlparse(url).netloc.lower()
    if h.startswith("www."):
        h = h[4:]
    return h


def normalize_url(raw: str) -> str:
    raw = raw.strip()
    if not raw:
        return ""
    if raw.startswith("http://") or raw.startswith("https://"):
        return raw
    if "." in raw and " " not in raw:
        return "https://" + raw
    return ""


def valid_email(email: str) -> bool:
    lower = email.lower()
    if any(
        junk in lower
        for junk in ["example.com", "wixpress", "cloudflare", "sentry", "telegram.org", "email.com", "@localhost"]
    ):
        return False
    if lower in {"your@email.com", "you@example.com", "admin@example.com"}:
        return False
    if lower.startswith(("noreply@", "no-reply@", "donotreply@", "do-not-reply@")):
        return False
    if any(lower.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico", ".css", ".js"]):
        return False
    if any(tok in lower for tok in ["@2x", "@3x", "logo", "picture", "img-"]):
        return False
    return True


def html_unescape_deep(text: str) -> str:
    result = text
    for _ in range(3):
        next_text = html.unescape(result)
        if next_text == result:
            break
        result = next_text
    return result


def extract_emails(text: str) -> list[str]:
    decoded = html_unescape_deep(text)
    found = sorted(set(EMAIL_RE.findall(decoded)))
    emails = []
    seen = set()
    for item in found:
        email = item.strip().strip(".,;:()[]{}<>").lower()
        if not valid_email(email) or email in seen:
            continue
        seen.add(email)
        emails.append(email)
    return emails


def find_first_url(text: str) -> str:
    m = URL_RE.search(text or "")
    return m.group(0) if m else ""


def parse_outreach_list(path: Path) -> list[Row]:
    rows: list[Row] = []
    category = "General"

    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("## ") or line.startswith("### "):
            category = line.lstrip("# ").strip()
            continue

        if not line.startswith("|"):
            continue

        parts = [p.strip() for p in line.strip().split("|")[1:-1]]
        if not parts:
            continue

        first = parts[0].lower()
        if first in {"#", ":--", "contact", "platform", "tool", "channel"}:
            continue
        if set(first) <= {":", "-"}:
            continue

        # Generic table decoding across different sections
        if len(parts) >= 4 and parts[0].isdigit():
            name = re.sub(r"\*\*|`", "", parts[1]).strip()
            website_candidate = find_first_url(parts[2])
            contact_method = parts[3]
            notes = parts[4] if len(parts) > 4 else ""
        elif len(parts) >= 3:
            name = re.sub(r"\*\*|`", "", parts[0]).strip()
            website_candidate = find_first_url(parts[1])
            contact_method = parts[2]
            notes = parts[3] if len(parts) > 3 else ""
        else:
            continue

        website = normalize_url(website_candidate)

        rows.append(
            Row(
                category=category,
                name=name,
                website=website,
                contact_method=contact_method,
                public_email="",
                contact_page="",
                notes=notes,
            )
        )

    return rows


def enrich_agency_contacts(rows: list[Row]) -> None:
    # Only enrich rows that look like agencies or have website domains.
    for row in rows:
        if not row.website:
            continue

        host = clean_host(row.website)
        if not host:
            continue

        html, final_url, ctype = fetch_text(row.website, timeout=12)
        if not html or "text/html" not in ctype.lower():
            continue

        decoded_html = html_unescape_deep(html)
        emails = extract_emails(decoded_html)
        hrefs = re.findall(r"href=[\"']([^\"']+)[\"']", decoded_html, flags=re.I)

        contact_url = ""
        for href in hrefs[:1000]:
            href_low = href.lower()
            if href_low.startswith("mailto:"):
                em = href.split(":", 1)[1].split("?", 1)[0].strip().lower()
                if em and valid_email(em) and em not in emails:
                    emails.append(em)

            if not contact_url:
                abs_url = urljoin(final_url, href)
                abs_host = clean_host(abs_url)
                if abs_host == host or abs_host.endswith(f".{host}"):
                    path_q = urlparse(abs_url).path
                    if urlparse(abs_url).query:
                        path_q += "?" + urlparse(abs_url).query
                    if CONTACT_PATH_RE.search(path_q):
                        contact_url = abs_url

        if not emails and contact_url:
            contact_html, _, _ = fetch_text(contact_url, timeout=12)
            more = extract_emails(contact_html)
            emails.extend(more)

        row.website = final_url
        row.public_email = "; ".join(emails[:2])
        row.contact_page = contact_url


def write_outputs(root: Path, rows: list[Row]) -> None:
    docs = root / "docs"
    csv_path = docs / "outreach-master-list.csv"
    md_path = docs / "outreach-master-list.md"

    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["category", "name", "website", "contact_method", "public_email", "contact_page", "notes"],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row.__dict__)

    with_email = [r for r in rows if r.public_email]
    with_contact = [r for r in rows if r.contact_page and not r.public_email]

    with md_path.open("w", encoding="utf-8") as f:
        f.write("# IndexFast Outreach Master List\n\n")
        f.write("Built from docs/outreach-list.md and enriched with public contact data where available.\n\n")
        f.write(f"- Total rows: {len(rows)}\n")
        f.write(f"- Rows with public email: {len(with_email)}\n")
        f.write(f"- Rows with contact page only: {len(with_contact)}\n\n")

        f.write("## Rows with Public Email\n\n")
        f.write("| Name | Category | Website | Email | Contact Page |\n")
        f.write("|---|---|---|---|---|\n")
        for r in with_email[:200]:
            f.write(f"| {r.name} | {r.category} | {r.website} | {r.public_email} | {r.contact_page} |\n")

        f.write("\n## Top Outreach Rows (First 120)\n\n")
        f.write("| Name | Category | Website | Contact Method | Email | Contact Page |\n")
        f.write("|---|---|---|---|---|---|\n")
        for r in rows[:120]:
            f.write(
                f"| {r.name} | {r.category} | {r.website} | {r.contact_method} | {r.public_email} | {r.contact_page} |\n"
            )


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    source = root / "docs" / "outreach-list.md"

    rows = parse_outreach_list(source)
    enrich_agency_contacts(rows)
    write_outputs(root, rows)

    print(f"Rows parsed: {len(rows)}")
    print(f"With email: {sum(1 for r in rows if r.public_email)}")
    print(f"With contact page only: {sum(1 for r in rows if r.contact_page and not r.public_email)}")
    print("Wrote: docs/outreach-master-list.csv")
    print("Wrote: docs/outreach-master-list.md")


if __name__ == "__main__":
    main()
