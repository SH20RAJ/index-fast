import { notFound, redirect } from "next/navigation";
import { getExternalResourceCategoryById } from "@/lib/tools-catalog";

interface LegacyCategoryRouteProps {
  params: Promise<{ categoryId: string }>;
}

export default async function LegacyCategoryRoute({ params }: LegacyCategoryRouteProps) {
  const { categoryId } = await params;

  if (categoryId === "id") {
    redirect("/tools");
  }

  const category = getExternalResourceCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  redirect(`/tools/resources/${category.id}`);
}
