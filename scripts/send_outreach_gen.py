import csv
import sys
import os

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
    }
}

FILES_TO_PROCESS = [
    {"path": "/Users/shaswatraj/Desktop/indexfast/outreach/kimi-list.csv", "mapping": {"name": "Name", "company": "Company", "email": "Email", "category": "Category"}},
    {"path": "/Users/shaswatraj/Desktop/indexfast/outreach/grok1.csv", "mapping": {"company": "Company_Name", "name": "Company_Name", "email": "Email", "category": "Notes"}}
]

def get_category_map(category):
    if not category: return "owner"
    c = category.lower()
    if "agency" in c or "digital marketing" in c or "seo" in c:
        return "agency"
    if "founder" in c or "director" in c or "manager" in c or "consultant" in c:
        return "founder"
    return "owner"

def parse_name(name, company):
    if not name: return "there"
    if name == company or any(x in name for x in ["SEO", "Agency", "Digital", "Consulting", "Marketing"]):
        return "there"
    return name.split(" ")[0]

def main():
    emails_to_send = []
    
    for config in FILES_TO_PROCESS:
        path = config["path"]
        mapping = config["mapping"]
        
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue
            
        with open(path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                name = row.get(mapping.get("name", "Name"), "")
                company = row.get(mapping.get("company", "Company"), "your site")
                email = row.get(mapping.get("email", "Email"))
                category_raw = row.get(mapping.get("category", "Category"), "")
                
                if not email: continue
                
                first_name = parse_name(name, company)
                category = get_category_map(category_raw)

                template = TEMPLATES[category]
                subject = template["subject"].format(company=company)
                body = template["body"].format(first_name=first_name, company=company)

                emails_to_send.append({
                    "to": email,
                    "subject": subject,
                    "body": body,
                    "source": os.path.basename(path)
                })

    # For verification, print first 2 from each source
    print(f"Total emails processed: {len(emails_to_send)}")
    for i, email_data in enumerate(emails_to_send[:5]):
        print(f"--- EMAIL {i+1} (Source: {email_data['source']}) ---")
        print(f"To: {email_data['to']}")
        print(f"Subject: {email_data['subject']}")
        print(f"Body:\n{email_data['body']}\n")

if __name__ == "__main__":
    main()
