#!/usr/bin/env python3
"""Build a public outreach contacts list for SEO agencies.

Sources:
- DesignRush SEO directory
- GoodFirms SEO directory
- TopSEOs ranking page

Output files:
- docs/outreach-agency-contacts.csv
- docs/outreach-agency-contacts.md
"""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

SOURCES = [
    "https://r.jina.ai/http://www.designrush.com/agency/search-engine-optimization",
    "https://r.jina.ai/http://www.designrush.com/agency/search-engine-optimization?page=2",
    "https://r.jina.ai/http://www.designrush.com/agency/search-engine-optimization?page=3",
    "https://r.jina.ai/http://www.designrush.com/agency/search-engine-optimization?page=4",
    "https://r.jina.ai/http://www.designrush.com/agency/search-engine-optimization?page=5",
    "https://r.jina.ai/http://www.goodfirms.co/seo-agencies",
    "https://r.jina.ai/http://www.goodfirms.co/seo-agencies?page=2",
    "https://r.jina.ai/http://www.goodfirms.co/seo-agencies?page=3",
]

SKIP_HOSTS = {
    "designrush.com",
    "goodfirms.co",
    "facebook.com",
    "facebook.net",
    "linkedin.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "instagram.com",
    "wa.me",
    "google.com",
    "goo.gl",
    "cloudfront.net",
    "googleusercontent.com",
}

LINK_RE = re.compile(r"\((https?://[^)\s]+)\)")
AGENCY_LINK_RE = re.compile(r"^### \[[^\]]+\]\((https?://[^)\s]+)\)", re.M)
SEE_WEBSITE_RE = re.compile(r"\[See [^\]]+ Website\]\((https?://[^)\s]+)\)")
EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
CONTACT_PATH_RE = re.compile(r"/(contact|contact-us|get-in-touch|talk-to-us|book-demo|book-call)(/|\?|$)", re.I)


@dataclass
class Lead:
    agency_or_domain: str
    website: str
    contact_email: str
    contact_page: str
    source: str
    notes: str


def fetch_text(url: str, timeout: int = 15) -> tuple[str, str, str]:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(request, timeout=timeout) as response:
            content_type = response.headers.get("Content-Type", "")
            body = response.read()
            text = body.decode("utf-8", errors="ignore")
            final_url = response.geturl()
            return text, final_url, content_type
    except (HTTPError, URLError, TimeoutError, ValueError):
        return "", url, ""


def clean_host(url: str) -> str:
    host = urlparse(url).netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def normalize_home(url: str) -> str:
    parsed = urlparse(url)
    if not parsed.netloc:
        return ""
    scheme = parsed.scheme or "https"
    return f"{scheme}://{parsed.netloc}"


def should_keep(url: str) -> bool:
    host = clean_host(url)
    if not host:
        return False
    if host in SKIP_HOSTS:
        return False
    if host.endswith("designrush.com") or host.endswith("goodfirms.co"):
        return False
    if any(
        host.endswith(blocked)
        for blocked in [
            "facebook.com",
            "facebook.net",
            "linkedin.com",
            "twitter.com",
            "x.com",
            "youtube.com",
            "instagram.com",
            "google.com",
            "googleusercontent.com",
            "cloudfront.net",
        ]
    ):
        return False

    lowered = url.lower()
    blocked_parts = ["privacy", "terms", "cookie", "login", "signup", "help"]
    if any(part in lowered for part in blocked_parts):
        return False

    return True


def collect_candidate_sites() -> list[str]:
    frequencies: dict[str, int] = {}

    for source in SOURCES:
        text, _, _ = fetch_text(source, timeout=30)
        if not text:
            continue

        candidate_urls = []
        candidate_urls.extend(AGENCY_LINK_RE.findall(text))
        candidate_urls.extend(SEE_WEBSITE_RE.findall(text))
        if not candidate_urls:
            candidate_urls.extend(LINK_RE.findall(text))

        for url in candidate_urls:
            if not should_keep(url):
                continue
            home = normalize_home(url)
            if not home:
                continue
            frequencies[home] = frequencies.get(home, 0) + 1

    sorted_sites = sorted(frequencies.items(), key=lambda item: (-item[1], item[0]))
    return [site for site, _ in sorted_sites[:240]]


