import { fseCopy, fseEmptyDir, fseEnsureDir, fseEnsureFile, fseMove, fseRemove } from './tasks';

// TODO: load the list of files under ./tasks but index.ts then lazy load the required ones
const jobDefs = {
    copy: fseCopy,
    remove: fseRemove,
    ensureDir: fseEnsureDir,
    emptyDir: fseEmptyDir,
    ensureFile: fseEnsureFile,
    move: fseMove
}

export function doit ({ tag, options }: { tag: string, options: {} }) {
    const job = jobDefs[tag];
    job(options);
}