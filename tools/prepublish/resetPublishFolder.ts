import { mkdir, remove } from 'fs-extra';

export const resetPublishFolder = async (publishFolderPath: string) => {
    await remove(publishFolderPath);
    await mkdir(publishFolderPath);
}