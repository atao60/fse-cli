import { join } from 'path';
import { env } from 'process';
import { uniq } from 'lodash';
import { copySync, pathExistsSync, readFile } from 'fs-extra';
import { default as klaw } from 'klaw';
import { makeRe } from 'micromatch';

const PACKAGE_JSON_FILE_NAME = 'package.json';
const PACKAGE_LOCK_JSON_FILE_NAME = 'package-lock.json';

const GIT_IGNORE_FILE_NAME = '.gitignore';
const encoding = 'utf-8';

// Ref.:
// npm Docs - package.json - files
// https://docs.npmjs.com/cli/v6/configuring-npm/package-json#files
// Some files are always included, regardless of settings, see MANDATORY_FILES below.
//
// Conversely, some files are always ignored, see IGNORED_PATHS below.

const MANDATORY_FILES = Object.freeze({
    // README, CHANGES, LICENSE & NOTICE can have any case and extension.
    [PACKAGE_JSON_FILE_NAME]: { case: false, ext: false },
    'README': { case: true, ext: true },
    'CHANGES': { case: true, ext: true },
    'CHANGELOG': { case: true, ext: true },
    'HISTORY': { case: false, ext: false },
    'LICENSE': { case: true, ext: true },
    'LICENCE': { case: true, ext: true },
    'NOTICE': { case: true, ext: true }
    // The file in the "main" field
});

const IGNORED_PATHS = [
    '.git',
    'CVS',
    '.svn',
    '.hg',
    '.lock-wscript',
    '.wafpickle-N',
    '.DS_Store',
    'npm-debug.log',
    '.npmrc',
    'node_modules',
    'config.gypi',
    PACKAGE_LOCK_JSON_FILE_NAME // (use shrinkwrap instead)
    // All files containing a * character (incompatible with Windows)
];

const npmPackageFiles = Object.entries(env)
    .filter(([k, _v]) => k.startsWith('npm_package_files_'))
    .map(([_k, v]) => v);

function trimSlash(s: string) {
    const startingAt = s.startsWith('./') ? './'.length : 0;
    const endingAt = s.endsWith('/') ? -('/'.length) : undefined;
    return s.slice(startingAt, endingAt)
}

function embeddableFilePaths(extraFilePaths: Readonly<string[]>) {

    // 'package-lock.json' will be used to create a file npm-shrinkwrap.json, see createNpmShrinkwrapFile.ts
    const extraFiles = [...extraFilePaths, PACKAGE_LOCK_JSON_FILE_NAME]
        .map(trimSlash)
        .reduce((pathList, p) => {
            pathList[p] = { case: false, ext: false };
            return pathList;
        }, {} as { [_: string]: { case: boolean, ext: boolean } });

    const npmPackageMain = trimSlash(env.npm_package_main);
    const mainField = { [npmPackageMain]: { case: false, ext: false } };

    const filesField = npmPackageFiles
        .map(trimSlash)
        .reduce((pathList, p) => {
            pathList[p] = { case: false, ext: false };
            return pathList;
        }, {} as { [_: string]: { case: boolean, ext: boolean } });

    const embeddableFiles: { [_: string]: { case: boolean, ext: boolean } } = {
        ...MANDATORY_FILES,
        ...extraFiles,
        ...mainField,
        ...filesField
    };

    return Object.freeze(embeddableFiles);
};

function searchPaths(searchableFileList: string[], flags: { case: boolean, ext: boolean }, rootPath: string, searchedName: string) {
    const anyCase = flags.case ? 'i' : null;
    const anyFileExt = flags.ext ? '(|\.[^.]+$)' : '';
    const pattern = new RegExp(['^', searchedName, anyFileExt].join(''), anyCase);
    const rootPathLength = rootPath.length + (rootPath.endsWith('/') ? 0 : 1);

    const validPathList = searchableFileList
        .map(p => p.slice(rootPathLength))
        .filter(p => {
            return pattern.test(p);
        });
    return validPathList;
}

function checkPath(rootPath: string, filePath: string) {
    const fileFullPath = join(rootPath, filePath);
    const validPath = (pathExistsSync(fileFullPath)) ? fileFullPath : '';
    const rootPathLength = rootPath.length + (rootPath.endsWith('/') ? 0 : 1);
    return [validPath.slice(rootPathLength)];
}

function getFindValidPaths(searchableFileList: string[], rootPath: string) {
    return ([filePath, flags]: [string, { case: boolean, ext: boolean }]) => {
        if (flags.case || flags.ext) {
            return searchPaths(searchableFileList, flags, rootPath, filePath);
        } else {
            return checkPath(rootPath, filePath);
        }
    };
}

async function fetchGitIgnorePaths(rootPath: string) {
    const dotGitIgnoreFullPath = join(rootPath, GIT_IGNORE_FILE_NAME);
    const gitIgnorePaths = (await readFile(dotGitIgnoreFullPath, encoding)).split('\n')
        .filter(p => p && p.trim())
        .filter(p => ! /^\s*#/.test(p))
        .map(p => p.trim())
        .map(p => p.replace(/#.*$/, ''));
    return gitIgnorePaths;
}

async function fillSearchablePathList(rootPath: string, publishPath: string) {
    const rootPathLength = rootPath.length + (rootPath.endsWith('/') ? 0 : 1);
    // IGNORED_PATHS are also treated as globs
    const pathsToBeIgnored = uniq([
        ...IGNORED_PATHS,
        ...(await fetchGitIgnorePaths(rootPath)),
        publishPath.slice(rootPathLength)
    ].map(trimSlash)
    );

    const excludePathPatterns = pathsToBeIgnored.map(p => makeRe(p));

    // 'package-lock.json' will be used to create a file npm-shrinkwrap.json, see createNpmShrinkwrapFile.ts
    const includePathPatterns = [...npmPackageFiles, PACKAGE_LOCK_JSON_FILE_NAME].map(trimSlash).map(p => makeRe(p));

    const pathList = (await new Promise<klaw.Item[]>((resolve, reject) => {
        const items: klaw.Item[] = [];
        const filter = (filepath: string) => {
            const shortpath = filepath.slice(rootPathLength);
            const excluded = excludePathPatterns.some(r => r.test(shortpath));
            const included = includePathPatterns.some(r => r.test(shortpath));
             return !shortpath.includes('*') && (included || !excluded);
        }
        klaw(rootPath, { filter })
            .on('error', reject)
            .on('end', () => resolve(items))
            .on('data', item => items.push(item))
    }))
        .map(i => i.path);
    return pathList;
}

// ./publish is also ignored through ./.gitignore
export const copyEmbeddableFiles = async (rootPath: string, publishPath: string, extraEmbeddableFilePaths: Readonly<string[]>) => {
    const searchableFileList = await fillSearchablePathList(rootPath, publishPath);
    const findValidPaths = getFindValidPaths(searchableFileList, rootPath);
    const validPathGroups = Object.entries(embeddableFilePaths(extraEmbeddableFilePaths))
        .map(findValidPaths);
    validPathGroups
        .reduce((a, pl) => [...a, ...pl], [])
        .filter(p => p && p.trim())
        .forEach(p => {
            const validFullPath = join(rootPath, p);
            const destFullPath = join(publishPath, p);
            copySync(validFullPath, destFullPath, { overwrite: true });
        });
};