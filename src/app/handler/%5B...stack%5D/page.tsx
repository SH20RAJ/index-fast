import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

/**
 * Catch-all route to handle login/sign-up/callback URLs.
 */
export default async function Handler(props: { params: Promise<{ stack: string[] }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return <StackHandler app={stackServerApp} fullPage={true} {...props} />;
}
