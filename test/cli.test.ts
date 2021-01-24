import { expect } from 'chai';
import { closeSync, existsSync, mkdtempSync, mkdirSync, openSync, readFileSync, rmdirSync, statSync, unlinkSync, writeSync } from 'graceful-fs';
import { describe, it } from 'mocha';
import { join } from 'path';
import { env } from 'process';
import { format as printf } from 'util';
import supportsColor from 'supports-color';

import { execute as run } from './cmd';

const LIB_DIR = join(__dirname, env.APP_CODE_PATH || '../../dist');
// os.tmpdir() is not used here, to stay inside project folder
const TMP_DIR = join(__dirname, env.PROJECT_TARGET_PATH || '../.tmp-dir');

// See https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
/*eslint max-len: ["off"]*/
const semverPattern = /(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/.source;

function createTempDir(format: string, path = TMP_DIR, suffix = 'fse-cli-test-') {
    try {
        mkdirSync(path, { recursive: true });
        const newDirPath = mkdtempSync(join(path, suffix));
        return newDirPath;
    } catch (e) {
        throw new Error(printf(format, path, suffix, e));
    }
}

const DEBUG = env.CLI_TEST_DEBUG && env.CLI_TEST_DEBUG === 'true';

describe("The fs-extra CLI", () => {

    describe("Calling CLI", () => {
        it("When no task is specified, an error message must be log", function (done) { // don't pass 'done' as argument if async/await

            const script = `${LIB_DIR}`; // ie index.js
            const args = {};
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
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

        it("When an unknown task is specified, an error message must be log", function (done) { // don't pass 'done' as argument! with async/await

            const script = `${LIB_DIR}`; // ie index.js
            const unknownTask = 'unknown';
            const args = { app: [unknownTask] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
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

    describe("Calling 'emptyDir'", () => {
        it("When existing directory, it will be purged", function (done) { // don't pass 'done' as argument! with async/await
            const dirToBePurged = createTempDir("Test 'Purge a directory', unable to create a temporary directory based on '%s' & '%s': %s");
            const fileToBeRemoved = join(dirToBePurged, 'toBeRemoved.txt');
            closeSync(openSync(fileToBeRemoved, 'w'));
            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['emptyDir', dirToBePurged] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
            };
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(() => {
                    expect(existsSync(dirToBePurged), "directory should still exists").to.be.true;
                    expect(!existsSync(fileToBeRemoved), "file should have been removed").to.be.true;
                    done();
                })
                .catch(error => {
                    done(error);
                })
                .finally(() => {
                    try {
                        rmdirSync(dirToBePurged, { recursive: true });
                    } catch (e) { /* do nothing */ }
                });

        });
    });

    describe("Calling 'remove'", () => {
        // first check if the jog is done
        it("When existing directory, it will be removed", function (done) { // don't pass 'done' as argument! with async/await

            const dirToBeRemoved = createTempDir("Test 'Remove a directory', unable to create a temporary directory based on '%s' & '%s': %s");
            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['remove', dirToBeRemoved] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
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
                    try {
                        rmdirSync(dirToBeRemoved, { recursive: true });
                    } catch (e) { /* do nothing */ }
                });
        });
    });

    describe("Calling 'mkdir'", () => {
        // first check if the jog is done
        it("When non existing directory, it will be created", function (done) { // don't pass 'done' as argument! with async/await

            const baseDir = createTempDir("Test 'Create a directory', unable to create a temporary parent directory based on '%s' & '%s': %s");
            const dirToBeCreated = join(baseDir, 'theNewDir');
            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['mkdirp', dirToBeCreated] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
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
                    // to avoid ENOTEMPTY with the second rmdirSync, even with `recursive: true`
                    rmdirSync(dirToBeCreated, { recursive: true });
                    rmdirSync(baseDir, { recursive: true });
                });
        });
    });

    describe("Calling 'touch'", () => {
        // first check if the jog is done
        it("When non existing file, it will be created", function (done) { // don't pass 'done' as argument! with async/await


            const baseDir = createTempDir("Test 'Create a file', unable to create a temporary parent directory based on '%s' & '%s': %s");
            const fileToBeCreated = join(baseDir, 'theNewFile');
            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['ensureFile', fileToBeCreated] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0 ,        // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
            };
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(() => {
                    expect(existsSync(fileToBeCreated), "No new file").to.be.true;
                    expect(statSync(fileToBeCreated).isFile(), "New item is not a file").to.be.true;
                    done();
                })
                .catch(error => {
                    done(error);
                })
                .finally(() => {
                    // to avoid ENOTEMPTY with the latter rmdirSync, even with `recursive: true`
                    try {
                        unlinkSync(fileToBeCreated);
                    } catch (e) { /* do nothing */ }
                    rmdirSync(baseDir, { recursive: true });
                });
        });
    });

    describe("Calling 'copy'", () => {
        // first check if the jog is done
        it("When destination file doesn't exist, a new file is created with the same content", function (done) { // don't pass 'done' as argument! with async/await
            
            const destDirName = "sub-dir-";
            const srcFileName = "theFileToBeCopied";
            const srcFileContent = 'theFileToBeCopied-content';
            const destFileName = "theFileCopy";

            const baseDir = createTempDir("Test 'Copy a file', unable to create a temporary source directory based on '%s' & '%s': %s");
            const destDirPath = createTempDir("Test 'Copy a file', unable to create a temporary destination directory based on '%s' & '%s': %s", baseDir, destDirName);

            const fileToBeCopied = join(baseDir, srcFileName);
            // dixit fs-extra doc, "if src is a file, dest cannot be a directory"
            const fileCopy = join(destDirPath, destFileName);

            try {
                const fileToBeCopiedDescriptor = openSync(fileToBeCopied, 'w');
                writeSync(fileToBeCopiedDescriptor, srcFileContent, undefined, 'utf8');
                closeSync(fileToBeCopiedDescriptor);
            } catch (e) {
                throw new Error(printf("Test 'Copy a file', unable to create a temporary file '%s': %s", fileToBeCopied, e));
            }

            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['copy', fileToBeCopied, fileCopy] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
            };
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(() => {
                    expect(existsSync(fileCopy), "no copied file").to.be.true;
                    expect(statSync(fileCopy).isFile(), "new item is not a file").to.be.true;
                    expect(readFileSync(fileCopy, { encoding: 'utf8' })).to.equal(srcFileContent);
                    done();
                })
                .catch(error => {
                    done(error);
                })
                .finally(() => {
                    // to avoid ENOTEMPTY with the latter rmdirSync-s, even with `recursive: true`
                    try {
                        unlinkSync(fileCopy);
                    } catch (e) { /* do nothing */ }
                    try {
                        unlinkSync(fileToBeCopied);
                    } catch (e) { /* do nothing */ }
                    rmdirSync(destDirPath, { recursive: true });
                    rmdirSync(baseDir, { recursive: true });
                });
        });
    });

    describe("Calling 'move'", () => {
        // first check if the jog is done
        it("Then source has been removed, destinaton exists and content is untouched", function (done) { // don't pass 'done' as argument! with async/await

            const destDirName = "sub-dir-";
            const srcFileName = "theFileToBeMoved";
            const srcFileContent = 'theFileToBeMoved-content';

            const baseDir = createTempDir("Test 'Move a file', unable to create a temporary source directory based on '%s' & '%s': %s");
            const destDirPath = createTempDir("Test 'Move a file', unable to create a temporary destination directory based on '%s' & '%s': %s", baseDir, destDirName);
            const fileToBeMovedPath = join(baseDir, srcFileName);
            const movedFilePath = join(destDirPath, srcFileName);

            try {
                const fileToBeMovedDescriptor = openSync(fileToBeMovedPath, 'w');
                writeSync(fileToBeMovedDescriptor, srcFileContent, undefined, 'utf8');
                closeSync(fileToBeMovedDescriptor);
            } catch (e) {
                throw new Error(printf("Test 'Move a file', unable to create a temporary file '%s': %s", fileToBeMovedPath, e));
            }

            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['move', fileToBeMovedPath, movedFilePath] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
            };
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(() => {
                    expect(existsSync(fileToBeMovedPath), "source file still existing").to.be.false;
                    expect(existsSync(movedFilePath), "no moved file").to.be.true;
                    expect(statSync(movedFilePath).isFile(), "new item is not a file").to.be.true;
                    expect(readFileSync(movedFilePath, { encoding: 'utf8' })).to.equal(srcFileContent);
                    done();
                })
                .catch(error => {
                    done(error);
                })
                .finally(() => {
                    // to avoid ENOTEMPTY with the latter rmdirSync-s, even with `recursive: true`
                    try {
                        unlinkSync(movedFilePath);
                    } catch (e) { /* do nothing */ }
                    try {
                        unlinkSync(fileToBeMovedPath);
                    } catch (e) { /* do nothing */ }
                    rmdirSync(destDirPath, { recursive: true });
                    rmdirSync(baseDir, { recursive: true });
                });
        });
    });


    describe("Calling 'version'", () => {
        it("Show version", function (done) { // don't pass 'done' as argument with async/await

            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['version'] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { DEBUG }           // false by default
            };
            const foundRegex = new RegExp(`^@atao60/fse-cli\\s+${semverPattern}\\s+\\(fs-extra\\s+${semverPattern}\\)$`);
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(result => {
                    expect((result as string).trim()).to.match(foundRegex);
                    done();
                })
                .catch(error => {
                    done(error);
                });
        });
    });

    describe("Calling 'help'", () => {
        it("Show help", function (done) { // don't pass 'done' as argument with async/await

            const script = `${LIB_DIR}`; // ie index.js
            const args = { app: ['help'] };
            const userInputs = [];
            const options = {
                // timeout: 200,          // 100 ms by default
                // maxTimeout: 0,         // 10 s by default; if "0" then no timeout
                env: { 
                    DEBUG,                                   // false by default
                    FORCE_COLOR: supportsColor.stdout.level  // 
                }            
            };
            const versionRegex = new RegExp(`^@atao60/fse-cli\\s+${semverPattern}\\s+\\(fs-extra\\s+${semverPattern}\\)`);
            const manualRegex = new RegExp(`File system extra CLI - Usage`, 'm');
            run(
                script,
                args,
                userInputs,
                options
            )
                .then(result => {
                    const help = result as string;
                    expect(help.trim()).to.match(versionRegex); // check package version was retrieved from npm-shrinkwrap.json
                    expect(help).to.match(manualRegex); // check help content was retrieved from USAGE file
                    // eslint-disable-next-line no-control-regex
                    expect(help.replace(/\x1b\[([0-9;]*[mGKF])/g, '\\x1b[$1')).to.match(/\\x1b\[[0-9;]*[mGKF]/); // just check if at least one style ANSI code is present
                    done();
                })
                .catch(error => {
                    done(error);
                });
        });
    });

});
