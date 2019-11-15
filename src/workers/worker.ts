import { readFile } from 'fs';
import { join } from 'path';
import { parentPort } from 'worker_threads';


export interface TaskOptions {
	imports: Array<string>;
	filename: string;
	context: {};
}
class StateContainer {
	redis = 'Redis instance';
	get() {
		return this.redis;
	}
	set() {
		return true;
	}
}
function validateImports({ imports }: TaskOptions) {
	if (!imports) imports = [];

	imports = imports.filter((value) => !['fs', 'os'].includes(value))
	return imports.map(lib => require(lib));
}

let messages = [];
const log = (log: any) => messages.push(log);
const state = new StateContainer();

parentPort.on('message', (task: TaskOptions) => {
	let imports = validateImports(task);
	let path = join(__dirname, '../..', `/tasks/${task.filename}.js`);

	readFile(path, (err, buffer) => {
		if (err) {
			if (err.code === 'ENOENT') err.path = "Task doesn't exist";
			throw err;
		}

		let func = new Function('log', 'state', 'context', ...task.imports, buffer.toString());

		try {
			func(log, state, task.context, ...imports);
		} catch (error) {
			log(error);
		} finally {
			parentPort.postMessage(messages);
			messages = [];
		}
	});
});






