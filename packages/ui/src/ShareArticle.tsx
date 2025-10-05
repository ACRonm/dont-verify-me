"use client";

import { Button, XStack, Text } from "tamagui";
import { Link as LinkIcon, Share2, Check } from "@tamagui/lucide-icons";
import { useState } from "react";

interface ShareArticleProps {
	title: string;
	url: string;
	summary?: string;
	onShare?: () => void;
}

export function ShareArticle({
	title,
	url,
	summary,
	onShare,
}: ShareArticleProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		// Check if Web Share API is available
		if (navigator.share) {
			try {
				await navigator.share({
					title: title,
					text: summary || title,
					url: url,
				});
				onShare?.();
			} catch (error) {
				// User cancelled or share failed
				if ((error as Error).name !== "AbortError") {
					console.error("Error sharing:", error);
				}
			}
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			onShare?.();
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<XStack
			alignItems="center"
			gap="$3"
			maxWidth={896}
			alignSelf="center"
			width="100%"
		>
			{/* URL Bar with integrated Copy Link Button */}
			<XStack
				flex={1}
				alignItems="center"
				backgroundColor="#3a3a3a"
				borderRadius={9999}
				paddingLeft="$6"
				paddingRight="$1"
				paddingVertical="$1"
				cursor="pointer"
				onPress={copyToClipboard}
				hoverStyle={{ backgroundColor: "#434343" }}
				pressStyle={{ backgroundColor: "#434343" }}
			>
				{/* URL Text */}
				<Text
					flex={1}
					color="rgba(255, 255, 255, 0.9)"
					fontSize="$3"
					fontWeight="500"
					numberOfLines={1}
					overflow="hidden"
					textOverflow="ellipsis"
					whiteSpace="nowrap"
					paddingRight="$3"
				>
					{url}
				</Text>

				{/* Copy Link Button - integrated into URL bar */}
				<Button
					circular
					onPress={copyToClipboard}
					backgroundColor="$accent"
					hoverStyle={{ backgroundColor: "$accentHovered" }}
					pressStyle={{ backgroundColor: "$accentHovered" }}
					height={48}
					width={48}
					padding={0}
					flexShrink={0}
					icon={
						copied ? (
							<Check size={20} color="#1a1a1a" />
						) : (
							<LinkIcon size={20} color="#1a1a1a" />
						)
					}
					aria-label={copied ? "Copied!" : "Copy link"}
					chromeless
				/>
			</XStack>

			{/* Share Article Button - separate unit */}
			<Button
				onPress={handleShare}
				backgroundColor="#4a4a4a"
				hoverStyle={{ backgroundColor: "#5a5a5a" }}
				pressStyle={{ backgroundColor: "#5a5a5a" }}
				color="white"
				paddingHorizontal="$6"
				paddingVertical="$3.5"
				borderRadius={9999}
				flexShrink={0}
				iconAfter={<Share2 size={16} color="white" />}
				chromeless
			>
				<Text color="white" fontWeight="500">
					Share article
				</Text>
			</Button>
		</XStack>
	);
}
