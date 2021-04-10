import { existsSync, readFileSync } from 'fs-extra';
import { join } from 'path';
import chalk, { Chalk } from 'chalk';
import terminalLink from 'terminal-link';

import { job as version } from './version';
import { info } from '../logger';

const versionDef = {
    name: 'help',
    spec: {},
    'default': {},
    options: (_: { _: unknown[] }): Record<string, unknown> => ({}),
    questions: (_: { [_: string]: unknown }): Record<string, unknown>[] => []
};

export const def = versionDef;

export function job(): void {
    version();
    info('');
    showHelp();
}

function showHelp() {
    const manualPath = join(__dirname, '../../USAGE');

    if (!existsSync(manualPath)) {
        throw new Error(`Unable to find the usage file: ${manualPath}`);
    }

    const content = readFileSync(manualPath, { encoding: 'utf8' });

    const usage = content
        .replace(/^(.*)$/m, (m: string) => {
            return chalk.bold(m);
        })
        .replace(/(?<!`)`([^`]+)`(?!`)/gm, '%%%yellow:$1%%%')
        .replace(/(?<!\*)\*{3}([^*]+)\*{3}(?!\*)/gm, '%%%bold.italic:$1%%%')
        .replace(/%%%([A-Za-z.]*):(.*?)%%%/gm, (_match, property: string, value: string, _offset, _source): string => {
            // styles provided with first parameter are taken in account as it
            const styles: string[] = property.split('.');
            const styling = styles.reduce((o: Chalk, i: string) => {
                return (o as unknown as {[key: string]: Chalk})[i];
            }, chalk);
            return styling(value);
        })
        .replace(/(?<!\[)\[(.*?)\]\((.*?)\)/gm, (_match, title: string, url: string, _offset, _source) => {
            const link = terminalLink(title, url);
            return chalk.blue(link);
        });
    info(usage);

}