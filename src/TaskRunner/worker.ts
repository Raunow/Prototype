import { readFile } from 'fs';
import { join } from 'path';
import { parentPort, workerData } from 'worker_threads';

class StateContainer {
	redis = 'Redis instance';
	get() {
		return this.redis;
	}
	set() {
		return true;
	}
}


const log = (...log: Array<any>) => parentPort.postMessage(log);
const state = new StateContainer();
const imports = workerData.import.map(lib => require(lib));

let path = join(__dirname, '../..', `/tasks/${workerData.file}.js`);
readFile(path, (err, buffer) => {
	if (err) {
		if (err.code === 'ENOENT') err.path = "Task doesn't exist";
		throw err;
	}
	let callable = new Function('log', 'state', 'data', ...workerData.import, buffer.toString())
	delete workerData.require;
	try {
		callable(log, state, workerData.data, ...imports);
	} catch (error) {
		log(error)
	}
});
