

import { dirname, join } from 'path';
import { argv } from 'process';
import { fileURLToPath } from 'url';

// No ESM wrapper and no exports map with fs-extra
import fse from 'fs-extra';
const { readFile, writeFile } = fse;

import { updateCopyrightYears } from './update.js';

const encoding = 'utf-8';
const __dirname = dirname(fileURLToPath(import.meta.url));

const defaultFilePath = '../../README.md';

const filepath = (() => {
    const path = argv[2] || defaultFilePath;
    return join(__dirname, path);
})();

const currentYear = new Date().getFullYear();

void (async () => {
    const content = await readFile(filepath, encoding);
    const { content: newcontent, updated } = updateCopyrightYears(content, currentYear);
    if (!updated) return;

    await writeFile(filepath, newcontent);
})();

