"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ThemedPage, ArticleEditor } from "@dont-verify-me/ui";
import {
	getPlatformBySlugAdmin,
	getArticleByPlatformId,
	createArticle,
	updateArticle,
	updatePlatform,
	generateSlug,
	Platform,
	Article,
	supabase,
} from "@dont-verify-me/shared-logic";
import { YStack, Spinner, Text } from "tamagui";

export default function EditArticlePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const [platform, setPlatform] = useState<Platform | null>(null);
	const [article, setArticle] = useState<Article | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const platformData = await getPlatformBySlugAdmin(slug);
				if (!platformData) {
					router.push("/dashboard");
					return;
				}

				setPlatform(platformData);

				const articleData = await getArticleByPlatformId(platformData.id);
				setArticle(articleData);
			} catch (err) {
				console.error("Failed to load data:", err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [slug, router]);

	const handleSave = async (articleData: Partial<Article>) => {
		if (!platform) return;

		const slug = generateSlug(articleData.title || "");

		if (article) {
			// Update existing article
			await updateArticle(article.id, {
				...articleData,
				slug,
			});
		} else {
			// Create new article
			await createArticle({
				platform_id: platform.id,
				slug,
				is_published: false,
				...articleData,
			} as any);
		}

		router.push("/dashboard");
	};

	const handleCancel = () => {
		router.push("/dashboard");
	};

	const handleIconUpdate = async (newIconUrl: string) => {
		if (!platform) return;

		try {
			await updatePlatform(platform.id, {
				icon_url: newIconUrl || null,
			});
			// Update local state to reflect the change
			setPlatform({ ...platform, icon_url: newIconUrl || null });
		} catch (error) {
			console.error("Failed to update platform icon:", error);
			throw error; // Re-throw so the uploader can catch it
		}
	};

	if (loading) {
		return (
			<ThemedPage>
				<YStack
					flex={1}
					justifyContent="center"
					alignItems="center"
					minHeight="100vh"
				>
					<Spinner color="$accent" size="large" />
				</YStack>
			</ThemedPage>
		);
	}

	if (!platform) {
		return (
			<ThemedPage>
				<YStack
					flex={1}
					justifyContent="center"
					alignItems="center"
					minHeight="100vh"
				>
					<Text color="$red10">Platform not found</Text>
				</YStack>
			</ThemedPage>
		);
	}

	return (
		<ThemedPage>
			<YStack flex={1} padding="$4">
				<YStack maxWidth={900} alignSelf="center" width="100%">
					<ArticleEditor
						initialData={article || undefined}
						onSave={handleSave}
						onCancel={handleCancel}
						platformName={platform.name}
						platformIconUrl={platform.icon_url}
						platformSlug={platform.slug}
						onIconUpdate={handleIconUpdate}
						supabase={supabase}
					/>
				</YStack>
			</YStack>
		</ThemedPage>
	);
}
