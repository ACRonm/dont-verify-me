import { Moon, Sun } from "@tamagui/lucide-icons";
import { Button } from "tamagui";
import { useThemeContext } from "./ThemeContext";

export function ThemeToggle() {
	const { theme, toggleTheme } = useThemeContext();

	return (
		<Button
			icon={theme === "dark" ? <Sun /> : <Moon />}
			onPress={toggleTheme}
			chromeless
			circular
			size="$3"
		/>
	);
}
