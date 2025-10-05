import { View } from "tamagui";
import React from "react";

interface ThemedPageProps {
	children: React.ReactNode;
}

export function ThemedPage({ children }: ThemedPageProps) {
	return (
		<View flex={1} backgroundColor="$background">
			{children}
		</View>
	);
}
