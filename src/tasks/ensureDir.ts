import chalk from 'chalk';
import { ensureDir } from 'fs-extra';

export const ensureDirDef = {
    spec: {
        '--all': Boolean,
        '--mode': Number, // let fse check it's a valid number
        '-a': '--all',
        '-m': '--mode'
    },
    'default': {
        mode: undefined
    },
    options: (args) => ({
        askAll: args['--all'] || false,
        mode: args['--mode'] || ensureDirDef.default.mode,
        dir: args._[0]
    }),
    questions: (options) => {
        const questions = [];
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

/**
 * Wrapper for node-fs-exta ensureDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md
 */
export function fseEnsureDir ({ dir: directory, mode }:
    { dir: string; mode: number }) {

    console.info(`Checking if existing and, if not, creating directory ${directory} ...`);

    ensureDir(directory, mode, error => {
        if (error) {
            return console.error(`${chalk.red.bold('ERROR')} thrown while emptying directory: `, error);
        }
    });

    console.info(`Directory ${directory} created`);
}
