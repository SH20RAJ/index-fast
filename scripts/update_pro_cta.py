import os
import re

files = [
    "src/components/tools/bing-batch-request-builder/BingBatchRequestBuilderTool.tsx",
    "src/components/tools/broken-link-checker/BrokenLinkCheckerTool.tsx",
    "src/components/tools/xml-sitemap-generator/XmlSitemapGeneratorTool.tsx",
    "src/components/tools/website-seo-score-checker/WebsiteSeoScoreCheckerTool.tsx",
    "src/components/tools/website-link-count-checker/WebsiteLinkCountCheckerTool.tsx",
    "src/components/tools/website-link-analyzer/WebsiteLinkAnalyzerTool.tsx",
    "src/components/tools/submitexpress-bulk-submitter/SubmitexpressBulkSubmitterTool.tsx",
    "src/components/tools/spider-simulator/SpiderSimulatorTool.tsx",
    "src/components/tools/sitemap-url-extractor/SitemapUrlExtractorTool.tsx",
    "src/components/tools/server-status-checker/ServerStatusCheckerTool.tsx",
    "src/components/tools/robots-txt-tester/RobotsTxtTesterTool.tsx",
    "src/components/tools/redirect-checker/RedirectCheckerTool.tsx",
    "src/components/tools/open-graph-generator/OpenGraphGeneratorTool.tsx",
    "src/components/tools/meta-tags-analyzer/MetaTagsAnalyzerTool.tsx",
    "src/components/tools/meta-tag-generator/MetaTagGeneratorTool.tsx",
    "src/components/tools/long-tail-keyword-generator/LongTailKeywordGeneratorTool.tsx",
    "src/components/tools/keyword-research-tool/KeywordResearchTool.tsx",
    "src/components/tools/keyword-position-checker/KeywordPositionCheckerTool.tsx",
    "src/components/tools/keyword-difficulty-checker/KeywordDifficultyCheckerTool.tsx",
    "src/components/tools/keyword-density-checker/KeywordDensityCheckerTool.tsx",
    "src/components/tools/keyword-competition-checker/KeywordCompetitionCheckerTool.tsx",
    "src/components/tools/indexnow-key-validator/IndexnowKeyValidatorTool.tsx",
    "src/components/tools/indexability-checker/IndexabilityCheckerTool.tsx",
    "src/components/tools/google-index-checker/GoogleIndexCheckerTool.tsx",
    "src/components/tools/free-search-engine-submission/FreeSearchEngineSubmissionTool.tsx",
    "src/components/tools/domain-spam-score-checker/DomainSpamScoreCheckerTool.tsx",
    "src/components/tools/domain-hosting-checker/DomainHostingCheckerTool.tsx",
    "src/components/tools/domain-authority-checker/DomainAuthorityCheckerTool.tsx",
    "src/components/tools/domain-age-checker/DomainAgeCheckerTool.tsx",
    "src/components/tools/backlink-checker/BacklinkCheckerTool.tsx",
    "src/components/tools/google-cache-checker/GoogleCacheCheckerTool.tsx",
    "src/components/tools/twitter-card-generator/TwitterCardGeneratorTool.tsx",
    "src/components/tools/sitemap-health-checker/SitemapHealthCheckerTool.tsx"
]

new_block_lines = [
    "{/* Pro CTA */}",
    "<div className=\"p-8 rounded-[2.5rem] bg-zinc-950 text-white relative overflow-hidden group\">",
    "  <div className=\"absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500\" />",
    "  <div className=\"relative z-10 flex flex-col md:flex-row items-center justify-between gap-8\">",
    "    <div className=\"space-y-4 text-center md:text-left\">",
    "      <div className=\"inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70\">",
    "        <ShieldCheck className=\"h-3.5 w-3.5 text-rose-500\" />",
    "        Powered by official Google Indexing API",
    "      </div>",
    "      <div className=\"space-y-2\">",
    "        <h4 className=\"text-2xl font-bold tracking-tight\">Automate your indexing today</h4>",
    "        <p className=\"text-sm text-zinc-400 max-w-md\">",
    "          Stop checking manually. Join 1,000+ teams using IndexFast to get their content discovered instantly and safely.",
    "        </p>",
    "      </div>",
    "    </div>",
    "    <div className=\"flex flex-col items-center gap-3\">",
    "      <Button asChild size=\"lg\" className=\"rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12 w-full sm:w-auto transition-all active:scale-95 shadow-xl shadow-white/5\">",
    "        <a href=\"/sign-up\">",
    "          Start Indexing Free",
    "          <ArrowRight className=\"ml-2 h-4 w-4\" />",
    "        </a>",
    "      </Button>",
    "      <p className=\"text-[10px] text-zinc-500 font-medium\">No credit card required · Instant setup</p>",
    "    </div>",
    "  </div>",
    "</div>"
]

# Patterns to match the block
patterns = [
    # Already updated once (with potential indentation issues)
    re.compile(r'\s*\{/\* Pro CTA \*/\}.*?Instant setup</p>\s*</div>\s*</div>\s*</div>', re.DOTALL),
    # Original old block
    re.compile(r'\s*\{/\* Pro CTA \*/\}.*?<ArrowRight className="ml-2 h-4 w-4" />\s*</a>\s*</Button>\s*</div>\s*</div>', re.DOTALL)
]

for file_path in files:
    full_path = os.path.join(os.getcwd(), file_path)
    if not os.path.exists(full_path):
        continue
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    updated = False
    for pattern in patterns:
        match = pattern.search(content)
        if match:
            # Find the line indentation of some reference line that wasn't messed up.
            # We'll use the indentation of the line where the match starts, but we need to be careful.
            # Let's try to find the indentation of the line containing {/* Pro CTA */}
            
            comment_pos = content.find('{/* Pro CTA */}', match.start(), match.end())
            line_start = content.rfind('\n', 0, comment_pos) + 1
            current_indent = content[line_start:comment_pos]
            
            # If current_indent is suspicious, try to find a better one from the surrounding code.
            # We'll look at the line before the match.
            if len(current_indent) > 20 or len(current_indent) == 0:
                prev_line_end = content.rfind('\n', 0, match.start())
                if prev_line_end != -1:
                    prev_line_start = content.rfind('\n', 0, prev_line_end) + 1
                    prev_line = content[prev_line_start:prev_line_end]
                    indent_match = re.match(r'^(\s*)', prev_line)
                    if indent_match:
                        indent = indent_match.group(1)
                    else:
                        indent = "                "
                else:
                    indent = "                "
            else:
                indent = current_indent
            
            # Ensure indent is a reasonable multiple of 2 or just use standard 10/16
            if len(indent) > 10 and len(indent) < 16: indent = "          "
            elif len(indent) >= 16: indent = "                "
            elif len(indent) <= 10: indent = "          "

            indented_lines = [(indent + line) if line.strip() else line for line in new_block_lines]
            current_new_block = "\n".join(indented_lines)
            
            new_content = content[:match.start()] + "\n" + current_new_block + content[match.end():]
            with open(full_path, 'w') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
            updated = True
            break
    
    if not updated:
        print(f"Could not find block in {file_path}")
