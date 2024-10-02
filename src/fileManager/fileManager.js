import path from "path";
import { pipeline } from 'node:stream/promises';
import { createGzip, createUnzip } from 'node:zlib';
import { createHash } from 'crypto';
import {
  readdirSync,
  statSync,
  createReadStream,
  createWriteStream,
  rename,
  existsSync,
  unlink
} from "fs";
import * as os from "os";
import { printDirName } from "./helpers.js";

const { stdin, exit } = process;
let __dirname = os.homedir();
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
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    console.table(tableData.sort())
    printDirName(__dirname);
    return;
  }

  // Get EOL
  if (input === 'os --EOL') {
    os.EOL === '\n' ? console.log('EOL is LF\n') : console.log('EOL is CRLF\n');
    printDirName(__dirname);
    return;
  }

  // Get CPU architecture
  if (input === 'os --cpus') {
    const cpus = os.cpus();
    console.log(`Overall amount of CPUS: ${cpus.length}`);
    cpus.forEach((cpu, index) => {
      console.log(`CPU ${index + 1}: ${cpu.model} (${cpu.speed / 1000} GHz)`);
    });
    printDirName(__dirname);
    return;
  }

  // Get home directory
  if (input === 'os --homedir') {
    console.log(`Home directory: ${os.homedir()}\n`);
    printDirName(__dirname);
    return;
  }

  // Get current system user name
  if (input === 'os --username') {
    console.log(`Username: ${os.userInfo().username}`);
    printDirName(__dirname);
    return;
  }

  // Get CPU architecture
  if (input === 'os --architecture') {
    console.log(`Architecture: ${os.arch()}`);
    printDirName(__dirname);
    return;
  }

  // Compress file
  if (input.startsWith('compress ')) {
    const args = input.substring(9).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    const pathToFile = args[0];
    const pathToDestination = args[1];
    const fileName = path.basename(pathToFile).split('.')[0] + '.gz';

    if (!existsSync(pathToFile)) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    pipeline(
      createReadStream(pathToFile),
      createGzip(),
      createWriteStream(path.join(pathToDestination, fileName))
    ).then(() => {
      console.log('Pipeline succeeded.');
      printDirName(__dirname);
      return;
    }).catch(() => {
      console.log('Operation failed');
      printDirName(__dirname);
      return;
    });
    return;
  }

  // Decompress file
  if (input.startsWith('decompress ')) {
    const args = input.substring(11).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    const pathToFile = args[0];
    const pathToDestination = args[1];
    const fileName = path.basename(pathToFile).split('.')[0] + '.js';

    if (!existsSync(pathToFile)) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    pipeline(
      createReadStream(pathToFile),
      createUnzip(),
      createWriteStream(path.join(pathToDestination, fileName))
    ).then(() => {
      console.log('Pipeline succeeded.');
      printDirName(__dirname);
      return;
    }).catch(() => {
      console.log('Operation failed');
      printDirName(__dirname);
      return;
    });
    return;
  }

  // Calculate hash for file
  if (input.startsWith('hash ')) {
    const pathToFile = input.substring(5).trim();
    if (!existsSync(pathToFile)) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }
    const rStream = createReadStream(pathToFile);
    rStream.on('data', (chunk) => {
      const hash = createHash('sha256');
      hash.update(chunk);
      console.log(`Hash: ${hash.digest('hex')}`);
      printDirName(__dirname);
      return;
    });

    rStream.on('error', (err) => {
      console.error('Error reading file:', err);
      printDirName(__dirname);
      return;
    })

    printDirName(__dirname);
    return;
  }

  // copiyng file to a new directory
  if (input.startsWith('cp ')) {
    const args = input.substring(3).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    const path_to_file = args[0];
    const path_to_new_directory = args[1];

    if (existsSync(path_to_file)) {
      const rStream = createReadStream(path_to_file);
      const fileName = path.basename(path_to_file);
      rStream.on('data', (chunk) => {
        const wStream = createWriteStream(path.join(path_to_new_directory, fileName));
        wStream.write(chunk);
        wStream.end();
      })
      rStream.on('end', () => console.log('copied !\n'));
      rStream.on('error', () => console.log('Operation failed'));
      printDirName(__dirname);
      return;
    } else {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }
  }

  // moving file
  if (input.startsWith('mv ')) {
    const args = input.substring(3).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    const path_to_file = args[0];
    const path_to_new_directory = args[1];

    if (existsSync(path_to_file)) {
      const fileName = path.basename(path_to_file);
      const newFilePath = path.join(path_to_new_directory, fileName);
      rename(path_to_file, newFilePath, () => {
        console.log('moved !');
        printDirName(__dirname);
      });
      return;
    } else {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }
  }

  // deleting file
  if (input.startsWith('rm ')) {
    const filePath = input.substring(3).trim();

    if (existsSync(filePath)) {
      unlink(filePath, () => {
        console.log('deleted !');
        printDirName(__dirname);
        return;
      });
    } else {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }
  }

  // renaming
  if (input.startsWith('rn ')) {
    const args = input.substring(3).trim().split(' ');
    if (args.length !== 2) {
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }

    const passedFilePath = args[0];
    const passedFileName = args[1];
    const newFilrName = path.join(__dirname, passedFileName);

    if (existsSync(passedFilePath)) {
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
    const fileName = input.substring(4).trim();
    const filePath = path.join(__dirname, fileName);

    if (existsSync(filePath)) {
      printDirName(__dirname);
      return;
    } else {
      createWriteStream(filePath);
      printDirName(__dirname);
      return;
    }

  }

  // reading file
  if (input.startsWith('cat ')) {
    const fileName = input.substring(4).trim();
    const filePath = path.join(__dirname, fileName);

    if (!existsSync(filePath)) return;

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
      console.log(`Operation failed`);
      printDirName(__dirname);
      return;
    }
  }

  // changing directory
  if (input.startsWith('cd ')) {
    const newDirectory = input.substring(3).trim();
    const targetDirectory = path.join(__dirname, newDirectory);

    if (path.isAbsolute(newDirectory)) {
      if (!existsSync(newDirectory)) return;
      __dirname = newDirectory;
    } else {
      if (!existsSync(targetDirectory)) return;
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