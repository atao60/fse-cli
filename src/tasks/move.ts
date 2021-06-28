import chalk from 'chalk';
const { red } = chalk;
import { move, MoveOptions } from 'fs-extra';
import { env } from 'process';

const quietDefault = env.FSE_CLI_QUIET && env.FSE_CLI_QUIET === 'true';

import * as logger from '../logger.js';

const moveDef = {
    name: 'move',
    spec: {
        '--all': Boolean,
        '--overwrite': Boolean,
        '--quiet': Boolean,
        '-a': '--all',
        '-o': '--overwrite',
        '-q': '--quiet'
    },
    'default': {
        overwrite: false,
        quiet: quietDefault
    },
    options: (args: { _: unknown[], [key: string]: unknown }): Record<string, unknown> => {
        return {
            askAll: args['--all'] || false,
            overwrite: args['--overwrite'] || moveDef.default.overwrite,
            quiet: args['--quiet'] || moveDef.default.quiet,
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
                validate: (input: string) => (input && input.trim()) ? true : "A source is required"
            });
        }
        if (!options.dest) {
            questions.push({
                type: 'input',
                name: 'dest',
                message: "Please fill in the destination of the move",
                validate: (input: string) => (input && input.trim()) ? true : "A destination is required"
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
        if (!options.quiet) {
            questions.push({
                type: 'confirm',
                name: 'quiet',
                message: 'Toggle to quiet mode?',
                default: moveDef.default.quiet
            });
        }
        return questions;
    }
};

export const def = moveDef;

interface CliMoveOptions extends MoveOptions {
    askAll?: boolean;
    quiet?: boolean;
}

/**
 * Wrapper for node-fs-extra move function.
 * https://github.com/jprichardson/node-fs-extra/blob/master/docs/move.md
 */
export function job ({ src, dest, ...moveOptions }:
    { src: string; dest: string; moveOptions: { [_: string]: unknown } }): void {

    const otherOptions = moveOptions as CliMoveOptions; 
    const showAll = otherOptions.askAll;
    const quiet = otherOptions.quiet;
    
    delete otherOptions.askAll;
    delete otherOptions.quiet;

    function info(message: string, ...params: unknown[]) {
        logger.info(message, { quiet, params });
    }

    function error(message: string, ...params: unknown[]) {
        logger.error(message, { quiet, params });
    }

    info(`Moving file or directory... from '${src}' to '${dest}'${showAll ? " with options: " : "."}`);
    if (showAll) {
        for (const o of Object.entries(otherOptions)) {
            const key = o[0];
            const value = JSON.stringify(o[1]);
            info(`- ${key}: ${value}`);
        }
    }

    function mainMessageFromError (error: Error | string): string {
        const msg = error.toString();
        const groups = /^\s*Error\s*:\s*(.*?\s+dest\s+already\s+exists.\s*)$/.exec(msg);
        if (!groups) {
            return undefined as unknown as string;
        }
        return groups[1];
    }

    move(src, dest, otherOptions, err => {

        if (err) {
            const mainMsg = mainMessageFromError(err) || err;
            error(`${red.bold('ERROR')} thrown while moving file or directory: `, mainMsg);
            return;
        }
        info('Move complete...');
        return;
    });

}
