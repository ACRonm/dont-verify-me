import { XStack, Text } from "tamagui";
import { LogoDots } from "./LogoDots";

interface LogoProps {
	width?: number;
	height?: number;
	docked?: boolean;
}

export function Logo({ width = 35, height = 32, docked }: LogoProps) {
	return (
		<XStack
			alignItems="center"
			justifyContent="center"
			gap="$2"
			backgroundColor={docked ? "transparent" : "$logoBackground"}
			paddingHorizontal="$3"
			paddingVertical="$2"
			borderRadius="$10"
			borderWidth={docked ? 0 : 1}
			elevation={docked ? 0 : "$2"}
			borderColor="transparent"
			transition="all 0.3s ease-in-out"
		>
			<LogoDots size={Math.max(width, height)} />
			<Text
				fontFamily="$logoFont"
				fontSize="$6"
				fontWeight="bold"
				color="$color"
			>
				Dont Verify Me
			</Text>
		</XStack>
	);
}
