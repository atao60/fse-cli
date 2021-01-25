import { join } from 'path';
import { readJson, writeJson } from 'fs-extra';
import { unset } from 'lodash';

const FIELDS_TO_BE_REMOVED = Object.freeze(['scripts', 'devDependencies', 'husky', 'config']);

export const shrinkPackageConfig = async (filePath: string, folderPath: string) => {
    const packageConfigPath = join(folderPath, filePath);
    const packageConfig = await readJson(packageConfigPath);
    FIELDS_TO_BE_REMOVED.forEach(s => unset(packageConfig, s));
    await writeJson(packageConfigPath, packageConfig, { spaces: 2 });
};