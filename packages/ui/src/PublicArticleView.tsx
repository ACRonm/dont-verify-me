"use client";

import {
	YStack,
	XStack,
	H1,
	Text,
	Separator,
	ScrollView,
	Image,
} from "tamagui";
import type { Article, Platform } from "@dont-verify-me/shared-logic";
import { ShareArticle } from "./ShareArticle";
import "./editor-styles.css";

interface PublicArticleViewProps {
	article: Article;
	platform: Platform;
	shareUrl?: string;
}

export function PublicArticleView({
	article,
	platform,
	shareUrl,
}: PublicArticleViewProps) {
	const url =
		shareUrl || (typeof window !== "undefined" ? window.location.href : "");

	// Use icon_url from database
	const iconUrl = platform.icon_url;

	return (
		<ScrollView flex={1} marginTop={"$6"}>
			<YStack
				padding="$6"
				gap="$4"
				maxWidth={800}
				alignSelf="center"
				width="100%"
			>
				<YStack gap="$2">
					<XStack gap="$2" alignItems="center">
						<Image
							source={{ uri: iconUrl }}
							width={20}
							height={20}
							alt={`${platform.name} icon`}
						/>
						<Text fontSize="$3" color="$color11" textTransform="uppercase">
							{platform.name}
						</Text>
					</XStack>
					<H1 fontSize="$10" fontWeight="bold">
						{article.title}
					</H1>
					{article.summary && (
						<Text fontSize="$5" color="$color11" lineHeight="$5">
							{article.summary}
						</Text>
					)}
				</YStack>

				<ShareArticle
					title={article.title}
					summary={article.summary || undefined}
					url={url}
				/>

				<Separator />

				<YStack gap="$4" className="tiptap-wrapper">
					<div
						className="prose prose-lg max-w-none"
						dangerouslySetInnerHTML={{ __html: article.content }}
						style={{
							fontSize: "1rem",
							lineHeight: "1.6",
							color: "inherit",
						}}
					/>
				</YStack>

				<Separator marginTop="$6" />
				<Text fontSize="$2" color="$color10" textAlign="center" marginTop="$4">
					Last updated: {new Date(article.updated_at).toLocaleDateString()}
				</Text>
			</YStack>
		</ScrollView>
	);
}
