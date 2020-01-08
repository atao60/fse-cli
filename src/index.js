/** Entrypoint for production and development modes as both of them are launched with `babel`.
 * 
 * Using babel 7+ to work with ES2018 and TS (°) alike. Target node.
 * 
 * (°) Typescript compiler is only used to check types.
 *     It must be configured on its own with `"noEmit": true` in tsconfig.json.
 * 
 */
// @babel/polyfill is now deprecated in favor of directly including core-js/stable (to polyfill ECMAScript features) 
// and regenerator-runtime/runtime (needed to use transpiled generator functions):
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { argv } from 'process';

import { cli } from './cli';

cli(argv);
