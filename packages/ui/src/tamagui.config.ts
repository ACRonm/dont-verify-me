import { createFont, createTamagui } from "tamagui";
import { themes } from "./themes";
import { defaultConfig } from "@tamagui/config/v4";
import "@fontsource/inter/300.css";
import "@fontsource/inter/600.css";
import "@fontsource/silkscreen";

const interFont = createFont({
	family: "Inter, Helvetica, Arial, sans-serif",
	size: {
		1: 12,
		2: 14,
		3: 15,
		4: 16,
		5: 18,
		6: 20,
		7: 22,
		8: 24,
		9: 30,
		10: 36,
		11: 48,
		12: 60,
	},
	lineHeight: {
		1: 18,
		2: 22,
		3: 24,
		4: 26,
		5: 28,
		6: 32,
		7: 34,
		8: 38,
		9: 44,
		10: 50,
		11: 62,
		12: 74,
	},
	weight: {
		1: "100",
		2: "200",
		3: "300",
		4: "400",
		5: "500",
		6: "600",
		7: "700",
		8: "800",
		9: "900",
	},
	letterSpacing: {
		4: 0,
		8: -1,
	},
});

const spaceMonoFont = createFont({
	family: "Space Mono, monospace",
	size: {
		1: 12,
		2: 14,
		3: 15,
		4: 16,
		5: 18,
		6: 20,
		7: 22,
		8: 24,
		9: 26,
		10: 28,
		11: 32,
		12: 36,
	},
	lineHeight: {
		1: 18,
		2: 22,
		3: 24,
		4: 26,
		5: 28,
		6: 32,
	},
	weight: {
		1: "100",
		2: "200",
		3: "300",
		4: "400",
		5: "500",
		6: "600",
		7: "700",
		8: "800",
		9: "900",
	},
	letterSpacing: {
		4: 0,
		8: -1,
	},
});

const silkscreenFont = createFont({
	family: "Silkscreen, monospace",
	size: {
		1: 12,
		2: 14,
		3: 15,
		4: 16,
		5: 18,
		6: 20,
		7: 22,
		8: 24,
		9: 26,
		10: 28,
		11: 32,
		12: 36,
	},
	lineHeight: {
		1: 18,
		2: 22,
		3: 24,
		4: 26,
		5: 28,
		6: 32,
	},
	weight: {
		4: "400",
		7: "700",
	},
	letterSpacing: {
		4: 0,
		8: -1,
	},
});

// Create the Tamagui configuration object
const tamaguiConfig = createTamagui({
	...defaultConfig,
	fonts: {
		heading: interFont,
		body: interFont,
		mono: spaceMonoFont,
		logoFont: silkscreenFont,
	},
	themes,
	media: {
		xs: { maxWidth: 660 },
		gtXs: { minWidth: 660 + 1 },
		sm: { maxWidth: 768 },
		gtSm: { minWidth: 860 + 1 },
		md: { maxWidth: 980 },
		gtMd: { minWidth: 980 + 1 },
		lg: { maxWidth: 1120 },
		gtLg: { minWidth: 1120 + 1 },
		short: { maxHeight: 820 },
		tall: { minHeight: 820 },
		hoverNone: { hover: "none" },
		pointerCoarse: { pointer: "coarse" },
	},
});

export default tamaguiConfig;
