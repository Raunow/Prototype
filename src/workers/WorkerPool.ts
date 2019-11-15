import { Worker, WorkerOptions } from 'worker_threads';
type QueueCallback<N> = (err: any, result?: N) => void;
export type workerCallback<N> = (err: any, result?: N) => N;

interface QueueItem<T, N> {
	callback: QueueCallback<N>;
	getData: () => T;
}

export class WorkerPool<T, N> {
	private options: WorkerOptions = { stderr: true, stdout: true, stdin: false };
	private queue: Array<QueueItem<T, N>> = [];
	private workersByID: { [key: number]: Worker } = {};
	private activeWorkersByID: Array<boolean> = []

	public constructor(public workerPath: string, public numberOfThreads: number, public respawn: boolean = false) {
		if (this.numberOfThreads < 1) return null;

		this.init()
	}

	private init() {
		for (let i = 0; i < this.numberOfThreads; i++) {
			this.workersByID[i] = new Worker(this.workerPath, this.options);
			this.activeWorkersByID[i] = false;
		}
	}

	public run(getData: () => T, cb: workerCallback<N>) {
		const availableWorkerID = this.getInactiveWorker();

		const queueItem: QueueItem<T, N> = {
			getData,
			callback: (error, result) => {
				if (error) cb(error);

				return cb(null, result);
			}
		};

		if (availableWorkerID === -1) {
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

		return -1;
	}

	private async runWorker(workerID: number, queueItem: QueueItem<T, N>) {
		this.activeWorkersByID[workerID] = true;
		const worker = this.workersByID[workerID];

		const messageCallback = (result: N) => {
			queueItem.callback(null, result);
			cleanUp();
		}
		const errorCallback = (error: any) => {
			queueItem.callback(error);
			cleanUp();
		}
		const exitCallback = (exitCode: number) => {
			queueItem.callback(new Error(`Task exited with error code: ${exitCode}`));
			cleanUp();
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
}
