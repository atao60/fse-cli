import { join } from 'path';

const tasksSubDir = 'tasks';

export async function doit (jobTag: string, options: {} ) {

    const modulePath = join(__dirname, tasksSubDir, jobTag);
    const module = await import(modulePath);

    module.job(options);
}
