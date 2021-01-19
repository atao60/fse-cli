import { fse_cli_version, fs_extra_version} from '../../RELEASE.json';

const versionDef = {
    name: 'version',
    spec: {},
    'default': {},
    options: (_: { _: unknown[] }): Record<string, unknown> => ({}),
    questions: (_: { [_: string]: unknown }): Record<string, unknown>[] => []
};

export const def = versionDef;

export function job(): void {
    console.log(`@atao60/fse-cli ${ fse_cli_version } (fs-extra ${ fs_extra_version })`);
}
