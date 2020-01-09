import chalk from 'chalk';
import { ensureFile } from 'fs-extra';

export const ensureFileDef = {
    spec: {},
    'default': {},
    options: (args) => ({
        file: args._[0]
    }),
    questions: (options) => {
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

/**
 * Wrapper for node-fs-exta ensureFile function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureFile.md
 */
export function fseEnsureFile ({ file }: { file: string }) {

    console.info(`Checking if existing and, if not, creating file ${file} ...`);

    ensureFile(file, error => {
        if (error) {
            return console.error(`${chalk.red.bold('ERROR')} thrown while creating: `, error);
        }
    });

    console.info(`File ${file} created`);
}
