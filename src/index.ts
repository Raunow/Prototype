import { createExpress } from './express/app';
import { WorkerPool } from './workers/WorkerPool';

export const workerPool = new WorkerPool(`${__dirname}\\workers\\worker.js`, 4, true);

async function main() {
	let app = createExpress(PORT);

	app.then(() => console.log(`Server listening on http://localhost:${PORT}/task/`));
}

let PORT = 80;
main();
