import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const tasksSubDir = 'tasks';

async function loadModule(jobTag: string) {
    // dynamic import is fine here as `jobTag` validity has been checked already
    const modulePath = join(__dirname, tasksSubDir, jobTag + '.js');
    const module: { job: (options: Record<string, unknown>) => Promise<void> } = await import(modulePath);
    return module;
}


export async function doit (jobTag: string, options: Record<string, unknown>): Promise<void> {
    const { job } = await loadModule(jobTag);
    await job(options);
}
