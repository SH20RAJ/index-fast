#!/usr/bin/env node

/**
 * IndexFast VIRAL Outreach — 55 emails to people who can make it go viral
 * Tech press, YouTubers, podcast hosts, newsletter writers, PH hunters,
 * dev platforms, viral X/Twitter accounts, and startup communities.
 */

const API = "re_4q4GyCVo_BkeV6PZ6R36jx7Xq3TWGtYCK";
const FROM = "Shaswat from IndexFast <onboarding@contact.indexfast.co>";
const REPLY_TO = "sh20raj@gmail.com";
const DELAY = 1200;

const contacts = [
  // ═══════════════════════════════════════
  // 📰 TECH PRESS — Tips / Editorial Desks
  // ═══════════════════════════════════════
  { email: "tips@techcrunch.com", name: "TechCrunch Editorial", org: "TechCrunch", genre: "press", hook: "Solo founder launches IndexFast — an open dashboard that auto-indexes pages via IndexNow. SEO agencies are already signing up" },
  { email: "news@mashable.com", name: "Mashable News Desk", org: "Mashable", genre: "press", hook: "A 'vibe coder' built IndexFast in weeks using AI — it automates SEO indexing and is already being used by agencies" },
  { email: "press@mashable.com", name: "Mashable Press", org: "Mashable", genre: "press", hook: "IndexFast is a new developer tool that automates search engine indexing — built by a solo founder shipping at lightspeed" },
  { email: "opinion@wired.com", name: "Wired Opinion", org: "Wired", genre: "press", hook: "Opinion pitch: the rise of 'vibe coding' — how solo founders like me are shipping production SaaS in days, not months" },
  { email: "hello@thenextweb.com", name: "TNW Team", org: "The Next Web", genre: "press", hook: "IndexFast automates SEO indexing so pages get crawled faster, ranked sooner, and show up in AI answers" },
  { email: "tips@theinformation.com", name: "The Information Tips", org: "The Information", genre: "press", hook: "Solo-founded SEO tool IndexFast is gaining traction with agencies — automates the unglamorous part of search: getting indexed" },
  { email: "editorial@sifted.eu", name: "Sifted Editorial", org: "Sifted", genre: "press", hook: "A bootstrapped founder just launched IndexFast — automating search indexing for the programmatic SEO boom" },

  // ═══════════════════════════════════════
  // 🎥 TECH YOUTUBERS — Collab / Feature
  // ═══════════════════════════════════════
  { email: "hello@fireship.io", name: "Jeff", org: "Fireship", genre: "youtube", hook: "IndexFast would make a killer '100 seconds of IndexNow' video — it's a developer tool that auto-indexes web pages via API" },
  { email: "youtube@t3.gg", name: "Theo", org: "Theo (t3.gg)", genre: "youtube", hook: "you'd love this — IndexFast is a Next.js dashboard that automates SEO indexing via IndexNow. Built by a solo vibe coder" },
  { email: "business@webdevsimplified.com", name: "Kyle", org: "Web Dev Simplified", genre: "youtube", hook: "your audience builds web apps but ignores SEO indexing — IndexFast solves that with zero config" },
  { email: "business@traversymedia.com", name: "Brad", org: "Traversy Media", genre: "youtube", hook: "your tutorials help devs ship projects — IndexFast helps those projects get found on Google. Great collab topic" },
  { email: "hello@codevolution.dev", name: "Vishwas", org: "Codevolution", genre: "youtube", hook: "Next.js tutorials are your bread and butter — IndexFast is a Next.js SaaS that automates SEO indexing. Perfect fit" },
  { email: "hello@jamesqquick.com", name: "James", org: "James Q Quick", genre: "youtube", hook: "you teach devs to build and ship — IndexFast helps them rank. Would love to collab on a 'launch your SaaS' video" },
  { email: "hello@developedbyed.com", name: "Ed", org: "developedbyed", genre: "youtube", hook: "your creative coding audience would love a 'build an SEO tool' video — IndexFast is the perfect case study" },
  { email: "hello@codestackr.com", name: "Jesse", org: "codeSTACKr", genre: "youtube", hook: "dev tools content is your sweet spot — IndexFast is a new one that automates SEO indexing via IndexNow" },

  // ═══════════════════════════════════════
  // 🎙️ PODCASTS — Guest / Sponsor
  // ═══════════════════════════════════════
  { email: "contact@indiehackers.com", name: "Indie Hackers Team", org: "Indie Hackers", genre: "podcast", hook: "solo founder story: built IndexFast, an SEO indexing SaaS, shipped it in weeks using AI tools — perfect IH podcast episode" },
  { email: "editors@changelog.com", name: "Changelog Editorial", org: "Changelog", genre: "podcast", hook: "IndexNow is an underrated protocol — I built IndexFast around it. Would love to discuss developer SEO on the show" },
  { email: "editor@softwareengineeringdaily.com", name: "SE Daily Editor", org: "Software Engineering Daily", genre: "podcast", hook: "technical deep-dive pitch: how IndexNow works, why search indexing is broken, and how IndexFast fixes it" },
  { email: "hello@syntax.fm", name: "Syntax Team", org: "Syntax.fm", genre: "podcast", hook: "Wes & Scott — web devs don't think about indexing until they launch. IndexFast automates it. Great hasty treat topic" },
  { email: "hello@shoptalkshow.com", name: "Shop Talk Show", org: "Shop Talk Show", genre: "podcast", hook: "front-end devs build amazing sites but forget indexing. IndexFast auto-submits via IndexNow — perfect show topic" },
  { email: "hello@ladybug.dev", name: "Ladybug Team", org: "Ladybug Podcast", genre: "podcast", hook: "SEO is under-discussed in the dev podcast world — IndexFast makes indexing accessible. Would love to be a guest" },

  // ═══════════════════════════════════════
  // 📧 VIRAL NEWSLETTERS — Sponsor / Feature
  // ═══════════════════════════════════════
  { email: "team@bensbites.com", name: "Ben's Bites Team", org: "Ben's Bites", genre: "newsletter", hook: "IndexFast uses AI-era thinking to solve a Web 1.0 problem: getting pages indexed. Your audience would get it instantly" },
  { email: "support@therundown.ai", name: "Rundown AI Team", org: "The Rundown AI", genre: "newsletter", hook: "AI builders create tons of pages — IndexFast auto-indexes them all. A perfect tool spotlight for your 500K+ readers" },
  { email: "advertise@tldrnewsletter.com", name: "TLDR Ads", org: "TLDR Newsletter", genre: "newsletter", hook: "interested in sponsoring TLDR — IndexFast is a dev tool that automates search indexing. Perfect for your 1.25M audience" },
  { email: "hello@bytes.dev", name: "Bytes.dev Team", org: "Bytes.dev", genre: "newsletter", hook: "your JS newsletter readers build web apps — IndexFast helps those apps show up in Google. Fun tool spotlight?" },
  { email: "hello@morningbrew.com", name: "Morning Brew Team", org: "Morning Brew", genre: "newsletter", hook: "SEO indexing as a service — a solo founder built IndexFast and agencies are already using it. Business audience angle" },
  { email: "hello@dense.com", name: "Dense Discovery Team", org: "Dense Discovery", genre: "newsletter", hook: "IndexFast is a beautifully designed developer tool — minimalist UI, automated SEO indexing. Fits your design-meets-tech vibe" },
  { email: "hello@smashingmagazine.com", name: "Smashing Team", org: "Smashing Magazine", genre: "newsletter", hook: "web performance matters to your readers — so does getting pages indexed. IndexFast automates the latter" },
  { email: "hello@css-tricks.com", name: "CSS-Tricks Team", org: "CSS-Tricks", genre: "newsletter", hook: "devs build beautiful sites with CSS but forget SEO basics — IndexFast handles indexing automatically" },

  // ═══════════════════════════════════════
  // 🏹 PRODUCT HUNT — Hunters & Community
  // ═══════════════════════════════════════
  { email: "hello@producthunt.com", name: "Product Hunt Team", org: "Product Hunt", genre: "ph", hook: "planning an IndexFast launch on PH — would love guidance on scheduling and any launch best practices" },
  { email: "hello@kevinwilliamdavid.com", name: "Kevin", org: "Kevin William David (PH Hunter)", genre: "ph", hook: "looking for a top hunter to launch IndexFast — it automates SEO indexing for devs and agencies. Would you hunt it?" },

  // ═══════════════════════════════════════
  // 🧑‍💻 DEV PLATFORMS — Feature / Partnership
  // ═══════════════════════════════════════
  { email: "support@dev.to", name: "DEV.to Team", org: "DEV.to", genre: "devplatform", hook: "thousands of devs publish on DEV daily — what if their posts auto-triggered IndexNow via IndexFast? Partnership idea" },
  { email: "hello@hashnode.com", name: "Hashnode Team", org: "Hashnode", genre: "devplatform", hook: "Hashnode blogs could auto-index via IndexNow — IndexFast makes that trivial. Integration partnership opportunity" },
  { email: "yourfriends@medium.com", name: "Medium Team", org: "Medium", genre: "devplatform", hook: "Medium publications could benefit from faster indexing — especially tech blogs competing for search traffic" },
  { email: "hello@hackernoon.com", name: "HackerNoon Team", org: "HackerNoon", genre: "devplatform", hook: "HackerNoon stories deserve instant indexing — IndexFast could auto-submit new articles via IndexNow" },
  { email: "hello@freecodecamp.org", name: "freeCodeCamp Team", org: "freeCodeCamp", genre: "devplatform", hook: "your educational content library is massive — IndexFast could help ensure new articles are indexed same-day" },

  // ═══════════════════════════════════════
  // 🐦 VIRAL X/TWITTER PERSONALITIES (via newsletter/site)
  // ═══════════════════════════════════════
  { email: "hello@swyx.io", name: "swyx", org: "swyx (Shawn Wang)", genre: "viral-x", hook: "you coined 'learn in public' — IndexFast helps builders get their public work indexed and discovered by search engines" },
  { email: "hello@joshwcomeau.com", name: "Josh", org: "Josh W Comeau", genre: "viral-x", hook: "your interactive blog posts are incredible — IndexFast ensures content like yours gets indexed the moment it's published" },
  { email: "hello@kentcdodds.com", name: "Kent", org: "Kent C. Dodds", genre: "viral-x", hook: "your courses and blog reach millions — IndexFast automates the boring SEO part so creators like you can focus on teaching" },
  { email: "hello@leerob.io", name: "Lee", org: "Lee Robinson (Vercel VP)", genre: "viral-x", hook: "you championed Next.js — IndexFast is a Next.js SaaS that automates SEO indexing. Would love your feedback" },
  { email: "hello@cassidoo.co", name: "Cassidy", org: "Cassidy Williams", genre: "viral-x", hook: "your audience of developers would love a tool that handles SEO indexing automatically — IndexFast does exactly that" },
  { email: "hello@wes.dev", name: "Wes", org: "Wes Bos", genre: "viral-x", hook: "hot tip for your audience: IndexFast auto-indexes web pages via IndexNow. No more 'Request Indexing' clicks in GSC" },
  { email: "hello@scotttolinski.com", name: "Scott", org: "Scott Tolinski (LevelUp)", genre: "viral-x", hook: "Level Up Tuts fans build lots of projects — IndexFast helps those projects actually show up in search results" },

  // ═══════════════════════════════════════
  // 🚀 STARTUP COMMUNITIES & ACCELERATORS
  // ═══════════════════════════════════════
  { email: "hello@ycombinator.com", name: "YC Team", org: "Y Combinator", genre: "startup", hook: "IndexFast automates SEO indexing — a problem every YC startup faces. Built by a solo founder, growing organically" },
  { email: "hello@thebootstrappedfounder.com", name: "Arvid", org: "The Bootstrapped Founder", genre: "startup", hook: "built IndexFast bootstrapped — automating SEO indexing for makers. Perfect story for your audience of indie founders" },
  { email: "hello@makerpad.co", name: "Makerpad Team", org: "Makerpad", genre: "startup", hook: "no-code makers build landing pages constantly — IndexFast ensures every new page gets indexed without any manual work" },
  { email: "hello@failory.com", name: "Failory Team", org: "Failory", genre: "startup", hook: "IndexFast is a solo-founded SEO tool gaining early traction — would love to share the building story with your audience" },
  { email: "hello@starterstory.com", name: "Starter Story Team", org: "Starter Story", genre: "startup", hook: "my founder story: built IndexFast, an SEO indexing SaaS, from zero — shipped in weeks using AI-assisted development" },
  { email: "hello@foundernotes.io", name: "Founder Notes Team", org: "Founder Notes", genre: "startup", hook: "love your founder interviews — I'd love to share how I built IndexFast: from idea to production in under a month" },

  // ═══════════════════════════════════════
  // 🧠 AI / TECH THOUGHT LEADERS
  // ═══════════════════════════════════════
  { email: "hello@simonwillison.net", name: "Simon", org: "Simon Willison", genre: "thought-leader", hook: "your work on LLM tooling is legendary — IndexFast applies similar automation thinking to SEO indexing via IndexNow" },
  { email: "hello@chriscoyier.net", name: "Chris", org: "Chris Coyier (CSS-Tricks)", genre: "thought-leader", hook: "you've shaped how devs think about the web — IndexFast automates the 'get indexed' step they always forget" },
  { email: "hello@thenewstack.io", name: "The New Stack Team", org: "The New Stack", genre: "thought-leader", hook: "article pitch: 'Why IndexNow matters and how IndexFast makes it accessible to every developer'" },
];

