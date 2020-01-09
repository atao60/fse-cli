import arg from 'arg';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import { basename, join } from 'path';
import { exit } from 'process';

import { copyDef, emptyDirDef, ensureDirDef, removeDef } from './tasks';

// TODO: load the list of files under ./tasks but index.ts then lazy load the required ones
//       create handle task file for the aliases
//       create at least one test per jobDef to check than even the bin list in package.json is up-to-date
//       do it even for the aliases
//       create a npm script in package.json to update the bin list in itself?
const jobDefs = {
    copy: copyDef,
    remove: removeDef,
    rimraf: { alias: 'remove' },
    ensureDir: ensureDirDef,
    mkdirs: { alias: 'ensureDir' },
    mkdirp: { alias: 'ensureDir' },
    emptyDir: emptyDirDef
}

// 'cli' must not be used as task name
const allowedScriptPrefixes = ['fse-cli', 'fse', ];  // longer first

function extractScriptAndTask(scriptPath: string) {

    const scriptName = basename(scriptPath);
    if (allowedScriptPrefixes.includes(scriptName)) {
        return [scriptPath];
    }
    
    const prefixes = allowedScriptPrefixes.map(p => p + '-')
    for(const p of prefixes) {
        if (scriptName.startsWith(p)) {
            const fromEnd = p.length - scriptName.length -1;
            return [scriptPath.slice(0, fromEnd), scriptName.slice(p.length)]
        }
    }
    return [scriptName];
}

function parseArgumentsIntoOptions (rawArgs: string[]) {

    const fullCommand = extractScriptAndTask(rawArgs[1]);
    const finalArgs = [rawArgs[0], ...fullCommand, ...rawArgs.splice(2)]
    const jobName = finalArgs[2];
    if (!jobName) {
        console.error("%s: No task specified", chalk.red.bold('ERROR'));
        exit(1);
    };
    if (!jobDefs[jobName]) {
        console.error("%s: Unknown task '" + jobName + "'", chalk.red.bold('ERROR'));
        exit(1);
    };

    const jobTag = jobDefs[jobName].alias || jobName;
    const argv = finalArgs.slice(3);
    const args = arg(
        jobDefs[jobTag].spec,
        { argv }
    )
    return { tag: jobTag, options: jobDefs[jobTag].options(args) };
}

async function promptForMissingOptions ({ tag, options: partialOptions }: { tag: string, options: {} }) {

    const questions = jobDefs[tag].questions(partialOptions);
    const answers = await prompt(questions);

    const options = Object.keys(answers).reduce((options, k) => {
        options[k] = partialOptions[k] || answers[k];
        return options;
    }, {...partialOptions});

    return { tag, options };

}

export async function fetchOptionsFrom (args: string[]) {
    const options = parseArgumentsIntoOptions(args);
    return await promptForMissingOptions(options);
}