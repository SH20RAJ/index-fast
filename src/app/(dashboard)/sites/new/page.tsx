import NewSiteFlow from "@/components/dashboard/NewSiteFlow";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { ensureUserRecord } from "@/lib/db/user-sync";

export const metadata = {
  title: "Add New Website",
  description: "Connect your website to IndexFast for auto indexing.",
};

export default async function NewSitePage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  return (
    <div className="min-h-screen bg-background/50">
      <NewSiteFlow />
    </div>
  );
}