function getHTML(c) {
  const isPress = c.genre === "press";
  const isPodcast = c.genre === "podcast";
  const isNewsletter = c.genre === "newsletter";
  
  let cta, closing;
  if (isPress) {
    cta = "I can share screenshots, usage data, and an exclusive preview.";
    closing = "Happy to jump on a quick call or share a press kit.";
  } else if (isPodcast) {
    cta = "I'd love to be a guest and share the technical story behind IndexFast.";
    closing = "Happy to prep talking points or do a pre-call.";
  } else if (isNewsletter) {
    cta = "Interested in a sponsored slot or tool spotlight. Can share details on audience overlap.";
    closing = "Happy to discuss rates and provide assets.";
  } else {
    cta = "Would love your thoughts — happy to give you a free Pro account to try.";
    closing = "Would mean a lot to get signal-boosted by someone our audience respects.";
  }

  const subject = isPress
    ? `Story pitch: Solo founder ships SEO indexing tool used by agencies`
    : isPodcast
    ? `Guest pitch: The developer behind IndexFast — automating SEO indexing`
    : isNewsletter
    ? `Sponsor/feature inquiry — IndexFast × ${c.org}`
    : `${c.org} × IndexFast — built for builders like your audience`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">
<div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">Hey ${c.name} 👋</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">${c.hook}.</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">I'm Shaswat — I built <a href="https://indexfast.co?ref=${c.org.toLowerCase().replace(/[^a-z0-9]/g,'-')}" style="color:#7C3AED;text-decoration:none;font-weight:600;">IndexFast</a> to help developers and agencies <strong>get new pages crawled faster, ranked sooner, and seen in AI answers.</strong></p>
<div style="background:#f5f3ff;border-radius:8px;padding:18px;margin:0 0 18px;border-left:4px solid #7C3AED;">
<p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">⚡ <strong>Instant IndexNow submission</strong> — push URLs to Bing, Yandex, Naver in seconds</p>
<p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">📊 <strong>Multi-site dashboard</strong> — track what's indexed across all your sites</p>
<p style="margin:0;color:#4c1d95;font-size:14px;">🔄 <strong>Auto sitemap monitoring</strong> — detect new pages and submit them automatically</p>
</div>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 10px;">${cta}</p>
<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">${closing}</p>
<a href="https://indexfast.co?ref=${c.org.toLowerCase().replace(/[^a-z0-9]/g,'-')}" style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">See IndexFast →</a>
<div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;">
<p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">Cheers,<br><strong style="color:#374151;">Shaswat Raj</strong><br>Founder, <a href="https://indexfast.co" style="color:#7C3AED;text-decoration:none;">IndexFast</a> · <a href="https://x.com/SH20RAJ" style="color:#7C3AED;text-decoration:none;">@SH20RAJ</a></p>
</div>
</div>
<p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">Get new pages crawled faster ⚡ <a href="https://indexfast.co" style="color:#9ca3af;">indexfast.co</a></p>
</div></body></html>`;
  return { subject, html };
}

async function send(c, dry) {
  const { subject, html } = getHTML(c);
  if (dry) { console.log(`  📋 [DRY] ${c.email} — "${subject}"`); return true; }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${API}`, "Content-Type": "application/json" },
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
  console.log("\n🔥 IndexFast VIRAL Outreach — Press, YouTubers, Podcasts, Newsletters\n");
  if (dry) console.log("🔍 DRY RUN\n");

  let list = contacts.filter(c => !c.skip);
  if (test) list = [{ email: "sh20raj@gmail.com", name: "Shaswat", org: "Test", genre: "test", hook: "testing the viral outreach script" }];

  const genres = [...new Set(list.map(c => c.genre))];
  console.log(`📬 ${list.length} emails across ${genres.length} categories: ${genres.join(", ")}\n`);

  let sent = 0, fail = 0;
  for (let i = 0; i < list.length; i++) {
    console.log(`[${i+1}/${list.length}] ${list[i].org} (${list[i].genre})`);
    (await send(list[i], dry)) ? sent++ : fail++;
    if (i < list.length - 1) await sleep(DELAY);
  }
  console.log(`\n${"─".repeat(50)}\n📊 Sent: ${sent} | Failed: ${fail} | Categories: ${genres.length}\n🔥 Let's go viral!\n`);
}

main().catch(console.error);
