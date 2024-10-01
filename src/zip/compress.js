import { pipeline } from 'node:stream/promises';
import {
    createReadStream,
    createWriteStream,
} from 'node:fs';
import { createGzip } from 'node:zlib';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileToCompress = path.join(__dirname, 'files', 'fileToCompress.txt');
const targetFile = path.join(__dirname, 'files', 'archive.gz');

const compress = async () => {
    await pipeline(
        createReadStream(fileToCompress),
        createGzip(),
        createWriteStream(targetFile)
    );
    console.log('Pipeline succeeded.');
};

await compress();