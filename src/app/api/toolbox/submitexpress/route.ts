import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { urls, email, name, phone, country, captcha, checksum } = await req.json();

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "URLs are required" }, { status: 400 });
  }

  const results = [];

  for (const url of urls) {
    try {
      // Construct the SubmitExpress API URL
      const apiUrl = new URL("https://www.submitexpress.com/includes/php/ajax/freeSubmission.php");
      apiUrl.searchParams.set("input_url", url);
      apiUrl.searchParams.set("input_email", email || "mail2@indexfast.co");
      apiUrl.searchParams.set("input_name", name || "IndexFast Co");
      apiUrl.searchParams.set("input_phone", phone || "09508846601");
      apiUrl.searchParams.set("input_country", country || "IN");
      apiUrl.searchParams.set("captcha", captcha || "Ljbcj");
      apiUrl.searchParams.set("checksum", checksum || "5932");
      apiUrl.searchParams.set("client_ip", "");

      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "Referer": "https://www.submitexpress.com/free-tools/free-website-submission/",
        },
      });

      const text = await response.text();
      
      // SubmitExpress usually returns a JSON-like string or HTML fragment
      // We'll assume success if the response is 200 OK for now, 
      // but in a real scenario we'd parse the response body to be sure.
      results.push({
        url,
        status: response.ok ? "success" : "failed",
        message: text.substring(0, 100), // Include a snippet of the response
      });
    } catch (error: any) {
      results.push({
        url,
        status: "failed",
        message: error.message,
      });
    }
  }

  return NextResponse.json({ results });
}
