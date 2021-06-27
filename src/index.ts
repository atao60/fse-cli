/** Entrypoint for production and development modes as both of them are launched with `babel`.
 * 
 * Using babel 7+ to work with ES2018+ and TS (°) alike. Target node.
 * 
 * (°) Typescript compiler is only used to check types.
 *     It must be configured on its own with `"noEmit": true` in tsconfig.json.
 * 
 */
// @babel/polyfill is now deprecated in favor of directly including core-js/stable/index.js (to polyfill ECMAScript features) 
// and regenerator-runtime/runtime.js (needed to use transpiled generator functions):
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import { argv } from 'process';

import { cli } from './cli.js';

void cli(argv);
