import { Card } from "tamagui";
import { Skeleton } from "./Skeleton";

export function StatsGraphCardSkeleton() {
	return (
		<Card elevate bordered flex={1} padding="$4" gap="$3">
			<Skeleton width="60%" height={25} />
			<Skeleton width="100%" height={200} />
		</Card>
	);
}
