import chalk from 'chalk';
import { emptyDir } from 'fs-extra';

const emptyDirDef = {
    name: 'emptyDir',
    spec: {},
    options: (args: { _: unknown[] }): Record<string, unknown> => ({
        dir: args._[0]  // TODO a list of directories?
    }),
    questions: (options: { dir: unknown }): Record<string, unknown>[] => {
        const questions = [];
        if (!options.dir) {
            questions.push({
                type: 'input',
                name: 'dir',
                message: "Please fill in the directory to check",
                validate: (input: string) => (input && input.trim()) ? true : "A directory is required"
            });
        }
        return questions;
    }
};

export const def = emptyDirDef;

/**
 * Wrapper for node-fs-exta emptyDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md
 */
export function job ({ directory }: { directory: string }): void {
    console.info('Be gone rapscalian...');

    emptyDir(directory, error => {
        if (error) {
            return console.error(`${chalk.red.bold('ERROR')} thrown while emptying directory: `, error);
        }
        console.info(`Directory ${directory} gone.`);
    });
}
