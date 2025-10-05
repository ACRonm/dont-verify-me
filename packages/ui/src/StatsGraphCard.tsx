import { Card, Text, YStack, useMedia } from "tamagui";

export function StatsGraphCard() {
	const media = useMedia();
	return (
		<Card
			flex={1}
			minHeight={media.sm ? 400 : 500}
			backgroundColor="$background"
			borderColor="$borderColor"
			borderWidth={1}
			borderRadius="$4"
			padding="$4"
			shadowColor="$shadow4"
			shadowOffset={{ width: 0, height: 4 }}
			shadowOpacity={0.2}
			shadowRadius={6}
		>
			<YStack gap="$2" flex={1}>
				<Text fontSize="$6" fontWeight="700">
					Mileage Trends
				</Text>
				<YStack
					flex={1}
					backgroundColor="$backgroundStrong"
					borderRadius="$4"
					alignItems="center"
					justifyContent="center"
				>
					<Text color="$color">Graph Placeholder</Text>
				</YStack>
			</YStack>
		</Card>
	);
}
