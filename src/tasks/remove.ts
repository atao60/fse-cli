import { red } from 'chalk';
import { remove } from 'fs-extra';

const removeDef = {
    name: 'remove',
    spec: {},
    'default': {},
    options: (args: { _: unknown[] }): Record<string, unknown> => ({
        dir: args._[0]  // TODO a list of files or directories?
    }),
    questions: (options: { dir: unknown }): Record<string, unknown>[] => {
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
 * Wrapper for node-fs-exta remove function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/remove.md
 */
export function job ({ dir }: { dir: string }): void {
    console.info(`Removing directory ${dir} ...`);

    remove(dir, error => {
        if (error) {
            console.error(`${red.bold('ERROR')} thrown while removing file or directory: `, error);
            return;
        }
        console.info(`File or directory ${dir} gone.`);
    });

}
