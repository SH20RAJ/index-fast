#!/usr/bin/env node

/**
 * IndexFast Founder/Vibe Coder Outreach
 * Sends personalized emails to indie hackers, solo founders, and vibe coders
 * Usage: node scripts/send-founders.mjs [--dry-run] [--test]
 */

const RESEND_API_KEY = "re_4q4GyCVo_BkeV6PZ6R36jx7Xq3TWGtYCK";
const FROM = "Shaswat from IndexFast <onboarding@contact.indexfast.co>";
const REPLY_TO = "sh20raj@gmail.com";
const DELAY_MS = 1500;

const contacts = [
  // ── Solo Founders & Vibe Coders ──
  {
    email: "arvid@thebootstrappedfounder.com",
    name: "Arvid",
    project: "The Bootstrapped Founder",
    hook: "your newsletter has been my go-to for building in public",
    type: "founder",
  },
  {
    email: "hi@seobotai.com",
    name: "John",
    project: "SEObot",
    hook: "SEObot is a brilliant take on AI-powered SEO — we solve the indexing side of the puzzle",
    type: "founder",
  },
  {
    email: "support@seobotai.com",
    name: "SEObot Team",
    project: "SEObot",
    hook: "your users generate tons of AI content — IndexFast makes sure it actually gets indexed",
    type: "founder",
  },
  {
    email: "slack@lennyrachitsky.com",
    name: "Lenny",
    project: "Lenny's Newsletter",
    hook: "your community of product builders would love a tool that automates the 'get indexed' step",
    type: "influencer",
  },
  {
    email: "meetup@lennyrachitsky.com",
    name: "Lenny's Team",
    project: "Lenny's Newsletter",
    hook: "I'd love to explore sponsoring a community meetup — IndexFast is perfect for your audience",
    type: "influencer",
    skip: true, // only use one Lenny contact
  },
  {
    email: "hello@supastarter.dev",
    name: "Supastarter Team",
    project: "Supastarter",
    hook: "your Next.js boilerplate users ship fast — IndexFast helps them get indexed just as fast",
    type: "founder",
  },
  {
    email: "hello@makerkit.dev",
    name: "MakerKit Team",
    project: "MakerKit",
    hook: "SaaS builders using MakerKit need their pages indexed quickly — that's exactly what we do",
    type: "founder",
  },
  {
    email: "hello@launchfa.st",
    name: "LaunchFast Team",
    project: "LaunchFast",
    hook: "your users ship MVPs in days — IndexFast ensures their landing pages rank just as quickly",
    type: "founder",
  },
  {
    email: "marc@shipfa.st",
    name: "Marc",
    project: "ShipFast",
    hook: "you've literally built the bible for shipping fast — IndexFast is the missing 'get indexed fast' piece",
    type: "founder",
  },
  {
    email: "hello@rapidlaunch.it",
    name: "RapidLaunch Team",
    project: "RapidLaunch",
    hook: "rapid launch + rapid indexing = unstoppable combo for your users",
    type: "founder",
  },
  {
    email: "danny@headlime.com",
    name: "Danny",
    project: "HeadshotPro / Headlime",
    hook: "you've mastered building AI products — IndexFast handles the SEO side automatically",
    type: "founder",
  },
  {
    email: "hello@builderkit.ai",
    name: "BuilderKit Team",
    project: "BuilderKit",
    hook: "your AI app boilerplate users need indexing for their generated pages — we automate that",
    type: "founder",
  },
  {
    email: "tony@tonydinh.com",
    name: "Tony",
    project: "Tony Dinh (BlackMagic, TypingMind)",
    hook: "love following your build-in-public journey — IndexFast could be a great add-on for your users' SEO",
    type: "founder",
  },
  {
    email: "hi@pimjo.com",
    name: "Pimjo Team",
    project: "Pimjo",
    hook: "your tools help devs build faster — IndexFast helps them rank faster",
    type: "founder",
  },
  {
    email: "hello@gracker.ai",
    name: "Gracker Team",
    project: "Gracker",
    hook: "you're already in the programmatic SEO space — IndexFast automates the indexing step after content generation",
    type: "founder",
  },
  {
    email: "hello@byword.ai",
    name: "Byword Team",
    project: "Byword AI",
    hook: "your users generate hundreds of SEO articles — IndexFast pushes them all to search engines instantly",
    type: "founder",
  },
  {
    email: "support@writesonic.com",
    name: "Writesonic Team",
    project: "Writesonic",
    hook: "your AI writer creates content at scale — IndexFast ensures it all gets indexed immediately",
    type: "founder",
  },
  {
    email: "hello@koala.sh",
    name: "Koala Team",
    project: "KoalaWriter",
    hook: "your users write SEO articles with AI — IndexFast is the natural next step to get them indexed",
    type: "founder",
  },
  {
    email: "support@zimmwriter.com",
    name: "ZimmWriter Team",
    project: "ZimmWriter",
    hook: "bulk content creators using ZimmWriter need bulk indexing — that's our sweet spot",
    type: "founder",
  },
  {
    email: "hello@autoblogging.ai",
    name: "AutoBlogging Team",
    project: "AutoBlogging.ai",
    hook: "auto-generated blog posts need auto-indexing — IndexFast + AutoBlogging is the perfect stack",
    type: "founder",
  },
  {
    email: "contact@agencyanalytics.com",
    name: "AgencyAnalytics Team",
    project: "AgencyAnalytics",
    hook: "your agency clients already track SEO metrics — adding automated indexing is the missing piece",
    type: "founder",
  },
  {
    email: "hello@rankmath.com",
    name: "RankMath Team",
    project: "Rank Math",
    hook: "you already support IndexNow in WordPress — IndexFast extends that to any platform with a dashboard",
    type: "founder",
  },
];

