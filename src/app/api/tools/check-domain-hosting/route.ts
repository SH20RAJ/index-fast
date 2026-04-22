import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

export async function POST(req: NextRequest) {
  try {
    let { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    // 1. Resolve IP
    const addresses = await dns.resolve4(domain);
    const ip = addresses[0];

    // 2. Fetch Hosting Info from IP-API (Free for non-commercial use)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,continent,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch hosting data");
    }

    const data = await response.json();

    return NextResponse.json({
      domain,
      ip,
      provider: data.isp || data.org || "Unknown",
      location: `${data.city}, ${data.country}`,
      asn: data.as || "Unknown",
      details: data
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check hosting" 
    }, { status: 500 });
  }
}
