#!/usr/bin/env node

/**
 * IndexFast Mega Outreach — 50+ emails across diverse genres
 * AI content tools, SEO platforms, CMS, WordPress, link builders,
 * no-code makers, dev tools, newsletters, and more.
 */

const API_KEY = "re_4q4GyCVo_BkeV6PZ6R36jx7Xq3TWGtYCK";
const FROM = "Shaswat from IndexFast <onboarding@contact.indexfast.co>";
const REPLY_TO = "sh20raj@gmail.com";
const DELAY = 1200;

const contacts = [
  // ═══════════════════════════════════════════════════════
  // 🤖 AI CONTENT TOOLS — "You create content, we get it indexed"
  // ═══════════════════════════════════════════════════════
  { email: "hey@jasper.ai", name: "Jasper Team", org: "Jasper", genre: "ai-content", hook: "Jasper users create massive amounts of content — IndexFast ensures every page gets crawled and indexed instantly" },
  { email: "support@surferseo.com", name: "Surfer Team", org: "Surfer SEO", genre: "ai-content", hook: "Surfer optimizes content for rankings — IndexFast makes sure that content actually gets discovered by search engines" },
  { email: "support@clearscope.io", name: "Clearscope Team", org: "Clearscope", genre: "ai-content", hook: "your users write optimized content — but if it's not indexed, no one sees it. IndexFast fixes that" },
  { email: "support@frase.io", name: "Frase Team", org: "Frase", genre: "ai-content", hook: "Frase helps create SEO briefs and content — IndexFast is the natural next step to get it found" },
  { email: "support@marketmuse.com", name: "MarketMuse Team", org: "MarketMuse", genre: "ai-content", hook: "MarketMuse plans content strategy at scale — IndexFast automates the indexing of all that content" },
  { email: "wecare@scalenut.com", name: "Scalenut Team", org: "Scalenut", genre: "ai-content", hook: "Scalenut's AI content engine + IndexFast auto-indexing = complete SEO pipeline for your users" },
  { email: "hello@neuronwriter.com", name: "NeuronWriter Team", org: "NeuronWriter", genre: "ai-content", hook: "NeuronWriter articles need fast indexing to compete — IndexFast pushes them to search engines via IndexNow" },
  { email: "team@frase.io", name: "Frase Partnerships", org: "Frase", genre: "ai-content", hook: "exploring a potential integration — IndexFast auto-submits published content to search engines instantly", skip: true },

  // ═══════════════════════════════════════════════════════
  // 🔗 LINK BUILDING & OUTREACH TOOLS
  // ═══════════════════════════════════════════════════════
  { email: "support@pitchbox.com", name: "Pitchbox Team", org: "Pitchbox", genre: "link-building", hook: "your users build links to pages — IndexFast ensures those pages are actually in the index to benefit from them" },
  { email: "support@buzzstream.com", name: "BuzzStream Team", org: "BuzzStream", genre: "link-building", hook: "link building works best when target pages are indexed — IndexFast handles that automatically" },
  { email: "hello@respona.com", name: "Respona Team", org: "Respona", genre: "link-building", hook: "your outreach earns links — IndexFast makes sure the linked pages are crawled and ranked" },
  { email: "support@hunter.io", name: "Hunter Team", org: "Hunter.io", genre: "link-building", hook: "Hunter finds the contacts, IndexFast indexes the content — a natural pairing for SEO workflows" },

  // ═══════════════════════════════════════════════════════
  // 📰 WORDPRESS ECOSYSTEM
  // ═══════════════════════════════════════════════════════
  { email: "support@generatepress.com", name: "GeneratePress Team", org: "GeneratePress", genre: "wordpress", hook: "GP users care about performance AND SEO — IndexFast auto-submits new/updated posts via IndexNow" },
  { email: "support@flavor.flavor.dev", name: "flavor.dev Team", org: "flavor.dev", genre: "wordpress", hook: "your WordPress users publish frequently — IndexFast ensures every new post is indexed same-day", skip: true },
  { email: "hello@flavor.dev", name: "flavor.dev Team", org: "flavor.dev", genre: "wordpress", hook: "your WordPress users publish frequently — IndexFast ensures every new post is indexed same-day", skip: true },
  { email: "support@flavor.dev", name: "flavor.dev Team", org: "flavor.dev", genre: "wordpress", hook: "your WordPress users publish frequently — IndexFast ensures every new post is indexed same-day", skip: true },

  // ═══════════════════════════════════════════════════════
  // 📊 SEO TOOLS & PLATFORMS
  // ═══════════════════════════════════════════════════════
  { email: "support@mangools.com", name: "Mangools Team", org: "Mangools", genre: "seo-tool", hook: "Mangools helps find keywords — IndexFast helps the content targeting those keywords get indexed" },
  { email: "hello@lowfruits.io", name: "LowFruits Team", org: "LowFruits", genre: "seo-tool", hook: "your users find low-KD keywords and create pages — IndexFast pushes those pages to search engines instantly" },
  { email: "support@serpapi.com", name: "SerpApi Team", org: "SerpApi", genre: "seo-tool", hook: "SerpApi tracks rankings — IndexFast ensures pages are in the index TO rank. Great integration opportunity" },
  { email: "support@seranking.com", name: "SE Ranking Team", org: "SE Ranking", genre: "seo-tool", hook: "your users track hundreds of pages — IndexFast auto-submits new ones so they appear in SERPs faster" },
  { email: "support@sitechecker.pro", name: "Sitechecker Team", org: "Sitechecker", genre: "seo-tool", hook: "Sitechecker audits sites for issues — IndexFast solves the 'not indexed' problem automatically" },
  { email: "hello@seodity.com", name: "Seodity Team", org: "Seodity", genre: "seo-tool", hook: "your SEO platform could integrate IndexNow submissions via IndexFast to complete the on-page → indexed loop" },

  // ═══════════════════════════════════════════════════════
  // 🏗️ CMS & HEADLESS CMS
  // ═══════════════════════════════════════════════════════
  { email: "support@ghost.org", name: "Ghost Team", org: "Ghost", genre: "cms", hook: "Ghost publishers need instant indexing — IndexFast auto-detects sitemap changes and submits to search engines" },
  { email: "support@strapi.io", name: "Strapi Team", org: "Strapi", genre: "cms", hook: "headless CMS content gets published across multiple frontends — IndexFast ensures every URL is indexed" },
  { email: "support@contentful.com", name: "Contentful Team", org: "Contentful", genre: "cms", hook: "when content gets published via Contentful, IndexFast can auto-submit the URLs for instant crawling" },
  { email: "hello@hygraph.com", name: "Hygraph Team", org: "Hygraph", genre: "cms", hook: "your headless CMS powers content across sites — IndexFast ensures those pages get indexed instantly" },
  { email: "hello@payload-cms.com", name: "Payload Team", org: "Payload CMS", genre: "cms", hook: "Payload's open-source CMS is growing fast — IndexFast integration would be a killer feature for SEO-focused users" },

  // ═══════════════════════════════════════════════════════  
  // 🧑‍💻 DEV TOOLS & HOSTING
  // ═══════════════════════════════════════════════════════
  { email: "support@railway.app", name: "Railway Team", org: "Railway", genre: "devtool", hook: "devs deploying side projects on Railway need SEO — IndexFast auto-indexes their sites" },
  { email: "support@render.com", name: "Render Team", org: "Render", genre: "devtool", hook: "Render hosts thousands of web apps — IndexFast could be a marketplace integration for instant SEO indexing" },
  { email: "hello@coolify.io", name: "Coolify Team", org: "Coolify", genre: "devtool", hook: "self-hosters using Coolify still need their sites indexed — IndexFast handles that with zero config" },
  { email: "hello@deno.com", name: "Deno Team", org: "Deno", genre: "devtool", hook: "Deno Deploy projects need SEO visibility — IndexFast can be a natural toolchain addition" },
  
  // ═══════════════════════════════════════════════════════
  // 🛒 E-COMMERCE & SHOPIFY
  // ═══════════════════════════════════════════════════════
  { email: "hello@searchanise.com", name: "Searchanise Team", org: "Searchanise", genre: "ecommerce", hook: "your Shopify search app helps users find products — IndexFast helps Google find those product pages" },
  { email: "support@plug-in-seo.com", name: "Plug in SEO Team", org: "Plug in SEO", genre: "ecommerce", hook: "your Shopify SEO app audits issues — IndexFast could auto-fix the 'not indexed' ones via IndexNow" },
  { email: "hello@smartseo.com", name: "Smart SEO Team", org: "Smart SEO", genre: "ecommerce", hook: "your Shopify SEO app handles meta tags — IndexFast handles the indexing side. Natural integration" },

  // ═══════════════════════════════════════════════════════
  // 📧 NEWSLETTERS & MEDIA  
  // ═══════════════════════════════════════════════════════
  { email: "hello@beehiiv.com", name: "Beehiiv Team", org: "Beehiiv", genre: "newsletter", hook: "newsletter creators using Beehiiv also run blogs and landing pages — IndexFast gets them indexed instantly" },
  { email: "hello@buttondown.email", name: "Buttondown Team", org: "Buttondown", genre: "newsletter", hook: "Buttondown archives are content gold — IndexFast can auto-index new archive pages for organic traffic" },
  { email: "support@convertkit.com", name: "ConvertKit Team", org: "Kit (ConvertKit)", genre: "newsletter", hook: "your creator landing pages need indexing — IndexFast automates that so creators focus on content" },

  // ═══════════════════════════════════════════════════════
  // 🧩 NO-CODE / LOW-CODE BUILDERS
  // ═══════════════════════════════════════════════════════
  { email: "hello@softr.io", name: "Softr Team", org: "Softr", genre: "nocode", hook: "Softr users build web apps from Airtable — IndexFast ensures those apps get found by search engines" },
  { email: "hello@typedream.com", name: "Typedream Team", org: "Typedream", genre: "nocode", hook: "your no-code website builder creates beautiful sites — IndexFast gets them indexed within hours, not weeks" },
  { email: "support@carrd.co", name: "Carrd Team", org: "Carrd", genre: "nocode", hook: "millions of Carrd pages exist — IndexFast helps yours get indexed and visible in search" },
  { email: "hello@framer.com", name: "Framer Team", org: "Framer", genre: "nocode", hook: "Framer sites are beautifully designed — IndexFast ensures they're also beautifully indexed" },
  { email: "hello@webflow.com", name: "Webflow Team", org: "Webflow", genre: "nocode", hook: "Webflow users care deeply about SEO — IndexFast integration could auto-submit new pages via IndexNow" },
  
  // ═══════════════════════════════════════════════════════
  // 🚀 STARTUP & PRODUCT COMMUNITIES
  // ═══════════════════════════════════════════════════════  
  { email: "hello@peerlist.io", name: "Peerlist Team", org: "Peerlist", genre: "community", hook: "your community of builders ships products daily — IndexFast helps them get discovered in search engines" },
  { email: "hello@daily.dev", name: "daily.dev Team", org: "daily.dev", genre: "community", hook: "dev content curation is your strength — IndexFast ensures creators' pages are indexed for maximum visibility" },
  { email: "hello@microlaunch.net", name: "Microlaunch Team", org: "Microlaunch", genre: "community", hook: "your launch platform helps products get noticed — IndexFast extends that by getting their sites indexed" },
  { email: "support@uneed.best", name: "Uneed Team", org: "Uneed", genre: "community", hook: "products listed on Uneed need indexing — IndexFast automates that so founders can focus on building" },

  // ═══════════════════════════════════════════════════════
  // 🎓 COURSE CREATORS & EDUCATORS
  // ═══════════════════════════════════════════════════════
  { email: "support@bloggingwizard.com", name: "Blogging Wizard Team", org: "Blogging Wizard", genre: "education", hook: "your audience builds blogs — IndexFast is the tool they're missing to get new posts indexed same-day" },
  { email: "hello@authorityhacker.com", name: "Authority Hacker Team", org: "Authority Hacker", genre: "education", hook: "your students build authority sites — IndexFast auto-indexes their content so they rank faster" },
  { email: "hello@nichepursuits.com", name: "Niche Pursuits Team", org: "Niche Pursuits", genre: "education", hook: "Spencer's audience builds niche sites at scale — IndexFast automates the indexing step they all struggle with" },
  { email: "support@incomeschool.com", name: "Income School Team", org: "Income School", genre: "education", hook: "your students publish blog posts and wait weeks for indexing — IndexFast can cut that to hours" },
  { email: "support@gotchseo.com", name: "Gotch SEO Team", org: "Gotch SEO", genre: "education", hook: "Nathan, your SEO students need indexing automation — IndexFast is the tool that completes their workflow" },

  // ═══════════════════════════════════════════════════════
  // 📡 ANALYTICS & MONITORING
  // ═══════════════════════════════════════════════════════
  { email: "support@plausible.io", name: "Plausible Team", org: "Plausible Analytics", genre: "analytics", hook: "privacy-focused analytics users care about organic traffic — IndexFast helps them get more of it via faster indexing" },
  { email: "hello@usefathom.com", name: "Fathom Team", org: "Fathom Analytics", genre: "analytics", hook: "your users track organic visits — IndexFast helps them grow those numbers by ensuring all pages are indexed" },
  { email: "hello@umami.is", name: "Umami Team", org: "Umami Analytics", genre: "analytics", hook: "open-source analytics users are builders who need SEO — IndexFast handles the indexing side automatically" },
];

