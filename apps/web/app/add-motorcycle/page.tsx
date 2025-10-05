"use client";

import { useState } from "react";
import { ThemedPage, CustomButton } from "@dont-verify-me/ui";
import { YStack, Text, Input, XStack, Spinner, useMedia } from "tamagui";
import { useRouter } from "next/navigation";
import { addMotorcycle } from "@dont-verify-me/shared-logic";

export default function AddMotorcyclePage() {
	const [nickname, setNickname] = useState("");
	const [make, setMake] = useState("");
	const [model, setModel] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const media = useMedia();

	const handleSubmit = async () => {
		setIsLoading(true);
		setError(null);
		try {
			await addMotorcycle({ nickname, make, model });
			router.push("/"); // Redirect to dashboard after submission
		} catch (err) {
			console.error("Failed to add motorcycle:", err);
			setError("Failed to add motorcycle. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ThemedPage>
			<YStack flex={1} justifyContent="center" alignItems="center" space="$4">
				<Text fontSize="$6" fontWeight="bold">
					Add New Motorcycle
				</Text>

				<YStack width={media.gtSm ? "80%" : "95%"} gap="$3">
					<Input
						placeholder="Nickname (e.g., My Striple)"
						value={nickname}
						onChangeText={setNickname}
						size="$4"
						disabled={isLoading}
					/>
					<Input
						placeholder="Make (e.g., Triumph)"
						value={make}
						onChangeText={setMake}
						size="$4"
						disabled={isLoading}
					/>
					<Input
						placeholder="Model (e.g., Street Triple R)"
						value={model}
						onChangeText={setModel}
						size="$4"
						disabled={isLoading}
					/>
				</YStack>

				{error && (
					<Text color="red" fontSize="$3">
						{error}
					</Text>
				)}

				<XStack space="$4">
					<CustomButton onPress={() => router.back()} disabled={isLoading}>
						Cancel
					</CustomButton>
					<CustomButton
						onPress={handleSubmit}
						disabled={isLoading}
						icon={isLoading ? () => <Spinner /> : undefined}
					>
						{!isLoading && "Add Motorcycle"}
					</CustomButton>
				</XStack>
			</YStack>
		</ThemedPage>
	);
}
