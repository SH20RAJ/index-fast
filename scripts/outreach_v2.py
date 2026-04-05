import csv
import sys
import os
import re
import json
import subprocess

# Templates
TEMPLATES = {
    "agency": {
        "subject": "Helping {company} index client pages in < 48h",
        "body": "Hi {first_name},\n\nI saw {company} is doing some great work in the SEO space. I'm reaching out because getting new pages indexed can be a real bottleneck for agencies.\n\nWe just launched **IndexFast.co** — a dedicated tool built to automate sitemap pinging and IndexNow submissions. Instead of waiting weeks for Google Search Console to crawl, it helps get new pages indexed in 24-48 hours.\n\nWe have a white-label Agency plan that might be a great fit for your clients.\n\nAre you open to a quick look, or should I send over a demo link?\n\nBest,\nIndexFast Team"
    },
    "founder": {
        "subject": "Index {company} pages instantly (and boost AI visibility)",
        "body": "Hi {first_name},\n\nLove what you're building with {company}.\n\nQuick question: How long does it usually take for your new feature pages or blogs to show up in search? \n\nI'm working on **IndexFast.co**, which automates indexing for founders who ship fast. We also have an 'AI View' feature to see exactly how ChatGPT and Claude perceive your content for citation.\n\nWould love to give you a Pro account to try it out. Interested?\n\nBest,\nIndexFast Team"
    },
    "owner": {
        "subject": "Get {company} indexed faster",
        "body": "Hi {first_name},\n\nI noticed you're running {company}. \n\nGetting new products or posts indexed quickly can be a pain with Google lately. We built **IndexFast.co** to solve exactly this — it pings search engines (Google, Bing, IndexNow) the moment you publish.\n\nMost of our users see their pages indexed in under 2 hours.\n\nHappy to set you up with a trial if you're looking to speed things up.\n\nBest,\nIndexFast Team"
    },
    "funding": {
        "subject": "Scaling {company}'s organic growth after your funding",
        "body": "Hi {first_name},\n\nHuge congrats on the recent funding round for {company}! \n\nAs you scale up your content and product pages, indexing speed often becomes a bottleneck. Search engines can take weeks to crawl new pages, delaying your growth.\n\nWe built **IndexFast.co** to automate this — it pings search engines instantly, getting your new pages indexed in 24-48 hours. It also helps with AI visibility in ChatGPT and Claude.\n\nWould love to set you up with a premium account to help accelerate your launch.\n\nBest,\nIndexFast Team"
    }
}

def get_category_map(category, job_title=""):
    if not category: category = ""
    if not job_title: job_title = ""
    cat_str = (category + " " + job_title).lower()
    
    if "agency" in cat_str or "digital marketing" in cat_str or "seo" in cat_str:
        return "agency"
    if "founder" in cat_str or "ceo" in cat_str or "cto" in cat_str or "director" in cat_str or "manager" in cat_str or "consultant" in cat_str:
        return "founder"
    return "owner"

def load_env():
    env = {}
    env_path = "/Users/shaswatraj/Desktop/indexfast/.env.local"
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    env[key] = value
    return env

def send_via_resend(env, to, subject, body_text):
    api_key = env.get("RESEND_API_KEY")
    from_email = env.get("RESEND_FROM_EMAIL", "onboarding@contact.indexfast.co")
    reply_to = env.get("RESEND_REPLY_TO_EMAIL", "sh20raj@gmail.com")
    
    if not api_key:
        print("Error: RESEND_API_KEY not found in .env.local")
        return False

    # Convert plain text to simple HTML
    html_body = body_text.replace("\n", "<br>")
    # Make IndexFast.co a link
    html_body = html_body.replace("IndexFast.co", '<a href="https://indexfast.co">IndexFast.co</a>')
    
    payload = {
        "from": from_email,
        "to": to,
        "reply_to": reply_to,
        "subject": subject,
        "html": html_body
    }
    
    curl_cmd = [
        "curl", "-X", "POST", "https://api.resend.com/emails",
        "-H", f"Authorization: Bearer {api_key}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(payload)
    ]
    
    try:
        result = subprocess.run(curl_cmd, capture_output=True, text=True)
        if result.returncode == 0:
            resp = json.loads(result.stdout)
            if "id" in resp:
                print(f"✅ Sent to {to} | Resend ID: {resp['id']}")
                return True
            else:
                print(f"❌ Failed for {to} | Error: {result.stdout}")
        else:
            print(f"❌ Curl Error for {to} | {result.stderr}")
    except Exception as e:
        print(f"❌ Exception for {to} | {str(e)}")
    
    return False

def parse_name(name, company):
    if not name or name.strip() == "": return "there"
    # Filter out company-like names
    if any(x in name for x in ["SEO", "Agency", "Digital", "Consulting", "Marketing", "LLC", "Inc"]):
        return "there"
    return name.split(" ")[0].strip()

