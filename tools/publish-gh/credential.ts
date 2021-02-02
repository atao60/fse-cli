import { spawn } from 'cross-spawn';
import { SpawnOptions } from 'child_process';

export interface Credential {
    protocol?: string;
    host?: string;
    username?: string;
    password?: string
}

export const getCredential = (url: string) => {

    const { protocol, username, host } = new URL(url);
    const gitquery = ([
        `protocol=${protocol.slice(0, -1)}`,
        `host=${host}`,
        `username=${username}`,
        '',
        ''
    ]).join('\n');

    const command = 'git';
    const commandArgs = ['credential', 'fill'];
    const options: SpawnOptions = {};

    const process = spawn(command, commandArgs, options);

    return new Promise<Credential>((resolve, reject) => {
        const output = [];

        process.stdout.on('data', data => {
            output.push(data.toString().trim());
        });

        process.stdin.write(gitquery);

        process.on('close', (code) => {
            if (code) {
                return reject(code);
            }

            const credential = output.join('\n').split('\n').reduce((acc, line) => {
                if (line.startsWith('username') || line.startsWith('password')) {
                    const [key, val] = line.split('=');
                    acc[key] = val;
                }
                return acc;
            }, {} as Credential);
            resolve(credential);
        })

        process.on('error', (err) => {
            reject(err);
        });

    });
};
