import { Card, YStack, Separator } from "tamagui";
import { Skeleton } from "./Skeleton";

export function AlertsPanelSkeleton() {
	return (
		<Card elevate bordered padding="$4" flex={1}>
			<YStack gap="$3">
				<Skeleton width="70%" height={25} />
				<Separator />
				<YStack gap="$3">
					<Skeleton width="100%" height={20} />
					<Skeleton width="100%" height={20} />
					<Skeleton width="100%" height={20} />
				</YStack>
			</YStack>
		</Card>
	);
}
