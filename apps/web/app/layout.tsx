"use client";

import "./globals.css";
import { TamaguiProvider, YStack, Theme } from "tamagui";
import { tamaguiConfig } from "@dont-verify-me/ui";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import AuthWrapper from "../components/AuthWrapper";
import { MFAWrapper } from "../components/MFAWrapper";
import { ToastComponent } from "../components/ToastComponent";
import { ThemedPage, BottomNavBar } from "@dont-verify-me/ui";
import { Navbar } from "../components/Navbar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeContext, ThemeContextType } from "../components/ThemeContext";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const noNavRoutes = ["/login", "/signup", "/"];
	const isPlatformPage = pathname?.startsWith("/platforms/");
	const showNav = !noNavRoutes.includes(pathname) && !isPlatformPage;
	const [theme, setTheme] = useState("dark");

	const themeContextValue: ThemeContextType = {
		theme,
		toggleTheme: () => {
			setTheme(theme === "dark" ? "light" : "dark");
		},
	};

	return (
		<html lang="en">
			<title>dont verify me</title>
			<body>
				<ThemeContext.Provider value={themeContextValue}>
					<TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
						<Theme name={theme}>
							<ToastProvider>
								<AuthWrapper>
									<MFAWrapper>
										{showNav && <Navbar />}
										<YStack
											paddingTop={showNav ? "$10" : "$0"}
											paddingBottom={showNav ? "$12" : "$0"}
											flex={1}
										>
											<ThemedPage>{children}</ThemedPage>
										</YStack>
										{showNav && <BottomNavBar />}
									</MFAWrapper>
								</AuthWrapper>
								<ToastComponent />
								<ToastViewport
									left={0}
									right={0}
									bottom={50}
									marginHorizontal="auto"
									maxWidth={500}
								/>
							</ToastProvider>
						</Theme>
					</TamaguiProvider>
				</ThemeContext.Provider>
			</body>
		</html>
	);
}
