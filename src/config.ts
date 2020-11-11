import arg from 'arg';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import { basename, join } from 'path';
import { exit } from 'process';

import { JobDef } from './job-def';

// !!! ⚠️ Don't forget to update the section 'bin' of package.json for any change of jobLinks ⚠️ !!!
const jobLinks = Object.freeze({
    copy: 'copy',
    remove: 'remove',
    rimraf: 'remove',
    ensureDir: 'ensureDir',
    mkdirs: 'ensureDir',
    mkdirp: 'ensureDir',
    emptyDir: 'emptyDir',
    ensureFile: 'ensureFile',
    touch: 'ensureFile',
    move: 'move',
    version: 'version',
    help: 'help'
} as {[key: string]: string});

// 'cli' must not be used as task name
const allowedScriptPrefixes = ['fse-cli', 'fse'];  // longer first

function extractScriptAndTask(scriptPath: string) {

    const scriptName = basename(scriptPath);
    if (allowedScriptPrefixes.includes(scriptName)) {
        return [scriptPath];
    }

    const prefixes = allowedScriptPrefixes.map(p => p + '-');
    for (const p of prefixes) {
        if (scriptName.startsWith(p)) {
            const fromEnd = p.length - scriptName.length - 1;
            return [scriptPath.slice(0, fromEnd), scriptName.slice(p.length)];
        }
    }
    return [scriptName];
}

async function parseArgumentsIntoOptions(rawArgs: string[]) {

    const fullCommand = extractScriptAndTask(rawArgs[1]);
    const finalArgs = [rawArgs[0], ...fullCommand, ...rawArgs.splice(2)];
    const jobName = finalArgs[2];
    if (!jobName) {
        console.error("%s: No task specified. Launch %s to get more help.",
            chalk.red.bold('ERROR'),
            chalk.yellowBright.bold('fse-cli help'));
        exit(1);
    }
    const jobTag = jobLinks[jobName];
    if (!jobTag) {
        console.error("%s: Unknown task '" + jobName + "'. Launch %s to get more help.",
            chalk.red.bold('ERROR'),
            chalk.yellowBright.bold('fse-cli help'));
        exit(1);
    }

    const argv = finalArgs.slice(3);
    const modulePath = join(__dirname, 'tasks', jobTag);
    const module = await import(modulePath);
    const jobDef = module.def;
    const args = arg(
        jobDef.spec,
        { argv }
    );
    return { jobDef, options: jobDef.options(args) };
}

interface JobOptions {
    jobTag: string;
    options: Record<string, unknown>;
}

async function promptForMissingOptions({ jobDef, options: partialOptions }:
    { jobDef: JobDef, options: Record<string, unknown> }): Promise<JobOptions> {

    const questions = jobDef.questions(partialOptions);
    const answers = await prompt<{[key: string]: any}>(questions); 

    const options = Object.keys(answers).reduce((options, k) => {
        options[k] = partialOptions[k] || answers[k];
        return options;
    }, { ...partialOptions });

    return { jobTag: jobDef.name, options };

}

export async function fetchOptionsFrom(args: string[]): Promise<JobOptions> {
    const data = await parseArgumentsIntoOptions(args);
    const options = await promptForMissingOptions(data);
    return options;
}
