import { Worker } from 'worker_threads';

let worker: Worker;



export async function startWorker() {
	worker = new Worker(`${__dirname}\\test.js`);

	let test = 12;

	const cb = (code, temp) => {
		console.log(code, temp, worker);
	}

	worker.on('exit', (code) => cb(code, test));
}
