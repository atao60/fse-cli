/** Extract @atao60/fse-cli & fs-extra versions from npm-shrinkwrap.json
  * to put them in file RELEASE.json
  */

import { writeFileSync } from 'fs';

import { version, dependencies } from '../npm-shrinkwrap.json';

const release = {
    fse_cli_version: version,
    fs_extra_version: dependencies['fs-extra'].version
};

writeFileSync('RELEASE.json', JSON.stringify(release, null, 2).replace(/$/, '\n'));