import { existsSync } from 'fs';

export const printDirName = (dirname) => {
  console.log(`You are currently in ${dirname}\n`);
}

export const checkExisting = (directory) => {
  if (!existsSync(directory)) {
    console.log('Operation failed\n');
    return false
  };
  return true;
}