import { Card, Text, YStack, XStack, useMedia } from "tamagui";

interface MaintenanceLog {
	date: string;
	service: string;
	mileage: number;
	cost: number;
}

const mockLogs: MaintenanceLog[] = [
	{ date: "2024-06-15", service: "Oil Change", mileage: 12500, cost: 75 },
	{
		date: "2024-05-20",
		service: "Tire Replacement",
		mileage: 11000,
		cost: 450,
	},
	{ date: "2024-04-10", service: "Brake Inspection", mileage: 10500, cost: 50 },
];

export function MaintenanceLogTable() {
	const media = useMedia();
	return (
		<Card
			backgroundColor="$background"
			borderColor="$borderColor"
			borderWidth={1}
			borderRadius="$4"
			padding="$4"
			shadowColor="$shadowColor"
			shadowOffset={{ width: 0, height: 4 }}
			shadowOpacity={0.2}
			shadowRadius={6}
		>
			<YStack gap="$2">
				<Text fontSize="$6" fontWeight="700">
					Maintenance Logs
				</Text>
				{media.gtSm ? (
					<YStack gap="$2">
						{/* Table Header */}
						<XStack
							paddingHorizontal="$2"
							paddingVertical="$2"
							borderBottomWidth={1}
							borderBottomColor="$borderColor"
						>
							<Text flex={1} fontWeight="bold">
								Date
							</Text>
							<Text flex={2} fontWeight="bold">
								Service
							</Text>
							<Text flex={1} fontWeight="bold" textAlign="right">
								Mileage
							</Text>
							<Text flex={1} fontWeight="bold" textAlign="right">
								Cost
							</Text>
						</XStack>
						{/* Table Body */}
						{mockLogs.map((log, index) => (
							<XStack
								key={index}
								paddingHorizontal="$2"
								paddingVertical="$2"
								backgroundColor={
									index % 2 === 0 ? "$background" : "$backgroundStrong"
								}
							>
								<Text flex={1}>{log.date}</Text>
								<Text flex={2}>{log.service}</Text>
								<Text flex={1} textAlign="right">
									{log.mileage.toLocaleString()}
								</Text>
								<Text flex={1} textAlign="right">
									${log.cost.toFixed(2)}
								</Text>
							</XStack>
						))}
					</YStack>
				) : (
					<YStack gap="$3">
						{mockLogs.map((log, index) => (
							<Card key={index} bordered padding="$3" animation="bouncy">
								<YStack gap="$1">
									<XStack justifyContent="space-between">
										<Text fontWeight="bold">Date:</Text>
										<Text>{log.date}</Text>
									</XStack>
									<XStack justifyContent="space-between">
										<Text fontWeight="bold">Service:</Text>
										<Text>{log.service}</Text>
									</XStack>
									<XStack justifyContent="space-between">
										<Text fontWeight="bold">Mileage:</Text>
										<Text>{log.mileage.toLocaleString()}</Text>
									</XStack>
									<XStack justifyContent="space-between">
										<Text fontWeight="bold">Cost:</Text>
										<Text>${log.cost.toFixed(2)}</Text>
									</XStack>
								</YStack>
							</Card>
						))}
					</YStack>
				)}
			</YStack>
		</Card>
	);
}
