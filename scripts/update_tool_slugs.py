import os
import re

files = [
    "src/components/tools/bing-batch-request-builder/bing-batch-request-builder-page.tsx",
    "src/components/tools/broken-link-checker/broken-link-checker-page.tsx",
    "src/components/tools/domain-age-checker/domain-age-checker-page.tsx",
    "src/components/tools/domain-authority-checker/domain-authority-checker-page.tsx",
    "src/components/tools/domain-hosting-checker/domain-hosting-checker-page.tsx",
    "src/components/tools/domain-spam-score-checker/domain-spam-score-checker-page.tsx",
    "src/components/tools/free-search-engine-submission/free-search-engine-submission-page.tsx",
    "src/components/tools/google-cache-checker/google-cache-checker-page.tsx",
    "src/components/tools/google-index-checker/google-index-checker-page.tsx",
    "src/components/tools/indexability-checker/indexability-checker-page.tsx",
    "src/components/tools/indexnow-key-validator/indexnow-key-validator-page.tsx",
    "src/components/tools/keyword-competition-checker/keyword-competition-checker-page.tsx",
    "src/components/tools/keyword-density-checker/keyword-density-checker-page.tsx",
    "src/components/tools/keyword-difficulty-checker/keyword-difficulty-checker-page.tsx",
    "src/components/tools/keyword-position-checker/keyword-position-checker-page.tsx",
    "src/components/tools/keyword-research-tool/keyword-research-tool-page.tsx",
    "src/components/tools/long-tail-keyword-generator/long-tail-keyword-generator-page.tsx",
    "src/components/tools/meta-tag-generator/meta-tag-generator-page.tsx",
    "src/components/tools/meta-tags-analyzer/meta-tags-analyzer-page.tsx",
    "src/components/tools/open-graph-generator/open-graph-generator-page.tsx",
    "src/components/tools/redirect-checker/redirect-checker-page.tsx",
    "src/components/tools/robots-txt-tester/robots-txt-tester-page.tsx",
    "src/components/tools/server-status-checker/server-status-checker-page.tsx",
    "src/components/tools/shared/tool-detail-content.tsx",
    "src/components/tools/sitemap-health-checker/sitemap-health-checker-page.tsx",
    "src/components/tools/sitemap-url-extractor/sitemap-url-extractor-page.tsx",
    "src/components/tools/spider-simulator/spider-simulator-page.tsx",
    "src/components/tools/submitexpress-bulk-submitter/submitexpress-bulk-submitter-page.tsx",
    "src/components/tools/twitter-card-generator/twitter-card-generator-page.tsx",
    "src/components/tools/website-link-analyzer/website-link-analyzer-page.tsx",
    "src/components/tools/website-link-count-checker/website-link-count-checker-page.tsx",
    "src/components/tools/website-seo-score-checker/website-seo-score-checker-page.tsx",
    "src/components/tools/xml-sitemap-generator/xml-sitemap-generator-page.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, "r") as f:
        content = f.read()
    
    if "slug={" in content or 'slug="' in content:
        print(f"Slug already present in {file_path}")
        continue

    # Find ToolPageShell and add slug={slug}
    # Pattern to match <ToolPageShell followed by other props
    pattern = r'(<ToolPageShell\s+)(badge=\{category\?\.badge \?\? "SEO Tool"\}|badge=\{category\?\.badge \? category\.badge : "SEO Tool"\})'
    
    # Let's try a simpler approach: just find <ToolPageShell and add it after
    new_content = re.sub(r'(<ToolPageShell)', r'\1\n        slug={slug}', content)
    
    if new_content != content:
        with open(file_path, "w") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"Could not update {file_path}")
