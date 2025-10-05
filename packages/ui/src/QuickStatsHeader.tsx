import { XStack, YStack, Text, Card, useMedia } from "tamagui";

interface QuickStatsHeaderProps {
	totalMilesTracked: number;
	averageCostPerMile: number;
	activeBikes: number;
}

export function QuickStatsHeader({
	totalMilesTracked,
	averageCostPerMile,
	activeBikes,
}: QuickStatsHeaderProps) {
	const media = useMedia();
	return (
		<Card
			backgroundColor="$background"
			borderColor="$borderColor"
			borderWidth={1}
			borderRadius={0}
			animation="bouncy"
			size="$4"
			width="$full"
			shadowColor="$shadowColor"
			shadowOffset={{ width: 0, height: 4 }}
			shadowOpacity={0.2}
			shadowRadius={6}
		>
			<Card.Header padded>
				<XStack
					justifyContent="space-around"
					alignItems="center"
					padding="$4"
					flexDirection={media.gtSm ? "row" : "column"}
					gap={media.gtSm ? "$0" : "$4"}
				>
					<YStack alignItems="center">
						<Text fontSize="$5" fontWeight="700">
							{totalMilesTracked.toLocaleString()}
						</Text>
						<Text fontSize="$2" color="$color.text">
							Total Miles Tracked
						</Text>
					</YStack>

					<YStack alignItems="center">
						<Text fontSize="$5" fontWeight="700">
							${averageCostPerMile.toFixed(2)}
						</Text>
						<Text fontSize="$2" color="$color.text">
							Avg Cost/Mile
						</Text>
					</YStack>

					<YStack alignItems="center">
						<Text fontSize="$5" fontWeight="700">
							{activeBikes}
						</Text>
						<Text fontSize="$2" color="$color.text">
							Active Bikes
						</Text>
					</YStack>
				</XStack>
			</Card.Header>
		</Card>
	);
}
