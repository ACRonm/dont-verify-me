import { YStack, Text, Button, Card, useThemeName } from "tamagui";

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
				<YStack
					style={imageStyle}
					width={250}
					height={250}
					alignItems="center"
					justifyContent="center"
				>
					<svg
						width={250}
						height={250}
						viewBox="0 0 200 80"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label="Loading"
						style={{ width: '100%', height: 'auto' }}
					>
					<defs>
						<radialGradient id="outerGradient1" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
							<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
							<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
						</radialGradient>
						<radialGradient id="outerGradient2" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
							<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
							<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
						</radialGradient>
						<radialGradient id="outerGradient3" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#e8f9e6" stopOpacity="0.3" />
							<stop offset="70%" stopColor="#c8eec4" stopOpacity="0.5" />
							<stop offset="100%" stopColor="#a8e39f" stopOpacity="0.7" />
						</radialGradient>
					</defs>

					{/* First dot */}
					<g>
						<circle cx="40" cy="40" r="30" fill="url(#outerGradient1)" />
						<circle cx="40" cy="40" r="20" fill="#75dd62" />
					</g>

					{/* Second dot */}
					<g>
						<circle cx="100" cy="40" r="30" fill="url(#outerGradient2)" />
						<circle cx="100" cy="40" r="20" fill="#75dd62" />
					</g>

					{/* Third dot */}
					<g>
						<circle cx="160" cy="40" r="30" fill="url(#outerGradient3)" />
						<circle cx="160" cy="40" r="20" fill="#75dd62" />
					</g>						<style>
							{`
								@keyframes pulse {
									0%, 100% { opacity: 1; }
									50% { opacity: 0.5; }
								}
								circle {
									animation: pulse 1.5s ease-in-out infinite;
								}
								g:nth-child(2) circle {
									animation-delay: 0.2s;
								}
								g:nth-child(3) circle {
									animation-delay: 0.4s;
								}
							`}
						</style>
					</svg>
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
