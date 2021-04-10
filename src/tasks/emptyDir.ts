import { red } from 'chalk';
import { emptyDir } from 'fs-extra';
import { env } from 'process';

import * as logger from '../logger';

const quietDefault = env.FSE_CLI_QUIET && env.FSE_CLI_QUIET === 'true';

const emptyDirDef = {
    name: 'emptyDir',
    spec: {
        '--quiet': Boolean,
        '-q': '--quiet'
    },
    'default': {
        quiet: quietDefault
    },
    options: (args: { _: unknown[], [key: string]: unknown }): Record<string, unknown> => ({
        quiet: args['--quiet'] || emptyDirDef.default.quiet,
        dir: args._[0]  // TODO a list of directories?
    }),
    questions: (options: { dir: unknown; quiet: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
        if (!options.dir) {
            questions.push({
                type: 'input',
                name: 'dir',
                message: "Please fill in the directory to clean up",
                validate: (input: string) => (input && input.trim()) ? true : "A directory is required"
            });
        }
        return questions;
    }
};

export const def = emptyDirDef;

/**
 * Wrapper for node-fs-extra emptyDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md
 */
export function job ({ dir: directory, quiet }: 
    { dir: string; quiet: boolean; }): void {

    function info(message: string, ...params: unknown[]) {
        logger.info(message, { quiet, params });
    }

    function error(message: string, ...params: unknown[]) {
        logger.error(message, { quiet, params });
    }

    info(`Cleaning up directory ${directory} ...`);
    
    emptyDir(directory, err => {
        if (err) {
            error(`${red.bold('ERROR')} thrown while emptying directory: `, err);
            return;
        }
        info(`Directory ${directory} emptied.`);
    });
}
