import { createReadStream } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, 'files', 'fileToRead.txt');

const read = async () => {
    const stream = createReadStream(file, 'utf-8');
    stream.on('data', (chunk) => process.stdout.write(chunk + '\n'));
    stream.on('end', () => console.log('Finished reading file.'));
    stream.on('error', (err) => console.error('Error reading file:', err));
};

await read();