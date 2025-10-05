"use client";

import { YStack, Text, Button } from "tamagui";
import { AlertCircle, RefreshCw } from "@tamagui/lucide-icons";
import { PublicPlatformCard } from "./PublicPlatformCard";
import { PlatformDirectorySkeleton } from "./PlatformDirectorySkeleton";
import type { Platform } from "@dont-verify-me/shared-logic";

interface PlatformDirectoryProps {
	platforms: Platform[];
	loading?: boolean;
	error?: string | null;
	onRetry?: () => void;
}

export function PlatformDirectory({
	platforms,
	loading = false,
	error = null,
	onRetry,
}: PlatformDirectoryProps) {
	// Loading State
	if (loading) {
		return <PlatformDirectorySkeleton />;
	}

	// Error State
	if (error) {
		return (
			<YStack
				alignItems="center"
				justifyContent="center"
				padding="$8"
				gap="$4"
				maxWidth={600}
			>
				<AlertCircle size={64} color="$red10" />
				<Text fontSize="$6" fontWeight="600" color="$color">
					Oops! Something went wrong
				</Text>
				<Text fontSize="$4" color="$color11" textAlign="center">
					{error}
				</Text>
				{onRetry && (
					<Button
						size="$4"
						theme="blue"
						icon={<RefreshCw size={20} />}
						onPress={onRetry}
					>
						Try Again
					</Button>
				)}
			</YStack>
		);
	}

	// Empty State
	if (!platforms || platforms.length === 0) {
		return (
			<YStack
				alignItems="center"
				justifyContent="center"
				padding="$8"
				gap="$4"
				maxWidth={600}
			>
				<Text fontSize="$6" fontWeight="600" color="$color">
					No Privacy Guides Yet
				</Text>
				<Text fontSize="$4" color="$color11" textAlign="center">
					Check back soon for comprehensive privacy protection guides for
					popular social media platforms.
				</Text>
			</YStack>
		);
	}

	// Main Directory View
	return (
		<YStack width="100%" maxWidth={1120} gap="$4" alignItems="stretch">
			{platforms.map((platform) => (
				<PublicPlatformCard
					key={platform.id}
					platform={platform}
					hasArticle={platform.is_published}
				/>
			))}
		</YStack>
	);
}
