import { copy, CopyOptions } from 'fs-extra';

export const copyDef = {
    spec: {
        '--all': Boolean,
        '--keepExisting': Boolean,
        '--errorOnExist': Boolean,
        '--dereference': Boolean,
        '--preserveTimestamps': Boolean,
        '-a': '--all',
        '-k': '--keepExisting',
        '-e': '--errorOnExist',
        '-d': '--dereference',
        '-p': '--preserveTimestamps'
    },
    'default': {
        keepExisting: false,
        errorOnExist: false,
        dereference: false,
        preserveTimestamps: false
    },
    options: (args) => {
        return {
            askAll: args['--all'] || false,
            keepExisting: args['--keepExisting'] || copyDef.default.keepExisting,
            errorOnExist: args['--errorOnExist'] || copyDef.default.errorOnExist,
            dereference: args['--dereference'] || copyDef.default.dereference,
            preserveTimestamps: args['--preserveTimestamps'] || copyDef.default.preserveTimestamps,
            src: args._[0],   // TODO a list of directories to put in the same destination?
            dest: args._[1]
        };
    },
    questions: (options) => {
        const questions = [];
        if (!options.src) {
            questions.push({
                type: 'input',
                name: 'src',
                message: "Please fill in the source to copy",
                validate: (input: string) => {
                    const result = (input && input.trim()) ? true : "A directory is required";
                    console.log("copy questions validate input & result: ", input, result);
                    return result;
                }
            });
        }
        if (!options.dest) {
            questions.push({
                type: 'input',
                name: 'dest',
                message: "Please fill in the destination of the copy",
                validate: (input: string) => (input && input.trim()) ? true : "A directory is required"
            });
        }
        if (!options.askAll) { return questions; }
        if (!options.keepExisting) {
            questions.push({
                type: 'confirm',
                name: 'keepExisting',
                message: 'Keep existing files?',
                default: copyDef.default.keepExisting
            });
        }
        if (!options.errorOnExist) {
            questions.push({
                type: 'confirm',
                name: 'errorOnExist',
                when: answers => !answers.keepExisting,
                message: 'When the destination exists, throw an error?',
                default: copyDef.default.errorOnExist
            });
        }
        if (!options.dereference) {
            questions.push({
                type: 'confirm',
                name: 'dereference',
                message: 'Dereference symlinks?',
                default: copyDef.default.dereference
            });
        }
        if (!options.preserveTimestamps) {
            questions.push({
                type: 'confirm',
                name: 'preserveTimestamps',
                message: 'Keep last modification and access times?',
                default: copyDef.default.preserveTimestamps
            });
        }
        return questions;
    }
};

/**
 * Wrapper for node-fs-exta copy function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
 */
// export function fseCopy ({ src, dest, ...otherOptions }: { src: string, dest: string, otherOptions: CopyOptions }) {
export function fseCopy ({ src, dest, ...otherOptions }: 
    { src: string; dest: string; otherOptions: { [tag: string]: any } }) {

    const showAll = (otherOptions as any).askAll;

    (otherOptions as any).overwrite = !(otherOptions as any).keepExisting; 
    delete ((otherOptions as any).keepExisting);
    delete ((otherOptions as any).askAll);

    console.info(`Copying files/folders... from '${src}' to '${dest}'${showAll ? " with options: " : "." }`);
    if (showAll) {
        for(const o of Object.entries(otherOptions)) {
            console.info(`- ${o[0]}: ${o[1]}`);
        }
    }

    copy(src, dest, otherOptions as CopyOptions, error => {
        if (error) {
            return console.error('Error thrown while copying directory: ', error);
        }
    });

    console.info('Copy complete...');
}
