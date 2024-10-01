import path from "path";
import {
  readdirSync,
  statSync,
  createReadStream,
  createWriteStream,
  rename
} from "fs";
import { fileURLToPath } from 'url';
import { printDirName, checkExisting } from "./helpers.js";

const { stdin, exit } = process;
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const userName = process.env.npm_config_username;

console.log(`Welcome to the File Manager, ${userName}!`);
printDirName(__dirname);

stdin.on('data', (data) => {
  const input = data.toString().trim();

  // exit from FM
  if (input === '.exit') {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!\n`);
    exit();
  }

  // move to parent directory
  if (input === 'up') {
    __dirname = path.join(__dirname, '..');
    printDirName(__dirname);
    return;
  }

  // show the list of files
  if (input === 'ls') {
    const files = readdirSync(__dirname);
    const tableData = [];

    files.forEach(file => {
      const filePath = path.join(__dirname, file);
      const stats = statSync(filePath);
      tableData.push({ Name: file, Type: stats.isFile() ? 'file' : 'directory' })
    });

    if (tableData.length === 0) {
      console.log(`Operation failed\n`);
      printDirName(__dirname);
      return;
    }

    console.table(tableData.sort())
    printDirName(__dirname);
    return;
  }

  // renaming
  if (input.startsWith('rn ')) {
    const args = input.substring(3).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed\n`);
      printDirName(__dirname);
      return;
    }

    const passedFilePath = args[0];
    const passedFileName = args[1];
    const newFilrName = path.join(__dirname, passedFileName);

    if (checkExisting(passedFilePath)) {
      rename(passedFilePath, newFilrName, () => {
        console.log('renamed !');
        printDirName(__dirname);
        return;
      });
    } else {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    return;
  }

  // adding file
  if (input.startsWith('add ')) {
    const fileName = input.substring(4);
    const filePath = path.join(__dirname, fileName);

    if (checkExisting(filePath)) {
      console.log(`Operation failed\n`);
      printDirName(__dirname);
      return;
    }

    createWriteStream(filePath);
    printDirName(__dirname);
    return;
  }

  // reading file
  if (input.startsWith('cat ')) {
    const fileName = input.substring(4);
    const filePath = path.join(__dirname, fileName);

    if (!checkExisting(filePath)) return;

    if (statSync(filePath).isFile()) {
      const readStream = createReadStream(filePath, 'utf-8');

      readStream.on('data', (chunk) => {
        console.log(chunk);
        console.log();
        printDirName(__dirname);
      });

      readStream.on('error', () => {
        console.error(`Operation failed`);
        console.log();
        printDirName(__dirname);
      });

      readStream.on('end', () => console.log());

      return;
    } else {
      console.log(`Operation failed\n`);
      printDirName(__dirname);
      return;
    }
  }

  // changing directory
  if (input.startsWith('cd ')) {
    const newDirectory = input.substring(3);
    const targetDirectory = path.join(__dirname, newDirectory);

    if (path.isAbsolute(newDirectory)) {
      if (!checkExisting(newDirectory)) return;
      __dirname = newDirectory;
    } else {
      if (!checkExisting(targetDirectory)) return;
      __dirname = targetDirectory;
    }

    printDirName(__dirname);
    return;
  }

  console.log(`Invalid input\n`);
})

stdin.on('end', () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!\n`);
});

process.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${userName}, goodbye!\n`);
  process.exit();
});

stdin.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});