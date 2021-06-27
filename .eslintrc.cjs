// About replacing prettier rules by eslint rules:
//    How to replace Prettier by ESLint rules ?
//    Florian Briand, May 7, 2019
//    https://itnext.io/how-to-replace-prettier-by-eslint-rules-21574359e041

const lint = {
    off: 0,
    on: 1
};

const TS_OVERRIDE = {
    files: ["**/*.ts"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json"
        // tsconfigRootDir: __dirname
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        "@typescript-eslint/no-explicit-any": lint.on,
        "@typescript-eslint/no-unsafe-assignment": lint.off,
        // "@typescript-eslint/restrict-template-expressions": lint.off
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
};

module.exports = {
    extends: [
        "eslint:recommended"
    ],
    plugins: [],
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
        // debugLevel: true
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        'max-len': ["error", { "code": 120 }],  // printWidth: 120,
        indent: ["error", 4], // tabWidth: 4
        semi: ["error", "always"], // semi: true,
        quotes: ["off", "single"], // singleQuote: true,
        'comma-dangle': ["error", "never"]
    },
    overrides: [TS_OVERRIDE]
};
