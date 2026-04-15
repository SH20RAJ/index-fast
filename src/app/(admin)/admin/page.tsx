import { cookies } from "next/headers";

import AdminAccessForm from "../_components/admin-access-form";
import AdminDashboard from "../_components/admin-dashboard";
import { ADMIN_COOKIE_NAME, isAdminSessionAuthorized, lockAdminAction, loadAdminDashboardData, unlockAdminAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!isAdminSessionAuthorized(token)) {
    return <AdminAccessForm unlockAction={unlockAdminAction} />;
  }

  const data = await loadAdminDashboardData();

  return <AdminDashboard data={data} lockAction={lockAdminAction} />;
}