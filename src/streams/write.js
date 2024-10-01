import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, 'files', 'fileToWrite.txt');

const write = async () => {
    const stream = createWriteStream(file, 'utf-8'); 
    process.stdin.pipe(stream);
    stream.on('finish', () => console.log('Finished writing file.'));
};

await write();