function getEmail(c) {
  const subject = `${c.org} × IndexFast — get your users' pages indexed instantly`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">
<div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">Hey ${c.name} 👋</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">${c.hook}.</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">I'm Shaswat — I built <a href="https://www.indexfast.co?ref=${c.org.toLowerCase().replace(/[^a-z0-9]/g,'-')}" style="color:#7C3AED;text-decoration:none;font-weight:600;">IndexFast</a> to help makers <strong>get new pages crawled faster, ranked sooner, and seen in AI answers.</strong></p>
<div style="background:#f5f3ff;border-radius:8px;padding:18px;margin:0 0 18px;border-left:4px solid #7C3AED;">
<p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">⚡ <strong>Instant IndexNow submission</strong> — push URLs to Bing, Yandex, Naver</p>
<p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">📊 <strong>Multi-site dashboard</strong> — track indexation in real-time</p>
<p style="margin:0;color:#4c1d95;font-size:14px;">🔄 <strong>Auto sitemap monitoring</strong> — detect and submit new pages automatically</p>
</div>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">Would love to explore a collab or integration. Happy to give your team a <strong>free Pro account</strong> to test.</p>
<a href="https://www.indexfast.co?ref=${c.org.toLowerCase().replace(/[^a-z0-9]/g,'-')}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">Check Out IndexFast →</a>
<div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">Cheers,<br><strong style="color:#374151;">Shaswat Raj</strong><br>Founder, <a href="https://www.indexfast.co" style="color:#7C3AED;text-decoration:none;">IndexFast</a> · <a href="https://x.com/SH20RAJ" style="color:#7C3AED;text-decoration:none;">@SH20RAJ</a></p>
</div>
</div>
<p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">Built for builders ⚡ <a href="https://www.indexfast.co" style="color:#9ca3af;">indexfast.co</a></p>
</div></body></html>`;
  return { subject, html };
}

async function send(c, dry) {
  const { subject, html } = getEmail(c);
  if (dry) { console.log(`  📋 [DRY] ${c.email}`); return true; }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: c.email, reply_to: REPLY_TO, subject, html }),
  });
  const d = await r.json();
  if (!r.ok) { console.error(`  ❌ ${c.email} — ${JSON.stringify(d)}`); return false; }
  console.log(`  ✅ ${c.email} (${d.id})`);
  return true;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const dry = process.argv.includes("--dry-run");
  const test = process.argv.includes("--test");
  console.log("\n⚡ IndexFast MEGA Outreach — 50+ Multi-Genre Emails\n");
  if (dry) console.log("🔍 DRY RUN\n");

  let list = contacts.filter(c => !c.skip);
  if (test) list = [{ email: "sh20raj@gmail.com", name: "Shaswat", org: "TestOrg", genre: "test", hook: "testing the mega outreach script across all genres" }];

  const genres = [...new Set(list.map(c => c.genre))];
  console.log(`📬 ${list.length} emails across ${genres.length} genres: ${genres.join(", ")}\n`);

  let sent = 0, fail = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    console.log(`[${i+1}/${list.length}] ${c.org} (${c.genre})`);
    (await send(c, dry)) ? sent++ : fail++;
    if (i < list.length - 1) await sleep(DELAY);
  }

  console.log(`\n${"─".repeat(50)}\n📊 Sent: ${sent} | Failed: ${fail} | Genres: ${genres.length}\n🎉 Done!\n`);
}

main().catch(console.error);
