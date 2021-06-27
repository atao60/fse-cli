import { fetchOptionsFrom } from './config.js';
import { doit } from './wrapper.js';

export async function cli(args: string[]):Promise<void> {
    const { jobTag, options } = await fetchOptionsFrom(args);
    await doit(jobTag, options);
}
