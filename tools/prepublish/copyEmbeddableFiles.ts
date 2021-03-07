import { join } from 'path';
import { env } from 'process';
import { uniq } from 'lodash';
import { default as readdirp, EntryInfo } from 'readdirp';
import { copySync, pathExistsSync, readFile, remove } from 'fs-extra';
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
// Conversely, some files or directories are always ignored, see EARLY_IGNORED_PATHS below.
//
// To get uptodate list, see https://github.com/npm/npm-packlist/blob/master/index.js

const MANDATORY_FILES = Object.freeze({
    // README, CHANGES, ... can have any case and file extension:
    [PACKAGE_JSON_FILE_NAME]: { ignorecase: false, anyfileext: false },
    'readme': { ignorecase: true, anyfileext: true },
    'changes': { ignorecase: true, anyfileext: true },
    'changelog': { ignorecase: true, anyfileext: true },
    'history': { ignorecase: true, anyfileext: true },
    'license': { ignorecase: true, anyfileext: true },
    'licence': { ignorecase: true, anyfileext: true },
    'notice': { ignorecase: true, anyfileext: true },
    'copying': { ignorecase: true, anyfileext: true }
    // The file in the "main" field
});

const getPackageConfigMainField = () => {
    const npmPackageMain = trimSlash(env.npm_package_main);
    const mainField = { [npmPackageMain]: { ignorecase: false, anyfileext: false } };
    return mainField;
};

const getPackageConfigFilesField = () => {
    return getNotRelaxedPaths(npmPackageFiles);
};

const EARLY_IGNORED_PATHS = [
    '.npmignore',
    '.gitignore',
    '**/.git',
    '**/.svn',
    '**/.hg',
    '**/CVS',
    '**/.git/**',
    '**/.svn/**',
    '**/.hg/**',
    '**/CVS/**',
    '/.lock-wscript',
    '/.wafpickle-*',
    '/build/config.gypi',
    'npm-debug.log',
    '**/.npmrc',
    '.*.swp',
    '.DS_Store',
    '**/.DS_Store/**',
    '._*',
    '**/._*/**',
    '*.orig',
    `/${PACKAGE_LOCK_JSON_FILE_NAME}`, // (use shrinkwrap instead)
    '/yarn.lock',
    '/archived-packages/**',
    // with this project, no need to follow links in the root node_modules folder
    '**/node_modules',
    '**/node_modules/**'
    // All files containing a * character (incompatible with Windows)
];

const isBadNameForWindows = (file: string) => file.includes('*');

const LATE_IGNORED_GLOBS = [
    '**/*.map',
    '**/*.d.ts'
];

const npmPackageFiles = Object.entries(env)
    .filter(([k, _v]) => k.startsWith('npm_package_files_'))
    .map(([_k, v]) => v);

function getNotRelaxedPaths(paths: string[]) {
    const pathList = paths
        .map(trimSlash)
        .reduce((pathList, p) => {
            pathList[p] = { ignorecase: false, anyfileext: false };
            return pathList;
        }, {} as { [_: string]: { ignorecase: boolean, anyfileext: boolean } });
    return pathList;
}

function trimSlash(s: string) {
    const startingAt = s.startsWith('./') ? './'.length : 0;
    const endingAt = s.endsWith('/') ? -('/'.length) : undefined;
    return s.slice(startingAt, endingAt);
}

function embeddableFilePaths(extraFilePaths: Readonly<string[]>) {

    const embeddableFiles: { [_: string]: { ignorecase: boolean, anyfileext: boolean } } = {
        ...MANDATORY_FILES,
        // 'package-lock.json' required to create a file npm-shrinkwrap.json from it, see createNpmShrinkwrapFile.ts
        ...getNotRelaxedPaths([...extraFilePaths, PACKAGE_LOCK_JSON_FILE_NAME]),
        ...getPackageConfigMainField(),
        ...getPackageConfigFilesField()
    };

    return Object.freeze(embeddableFiles);
}

function searchPaths(searchableFileList: string[],
    flags: { ignorecase: boolean, anyfileext: boolean },
    searchedName: string) {
    const anyCase = flags.ignorecase ? 'i' : null;
    const anyFileExt = flags.anyfileext ? '(|\\.[^.]+$)' : '';
    const pattern = new RegExp(['^', searchedName, anyFileExt].join(''), anyCase);

    const validPathList = searchableFileList
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

// TODO why checking if exists only when !flags.ignorecase & !flags.anyfileext?
//      do we really need to check in any case?
function getFindValidPaths(searchableFileList: string[], rootPath: string) {
    return ([filePath, flags]: [string, { ignorecase: boolean, anyfileext: boolean }]) => {
        if (flags.ignorecase || flags.anyfileext) {
            return searchPaths(searchableFileList, flags, filePath);
        } else {
            return checkPath(rootPath, filePath); // TODO always return path as it? 
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
    // EARLY_IGNORED_PATHS are also treated as globs
    const excludingPatterns = uniq([
        ...EARLY_IGNORED_PATHS,
        ...(await fetchGitIgnorePaths(rootPath)),
        publishPath.slice(rootPathLength)
    ]
        .map(trimSlash)
    )
        .map(p => makeRe(p, { dot: true }));

    // 'package-lock.json' will be used to create a file npm-shrinkwrap.json, see createNpmShrinkwrapFile.ts
    // so we need to preserve it here
    const includingPatterns = [...npmPackageFiles, PACKAGE_LOCK_JSON_FILE_NAME]
        .map(trimSlash)
        .map(p => makeRe(p, { dot: true }));

    const fileFilter = function (entry: EntryInfo) {
        const { path: shortpath } = entry;
        const excluded = excludingPatterns.some(r => r.test(shortpath));
        const included = includingPatterns.some(r => r.test(shortpath));
        return !isBadNameForWindows(shortpath) && (included || !excluded);
    };

    const pathList: string[] = [];
    for await (const { path } of readdirp(rootPath, { fileFilter })) {
        pathList.push(path);
    }
    return pathList;
}

async function removeLateIgnoredPathList(publishPath: string) {
    const removingPatterns = LATE_IGNORED_GLOBS.map(trimSlash).map(p => makeRe(p, { dot: true }));

    const fileFilter = function (entry: EntryInfo) {
        const { path: shortpath } = entry;
        const toberemoved = removingPatterns.some(r => r.test(shortpath));
        return toberemoved;
    };

    for await (const { path } of readdirp(publishPath, { fileFilter })) {
        void remove(join(publishPath, path));
    }
}

// ./publish is also ignored through ./.gitignore
export const copyEmbeddableFiles = async (rootPath: string,
    publishPath: string,
    extraEmbeddableFilePaths: Readonly<string[]>): Promise<void> => {
    const searchableFileList = await fillSearchablePathList(rootPath, publishPath);
    const findValidPaths = getFindValidPaths(searchableFileList, rootPath);
    const embeddablePaths = embeddableFilePaths(extraEmbeddableFilePaths);
    const validPathGroups = Object.entries(embeddablePaths)
        .map(findValidPaths);
    const tobecopied = validPathGroups
        .reduce((a, pl) => [...a, ...pl], [])
        .filter(p => p && p.trim());

    tobecopied.forEach(p => {
        const validFullPath = join(rootPath, p);
        const destFullPath = join(publishPath, p);
        copySync(validFullPath, destFullPath, { overwrite: true });
    });

    await removeLateIgnoredPathList(publishPath);
};