import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { createGoogleOAuthClient } from "@/lib/api/google";
import { GSC_READONLY_SCOPE } from "@/lib/google/constants";

function resolveRedirectUri(request: NextRequest) {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  return new URL("/api/gsc/oauth/callback", request.url).toString();
}

export async function GET(request: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/handler/sign-in?after_auth_return_to=%2Fsites", request.url));
  }

  const state = crypto.randomUUID();
  const returnTo = request.nextUrl.searchParams.get("returnTo") || "/sites";
  const redirectUri = resolveRedirectUri(request);

  const oauth2Client = createGoogleOAuthClient(redirectUri);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: true,
    scope: [GSC_READONLY_SCOPE],
    state,
  });

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("gsc_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
  response.cookies.set("gsc_oauth_return_to", returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
