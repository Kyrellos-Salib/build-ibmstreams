module.exports = {
	parser: "babel-eslint",
	plugins: [
		"babel",
		"flowtype"
	],
	extends: [
		"plugin:flowtype/recommended"
	],
	rules: {
		// Disable strict warning on ES6 Components
	"strict": 0,
	"global-require": 0,
	"sort-imports": 0,
	//"react/jsx-indent-props": [2, "tab"],

	// Allow class level arrow functions
	"no-invalid-this": 0,
	"babel/no-invalid-this": 1,

	// Allow flow type annotations on top
	// "react/sort-comp": [1, {
	// 	order: [
	// 		"type-annotations",
	// 		"static-methods",
	// 		"lifecycle",
	// 		"everything-else",
	// 		"render",
	// 	],
	// }],

	// Allow underscore in property names
	"camelcase": ["off"],

	// Intent rules
	"indent": ["error", "tab", {
		"SwitchCase": 1,
		"CallExpression": {
			"arguments": "off",
		},
	}],
	}
};
