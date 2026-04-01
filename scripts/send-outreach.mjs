#!/usr/bin/env node

/**
 * IndexFast Outreach Email Script
 * Sends personalized cold emails via Resend API
 * Usage: node scripts/send-outreach.mjs [--dry-run] [--test]
 *   --dry-run  Preview emails without sending
 *   --test     Send only to sh20raj@gmail.com
 */

const RESEND_API_KEY = "re_4q4GyCVo_BkeV6PZ6R36jx7Xq3TWGtYCK";
const FROM = "Shaswat from IndexFast <onboarding@contact.indexfast.co>";
const REPLY_TO = "sh20raj@gmail.com";
const DELAY_MS = 1500; // 1.5s between emails to respect rate limits

// ─── CONTACTS ────────────────────────────────────────────────────────────────

const contacts = [
  // ── Tier 1: Agency Sales ──
  {
    email: "sales@coalitiontechnologies.com",
    name: "Coalition Technologies Team",
    agency: "Coalition Technologies",
    focus: "e-commerce SEO",
    type: "agency",
  },
  {
    email: "sales@npdigital.com",
    name: "NP Digital Team",
    agency: "NP Digital",
    focus: "content-driven SEO at scale",
    type: "agency",
  },
  {
    email: "opportunity@ignitevisibility.com",
    name: "Ignite Visibility Team",
    agency: "Ignite Visibility",
    focus: "enterprise-grade SEO",
    type: "agency",
  },
  {
    email: "sales@boostability.com",
    name: "Boostability Team",
    agency: "Boostability",
    focus: "scalable SMB SEO",
    type: "agency",
  },
  {
    email: "contact@boostability.com",
    name: "Boostability Team",
    agency: "Boostability",
    focus: "scalable SMB SEO",
    type: "agency",
    skip: true, // duplicate org — only email sales@
  },
  {
    email: "hello@interodigital.com",
    name: "Intero Digital Team",
    agency: "Intero Digital",
    focus: "tech-powered SEO",
    type: "agency",
  },
  {
    email: "contact@smartsites.com",
    name: "SmartSites Team",
    agency: "SmartSites",
    focus: "high-performance digital marketing",
    type: "agency",
  },
  {
    email: "hello@searchbloom.com",
    name: "Searchbloom Team",
    agency: "Searchbloom",
    focus: "ROI-focused SEO",
    type: "agency",
  },
  {
    email: "hello@siegemedia.com",
    name: "Siege Media Team",
    agency: "Siege Media",
    focus: "content-led SEO",
    type: "agency",
  },
  {
    email: "bdteam@seerinteractive.com",
    name: "Seer Interactive Team",
    agency: "Seer Interactive",
    focus: "data-driven SEO strategy",
    type: "agency",
  },
  {
    email: "contact@pageonepower.com",
    name: "Page One Power Team",
    agency: "Page One Power",
    focus: "link building and SEO",
    type: "agency",
  },
  {
    email: "sales@directiveconsulting.com",
    name: "Directive Team",
    agency: "Directive",
    focus: "B2B and SaaS SEO",
    type: "agency",
  },
  {
    email: "sales@webfx.com",
    name: "WebFX Team",
    agency: "WebFX",
    focus: "full-service SEO for 500+ clients",
    type: "agency",
  },
  {
    email: "management@coalitiontechnologies.com",
    name: "Coalition Technologies Management",
    agency: "Coalition Technologies",
    focus: "e-commerce SEO",
    type: "agency",
    skip: true, // duplicate org
  },

  // ── Tier 2: Influencer / Newsletter ──
  {
    email: "info@orainti.com",
    name: "Aleyda",
    agency: "SEOFOMO / Orainti",
    focus: "international SEO consulting",
    type: "influencer",
  },
];

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

