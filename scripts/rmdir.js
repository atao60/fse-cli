/**
 *   Required under Windows, as <a href="https://www.npmjs.com/package/cpy-cli">rimraf</a> 
 *   can't delete itself under folder `./node_modules`.
 *   
 *   As this script is supposed to remove `node_modules`, don't use ts-node or any
 *   dependencies (not even graceful-fs... or extra-fs!), as it'd block the script, even under Linux.
 * 
 *   fs.rmdirSync supports a recursive options since Node.js 12.10.0: we can't use it
 *   as long as we stay with engines.node >=10.15.3
 */
import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { argv, env } from 'process';

const DEFAULT_PATH = './node_modules/';
const PATH_SEP = ':';

const pathList = argv.slice(2).filter(a => a && a.trim()).map(a=> a.trim());

if(pathList.length < 1 && env.PATHS && env.PATHS.trim()) {
    const extraPaths = env.EXTRA_PATHS.split(PATH_SEP).filter(a => a && a.trim()).map(a => a.trim());
    pathList.push(...extraPaths);
}

if(pathList.length < 1) {
    pathList.push(DEFAULT_PATH);
}

function deepDelete(paths) {
    paths.forEach(p => {
        if (!existsSync(p)) {
            console.log(`${p} doesn't exist: skip removing this file/folder.`);
        }
        else if (!lstatSync(p).isDirectory()) {
            unlinkSync(p);
        }
        else {
            const subPaths = readdirSync(p).map(subp => join(p, subp));
            deepDelete(subPaths);
            rmdirSync(p);
        }
    });
}

deepDelete(pathList);
