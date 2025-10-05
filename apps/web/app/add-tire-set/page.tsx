"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addTireSet, TireSet } from "@dont-verify-me/shared-logic";
import { ThemedPage } from "@dont-verify-me/ui";
import {
	YStack,
	Text,
	Input,
	Button,
	Spinner,
	H2,
	Separator,
	XStack,
	Popover,
} from "tamagui";
import { HelpCircle } from "@tamagui/lucide-icons";

export default function AddTireSetPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const motorcycleId = searchParams.get("motorcycleId");

	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [position, setPosition] = useState<"front" | "rear" | "set">("set");
	const [manufactureDate, setManufactureDate] = useState("");
	const [installDate, setInstallDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const [installOdometer, setInstallOdometer] = useState("");
	const [cost, setCost] = useState("");
	const [currency, setCurrency] = useState("USD");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!motorcycleId) {
			setError("No motorcycle ID provided.");
			return;
		}

		if (!brand || !model || !installOdometer) {
			setError("Please fill out all required fields.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await addTireSet({
				motorcycle_id: motorcycleId,
				brand,
				model,
				position,
				manufacture_date: manufactureDate || undefined,
				install_date: installDate,
				install_odometer: parseInt(installOdometer, 10),
				cost: cost ? parseFloat(cost) : undefined,
				currency,
			});
			router.push("/dashboard");
		} catch (err) {
			setError("Failed to add tire set. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemedPage>
			<YStack gap="$4" padding="$4" maxWidth={600} marginHorizontal="auto">
				<H2>Add New Tire Set</H2>
				<Separator />
				<YStack gap="$3">
					<XStack alignItems="center" gap="$4">
						<Text>Brand</Text>
						<Input
							placeholder="e.g., Michelin"
							value={brand}
							onChangeText={setBrand}
						/>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Model</Text>
						<Input
							placeholder="e.g., Road 6"
							value={model}
							onChangeText={setModel}
						/>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Position</Text>
						<Input
							placeholder="e.g., set"
							value={position}
							onChangeText={(text) =>
								setPosition(text as "front" | "rear" | "set")
							}
						/>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Manufacture Date</Text>
						<Input
							placeholder="e.g., 2023-01-01"
							value={manufactureDate}
							onChangeText={setManufactureDate}
						/>
						<Popover placement="right">
							<Popover.Trigger asChild>
								<Button size="$2" chromeless icon={HelpCircle} />
							</Popover.Trigger>
							<Popover.Content
								enterStyle={{ y: 0, opacity: 0 }}
								exitStyle={{ y: 0, opacity: 0 }}
								y={8}
								elevation="$4"
								animation={"bouncy"}
							>
								<YStack gap="$2" padding="$2">
									<Text fontSize="$2">
										Look for the DOT code on your tire&apos;s sidewall. The last
										four digits are the week and year. E.g., 4223 for the 42nd
										week of 2023.
									</Text>
								</YStack>
							</Popover.Content>
						</Popover>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Install Date</Text>
						<Input value={installDate} onChangeText={setInstallDate} />
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Install Odometer</Text>
						<Input
							placeholder="e.g., 10000"
							value={installOdometer}
							onChangeText={setInstallOdometer}
							keyboardType="numeric"
						/>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Cost</Text>
						<Input
							placeholder="e.g., 300"
							value={cost}
							onChangeText={setCost}
							keyboardType="numeric"
						/>
					</XStack>
					<XStack alignItems="center" gap="$4">
						<Text>Currency</Text>
						<Input value={currency} onChangeText={setCurrency} />
					</XStack>
				</YStack>
				{error && <Text color="$red10">{error}</Text>}
				<Button theme="accent" onPress={handleSubmit} disabled={loading}>
					{loading ? <Spinner /> : "Add Tire Set"}
				</Button>
			</YStack>
		</ThemedPage>
	);
}
