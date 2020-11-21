/**
 *   Required under Windows, as <a href="https://www.npmjs.com/package/cpy-cli">rimraf</a> 
 *   can't delete itself under folder `./node_modules`.
 *   
 *   As this script is supposed to remove `node_modules`, don't use ts-node or any
 *   dependencies (not even graceful-fs... or extra-fs!), as it'd block the script, even under Linux.
 */
import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { argv, env, exit } from 'process';

const pathList = [...argv.slice(2)] || [env.PATHS] || ['node_modules/'];

if (!pathList || pathList.length < 1) {
    console.log("File/folder list is empty or not provided: nothing's done.");
    exit(1);
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
