import { emptyDir } from 'fs-extra';

export const emptyDirDef = {
    spec: { },
    options: (args) => ({
        dir: args._[0]  // TODO a list of directories?
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
        return questions;
    }
};

/**
 * Wrapper for node-fs-exta emptyDir function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/emptyDir.md
 */
export function fseEmptyDir ({ directory }: { directory: string }) {
    console.info('Be gone rapscalian...');

    emptyDir(directory, error => {
        if (error) {
            return console.error('Error thrown while emptying directory: ', error);
        }
    });

    console.info(`Directory ${directory} gone.`);
}
