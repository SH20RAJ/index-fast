import "server-only";
import { StackServerApp } from "@stackframe/stack";

/**
 * Stack Auth Server-side Client
 * Uses environment variables:
 * - NEXT_PUBLIC_STACK_PROJECT_ID
 * - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
 * - STACK_SECRET_SERVER_KEY
 */
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});
