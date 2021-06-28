import chalk from 'chalk';
const { red } = chalk;
import fse from 'fs-extra';
const { ensureFile } = fse;
import { env } from 'process';

import * as logger from '../logger.js';

const quietDefault = env.FSE_CLI_QUIET && env.FSE_CLI_QUIET === 'true';

const ensureFileDef = {
    name: 'ensureFile',
    spec: {
        '--quiet': Boolean,
        '-q': '--quiet'
    },
    'default': {
        quiet: quietDefault
    },
    options: (args: { _: unknown[], [key: string]: unknown }): Record<string, unknown> => ({
        quiet: args['--quiet'] || ensureFileDef.default.quiet,
        file: args._[0]
    }),
    questions: (options: { file: unknown, quiet: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
        if (!options.file) {
            questions.push({
                type: 'input',
                name: 'file',
                message: "Please fill in the file to create",
                validate: (input: string) => (input && input.trim()) ? true : "A file path is required"
            });
        }
        return questions;
    }
};

export const def = ensureFileDef;

/**
 * Wrapper for node-fs-extra ensureFile function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md
 */
export function job ({ file, quiet }: { file: string; quiet: boolean }): void {

    function info(message: string, ...params: unknown[]) {
        logger.info(message, { quiet, params });
    }

    function error(message: string, ...params: unknown[]) {
        logger.error(message, { quiet, params });
    }

    info(`Checking if existing and, if not, creating file ${file} ...`);

    ensureFile(file, err => {
        if (err) {
            error(`${red.bold('ERROR')} thrown while creating file: `, err);
            return;
        }
        info(`File ${file} exists`);
    });
}
