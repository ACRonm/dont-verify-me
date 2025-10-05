import Image from "next/image";
import { XStack, Text, useThemeName } from "tamagui";

interface LogoProps {
	width?: number;
	height?: number;
	docked?: boolean;
}

export function Logo({ width = 35, height = 32, docked }: LogoProps) {
	const themeName = useThemeName();

	const logo =
		themeName === "dark"
			? "/logo_final_dark_optimised.svg"
			: "/logo_final_light_optimised.svg";

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
			<Image src={logo} width={width} height={height} alt="Dont Verify Me Logo" />
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
