import { YStack } from "tamagui";

export function Skeleton({ ...props }) {
	return (
		<YStack
			className="shimmer"
			position="relative"
			overflow="hidden"
			backgroundColor="$backgroundPress"
			{...props}
		/>
	);
}
