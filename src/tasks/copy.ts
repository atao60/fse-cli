import chalk from 'chalk';
import { copy, CopyOptions } from 'fs-extra';

const copyDef = {
    name: 'copy',
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
    options: (args: { _: unknown[] }): {} => {
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
    questions: (options: { [_: string]: unknown }): {}[] => {
        const questions = [];
        if (!options.src) {
            questions.push({
                type: 'input',
                name: 'src',
                message: "Please fill in the source to copy",
                validate: (input: string) => (input && input.trim()) ? true : "A source file or directory is required"
            });
        }
        if (!options.dest) {
            questions.push({
                type: 'input',
                name: 'dest',
                message: "Please fill in the destination of the copy",
                validate: (input: string) => (input && input.trim()) ? true : "A destination directory is required"
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

export const def = copyDef;

interface CliCopyOptions extends CopyOptions {
    askAll?: boolean;
    keepExisting?: boolean;
}

/**
 * Wrapper for node-fs-exta copy function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
 */
export function job ({ src, dest, ...copyOptions }:
    { src: string; dest: string; copyOptions: { [_: string]: unknown } }): void {

    const otherOptions = copyOptions as CliCopyOptions;
    const showAll = otherOptions.askAll;

    otherOptions.overwrite = !otherOptions.keepExisting;
    delete otherOptions.keepExisting;
    delete otherOptions.askAll;

    console.info(`Copying file or directory ... from '${src}' to '${dest}'${showAll ? " with options: " : "."}`);
    if (showAll) {
        for (const o of Object.entries(otherOptions)) {
            console.info(`- ${o[0]}: ${o[1]}`);
        }
    }

    function mainMessageFromError (error: Error | string | { code: string; syscall: string; path: string }): string {
        const msg = error.toString();
        const groups = msg.match(/^\s*Error\s*:\s*(.*?\s+already\s+exists\s*)$/);
        if (groups) {
            return groups[1];
        }
        // only if under Linux 
        // TODO what about other os?
        const linuxError = error as { code: string; syscall: string; path: string };
        if (linuxError.code === 'EISDIR' && linuxError.syscall === 'unlink') {
            return `it seems your're trying to copy a file on the directory '${linuxError.path}'`
                + ', which is not allowed';
        }
    }

    copy(src, dest, otherOptions, error => {
        if (!error) {
            console.info('Copy complete...');
            return;
        }
        const mainMsg = mainMessageFromError(error) || error;
        return console.error(`${chalk.red.bold('ERROR')} thrown while copying file or directory: `, mainMsg);
    });

}
