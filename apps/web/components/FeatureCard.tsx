"use client";

import { Card, H3, Paragraph, YStack, View } from "tamagui";

interface FeatureCardProps {
	title: string;
	description: string;
	icon?: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
	return (
		<Card
			bordered
			size="$4"
			padding="$5"
			width="100%"
			$gtSm={{
				width: "calc(33.33% - 11px)", // Responsive grid column
			}}
			height={220}
			animation="bouncy"
			hoverStyle={{ y: -5, scale: 1.02 }}
			pressStyle={{ scale: 0.98 }}
			backgroundColor="$background"
			borderColor="$borderColor"
		>
			<YStack gap="$4" flex={1}>
				{icon && (
					<View
						width={40}
						height={40}
						borderRadius="$2"
						borderWidth={1}
						borderColor="$borderColor"
						alignItems="center"
						justifyContent="center"
					>
						{icon}
					</View>
				)}
				<H3 fontSize="$6">{title}</H3>
				<Paragraph color="$color11" flex={1}>
					{description}
				</Paragraph>
			</YStack>
		</Card>
	);
}
