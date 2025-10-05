// We are now exporting an array of config objects, which is the flat config standard.
// We also use JSDoc comments to get TypeScript type-checking for our config file!

const nextPlugin = require("@next/eslint-plugin-next");
const reactPlugin = require("eslint-plugin-react");
const hooksPlugin = require("eslint-plugin-react-hooks");
const prettierPlugin = require("eslint-plugin-prettier");
const tsParser = require("@typescript-eslint/parser");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
	// Base configurations
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				React: "readonly",
			},
		},
		plugins: {
			react: reactPlugin,
			"react-hooks": hooksPlugin,
			"@next/next": nextPlugin,
		},
		rules: {
			...reactPlugin.configs.recommended.rules,
			...hooksPlugin.configs.recommended.rules,
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	// Prettier configuration (must be last)
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
];
