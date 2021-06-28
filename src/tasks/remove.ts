import chalk from 'chalk';
const { red } = chalk;
import { remove } from 'fs-extra';
import { env } from 'process';

const quietDefault = env.FSE_CLI_QUIET && env.FSE_CLI_QUIET === 'true';

import * as logger from '../logger.js';

const removeDef = {
    name: 'remove',
    spec: {
        '--quiet': Boolean,
        '-q': '--quiet'
    },
    'default': {
        quiet: quietDefault
    },
    options: (args: { _: unknown[], [key: string]: unknown }): Record<string, unknown> => ({
        quiet: args['--quiet'] || removeDef.default.quiet,
        dir: args._[0]  // TODO a list of files or directories?
    }),
    questions: (options: { dir: unknown; quiet: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
        if (!options.dir) {
            questions.push({
                type: 'input',
                name: 'dir',
                message: "Please fill in the file or directory to remove",
                validate: (input: string) => (input && input.trim()) ? true : "A file or directory is required"
            });
        }
        return questions;
    }
};

export const def = removeDef;

/**
 * Wrapper for node-fs-extra remove function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md
 */
export function job ({ dir, quiet }: { dir: string; quiet?: boolean }): void {

    function info(message: string, ...params: unknown[]) {
        logger.info(message, { quiet, params });
    }

    function error(message: string, ...params: unknown[]) {
        logger.error(message, { quiet, params });
    }

    info(`Removing directory ${dir} ...`);

    remove(dir, err => {
        if (err) {
            error(`${red.bold('ERROR')} thrown while removing file or directory: `, err);
            return;
        }
        info(`File or directory ${dir} removed.`);
    });

}
