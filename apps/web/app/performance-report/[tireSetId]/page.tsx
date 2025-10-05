"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TireSet, supabase } from "@dont-verify-me/shared-logic";
import { ThemedPage } from "@dont-verify-me/ui";
import { YStack, Text, H2, Separator } from "tamagui";

export default function PerformanceReportPage() {
	const { tireSetId } = useParams();
	const [tireSet, setTireSet] = useState<TireSet | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTireSet = async () => {
			if (!tireSetId) return;
			setLoading(true);
			setError(null);
			try {
				const { data, error } = await supabase
					.from("tire_sets")
					.select("*")
					.eq("id", tireSetId)
					.single();
				if (error) throw error;
				setTireSet(data as TireSet);
			} catch (err) {
				console.error("Failed to fetch tire set:", err);
				setError("Failed to load tire set data.");
			} finally {
				setLoading(false);
			}
		};

		fetchTireSet();
	}, [tireSetId]);

	if (loading) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Text>Loading...</Text>
				</YStack>
			</ThemedPage>
		);
	}

	if (error) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Text color="$red10">{error}</Text>
				</YStack>
			</ThemedPage>
		);
	}

	if (!tireSet) {
		return (
			<ThemedPage>
				<YStack flex={1} justifyContent="center" alignItems="center">
					<Text>Tire set not found.</Text>
				</YStack>
			</ThemedPage>
		);
	}

	const totalMiles = (tireSet.end_odometer || 0) - tireSet.install_odometer;
	const costPerMile = tireSet.cost ? tireSet.cost / totalMiles : 0;

	return (
		<ThemedPage>
			<YStack gap="$4" padding="$4">
				<H2>Tire Performance Report</H2>
				<Separator />
				<Text fontSize="$6">
					{tireSet.brand} {tireSet.model}
				</Text>
				<YStack gap="$2">
					<Text>Total Miles: {totalMiles.toLocaleString()}</Text>
					<Text>Cost Per Mile: ${costPerMile.toFixed(4)}</Text>
				</YStack>
			</YStack>
		</ThemedPage>
	);
}
