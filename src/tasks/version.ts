import { version, dependencies } from '../../npm-shrinkwrap.json';

const versionDef = {
    name: 'version',
    spec: {},
    'default': {},
    options: (_: { _: unknown[] }): Record<string, unknown> => ({}),
    questions: (_: { [_: string]: unknown }): Record<string, unknown>[] => []
};

export const def = versionDef;

export function job(): void {
    console.log(`@atao60/fse-cli ${version} (fs-extra ${dependencies['fs-extra'].version})`);
}

