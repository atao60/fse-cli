import fse from 'fs-extra';
const { existsSync, readFileSync } = fse;
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import * as logger from '../logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const versionDef = {
    name: 'version',
    spec: {},
    'default': {},
    options: (_: { _: unknown[] }): Record<string, unknown> => ({}),
    questions: (_: { [_: string]: unknown }): Record<string, unknown>[] => []
};

const shrinkwrapPath = join(__dirname, '../../npm-shrinkwrap.json');
const packagelockPath = join(__dirname, '../../package-lock.json');

export const def = versionDef;

export function job(): void {
    const packagePath = existsSync(shrinkwrapPath) ? shrinkwrapPath : packagelockPath;
    const content = readFileSync(packagePath, { encoding: 'utf8' });
    const { version, dependencies } = JSON.parse(content);
    const cliVersion = version as string;
    const libVersion = (dependencies as {[_:string]: {version: string}})['fs-extra'].version;

    logger.info(`@atao60/fse-cli ${cliVersion} (fs-extra ${libVersion})`);
}
