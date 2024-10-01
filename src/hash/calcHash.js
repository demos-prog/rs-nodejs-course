// src/hash/calcHash.js
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'files', 'fileToCalculateHashFor.txt');

const calculateHash = async () => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('data', (data) => {
        hash.update(data);
    });

    stream.on('end', () => {
        console.log(hash.digest('hex'));
    });

    stream.on('error', (err) => {
        console.error('Error reading file:', err);
    });
};

await calculateHash();