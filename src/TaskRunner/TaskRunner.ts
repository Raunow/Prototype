import { Worker } from 'worker_threads';


export async function startWorker(filename: string, workerData?: any) {
	return new Promise<any>(async (resolve, reject) => {
		const worker = new Worker(filename, { workerData });
		let messages = [];

		worker.on('message', (msg) => messages.push(msg));
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0) {
				reject({
					Error: `Worker terminated with exit code: ${code}`,
					messages: messages
				});
			} else {
				resolve(messages);
			}
		});
	});
}