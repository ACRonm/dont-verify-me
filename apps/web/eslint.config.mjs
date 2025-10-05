import customConfig from "eslint-config-custom"; // The package name from your monorepo
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
const config = [
	// Start with our custom, shared configuration from the monorepo package
	...customConfig,

	// Add any configurations that are SPECIFIC to this web app
	{
		files: ["**/*.{js,ts,jsx,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser, // Add browser globals like `window`, `document`
				...globals.node, // Add Node.js globals
			},
		},
		// You can add web-app specific rules here if needed
		rules: {
			"react/no-unescaped-entities": "off",
		},
	},

	// Ignore files specific to this app
	{
		ignores: [".next/"],
	},
];

export default config;
