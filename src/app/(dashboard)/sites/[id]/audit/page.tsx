
import SiteAuditView from "./SiteAuditView";

export default async function SiteAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SiteAuditView id={id} />;
}
