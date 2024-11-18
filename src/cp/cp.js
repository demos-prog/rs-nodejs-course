import { spawn } from 'child_process';
import path from "path";
import { fileURLToPath } from 'url';
const { stdin, stdout } = process;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, 'files', 'script.js');

const spawnChildProcess = async (args) => {
    const child = spawn('node', [file, ...args], {
        stdio: ['pipe', 'pipe', 'inherit']
    });

    stdin.pipe(child.stdin);
    child.stdout.pipe(stdout);
};

spawnChildProcess(['first', 'second', 'third']);