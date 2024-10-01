import { pipeline } from 'node:stream/promises';
import {
    createReadStream,
    createWriteStream,
} from 'node:fs';
import { createUnzip } from 'node:zlib';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileToUnZip = path.join(__dirname, 'files', 'archive.gz');
const targetFile = path.join(__dirname, 'files', 'fileToCompress.txt');

const decompress = async () => {
    await pipeline(
        createReadStream(fileToUnZip),
        createUnzip(),
        createWriteStream(targetFile)
    );
    console.log('Pipeline succeeded.');
};

await decompress();