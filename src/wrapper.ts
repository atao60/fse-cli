import { fseCopy, fseEmptyDir, fseEnsureDir, fseRemove } from './tasks';

// TODO: load the list of files under ./tasks but index.ts then import them
const jobDefs = {
    copy: fseCopy,
    remove: fseRemove,
    ensureDir: fseEnsureDir,
    emptyDir: fseEmptyDir
}

export function doit ({ tag, options }: { tag: string, options: {} }) {
    const job = jobDefs[tag];
    job(options);
}