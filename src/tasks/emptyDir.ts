import { red } from 'chalk';
import { emptyDir } from 'fs-extra';

const emptyDirDef = {
    name: 'emptyDir',
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
                message: "Please fill in the directory to clean up",
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
export function job ({ dir: directory }: { dir: string }): void {
    console.info(`Cleaning up directory ${directory} ...`);
    
    emptyDir(directory, error => {
        if (error) {
            console.error(`${red.bold('ERROR')} thrown while emptying directory: `, error);
            return;
        }
        console.info(`Directory ${directory} emptied.`);
    });
}
