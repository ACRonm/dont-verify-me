"use client";

import { useEffect, useState } from "react";
import { ThemedPage, CustomButton } from "@dont-verify-me/ui";
import { YStack, Text, Spinner, useMedia } from "tamagui";
import { useParams, useRouter } from "next/navigation";
import { getMotorcycleById, Motorcycle } from "@dont-verify-me/shared-logic";

export default function MotorcycleDetailsPage() {
	const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const params = useParams();
	const media = useMedia();
	const { motorcycleId } = params;

	useEffect(() => {
		const fetchMotorcycle = async () => {
			if (typeof motorcycleId !== "string") return;

			setIsLoading(true);
			setError(null);
			try {
				const motorcycleData = await getMotorcycleById(motorcycleId);
				setMotorcycle(motorcycleData);
			} catch (err) {
				console.error("Failed to fetch motorcycle:", err);
				setError("Failed to fetch motorcycle. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMotorcycle();
	}, [motorcycleId]);

	return (
		<ThemedPage>
			<YStack flex={1} justifyContent="center" alignItems="center" space="$4">
				{isLoading ? (
					<Spinner />
				) : error ? (
					<Text color="red" fontSize="$3">
						{error}
					</Text>
				) : motorcycle ? (
					<>
						<Text fontSize="$6" fontWeight="bold">
							{motorcycle.nickname}
						</Text>
						<YStack width={media.gtSm ? "80%" : "95%"} gap="$3">
							<Text>Make: {motorcycle.make}</Text>
							<Text>Model: {motorcycle.model}</Text>
						</YStack>
						<YStack width={media.gtSm ? "80%" : "95%"} gap="$3">
							<Text fontSize="$5" fontWeight="bold">
								Tire Sets
							</Text>
							{motorcycle.tire_sets?.map((tireSet) => (
								<Text key={tireSet.id}>
									{tireSet.brand} {tireSet.model}
								</Text>
							))}
						</YStack>
						<CustomButton onPress={() => router.back()}>Back</CustomButton>
					</>
				) : (
					<Text>Motorcycle not found.</Text>
				)}
			</YStack>
		</ThemedPage>
	);
}
