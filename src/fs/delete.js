import { existsSync, unlink } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceFile = path.join(__dirname, 'files', 'fileToRemove.txt');

const remove = async () => {
    if (!existsSync(sourceFile)){
        throw new Error('FS operation failed');
    }

    unlink(sourceFile, (err) => {
        if (err) throw err;
        console.log('deleted');
    });
};

await remove();