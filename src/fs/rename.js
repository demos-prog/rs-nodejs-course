import fs, { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceFile = path.join(__dirname, 'files', 'wrongFilename.txt');
const targetFile = path.join(__dirname, 'files', 'properFilename.md');

const rename = async () => {
  if (existsSync(targetFile) || !existsSync(sourceFile)) {
    throw new Error('FS operation failed');
  }

  fs.rename(sourceFile, targetFile, (err) => {
    if (err) throw err;
    console.log('Renamed');
  })
};

await rename();