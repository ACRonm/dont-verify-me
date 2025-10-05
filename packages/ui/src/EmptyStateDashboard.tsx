import { YStack, Text, Button, Image, Card, useThemeName } from "tamagui";

interface EmptyStateDashboardProps {
	onAddMotorcycle: () => void;
}

export function EmptyStateDashboard({
	onAddMotorcycle,
}: EmptyStateDashboardProps) {
	const themeName = useThemeName();

	const imageStyle = {
		// Keep original styles for light mode
		...(themeName === "dark" && {
			// Apply a gentle filter for dark mode
			filter: "brightness(.8) contrast(1.2)",
		}),
	};

	return (
		<YStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			backgroundColor="$background"
		>
			<Card
				elevate
				bordered
				animation="bouncy"
				width="90%"
				maxWidth={500}
				padding="$6"
				borderRadius="$6"
				marginTop={100}
				alignItems="center"
				gap="$5"
			>
				<YStack style={imageStyle}>
					<Image
						source={{
							uri: `${themeName === "dark" ? "/logo_final_dark_optimised.svg" : "/logo_final_light_optimised.svg"}`,
						}}
						width={250}
						height={250}
					/>
				</YStack>

				<YStack gap="$3" alignItems="center">
					<Text
						fontSize={"$9"}
						fontWeight="bold"
						textAlign="center"
						color="$accent"
					>
						Welcome to Your Garage!
					</Text>
					<Text fontSize={"$6"} textAlign="center" maxWidth={400}>
						Get started by adding your first motorcycle and unlock powerful tire
						tracking features.
					</Text>
				</YStack>
				<Button
					onPress={onAddMotorcycle}
					backgroundColor="$background"
					color="$color"
					size="$5"
					width="100%"
					pressStyle={{ scale: 0.98, y: 2 }}
					hoverStyle={{ scale: 1.02, y: -2 }}
					animation="bouncy"
				>
					Add your first article
				</Button>
			</Card>
		</YStack>
	);
}
