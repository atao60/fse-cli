import { expect } from 'chai';
import { existsSync, readFileSync } from 'fs';
import { describe, it } from 'mocha';
import { join } from 'path';
import { env } from 'process';

import { ENTER, execute as run } from './cmd';

const LIB_DIR = join(__dirname, env.APP_CODE_PATH || '../../dist');
const TARGET_DIR = join(__dirname, env.PROJECT_TARGET_PATH || '../.tmp-dir');

describe('The fse CLI project', () => {

    it("A task must be specified", function (done) { // don't pass 'done' as argument if async/await

        const script = `${LIB_DIR}`; // ie index.js
        const args = {};
        const userInputs = [];
        const options = {
            // env: { DEBUG: true },  // false by default
            // timeout: 200,          // 100 ms by default
            // maxTimeout: 0          // 10 s by default; if "0" then no timeout
        };
        const foundRegex = new RegExp('^ERROR:\\s+No\\s+task\\s+specified', 'm');
        run(
            script,
            args,
            userInputs,
            options
        )
            .then(result => {
                expect(result).to.match(foundRegex);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

    it("The task is unknown", function (done) { // don't pass 'done' as argument! with async/await

        const script = `${LIB_DIR}`; // ie index.js
        const unknownTask = 'unknown';
        const args = { app: [unknownTask] };
        const userInputs = [];
        const options = {
            // env: { DEBUG: true },  // false by default
            // timeout: 200,          // 100 ms by default
            // maxTimeout: 0          // 10 s by default; if "0" then no timeout
        };
        const foundRegex = new RegExp(`^ERROR:\\s+Unknown\\s+task\\s+'${unknownTask}'`, 'm');
        run(
            script,
            args,
            userInputs,
            options
        )
            .then(result => {
                expect(result).to.match(foundRegex);
                done();
            })
            .catch(error => {
                done(error);
            });
    });

});