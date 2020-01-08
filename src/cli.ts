import { fetchOptionsFrom } from './config';
import { doit } from './wrapper';

export async function cli(args: string[]) {
    const options = await fetchOptionsFrom(args);
    await doit(options);
}
