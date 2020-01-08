import { expect } from 'chai';
import { existsSync, mkdtempSync, mkdirSync, rmdirSync, statSync } from 'fs';
import { describe, it } from 'mocha';
import { join } from 'path';
import { env } from 'process';

import { ENTER, execute as run } from './cmd';

const LIB_DIR = join(__dirname, env.APP_CODE_PATH || '../../dist');
const TMP_DIR = join(__dirname, env.PROJECT_TARGET_PATH || '../.tmp-dir');

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

    // first check if the jog is done
    it("Remove a directory", function (done) { // don't pass 'done' as argument! with async/await
        let newDirPath: string = null;
        try {
            mkdirSync(TMP_DIR, { recursive: true });
            newDirPath = mkdtempSync(join(TMP_DIR, 'fse-cli-test-'));
        } catch (e) {
            throw new Error(`Test 'Remove a directory', unable to create a temporaray directory '${newDirPath}': ${e}`);
        }

        const dirToBeRemoved = newDirPath;
        const script = `${LIB_DIR}`; // ie index.js
        const args = { app: ['remove', dirToBeRemoved] };
        const userInputs = [];
        const options = {
            // env: { DEBUG: true },  // false by default
            // timeout: 200,          // 100 ms by default
            // maxTimeout: 0          // 10 s by default; if "0" then no timeout
        };
        run(
            script,
            args,
            userInputs,
            options
        )
            .then(() => {
                expect(existsSync(dirToBeRemoved)).to.be.false;
                done();
            })
            .catch(error => {
                done(error);
            })
            .finally(() => {
                if (existsSync(dirToBeRemoved))
                    rmdirSync(dirToBeRemoved, { recursive: true });
            });
    });

    // first check if the jog is done
    it("Create a directory", function (done) { // don't pass 'done' as argument! with async/await
        let newDirPath: string = null;
        try {
            mkdirSync(TMP_DIR, { recursive: true });
            newDirPath = mkdtempSync(join(TMP_DIR, 'fse-cli-test-'));
        } catch (e) {
            throw new Error("Test 'Create a directory', " +
                `before starting unable to create a temporaray directory '${newDirPath}': ${e}`);
        }

        const baseDir = newDirPath;
        const dirToBeCreated = join(baseDir, 'theNewDir');
        const script = `${LIB_DIR}`; // ie index.js
        const args = { app: ['mkdirp', dirToBeCreated] };
        const userInputs = [];
        const options = {
            // env: { DEBUG: true },  // false by default
            // timeout: 200,          // 100 ms by default
            // maxTimeout: 0          // 10 s by default; if "0" then no timeout
        };
        run(
            script,
            args,
            userInputs,
            options
        )
            .then(() => {
                expect(existsSync(dirToBeCreated)).to.be.true;
                expect(statSync(dirToBeCreated).isDirectory()).to.be.true;
                done();
            })
            .catch(error => {
                done(error);
            })
            .finally(() => {
                // to avoid ENOTEMPTY with the second rmdirSync, even with recursive: true
                rmdirSync(dirToBeCreated, { recursive: true });  
                rmdirSync(baseDir, { recursive: true });
            });
    });


});
