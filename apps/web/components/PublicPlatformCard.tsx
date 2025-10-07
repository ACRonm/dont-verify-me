"use client";

import { Card, XStack, YStack, H3, Text, View } from "tamagui";
import { ArrowRight } from "@tamagui/lucide-icons";
import { useRouter } from "next/navigation";
import type { Platform } from "@dont-verify-me/shared-logic";

interface PublicPlatformCardProps {
	platform: Platform;
	hasArticle: boolean;
}

export function PublicPlatformCard({
	platform,
	hasArticle,
}: PublicPlatformCardProps) {
	const router = useRouter();

	const handleClick = () => {
		if (hasArticle) {
			router.push(`/platforms/${platform.slug}`);
		}
	};

	return (
		<Card
			tag="article"
			bordered
			padding="$4"
			backgroundColor="$background"
			hoverStyle={{
				borderColor: hasArticle ? "$accent" : "$borderColor",
				scale: hasArticle ? 1.01 : 1,
				y: hasArticle ? -2 : 0,
			}}
			pressStyle={{ scale: 0.99 }}
			animation="quick"
			cursor={hasArticle ? "pointer" : "default"}
			opacity={hasArticle ? 1 : 0.6}
			onPress={handleClick}
			width="100%"
			aria-label={
				hasArticle
					? `Navigate to ${platform.name} privacy guide`
					: `${platform.name} guide coming soon`
			}
		>
			<XStack gap="$4" alignItems="center">
				<View
					width={48}
					height={48}
					borderRadius="$3"
					borderWidth={1}
					borderColor="$borderColor"
					alignItems="center"
					justifyContent="center"
					backgroundColor="$background"
					overflow="hidden"
				>
					{platform.icon_url ? (
						<img
							src={platform.icon_url}
							alt={`${platform.name} icon`}
							style={{ width: 40, height: 40, objectFit: "contain" }}
							onError={(e) => {
								// Fallback to letter if image fails to load
								e.currentTarget.style.display = "none";
								if (e.currentTarget.nextSibling) {
									(e.currentTarget.nextSibling as HTMLElement).style.display =
										"block";
								}
							}}
						/>
					) : null}
					<Text
						fontSize="$8"
						fontWeight="bold"
						color="$accent"
						style={{
							display: platform.icon_url || platform.slug ? "none" : "block",
						}}
					>
						{platform.name[0]}
					</Text>
				</View>
				{/* Platform Info */}
				<YStack flex={1} gap="$2">
					<XStack alignItems="center" gap="$2">
						<H3 fontSize="$6" fontWeight="600">
							{platform.name}
						</H3>
						{!hasArticle && (
							<Text fontSize="$2" color="$color10" fontWeight="500">
								COMING SOON
							</Text>
						)}
					</XStack>
					{platform.description && (
						<Text
							fontSize="$3"
							color="$color11"
							// @ts-ignore
							numberOfLines={2}
							overflow="hidden"
							// @ts-ignore
							textOverflow="ellipsis"
							// @ts-ignore
							display="-webkit-box"
							// @ts-ignore
							WebkitLineClamp={2}
							// @ts-ignore
							WebkitBoxOrient="vertical"
						>
							{platform.description}
						</Text>
					)}
				</YStack>

				{/* Arrow Icon */}
				{hasArticle && <ArrowRight size={24} color="$accent" />}
			</XStack>
		</Card>
	);
}
