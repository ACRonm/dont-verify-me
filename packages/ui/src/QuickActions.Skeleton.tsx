import { XStack } from "tamagui";
import { Skeleton } from "./Skeleton";

export function QuickActionsSkeleton() {
	return (
		<XStack
			gap="$3"
			padding="$3"
			borderRadius="$4"
			backgroundColor="$background"
			borderColor="$borderColor"
			justifyContent="space-around"
			marginBottom="$4"
		>
			<Skeleton flex={1} height={40} borderRadius="$4" />
			<Skeleton flex={1} height={40} borderRadius="$4" />
			<Skeleton flex={1} height={40} borderRadius="$4" />
		</XStack>
	);
}
