import { join } from 'path';

const tasksSubDir = 'tasks';

export async function doit (jobTag: string, options: {} ) {

    // dynamic import is fine here as `jobTag` validity has been checked already
    const modulePath = join(__dirname, tasksSubDir, jobTag);
    const module = await import(modulePath);

    module.job(options);
}
