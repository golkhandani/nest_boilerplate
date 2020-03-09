import * as fs from 'fs-extra';

export async function fsMakeDirIfNotExists(path) {
    if (!fs.existsSync(path)) { fs.mkdirpSync(path); }
}
export async function fsRemoveFileIfExists(path: string) {
    if (fs.existsSync(path)) {
        fs.removeSync(path);
    }
}
