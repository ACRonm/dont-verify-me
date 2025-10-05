"use client";

import { useState, useEffect, use } from "react";
import { ThemedPage, PublicArticleView } from "@dont-verify-me/ui";
import {
	getPlatformBySlug,
	Platform,
	Article,
} from "@dont-verify-me/shared-logic";
import { YStack, Spinner, Text, H1 } from "tamagui";
import { LandingPageNavbar } from "../../../components/LandingPageNavbar";

export default function PlatformPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const [platform, setPlatform] = useState<Platform | null>(null);
	const [article, setArticle] = useState<Article | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			try {
				const data = await getPlatformBySlug(slug);
				if (data) {
					setPlatform(data);
					setArticle(data.article || null);
				}
			} catch (err) {
				console.error("Failed to load platform:", err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [slug]);

	if (loading) {
		return (
			<ThemedPage>
				<LandingPageNavbar />
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Spinner size="large" />
				</YStack>
			</ThemedPage>
		);
	}

	if (
		!platform ||
		!article ||
		!platform.is_published ||
		!article.is_published
	) {
		return (
			<ThemedPage>
				<LandingPageNavbar />
				<YStack
					flex={1}
					justifyContent="center"
					alignItems="center"
					padding="$6"
				>
					<H1>Platform Not Found</H1>
					<Text color="$gray11" marginTop="$4">
						This platform doesn't exist or hasn't been published yet.
					</Text>
				</YStack>
			</ThemedPage>
		);
	}

	return (
		<ThemedPage>
			<LandingPageNavbar />
			<PublicArticleView article={article} platform={platform} />
		</ThemedPage>
	);
}
