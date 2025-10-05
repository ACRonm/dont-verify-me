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
import { YStack, H1, ScrollView, Text, Spinner, XStack, Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";

export default function DashboardPage() {
	const { user } = useAuth();
	const [platforms, setPlatforms] = useState<Platform[]>([]);
	const [platformArticles, setPlatformArticles] = useState<
		Record<string, boolean>
	>({});
	const [loading, setLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [platformToDelete, setPlatformToDelete] = useState<string | null>(null);
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

	const handleDelete = (id: string) => {
		setPlatformToDelete(id);
		setShowDeleteDialog(true);
	};

	const confirmDelete = async () => {
		if (platformToDelete) {
			await deletePlatform(platformToDelete);
			setShowDeleteDialog(false);
			setPlatformToDelete(null);
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
				<YStack gap="$4" maxWidth={1200} alignSelf="center" width="100%">
					<XStack
						marginHorizontal={"$2"}
						justifyContent="space-between"
						alignItems="center"
					>
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

					<YStack gap="$3">
						{platforms.length === 0 ? (
							<Text color="$gray11" textAlign="center" padding="$6">
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

			{showDeleteDialog && (
				<YStack
					position="absolute"
					top={0}
					left={0}
					right={0}
					bottom={0}
					zIndex={100000}
					alignItems="center"
					justifyContent="center"
					style={{ position: "fixed" }}
				>
					<YStack
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						backgroundColor="rgba(0,0,0,0.5)"
						onPress={() => setShowDeleteDialog(false)}
					/>
					<YStack
						paddingVertical="$4"
						paddingHorizontal="$6"
						borderRadius="$6"
						borderWidth={1}
						borderColor="$borderColor"
						backgroundColor="$background"
						shadowColor="$shadowColor"
						shadowRadius={20}
						shadowOffset={{ width: 0, height: 10 }}
						gap="$4"
						width="90%"
						maxWidth={500}
						zIndex={100001}
					>
						<Text fontSize="$7" fontWeight="bold">
							Delete Platform
						</Text>
						<Text color="$color10">
							Are you sure you want to delete this platform? This action cannot
							be undone.
						</Text>

						<XStack gap="$3" justifyContent="flex-end" marginTop="$2">
							<Button theme="gray" onPress={() => setShowDeleteDialog(false)}>
								Cancel
							</Button>
							<Button theme="red" onPress={confirmDelete}>
								Delete
							</Button>
						</XStack>
					</YStack>
				</YStack>
			)}
		</ThemedPage>
	);
}
