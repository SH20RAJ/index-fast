import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { createGoogleOAuthClient } from "@/lib/api/google";

function resolveRedirectUri(request: NextRequest) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  return new URL("/api/gsc/oauth/callback", request.url).toString();
}

function withStatus(url: string, status: string, message?: string) {
  const target = new URL(url, "http://localhost");
  target.searchParams.set("gsc", status);
  if (message) {
    target.searchParams.set("gsc_message", message);
  }
  return `${target.pathname}${target.search}`;
}

export async function GET(request: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/handler/sign-in?after_auth_return_to=%2Fsites", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("gsc_oauth_state")?.value;
  const returnTo = request.cookies.get("gsc_oauth_return_to")?.value || "/sites";

  if (!code || !state || !storedState || state !== storedState) {
    const response = NextResponse.redirect(new URL(withStatus(returnTo, "error", "Invalid OAuth state. Retry import."), request.url));
    response.cookies.delete("gsc_oauth_state");
    response.cookies.delete("gsc_oauth_return_to");
    return response;
  }

  try {
    const oauth2Client = createGoogleOAuthClient(resolveRedirectUri(request));
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;

    if (!accessToken) {
      throw new Error("Missing Google access token.");
    }

    const expiresAt = tokens.expiry_date ? Math.max(60, Math.floor((tokens.expiry_date - Date.now()) / 1000)) : 60 * 60;
    const response = NextResponse.redirect(new URL(withStatus(returnTo, "connected"), request.url));

    response.cookies.set("gsc_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresAt,
    });
    response.cookies.delete("gsc_oauth_state");
    response.cookies.delete("gsc_oauth_return_to");

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google auth failed.";
    const response = NextResponse.redirect(new URL(withStatus(returnTo, "error", message), request.url));
    response.cookies.delete("gsc_oauth_state");
    response.cookies.delete("gsc_oauth_return_to");
    response.cookies.delete("gsc_access_token");
    return response;
  }
}
