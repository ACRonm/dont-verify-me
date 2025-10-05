import { YStack, YStackProps } from "tamagui";
import { Skeleton } from "./Skeleton";

export function MaintenanceLogTableSkeleton(props: YStackProps) {
	return (
		<YStack
			gap="$3"
			padding="$4"
			borderRadius="$4"
			borderWidth={1}
			borderColor="$borderColor"
			{...props}
		>
			<Skeleton width="50%" height={25} />
			<Skeleton width="100%" height={1} />
			<YStack gap="$2">
				<Skeleton width="100%" height={40} />
				<Skeleton width="100%" height={40} />
				<Skeleton width="100%" height={40} />
			</YStack>
		</YStack>
	);
}
