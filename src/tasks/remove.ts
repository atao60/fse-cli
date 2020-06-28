import { red } from 'chalk';
import { remove } from 'fs-extra';

const removeDef = {
    name: 'remove',
    spec: {},
    'default': {},
    options: (args: { _: unknown[] }): Record<string, unknown> => ({
        dir: args._[0]  // TODO a list of directories?
    }),
    questions: (options: { dir: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
        if (!options.dir) {
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

export const def = removeDef;

/**
 * Wrapper for node-fs-exta remove function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md
 */
export function job ({ dir }: { dir: string }): void {
    console.info('Be gone rapscalian...');

    remove(dir, error => {
        if (error) {
            return console.error(`${red.bold('ERROR')} thrown while emptying directory: `, error);
        }
        console.info(`Directory ${dir} gone.`);
    });

}
