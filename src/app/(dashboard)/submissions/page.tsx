import SubmissionsView from "./SubmissionsView";
import { db } from "@/lib/db";
import { submissions, websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { stackServerApp } from "@/stack";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Submissions",
  description: "Track your latest Bing, IndexNow, and ping submissions.",
};

export default function SubmissionsPage() {
  return <SubmissionsDataLoader />;
}

async function SubmissionsDataLoader() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const rows = await db
    .select({
      id: submissions.id,
      url: submissions.url,
      engine: submissions.engine,
      status: submissions.status,
      errorMessage: submissions.errorMessage,
      createdAt: submissions.createdAt,
      websiteId: websites.id,
      websiteUrl: websites.url,
    })
    .from(submissions)
    .innerJoin(websites, eq(submissions.websiteId, websites.id))
    .where(eq(websites.userId, user.id))
    .orderBy(desc(submissions.createdAt));

  return (
    <SubmissionsView
      initialRows={rows.map((row) => ({
        ...row,
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
      }))}
    />
  );
}
