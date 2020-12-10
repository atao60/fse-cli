# 003. Build without any bundler

Date: 2020-10-20

## Status

Accepted

## Context

Do we really need a bundler such as [Parcel](https://parceljs.org/), [Rollup](https://rollupjs.org//), [Webpack](https://webpack.js.org/)... for a CLI package?

Or task runners such as [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/)?

Even using [Babel 7](https://babeljs.io/) with [Typescript](http://www.typescriptlang.org/)? (see [004. Babel 7 with both TS and ES2018+](./004-typescript-babel.md))

No need to create a bundle to work with node.js.

See also [node_modules are added to npm release, adding 117MB #6](https://github.com/atao60/fse-cli/issues/6).

## Decision

No. Use this project as POC.

## Consequences

Less dependencies. Even if some libraries as cross-env will be used to get cross-platform scripts.

The `scripts` section of package.json can become huge, then less easy to read and therefore to maintain.

## More reading

[Write Simple Tasks for Development — The Power of NPM Scripts](https://itnext.io/the-power-of-npm-scripts-57aaad9f038d), Nenad Novaković, Jun 12, 2018 

[Introduction to Using NPM as a Build Tool](https://medium.com/javascript-training/introduction-to-using-npm-as-a-build-tool-b41076f488b0), Nader Dabit, Oct 28, 2015

[Survivejs - Comparison of Build Tools](https://survivejs.com/webpack/appendices/comparison/)