const targets = {
    node: "10.15.3" // See also engines.node in package.json
    // With @atao/fse-cli, indeed no '.browserslistrc'
};

const plugins = [
    "@babel/transform-typescript",
    // must be set before @babel/proposal-decorators
    "babel-plugin-transform-typescript-metadata",
    [   // must be set before @babel/proposal-class-properties
        "@babel/proposal-decorators",
        {
            legacy: true // 'legacy === true' forces using Typescript decorator specs, not EcmaScript ones
        }
    ],
    [
        "@babel/proposal-class-properties",
        {
            loose: true // 'loose === true' is required by proposal-decorators' legacy
        }
    ],
    [   // must be the same value than with @babel/plugin-proposal-class-properties
        "@babel/plugin-proposal-private-methods",
        {
            loose: true
        }
    ],
    "@babel/plugin-transform-runtime", // provided defs such as _interopRequireDefault
    "babel-plugin-node-source-map-support"
];

const presets = [
    "@babel/typescript",
    [
        "@babel/env",
        {
            // "debug": true,
            // 'usage': includes polyfills given `.browserslistrc` and your source code (Babel analyses it - might 
            //  not always perfectly work depending on your app and its dependencies) instead of including 
            //everything from core-js
            useBuiltIns: "usage",
            corejs: {
                version: 3,
                proposals: true // will enable polyfilling of every proposal supported by core-js
            },
            // Now Babel defaults 'modules' to 'auto', not any more to 'commonjs' (which won’t tree-shake.)
            // So no more need to setup 'modules' to 'false':
            // modules: false, 
            targets
        }
    ]
];

module.exports = (api) => {
    // Cache configuration is a required option
    // With 'true', same as api.cache.forever(), ie permacache the computed config and never call the function again
    api.cache(true); 

    return { presets, plugins };
};
