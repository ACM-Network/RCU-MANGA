import { redirect } from "next/navigation";

interface LegacyChapterPageProps {
  params: Promise<{ slug: string; chapterId: string }>;
}

export default async function LegacyChapterPage({ params }: LegacyChapterPageProps) {
  const { slug, chapterId } = await params;
  redirect(`/read/${slug}/${chapterId}`);
}
