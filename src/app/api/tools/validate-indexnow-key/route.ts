import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { key, url } = await req.json();
    if (!key || !url) {
      return NextResponse.json({ error: "Key and URL are required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "IndexFast-Key-Validator/1.0" },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ 
        valid: false, 
        message: `Could not fetch key file. Server returned ${response.status} ${response.statusText}`,
        status: response.status
      });
    }

    const content = (await response.text()).trim();
    const isValid = content === key.trim();

    return NextResponse.json({
      valid: isValid,
      fetchedKey: content,
      providedKey: key,
      message: isValid ? "Key file is valid and matches!" : "Key file found but content does not match provided key.",
      status: response.status
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to validate key" 
    }, { status: 500 });
  }
}
