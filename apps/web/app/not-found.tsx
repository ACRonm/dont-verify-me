"use client";

import { ThemedPage } from "@dont-verify-me/ui";
import { YStack, H1, Text } from "tamagui";
import Link from "next/link";

export default function NotFound() {
	return (
		<ThemedPage>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				space="$4"
			>
				<H1>404 - Page Not Found</H1>
				<Text>The page you are looking for does not exist.</Text>
				<Link href="/">
					<Text color="$blue10">Go back to the home page</Text>
				</Link>
			</YStack>
		</ThemedPage>
	);
}
