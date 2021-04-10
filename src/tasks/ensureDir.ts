import { red } from 'chalk';
import { ensureDir } from 'fs-extra';
import { env } from 'process';

import * as logger from '../logger';

const quietDefault = env.FSE_CLI_QUIET && env.FSE_CLI_QUIET === 'true';

const ensureDirDef = {
    name: 'ensureDir',
    spec: {
        '--all': Boolean,
        '--mode': Number, // let fse check it's a valid number
        '--quiet': Boolean,
        '-a': '--all',
        '-m': '--mode',
        '-q': '--quiet'
    },
    'default': {
        mode: undefined,
        quiet: quietDefault
    },
    options: (args: { _: unknown[], [key: string]: unknown }): Record<string, unknown> => ({
        askAll: args['--all'] || false,
        mode: args['--mode'] || ensureDirDef.default.mode,
        quiet: args['--quiet'] || ensureDirDef.default.quiet,
        dir: args._[0]
    }),
    questions: (options: { [_: string]: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
        if (!options.dir) {
            questions.push({
                type: 'input',
                name: 'dir',
                message: "Please fill in the directory to check",
                validate: (input: string) => (input && input.trim()) ? true : "A directory is required"
            });
        }

        if (!options.askAll) { return questions; }

        if (!options.mode) {
            questions.push({
                type: 'input',
                name: 'mode',
                message: 'Please fill in directory mode to set up',
                default: ensureDirDef.default.mode
            });
        }
        if (!options.quiet) {
            questions.push({
                type: 'confirm',
                name: 'quiet',
                message: 'Toggle to quiet mode?',
                default: ensureDirDef.default.quiet
            });
        }
        return questions;
    }
};

export const def = ensureDirDef;

// interface CliEnsureOptions extends EnsureOptions {
//     quiet?: boolean;
// }

/**
 * Wrapper for node-fs-extra ensureDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md
 */
export function job ({ dir: directory, mode, quiet }:
    { dir: string; mode: number; quiet?: boolean }): void {

    function info(message: string, ...params: unknown[]) {
        logger.info(message, { quiet, params });
    }

    function error(message: string, ...params: unknown[]) {
        logger.error(message, { quiet, params });
    }

    info(`Checking if existing and, if not, creating directory ${directory} ...`);

    ensureDir(directory, mode, err => {
        if (err) {
            error(`${red.bold('ERROR')} thrown while creating directory: `, err);
            return;
        }
        info(`Directory ${directory} exists.`);
    });
}
