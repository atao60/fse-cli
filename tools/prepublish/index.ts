/** Publish from an expurged copy of the project
 *  
 */
import { join } from 'path';
import { argv, env } from 'process';

import { resetPublishFolder } from './resetPublishFolder';
import { shrinkPackageConfig } from './shrinkPackageConfig';
import { copyEmbeddableFiles } from './copyEmbeddableFiles';
import { shrinkNpmShrinkwrapFile } from './shrinkNpmShrinkwrapFile';

const PACKAGE_JSON_FILE_NAME = 'package.json';
const PATH_SEP = ':';

const extraEmbeddableFilePaths = (() => {
    const pathList = argv.slice(4).filter(a => a && a.trim()).map(a => a.trim());
    if (pathList.length < 1 && env.EXTRA_PATHS && env.EXTRA_PATHS.trim()) {
        const extraPaths = env.EXTRA_PATHS.split(PATH_SEP).filter(a => a && a.trim()).map(a => a.trim());
        pathList.push(...extraPaths);
    }
    return Object.freeze(pathList);
})();

const rootPath = (() => {
    const dirpath = argv[3] || (env.ROOT_PATH && env.ROOT_PATH.trim() ? env.ROOT_PATH.trim() : '.');
    return join(__dirname, dirpath);
})();

const publishPath = ((rootpath) => {
    const dirpath = argv[2] || (env.PUBLISH_PATH && env.PUBLISH_PATH.trim() ? env.PUBLISH_PATH.trim() : 'publish');
    return join(rootpath, dirpath);
})(rootPath);

void (async () => {
    await resetPublishFolder(publishPath);
    await copyEmbeddableFiles(rootPath, publishPath, extraEmbeddableFilePaths);
    await shrinkPackageConfig(PACKAGE_JSON_FILE_NAME, publishPath);
    await shrinkNpmShrinkwrapFile(publishPath);
})();
