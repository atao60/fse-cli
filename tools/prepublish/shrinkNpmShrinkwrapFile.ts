/**
 *   There is no Npm public API. See https://github.com/npm/public-api.
 *   Then using Npm CLI.
 */
import { SpawnOptions } from 'child_process';
import { spawn } from 'cross-spawn';

const PACKAGE_MANAGER = 'npm';

function createProcess(command: string, commandArgs: string[], publishPath: string) {
    const options: SpawnOptions = {
        stdio: 'inherit',
        cwd: publishPath
    };
    return spawn(command, commandArgs, options);
}

function execute(commandArgs: string[], publishPath: string) {
    return new Promise((resolve, reject) => {
        console.log(`\nRunning '${PACKAGE_MANAGER} ${commandArgs.join(' ')}'`);
        createProcess(PACKAGE_MANAGER, commandArgs, publishPath)
            .on('close', (code, signal) => {
                resolve({ code, signal });
            })
            .on('error', reject);
    });
}

export const shrinkNpmShrinkwrapFile = async (publishPath: string): Promise<void> => {
    await execute(['ci'], publishPath);
    await execute(['dedupe'], publishPath);
    await execute(['prune', '--production'], publishPath);
    await execute(['shrinkwrap'], publishPath);
};