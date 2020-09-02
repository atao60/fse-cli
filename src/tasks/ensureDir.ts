import { red } from 'chalk';
import { ensureDir } from 'fs-extra';

const ensureDirDef = {
    name: 'ensureDir',
    spec: {
        '--all': Boolean,
        '--mode': Number, // let fse check it's a valid number
        '-a': '--all',
        '-m': '--mode'
    },
    'default': {
        mode: undefined
    },
    options: (args: { _: unknown[] }): Record<string, unknown> => ({
        askAll: args['--all'] || false,
        mode: args['--mode'] || ensureDirDef.default.mode,
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
        return questions;
    }
};

export const def = ensureDirDef;

/**
 * Wrapper for node-fs-exta ensureDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md
 */
export function job ({ dir: directory, mode }:
    { dir: string; mode: number }): void {

    console.info(`Checking if existing and, if not, creating directory ${directory} ...`);

    ensureDir(directory, mode, error => {
        if (error) {
            return console.error(`${red.bold('ERROR')} thrown while creating directory: `, error);
        }
        console.info(`Directory ${directory} exists.`);
    });
}
