module.exports = (api) => {
  // Cache configuration is a required option
  api.cache(false);

  const plugins = [
    "@babel/transform-typescript",
    // must be set before @babel/proposal-decorators
    "babel-plugin-transform-typescript-metadata",
    [   // must be set before @babel/proposal-class-properties
      "@babel/proposal-decorators",
      {
        "legacy": true // 'legacy === true' forces using Typescript decorator specs, not EcmaScript ones
      }
    ],
    [
      "@babel/proposal-class-properties",
      {
        "loose": true // 'loose === true' is required by proposal-decorators' legacy
      }
    ],
    "babel-plugin-node-source-map-support"
  ];

  const presets = [
    [
      "@babel/env",
      {
        "targets": {
          "node": "10.15.3" // Node version should be at least equal to engine.nodes in package.json
        },
        // "debug": true,
        "useBuiltIns": "usage",
        "corejs": 3
      },
      "@babel/typescript"
    ]
  ];

  return { presets, plugins };
};
