import { writeFile, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'files', 'fresh.txt');

const create = async () => {
  if (existsSync(filePath)) {
    throw new Error('FS operation failed');
  }

  writeFile(filePath, 'I am fresh and young', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
};

await create();