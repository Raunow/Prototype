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
function validateImports(imports: Array<string>) {
	if (!imports) imports = [];

	imports = imports.filter((value) => !['fs', 'os'].includes(value));
	return {
		imports,
		libs: imports.map(lib => require(lib))
	}
}

let results: any = {
	logs: [],
	return: null
};
const log = (log: any) => results.logs.push(log);
const state = new StateContainer();

parentPort.on('message', (task: TaskOptions) => {
	let { imports, libs } = validateImports(task.imports);
	let path = join(__dirname, '../..', `/tasks/${task.filename}.js`);

	readFile(path, async (err, buffer) => {
		if (err) {
			if (err.code === 'ENOENT') err.path = "Task doesn't exist";
			throw err;
		}

		let func = new Function('log', 'state', 'ctx', ...imports, buffer.toString());

		try {
			results.return = await func(log, state, task.context, ...libs);
		} catch (error) {
			results.error = error;
		} finally {
			parentPort.postMessage(results);
			results = {
				logs: [],
				return: null
			};
		}
	});
});


