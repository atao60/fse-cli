import { red } from 'chalk';
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
    options: (args: { _: unknown[] }): Record<string, unknown> => {
        return {
            askAll: args['--all'] || false,
            overwrite: args['--overwrite'] || moveDef.default.overwrite,
            src: args._[0],   // TODO a list of directories to put in the same destination?
            dest: args._[1]
        };
    },
    questions: (options: { [_: string]: unknown }): Record<string, unknown>[] => {
        const questions: Record<string, unknown>[] = [];
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
        if (!options.overwrite) {
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

interface CliMoveOptions extends MoveOptions {
    askAll?: boolean;
}

/**
 * Wrapper for node-fs-exta move function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md
 */
export function job ({ src, dest, ...moveOptions }:
    { src: string; dest: string; moveOptions: { [_: string]: unknown } }): void {

    const otherOptions = moveOptions as CliMoveOptions; 
    const showAll = otherOptions.askAll;
    delete otherOptions.askAll;

    console.info(`Moving file or directory... from '${src}' to '${dest}'${showAll ? " with options: " : "."}`);
    if (showAll) {
        for (const o of Object.entries(otherOptions)) {
            const key = o[0];
            const value = JSON.stringify(o[1]);
            console.info(`- ${key}: ${value}`);
        }
    }

    function mainMessageFromError (error: Error | string): string {
        const msg = error.toString();
        const groups = /^\s*Error\s*:\s*(.*?\s+dest\s+already\s+exists.\s*)$/.exec(msg);
        if (!groups) {
            return null;
        }
        return groups[1];
    }

    move(src, dest, otherOptions, error => {
        if (!error) {
            console.info('Move complete...');
            return;
        }
        const mainMsg = mainMessageFromError(error) || error;
        return console.error(`${red.bold('ERROR')} thrown while moving file or directory: `, mainMsg);
    });

}
