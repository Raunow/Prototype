import { Worker } from 'worker_threads';
import { TaskOptions } from './worker';

type WorkerCallback = (err: any, result?: any) => any;


export const workerPool: Array<Worker> = [];

export async function startWorker() {
	let options = {
		stderr: true,
		stdout: true,
		stdin: false
	}
	const worker = new Worker(`${__dirname}\\worker.js`, options);

	workerPool.push(worker);
}

export async function assignWorker(options: TaskOptions, cb: WorkerCallback) {
	let worker = workerPool[0];

	worker.postMessage(options);

	worker.once('message', cb.bind(null, null));
	worker.once('error', cb);

	worker.once('exit', (exitCode) => {
		if (exitCode === 0)
			return null;

		return cb(new Error(`Task terminated with exit code: ${exitCode}`))
	});
}