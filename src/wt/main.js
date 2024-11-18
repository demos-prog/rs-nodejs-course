import { Worker } from 'worker_threads';
import { cpus } from 'os';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, './worker.js');


const performCalculations = async () => {
    const numCPUs = cpus().length;
    const workers = [];
    const results = [];

    for (let i = 0; i < numCPUs; i++) {
        const n = 10 + i;
        workers[i] = new Worker(filePath, { workerData: { n } });

        workers[i].on('message', (result) => {
            results[i] = { status: 'resolved', data: result };
        });
        workers[i].on('error', () => {
            results[i] = { status: 'error', data: null };
        });
    }

    await Promise.all(workers.map(worker => new Promise(resolve => {
        worker.on('exit', resolve);
    })));

    console.log(results);
};

await performCalculations();