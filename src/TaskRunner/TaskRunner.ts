import { Worker } from 'worker_threads';

export async function startWorker(filename: string, workerData?: any) {
	workerData.file = filename;
	return new Promise<any>(async (resolve, reject) => {
		const worker = new Worker(`${__dirname}\\worker.js`, { workerData });
		let messages = [];

		worker.on('message', (msg) => messages.push(msg));
		worker.on('error', reject);
		worker.on('exit', (code) => {
			if (code !== 0) {
				reject({
					Error: `Task terminated with exit code: ${code}`,
					messages: messages
				});
			} else {
				resolve(messages);
			}
		});
	});
}