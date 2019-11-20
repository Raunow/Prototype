import { readFile } from 'fs';
import { join } from 'path';
import { parentPort } from 'worker_threads';


export interface TaskOptions {
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
function validateImports(imports: Array<string>) {
	if (!imports) imports = [];

	imports = imports.filter((value) => !['fs', 'os'].includes(value));
	return {
		imports,
		libs: imports.map(lib => require(lib))
	}
}

let results: any = {};
const log = (log: any) => {
	if (!results.logs) results.logs = [];
	results.logs.push(log);
};

const state = new StateContainer();

parentPort.on('message', (options: TaskOptions) => {
	let path = join(__dirname, '../..', `/tasks/${options.filename}.json`);
	readFile(path, async (err, buffer) => {
		try {
			if (err) {
				err.message = "Task does not exist";
				throw err;
			}

			const taskObject = JSON.parse(buffer.toString())
			let { imports, libs } = validateImports(taskObject.imports);

			let func = new Function('log', 'state', 'ctx', ...imports, taskObject.task);

			results.value = await func(log, state, options.context, ...libs);
		} catch (error) {
			results.error = error;
		} finally {
			parentPort.postMessage(results);
			results = {};
		}
	});
});