def valid_email(email: str) -> bool:
    lower = email.lower()
    if any(junk in lower for junk in ["example.com", "wixpress", "cloudflare", "sentry"]):
        return False
    if any(lower.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico", ".css", ".js"]):
        return False
    if any(token in lower for token in ["@2x", "@3x", "logo", "picture", "img-"]):
        return False
    if lower.endswith("@telegram.org"):
        return False
    return True


def extract_contact_data(site: str) -> Lead:
    domain = clean_host(site)
    html = ""
    final_url = site
    content_type = ""

    html, final_url, content_type = fetch_text(site, timeout=15)

    emails: list[str] = []
    contact_page = ""

    if html and "text/html" in content_type.lower():
        emails = sorted(set(EMAIL_RE.findall(html)))
        emails = [email for email in emails if valid_email(email)]

        hrefs = re.findall(r"href=[\"']([^\"']+)[\"']", html, flags=re.I)
        for href in hrefs[:1200]:
            href_lower = href.lower()

            if href_lower.startswith("mailto:"):
                mail = href.split(":", 1)[1].split("?", 1)[0].strip()
                if mail and mail not in emails:
                    emails.append(mail)

            if not contact_page:
                abs_href = urljoin(final_url, href)
                abs_host = clean_host(abs_href)
                same_domain = abs_host == domain or abs_host.endswith(f".{domain}")
                if same_domain and CONTACT_PATH_RE.search(urlparse(abs_href).path + ("?" + urlparse(abs_href).query if urlparse(abs_href).query else "")):
                    contact_page = abs_href

        if not emails and contact_page:
            contact_html, _, _ = fetch_text(contact_page, timeout=12)
            if contact_html:
                more = sorted(set(EMAIL_RE.findall(contact_html)))
                more = [email for email in more if valid_email(email)]
                emails.extend(more)

    return Lead(
        agency_or_domain=domain,
        website=final_url,
        contact_email="; ".join(emails[:3]),
        contact_page=contact_page,
        source="DesignRush + GoodFirms + TopSEOs (public pages)",
        notes="Public data only. Verify before outreach.",
    )


def dedupe_leads(leads: list[Lead]) -> list[Lead]:
    best: dict[str, tuple[int, Lead]] = {}

    for lead in leads:
        if not lead.agency_or_domain:
            continue
        score = int(bool(lead.contact_email)) + int(bool(lead.contact_page))
        current = best.get(lead.agency_or_domain)
        if current is None or score > current[0]:
            best[lead.agency_or_domain] = (score, lead)

    result = [value[1] for value in best.values()]
    result.sort(key=lambda item: item.agency_or_domain)
    return result


def write_outputs(root: Path, leads: list[Lead]) -> None:
    docs_dir = root / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)

    csv_path = docs_dir / "outreach-agency-contacts.csv"
    md_path = docs_dir / "outreach-agency-contacts.md"

    with csv_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=["agency_or_domain", "website", "contact_email", "contact_page", "source", "notes"],
        )
        writer.writeheader()
        for lead in leads:
            writer.writerow(lead.__dict__)

    with_email = [lead for lead in leads if lead.contact_email]
    with_contact_only = [lead for lead in leads if lead.contact_page and not lead.contact_email]

    with md_path.open("w", encoding="utf-8") as file:
        file.write("# IndexFast Outreach Contact List\n\n")
        file.write("Generated from public directories and public agency websites.\n\n")
        file.write(f"- Total leads: {len(leads)}\n")
        file.write(f"- Leads with public email: {len(with_email)}\n")
        file.write(f"- Leads with contact page only: {len(with_contact_only)}\n\n")

        file.write("## Leads with Public Email\n\n")
        file.write("| Agency/Domain | Website | Email | Contact Page |\n")
        file.write("|---|---|---|---|\n")
        for lead in with_email[:220]:
            file.write(
                f"| {lead.agency_or_domain} | {lead.website} | {lead.contact_email} | {lead.contact_page} |\n"
            )

        file.write("\n## Leads with Contact Page\n\n")
        file.write("| Agency/Domain | Website | Contact Page |\n")
        file.write("|---|---|---|\n")
        for lead in with_contact_only[:260]:
            file.write(f"| {lead.agency_or_domain} | {lead.website} | {lead.contact_page} |\n")


def main() -> None:
    workspace_root = Path(__file__).resolve().parents[1]

    sites = collect_candidate_sites()
    leads = [extract_contact_data(site) for site in sites]
    deduped = dedupe_leads(leads)

    write_outputs(workspace_root, deduped)

    with_email = sum(1 for lead in deduped if lead.contact_email)
    with_contact = sum(1 for lead in deduped if lead.contact_page and not lead.contact_email)

    print(f"Generated leads: {len(deduped)}")
    print(f"With email: {with_email}")
    print(f"With contact page only: {with_contact}")
    print("Wrote: docs/outreach-agency-contacts.csv")
    print("Wrote: docs/outreach-agency-contacts.md")


if __name__ == "__main__":
    main()
