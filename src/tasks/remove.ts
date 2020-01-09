import chalk from 'chalk';
import { remove } from 'fs-extra';

export const removeDef = {
    spec: {},
    'default': {},
    options: (args) => ({
        dir: args._[0]  // TODO a list of directories?
    }),
    questions: (options) => {
        const questions = [];
        if(!options.dir) {
            questions.push({
                type: 'input',
                name: 'dir',
                message: "Please fill in the directory to remove",
                validate: (input: string) => (input && input.trim()) ? true : "A directory is required"
            });
        }
        return questions;
    }
};

/**
 * Wrapper for node-fs-exta remove function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md
 */
export function fseRemove ({ dir }: { dir: string }) {
    console.info('Be gone rapscalian...');

    remove(dir, error => {
        if (error) {
            return console.error(`${chalk.red.bold('ERROR')} thrown while emptying directory: `, error);
        }
    });

    console.info(`Directory ${dir} gone.`);
}
