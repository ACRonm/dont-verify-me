import { XStack, Text, Button } from "tamagui";
import { ChevronLeft, Settings } from "@tamagui/lucide-icons";
import React from "react";

interface AppBarProps {
	title: string;
	onBack?: () => void;
	onSettings?: () => void;
}

export function AppBar({ title, onBack, onSettings }: AppBarProps) {
	return (
		<XStack
			paddingHorizontal="$4"
			paddingVertical="$3"
			alignItems="center"
			justifyContent="space-between"
			backgroundColor="$navbarBackground"
			borderBottomWidth={1}
			borderColor="$borderColor"
		>
			<XStack flex={1} justifyContent="flex-start">
				{onBack && (
					<Button
						icon={ChevronLeft}
						onPress={onBack}
						chromeless
						circular
						size="$4"
					/>
				)}
			</XStack>

			<Text
				fontSize="$6"
				fontWeight="bold"
				textAlign="center"
				flex={2}
				color="$color"
			>
				{title}
			</Text>

			<XStack flex={1} justifyContent="flex-end">
				{onSettings && (
					<Button
						icon={Settings}
						onPress={onSettings}
						chromeless
						circular
						size="$4"
					/>
				)}
			</XStack>
		</XStack>
	);
}
