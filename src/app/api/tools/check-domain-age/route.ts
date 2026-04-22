import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Basic normalization
    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    // Using RDAP (standard successor to WHOIS) - free and typically no API key needed for basic lookups
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { "Accept": "application/rdap+json" }
    });

    if (!response.ok) {
      // Fallback for some TLDs or if RDAP fails
      return NextResponse.json({ 
        error: "Could not retrieve data for this domain. It might be invalid or unsupported." 
      }, { status: 404 });
    }

    const data = await response.json();
    
    // RDAP events usually contain "registration" or "creation"
    const registrationEvent = data.events?.find((e: any) => e.eventAction === 'registration');
    const createdDate = registrationEvent?.eventDate;

    if (!createdDate) {
       return NextResponse.json({ error: "Registration date not found in record" }, { status: 404 });
    }

    const created = new Date(createdDate);
    const now = new Date();
    const ageInMs = now.getTime() - created.getTime();
    
    const years = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

    return NextResponse.json({
      domain,
      createdDate: created.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      age: `${years} years, ${months} months`,
      registrar: data.entities?.[0]?.vcardArray?.[1]?.find((v: any) => v[0] === 'fn')?.[3] || "Unknown"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check domain age" 
    }, { status: 500 });
  }
}