function getAgencyEmail(contact) {
  const subject = `Quick question about ${contact.agency}'s indexing workflow`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Hi ${contact.name},
      </p>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        I noticed <strong>${contact.agency}</strong> specializes in ${contact.focus} — quick question: how does your team currently handle bulk URL indexing and monitoring across client sites?
      </p>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        We built <a href="https://indexfast.co?ref=outreach" style="color:#7C3AED;text-decoration:none;font-weight:600;">IndexFast</a> to help agencies <strong>get new pages crawled faster, ranked sooner, and seen in AI answers</strong>:
      </p>
      
      <div style="background:#f5f3ff;border-radius:8px;padding:20px;margin:0 0 20px;border-left:4px solid #7C3AED;">
        <p style="margin:0 0 8px;color:#4c1d95;font-size:14px;">⚡ <strong>Bulk IndexNow submission</strong> — push URLs to Bing, Yandex, Naver instantly</p>
        <p style="margin:0 0 8px;color:#4c1d95;font-size:14px;">📊 <strong>Multi-site dashboard</strong> — real-time indexation tracking across all clients</p>
        <p style="margin:0;color:#4c1d95;font-size:14px;">🔄 <strong>Sitemap monitoring</strong> — auto-detect new/changed pages, submit automatically</p>
      </div>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Happy to set up a <strong>free Agency trial</strong> for your team — takes 2 minutes to connect your first site.
      </p>
      
      <a href="https://indexfast.co?ref=outreach-${contact.agency.toLowerCase().replace(/\s+/g, '-')}" 
         style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
        Try IndexFast Free →
      </a>
      
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
          Best,<br>
          <strong style="color:#374151;">Shaswat Raj</strong><br>
          Founder, <a href="https://indexfast.co" style="color:#7C3AED;text-decoration:none;">IndexFast</a>
        </p>
      </div>
      
    </div>
    
    <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px;">
      Sent with ❤️ from IndexFast · <a href="https://indexfast.co" style="color:#9ca3af;">indexfast.co</a>
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

function getInfluencerEmail(contact) {
  const subject = `Quick partnership idea for ${contact.agency}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Hi ${contact.name},
      </p>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Big fan of your work on ${contact.focus} — your insights have genuinely shaped how I think about technical SEO.
      </p>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        I built <a href="https://indexfast.co?ref=influencer" style="color:#7C3AED;text-decoration:none;font-weight:600;">IndexFast</a>, a dashboard that automates SEO indexing via IndexNow — think of it as <em>"Google Search Console indexing on autopilot."</em>
      </p>
      
      <div style="background:#f5f3ff;border-radius:8px;padding:20px;margin:0 0 20px;border-left:4px solid #7C3AED;">
        <p style="margin:0 0 8px;color:#4c1d95;font-size:14px;">⚡ Push URLs to search engines instantly via IndexNow</p>
        <p style="margin:0 0 8px;color:#4c1d95;font-size:14px;">📊 Track indexation status across multiple sites</p>
        <p style="margin:0;color:#4c1d95;font-size:14px;">🔄 Auto-detect sitemap changes and submit new pages</p>
      </div>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Would you be open to:
      </p>
      <ul style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;padding-left:20px;">
        <li>A sponsored mention in ${contact.agency}, or</li>
        <li>A quick review/collab?</li>
      </ul>
      
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Happy to share a <strong>free lifetime Pro account</strong> for you to test.
      </p>
      
      <a href="https://indexfast.co?ref=partner-${contact.name.toLowerCase().replace(/\s+/g, '-')}" 
         style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
        Check Out IndexFast →
      </a>
      
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
          Cheers,<br>
          <strong style="color:#374151;">Shaswat Raj</strong><br>
          Founder, <a href="https://indexfast.co" style="color:#7C3AED;text-decoration:none;">IndexFast</a>
        </p>
      </div>
      
    </div>
    
    <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px;">
      Sent with ❤️ from IndexFast · <a href="https://indexfast.co" style="color:#9ca3af;">indexfast.co</a>
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

// ─── SEND FUNCTION ───────────────────────────────────────────────────────────

async function sendEmail(contact, { dryRun = false } = {}) {
  const { subject, html } =
    contact.type === "influencer"
      ? getInfluencerEmail(contact)
      : getAgencyEmail(contact);

  const payload = {
    from: FROM,
    to: contact.email,
    reply_to: REPLY_TO,
    subject,
    html,
  };

  if (dryRun) {
    console.log(`  📋 [DRY RUN] Would send to: ${contact.email}`);
    console.log(`     Subject: ${subject}`);
    return { id: "dry-run", to: contact.email };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(`  ❌ FAILED: ${contact.email} — ${JSON.stringify(data)}`);
    return { error: data, to: contact.email };
  }

  console.log(`  ✅ Sent to: ${contact.email} (ID: ${data.id})`);
  return { id: data.id, to: contact.email };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const testOnly = args.includes("--test");

  console.log("\n⚡ IndexFast Outreach Emailer\n");

  if (dryRun) console.log("🔍 DRY RUN MODE — no emails will be sent\n");
  if (testOnly) console.log("🧪 TEST MODE — sending only to sh20raj@gmail.com\n");

  // Filter out skipped contacts
  let targetContacts = contacts.filter((c) => !c.skip);

  if (testOnly) {
    // Send test email to self
    targetContacts = [
      {
        email: "sh20raj@gmail.com",
        name: "Shaswat",
        agency: "TestAgency",
        focus: "testing the outreach flow",
        type: "agency",
      },
    ];
  }

  console.log(`📬 Sending ${targetContacts.length} emails...\n`);

  const results = { sent: 0, failed: 0, errors: [] };

  for (let i = 0; i < targetContacts.length; i++) {
    const contact = targetContacts[i];
    console.log(`[${i + 1}/${targetContacts.length}] ${contact.agency} (${contact.email})`);

    const result = await sendEmail(contact, { dryRun });

    if (result.error) {
      results.failed++;
      results.errors.push(result);
    } else {
      results.sent++;
    }

    // Rate limit delay (skip on last email)
    if (i < targetContacts.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n" + "─".repeat(50));
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Sent: ${results.sent}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log(`\n⚠️  Failed emails:`);
    results.errors.forEach((e) => console.log(`   - ${e.to}: ${JSON.stringify(e.error)}`));
  }

  console.log("\n🎉 Done!\n");
}

main().catch(console.error);
