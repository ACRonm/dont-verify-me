"use client";

import { ThemedPage } from "@dont-verify-me/ui";
import { H1, H2, YStack, Text } from "tamagui";
import { LandingPageNavbar } from "../components/LandingPageNavbar";
import { PlatformDirectory } from "../components/PlatformDirectory";
import { useEffect, useState } from "react";
import {
	getPublishedPlatforms,
	type Platform,
} from "@dont-verify-me/shared-logic";

export default function HomePage() {
	const [platforms, setPlatforms] = useState<Platform[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlatforms = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getPublishedPlatforms();
			setPlatforms(data);
		} catch (err) {
			console.error("Error fetching platforms:", err);
			setError("Failed to load platforms. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPlatforms();
	}, []);

	return (
		<ThemedPage>
			<LandingPageNavbar />

			{/* Hero Section */}
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				paddingHorizontal="$6"
				paddingVertical="$12"
				paddingTop="$16"
				gap="$4"
			>
				<H1
					textAlign="center"
					fontSize="$10"
					lineHeight="$9"
					fontWeight="bold"
					maxWidth={800}
				>
					Protect Your Privacy. <Text color="$accent">Stay Anonymous.</Text>
				</H1>
				<Text
					textAlign="center"
					fontSize="$6"
					color="$color11"
					maxWidth={700}
					lineHeight="$5"
				>
					Comprehensive guides to bypass age verification and maintain your
					privacy on social media platforms.
				</Text>
			</YStack>

			<YStack
				paddingHorizontal="$6"
				paddingVertical="$8"
				gap="$6"
				alignItems="center"
			>
				<H2 textAlign="center" fontSize="$8" fontWeight="600">
					Available Privacy Guides
				</H2>
				<PlatformDirectory
					platforms={platforms}
					loading={loading}
					error={error}
					onRetry={fetchPlatforms}
				/>
			</YStack>
		</ThemedPage>
	);
}
