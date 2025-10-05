"use client";

import { useState, useEffect } from "react";
import { ThemedPage, PlatformCard, PlatformForm } from "@dont-verify-me/ui";
import {
	useAuth,
	getAllPlatforms,
	getArticleByPlatformId,
	createPlatform,
	deletePlatform,
	togglePlatformPublish,
	Platform,
} from "@dont-verify-me/shared-logic";
import { useRouter } from "next/navigation";
import { YStack, H1, Button, ScrollView, XStack, Text, Spinner } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";

export default function DashboardPage() {
	const { user } = useAuth();
	const [platforms, setPlatforms] = useState<Platform[]>([]);
	const [platformArticles, setPlatformArticles] = useState<
		Record<string, boolean>
	>({});
	const [loading, setLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			loadPlatforms();
		}
	}, [user]);

	const loadPlatforms = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getAllPlatforms();
			setPlatforms(data);

			// Check which platforms have articles
			const articleChecks: Record<string, boolean> = {};
			await Promise.all(
				data.map(async (platform) => {
					const article = await getArticleByPlatformId(platform.id);
					articleChecks[platform.id] = !!article;
				})
			);
			setPlatformArticles(articleChecks);
		} catch (err) {
			console.error("Failed to fetch platforms:", err);
			setError("Failed to load platforms. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreatePlatform = async (data: Partial<Platform>) => {
		await createPlatform(data as any);
		setShowCreateForm(false);
		loadPlatforms();
	};

	const handleTogglePublish = async (id: string) => {
		await togglePlatformPublish(id);
		loadPlatforms();
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this platform?")) {
			await deletePlatform(id);
			loadPlatforms();
		}
	};

	const handleEditArticle = (platformId: string, slug: string) => {
		router.push(`/dashboard/platforms/${slug}/edit`);
	};
	if (loading) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Spinner size="large" />
				</YStack>
			</ThemedPage>
		);
	}

	if (error) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Text color="$red10">{error}</Text>
				</YStack>
			</ThemedPage>
		);
	}

	return (
		<ThemedPage>
			<ScrollView flex={1} padding="\$4">
				<YStack gap="\$4" maxWidth={1200} alignSelf="center" width="100%">
					<XStack justifyContent="space-between" alignItems="center">
						<H1>Content Management</H1>
						<Button
							icon={<Plus />}
							onPress={() => setShowCreateForm(true)}
							theme="blue"
						>
							Add Platform
						</Button>
					</XStack>

					{showCreateForm && (
						<PlatformForm
							onSave={handleCreatePlatform}
							onCancel={() => setShowCreateForm(false)}
						/>
					)}

					<YStack gap="\$3">
						{platforms.length === 0 ? (
							<Text color="\$gray11" textAlign="center" padding="\$6">
								No platforms yet. Create one to get started!
							</Text>
						) : (
							platforms.map((platform) => (
								<PlatformCard
									key={platform.id}
									platform={platform}
									hasArticle={platformArticles[platform.id] || false}
									onEdit={() => handleEditArticle(platform.id, platform.slug)}
									onTogglePublish={() => handleTogglePublish(platform.id)}
									onDelete={() => handleDelete(platform.id)}
								/>
							))
						)}
					</YStack>
				</YStack>
			</ScrollView>
		</ThemedPage>
	);
}
