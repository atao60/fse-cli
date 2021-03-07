import { mkdir, remove } from 'fs-extra';

export const resetPublishFolder = async (publishFolderPath: string): Promise<void> => {
    await remove(publishFolderPath);
    await mkdir(publishFolderPath);
};