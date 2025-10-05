"use client";

import { YStack, H1, Text, Separator, ScrollView } from "tamagui";
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
	// Generate the share URL if not provided
	const url =
		shareUrl || (typeof window !== "undefined" ? window.location.href : "");

	return (
		<ScrollView flex={1}>
			<YStack
				padding="$6"
				gap="$4"
				maxWidth={800}
				alignSelf="center"
				width="100%"
			>
				<YStack gap="$2">
					<Text fontSize="$3" color="$color11" textTransform="uppercase">
						{platform.name}
					</Text>
					<H1 fontSize="$10" fontWeight="bold">
						{article.title}
					</H1>
					{article.summary && (
						<Text fontSize="$5" color="$color11" lineHeight="$5">
							{article.summary}
						</Text>
					)}
				</YStack>

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

				<ShareArticle
					title={article.title}
					summary={article.summary || undefined}
					url={url}
				/>

				<Text fontSize="$2" color="$color10" textAlign="center" marginTop="$4">
					Last updated: {new Date(article.updated_at).toLocaleDateString()}
				</Text>
			</YStack>
		</ScrollView>
	);
}
