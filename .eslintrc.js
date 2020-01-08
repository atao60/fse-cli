// About replacing prettier rules by eslint rules:
//    How to replace Prettier by ESLint rules ?
//    Florian Briand, May 7, 2019
//    https://itnext.io/how-to-replace-prettier-by-eslint-rules-21574359e041

module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    plugins: ["@typescript-eslint"],
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'max-len': ["error", { "code": 120 }],  // printWidth: 120,
        indent: ["error", 4], // tabWidth: 4
        semi: ["error", "always"], // semi: true,
        quotes: ["off", "single"], // singleQuote: true,
        'comma-dangle': ["error", "never"]
    }
};
