import { createExpress } from './express/app';
import { startWorker } from './TaskRunner/TaskRunner';

async function main() {
	startWorker();

	let app = createExpress(PORT);

	app.then(() => console.log(`Server listening on http://localhost:${PORT}/task/`));
}

let PORT = 80;
main();
