import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@/components/ui/mui";
import { alpha } from "@/lib/color";
import {
  EXTERNAL_RESOURCE_CATEGORIES,
  getExternalResourceCategoryById,
  getExternalResourcesByCategory,
} from "@/lib/tools-catalog";

interface ResourceCategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export function generateStaticParams() {
  return EXTERNAL_RESOURCE_CATEGORIES.map((category) => ({ categoryId: category.id }));
}

export async function generateMetadata({ params }: ResourceCategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getExternalResourceCategoryById(categoryId);

  if (!category) {
    return {
      title: "Resource Category Not Found",
      description: "The requested external SEO resource category does not exist.",
    };
  }

  return {
    title: `${category.title} Resources | IndexFast Tools`,
    description: category.description,
    alternates: {
      canonical: `/tools/resources/${category.id}`,
    },
    openGraph: {
      title: `${category.title} Resources | IndexFast`,
      description: category.description,
      url: `/tools/resources/${category.id}`,
      type: "website",
    },
  };
}

export default async function ResourceCategoryPage({ params }: ResourceCategoryPageProps) {
  const { categoryId } = await params;
  const category = getExternalResourceCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const resources = getExternalResourcesByCategory(category.id);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(960px 460px at 12% -8%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(820px 420px at 88% -15%, rgba(34,197,94,0.14), transparent 64%)",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Chip
            label="External SEO Resource Hub"
            sx={{
              alignSelf: "flex-start",
              border: "1px solid rgba(14,165,233,0.35)",
              bgcolor: "rgba(14,165,233,0.08)",
              color: "info.main",
              fontWeight: 800,
            }}
          />

          <Typography variant="h2">{category.title}</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 840 }}>
            {category.description}
          </Typography>

          <Stack spacing={2}>
            {resources.map((resource) => (
              <Card
                key={resource.title}
                sx={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  bgcolor: alpha("#ffffff", 0.88),
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.25}>
                    <Typography variant="h5" fontWeight={800}>
                      {resource.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {resource.description}
                    </Typography>
                    <Divider />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <Button
                        component="a"
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{ textTransform: "none", fontWeight: 800 }}
                      >
                        Open Resource
                      </Button>
                      <Button
                        component="a"
                        href="/tools"
                        variant="outlined"
                        sx={{ textTransform: "none", fontWeight: 800 }}
                      >
                        Back to Tools Directory
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
