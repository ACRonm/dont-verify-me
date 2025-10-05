import { createThemes, defaultComponentThemes } from "@tamagui/theme-builder";
import * as Colors from "@tamagui/colors";

const darkPalette = [
	"#0f0f0f",
	"#1a1a1a",
	"#2b2b2b",
	"#3c3c3c",
	"#4d4d4d",
	"#5e5e5e",
	"#6f6f6f",
	"#808080",
	"#919191",
	"#a2a2a2",
	"#b3b3b3",
	"#c4c4c4",
];
const lightPalette = [
	"#ffffff",
	"#f2f2f2",
	"#e6e6e6",
	"#d9d9d9",
	"#cccccc",
	"#bfbfbf",
	"#b3b3b3",
	"#a6a6a6",
	"#999999",
	"#8c8c8c",
	"#808080",
	"#737373",
];

const lightShadows = {
	shadow1: "hsla(222, 47%, 11%, 0.04)",
	shadow2: "hsla(222, 47%, 11%, 0.08)",
	shadow3: "hsla(222, 47%, 11%, 0.12)",
	shadow4: "hsla(222, 47%, 11%, 0.16)",
	shadow5: "hsla(222, 47%, 11%, 0.20)",
	shadow6: "hsla(222, 47%, 11%, 0.24)",
};

const darkShadows = {
	shadow1: "hsla(222, 47%, 11%, 0.2)",
	shadow2: "hsla(222, 47%, 11%, 0.3)",
	shadow3: "hsla(222, 47%, 11%, 0.4)",
	shadow4: "hsla(222, 47%, 11%, 0.5)",
	shadow5: "hsla(222, 47%, 11%, 0.6)",
	shadow6: "hsla(222, 47%, 11%, 0.7)",
};

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
	componentThemes: defaultComponentThemes,

	base: {
		palette: {
			dark: darkPalette,
			light: lightPalette,
		},

		extra: {
			light: {
				...Colors.green,
				...Colors.red,
				...Colors.yellow,
				...Colors.blue,
				...Colors.orange,
				...lightShadows,
				shadowColor: lightShadows.shadow1,
				accent: "hsla(217, 91%, 60%, 1)", // default accent color (blue-500)
				accentHovered: "hsla(217, 91%, 55%, 1)", // darker accent for hover states
				backgroundStrong: "#e6e6e6",
				backgroundTransparent: "hsla(210, 40%, 96.1%, 30)",
				navbarBackground: "rgba(220, 220, 220, 0.5)",
				logoBackground: "rgba(255, 255, 255, 0.9)",
				proButtonBackground: "hsl(24, 95%, 50%)",
				proButtonColor: "hsl(40, 50%, 97%)",
				proButtonBackgroundHover: "hsl(24, 95%, 45%)",
			},
			dark: {
				...Colors.greenDark,
				...Colors.redDark,
				...Colors.yellowDark,
				...Colors.blueDark,
				...Colors.orangeDark,
				...darkShadows,
				shadowColor: darkShadows.shadow1,
				accent: "#75dd62", // default accent color (blue-500)
				accentHovered: "#65cd52", // darker accent for hover states
				backgroundStrong: "hsla(23, 39%, 5%, 1.00)", // Adding backgroundStrong
				backgroundTransparent: "hsla(222, 47%, 11%, 0)",
				navbarBackground: "rgba(120, 120, 120, 0.2)",
				logoBackground: "rgba(0, 0, 0, 0.5)",
				proButtonBackground: "hsl(24, 90%, 55%)",
				proButtonColor: "hsl(40, 50%, 97%)",
				proButtonBackgroundHover: "hsl(24, 90%, 50%)",
			},
		},
	},

	accent: {
		palette: {
			dark: [
				"#ff6600",
				"#ff7700",
				"#ff8800",
				"#ff9900",
				"#ffaa00",
				"#ffbb00",
				"#ffcc00",
				"#ffdd00",
				"#ffee00",
				"#ffff00",
				"#ffff00",
				"#ffff00",
			],
			light: [
				"#ff6600",
				"#ff7700",
				"#ff8800",
				"#ff9900",
				"#ffaa00",
				"#ffbb00",
				"#ffcc00",
				"#ffdd00",
				"#ffee00",
				"#ffff00",
				"#ffff00",
				"#ffff00",
			],
		},
	},

	childrenThemes: {
		warning: {
			palette: {
				dark: Object.values(Colors.yellowDark),
				light: Object.values(Colors.yellow),
			},
		},

		error: {
			palette: {
				dark: Object.values(Colors.redDark),
				light: Object.values(Colors.red),
			},
		},

		success: {
			palette: {
				dark: Object.values(Colors.greenDark),
				light: Object.values(Colors.green),
			},
		},
	},
});

export type Themes = typeof builtThemes;

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
	process.env["TAMAGUI_ENVIRONMENT"] === "client" &&
	process.env["NODE_ENV"] === "production"
		? ({} as any)
		: (builtThemes as any);