def process_file(file_path):
    prospects = []
    base_name = os.path.basename(file_path)
    
    if not os.path.exists(file_path):
        print(f"Warning: File not found: {file_path}")
        return prospects

    with open(file_path, mode='r', encoding='utf-8') as f:
        # Special handling for recently-funded.csv multi-section
        if base_name == "recently-funded.csv":
            content = f.read()
            # Section 1: Firmographic (Lines 3-121 approx)
            match1 = re.search(r"Company Name\tWebsite\tIndustry.*?\n(.*?)BizProspex", content, re.S)
            if match1:
                section1 = match1.group(1).strip().split("\n")
                for line in section1:
                    parts = line.split("\t")
                    if len(parts) >= 12:
                        prospects.append({
                            "name": parts[8] + " " + parts[9],
                            "email": parts[11],
                            "company": parts[0],
                            "category": "funding",
                            "source": base_name
                        })
            # Section 2: Grok1 style at the end
            match2 = re.search(r"Company_Name,Website,Email,Context\n(.*)", content, re.S)
            if match2:
                reader = csv.DictReader(match2.group(1).strip().splitlines())
                for row in reader:
                    prospects.append({
                        "name": row.get("Company_Name", ""),
                        "email": row.get("Email", ""),
                        "company": row.get("Company_Name", ""),
                        "category": "agency",
                        "source": base_name
                    })
            return prospects

        # Other standard CSVs
        reader = csv.DictReader(f)
        for row in reader:
            p = {"source": base_name}
            if "Email" in row:
                p["email"] = row["Email"]
                p["name"] = row.get("Name") or row.get("Company_Name") or row.get("First Name", "") + " " + row.get("Last Name", "")
                p["company"] = row.get("Company") or row.get("Company_Name") or "your site"
                p["category"] = row.get("Category") or row.get("Notes") or "owner"
                prospects.append(p)
                
    return prospects

def main():
    FILES = [
        "/Users/shaswatraj/Desktop/indexfast/outreach/kimi-list.csv",
        "/Users/shaswatraj/Desktop/indexfast/outreach/kimi-list-2.csv",
        "/Users/shaswatraj/Desktop/indexfast/outreach/grok1.csv",
        "/Users/shaswatraj/Desktop/indexfast/outreach/grok2.csv",
        "/Users/shaswatraj/Desktop/indexfast/outreach/recently-funded.csv"
    ]
    
    raw_list = []
    for f in FILES:
        raw_list.extend(process_file(f))
        
    # Deduplicate and Clean
    seen_emails = set()
    final_list = []
    
    for p in raw_list:
        email = p["email"].strip() if p.get("email") else None
        if not email or "@" not in email or email.lower() in seen_emails or "N/A" in email:
            continue
            
        seen_emails.add(email.lower())
        
        # Format the prospect
        company = p.get("company", "your site")
        name = parse_name(p.get("name"), company)
        category_key = get_category_map(p.get("category"))
        
        # If it came from recently-funded section 1, use "funding" category
        if p.get("category") == "funding":
            category_key = "funding"
            
        template = TEMPLATES[category_key]
        
        final_list.append({
            "to": email,
            "subject": template["subject"].format(company=company, first_name=name),
            "body": template["body"].format(company=company, first_name=name),
            "source": p["source"]
        })
        
    print(f"Total Unique Prospects Found: {len(final_list)}")
    
    # Save a CSV for verification
    dryrun_path = "/Users/shaswatraj/Desktop/indexfast/outreach/outreach-v2-dryrun.csv"
    with open(dryrun_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["to", "subject", "body", "source"])
        writer.writeheader()
        writer.writerows(final_list)
    print(f"Dry run complete. Sample saved to {dryrun_path}")

    # --- Execution Mode ---
    if "--send" in sys.argv:
        env = load_env()
        # Parse Batch
        start_idx = 0
        batch_size = len(final_list)
        
        for arg in sys.argv:
            if arg.startswith("--start="): start_idx = int(arg.split("=")[1])
            if arg.startswith("--limit="): batch_size = int(arg.split("=")[1])
        
        batch = final_list[start_idx : start_idx + batch_size]
        print(f"\n🚀 Starting Resend Batch: {start_idx} to {start_idx + len(batch)}")
        
        log_path = "/Users/shaswatraj/Desktop/indexfast/outreach/outreach-log-v2.csv"
        file_exists = os.path.exists(log_path)
        
        with open(log_path, "a", newline="", encoding="utf-8") as log_f:
            writer = csv.writer(log_f)
            if not file_exists:
                writer.writerow(["To", "Subject", "Source", "Status", "SentAt"])
            
            for p in batch:
                success = send_via_resend(env, p["to"], p["subject"], p["body"])
                status = "Sent" if success else "Failed"
                writer.writerow([p["to"], p["subject"], p["source"], status, "2026-04-05T11:26:00Z"])
                # Small delay to avoid hitting rate limits on the free tier if applicable
                # time.sleep(0.1) 
    else:
        print("\n💡 To send emails, run with: python3 outreach_v2.py --send --start=6 --limit=100")

if __name__ == "__main__":
    main()
