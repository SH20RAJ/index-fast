import { redirect } from "next/navigation";
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import { loadDashboardData } from "@/app/(dashboard)/actions";
import { stackServerApp } from "@/stack";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const data = await loadDashboardData();

  return (
    <div className="pt-1 pb-8">
      <DashboardOverview data={data} />
    </div>
  );
}
