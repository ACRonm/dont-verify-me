"use client";

import { XStack, YStack, Button, useMedia } from "tamagui";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";

export function LandingPageNavbar() {
	const router = useRouter();
	const [docked, setDocked] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setDocked(false);
			} else {
				setDocked(true);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const media = useMedia();

	return (
		<YStack
			// @ts-ignore
			position="fixed"
			top={0}
			left={0}
			right={0}
			zIndex={100}
			alignItems="center"
			margin="$4"
			// @ts-ignore
			transform={docked ? "translateY(-15px)" : "translateY(0)"}
			transition="all 0.3s ease-in-out"
		>
			<XStack
				tag="nav"
				width={media.gtSm ? "75%" : "95%"}
				height="$6"
				alignItems="center"
				justifyContent="space-between"
				paddingHorizontal="$4"
				borderRadius="$10"
				backgroundColor={docked ? "transparent" : "$navbarBackground"}
				// @ts-ignore
				backdropFilter={docked ? "none" : "blur(10px)"}
				transition="all 0.3s ease-in-out"
				gap="$4"
			>
				<XStack alignItems="center" gap="$2">
					<ThemeToggle />
				</XStack>

				<XStack
					onPress={() => router.push("/")}
					hoverStyle={{ cursor: "pointer" }}
				>
					<Logo docked={docked} />
				</XStack>
			</XStack>
		</YStack>
	);
}
