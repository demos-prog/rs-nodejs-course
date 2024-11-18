import { cp, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sourceFolder = path.join(__dirname, 'files');
const targetFolder = path.join(__dirname, 'files_copy');

const copy = async () => {
  if(existsSync(targetFolder) || !existsSync(sourceFolder)) {
    throw new Error('FS operation failed');
  }

  cp(sourceFolder, targetFolder, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Copied!');
  })
};

await copy();
