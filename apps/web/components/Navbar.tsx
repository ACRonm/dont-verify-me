import { Avatar, XStack, YStack, Button, useMedia } from "@dont-verify-me/ui";
import { Settings, LogOut, ChevronsUpDown } from "@tamagui/lucide-icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@dont-verify-me/shared-logic";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState, useRef } from "react";

export function Navbar() {
	const router = useRouter();
	const { signOut, user } = useAuth();
	const [docked, setDocked] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleSignOut = async () => {
		await signOut();
		router.push("/login");
	};

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

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		};

		if (menuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuOpen]);

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
				width={media.gtSm ? "80%" : "95%"}
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
				{!media.sm && (
					<XStack alignItems="center" gap="$2">
						<ThemeToggle />
						<Button
							size="$3"
							chromeless
							borderRadius="$10"
							backgroundColor="$proButtonBackground"
							color="$proButtonColor"
							hoverStyle={{ backgroundColor: "$proButtonBackgroundHover" }}
						>
							Pro
						</Button>
					</XStack>
				)}

				<XStack
					onPress={() => router.push(user ? "/dashboard" : "/")}
					hoverStyle={{ cursor: "pointer" }}
				>
					<Logo docked={docked} />
				</XStack>

				<XStack alignItems="center" gap="$4">
					<YStack
						// @ts-ignore
						ref={menuRef}
						// @ts-ignore
						position="relative"
					>
						<XStack
							alignItems="center"
							gap="$2"
							hoverStyle={{
								cursor: "pointer",
								backgroundColor: "$backgroundHover",
							}}
							padding="$1.5"
							borderRadius="$8"
							onPress={() => setMenuOpen(!menuOpen)}
						>
							<Avatar circular size="$3">
								<Avatar.Image
									accessibilityLabel="User Avatar"
									src={
										user?.user_metadata["avatar_url"] ||
										"https://picsum.photos/600/400"
									}
								/>
								<Avatar.Fallback backgroundColor="$accent10" />
							</Avatar>
							<ChevronsUpDown size="$1" />
						</XStack>

						{menuOpen && (
							<YStack
								// @ts-ignore
								position="absolute"
								top="$6"
								right={0}
								minWidth={200}
								backgroundColor="$background"
								borderRadius="$4"
								padding="$2"
								gap="$2"
								elevation="$4"
								// @ts-ignore
								boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
								// @ts-ignore
								zIndex={1000}
							>
								{media.sm && (
									<XStack alignItems="center" gap="$2" paddingBottom="$2">
										<ThemeToggle />
										<Button
											size="$3"
											chromeless
											borderRadius="$10"
											backgroundColor="$proButtonBackground"
											color="$proButtonColor"
											hoverStyle={{
												backgroundColor: "$proButtonBackgroundHover",
											}}
										>
											Pro
										</Button>
									</XStack>
								)}
								<Button
									chromeless
									size="$3"
									icon={<Settings size="$1" />}
									onPress={() => {
										setMenuOpen(false);
										router.push("/settings");
									}}
									justifyContent="flex-start"
								>
									Settings
								</Button>
								<Button
									chromeless
									size="$3"
									icon={<LogOut size="$1" />}
									onPress={() => {
										setMenuOpen(false);
										handleSignOut();
									}}
									justifyContent="flex-start"
								>
									Sign Out
								</Button>
							</YStack>
						)}
					</YStack>
				</XStack>
			</XStack>
		</YStack>
	);
}
