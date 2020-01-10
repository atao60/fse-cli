import { join } from 'path';

export async function doit ({ jobTag, options }: { jobTag: string, options: {} }) {

    const modulePath = join(__dirname, 'tasks', jobTag);
    const module = await import(modulePath);

    module.job(options);
}
