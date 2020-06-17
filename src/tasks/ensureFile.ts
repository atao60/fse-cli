import chalk from 'chalk';
import { ensureFile } from 'fs-extra';

const ensureFileDef = {
    name: 'ensureFile',
    spec: {},
    'default': {},
    options: (args: { _: unknown[] }): Record<string, unknown> => ({
        file: args._[0]
    }),
    questions: (options: { file: unknown }): Record<string, unknown>[] => {
        const questions = [];
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
 * Wrapper for node-fs-exta ensureFile function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md
 */
export function job ({ file }: { file: string }): void {

    console.info(`Checking if existing and, if not, creating file ${file} ...`);

    ensureFile(file, error => {
        if (error) {
            return console.error(`${chalk.red.bold('ERROR')} thrown while creating: `, error);
        }
        console.info(`File ${file} created`);
    });
}
