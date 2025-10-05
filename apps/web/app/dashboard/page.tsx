"use client";

import { useState, useEffect } from "react";
import {
	EmptyStateDashboard,
	StatsGraphCard,
	ThemedPage,
	MaintenanceLogTable,
	StatsGraphCardSkeleton,
	MaintenanceLogTableSkeleton,
	QuickActions,
	QuickActionsSkeleton,
	AlertsPanel,
	AlertsPanelSkeleton,
} from "@dont-verify-me/ui";
import {
	useAuth,
	getMotorcyclesForUser,
	Motorcycle,
} from "@dont-verify-me/shared-logic";
import { useRouter } from "next/navigation";
import {
	YStack,
	Text,
	ScrollView,
	H2,
	Separator,
	XStack,
	useMedia,
} from "tamagui";

export default function DashboardPage() {
	const { user } = useAuth();
	const [motorcycles, setMotorcycles] = useState<Motorcycle[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const media = useMedia();
	const router = useRouter();

	useEffect(() => {
		const fetchMotorcycles = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getMotorcyclesForUser();
				setMotorcycles(data);
			} catch (err) {
				console.error("Failed to fetch motorcycles:", err);
				setError("Failed to load motorcycles. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchMotorcycles();
		}
	}, [user]);

	const handleAddMotorcycle = () => {
		router.push("/add-motorcycle");
	};

	if (error) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Text color="$red10" fontSize="$5" marginVertical="$5">
						Error: {error}
					</Text>
				</YStack>
			</ThemedPage>
		);
	}

	if (loading) {
		return (
			<ThemedPage>
				<ScrollView
					flex={1}
					paddingTop="$4"
					contentContainerStyle={{ paddingBottom: "$6" }}
				>
					<QuickActionsSkeleton />
					<YStack gap="$4" paddingHorizontal="$4">
						<XStack gap="$4" flexDirection={media.lg ? "column" : "row"}>
							<YStack
								gap="$4"
								flex={1}
								flexDirection={media.lg ? "column" : "row"}
							>
								<StatsGraphCardSkeleton />
								<AlertsPanelSkeleton />
							</YStack>
						</XStack>
						<XStack gap="$4" flexDirection={media.ltLg ? "column" : "row"}>
							<MaintenanceLogTableSkeleton flex={2} />
							<YStack
								flex={1}
								gap="$3"
								padding="$4"
								borderRadius="$4"
								borderWidth={1}
								borderColor="$borderColor"
							>
								<XStack flexWrap="wrap" gap="$3">
								</XStack>
							</YStack>
						</XStack>
					</YStack>
				</ScrollView>
			</ThemedPage>
		);
	}

	if (!motorcycles || motorcycles.length === 0) {
		return (
			<ThemedPage>
				<EmptyStateDashboard onAddMotorcycle={handleAddMotorcycle} />
			</ThemedPage>
		);
	}

	const primaryBike = motorcycles[0]!;
	const otherBikes = motorcycles.slice(1);

	return (
		<ThemedPage>
			<ScrollView
				flex={1}
				paddingTop="$4"
				contentContainerStyle={{ paddingBottom: "$6" }}
			>
				<QuickActions motorcycle={primaryBike} />
				<YStack gap="$4" paddingHorizontal="$4">
					<XStack gap="$4" flexDirection={media.md ? "column" : "row"}>
						<YStack
							gap="$4"
							flex={1}
							flexDirection={media.lg ? "column" : "row"}
						>
							<XStack
								flex={1}
								gap="$4"
								flexDirection={media.gtLg ? "row" : "column"}
							>
								<StatsGraphCard />
								<AlertsPanel />
							</XStack>
						</YStack>
					</XStack>
					<XStack gap="$4" flexDirection={media.ltLg ? "column" : "row"}>
						<YStack
							flex={2}
							gap="$3"
							padding="$4"
							borderRadius="$4"
							borderWidth={1}
							borderColor="$borderColor"
						>
							<H2 fontSize="$6">Maintenance Logs</H2>
							<Separator />
							<MaintenanceLogTable />
						</YStack>

						{otherBikes.length > 0 && (
							<YStack
								flex={1}
								gap="$3"
								padding="$4"
								borderRadius="$4"
								borderWidth={1}
								borderColor="$borderColor"
							>
								<H2 fontSize="$6">Other Motorcycles</H2>
								<Separator />
								<YStack gap="$3">
								</YStack>
							</YStack>
						)}
					</XStack>
				</YStack>
			</ScrollView>
		</ThemedPage>
	);
}
