import { existsSync, readdir } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceFolder = path.join(__dirname, 'files');

const list = async () => {
    if (!existsSync(sourceFolder)){
        throw new Error('FS operation failed')
    }

    readdir(sourceFolder, (err, files) => {
        if (err) throw err;
        files.forEach(file => console.log(file));
    })
};

await list();