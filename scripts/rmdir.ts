/**
 *   Required under Windows, as rimraf can't delete itself under folder ./node_modules
 */
import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { argv, exit } from 'process';

const folderPathList = argv.slice(2);

function folderDeepDelete(folderPath: string) {
    const subfiles = readdirSync(folderPath);
    subfiles.forEach(filename => {
        const curPath = join(folderPath, filename);
        const doit = lstatSync(curPath).isDirectory() ? folderDeepDelete : unlinkSync;
        doit(curPath);
    });
    rmdirSync(folderPath);
}

function deepDelete(folderPaths: string[]) {
    if (!folderPaths || folderPaths.length < 1) return;

    folderPaths.forEach(p => {
        if (!existsSync(p)) {
            return; // nothing to do...
        }
        
        if (!lstatSync(p).isDirectory()) {
            exit(1); // stop looping!
        }
        
        folderDeepDelete(p);
    });

}

deepDelete(folderPathList);

