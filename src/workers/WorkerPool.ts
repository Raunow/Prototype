import { Worker, WorkerOptions } from 'worker_threads';
export type workerCallback = (err: any, result?: any) => void;

interface QueueItem {
	callback: workerCallback;
	getData: () => any;
}

export class WorkerPool {
	private options: WorkerOptions = { stderr: true, stdout: true, stdin: false };
	private queue: Array<QueueItem> = [];
	private workersByID: { [key: number]: Worker } = {};
	private activeWorkersByID: Array<boolean> = []

	public constructor(public workerPath: string, public numberOfThreads: number, public respawn: boolean = false) {
		if (this.numberOfThreads < 1) return null;

		this.init();
	}

	private init() {
		for (let i = 0; i < this.numberOfThreads; i++) {
			this.workersByID[i] = new Worker(this.workerPath, this.options);
			this.activeWorkersByID[i] = false;
		}
	}

	public run(getData: () => any, callback: workerCallback) {
		const availableWorkerID = this.getInactiveWorker();
		const queueItem: QueueItem = { getData, callback };

		if (availableWorkerID === NaN) {
			this.queue.push(queueItem);
			return null;
		}

		this.runWorker(availableWorkerID, queueItem);
	}

	private getInactiveWorker() {
		for (let i = 0; i < this.numberOfThreads; i++) {
			if (!this.activeWorkersByID[i])
				return i;
		}

		return NaN;
	}

	private async runWorker(workerID: number, queueItem: QueueItem) {
		this.activeWorkersByID[workerID] = true;
		const worker = this.workersByID[workerID];

		const messageCallback = (result: any) => {
			queueItem.callback(null, result);
			cleanUp();
		}
		const errorCallback = (error: any) => {
			queueItem.callback(error);
			cleanUp();
		}
		const exitCallback = (exitCode: number) => {
			queueItem.callback(new Error(`Task exited with error code: ${exitCode}`));
			if (this.respawn) {
				this.workersByID[workerID].unref();
				this.workersByID[workerID] = new Worker(this.workerPath, this.options);
				cleanUp();
			} else {
				this.workersByID
			}
		}

		const cleanUp = () => {
			worker.removeAllListeners('message');
			worker.removeAllListeners('error');
			worker.removeAllListeners('exit');

			this.activeWorkersByID[workerID] = false;
			if (!this.queue.length) return null;

			this.runWorker(workerID, this.queue.shift());
		}

		worker.once('message', messageCallback);
		worker.once('error', errorCallback);
		worker.once('exit', exitCallback);

		worker.postMessage(await queueItem.getData());
	}

	public stop() {
		for (let i = 0; i < this.numberOfThreads; i++) {
			const worker = this.workersByID[i];
			worker.removeAllListeners('message');
			worker.removeAllListeners('error');
			worker.removeAllListeners('exit');

			worker.unref();
		}
	}
}
