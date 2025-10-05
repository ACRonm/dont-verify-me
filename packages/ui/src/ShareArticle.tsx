"use client";

import { Button, XStack } from "tamagui";
import { Share2, Link as LinkIcon, Check } from "@tamagui/lucide-icons";
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
			} catch (error) {
				// User cancelled or share failed
				if ((error as Error).name !== "AbortError") {
					console.error("Error sharing:", error);
					// Fallback to copy link
					copyToClipboard();
				}
			}
		} else {
			// Fallback to copy link
			copyToClipboard();
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<XStack gap="$2" justifyContent="center" flexWrap="wrap">
			<Button
				size="$4"
				theme="blue"
				onPress={handleShare}
				icon={<Share2 size={20} />}
				chromeless={false}
			>
				Share article
			</Button>
			<Button
				size="$4"
				theme="gray"
				onPress={copyToClipboard}
				icon={copied ? <Check size={20} /> : <LinkIcon size={20} />}
				chromeless={false}
			>
				{copied ? "Copied!" : "Copy link"}
			</Button>
		</XStack>
	);
}
