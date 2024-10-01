import { existsSync, readFile } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceFile = path.join(__dirname, 'files', 'fileToRead.txt');

const read = async () => {
    if (!existsSync(sourceFile)) {
        throw new Error('FS operation failed');
    }

    readFile(sourceFile, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
    })
};

await read();