"use client";

import { YStack, Card } from "tamagui";

export function PlatformDirectorySkeleton() {
	return (
		<YStack width="100%" maxWidth={1120} gap="$4" alignItems="stretch">
			{[...Array(5)].map((_, index) => (
				<Card
					key={index}
					bordered
					padding="$4"
					backgroundColor="$background"
					height={96}
					animation="lazy"
					// @ts-ignore
					opacity={0.5}
					// @ts-ignore
					style={{
						animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
					}}
				/>
			))}
		</YStack>
	);
}
