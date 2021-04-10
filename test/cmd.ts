import { constants } from 'os';
import { env } from 'process';
import concat from 'concat-stream';

import { spawn } from 'cross-spawn';
import { existsSync } from 'graceful-fs';
// here only types are imported from `child_process`: no risk about cross platform issues.
import { ChildProcess, ChildProcessWithoutNullStreams, SpawnOptions } from 'child_process';

export interface ProcessPromise<T> extends Promise<T> {
    attachedProcess: ChildProcessWithoutNullStreams;
}

interface ProcessOptions {
    env?: {
        DEBUG?: boolean;
        FORCE_COLOR?: number;
        FSE_CLI_QUIET?: string
    };
    timeout?: number;
    maxTimeout?: number;
}

const PATH = env.PATH;
const DEFAULT_TIMEOUT = 100;
const DEFAULT_MAX_TIMEOUT = 100 * 100;

export const ENTER = '\x0D';  // TODO check if working under Windows;
export const SPACE = '\x20';
export const UP = '\x1B\x5B\x41';
export const DOWN = '\x1B\x5B\x42';

/**
 * Creates a child process with script path
 * @param {string} processPath Path of the process to execute
 * @param {Array} args Arguments to the command
 * @param {Object} env (optional) Environment variables
 */
export function createProcess(processPath: string,
    args: { node?: []; app?: [] } | [] = {},
    envvars = null): ChildProcess {

    const nodeArgs = Array.isArray(args) ? [] : (args && args.node ? args.node : []);
    const appArgs = Array.isArray(args) ? args : (args && args.app ? args.app : []);

    const lastNodeArg: string = ((nodeArgs.slice(-1)[0] as string) || '').trim();
    const isExp2Eval = lastNodeArg === '-e' || lastNodeArg.startsWith('--eval');

    if (!(isExp2Eval || (processPath && existsSync(processPath)))) {
        throw new Error(`Invalid process path: ${processPath}`);
    }

    const command = 'node';
    const commandArgs = [].concat(nodeArgs, processPath, appArgs);
    const options: SpawnOptions = {
        env: Object.assign(
            {
                NODE_ENV: 'test',
                PATH, // This is needed in order to get all the binaries in the current terminal
                preventAutoStart: false
            },
            envvars
        ),
        // Enable IPC in child process. This syntax is explained in
        // Node.js documentation: https://nodejs.org/api/child_process.html#child_process_options_stdio
        stdio: [null, null, null, 'ipc']  // ie ['pipe', 'pipe', 'pipe', 'ipc' ], 
        // the first three are stdin, stdout & stderr
    };
    return spawn(command, commandArgs, options);
}

/**
 * Creates a command and executes inputs (user responses) to the stdin
 * Returns a promise that resolves when all inputs are sent
 * Rejects the promise if any error
 * Warning: exported as 'execute'
 * @param {string} processPath Path of the process to execute
 * @param {Object} args Arguments to the command and the application
 * @param {Array} inputs (Optional) Array of inputs (user responses)
 * @param {Object} opts (Optional) Environment variables
 */
function executeWithInput(processPath: string,
    args: Record<string, unknown> | [] = {},
    inputs: unknown[] = [],
    opts?: ProcessOptions): ProcessPromise<unknown> {

    // Handle case if user decides not to pass input data
    // A.k.a. backwards compatibility
    if (!Array.isArray(inputs)) {
        opts = inputs;
        inputs = [];
    }

    const defaultEnvVars = { DEBUG: false };
    const { env: envvars = defaultEnvVars, timeout = DEFAULT_TIMEOUT, maxTimeout = DEFAULT_MAX_TIMEOUT } = opts
        || { env: defaultEnvVars };
    envvars.DEBUG = envvars.DEBUG || false;
    const childProcess = createProcess(processPath, args, envvars);
    childProcess.stdin.setDefaultEncoding('utf-8');

    let currentInputTimeout: ReturnType<typeof setTimeout>;
    let killIOTimeout: ReturnType<typeof setTimeout>;

    // Creates a loop to feed user inputs to the child process in order to get results from the tool
    // This code is heavily inspired (if not blatantly copied) from inquirer-test:
    // https://github.com/ewnd9/inquirer-test/blob/6e2c40bbd39a061d3e52a8b1ee52cdac88f8d7f7/index.js#L14
    const loop = (currentinputs: unknown[]): void => {
        if (killIOTimeout) {
            clearTimeout(killIOTimeout);
        }

        if (!currentinputs.length) {
            childProcess.stdin.end();

            // Set a timeout to wait for CLI response. If CLI takes longer than
            // maxTimeout to respond, kill the childProcess and notify user
            if (maxTimeout > 0) {
                killIOTimeout = setTimeout(() => {
                    console.error('Error: Reached I/O timeout');
                    childProcess.kill(constants.signals.SIGTERM);
                }, maxTimeout);
            }

            return;
        }
        currentInputTimeout = setTimeout(() => {
            childProcess.stdin.write(currentinputs[0]);
            if (envvars.DEBUG) {
                console.log('input: ', currentinputs[0]);
            }
            loop(currentinputs.slice(1));
        }, timeout);
        if (envvars.DEBUG) {
            console.log('currentInputTimeout: ', currentInputTimeout);
        }
    };

    const promise = new Promise((resolve, reject) => {

        // Get errors from CLI
        childProcess.stderr.on('data', data => {
            // Log debug I/O statements on tests
            if (envvars.DEBUG) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.log(`error: ${data}`);
            }
        });

        // Get output from CLI
        childProcess.stdout.on('data', data => {
            // Log debug I/O statements on tests
            if (envvars.DEBUG) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                console.log(`output: ${data}`);
            }
        });

        childProcess.stderr.once('data', (err: Error) => {
            // If childProcess errors out, stop all
            // the pending inputs if any
            childProcess.stdin.end();

            if (currentInputTimeout) {
                clearTimeout(currentInputTimeout);
                inputs = [];
            }
            resolve(err.toString()); // don't reject here, it's not an exception
            // TODO may be return an object with a property 'type'
        });

        childProcess.on('close', (code) => {
            resolve(`Process exit code: ${code}`);
        });

        childProcess.on('error', () => {
            reject();
        });    // Kick off the process

        loop(inputs);

        childProcess.stdout.pipe(
            concat(result => {
                if (killIOTimeout) {
                    clearTimeout(killIOTimeout);
                }
                resolve(result.toString());
            })
        );
    }) as ProcessPromise<unknown>;

    // Appending the process to the promise, in order to
    // add additional parameters or behavior (such as IPC communication)
    promise.attachedProcess = childProcess;

    return promise;
}

export const execute = executeWithInput;

type ScriptRunner = (args: Record<string, unknown> | [],
    inputs: unknown[],
    opts?: ProcessOptions) => ProcessPromise<unknown>;

/**
 * A wrapper to curry 'execute' for argument 'processPath'
 * @param processPath
 */
export function create(processPath: string): { execute: ScriptRunner } {
    const runner = (args?: Record<string, unknown> | [], inputs?: unknown[], opts?: ProcessOptions)
        : ProcessPromise<unknown> => {
        return executeWithInput(processPath, args, inputs, opts);
    };
    return {
        execute: runner
    };
}
