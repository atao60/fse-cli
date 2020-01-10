import chalk from 'chalk';
import { move, MoveOptions } from 'fs-extra';

const moveDef = {
    name: 'move',
    spec: {
        '--all': Boolean,
        '--overwrite': Boolean,
        '-a': '--all',
        '-o': '--overwrite'
    },
    'default': {
        overwrite: false
    },
    options: (args) => {
        return {
            askAll: args['--all'] || false,
            overwrite: args['--overwrite'] || moveDef.default.overwrite,
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
                message: "Please fill in the source to move",
                validate: (input: string) => (input && input.trim()) ? true : "A source directory is required"
            });
        }
        if (!options.dest) {
            questions.push({
                type: 'input',
                name: 'dest',
                message: "Please fill in the destination of the move",
                validate: (input: string) => (input && input.trim()) ? true : "A destination directory is required"
            });
        }
        if (!options.askAll) { return questions; }
        if (!options.keepExisting) {
            questions.push({
                type: 'confirm',
                name: 'overwrite',
                message: 'Overwrite existing files?',
                default: moveDef.default.overwrite
            });
        }
        return questions;
    }
};

export const def = moveDef;

/**
 * Wrapper for node-fs-exta move function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md
 */
export function job ({ src, dest, ...otherOptions }:
    { src: string; dest: string; otherOptions: { [tag: string]: any } }) {

    const showAll = (otherOptions as any).askAll;

    delete ((otherOptions as any).askAll);

    console.info(`Moving file or directory... from '${src}' to '${dest}'${showAll ? " with options: " : "."}`);
    if (showAll) {
        for (const o of Object.entries(otherOptions)) {
            console.info(`- ${o[0]}: ${o[1]}`);
        }
    }

    function mainMessageFromError (error: Error | string): string {
        const msg = error.toString();
        const groups = msg.match(/^\s*Error\s*:\s*(.*?\s+dest\s+already\s+exists.\s*)$/);
        if (!groups) {
            return null;
        }
        return groups[1];
    }

    move(src, dest, otherOptions as MoveOptions, error => {
        if (!error) {
            console.info('Move complete...');
            return;
        }
        const mainMsg = mainMessageFromError(error) || error;
        return console.error(`${chalk.red.bold('ERROR')} thrown while moving file or directory: `, mainMsg);
    });

}
