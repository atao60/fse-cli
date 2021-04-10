import { fetchOptionsFrom } from './config';
import { doit } from './wrapper';

export async function cli(args: string[]):Promise<void> {
    const { jobTag, options } = await fetchOptionsFrom(args);
    await doit(jobTag, options);
}
