const { withTamagui } = require("@tamagui/next-plugin");

module.exports = function (name, { defaultConfig }) {
	const tamaguiPlugin = withTamagui({
		config: "../../packages/ui/src/tamagui.config.ts",
		components: ["tamagui", "@dont-verify-me/ui"],
		outputCSS:
			process.env.NODE_ENV === "production" ? "./public/tamagui.css" : null,
		logTimings: true,
		disableExtraction: process.env.NODE_ENV === "development",
	});

	return tamaguiPlugin({
		...defaultConfig,
		compiler: {
			// Remove React properties for production optimization
			...(process.env.NODE_ENV === "production" && {
				reactRemoveProperties: true,
			}),
		},
	});
};