// ─── EMAIL TEMPLATE ──────────────────────────────────────────────────────────

function getEmail(c) {
  const isInfluencer = c.type === "influencer";
  const subject = isInfluencer
    ? `Partnership idea — IndexFast × ${c.project}`
    : `${c.project} × IndexFast — a natural combo?`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">
<div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e5e7eb;">

<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">
  Hey ${c.name} 👋
</p>

<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">
  ${c.hook}.
</p>

<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">
  I'm Shaswat — I built <a href="https://indexfast.co?ref=${c.project.toLowerCase().replace(/[^a-z0-9]/g, '-')}" style="color:#7C3AED;text-decoration:none;font-weight:600;">IndexFast</a> to help makers and founders <strong>get new pages crawled faster, ranked sooner, and seen in AI answers.</strong>
</p>

<div style="background:#f5f3ff;border-radius:8px;padding:18px;margin:0 0 18px;border-left:4px solid #7C3AED;">
  <p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">⚡ <strong>Push URLs to Bing/Yandex/Naver</strong> via IndexNow — instantly</p>
  <p style="margin:0 0 6px;color:#4c1d95;font-size:14px;">📊 <strong>Track indexation status</strong> across all your sites in one dashboard</p>
  <p style="margin:0;color:#4c1d95;font-size:14px;">🔄 <strong>Auto-detect sitemap changes</strong> and submit new pages automatically</p>
</div>

<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 14px;">
  ${isInfluencer ? "Would love to explore a sponsorship or collab — happy to give you a <strong>free lifetime Pro account</strong> to try." : "Would love your thoughts — I'd happily give you a <strong>free Pro account</strong> to try it out."}
</p>

<a href="https://indexfast.co?ref=${c.project.toLowerCase().replace(/[^a-z0-9]/g, '-')}" 
   style="display:inline-block;background:#7C3AED;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
  Check Out IndexFast →
</a>

<div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;">
  <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
    Cheers,<br>
    <strong style="color:#374151;">Shaswat Raj</strong><br>
    Founder, <a href="https://indexfast.co" style="color:#7C3AED;text-decoration:none;">IndexFast</a> · 
    <a href="https://x.com/SH20RAJ" style="color:#7C3AED;text-decoration:none;">@SH20RAJ</a>
  </p>
</div>

</div>
<p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:14px;">
  Built by a solo founder, for solo founders ⚡ <a href="https://indexfast.co" style="color:#9ca3af;">indexfast.co</a>
</p>
</div>
</body>
</html>`;

  return { subject, html };
}

// ─── SEND ────────────────────────────────────────────────────────────────────

async function sendEmail(contact, { dryRun = false } = {}) {
  const { subject, html } = getEmail(contact);
  const payload = { from: FROM, to: contact.email, reply_to: REPLY_TO, subject, html };

  if (dryRun) {
    console.log(`  📋 [DRY] ${contact.email} — "${subject}"`);
    return { ok: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (!res.ok) {
    console.error(`  ❌ FAIL: ${contact.email} — ${JSON.stringify(data)}`);
    return { ok: false, error: data };
  }
  console.log(`  ✅ ${contact.email} (${data.id})`);
  return { ok: true };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const testOnly = args.includes("--test");

  console.log("\n⚡ IndexFast Founder Outreach\n");
  if (dryRun) console.log("🔍 DRY RUN\n");

  let list = contacts.filter((c) => !c.skip);
  if (testOnly) list = [{ email: "sh20raj@gmail.com", name: "Shaswat", project: "TestProject", hook: "testing the founder email flow", type: "founder" }];

  console.log(`📬 Sending ${list.length} emails...\n`);
  let sent = 0, failed = 0;

  for (let i = 0; i < list.length; i++) {
    console.log(`[${i + 1}/${list.length}] ${list[i].project}`);
    const r = await sendEmail(list[i], { dryRun });
    r.ok ? sent++ : failed++;
    if (i < list.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n${"─".repeat(50)}\n📊 Sent: ${sent} | Failed: ${failed}\n🎉 Done!\n`);
}

main().catch(console.error);
